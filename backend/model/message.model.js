import mongoose from "mongoose";

const Messageschema = new mongoose.Schema({
    conversation_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Conversation",
        required:true,
    },
    text_content: {
        type:String,
        required:true,

    } // created at & updated at
}, {timestamps:true});

const Message = mongoose.model("Message",Messageschema);

export default Message;