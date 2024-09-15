import Course from '../models/Course.js';
import UserPreference from '../models/UserPreference.js';

export const getPersonalizedRecommendations = async (userId) => {
  const userPreferences = await UserPreference.findOne({ userId });
  if (!userPreferences) {
    return [];
  }

  // Implement personalized recommendation logic based on user preferences
  const recommendations = await Course.find({
    categories: { $in: userPreferences.preferredCategories },
    difficulty: userPreferences.preferredDifficulty
  }).limit(10);

  return recommendations;
};

export const getPopularRecommendations = async () => {
  // Implement popular recommendation logic
  const popularCourses = await Course.find()
    .sort({ enrollmentCount: -1 })
    .limit(10);

  return popularCourses;
};