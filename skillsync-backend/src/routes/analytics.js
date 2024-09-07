const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const isInstructor = require('../middleware/isInstructor');

router.get('/', auth, isAdmin, analyticsController.getAnalytics);
router.get('/courses', auth, isAdmin, analyticsController.getCourseAnalytics);
router.get('/user-engagement', auth, isAdmin, analyticsController.getUserEngagement);
router.get('/content-engagement', auth, isAdmin, analyticsController.getContentEngagement);
router.get('/instructor/courses', auth, isInstructor, analyticsController.getInstructorCourseAnalytics);
router.get('/instructor/courses/:courseId', auth, isInstructor, analyticsController.getInstructorCourseDetails);
router.get('/export', auth, isAdmin, analyticsController.exportAnalytics);
router.get('/export/courses', auth, isAdmin, analyticsController.exportCourseAnalytics);

module.exports = router;