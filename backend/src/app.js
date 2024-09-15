import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import apiLimiter from "./middleware/rateLimiter.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import courseRoutes from "./routes/courses.js";
import assessmentRoutes from "./routes/assessments.js";
import postRoutes from "./routes/posts.js";
import leaderboardRoutes from "./routes/leaderboard.js";
import forumRoutes from "./routes/forumRoutes.js";
import notificationRoutes from "./routes/notifications.js";
import searchRoutes from "./routes/search.js";
import recommendationRoutes from "./routes/recommendations.js";
import errorHandler from "./middleware/errorHandler.js";
import analyticsRoutes from "./routes/analytics.js";
import chatRoutes from "./routes/chat.js";
import studentProgressRoutes from "./routes/studentProgress.js";
import courseRecommendationRoutes from "./routes/courseRecommendations.js";
import courseFeedbackRoutes from "./routes/courseFeedback.js";
import instructorDashboardRoutes from "./routes/instructorDashboard.js";
import apiV1Routes from "./routes/api.js";
// Load environment variables
dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: "http://localhost:4200", // or your Angular app's URL
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Make sure this comes before your routes
app.use(express.json());

// Use Helmet to set security headers
app.use(helmet());

// Set Content Security Policy
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "trusted-cdn.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "trusted-cdn.com"],
      imgSrc: ["'self'", "data:", "trusted-cdn.com"],
      connectSrc: ["'self'", "api.example.com"],
      fontSrc: ["'self'", "trusted-cdn.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  })
);

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
app.use("/api/analytics", analyticsRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/progress", studentProgressRoutes);
app.use("/api/course-recommendations", courseRecommendationRoutes);
app.use("/api/course-feedback", courseFeedbackRoutes);
app.use("/api/instructor-dashboard", instructorDashboardRoutes);
app.use("/api/user", userRoutes);
app.use("/api/instructor", instructorDashboardRoutes);

// API routes
app.use("/api/v1", apiV1Routes);

// Error handling middleware
app.use(errorHandler);

export default app;
