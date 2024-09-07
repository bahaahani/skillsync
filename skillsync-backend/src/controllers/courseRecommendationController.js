const Course = require('../models/Course');
const User = require('../models/User');
const CourseFeedback = require('../models/CourseFeedback');

exports.getCourseRecommendations = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findOne({ _id: courseId, instructor: req.user.id });

    if (!course) {
      return res.status(404).json({ message: 'Course not found or you are not the instructor' });
    }

    const recommendations = [];

    // Check enrollment rate
    const enrollmentRate = course.enrolledUsers.length / await User.countDocuments();
    if (enrollmentRate < 0.1) {
      recommendations.push({
        type: 'enrollment',
        message: 'Consider promoting your course more to increase enrollment.',
      });
    }

    // Check completion rate
    const completionRate = course.completedUsers.length / course.enrolledUsers.length;
    if (completionRate < 0.5) {
      recommendations.push({
        type: 'completion',
        message: 'The course completion rate is low. Consider reviewing the course structure and content to improve engagement.',
      });
    }

    // Check content diversity
    const contentTypes = course.content.map(c => c.type);
    const uniqueContentTypes = new Set(contentTypes);
    if (uniqueContentTypes.size < 3) {
      recommendations.push({
        type: 'content',
        message: 'Consider adding more diverse content types to your course to improve engagement.',
      });
    }

    // Check quiz performance
    const quizzes = course.content.filter(c => c.type === 'quiz');
    const lowPerformingQuizzes = quizzes.filter(q => q.averageScore < 70);
    if (lowPerformingQuizzes.length > 0) {
      recommendations.push({
        type: 'quiz',
        message: `${lowPerformingQuizzes.length} quiz(zes) have low average scores. Consider reviewing and possibly simplifying these quizzes.`,
      });
    }

    // Check assignment submission rate
    const assignments = course.content.filter(c => c.type === 'assignment');
    const lowSubmissionAssignments = assignments.filter(a => a.submissionRate < 0.7);
    if (lowSubmissionAssignments.length > 0) {
      recommendations.push({
        type: 'assignment',
        message: `${lowSubmissionAssignments.length} assignment(s) have low submission rates. Consider reviewing the difficulty and instructions of these assignments.`,
      });
    }

    // Check course feedback
    const feedback = await CourseFeedback.find({ course: courseId });
    const averageRating = feedback.reduce((acc, curr) => acc + curr.rating, 0) / feedback.length;

    if (averageRating < 4) {
      recommendations.push({
        type: 'feedback',
        message: `The average course rating is ${averageRating.toFixed(1)}. Consider reviewing student feedback to improve the course.`,
      });
    }

    // Analyze feedback comments for common themes
    const comments = feedback.map(f => f.comment);
    const commonThemes = analyzeComments(comments);
    if (commonThemes.length > 0) {
      recommendations.push({
        type: 'feedback_themes',
        message: `Common themes in student feedback: ${commonThemes.join(', ')}. Consider addressing these areas in your course.`,
      });
    }

    res.json({
      courseTitle: course.title,
      recommendations,
      averageRating,
    });
  } catch (error) {
    next(error);
  }
};

// Simple function to analyze comments for common themes
// In a real-world scenario, you might want to use more advanced natural language processing techniques
function analyzeComments(comments) {
  const themes = {};
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for'];

  comments.forEach(comment => {
    const words = comment.toLowerCase().split(/\W+/);
    words.forEach(word => {
      if (word.length > 3 && !commonWords.includes(word)) {
        themes[word] = (themes[word] || 0) + 1;
      }
    });
  });

  return Object.entries(themes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
}