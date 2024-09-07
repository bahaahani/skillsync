import express from "express";
import { auth } from '../middleware/auth.js';  // Add the .js extension
import { isInstructor } from "../middleware/isInstructor.js";  // Add the .js extension
import {
  getInstructorDashboard,
  getPrioritizedFeedback,
  getCoursePerformanceAnalytics,
  getStudentEngagementAnalytics,
  getContentEngagementAnalytics
} from "../controllers/instructorDashboardController.js";

const router = express.Router();

router.get(
  "/",
  auth,
  isInstructor,
  getInstructorDashboard
);
router.get(
  "/prioritized-feedback",
  auth,
  isInstructor,
  getPrioritizedFeedback
);
router.get(
  "/course-performance",
  auth,
  isInstructor,
  getCoursePerformanceAnalytics
);
router.get(
  "/student-engagement",
  auth,
  isInstructor,
  getStudentEngagementAnalytics
);
router.get(
  "/content-engagement",
  auth,
  isInstructor,
  getContentEngagementAnalytics
);

export default router;
