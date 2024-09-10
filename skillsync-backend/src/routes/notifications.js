import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getNotifications,
  markNotificationAsRead,
  deleteNotification
} from '../controllers/notificationController.js';

const router = express.Router();

// Get all notifications for the authenticated user
router.get('/', authenticateToken, getNotifications);

// Mark a notification as read
router.put('/:id/read', authenticateToken, markNotificationAsRead);

// Delete a notification
router.delete('/:id', authenticateToken, deleteNotification);

export default router;