import express from "express";
import { authenticateToken } from '../middleware/auth.js';
import { getLeaderboard } from '../controllers/leaderboardController.js';

const router = express.Router();

// Get leaderboard
router.get('/', authenticateToken, getLeaderboard);

export default router;
