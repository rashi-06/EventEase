import express from "express"
import protect from "../middleware/authMiddleware.js"

const router = express.Router();


router.get("/profile" ,protect, async(req,res)=>{
    res.status(200).json({message : "This is a protected route" , user : req.use});

})

export default router;