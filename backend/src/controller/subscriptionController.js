import Subscription from "../models/Subscription.js";

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
