import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getProfile,
  getActivities  // Add this import
} from "../controllers/userController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.get("/profile", authenticateToken, getProfile);
router.get("/activities", authenticateToken, getActivities);

export default router;
