import express from 'express';
import {
  getAllAssessments,
  getAssessmentById,
  createAssessment,
  updateAssessment,
  deleteAssessment,
  submitAssessment,
} from '../controllers/assessmentController.js';

const router = express.Router();

router.get('/', getAllAssessments);
router.get('/:id', getAssessmentById);
router.post('/', createAssessment);
router.put('/:id', updateAssessment);
router.delete('/:id', deleteAssessment);
router.post('/:id/submit', submitAssessment);

export default router;