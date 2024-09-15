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
    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const newReply = {
      content,
      author: req.user.id,
    };
    post.replies.push(newReply);
    const updatedPost = await post.save();

    // Emit real-time forum update if needed
    // emitForumUpdate(post.course, { type: 'newReply', postId: post._id, reply: newReply });

    res.status(201).json(updatedPost);
  } catch (error) {
    next(error);
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await ForumPost.find().populate('author', 'username').sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const post = new ForumPost({
    title: req.body.title,
    content: req.body.content,
    author: req.user.id
  });

  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id).populate('author', 'username');
    if (post == null) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const post = await ForumPost.findOneAndUpdate(
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
    const post = await ForumPost.findOneAndDelete({ _id: req.params.id, author: req.user.id });
    if (!post) {
      return res.status(404).json({ message: 'Post not found or you are not the author' });
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const post = await ForumPost.findById(req.params.postId);
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