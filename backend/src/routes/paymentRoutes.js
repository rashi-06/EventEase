import express from "express";
import { createPayment, getUserPayments } from "../controller/paymentController.js";
import protect  from "../middleware/authMiddleware.js";

const router = express.Router();


router.post('/create-payment-intent', protect, createPaymentIntent);

export default router;
