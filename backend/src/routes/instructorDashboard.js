import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  getInstructorCourses,
  getInstructorStats,
} from "../controllers/instructorController.js";

const router = express.Router();
// Get all courses for an instructor
router.get("/courses", authenticateToken, getInstructorCourses);

// Get instructor statistics
router.get("/stats", authenticateToken, getInstructorStats);

export default router;
