import Booking from "../model/Booking.js"
import Payment from "../model/Payment.js"

export const createPayment = async (req, res) => {
  try {
    const { bookingId, amount, paymentMethod } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Create payment record
    const payment = await Payment.create({
      user: req.user._id,
      booking: bookingId,
      amount,
      paymentMethod,
      status: "Completed", // assume immediate for now; can extend with payment gateway
    });

    // Update booking with payment info
    booking.paymentStatus = "Paid";
    booking.payment = payment._id;
    await booking.save();

    res.status(201).json({ message: "Payment successful", payment });
  } catch (error) {
    res.status(500).json({ message: "Payment failed", error: error.message });
  }
};

// Get all payments for logged-in user
export const getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id }).populate({
      path: "booking",
      populate: { path: "event" }
    });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payments", error: error.message });
  }
};
