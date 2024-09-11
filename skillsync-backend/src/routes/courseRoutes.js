import express from 'express';
import { getAllCourses, getCourseById, getRecommendedCourses } from '../controllers/courseController.js';

const router = express.Router();

router.get('/', getAllCourses);
router.get('/recommended', getRecommendedCourses);
router.get('/:id', getCourseById);

export default router;