import express from "express";
import {
  login,
  logout,
  register,
  refreshToken,
  updateProfile,
  changePassword,
  deleteUser,
  getUserProfile,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.put("/update-profile", updateProfile);
router.put("/change-password", changePassword);
router.delete("/delete-user", deleteUser);
router.get("/profile", getUserProfile);

export default router;