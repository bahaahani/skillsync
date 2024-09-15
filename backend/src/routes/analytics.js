import express from 'express';
import {
  getAnalytics,
  getCourseAnalytics,
  getUserEngagement,
  getContentEngagement,
  getInstructorCourseAnalytics,
  getInstructorCourseDetails,
  exportAnalytics,
  exportCourseAnalytics
} from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/', getAnalytics);
router.get('/courses', getCourseAnalytics);
router.get('/user-engagement', getUserEngagement);
router.get('/content-engagement', getContentEngagement);
router.get('/instructor-courses', getInstructorCourseAnalytics);
router.get('/instructor-course/:courseId', getInstructorCourseDetails);
router.get('/export', exportAnalytics);
router.get('/export-courses', exportCourseAnalytics);

export default router;