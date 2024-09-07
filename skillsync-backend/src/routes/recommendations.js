import express from "express";
import {
  getRecommendedCourses,
  getPersonalizedRecommendations,
  getTrendingCourses
} from '../controllers/recommendationController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/courses', auth, getRecommendedCourses);
router.get('/personalized', auth, getPersonalizedRecommendations);
router.get('/trending', getTrendingCourses);

export default router;
