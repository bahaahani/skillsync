const ForumTopic = require('../models/ForumTopic');
const Course = require('../models/Course');

exports.createTopic = async (req, res, next) => {
  try {
    const { title, content, courseId } = req.body;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    const topic = new ForumTopic({
      title,
      content,
      author: req.user.id,
      course: courseId,
    });
    await topic.save();
    res.status(201).json({ message: 'Forum topic created successfully', topic });
  } catch (error) {
    next(error);
  }
};

exports.getTopicsByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const topics = await ForumTopic.find({ course: courseId })
      .sort({ createdAt: -1 })
      .populate('author', 'username')
      .populate('course', 'title');
    res.json(topics);
  } catch (error) {
    next(error);
  }
};

exports.getTopic = async (req, res, next) => {
  try {
    const topic = await ForumTopic.findById(req.params.id)
      .populate('author', 'username')
      .populate('course', 'title')
      .populate('replies.author', 'username');
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    res.json(topic);
  } catch (error) {
    next(error);
  }
};

exports.addReply = async (req, res, next) => {
  try {
    const { content } = req.body;
    const topic = await ForumTopic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    topic.replies.push({
      content,
      author: req.user.id,
    });
    await topic.save();
    res.status(201).json({ message: 'Reply added successfully' });
  } catch (error) {
    next(error);
  }
};