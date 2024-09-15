import express from 'express';
import { getCourseRecommendations } from '../controllers/courseRecommendationsController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getCourseRecommendations);

export default router;