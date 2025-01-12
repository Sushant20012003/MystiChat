import mongoose from "mongoose";
import { type } from "os";

const conversationSchema = new mongoose.Schema({
    participants:[{type:mongoose.Schema.Types.ObjectId, ref:"User"}],
    messages:[{type:mongoose.Schema.Types.ObjectId, ref:"Message"}],
    conversationId:{type:String, required:true, unique:true}
});

export const Conversation = mongoose.model("Conversation", conversationSchema);