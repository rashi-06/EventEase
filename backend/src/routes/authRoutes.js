import express from "express";
import { body } from "express-validator";
import passport from "passport";

import {
  registerUser,
  loginUser,
  googleOAuthCallback,
  logoutUser,
} from "../controller/authController.js";

const router = express.Router();

// Register Route
router.post(
  "/register",
  [
    body("userName").notEmpty().withMessage("User name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  registerUser
);

// Login Route
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  loginUser
);

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  googleOAuthCallback
);

// Logout Route
router.get("/logout", logoutUser);

export default router;
