import express from 'express';
import { getUserById, getCurrentUser, getUserSettings } from '../controllers/userController.js';

const router = express.Router();

router.get('/current', getCurrentUser);
router.get('/settings', getUserSettings);
router.get('/:id', getUserById);

export default router;