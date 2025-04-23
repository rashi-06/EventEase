import express from "express";
import {
  subscribeUser,
  getUserSubscription,
  cancelSubscription,
  purchaseSubscription,
  getSubscriptionStatus
} from "../controller/subscriptionController.js";
import protect  from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/", protect, subscribeUser);

router.get("/", protect, getUserSubscription);

router.delete("/", protect, cancelSubscription);

router.post("/purchase", protect, purchaseSubscription);

router.get("/status", protect, getSubscriptionStatus);

export default router;
