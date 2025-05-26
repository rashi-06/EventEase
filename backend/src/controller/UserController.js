import User from "../model/User.js"

export const getUserProfile = async(req,res)=>{
    try {
        const user = await User.findById(req.body.userId).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

export const updateUserProfile = async(req,res)=>{
    try {
        const user = await User.findById(req.body.userId).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        
        
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if(req.body.password){
            user.password = req.body.password;
        }

        const updatedUser =  await user.save();
        res.status(200).json({
            _id: updatedbody.userId,
            name: updatedUser.name,
            email: updatedUser.email,
        })
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

export const deleteUser = async(req,res)=>{
    try {
        await User.findByIdAndDelete(req.body.userId);
        res.json({ message: "User deleted successfully" });
    } 
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}