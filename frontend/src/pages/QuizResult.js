import React from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";

const QuizResult = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.result) return <Navigate to="/dashboard" replace />;

  const { result, categoryInfo } = state;
  const accuracy = Math.round((result.correctAnswers / result.totalQuestions) * 100);

  return (
    <div className="page container result-page">
      <div className="card result-card">
        <span className="eyebrow">{categoryInfo?.name || "Quiz"} complete</span>
        <h1 className="mono result-score">{result.score} pts</h1>
        <div className="result-stats">
          <div>
            <span className="stat-label">Correct</span>
            <span className="stat-value mono">
              {result.correctAnswers}/{result.totalQuestions}
            </span>
          </div>
          <div>
            <span className="stat-label">Accuracy</span>
            <span className="stat-value mono">{accuracy}%</span>
          </div>
          <div>
            <span className="stat-label">Time taken</span>
            <span className="stat-value mono">{result.timeTakenSeconds}s</span>
          </div>
        </div>
        <div className="form-row">
          <button className="btn btn-primary" onClick={() => navigate("/dashboard")}>
            Back to dashboard
          </button>
          <button className="btn btn-ghost" onClick={() => navigate("/leaderboard")}>
            View leaderboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
