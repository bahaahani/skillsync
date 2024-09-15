import express from 'express';
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  addComment,
  deleteComment
} from '../controllers/forumController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.post('/', auth, createPost);
router.put('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);
router.post('/:id/comments', auth, addComment);
router.delete('/:postId/comments/:commentId', auth, deleteComment);

export default router;