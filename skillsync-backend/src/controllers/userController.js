const User = require('../models/User');
const cloudinary = require('../utils/cloudinary');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('coursesEnrolled', 'title')
      .populate('coursesCompleted', 'title')
      .populate('assessmentsTaken', 'title');
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { username, email, firstName, lastName, bio, skills, interests } = req.body;
    const user = await User.findById(req.user.id);

    if (username) user.username = username;
    if (email) user.email = email;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (bio) user.bio = bio;
    if (skills) user.skills = skills;
    if (interests) user.interests = interests;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio,
        skills: user.skills,
        interests: user.interests,
        score: user.score,
        achievements: user.achievements,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const stats = {
      totalScore: user.score,
      coursesEnrolled: user.coursesEnrolled.length,
      coursesCompleted: user.coursesCompleted.length,
      assessmentsTaken: user.assessmentsTaken.length,
      achievements: user.achievements,
    };
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

exports.deleteProfile = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: 'User profile deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = await cloudinary.uploader.upload(req.file.path);
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: result.secure_url },
      { new: true }
    ).select('-password');

    res.json({ message: 'Avatar uploaded successfully', user });
  } catch (error) {
    next(error);
  }
};