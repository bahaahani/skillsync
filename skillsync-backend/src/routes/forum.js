const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const auth = require('../middleware/auth');

router.post('/topics', auth, forumController.createTopic);
router.get('/topics/course/:courseId', auth, forumController.getTopicsByCourse);
router.get('/topics/:id', auth, forumController.getTopic);
router.post('/topics/:id/reply', auth, forumController.addReply);

module.exports = router;