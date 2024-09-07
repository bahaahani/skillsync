const express = require('express');
const router = express.Router();
const courseFeedbackController = require('../controllers/courseFeedbackController');
const auth = require('../middleware/auth');
const isInstructor = require('../middleware/isInstructor');

router.post('/:courseId', auth, courseFeedbackController.submitFeedback);
router.get('/:courseId', auth, courseFeedbackController.getCourseFeedback);
router.post('/:feedbackId/respond', auth, isInstructor, courseFeedbackController.respondToFeedback);
router.get('/instructor/:courseId', auth, isInstructor, courseFeedbackController.getCourseFeedbackForInstructor);
router.post('/:feedbackId/rate-response', auth, courseFeedbackController.rateInstructorResponse);
router.get('/instructor/:courseId/response-ratings', auth, isInstructor, courseFeedbackController.getInstructorResponseRatings);

module.exports = router;