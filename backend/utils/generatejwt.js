import jwt from "jsonwebtoken";

const generatejwtandsetcookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie("jwt", token, {
        httpOnly: true,                                  // JS cannot read it (XSS safe)
        sameSite: "lax",                                 // basic CSRF protection
        secure: process.env.NODE_ENV === "production",   // HTTPS only in production
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

export default generatejwtandsetcookie;