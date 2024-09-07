const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  bio: {
    type: String,
    maxlength: 500,
  },
  skills: [{
    name: String,
    level: Number,
  }],
  score: {
    type: Number,
    default: 0,
  },
  coursesEnrolled: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  }],
  coursesCompleted: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  }],
  assessmentsTaken: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
  }],
  achievements: [{
    type: {
      type: String,
      enum: ['course_completion', 'assessment_ace', 'forum_contributor', 'quick_learner', 'social_butterfly'],
    },
    name: String,
    description: String,
    dateEarned: {
      type: Date,
      default: Date.now,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  avatar: {
    type: String,
    default: 'https://example.com/default-avatar.png' // Replace with your default avatar URL
  },
  interests: [{
    type: String,
    trim: true,
  }],
  courseProgress: [{
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    completedContent: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course.content'
    }],
    quizResults: [{
      quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course.content'
      },
      score: Number,
      percentage: Number,
      completedAt: Date
    }],
    assignmentSubmissions: [{
      assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course.content'
      },
      submissionText: String,
      submittedAt: Date
    }]
  }],
  role: {
    type: String,
    enum: ['student', 'instructor', 'admin'],
    default: 'student'
  }
});

// Add indexes
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'coursesEnrolled': 1 });
userSchema.index({ 'coursesCompleted': 1 });

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;