const User = require('../models/User');
const { emitLeaderboardUpdate } = require('../utils/socketEvents');

exports.getLeaderboard = async (req, res, next) => {
  try {
    const leaderboard = await User.find()
      .sort({ score: -1 })
      .limit(10)
      .select('username score');

    res.json(leaderboard);
  } catch (error) {
    next(error);
  }
};

exports.updateLeaderboard = async () => {
  try {
    const leaderboard = await User.find()
      .sort({ score: -1 })
      .limit(10)
      .select('username score');

    // Emit real-time leaderboard update
    emitLeaderboardUpdate(leaderboard);
  } catch (error) {
    console.error('Error updating leaderboard:', error);
  }
};