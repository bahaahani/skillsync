import express from 'express';
import {
  getNotifications,
  markNotificationAsRead,
  deleteNotification
} from '../controllers/notificationController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getNotifications);
router.put('/:id/read', auth, markNotificationAsRead);
router.delete('/:id', auth, deleteNotification);

export default router;