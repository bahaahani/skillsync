import express from 'express';
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getEnrolledCourses,
} from '../controllers/courseController.js';
import { authenticateToken } from '../middleware/auth.js';
import Course from '../models/Course.js';
import User from '../models/User.js';

const router = express.Router();

// Get enrolled courses
router.get('/enrolled', authenticateToken, async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const enrolledCourses = await getEnrolledCourses(req.user._id);
    res.json(enrolledCourses);
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ message: 'User not found' });
    }
    next(error);
  }
});

// Get recommended courses
router.get('/recommended', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const recommendedCourses = await Course.find({ _id: { $nin: user.enrolledCourses } }).limit(5);
    res.json(recommendedCourses);
  } catch (error) {
    console.error('Error fetching recommended courses:', error);
    res.status(500).json({ message: 'Error fetching recommended courses' });
  }
});

// These routes should come after the specific routes
router.get('/', getAllCourses);
router.get('/:id', getCourseById);
router.post('/', createCourse);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);

export default router;