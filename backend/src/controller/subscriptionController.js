import Subscription from "../model/Subscription.js";

export const subscribeUser = async (req, res) => {
  try {
    const existingSub = await Subscription.findOne({ user: req.user._id });

    if (existingSub && existingSub.status === "active") {
      return res.status(400).json({ message: "You already have an active subscription." });
    }

    const subscription = new Subscription({
      user: req.user._id,
      planType: "Standard", // fixed plan
      price: 499, // fixed price
      status: "active",
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    await subscription.save();
    res.status(201).json({ message: "Subscription activated!", subscription });
  } catch (error) {
    res.status(500).json({ message: "Subscription failed", error: error.message });
  }
};

export const getUserSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ user: req.user._id });
    if (!subscription) {
      return res.status(404).json({ message: "No subscription found" });
    }
    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json({ message: "Error fetching subscription", error: error.message });
  }
};

export const cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ user: req.user._id });

    if (!subscription || subscription.status === "cancelled") {
      return res.status(400).json({ message: "No active subscription to cancel." });
    }

    subscription.status = "cancelled";
    subscription.endDate = new Date(); // effective immediately
    await subscription.save();

    res.status(200).json({ message: "Subscription cancelled", subscription });
  } catch (error) {
    res.status(500).json({ message: "Cancellation failed", error: error.message });
  }
};


export const purchaseSubscription = async (req, res) => {
  try {
    const userId = req.body.userId;
    const { amount, paymentId } = req.body;

    // Mock: You can integrate with Stripe or Razorpay here
    if (!paymentId || !amount) {
      return res.status(400).json({ message: "Payment failed or invalid data." });
    }

    // Create payment record
    const payment = await Payment.create({
      user: userId,
      amount,
      status: "success",
      paymentGateway: "custom", // or "stripe", "razorpay"
      transactionId: paymentId,
    });

    // Set subscription for 1 year (or whatever duration)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(startDate.getFullYear() + 1);

    const subscription = await Subscription.findOneAndUpdate(
      { user: userId },
      {
        user: userId,
        startDate,
        endDate,
        isActive: true,
        plan: "standard",
        payment: payment._id,
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      message: "Subscription successful.",
      subscription,
    });
  } catch (error) {
    console.error("Subscription error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

export const getSubscriptionStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    const subscription = await Subscription.findOne({ user: userId }).populate("payment");

    if (!subscription) {
      return res.status(404).json({ message: "No subscription found" });
    }

    const now = new Date();
    const isActive = subscription.endDate > now;

    res.status(200).json({
      subscription,
      isActive,
    });
  } catch (error) {
    console.error("Error getting subscription:", error);
    res.status(500).json({ message: "Server error." });
  }
};