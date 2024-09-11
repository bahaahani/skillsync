import express from 'express';
import * as courseController from '../controllers/courseController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.post('/', authenticateToken, courseController.createCourse);
router.put('/:id', authenticateToken, courseController.updateCourse);
router.delete('/:id', authenticateToken, courseController.deleteCourse);

router.post('/:id/rate', authenticateToken, courseController.rateCourse);
router.get('/:id/user-rating', authenticateToken, courseController.getUserRating);

router.get('/:id/reviews', courseController.getCourseReviews);
router.post('/:id/reviews', authenticateToken, courseController.addCourseReview);
router.put('/:id/reviews/:reviewId', authenticateToken, courseController.updateCourseReview);
router.delete('/:id/reviews/:reviewId', authenticateToken, courseController.deleteCourseReview);

router.post('/:id/wishlist', authenticateToken, courseController.addToWishlist);
router.delete('/:id/wishlist', authenticateToken, courseController.removeFromWishlist);
router.get('/wishlisted', authenticateToken, courseController.getWishlistedCourses);

router.get('/:id/progress', authenticateToken, courseController.getCourseProgress);
router.post('/:id/lessons/:lessonId/progress', authenticateToken, courseController.updateLessonProgress);

export default router;