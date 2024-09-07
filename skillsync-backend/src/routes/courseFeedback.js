import express from 'express';
import {
  submitFeedback,
  getCourseFeedback,
  updateFeedback,
  deleteFeedback
} from '../controllers/courseFeedbackController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/:courseId', auth, submitFeedback);
router.get('/:courseId', getCourseFeedback);
router.put('/:courseId/:feedbackId', auth, updateFeedback);
router.delete('/:courseId/:feedbackId', auth, deleteFeedback);

export default router;