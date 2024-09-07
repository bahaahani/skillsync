const User = require('../models/User');
const Course = require('../models/Course');

exports.getRecommendedCourses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('coursesCompleted');
    const completedCourseIds = user.coursesCompleted.map(course => course._id);

    // Get courses based on user interests
    const interestBasedCourses = await Course.find({
      _id: { $nin: completedCourseIds },
      $or: [
        { title: { $in: user.interests.map(interest => new RegExp(interest, 'i')) } },
        { description: { $in: user.interests.map(interest => new RegExp(interest, 'i')) } },
      ],
    }).limit(5);

    // Get popular courses that the user hasn't completed
    const popularCourses = await Course.find({
      _id: { $nin: completedCourseIds },
    })
    .sort({ enrolledUsers: -1 })
    .limit(5);

    // Get courses related to the user's completed courses
    const relatedCourses = await Course.find({
      _id: { $nin: completedCourseIds },
      $or: [
        { title: { $in: user.coursesCompleted.map(course => new RegExp(course.title, 'i')) } },
        { description: { $in: user.coursesCompleted.map(course => new RegExp(course.title, 'i')) } },
      ],
    }).limit(5);

    res.json({
      interestBasedCourses,
      popularCourses,
      relatedCourses,
    });
  } catch (error) {
    next(error);
  }
};