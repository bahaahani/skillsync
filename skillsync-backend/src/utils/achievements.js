const User = require('../models/User');
const createNotification = require('./createNotification');

const achievementTypes = {
  COURSE_COMPLETION: 'course_completion',
  ASSESSMENT_ACE: 'assessment_ace',
  FORUM_CONTRIBUTOR: 'forum_contributor',
  QUICK_LEARNER: 'quick_learner',
  SOCIAL_BUTTERFLY: 'social_butterfly',
};

const achievements = {
  [achievementTypes.COURSE_COMPLETION]: {
    name: 'Course Master',
    description: 'Complete 5 courses',
    check: async (userId) => {
      const user = await User.findById(userId);
      return user.coursesCompleted.length >= 5;
    },
  },
  [achievementTypes.ASSESSMENT_ACE]: {
    name: 'Assessment Ace',
    description: 'Score 100% on 3 assessments',
    check: async (userId) => {
      // Implement logic to check if user has scored 100% on 3 assessments
      return false;
    },
  },
  [achievementTypes.FORUM_CONTRIBUTOR]: {
    name: 'Forum Contributor',
    description: 'Create 10 forum posts',
    check: async (userId) => {
      // Implement logic to check if user has created 10 forum posts
      return false;
    },
  },
  [achievementTypes.QUICK_LEARNER]: {
    name: 'Quick Learner',
    description: 'Complete a course within 7 days of enrollment',
    check: async (userId) => {
      // Implement logic to check if user has completed a course within 7 days
      return false;
    },
  },
  [achievementTypes.SOCIAL_BUTTERFLY]: {
    name: 'Social Butterfly',
    description: 'Interact with 20 different users through comments or forum replies',
    check: async (userId) => {
      // Implement logic to check if user has interacted with 20 different users
      return false;
    },
  },
};

const checkAndAwardAchievement = async (userId, achievementType) => {
  const user = await User.findById(userId);
  const achievement = achievements[achievementType];

  if (!achievement) {
    throw new Error('Invalid achievement type');
  }

  const hasAchievement = user.achievements.some(a => a.type === achievementType);
  if (hasAchievement) {
    return false;
  }

  const earned = await achievement.check(userId);
  if (earned) {
    user.achievements.push({
      type: achievementType,
      name: achievement.name,
      description: achievement.description,
    });
    await user.save();

    await createNotification(
      userId,
      'achievement',
      `Congratulations! You've earned the "${achievement.name}" achievement.`,
      user._id,
      'User'
    );

    return true;
  }

  return false;
};

module.exports = {
  achievementTypes,
  checkAndAwardAchievement,
};