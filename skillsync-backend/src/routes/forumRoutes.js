import express from 'express';
import { getAllPosts, createPost, createTopic, getTopic, addReply } from '../controllers/forumController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/posts', authenticateToken, getAllPosts);
router.post('/posts', authenticateToken, createPost);
router.post('/topics', authenticateToken, createTopic);
router.get('/topics/:id', authenticateToken, getTopic);
router.post('/topics/:id/replies', authenticateToken, addReply);

export default router;