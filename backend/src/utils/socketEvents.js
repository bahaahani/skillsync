import { io } from "../server.js";

export const emitNotification = (userId, notification) => {
  io.to(userId).emit("notification", notification);
};

export const emitForumUpdate = (courseId, update) => {
  io.to(`course:${courseId}`).emit("forumUpdate", update);
};

export const emitLeaderboardUpdate = (update) => {
  io.emit("leaderboardUpdate", update);
};

export const emitSocialFeedUpdate = (update) => {
  io.emit("socialFeedUpdate", update);
};

export const emitChatMessage = (recipientId, message) => {
  io.to(recipientId).emit("chatMessage", message);
};

export const emitAnalyticsUpdate = (update) => {
  io.to("admin").emit("analyticsUpdate", update);
};

export const emitCourseFeedbackUpdate = (instructorId, feedback) => {
  io.to(`instructor:${instructorId}`).emit("courseFeedbackUpdate", feedback);
};

export const emitCourseEnrollment = (courseId, enrollment) => {
  io.to(`course:${courseId}`).emit("courseEnrollment", enrollment);
};

export const emitAssessmentResult = (userId, result) => {
  io.to(userId).emit("assessmentResult", result);
};
