const Course = require('../models/Course');
const ForumTopic = require('../models/ForumTopic');
const User = require('../models/User');

exports.search = async (req, res, next) => {
  try {
    const { query, type } = req.query;
    let results = [];

    if (!type || type === 'all' || type === 'courses') {
      const courses = await Course.find({ 
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ]
      }).populate('instructor', 'username');
      results = results.concat(courses.map(course => ({ ...course.toObject(), type: 'course' })));
    }

    if (!type || type === 'all' || type === 'forum') {
      const topics = await ForumTopic.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { content: { $regex: query, $options: 'i' } }
        ]
      }).populate('author', 'username').populate('course', 'title');
      results = results.concat(topics.map(topic => ({ ...topic.toObject(), type: 'forum' })));
    }

    if (!type || type === 'all' || type === 'users') {
      const users = await User.find({
        $or: [
          { username: { $regex: query, $options: 'i' } },
          { firstName: { $regex: query, $options: 'i' } },
          { lastName: { $regex: query, $options: 'i' } }
        ]
      }).select('-password');
      results = results.concat(users.map(user => ({ ...user.toObject(), type: 'user' })));
    }

    res.json(results);
  } catch (error) {
    next(error);
  }
};