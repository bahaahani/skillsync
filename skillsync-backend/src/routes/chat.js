import express from "express";
import { sendMessage, getConversation, getRecentChats } from '../controllers/chatController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post("/send", authenticateToken, sendMessage);
router.get("/conversation/:userId", authenticateToken, getConversation);
router.get("/recent", authenticateToken, getRecentChats);

export default router;