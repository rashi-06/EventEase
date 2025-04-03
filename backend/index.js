// require("dotenv").config();
import dotenv from "dotenv";
dotenv.config();

import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import DBConnection from "./src/config/db.js";
// import redis from "./src/config/redis.js";
import authRoutes from "./src/routes/authRoutes.js"

const app = express();

app.use(json());
app.use(cors());
app.use(cookieParser());


DBConnection();

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`server started at port : ${PORT}`);    
})


app.get("/", (req,res)=>{
   res.send("Hello from the server");
})