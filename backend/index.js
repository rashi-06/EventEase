// require("dotenv").config();
import dotenv from "dotenv";
dotenv.config();
import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import DBConnection from "./src/config/db.js";
import redis from "./src/config/redis.js";
import authRoutes from "./src/routes/authRoutes.js"
import userRoutes from "./src/routes/userRoutes.js"
import passport from "./src/config/passport.js"; 
import session from "express-session";
import eventRoutes from "./src/routes/eventRoutes.js";
import bookingRoutes from "./src/routes/bookingRoutes.js"
import paymentRoutes from "./src/routes/paymentRoutes.js"
import subscriptionRoutes from "./src/routes/subscriptionRoutes.js"



const app = express();

app.use(json());
app.use(cors());
app.use(cookieParser());

DBConnection();
// redis();

// for google auth....
app.use(
    session({
      secret: process.env.OAUTH_SECRET, 
      resave: false,
      saveUninitialized: false,
    })
);

// Initialized passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("EventEase API is running 🚀");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`server started at port : ${PORT}`);    
})


app.get("/", (req,res)=>{
   res.send("Hello from the server");
})