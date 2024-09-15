import User from '../models/User.js';

export const getLeaderboard = async (req, res, next) => {
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

export const getUserRank = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userCount = await User.countDocuments();
    const userRank = await User.countDocuments({ score: { $gt: req.user.score } });
    res.json({
      rank: userRank + 1,
      totalUsers: userCount,
    });
  } catch (error) {
    next(error);
  }
};