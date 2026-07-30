const Question = require("../models/Question");
const Category = require("../models/Category");
const Score = require("../models/Score");

// @route GET /api/quiz/start?category=&count=&difficulty=
// Returns questions WITHOUT correct answers for a timed quiz session
exports.startQuiz = async (req, res) => {
  try {
    const { category, count = 10, difficulty = "" } = req.query;
    if (!category) return res.status(400).json({ message: "category is required" });

    const cat = await Category.findById(category);
    if (!cat) return res.status(404).json({ message: "Category not found" });

    const filter = { category };
    if (difficulty) filter.difficulty = difficulty;

    const questions = await Question.aggregate([
      { $match: { category: cat._id, ...(difficulty ? { difficulty } : {}) } },
      { $sample: { size: Math.min(parseInt(count) || 10, 50) } },
    ]);

    const sanitized = questions.map((q) => ({
      _id: q._id,
      text: q.text,
      options: q.options,
      difficulty: q.difficulty,
      points: q.points,
    }));

    res.json({ category: { id: cat._id, name: cat.name }, questions: sanitized });
  } catch (err) {
    res.status(500).json({ message: "Failed to start quiz", error: err.message });
  }
};

// @route POST /api/quiz/submit
// body: { category, timeTakenSeconds, answers: [{ questionId, selectedIndex }] }
exports.submitQuiz = async (req, res) => {
  try {
    const { category, timeTakenSeconds = 0, answers = [] } = req.body;
    if (!category || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: "category and answers are required" });
    }

    const questionIds = answers.map((a) => a.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });
    const questionMap = Object.fromEntries(questions.map((q) => [String(q._id), q]));

    let score = 0;
    let correctAnswers = 0;
    const detail = answers.map((a) => {
      const q = questionMap[a.questionId];
      if (!q) return { questionId: a.questionId, correct: false };
      const isCorrect = q.correctOptionIndex === a.selectedIndex;
      if (isCorrect) {
        score += q.points || 10;
        correctAnswers += 1;
      }
      return {
        questionId: a.questionId,
        selectedIndex: a.selectedIndex,
        correctOptionIndex: q.correctOptionIndex,
        correct: isCorrect,
      };
    });

    const record = await Score.create({
      user: req.user._id,
      category,
      score,
      totalQuestions: answers.length,
      correctAnswers,
      timeTakenSeconds,
    });

    res.status(201).json({
      score,
      correctAnswers,
      totalQuestions: answers.length,
      timeTakenSeconds,
      detail,
      scoreId: record._id,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to submit quiz", error: err.message });
  }
};
