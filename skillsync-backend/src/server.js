const app = require("./app"); // Importing the Express app
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");
const cron = require("node-cron");
const { generateDailyAnalytics } = require("./controllers/analyticsController");
const Message = require("./models/Message");
const User = require("./models/User");

const port = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Set up Socket.IO
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
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

  // Add more socket event handlers as needed
});

// Schedule daily analytics generation
cron.schedule("0 0 * * *", generateDailyAnalytics);

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Export server and io for use in other files if needed
module.exports = { app, server, io };
