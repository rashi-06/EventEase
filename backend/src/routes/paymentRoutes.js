import express from "express";
import { createPayment, getUserPayments } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/", protect, createPayment);


router.get("/", protect, getUserPayments);

export default router;
