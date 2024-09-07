const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const auth = require('../middleware/auth');

// GET /api/courses
router.get('/', courseController.getAllCourses);

// GET /api/courses/:id
router.get('/:id', courseController.getCourseById);

// POST /api/courses
router.post('/', auth, courseController.createCourse);

// PUT /api/courses/:id
router.put('/:id', auth, courseController.updateCourse);

// DELETE /api/courses/:id
router.delete('/:id', auth, courseController.deleteCourse);

// POST /api/courses/:id/enroll
router.post('/:id/enroll', auth, courseController.enrollInCourse);

module.exports = router;