import express from 'express';
import { getAllPosts, createPost, getPost, addReply, createTopic } from '../controllers/forumController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllPosts);
router.post('/', authenticateToken, createPost);
router.get('/:id', getPost);
router.post('/:id/reply', authenticateToken, addReply);
// Add the new route for creating topics
router.post('/topics', authenticateToken, createTopic);

export default router;