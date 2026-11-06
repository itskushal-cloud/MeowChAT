import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

const protectroute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "meowrror not logged in", success: false });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "meowrror user not found", success: false });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error.message, "error in protectroute");
        return res.status(401).json({ message: "meowrror invalid or expired token", success: false });
    }
};

export default protectroute;
