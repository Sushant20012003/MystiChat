import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{type:String, required:true, unique:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    otp:{type:String},
    otpExpiresAt:{type:Date},
    isVerified:{type:Boolean, default:false},
});

export const User = mongoose.model('User', userSchema);