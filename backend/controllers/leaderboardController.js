const Score = require("../models/Score");

// @route GET /api/leaderboard?category=&limit=
// Returns the best score per user, ranked highest first
exports.getLeaderboard = async (req, res) => {
  try {
    const { category = "", limit = 20 } = req.query;
    const match = category ? { category: require("mongoose").Types.ObjectId.createFromHexString(category) } : {};

    const pipeline = [
      { $match: match },
      { $sort: { score: -1, timeTakenSeconds: 1 } },
      {
        $group: {
          _id: "$user",
          bestScore: { $first: "$score" },
          totalQuestions: { $first: "$totalQuestions" },
          correctAnswers: { $first: "$correctAnswers" },
          timeTakenSeconds: { $first: "$timeTakenSeconds" },
          achievedAt: { $first: "$createdAt" },
        },
      },
      { $sort: { bestScore: -1, timeTakenSeconds: 1 } },
      { $limit: Math.min(parseInt(limit) || 20, 100) },
      {
        $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          name: "$user.name",
          bestScore: 1,
          totalQuestions: 1,
          correctAnswers: 1,
          timeTakenSeconds: 1,
          achievedAt: 1,
        },
      },
    ];

    const leaderboard = await Score.aggregate(pipeline);
    res.json(leaderboard.map((row, idx) => ({ rank: idx + 1, ...row })));
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch leaderboard", error: err.message });
  }
};

// @route GET /api/leaderboard/me?category=
exports.getMyScores = async (req, res) => {
  try {
    const { category = "" } = req.query;
    const filter = { user: req.user._id };
    if (category) filter.category = category;
    const scores = await Score.find(filter).populate("category", "name icon").sort("-createdAt").limit(20);
    res.json(scores);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your scores", error: err.message });
  }
};
