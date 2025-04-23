import express from "express";
import {
  createBooking,
  getUserBooking,
  cancelBooking,
} from "../controller/bookingController.js";
import  protect  from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/", protect, createBooking);

router.get("/myBookings", protect, getUserBooking);

router.put("/cancel/:id", protect, cancelBooking);

export default router;
