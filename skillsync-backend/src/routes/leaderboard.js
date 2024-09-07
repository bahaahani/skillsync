import express from "express";
import { getLeaderboard, getUserRank } from '../controllers/leaderboardController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get("/", getLeaderboard);
router.get("/rank", auth, getUserRank);

export default router;
