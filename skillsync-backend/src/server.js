const app = require("./app");
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");
const jwt = require('jsonwebtoken');
const cron = require('node-cron');
const { generateDailyAnalytics } = require('./controllers/analyticsController');
const Message = require('./models/Message');
const User = require('./models/User');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("join", (userId) => {
    socket.join(userId);
  });

  socket.on("joinCourse", (courseId) => {
    socket.join(`course:${courseId}`);
  });

  socket.on("joinAdminRoom", (token) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
      User.findById(userId, (err, user) => {
        if (user && user.role === 'admin') {
          socket.join('admin');
          console.log('Admin joined the admin room');
        }
      });
    } catch (error) {
      console.error('Error joining admin room:', error);
    }
  });

  socket.on("joinInstructorRoom", (token) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
      User.findById(userId, (err, user) => {
        if (user && user.role === 'instructor') {
          socket.join(`instructor:${userId}`);
          console.log('Instructor joined their room');
        }
      });
    } catch (error) {
      console.error('Error joining instructor room:', error);
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
    console.log("Client disconnected");
  });
});

// Set up cron job for daily analytics
cron.schedule('0 0 * * *', () => {
  console.log('Generating daily analytics');
  generateDailyAnalytics();
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { app, io };
