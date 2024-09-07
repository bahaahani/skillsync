const Notification = require('../models/Notification');
const { emitNotification } = require('../utils/socketEvents');

exports.getUserNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort({ createdAt: -1 })
      .populate('relatedItem');
    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

exports.markNotificationAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user.id },
      { read: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json({ message: 'Notification marked as read', notification });
  } catch (error) {
    next(error);
  }
};

exports.deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user.id,
    });
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.createNotification = async (recipientId, type, content, relatedItem, itemModel) => {
  try {
    const notification = new Notification({
      recipient: recipientId,
      type,
      content,
      relatedItem,
      itemModel,
    });
    await notification.save();
    
    // Emit real-time notification
    emitNotification(recipientId, notification);

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};