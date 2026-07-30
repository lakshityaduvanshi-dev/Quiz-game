import React, { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";

const rankBadge = (rank) => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return rank;
};

const Leaderboard = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .get("/leaderboard", { params: { category } })
      .then((res) => setRows(res.data))
      .catch(() => setError("Could not load the leaderboard."))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="page container">
      <div className="page-head">
        <div>
          <span className="eyebrow">Rankings</span>
          <h1>Leaderboard</h1>
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.icon} {c.name}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <Loader label="Loading rankings" />
      ) : rows.length === 0 ? (
        <p className="muted">No scores yet for this category. Be the first to play.</p>
      ) : (
        <div className="card">
          <ul className="leaderboard-list">
            {rows.map((row) => (
              <li key={row.userId} className={row.name === user?.name && row.rank <= 3 ? "highlight" : ""}>
                <span className={`rank rank-${row.rank <= 3 ? row.rank : "other"}`}>{rankBadge(row.rank)}</span>
                <span className="lb-name">{row.name}</span>
                <span className="mono lb-score">{row.bestScore} pts</span>
                <span className="muted small">{row.correctAnswers}/{row.totalQuestions} correct · {row.timeTakenSeconds}s</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
