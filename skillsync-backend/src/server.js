const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const app = require("./app");
const jwt = require("jsonwebtoken");
const cron = require("node-cron");
const { generateDailyAnalytics } = require("./controllers/analyticsController");
const Message = require("./models/Message");
const User = require("./models/User");

const port = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: "http://localhost:4200", // Specify the frontend origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allowed methods
  credentials: true, // To enable cookies/auth headers across origins
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
};

app.use(cors(corsOptions));

// Create HTTP server
const server = http.createServer(app);

// Set up Socket.IO with CORS
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:4200", // Allow connections from this origin
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/skillsync")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinCourse", (courseId) => {
    socket.join(`course:${courseId}`);
  });

  socket.on("joinAdminRoom", (token) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
      User.findById(userId, (err, user) => {
        if (user && user.role === "admin") {
          socket.join("admin");
          console.log("Admin joined the admin room");
        }
      });
    } catch (error) {
      console.error("Error joining admin room:", error);
    }
  });

  socket.on("joinInstructorRoom", (token) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
      User.findById(userId, (err, user) => {
        if (user && user.role === "instructor") {
          socket.join(`instructor:${userId}`);
          console.log("Instructor joined their room");
        }
      });
    } catch (error) {
      console.error("Error joining instructor room:", error);
    }
  });

  socket.on("chatMessage", async (data) => {
    try {
      const { senderId, recipientId, content } = data;
      const message = new Message({
        sender: senderId,
        recipient: recipientId,
        content,
      });
      await message.save();
      io.to(recipientId).emit("chatMessage", message);
    } catch (error) {
      console.error("Error sending chat message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Schedule daily analytics generation
cron.schedule("0 0 * * *", generateDailyAnalytics);

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Export server and io for use in other files if needed
module.exports = { app, server, io };
