import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import generatejwtandsetcookie from "../utils/generatejwt.js";

const fail = (res, code, message) => res.status(code).json({ message, success: false });

/* ---------- REGISTER ---------- */
export const register = async (req, res) => {
    try {
        let { fullname, username, password, confmpassword, gender } = req.body;
        if (!fullname || !username || !password || !confmpassword || !gender) {
            return fail(res, 400, "all fields are required");
        }
        username = username.trim().toLowerCase();
        fullname = fullname.trim();

        if (password !== confmpassword) return fail(res, 400, "password do not matchinnn");
        if (password.length < 6) return fail(res, 400, "password must be at least 6 characters");
        if (!["male", "female"].includes(gender)) return fail(res, 400, "invalid gender");

        const existing = await User.findOne({ username });
        if (existing) return fail(res, 400, "meowrror user already exist");

        const hashed = await bcrypt.hash(password, 10);
        const pfp = `https://cataas.com/cat/says/${encodeURIComponent(fullname)}`;

        const user = await User.create({ fullname, username, password: hashed, gender, pfp });

        generatejwtandsetcookie(user._id, res);
        return res.status(201).json({
            message: "registered succesfully congrats meow",
            success: true,
            user: { _id: user._id, fullname: user.fullname, username: user.username, pfp: user.pfp, gender: user.gender, bio: user.bio },
        });
    } catch (error) {
        console.log(error.message, "error in register controller");
        return fail(res, 500, "User not registered succesfully");
    }
};

/* ---------- LOGIN ---------- */
export const login = async (req, res) => {
    try {
        let { username, password } = req.body;
        if (!username || !password) return fail(res, 400, "all fields are required");
        username = username.trim().toLowerCase();

        const user = await User.findOne({ username });
        const ok = user && (await bcrypt.compare(password, user.password));
        if (!ok) return fail(res, 400, "invalid credentials, username or password might be galat try again meow");

        generatejwtandsetcookie(user._id, res);
        return res.status(200).json({
            message: "login was succesfull congrats meow",
            success: true,
            user: { _id: user._id, fullname: user.fullname, username: user.username, pfp: user.pfp, gender: user.gender, bio: user.bio },
        });
    } catch (error) {
        console.log(error.message, "error in login controller");
        return fail(res, 500, "User was not able to login");
    }
};

/* ---------- LOGOUT ---------- */
export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0, httpOnly: true, sameSite: "lax" });
        return res.status(200).json({ message: "logout was succesfull", success: true });
    } catch (error) {
        console.log(error.message, "error in logout controller");
        return fail(res, 500, "User was not able to logout");
    }
};

/* ---------- ME (used by React on page load) ---------- */
export const me = async (req, res) => {
    // req.user is set by protectroute (password already excluded)
    return res.status(200).json(req.user);
};

/* ---------- PROFILE (view own profile with friend counts) ---------- */
export const profile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        return res.status(200).json({
            success: true,
            user,
            friendsCount: user.friends.length,
            requestsCount: user.receivedRequests.length,
        });
    } catch (error) {
        console.log(error.message, "error in profile controller");
        return fail(res, 500, "User was not able to access profile");
    }
};

/* ---------- UPDATE PROFILE ---------- */
export const updateProfile = async (req, res) => {
    try {
        const { fullname, bio, pfp, gender } = req.body;
        const updates = {};
        if (fullname !== undefined) {
            if (!fullname.trim()) return fail(res, 400, "fullname cannot be empty");
            updates.fullname = fullname.trim();
        }
        if (bio !== undefined) updates.bio = String(bio).slice(0, 150);
        if (pfp !== undefined) updates.pfp = pfp;
        if (gender !== undefined) {
            if (!["male", "female"].includes(gender)) return fail(res, 400, "invalid gender");
            updates.gender = gender;
        }
        if (Object.keys(updates).length === 0) return fail(res, 400, "nothing to update");

        const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select("-password");
        return res.status(200).json({ message: "profile updated meow", success: true, user });
    } catch (error) {
        console.log(error.message, "error in updateProfile controller");
        return fail(res, 500, "Could not update profile");
    }
};

/* ---------- CHANGE PASSWORD ---------- */
export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confmpassword } = req.body;
        if (!oldPassword || !newPassword || !confmpassword) return fail(res, 400, "all fields are required");
        if (newPassword !== confmpassword) return fail(res, 400, "password do not matchinnn");
        if (newPassword.length < 6) return fail(res, 400, "password must be at least 6 characters");

        const user = await User.findById(req.user._id); // need password field here
        const ok = await bcrypt.compare(oldPassword, user.password);
        if (!ok) return fail(res, 400, "old password is incorrect");

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        return res.status(200).json({ message: "password changed meow", success: true });
    } catch (error) {
        console.log(error.message, "error in changePassword controller");
        return fail(res, 500, "Could not change password");
    }
};

/* ---------- DELETE ACCOUNT ---------- */
export const deleteAccount = async (req, res) => {
    try {
        const { password } = req.body;
        if (!password) return fail(res, 400, "password is required");

        const user = await User.findById(req.user._id);
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return fail(res, 400, "password is incorrect");

        // remove this user from everyone else's lists
        await User.updateMany(
            {},
            { $pull: { friends: user._id, sentRequests: user._id, receivedRequests: user._id } }
        );
        await User.findByIdAndDelete(user._id);

        res.cookie("jwt", "", { maxAge: 0, httpOnly: true, sameSite: "lax" });
        return res.status(200).json({ message: "account deleted", success: true });
    } catch (error) {
        console.log(error.message, "error in deleteAccount controller");
        return fail(res, 500, "Could not delete account");
    }
};