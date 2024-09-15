import express from 'express';
import {
  submitFeedback,
  getCourseFeedback,
  updateFeedback,
  deleteFeedback
} from '../controllers/courseFeedbackController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/:courseId', authenticateToken, submitFeedback);
router.get('/:courseId', getCourseFeedback);
router.put('/:courseId/:feedbackId', authenticateToken, updateFeedback);
router.delete('/:courseId/:feedbackId', authenticateToken, deleteFeedback);

export default router;