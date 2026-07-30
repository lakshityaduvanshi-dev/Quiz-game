const Question = require("../models/Question");

// @route GET /api/questions?search=&category=&difficulty=&page=&limit=
exports.getQuestions = async (req, res) => {
  try {
    const { search = "", category = "", difficulty = "", page = 1, limit = 10 } = req.query;

    const filter = {};
    if (search) filter.text = { $regex: search, $options: "i" };
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;

    const pageNum = Math.max(parseInt(page) || 1, 1);
    const limitNum = Math.max(parseInt(limit) || 10, 1);

    const [questions, total] = await Promise.all([
      Question.find(filter)
        .populate("category", "name icon")
        .sort("-createdAt")
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Question.countDocuments(filter),
    ]);

    res.json({
      questions,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch questions", error: err.message });
  }
};

exports.getQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate("category", "name icon");
    if (!question) return res.status(404).json({ message: "Question not found" });
    res.json(question);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch question", error: err.message });
  }
};

exports.createQuestion = async (req, res) => {
  try {
    const { category, text, options, correctOptionIndex, difficulty, points } = req.body;
    if (!category || !text || !options || correctOptionIndex === undefined) {
      return res.status(400).json({ message: "category, text, options and correctOptionIndex are required" });
    }
    if (correctOptionIndex < 0 || correctOptionIndex >= options.length) {
      return res.status(400).json({ message: "correctOptionIndex must reference a valid option" });
    }
    const question = await Question.create({
      category,
      text,
      options,
      correctOptionIndex,
      difficulty,
      points,
      createdBy: req.user._id,
    });
    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ message: "Failed to create question", error: err.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const { category, text, options, correctOptionIndex, difficulty, points } = req.body;
    if (options && correctOptionIndex !== undefined && (correctOptionIndex < 0 || correctOptionIndex >= options.length)) {
      return res.status(400).json({ message: "correctOptionIndex must reference a valid option" });
    }
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { category, text, options, correctOptionIndex, difficulty, points },
      { new: true, runValidators: true }
    );
    if (!question) return res.status(404).json({ message: "Question not found" });
    res.json(question);
  } catch (err) {
    res.status(500).json({ message: "Failed to update question", error: err.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) return res.status(404).json({ message: "Question not found" });
    res.json({ message: "Question deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete question", error: err.message });
  }
};
