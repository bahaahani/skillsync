import Post from '../models/Post.js';
import User from '../models/User.js';

export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().populate('author', 'username');
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    next(error);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const { content } = req.body;
    const post = new Post({
      content,
      author: req.user.id
    });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const { content } = req.body;
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, author: req.user.id },
      { content },
      { new: true }
    );
    if (!post) {
      return res.status(404).json({ message: 'Post not found or you are not the author' });
    }
    res.json(post);
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findOneAndDelete({ _id: req.params.id, author: req.user.id });
    if (!post) {
      return res.status(404).json({ message: 'Post not found or you are not the author' });
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    if (!post.likes.includes(req.user.id)) {
      post.likes.push(req.user.id);
      await post.save();
    }
    res.json(post);
  } catch (error) {
    next(error);
  }
};

export const unlikePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    if (post.likes.includes(req.user.id)) {
      post.likes = post.likes.filter(id => id.toString() !== req.user.id);
      await post.save();
    }
    res.json(post);
  } catch (error) {
    next(error);
  }
};

export const commentOnPost = async (req, res, next) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    post.comments.push({
      content,
      author: req.user.id
    });
    await post.save();
    res.json(post);
  } catch (error) {
    next(error);
  }
};

export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    post.comments.push({ content, author: req.user.id });
    await post.save();
    res.status(201).json({ message: 'Comment added successfully', post });
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this comment' });
    }
    comment.remove();
    await post.save();
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment', error: error.message });
  }
};