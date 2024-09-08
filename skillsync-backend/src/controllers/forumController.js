import ForumTopic from '../models/ForumTopic.js';
import Course from '../models/Course.js';
import { emitForumUpdate } from '../utils/socketEvents.js';
import ForumPost from '../models/ForumPost.js';

export const createTopic = async (req, res, next) => {
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

export const getTopicsByCourse = async (req, res, next) => {
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

export const getTopic = async (req, res, next) => {
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

export const addReply = async (req, res, next) => {
  try {
    const { content } = req.body;
    const topic = await ForumTopic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    const newReply = {
      content,
      author: req.user.id,
    };
    topic.replies.push(newReply);
    await topic.save();

    // Emit real-time forum update
    emitForumUpdate(topic.course, { type: 'newReply', topicId: topic._id, reply: newReply });

    res.status(201).json({ message: 'Reply added successfully' });
  } catch (error) {
    next(error);
  }
};

// Add these functions to match the route file
export const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    const totalPosts = await ForumPost.countDocuments();
    const totalPages = Math.ceil(totalPosts / pageSize);

    const posts = await ForumPost.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    res.json({
      posts,
      currentPage: page,
      totalPages,
      totalPosts
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching forum posts', error: error.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const newPost = new ForumPost({
      author: req.user.id,
      content
    });
    await newPost.save();
    const populatedPost = await ForumPost.findById(newPost._id).populate('author', 'username');
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(400).json({ message: 'Error creating forum post', error: error.message });
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const post = await ForumTopic.findOneAndUpdate(
      { _id: req.params.id, author: req.user.id },
      { title, content },
      { new: true }
    );
    if (!post) {
      return res.status(404).json({ message: 'Post not found or you are not the author' });
    }
    res.json({ message: 'Post updated successfully', post });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const post = await ForumTopic.findOneAndDelete({ _id: req.params.id, author: req.user.id });
    if (!post) {
      return res.status(404).json({ message: 'Post not found or you are not the author' });
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const addComment = addReply;

export const deleteComment = async (req, res, next) => {
  try {
    const post = await ForumTopic.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const comment = post.replies.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    if (comment.author.toString() !== req.user.id && post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this comment' });
    }
    comment.remove();
    await post.save();
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
};