const User = require('../models/User');
const Course = require('../models/Course');
const Assessment = require('../models/Assessment');
const Analytics = require('../models/Analytics');
const mongoose = require('mongoose');
const { stringify } = require('csv-stringify/sync');
const { emitAnalyticsUpdate } = require('../utils/socketEvents');

exports.generateDailyAnalytics = async () => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ lastActive: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } });
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Course.aggregate([
      { $group: { _id: null, total: { $sum: { $size: "$enrolledUsers" } } } }
    ]);
    const totalCompletions = await User.aggregate([
      { $group: { _id: null, total: { $sum: { $size: "$coursesCompleted" } } } }
    ]);
    const totalAssessmentsTaken = await User.aggregate([
      { $group: { _id: null, total: { $sum: { $size: "$assessmentsTaken" } } } }
    ]);
    const averageAssessmentScore = await Assessment.aggregate([
      { $group: { _id: null, avg: { $avg: "$averageScore" } } }
    ]);

    const analytics = new Analytics({
      totalUsers,
      activeUsers,
      totalCourses,
      totalEnrollments: totalEnrollments[0]?.total || 0,
      totalCompletions: totalCompletions[0]?.total || 0,
      totalAssessmentsTaken: totalAssessmentsTaken[0]?.total || 0,
      averageAssessmentScore: averageAssessmentScore[0]?.avg || 0,
    });

    await analytics.save();
    console.log('Daily analytics generated successfully');
  } catch (error) {
    console.error('Error generating daily analytics:', error);
  }
};

exports.getAnalytics = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const analytics = await Analytics.find(query).sort({ date: 1 });
    res.json(analytics);
  } catch (error) {
    next(error);
  }
};

exports.getCourseAnalytics = async (req, res, next) => {
  try {
    const courseAnalytics = await Course.aggregate([
      {
        $project: {
          title: 1,
          enrollmentCount: { $size: "$enrolledUsers" },
          completionRate: {
            $divide: [
              { $size: { $setIntersection: ["$enrolledUsers", "$completedUsers"] } },
              { $size: "$enrolledUsers" }
            ]
          }
        }
      },
      { $sort: { enrollmentCount: -1 } }
    ]);

    res.json(courseAnalytics);
  } catch (error) {
    next(error);
  }
};

exports.getUserEngagement = async (req, res, next) => {
  try {
    const userEngagement = await User.aggregate([
      {
        $project: {
          username: 1,
          coursesEnrolledCount: { $size: "$coursesEnrolled" },
          coursesCompletedCount: { $size: "$coursesCompleted" },
          assessmentsTakenCount: { $size: "$assessmentsTaken" },
          totalScore: "$score"
        }
      },
      { $sort: { totalScore: -1 } }
    ]);

    res.json(userEngagement);
  } catch (error) {
    next(error);
  }
};

exports.getContentEngagement = async (req, res, next) => {
  try {
    const contentEngagement = await Course.aggregate([
      { $unwind: "$content" },
      {
        $group: {
          _id: "$content.type",
          count: { $sum: 1 },
          averageCompletionRate: { $avg: "$content.completionRate" }
        }
      }
    ]);

    res.json(contentEngagement);
  } catch (error) {
    next(error);
  }
};

exports.getInstructorCourseAnalytics = async (req, res, next) => {
  try {
    const instructorId = req.user.id;
    const courseAnalytics = await Course.aggregate([
      { $match: { instructor: mongoose.Types.ObjectId(instructorId) } },
      {
        $project: {
          title: 1,
          enrollmentCount: { $size: "$enrolledUsers" },
          completionCount: { $size: "$completedUsers" },
          completionRate: {
            $cond: [
              { $eq: [{ $size: "$enrolledUsers" }, 0] },
              0,
              {
                $multiply: [
                  { $divide: [{ $size: "$completedUsers" }, { $size: "$enrolledUsers" }] },
                  100
                ]
              }
            ]
          },
          contentCount: { $size: "$content" },
          averageContentCompletionRate: { $avg: "$content.completionRate" }
        }
      },
      { $sort: { enrollmentCount: -1 } }
    ]);

    res.json(courseAnalytics);
  } catch (error) {
    next(error);
  }
};

