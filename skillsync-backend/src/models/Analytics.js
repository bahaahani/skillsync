import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  totalUsers: {
    type: Number,
    required: true,
  },
  activeUsers: {
    type: Number,
    required: true,
  },
  totalCourses: {
    type: Number,
    required: true,
  },
  totalEnrollments: {
    type: Number,
    required: true,
  },
  totalCompletions: {
    type: Number,
    required: true,
  },
  totalAssessmentsTaken: {
    type: Number,
    required: true,
  },
  averageAssessmentScore: {
    type: Number,
    required: true,
  },
});

const Analytics = mongoose.model('Analytics', analyticsSchema);

export default Analytics;