import User from "../model/user.model.js";
import mongoose from "mongoose";

const fail = (res, code, message) => res.status(code).json({ message, success: false });
const PUBLIC = "fullname username pfp bio gender";

const validId = (id) => mongoose.Types.ObjectId.isValid(id);

/* ---------- SEARCH USERS (Search tab) ---------- */
export const searchUsers = async (req, res) => {
    try {
        const q = (req.query.q || "").trim();
        if (!q) return res.status(200).json({ success: true, users: [] });

        const safe = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // escape regex chars
        const users = await User.find({
            _id: { $ne: req.user._id },
            $or: [
                { username: { $regex: safe, $options: "i" } },
                { fullname: { $regex: safe, $options: "i" } },
            ],
        }).select(PUBLIC).limit(20);

        // tell the frontend each user's relationship to me
        const result = users.map((u) => {
            let relation = "none";
            if (req.user.friends.some((id) => id.equals(u._id))) relation = "friend";
            else if (req.user.sentRequests.some((id) => id.equals(u._id))) relation = "sent";
            else if (req.user.receivedRequests.some((id) => id.equals(u._id))) relation = "received";
            return { ...u.toObject(), relation };
        });

        return res.status(200).json({ success: true, users: result });
    } catch (error) {
        console.log(error.message, "error in searchUsers");
        return fail(res, 500, "Search failed");
    }
};

/* ---------- GET ANOTHER USER'S PUBLIC PROFILE ---------- */
export const getUserById = async (req, res) => {
    try {
        if (!validId(req.params.id)) return fail(res, 400, "invalid user id");
        const user = await User.findById(req.params.id).select(PUBLIC);
        if (!user) return fail(res, 404, "user not found");
        return res.status(200).json({ success: true, user });
    } catch (error) {
        console.log(error.message, "error in getUserById");
        return fail(res, 500, "Could not get user");
    }
};

/* ---------- FRIENDS LIST (Home / chat list) ---------- */
export const getFriends = async (req, res) => {
    try {
        const me = await User.findById(req.user._id).populate("friends", PUBLIC);
        return res.status(200).json({ success: true, friends: me.friends });
    } catch (error) {
        console.log(error.message, "error in getFriends");
        return fail(res, 500, "Could not get friends");
    }
};

/* ---------- SEND FRIEND REQUEST ---------- */
export const sendRequest = async (req, res) => {
    try {
        const targetId = req.params.id;
        if (!validId(targetId)) return fail(res, 400, "invalid user id");
        if (req.user._id.equals(targetId)) return fail(res, 400, "you cannot add yourself");

        const target = await User.findById(targetId);
        if (!target) return fail(res, 404, "user not found");

        if (req.user.friends.some((id) => id.equals(targetId))) return fail(res, 400, "already friends");
        if (req.user.sentRequests.some((id) => id.equals(targetId))) return fail(res, 400, "request already sent");
        if (req.user.receivedRequests.some((id) => id.equals(targetId))) {
            return fail(res, 400, "this user already sent you a request, accept it");
        }

        await User.findByIdAndUpdate(req.user._id, { $addToSet: { sentRequests: targetId } });
        await User.findByIdAndUpdate(targetId, { $addToSet: { receivedRequests: req.user._id } });
        return res.status(200).json({ message: "request sent meow", success: true });
    } catch (error) {
        console.log(error.message, "error in sendRequest");
        return fail(res, 500, "Could not send request");
    }
};

/* ---------- RECEIVED REQUESTS (Requests tab) ---------- */
export const getRequests = async (req, res) => {
    try {
        const me = await User.findById(req.user._id)
            .populate("receivedRequests", PUBLIC)
            .populate("sentRequests", PUBLIC);
        return res.status(200).json({
            success: true,
            received: me.receivedRequests,
            sent: me.sentRequests,
        });
    } catch (error) {
        console.log(error.message, "error in getRequests");
        return fail(res, 500, "Could not get requests");
    }
};

/* ---------- ACCEPT REQUEST ---------- */
export const acceptRequest = async (req, res) => {
    try {
        const senderId = req.params.id;
        if (!validId(senderId)) return fail(res, 400, "invalid user id");
        if (!req.user.receivedRequests.some((id) => id.equals(senderId))) {
            return fail(res, 400, "no request from this user");
        }

        await User.findByIdAndUpdate(req.user._id, {
            $pull: { receivedRequests: senderId },
            $addToSet: { friends: senderId },
        });
        await User.findByIdAndUpdate(senderId, {
            $pull: { sentRequests: req.user._id },
            $addToSet: { friends: req.user._id },
        });
        return res.status(200).json({ message: "request accepted meow", success: true });
    } catch (error) {
        console.log(error.message, "error in acceptRequest");
        return fail(res, 500, "Could not accept request");
    }
};

/* ---------- REJECT REQUEST ---------- */
export const rejectRequest = async (req, res) => {
    try {
        const senderId = req.params.id;
        if (!validId(senderId)) return fail(res, 400, "invalid user id");

        await User.findByIdAndUpdate(req.user._id, { $pull: { receivedRequests: senderId } });
        await User.findByIdAndUpdate(senderId, { $pull: { sentRequests: req.user._id } });
        return res.status(200).json({ message: "request rejected", success: true });
    } catch (error) {
        console.log(error.message, "error in rejectRequest");
        return fail(res, 500, "Could not reject request");
    }
};

/* ---------- CANCEL A REQUEST I SENT ---------- */
export const cancelRequest = async (req, res) => {
    try {
        const targetId = req.params.id;
        if (!validId(targetId)) return fail(res, 400, "invalid user id");

        await User.findByIdAndUpdate(req.user._id, { $pull: { sentRequests: targetId } });
        await User.findByIdAndUpdate(targetId, { $pull: { receivedRequests: req.user._id } });
        return res.status(200).json({ message: "request cancelled", success: true });
    } catch (error) {
        console.log(error.message, "error in cancelRequest");
        return fail(res, 500, "Could not cancel request");
    }
};

/* ---------- REMOVE FRIEND ---------- */
export const removeFriend = async (req, res) => {
    try {
        const friendId = req.params.id;
        if (!validId(friendId)) return fail(res, 400, "invalid user id");

        await User.findByIdAndUpdate(req.user._id, { $pull: { friends: friendId } });
        await User.findByIdAndUpdate(friendId, { $pull: { friends: req.user._id } });
        return res.status(200).json({ message: "friend removed", success: true });
    } catch (error) {
        console.log(error.message, "error in removeFriend");
        return fail(res, 500, "Could not remove friend");
    }
};