import express from "express";
import protectroute from "../middleware/protectroute.js";
import {
    register, login, logout, me, profile,
    updateProfile, changePassword, deleteAccount,
} from "../controllers/auth.controller.js";

const router = express.Router();

// public
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// protected
router.get("/me", protectroute, me);
router.get("/profile", protectroute, profile);
router.put("/update", protectroute, updateProfile);
router.put("/change-password", protectroute, changePassword);
router.delete("/delete", protectroute, deleteAccount);

export default router;