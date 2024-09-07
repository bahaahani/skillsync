import express from 'express';
import {
  searchAll,
  searchCourses,
  searchUsers,
  searchForumTopics
} from '../controllers/searchController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, searchAll);
router.get('/courses', auth, searchCourses);
router.get('/users', auth, searchUsers);
router.get('/forum', auth, searchForumTopics);

export default router;