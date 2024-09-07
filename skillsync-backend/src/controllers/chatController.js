const Message = require('../models/Message');
const User = require('../models/User');
const { emitChatMessage } = require('../utils/socketEvents');

exports.sendMessage = async (req, res, next) => {
  try {
    const { recipientId, content } = req.body;
    const sender = req.user.id;

    const message = new Message({
      sender,
      recipient: recipientId,
      content,
    });

    await message.save();

    // Emit real-time message
    emitChatMessage(recipientId, message);

    res.status(201).json({ message: 'Message sent successfully', data: message });
  } catch (error) {
    next(error);
  }
};

exports.getConversation = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user.id;

    const messages = await Message.find({
      $or: [
        { sender: currentUser, recipient: userId },
        { sender: userId, recipient: currentUser },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

exports.getConversationList = async (req, res, next) => {
  try {
    const currentUser = req.user.id;

    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: currentUser }, { recipient: currentUser }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', currentUser] },
              '$recipient',
              '$sender',
            ],
          },
          lastMessage: { $first: '$$ROOT' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          user: { _id: 1, username: 1, avatar: 1 },
          lastMessage: 1,
        },
      },
    ]);

    res.json(conversations);
  } catch (error) {
    next(error);
  }
};