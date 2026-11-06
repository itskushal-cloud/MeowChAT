import mongoose from "mongoose";

const Conversationschema = new mongoose.Schema({
    participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
    Mutualconsent: {
        type:Boolean,
        required:true,
        default:false
    },
    requested_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    }
},{timestamps:true})

const Conversation = mongoose.model("Conversation",Conversationschema);

export default Conversation;