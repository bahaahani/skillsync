import express from 'express';
import {
  getStudentProgress,
  getCourseProgress,
  updateCourseProgress
} from '../controllers/studentProgressController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getStudentProgress);
router.get('/:courseId', auth, getCourseProgress);
router.put('/:courseId', auth, updateCourseProgress);

export default router;