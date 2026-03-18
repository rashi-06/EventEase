import stripe from "../utility/stripe.js";
import Booking from "../model/Booking.js";
import Payment from "../model/Payment.js";

export const createPaymentIntent = async (req, res) => {
  const { amount, currency = "inr", bookingId } = req.body;

  try {
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe uses smallest currency unit (e.g. paisa)
      currency,
      payment_method_types: ["card", "upi"], // Enable UPI and card
      metadata: {
        userId: req.body.userId.toString(), // Optional, useful for tracking
        bookingId: bookingId?.toString() ?? "",
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Stripe Payment Error:", error.message);
    res.status(500).json({
      message: "Payment Intent creation failed",
      error: error.message,
    });
  }
};

export const verifyPayment = async (req, res) => {
  const { paymentId, bookingId, status } = req.query;

  try {
    if (!paymentId || !bookingId) {
      return res.status(400).json({ message: "Payment id and booking id are required." });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    if (!booking.user.equals(req.body.userId)) {
      return res.status(403).json({ message: "Not authorized to verify this payment." });
    }

    let paymentStatus = typeof status === "string" ? status : "";
    let paymentIntent = null;

    if (!paymentStatus && String(paymentId).startsWith("pi_")) {
      paymentIntent = await stripe.paymentIntents.retrieve(String(paymentId));
      paymentStatus = paymentIntent.status;
    }

    const isSuccess = ["succeeded", "success"].includes(paymentStatus.toLowerCase());

    booking.paymentId = String(paymentId);
    booking.paymentStatus = isSuccess ? "paid" : "failed";
    booking.status = isSuccess ? "confirmed" : "pending";
    await booking.save();

    await Payment.findOneAndUpdate(
      { booking: booking._id },
      {
        user: booking.user,
        booking: booking._id,
        amount: booking.totalAmount,
        currency: "INR",
        paymentMethod: "other",
        status: isSuccess ? "success" : "failed",
        paymentGatewayResponse: paymentIntent ?? { status: paymentStatus },
        transactionId: String(paymentId),
        paymentIntentId: String(paymentId),
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      status: isSuccess ? "success" : "failed",
      message: isSuccess
        ? "Payment verified and booking confirmed."
        : "Payment verification failed.",
    });
  } catch (error) {
    console.error("Payment verify error:", error.message);
    return res.status(500).json({
      status: "error",
      message: "Failed to verify payment.",
      error: error.message,
    });
  }
};
