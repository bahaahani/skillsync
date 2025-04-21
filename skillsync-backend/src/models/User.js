import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  refreshToken: {
    type: String,
    default: null
  },
  firstName: {
    type: String,
    trim: true,
    default: ''
  },
  lastName: {
    type: String,
    trim: true,
    default: ''
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  skills: [{
    name: {
      type: String,
      required: true
    },
    level: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
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
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  lastActive: {
    type: Date,
    default: Date.now
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
  },
  enrolledCourses: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course' 
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    darkMode: {
      type: Boolean,
      default: false
    },
    language: {
      type: String,
      enum: ['en', 'es', 'fr', 'de', 'ar'],
      default: 'en'
    }
  }
}, {
  timestamps: true
});

// Add indexes
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'coursesEnrolled': 1 });
userSchema.index({ 'coursesCompleted': 1 });
userSchema.index({ createdAt: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ score: -1 }); // For leaderboard queries

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified or is new
  if (!this.isModified('password')) return next();
  
  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    // Hash password with salt
    this.password = await bcrypt.hash(this.password, salt);
    // Set updatedAt when saving
    this.updatedAt = Date.now();
    
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.username;
});

// Define JSON transformation to hide sensitive data
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.refreshToken;
  return userObject;
};

const User = mongoose.model('User', userSchema);

export default User;