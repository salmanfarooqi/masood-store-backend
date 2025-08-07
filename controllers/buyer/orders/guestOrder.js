const db = require("../../../models");
const stripe = require('stripe')('sk_test_51QIWKhE4GGZ5chP8OWemKrCcggYpyQlrqfekZRjreRwPQNNxb20ce454NeecqBX78TDLeTglY8LY7Dea0aQ8tNZG00ArxTm0Lx');

const createGuestOrder = async (req, res) => {
  try {
    const {
      customerInfo,
      shippingInfo,
      paymentMethod,
      cartItems,
      totalAmount,
      transactionId,
      transactionScreenshot
    } = req.body;

    // Validate required fields
    if (!customerInfo || !shippingInfo || !paymentMethod || !cartItems || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Calculate total from cart items
    const calculatedTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Create shipment details with default values for optional fields
    const shipment = await db.shipmentDetail.create({
      user_id: null, // Guest user
      country: shippingInfo.country || 'Pakistan', // Default to Pakistan
      state: shippingInfo.state || shippingInfo.city || 'N/A', // Use city as state or default
      zip_code: shippingInfo.zipCode || '00000', // Default zip code
      address: shippingInfo.address
    });

    let paymentRecord = null;

    // Handle different payment methods
    if (paymentMethod === 'cash_on_delivery') {
      // Create payment record for COD
      paymentRecord = await db.Payment.create({
        user_id: null,
        amount: calculatedTotal,
        currency: 'USD',
        status: 'pending',
        payment_method: 'cash_on_delivery',
        guest_info: customerInfo
      });
    } else if (paymentMethod === 'advance_payment') {
      // Validate advance payment fields
      if (!transactionId || !transactionScreenshot) {
        return res.status(400).json({
          success: false,
          message: 'Transaction ID and screenshot are required for advance payment'
        });
      }

      // Create payment record for advance payment
      paymentRecord = await db.Payment.create({
        user_id: null,
        amount: calculatedTotal,
        currency: 'USD',
        status: 'pending_verification',
        payment_method: 'advance_payment',
        transaction_id: transactionId,
        transaction_screenshot: transactionScreenshot,
        guest_info: customerInfo
      });
    } else if (paymentMethod === 'stripe') {
      // Handle Stripe payment (existing functionality)
      const { paymentMethodId } = req.body;
      if (!paymentMethodId) {
        return res.status(400).json({
          success: false,
          message: 'Payment method ID is required for Stripe payment'
        });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: calculatedTotal * 100, // Stripe expects amount in cents
        currency: 'usd',
        payment_method: paymentMethodId,
        confirm: true,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      paymentRecord = await db.Payment.create({
        user_id: null,
        amount: calculatedTotal,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        payment_method: 'stripe',
        stripe_payment_id: paymentIntent.id,
        stripe_customer_id: paymentIntent.customer,
        guest_info: customerInfo
      });
    }

    // Create order
    const order = await db.Order.create({
      status: "pending",
      user_id: null, // Guest user
      shipment_id: shipment.id,
      payment_id: paymentRecord ? paymentRecord.id : null,
      order_items: cartItems.map((item) => JSON.stringify(item)), // Store cart items as JSON strings
      total: calculatedTotal,
      payment_method: paymentMethod,
      guest_info: customerInfo
    });

    // Respond with success
    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
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
    console.error("Error creating guest order:", error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while processing your order',
      error: error.message,
    });
  }
};

const getGuestOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await db.Order.findOne({
      where: { id: orderId },
      include: [
        {
          model: db.Payment,
          as: 'payment'
        },
        {
          model: db.shipmentDetail,
          as: 'shipment'
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    return res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error("Error fetching guest order:", error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message,
    });
  }
};

const getGuestOrdersByEmail = async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Email or phone number is required'
      });
    }

    let whereClause = {
      user_id: null // Only guest orders
    };

    // Build the where clause for guest_info
    if (email && phoneNumber) {
      whereClause = {
        ...whereClause,
        guest_info: {
          [db.Sequelize.Op.or]: [
            { email: email },
            { phoneNumber: phoneNumber }
          ]
        }
      };
    } else if (email) {
      whereClause = {
        ...whereClause,
        guest_info: {
          email: email
        }
      };
    } else if (phoneNumber) {
      whereClause = {
        ...whereClause,
        guest_info: {
          phoneNumber: phoneNumber
        }
      };
    }

    const orders = await db.Order.findAll({
      where: whereClause,
      include: [
        {
          model: db.Payment,
          as: 'payment'
        },
        {
          model: db.shipmentDetail,
          as: 'shipment'
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      orders: orders
    });
  } catch (error) {
    console.error("Error fetching guest orders:", error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message,
    });
  }
};

module.exports = { createGuestOrder, getGuestOrder, getGuestOrdersByEmail };