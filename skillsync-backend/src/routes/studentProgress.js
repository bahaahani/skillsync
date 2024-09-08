import express from 'express';
import {
  getStudentProgress,
  getCourseProgress,
  updateCourseProgress
} from '../controllers/studentProgressController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getStudentProgress);
router.get('/:courseId', authenticateToken, getCourseProgress);
router.put('/:courseId', authenticateToken, updateCourseProgress);

export default router;