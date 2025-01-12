import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId:{type:mongoose.Schema.Types.ObjectId, ref:'User', require:true},
    receiverId:{type:mongoose.Schema.Types.ObjectId, ref:'User', default:null},
    message:{type:String, require:true}
}, {timestamps:true});

export const Message = mongoose.model('Message', messageSchema);