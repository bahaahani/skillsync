import Notification from '../models/Notification.js';

const createNotification = async (userId, type, message, relatedId, relatedModel) => {
  try {
    const notification = new Notification({
      user: userId,
      type,
      message,
      relatedId,
      relatedModel,
    });
    await notification.save();
    // Emit socket event if needed
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

export default createNotification;