import express from "express";
import { createPayment, getUserPayments } from "../controller/paymentController.js";
import protect  from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/", protect, createPayment);


router.get("/", protect, getUserPayments);

export default router;
