const Post = require('../models/Post');

exports.createPost = async (req, res, next) => {
  try {
    const { content } = req.body;
    const post = new Post({
      author: req.user.id,
      content,
    });
    await post.save();
    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    next(error);
  }
};

exports.getFeed = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('author', 'username')
      .populate('comments.user', 'username');
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

exports.likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    if (post.likes.includes(req.user.id)) {
      return res.status(400).json({ message: 'You have already liked this post' });
    }
    post.likes.push(req.user.id);
    await post.save();
    res.json({ message: 'Post liked successfully' });
  } catch (error) {
    next(error);
  }
};

exports.commentOnPost = async (req, res, next) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    post.comments.push({
      user: req.user.id,
      content,
    });
    await post.save();
    res.status(201).json({ message: 'Comment added successfully' });
  } catch (error) {
    next(error);
  }
};