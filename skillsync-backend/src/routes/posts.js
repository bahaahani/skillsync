import express from 'express';
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
  commentOnPost
} from '../controllers/postController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get all posts
router.get('/', getAllPosts);

// Get a specific post
router.get('/:id', getPostById);

// Create a new post
router.post('/', auth, createPost);

// Update a post
router.put('/:id', auth, updatePost);

// Delete a post
router.delete('/:id', auth, deletePost);

// Like a post
router.post('/:id/like', auth, likePost);

// Comment on a post
router.post('/:id/comment', auth, commentOnPost);

export default router;