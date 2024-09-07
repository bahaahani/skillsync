const User = require('../models/User');

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