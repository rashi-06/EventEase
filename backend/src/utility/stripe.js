import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Set this in your .env
export default stripe;
