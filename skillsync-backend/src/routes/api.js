const express = require('express');
const router = express.Router();

const authRoutes = require("./auth");
const userRoutes = require("./users");
const courseRoutes = require("./courses");
const assessmentRoutes = require("./assessments");
const postRoutes = require("./posts");
const leaderboardRoutes = require("./leaderboard");
const forumRoutes = require("./forum");
const notificationRoutes = require("./notifications");
const searchRoutes = require("./search");
const recommendationRoutes = require("./recommendations");
const analyticsRoutes = require('./analytics');
const chatRoutes = require('./chat');
const studentProgressRoutes = require('./studentProgress');
const courseRecommendationRoutes = require('./courseRecommendations');
const courseFeedbackRoutes = require('./courseFeedback');
const instructorDashboardRoutes = require('./instructorDashboard');

// API routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/courses", courseRoutes);
router.use("/assessments", assessmentRoutes);
router.use("/posts", postRoutes);
router.use("/leaderboard", leaderboardRoutes);
router.use("/forum", forumRoutes);
router.use("/notifications", notificationRoutes);
router.use("/search", searchRoutes);
router.use("/recommendations", recommendationRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/chat', chatRoutes);
router.use('/progress', studentProgressRoutes);
router.use('/course-recommendations', courseRecommendationRoutes);
router.use('/course-feedback', courseFeedbackRoutes);
router.use('/instructor-dashboard', instructorDashboardRoutes);

module.exports = router;