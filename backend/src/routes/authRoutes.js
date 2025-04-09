import express from "express";
import { body } from "express-validator";
import { registerUser, loginUser } from "../controller/authController.js";
import passport from "passport";

const router = express.Router();

// Register Route
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
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

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const { user, token } = req.user;

    // Send token to frontend (you can store it in cookies too)
    res.redirect(`http://localhost:3000/auth?token=${token}`);
  }
);

export default router;
