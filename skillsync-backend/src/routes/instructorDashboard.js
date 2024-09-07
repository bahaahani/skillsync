const express = require('express');
const router = express.Router();
const instructorDashboardController = require('../controllers/instructorDashboardController');
const auth = require('../middleware/auth');
const isInstructor = require('../middleware/isInstructor');

router.get('/', auth, isInstructor, instructorDashboardController.getInstructorDashboard);
router.get('/prioritized-feedback', auth, isInstructor, instructorDashboardController.getPrioritizedFeedback);
router.get('/course-performance', auth, isInstructor, instructorDashboardController.getCoursePerformanceAnalytics);
router.get('/student-engagement', auth, isInstructor, instructorDashboardController.getStudentEngagementAnalytics);
router.get('/content-engagement', auth, isInstructor, instructorDashboardController.getContentEngagementAnalytics);

module.exports = router;