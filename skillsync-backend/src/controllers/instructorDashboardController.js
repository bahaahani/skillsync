const Course = require('../models/Course');
const CourseFeedback = require('../models/CourseFeedback');
const User = require('../models/User');
const Assessment = require('../models/Assessment');

exports.getInstructorDashboard = async (req, res, next) => {
  try {
    const instructorId = req.user.id;

    // Get all courses taught by the instructor
    const courses = await Course.find({ instructor: instructorId });

    // Get recent feedback for all courses
    const recentFeedback = await CourseFeedback.find({
      course: { $in: courses.map(course => course._id) }
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('course', 'title')
      .populate('user', 'username');

    // Get feedback statistics
    const feedbackStats = await CourseFeedback.aggregate([
      { $match: { course: { $in: courses.map(course => course._id) } } },
      { $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalFeedback: { $sum: 1 },
        pendingResponses: {
          $sum: {
            $cond: [{ $eq: ['$instructorResponse', null] }, 1, 0]
          }
        }
      }}
    ]);

    // Get course statistics
    const courseStats = await Course.aggregate([
      { $match: { instructor: instructorId } },
      { $group: {
        _id: null,
        totalCourses: { $sum: 1 },
        totalEnrollments: { $sum: { $size: '$enrolledUsers' } },
        totalCompletions: { $sum: { $size: '$completedUsers' } }
      }}
    ]);

    res.json({
      courses,
      recentFeedback,
      feedbackStats: feedbackStats[0] || { averageRating: 0, totalFeedback: 0, pendingResponses: 0 },
      courseStats: courseStats[0] || { totalCourses: 0, totalEnrollments: 0, totalCompletions: 0 }
    });
  } catch (error) {
    next(error);
  }
};

exports.getPrioritizedFeedback = async (req, res, next) => {
  try {
    const instructorId = req.user.id;
    const courses = await Course.find({ instructor: instructorId });

    const prioritizedFeedback = await CourseFeedback.find({
      course: { $in: courses.map(course => course._id) },
      instructorResponse: null
    })
      .sort({ rating: 1, createdAt: -1 })
      .limit(20)
      .populate('course', 'title')
      .populate('user', 'username');

    res.json(prioritizedFeedback);
  } catch (error) {
    next(error);
  }
};

exports.getCoursePerformanceAnalytics = async (req, res, next) => {
  try {
    const instructorId = req.user.id;
    const courses = await Course.find({ instructor: instructorId });

    const coursePerformance = await Promise.all(courses.map(async (course) => {
      const enrollments = course.enrolledUsers.length;
      const completions = course.completedUsers.length;
      const completionRate = enrollments > 0 ? (completions / enrollments) * 100 : 0;

      const assessments = await Assessment.find({ course: course._id });
      const averageAssessmentScore = assessments.reduce((acc, assessment) => acc + assessment.averageScore, 0) / assessments.length || 0;

      const feedback = await CourseFeedback.find({ course: course._id });
      const averageRating = feedback.reduce((acc, f) => acc + f.rating, 0) / feedback.length || 0;

      return {
        courseId: course._id,
        title: course.title,
        enrollments,
        completions,
        completionRate,
        averageAssessmentScore,
        averageRating,
      };
    }));

    res.json(coursePerformance);
  } catch (error) {
    next(error);
  }
};

exports.getStudentEngagementAnalytics = async (req, res, next) => {
  try {
    const instructorId = req.user.id;
    const courses = await Course.find({ instructor: instructorId });
    const courseIds = courses.map(course => course._id);

    const studentEngagement = await User.aggregate([
      { $match: { coursesEnrolled: { $in: courseIds } } },
      { $project: {
        _id: 1,
        username: 1,
        coursesEnrolledCount: { $size: { $setIntersection: ["$coursesEnrolled", courseIds] } },
        coursesCompletedCount: { $size: { $setIntersection: ["$coursesCompleted", courseIds] } },
        assessmentsTakenCount: { 
          $size: { 
            $filter: {
              input: "$assessmentsTaken",
              as: "assessment",
              cond: { $in: ["$$assessment.course", courseIds] }
            }
          }
        },
      }},
      { $sort: { coursesEnrolledCount: -1 } }
    ]);

    res.json(studentEngagement);
  } catch (error) {
    next(error);
  }
};

exports.getContentEngagementAnalytics = async (req, res, next) => {
  try {
    const instructorId = req.user.id;
    const courses = await Course.find({ instructor: instructorId });

    const contentEngagement = courses.flatMap(course => 
      course.content.map(content => ({
        courseId: course._id,
        courseTitle: course.title,
        contentId: content._id,
        contentTitle: content.title,
        contentType: content.type,
        views: content.views || 0,
        completions: content.completions || 0,
        averageTimeSpent: content.averageTimeSpent || 0,
      }))
    );

    res.json(contentEngagement);
  } catch (error) {
    next(error);
  }
};