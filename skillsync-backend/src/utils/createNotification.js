const Notification = require('../models/Notification');

const createNotification = async (recipientId, type, content, relatedItem, itemModel) => {
  try {
    const notification = new Notification({
      recipient: recipientId,
      type,
      content,
      relatedItem,
      itemModel,
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

module.exports = createNotification;