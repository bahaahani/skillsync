const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  totalUsers: Number,
  activeUsers: Number,
  totalCourses: Number,
  totalEnrollments: Number,
  totalCompletions: Number,
  totalAssessmentsTaken: Number,
  averageAssessmentScore: Number,
});

const Analytics = mongoose.model('Analytics', analyticsSchema);

module.exports = Analytics;