import Message from '../models/Message.js';
import User from '../models/User.js';
import { emitChatMessage } from '../utils/socketEvents.js';

export const sendMessage = async (req, res, next) => {
  try {
    const { recipientId, content } = req.body;
    const senderId = req.user.id;

    const message = new Message({
      sender: senderId,
      recipient: recipientId,
      content,
    });

    await message.save();

    // Emit the message to the recipient
    emitChatMessage(recipientId, message);

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

export const getConversation = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, recipient: userId },
        { sender: userId, recipient: currentUserId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'username')
      .populate('recipient', 'username');

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

export const getRecentChats = async (req, res, next) => {
  try {
    const currentUserId = req.user.id;

    const recentChats = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: currentUserId }, { recipient: currentUserId }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', currentUserId] },
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
          _id: 1,
          username: '$user.username',
          lastMessage: 1,
        },
      },
    ]);

    res.json(recentChats);
  } catch (error) {
    next(error);
  }
};