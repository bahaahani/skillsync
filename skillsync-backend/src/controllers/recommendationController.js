import Course from '../models/Course.js';
import User from '../models/User.js';

export const getRecommendedCourses = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate('coursesCompleted');

    // Get user's completed course categories
    const completedCategories = user.coursesCompleted.map(course => course.category);

    // Find courses in similar categories that the user hasn't completed
    const recommendedCourses = await Course.find({
      category: { $in: completedCategories },
      _id: { $nin: user.coursesCompleted }
    }).limit(5);

    res.json(recommendedCourses);
  } catch (error) {
    next(error);
  }
};

export const getPersonalizedRecommendations = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate('coursesCompleted');

    // Get user's skills and interests
    const userSkills = user.skills.map(skill => skill.name);
    const userInterests = user.interests;

    // Find courses that match user's skills or interests
    const recommendedCourses = await Course.find({
      $or: [
        { requiredSkills: { $in: userSkills } },
        { tags: { $in: userInterests } }
      ],
      _id: { $nin: user.coursesCompleted }
    }).limit(5);

    res.json(recommendedCourses);
  } catch (error) {
    next(error);
  }
};

export const getTrendingCourses = async (req, res, next) => {
  try {
    // Find courses with the most enrollments in the last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const trendingCourses = await Course.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $project: {
          title: 1,
          description: 1,
          enrollmentCount: { $size: "$enrolledUsers" }
        }
      },
      {
        $sort: { enrollmentCount: -1 }
      },
      {
        $limit: 5
      }
    ]);

    res.json(trendingCourses);
  } catch (error) {
    next(error);
  }
};