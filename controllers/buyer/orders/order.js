const { where } = require("sequelize");
const db = require("../../../models");

const stripe = require('stripe')('sk_test_51QIWKhE4GGZ5chP8OWemKrCcggYpyQlrqfekZRjreRwPQNNxb20ce454NeecqBX78TDLeTglY8LY7Dea0aQ8tNZG00ArxTm0Lx'); // Replace with your Stripe secret key

const getOrder = async (req, res) => {
  try {
    const userId = String(req.user.id);
    const orders = await db.Order.findAll({
      where: {
        user_id: userId,
      },
    });
    return res.status(200).send(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).send({
      message: 'Error fetching orders',
      error: error.message,
    });
  }
};

const addOrder = async (req, res) => {
  try {
    // New unified payload (also supports legacy)
    const {
      customerInfo,
      shippingInfo,
      paymentMethod,
      cartItems: directCartItems,
      totalAmount,
      discountAmount,
      transactionId,
      transactionScreenshot,
      amount,
      paymentMethodId,
      phoneNumber,
      country,
      state,
      zipCode,
      address
    } = req.body;

    const userId = String(req.user.id);

    // Decide source of cart items: direct (from body) or user's cart in DB
    let lineItems = [];
    let calculatedTotal = 0;

    if (Array.isArray(directCartItems) && directCartItems.length > 0) {
      // Use provided items (direct checkout)
      lineItems = directCartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
        image: item.image || null,
        selectedColor: item.selectedColor || null,
        selectedSize: item.selectedSize || null
      }));
      calculatedTotal = lineItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    } else {
      // Fallback: use items from user's cart
      const cartItems = await db.Cart.findAll({
        where: { user_id: userId },
        include: [{ model: db.product, as: 'product' }]
      });

      if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ success: false, message: "Please add items to cart first" });
      }

      lineItems = cartItems.map((item) => ({
        id: item.product?.id || item.product_id,
        name: item.product?.name || 'Product',
        price: Number(item.product?.price ?? 0),
        quantity: Number(item.quantity) || 1,
        image: (item.product?.image && item.product.image[0]) ? item.product.image[0] : null,
        // Variants are not stored in cart currently
        selectedColor: null,
        selectedSize: null
      }));

      calculatedTotal = cartItems.reduce((sum, item) => sum + Number(item.total || 0), 0);
    }

    // Prefer client-provided totalAmount if valid, else use calculated
    const orderTotal = (typeof totalAmount === 'number' && !isNaN(totalAmount)) ? totalAmount : calculatedTotal;

    // Create shipment details
    const shipment = await db.shipmentDetail.create({
      user_id: userId,
      country: shippingInfo?.country || country || 'Pakistan',
      state: shippingInfo?.state || state || 'N/A',
      zip_code: shippingInfo?.zipCode || zipCode || '00000',
      address: shippingInfo?.address || address || 'N/A'
    });

    let paymentRecord = null;

    // Handle different payment methods
    if (paymentMethod === 'stripe' || paymentMethod === 'Stripe') {
      const stripeAmount = Math.round((orderTotal || amount || 0) * 100);
      const pmId = paymentMethodId;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: stripeAmount,
        currency: 'usd',
        payment_method: pmId,
        confirm: true,
        automatic_payment_methods: { enabled: true },
      });

      paymentRecord = await db.Payment.create({
        user_id: userId,
        amount: orderTotal,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        payment_method: 'stripe',
        stripe_payment_id: paymentIntent.id,
        stripe_customer_id: paymentIntent.customer,
      });
    } else if (paymentMethod === 'advance_payment') {
      // Manual/advance payment with transaction info
      paymentRecord = await db.Payment.create({
        user_id: userId,
        amount: orderTotal,
        currency: 'PKR',
        status: 'pending',
        payment_method: 'advance_payment',
        transaction_id: transactionId || null,
        transaction_screenshot: transactionScreenshot || null,
      });
    } else {
      // cash_on_delivery or unspecified
      // No payment record needed, but keep method in order
    }

    // Create order
    const order = await db.Order.create({
      status: 'pending',
      user_id: userId,
      shipment_id: shipment.id,
      payment_id: paymentRecord ? paymentRecord.id : null,
      order_items: lineItems.map((item) => JSON.stringify(item)),
      total: orderTotal,
      payment_method: paymentMethod || 'cash_on_delivery',
    });

    // If items came from cart, clear the cart after placing the order
    if (!(Array.isArray(directCartItems) && directCartItems.length > 0)) {
      await db.Cart.destroy({ where: { user_id: userId } });
    }

    // Respond with success (align with guest order response shape)
    return res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: {
        id: order.id,
        status: order.status,
        total: order.total,
        payment_method: order.payment_method
      },
      paymentRecord: paymentRecord ? {
        id: paymentRecord.id,
        status: paymentRecord.status,
        amount: paymentRecord.amount
      } : null
    });
  } catch (error) {
    console.error("Error in addOrder:", error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while processing your order',
      error: error.message,
    });
  }
};

module.exports = { addOrder, getOrder };
