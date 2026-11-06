import mongoose from "mongoose";

const userschema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true,
            trim: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,      // NEW: no two users can share a username
            lowercase: true,   // NEW: matches what the controller does
            trim: true,
        },
        email: {
            type: String,
            required: false,
        },
        password: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            required: true,
            enum: ["female", "Non binary", "male", "others"],
        },
        bio: {
            type: String,
            required: false,
            default: "",       // NEW: default
            maxlength: 150,    // NEW: limit
        },
        pfp: {
            type: String,
            required: false,
        },
        role: {
            type: String,
            required: false,
            enum: ["User", "Admin"],
            default: "User",   // NEW: every new user is a normal user
        },

        // NEW: friend system
        friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        sentRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        receivedRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    { timestamps: true } // NEW: adds createdAt / updatedAt
);

const User = mongoose.model("User", userschema);

export default User;