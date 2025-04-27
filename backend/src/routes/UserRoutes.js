import express from "express";
import { getUserProfile, updateUserProfile, deleteUser } from "../controller/UserController.js";
import protect from "../middleware/authMiddleware.js";


const router = express.Router();


router.get("/profile", protect, getUserProfile);

router.put("/profile", protect, updateUserProfile);

router.delete("/delete", protect, deleteUser);

export default router;
