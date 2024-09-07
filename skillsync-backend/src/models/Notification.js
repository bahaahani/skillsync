const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['course_enrollment', 'assessment_completed', 'forum_reply', 'achievement'],
  },
  content: {
    type: String,
    required: true,
  },
  relatedItem: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'itemModel',
  },
  itemModel: {
    type: String,
    enum: ['Course', 'Assessment', 'ForumTopic'],
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;