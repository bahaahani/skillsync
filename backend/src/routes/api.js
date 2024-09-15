import express from 'express';
import authRoutes from './auth.js';
import userRoutes from './users.js';
import courseRoutes from './courses.js';
// Import other route files as needed

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/courses', courseRoutes);
// Use other routes as needed

export default router;