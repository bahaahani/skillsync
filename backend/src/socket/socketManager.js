import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Message from "../models/Message.js";

export function setupSocket(io) {
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

    socket.on("userProgressUpdate", async (data) => {
      try {
        const { userId, courseId, progress } = data;
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { $set: { [`courseProgress.${courseId}`]: progress } },
          { new: true }
        );
        io.to(`course:${courseId}`).emit("userProgressUpdated", {
          userId,
          courseId,
          progress,
        });
      } catch (error) {
        console.error("Error updating user progress:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
}