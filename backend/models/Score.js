const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    correctAnswers: { type: Number, required: true },
    timeTakenSeconds: { type: Number, required: true },
  },
  { timestamps: true }
);

scoreSchema.index({ score: -1 });
scoreSchema.index({ category: 1, score: -1 });

module.exports = mongoose.model("Score", scoreSchema);
