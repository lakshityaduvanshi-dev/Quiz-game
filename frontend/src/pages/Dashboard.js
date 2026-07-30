import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [myScores, setMyScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [setup, setSetup] = useState({ category: "", count: 10, seconds: 20, difficulty: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [catRes, scoreRes] = await Promise.all([api.get("/categories"), api.get("/leaderboard/me")]);
        setCategories(catRes.data);
        setMyScores(scoreRes.data);
        if (catRes.data.length) setSetup((s) => ({ ...s, category: catRes.data[0]._id }));
      } catch (err) {
        setError("Could not load your dashboard. Please refresh.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleStart = (e) => {
    e.preventDefault();
    if (!setup.category) return;
    navigate("/quiz/play", { state: setup });
  };

  if (loading) return <Loader label="Loading your dashboard" />;

  const totalPlayed = myScores.length;
  const bestScore = myScores.reduce((max, s) => Math.max(max, s.score), 0);
  const avgAccuracy = totalPlayed
    ? Math.round((myScores.reduce((sum, s) => sum + s.correctAnswers / s.totalQuestions, 0) / totalPlayed) * 100)
    : 0;

  return (
    <div className="page container">
      <div className="page-head">
        <div>
          <span className="eyebrow">Dashboard</span>
          <h1>Welcome back, {user?.name?.split(" ")[0]}</h1>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-label">Quizzes played</span>
          <span className="stat-value mono">{totalPlayed}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Best score</span>
          <span className="stat-value mono">{bestScore}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Average accuracy</span>
          <span className="stat-value mono">{avgAccuracy}%</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Categories available</span>
          <span className="stat-value mono">{categories.length}</span>
        </div>
      </div>

      <div className="dash-grid">
        <section className="card">
          <h2>Start a timed quiz</h2>
          <p className="muted">Choose a category and pace, then race the ring before it runs out.</p>
          {categories.length === 0 ? (
            <p className="muted">No categories yet. Create one to get started.</p>
          ) : (
            <form className="form" onSubmit={handleStart}>
              <label>
                Category
                <select value={setup.category} onChange={(e) => setSetup({ ...setup, category: e.target.value })}>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.icon} {c.name} ({c.questionCount} questions)
                    </option>
                  ))}
                </select>
              </label>
              <div className="form-row">
                <label>
                  Questions
                  <select value={setup.count} onChange={(e) => setSetup({ ...setup, count: Number(e.target.value) })}>
                    {[5, 10, 15, 20].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Seconds / question
                  <select value={setup.seconds} onChange={(e) => setSetup({ ...setup, seconds: Number(e.target.value) })}>
                    {[10, 15, 20, 30].map((n) => (
                      <option key={n} value={n}>
                        {n}s
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Difficulty
                  <select value={setup.difficulty} onChange={(e) => setSetup({ ...setup, difficulty: e.target.value })}>
                    <option value="">Any</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </label>
              </div>
              <button className="btn btn-primary btn-block" type="submit">
                Start quiz
              </button>
            </form>
          )}
        </section>

        <section className="card">
          <h2>Your recent scores</h2>
          {myScores.length === 0 ? (
            <p className="muted">You haven't played a quiz yet. Your results will show up here.</p>
          ) : (
            <ul className="score-list">
              {myScores.slice(0, 6).map((s) => (
                <li key={s._id}>
                  <span>{s.category?.icon} {s.category?.name}</span>
                  <span className="mono">{s.score} pts</span>
                  <span className="muted small">{s.correctAnswers}/{s.totalQuestions} correct</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
