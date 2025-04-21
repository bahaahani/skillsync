import express from 'express';
import { 
  login, 
  register, 
  refreshToken, 
  logout, 
  changePassword, 
  updateProfile 
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/register', register);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

// Protected routes
router.post('/change-password', authenticateToken, changePassword);
router.put('/profile', authenticateToken, updateProfile);

export default router;