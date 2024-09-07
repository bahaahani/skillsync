import User from '../models/User.js';

export const achievementTypes = {
  COURSE_COMPLETION: 'course_completion',
  ASSESSMENT_ACE: 'assessment_ace',
  FORUM_CONTRIBUTOR: 'forum_contributor',
  QUICK_LEARNER: 'quick_learner',
  SOCIAL_BUTTERFLY: 'social_butterfly',
};

export const checkAndAwardAchievement = async (userId, achievementType) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const existingAchievement = user.achievements.find(a => a.type === achievementType);
    if (existingAchievement) {
      return; // User already has this achievement
    }

    const newAchievement = {
      type: achievementType,
      dateEarned: new Date(),
    };

    switch (achievementType) {
      case achievementTypes.COURSE_COMPLETION:
        newAchievement.name = 'Course Completer';
        newAchievement.description = 'Completed a course';
        break;
      case achievementTypes.ASSESSMENT_ACE:
        newAchievement.name = 'Assessment Ace';
        newAchievement.description = 'Scored 100% on an assessment';
        break;
      case achievementTypes.FORUM_CONTRIBUTOR:
        newAchievement.name = 'Forum Contributor';
        newAchievement.description = 'Made 10 forum posts';
        break;
      case achievementTypes.QUICK_LEARNER:
        newAchievement.name = 'Quick Learner';
        newAchievement.description = 'Completed a course in record time';
        break;
      case achievementTypes.SOCIAL_BUTTERFLY:
        newAchievement.name = 'Social Butterfly';
        newAchievement.description = 'Connected with 20 other learners';
        break;
      default:
        throw new Error('Invalid achievement type');
    }

    user.achievements.push(newAchievement);
    await user.save();

    // You might want to emit a socket event or create a notification here
    console.log(`Achievement awarded to user ${userId}: ${newAchievement.name}`);
  } catch (error) {
    console.error('Error awarding achievement:', error);
  }
};