import jwt from "jsonwebtoken";
import User from "../model/User.js";

const protect = async (req, res, next) => {
  try {
    // 1. Get token from cookie
    const token = req.cookies.token;

    console.log("🍪 Token from cookie:", token);

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // 2. Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("🔓 Decoded token:", decoded);

    // 3. Fetch user from DB
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    console.log("👤 Authenticated user:", user);

    // 4. Attach user to request
    req.user = user;

    next(); // move to route controller
  } catch (error) {
    console.error("❌ Auth error:", error);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export default protect;
