import User from '../models/User.js';
import Course from '../models/Course.js';

export const getCourseRecommendations = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming we have user info from auth middleware
    const user = await User.findById(userId).populate('completedCourses');

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get user's skills and interests
    const userSkills = user.skills || [];
    const userInterests = user.interests || [];

    // Find courses that match user's skills and interests
    const recommendedCourses = await Course.find({
      $or: [
        { tags: { $in: userSkills } },
        { category: { $in: userInterests } }
      ],
      _id: { $nin: user.completedCourses.map(course => course._id) }
    }).limit(5);

    // Sort courses based on a simple relevance score
    const scoredCourses = recommendedCourses.map(course => {
      const skillMatch = course.tags.filter(tag => userSkills.includes(tag)).length;
      const interestMatch = userInterests.includes(course.category) ? 1 : 0;
      const score = skillMatch + interestMatch;
      return { ...course.toObject(), score };
    });

    scoredCourses.sort((a, b) => b.score - a.score);

    res.json({ recommendations: scoredCourses });
  } catch (error) {
    console.error("Error in getCourseRecommendations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