exports.getInstructorCourseDetails = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findOne({ _id: courseId, instructor: req.user.id });

    if (!course) {
      return res.status(404).json({ message: 'Course not found or you are not the instructor' });
    }

    const contentAnalytics = course.content.map(content => ({
      _id: content._id,
      title: content.title,
      type: content.type,
      completionRate: content.completionRate || 0,
      averageScore: content.type === 'quiz' ? (content.averageScore || 0) : null
    }));

    const studentProgress = await User.aggregate([
      { $match: { coursesEnrolled: mongoose.Types.ObjectId(courseId) } },
      {
        $project: {
          _id: 1,
          username: 1,
          progress: {
            $filter: {
              input: "$courseProgress",
              as: "progress",
              cond: { $eq: ["$$progress.course", mongoose.Types.ObjectId(courseId)] }
            }
          }
        }
      },
      { $unwind: "$progress" },
      {
        $project: {
          username: 1,
          completedContentCount: { $size: "$progress.completedContent" },
          quizResults: "$progress.quizResults",
          assignmentSubmissions: "$progress.assignmentSubmissions"
        }
      }
    ]);

    res.json({
      courseTitle: course.title,
      enrollmentCount: course.enrolledUsers.length,
      completionCount: course.completedUsers.length,
      contentAnalytics,
      studentProgress
    });
  } catch (error) {
    next(error);
  }
};

exports.exportAnalytics = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const analytics = await Analytics.find(query).sort({ date: 1 });

    const csvData = stringify(analytics.map(a => ({
      date: a.date.toISOString().split('T')[0],
      totalUsers: a.totalUsers,
      activeUsers: a.activeUsers,
      totalCourses: a.totalCourses,
      totalEnrollments: a.totalEnrollments,
      totalCompletions: a.totalCompletions,
      totalAssessmentsTaken: a.totalAssessmentsTaken,
      averageAssessmentScore: a.averageAssessmentScore.toFixed(2)
    })), {
      header: true,
      columns: ['date', 'totalUsers', 'activeUsers', 'totalCourses', 'totalEnrollments', 'totalCompletions', 'totalAssessmentsTaken', 'averageAssessmentScore']
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=analytics.csv');
    res.send(csvData);
  } catch (error) {
    next(error);
  }
};

exports.exportCourseAnalytics = async (req, res, next) => {
  try {
    const courseAnalytics = await Course.aggregate([
      {
        $project: {
          title: 1,
          enrollmentCount: { $size: "$enrolledUsers" },
          completionRate: {
            $cond: [
              { $eq: [{ $size: "$enrolledUsers" }, 0] },
              0,
              {
                $multiply: [
                  { $divide: [{ $size: "$completedUsers" }, { $size: "$enrolledUsers" }] },
                  100
                ]
              }
            ]
          }
        }
      },
      { $sort: { enrollmentCount: -1 } }
    ]);

    const csvData = stringify(courseAnalytics.map(c => ({
      title: c.title,
      enrollmentCount: c.enrollmentCount,
      completionRate: c.completionRate.toFixed(2)
    })), {
      header: true,
      columns: ['title', 'enrollmentCount', 'completionRate']
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=course_analytics.csv');
    res.send(csvData);
  } catch (error) {
    next(error);
  }
};

exports.updateRealTimeAnalytics = async () => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ lastActive: { $gte: new Date(Date.now() - 15 * 60 * 1000) } }); // Active in last 15 minutes
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Course.aggregate([
      { $group: { _id: null, total: { $sum: { $size: "$enrolledUsers" } } } }
    ]);

    const update = {
      totalUsers,
      activeUsers,
      totalCourses,
      totalEnrollments: totalEnrollments[0]?.total || 0,
    };

    emitAnalyticsUpdate(update);
  } catch (error) {
    console.error('Error updating real-time analytics:', error);
  }
};

module.exports.updateRealTimeAnalytics = exports.updateRealTimeAnalytics;