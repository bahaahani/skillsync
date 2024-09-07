const { io } = require('../server');

const emitNotification = (userId, notification) => {
  io.to(userId).emit('notification', notification);
};

const emitForumUpdate = (courseId, update) => {
  io.to(`course:${courseId}`).emit('forumUpdate', update);
};

const emitLeaderboardUpdate = (update) => {
  io.emit('leaderboardUpdate', update);
};

const emitSocialFeedUpdate = (update) => {
  io.emit('socialFeedUpdate', update);
};

const emitChatMessage = (recipientId, message) => {
  io.to(recipientId).emit('chatMessage', message);
};

const emitAnalyticsUpdate = (update) => {
  io.to('admin').emit('analyticsUpdate', update);
};

const emitCourseFeedbackUpdate = (instructorId, feedback) => {
  io.to(`instructor:${instructorId}`).emit('courseFeedbackUpdate', feedback);
};

const emitCourseEnrollment = (courseId, enrollment) => {
  io.to(`course:${courseId}`).emit('courseEnrollment', enrollment);
};

const emitAssessmentResult = (userId, result) => {
  io.to(userId).emit('assessmentResult', result);
};

module.exports = {
  emitNotification,
  emitForumUpdate,
  emitLeaderboardUpdate,
  emitSocialFeedUpdate,
  emitChatMessage,
  emitAnalyticsUpdate,
  emitCourseFeedbackUpdate,
  emitCourseEnrollment,
  emitAssessmentResult,
};