import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getProfile,
  updateProfile,
  getUserStats,
  deleteProfile,
  uploadAvatar,
  getActivities
} from '../controllers/userController.js';

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, getProfile);

// Update user profile
router.put('/profile', authenticateToken, updateProfile);

// Get user statistics
router.get('/stats', authenticateToken, getUserStats);

// Delete user profile
router.delete('/profile', authenticateToken, deleteProfile);

// Upload user avatar
router.post('/avatar', authenticateToken, uploadAvatar);

// Get user activities
router.get('/activities', authenticateToken, getActivities);

export default router;