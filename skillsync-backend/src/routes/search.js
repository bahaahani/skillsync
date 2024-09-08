import express from 'express';
import {
  searchAll,
  searchCourses,
  searchUsers,
  searchForumTopics
} from '../controllers/searchController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, searchAll);
router.get('/courses', authenticateToken, searchCourses);
router.get('/users', authenticateToken, searchUsers);
router.get('/forum', authenticateToken, searchForumTopics);

export default router;