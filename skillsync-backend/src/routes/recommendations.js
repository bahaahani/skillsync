import express from "express";
import {
  getRecommendedCourses,
  getPersonalizedRecommendations,
  getTrendingCourses
} from '../controllers/recommendationController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/courses', authenticateToken, getRecommendedCourses);
router.get('/personalized', authenticateToken, getPersonalizedRecommendations);
router.get('/trending', getTrendingCourses);

export default router;
