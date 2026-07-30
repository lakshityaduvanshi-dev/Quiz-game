const express = require("express");
const router = express.Router();
const { getLeaderboard, getMyScores } = require("../controllers/leaderboardController");
const { protect } = require("../middleware/auth");

router.get("/", getLeaderboard);
router.get("/me", protect, getMyScores);

module.exports = router;
