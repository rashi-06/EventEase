import jwt from "jsonwebtoken";
import User from "../model/User.js";

const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(" ")[1];
      // token = req.headers.authorization.split(" ")[1];
    
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
     
      const user = await User.findById(decoded.id);
      console.log("👤 Found user:", user);


      const user1 = await User.findById(decoded._id);
      console.log("👤 Found user _id:", user1);
      // Attach user to request (excluding password)
      req.user = await User.findById(decoded._id).select("-password");
      console.log("req.user" , req.user);

      next(); // Proceed to the protected route
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, invalid token" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

export default protect;
