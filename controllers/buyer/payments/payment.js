const db = require('../../../models');

const stripe = require('stripe')('sk_test_51QIWKhE4GGZ5chP8OWemKrCcggYpyQlrqfekZRjreRwPQNNxb20ce454NeecqBX78TDLeTglY8LY7Dea0aQ8tNZG00ArxTm0Lx'); // Replace with your Stripe secret key

const createOrder = async (req, res) => {
  const { amount, paymentMethodId } = req.body; 

  try {

    const userId = req.user.id;  
    const user = await db.User.findByPk(userId); 

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Confirm payment using Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // The amount in cents (e.g., 5000 for $50.00)
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true, // Automatically confirm the payment
      automatic_payment_methods: {
        enabled: true,  // Enable automatic payment methods
        allow_redirects: 'never',  // Disallow any redirects (no authentication steps required)
      },
    });

    const paymentRecord = await db.Payment.create({
      user_id: userId, // Storing user ID
     // You need to pass the order ID from the request body
      amount: amount / 100, // Convert amount back to dollars (or your currency base unit)
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      stripe_payment_id: paymentIntent.id, // Stripe Payment Intent ID
      stripe_customer_id: paymentIntent.customer, // Stripe Customer ID, if available
    });
    
    console.log("Recipt",paymentRecord)

    return res.status(200).json({
      success: true,
      message: 'Payment successful',
     
      paymentIntent,
      paymentRecord
    });
  } catch (error) {
    console.error('Error in payment: ', error);

    return res.status(500).json({
      success: false,
      message: 'Payment failed',
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
};
