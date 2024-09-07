const express = require('express');
const router = express.Router();
const courseRecommendationController = require('../controllers/courseRecommendationController');
const auth = require('../middleware/auth');
const isInstructor = require('../middleware/isInstructor');

router.get('/:courseId', auth, isInstructor, courseRecommendationController.getCourseRecommendations);

module.exports = router;