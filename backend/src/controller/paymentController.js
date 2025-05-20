import stripe from '../utils/stripe.js';

export const createPaymentIntent = async (req, res) => {
  const { amount, currency = 'inr' } = req.body;

  try {
    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe uses smallest currency unit (e.g. paisa)
      currency,
      payment_method_types: ['card', 'upi'], // Enable UPI and card
      metadata: {
        userId: req.body.userId.toString(), // Optional, useful for tracking
      },
    });

    // Return client secret to frontend
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Stripe Payment Error:', error.message);
    res.status(500).json({
      message: 'Payment Intent creation failed',
      error: error.message,
    });
  }
};
