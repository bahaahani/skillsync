import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { connect } from "mongoose";
import cors from "cors";
import app from "./app.js";
import jwt from "jsonwebtoken";
import { schedule } from "node-cron";
import generateDailyAnalytics from "./analytics/generateDailyAnalytics.js";
import Message from "./models/Message.js";
import User from "./models/User.js";
import { authenticateToken } from "./middleware/auth.js";

const port = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: "http://localhost:4200",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Create HTTP server
const server = createServer(app);

// Set up Socket.IO with CORS
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// MongoDB connection
connect(process.env.MONGODB_URI || "mongodb://localhost:27017/skillsync", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
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
      User.findById(userId).then((user) => {
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
      User.findById(userId).then((user) => {
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
schedule("0 0 * * *", generateDailyAnalytics);


server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export { io };
export default server;
