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
    const { phoneNumber, country, state, zipCode, paymentMethod, amount, paymentMethodId } = req.body;
    const userId = String(req.user.id);

    // Fetch cart items
    const cartItems = await db.Cart.findAll({
      where: {
        user_id: userId,
      },
    });

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).send("Please add items to cart first");
    }

    // Calculate total amount from cart items
    const totalAmount = cartItems.reduce((sum, item) => sum + item.total, 0); // Assuming `total` is the price

    // Create shipment details
    const shipment = await db.shipmentDetail.create({
      user_id: userId,
      country: country,
      state: state,
      zip_code: zipCode,
    });

    let paymentRecord = null;

    if (paymentMethod === 'Stripe') {
      // Handle Stripe payment
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Stripe expects amount in cents
        currency: 'usd',
        payment_method: paymentMethodId,
        confirm: true,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      // Save payment details to the Payment table
      paymentRecord = await db.Payment.create({
        user_id: userId,
        amount: amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        stripe_payment_id: paymentIntent.id,
        stripe_customer_id: paymentIntent.customer,
      });
    }

    // Create order
    const order = await db.Order.create({
      status: "pending",
      user_id: userId,
      shipment_id: shipment.id,
      order_items: cartItems.map((item) => item.id), // Assuming you want to store cart item IDs
      total: totalAmount, // Using the total calculated above
      payment_method: paymentMethod,
    });

    // Clear the cart after placing the order
    await db.Cart.destroy({
      where: {
        user_id: userId,
      },
    });

    // Respond with success
    return res.status(201).json({
      message: "Order placed successfully",
      order,
      paymentRecord, // Only if Stripe payment was made
    });
  } catch (error) {
    console.error("Error in addOrder:", error);
    return res.status(500).json({
      message: 'An error occurred while processing your order',
      error: error.message,
    });
  }
};

module.exports = { addOrder, getOrder };
