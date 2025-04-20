import express from "express";
import {
  subscribeUser,
  getUserSubscription,
  cancelSubscription,
} from "../controllers/subscriptionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/", protect, subscribeUser);

router.get("/", protect, getUserSubscription);

router.delete("/", protect, cancelSubscription);

export default router;
