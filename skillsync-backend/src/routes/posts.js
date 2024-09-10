import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  deleteComment
} from '../controllers/postController.js';

const router = express.Router();

// Create a new post
router.post('/', authenticateToken, createPost);

// Get all posts
router.get('/', getAllPosts);

// Get a specific post
router.get('/:id', getPostById);

// Update a post
router.put('/:id', authenticateToken, updatePost);

// Delete a post
router.delete('/:id', authenticateToken, deletePost);

// Like a post
router.post('/:id/like', authenticateToken, likePost);

// Unlike a post
router.post('/:id/unlike', authenticateToken, unlikePost);

// Add a comment to a post
router.post('/:id/comments', authenticateToken, addComment);

// Delete a comment from a post
router.delete('/:id/comments/:commentId', authenticateToken, deleteComment);

export default router;