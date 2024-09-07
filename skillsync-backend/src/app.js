const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const courseRoutes = require("./routes/courses");
const assessmentRoutes = require("./routes/assessments");
const postRoutes = require("./routes/posts");
const leaderboardRoutes = require("./routes/leaderboard");
const forumRoutes = require("./routes/forum");
const notificationRoutes = require("./routes/notifications");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/notifications", notificationRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;
