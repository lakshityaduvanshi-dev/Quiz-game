const express = require("express");
const router = express.Router();
const { startQuiz, submitQuiz } = require("../controllers/quizController");
const { protect } = require("../middleware/auth");

router.get("/start", protect, startQuiz);
router.post("/submit", protect, submitQuiz);

module.exports = router;
