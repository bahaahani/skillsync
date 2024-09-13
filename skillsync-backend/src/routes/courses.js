import express from "express";
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getEnrolledCourses,
  getRecommendedCourses,
} from "../controllers/courseController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Get enrolled courses
router.get("/enrolled", authenticateToken, getEnrolledCourses);

// Get recommended courses
router.get("/recommended", authenticateToken, getRecommendedCourses);

// These routes should come after the specific routes
router.get("/", getAllCourses);
router.get("/:id", getCourseById);
router.post("/", createCourse);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

export default router;
