import express from 'express';
import { getUserById, getCurrentUser, getUserSettings, getProfile, getActivities } from '../controllers/userController.js';

const router = express.Router();

router.get('/current', getCurrentUser);
router.get('/settings', getUserSettings);
router.get('/:id', getUserById);
router.get('/profile', getProfile);
router.get('/activities', getActivities);

export default router;