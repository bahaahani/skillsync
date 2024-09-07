import express from 'express';
import {
  getRecommendedCourses,
  getPersonalizedRecommendations,
  getTrendingCourses
} from '../controllers/courseRecommendationController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/recommended', auth, getRecommendedCourses);
router.get('/personalized', auth, getPersonalizedRecommendations);
router.get('/trending', getTrendingCourses);

export default router;