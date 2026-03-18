import express from "express";
import { getUserProfile, updateUserProfile, deleteUser } from "../controller/userController.js";
import protect from "../middleware/authMiddleware.js";


const router = express.Router();


router.get("/profile", protect, getUserProfile);

router.put("/profile", protect, updateUserProfile);

router.delete("/delete", protect, deleteUser);

export default router;
