import express from "express";
import {
  createPaymentIntent,
  verifyPayment,
} from "../controller/paymentController.js";
import protect  from "../middleware/authMiddleware.js";

const router = express.Router();


router.post('/create-payment-intent', protect, createPaymentIntent);
router.get("/verify", protect, verifyPayment);

export default router;
