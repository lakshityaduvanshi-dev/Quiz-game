const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    text: { type: String, required: true, trim: true },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length >= 2 && arr.length <= 6,
        message: "A question must have between 2 and 6 options",
      },
    },
    correctOptionIndex: { type: Number, required: true, min: 0 },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
    points: { type: Number, default: 10 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

questionSchema.index({ text: "text" });

module.exports = mongoose.model("Question", questionSchema);
