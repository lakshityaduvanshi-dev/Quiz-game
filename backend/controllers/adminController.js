const User = require("../models/User");
const Category = require("../models/Category");
const Question = require("../models/Question");
const Score = require("../models/Score");

// @route GET /api/admin/stats
exports.getStats = async (req, res) => {
  try {
    const [categories, questions, participants, quizzesPlayed] = await Promise.all([
      Category.countDocuments(),
      Question.countDocuments(),
      User.countDocuments({ role: "user" }),
      Score.countDocuments(),
    ]);
    res.json({ categories, questions, participants, quizzesPlayed });
  } catch (err) {
    res.status(500).json({ message: "Failed to load admin stats", error: err.message });
  }
};
