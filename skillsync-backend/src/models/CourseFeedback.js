const mongoose = require('mongoose');

const courseFeedbackSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    maxlength: 1000,
  },
  instructorResponse: {
    content: String,
    createdAt: Date,
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CourseFeedback = mongoose.model('CourseFeedback', courseFeedbackSchema);

module.exports = CourseFeedback;