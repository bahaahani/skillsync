const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  enrolledUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  content: [{
    type: {
      type: String,
      enum: ['video', 'document', 'quiz', 'assignment'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    fileUrl: String,
    quizQuestions: [{
      question: String,
      options: [String],
      correctAnswer: Number,
    }],
    assignmentInstructions: String,
    dueDate: Date,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;