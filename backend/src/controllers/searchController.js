import Course from '../models/Course.js';
import User from '../models/User.js';
import ForumTopic from '../models/ForumTopic.js';

export const searchAll = async (req, res, next) => {
  try {
    const { query } = req.query;
    const regex = new RegExp(query, 'i');

    const courses = await Course.find({ 
      $or: [
        { title: regex },
        { description: regex }
      ]
    }).limit(5);

    const users = await User.find({ 
      $or: [
        { username: regex },
        { firstName: regex },
        { lastName: regex }
      ]
    }).limit(5);

    const forumTopics = await ForumTopic.find({ 
      $or: [
        { title: regex },
        { content: regex }
      ]
    }).limit(5);

    res.json({
      courses,
      users,
      forumTopics
    });
  } catch (error) {
    next(error);
  }
};

export const searchCourses = async (req, res, next) => {
  try {
    const { query } = req.query;
    const regex = new RegExp(query, 'i');

    const courses = await Course.find({ 
      $or: [
        { title: regex },
        { description: regex }
      ]
    });

    res.json(courses);
  } catch (error) {
    next(error);
  }
};

export const searchUsers = async (req, res, next) => {
  try {
    const { query } = req.query;
    const regex = new RegExp(query, 'i');

    const users = await User.find({ 
      $or: [
        { username: regex },
        { firstName: regex },
        { lastName: regex }
      ]
    });

    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const searchForumTopics = async (req, res, next) => {
  try {
    const { query } = req.query;
    const regex = new RegExp(query, 'i');

    const forumTopics = await ForumTopic.find({ 
      $or: [
        { title: regex },
        { content: regex }
      ]
    });

    res.json(forumTopics);
  } catch (error) {
    next(error);
  }
};