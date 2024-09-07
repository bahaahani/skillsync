const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const auth = require('../middleware/auth');

router.get('/courses', auth, recommendationController.getRecommendedCourses);

module.exports = router;