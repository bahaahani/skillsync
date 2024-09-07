import express from "express";
import { sendMessage, getConversation, getRecentChats } from '../controllers/chatController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post("/send", auth, sendMessage);
router.get("/conversation/:userId", auth, getConversation);
router.get("/recent", auth, getRecentChats);

export default router;