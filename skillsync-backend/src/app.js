const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const apiLimiter = require("./middleware/rateLimiter");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const courseRoutes = require("./routes/courses");
const assessmentRoutes = require("./routes/assessments");
const postRoutes = require("./routes/posts");
const leaderboardRoutes = require("./routes/leaderboard");
const forumRoutes = require("./routes/forum");
const notificationRoutes = require("./routes/notifications");
const searchRoutes = require("./routes/search");
const recommendationRoutes = require("./routes/recommendations");
const errorHandler = require("./middleware/errorHandler");
const analyticsRoutes = require('./routes/analytics');
const chatRoutes = require('./routes/chat');
const studentProgressRoutes = require('./routes/studentProgress');
const courseRecommendationRoutes = require('./routes/courseRecommendations');
const courseFeedbackRoutes = require('./routes/courseFeedback');
const instructorDashboardRoutes = require('./routes/instructorDashboard');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Apply rate limiting to all routes
app.use(apiLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/progress', studentProgressRoutes);
app.use('/api/course-recommendations', courseRecommendationRoutes);
app.use('/api/course-feedback', courseFeedbackRoutes);
app.use('/api/instructor-dashboard', instructorDashboardRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;
