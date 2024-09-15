import express from "express";
import { register, login, logout, updateProfile } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js"; // Assuming you have this middleware

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.put("/profile", authenticateToken, updateProfile); // Add this line

export default router;
