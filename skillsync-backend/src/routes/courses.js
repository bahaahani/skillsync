const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { validateCourseCreation } = require('../middleware/validators/courseValidator');

// GET /api/courses
router.get('/', courseController.getAllCourses);

// GET /api/courses/:id
router.get('/:id', courseController.getCourseById);

// POST /api/courses
router.post('/', auth, validateCourseCreation, courseController.createCourse);

// PUT /api/courses/:id
router.put('/:id', auth, courseController.updateCourse);

// DELETE /api/courses/:id
router.delete('/:id', auth, courseController.deleteCourse);

// POST /api/courses/:id/enroll
router.post('/:id/enroll', auth, courseController.enrollInCourse);

// POST /api/courses/:id/materials
router.post('/:id/materials', auth, upload.single('material'), courseController.uploadMaterial);

// POST /api/courses/:id/content
router.post('/:id/content', auth, upload.single('file'), courseController.addContent);

// PUT /api/courses/:courseId/content/:contentId
router.put('/:courseId/content/:contentId', auth, courseController.updateContent);

// DELETE /api/courses/:courseId/content/:contentId
router.delete('/:courseId/content/:contentId', auth, courseController.deleteContent);

module.exports = router;