import User from "../model/User.js";
import generateToken from "../utility/jwt.js";
import { validationResult } from "express-validator";

// Register User
export const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log("user details--> " , user);
    if (!user || !(await user.comparePassword(password)))
      return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.log("errorr ----> ", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Google login logic
export const googleOAuthCallback = async(req,res)=>{
  try {
    const user = req.body.userId;
    const token = generateToken(user);
    res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
  } catch (error) {
    console.error("OAuth Error:", error);
    res.status(500).json({ message: "OAuth login failed" });  
  }
};


// logout method
export const logoutUser = (req, res) => {
  req.logout(() => {
    res.status(200).json({ message: "Logged out successfully" });
  });
};