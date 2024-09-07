const express = require('express');
const router = express.Router();
const studentProgressController = require('../controllers/studentProgressController');
const auth = require('../middleware/auth');

router.get('/:courseId', auth, studentProgressController.getStudentProgress);
router.post('/:courseId/:contentId/complete', auth, studentProgressController.markContentAsCompleted);
router.post('/:courseId/:contentId/quiz', auth, studentProgressController.submitQuiz);
router.post('/:courseId/:contentId/assignment', auth, studentProgressController.submitAssignment);

module.exports = router;