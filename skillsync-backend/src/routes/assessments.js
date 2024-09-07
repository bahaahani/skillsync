const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessmentController');
const auth = require('../middleware/auth');

// GET /api/assessments
router.get('/', assessmentController.getAllAssessments);

// GET /api/assessments/:id
router.get('/:id', assessmentController.getAssessmentById);

// POST /api/assessments
router.post('/', auth, assessmentController.createAssessment);

// PUT /api/assessments/:id
router.put('/:id', auth, assessmentController.updateAssessment);

// DELETE /api/assessments/:id
router.delete('/:id', auth, assessmentController.deleteAssessment);

// POST /api/assessments/:id/take
router.post('/:id/take', auth, assessmentController.takeAssessment);

module.exports = router;