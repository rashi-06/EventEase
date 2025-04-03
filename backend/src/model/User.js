import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema(
    {
        name : {type : String , required: true},
        email : {type : String , required: true, unique : true},
        password : {type : String , required: true},
    },

    {timestamps : true}
);


// Hashing the pass before saving the user....

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})


// Compare entered password with stored hash

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
  
const User = mongoose.model("User", userSchema);
export default User;