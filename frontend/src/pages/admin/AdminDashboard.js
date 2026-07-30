import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Loader from "../../components/Loader";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/admin/stats")
      .then((res) => setStats(res.data))
      .catch(() => setError("Could not load admin stats."));
  }, []);

  return (
    <div className="admin-panel-section">
      {error && <div className="alert alert-error">{error}</div>}

      {!stats && !error ? (
        <Loader label="Loading overview" />
      ) : (
        stats && (
          <div className="stat-grid">
            <div className="stat-card">
              <span className="stat-label">Categories</span>
              <span className="stat-value mono">{stats.categories}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Questions</span>
              <span className="stat-value mono">{stats.questions}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Participants</span>
              <span className="stat-value mono">{stats.participants}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Quizzes played</span>
              <span className="stat-value mono">{stats.quizzesPlayed}</span>
            </div>
          </div>
        )
      )}

      <div className="dash-grid">
        <section className="card">
          <h2>Manage categories</h2>
          <p className="muted">Create, edit, or remove the topics participants can quiz on.</p>
          <Link to="/admin/categories" className="btn btn-primary">
            Open categories
          </Link>
        </section>
        <section className="card">
          <h2>Manage questions</h2>
          <p className="muted">Write new questions, set the correct answer, difficulty, and points.</p>
          <Link to="/admin/questions" className="btn btn-primary">
            Open questions
          </Link>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
