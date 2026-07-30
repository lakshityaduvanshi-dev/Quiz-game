import React from "react";
import { Link } from "react-router-dom";

const Landing = () => (
  <div className="landing">
    <div className="landing-glow" aria-hidden="true" />
    <div className="landing-inner">
      <span className="eyebrow">Timed quizzes · Live leaderboard</span>
      <h1>
        Build a question bank.
        <br />
        Race the clock. <span className="accent">Climb the board.</span>
      </h1>
      <p className="muted landing-sub">
        QuizDeck is a full-stack MERN quiz platform — organize categories, write questions, run
        timed quiz sessions, and track who tops the leaderboard.
      </p>
      <div className="landing-cta">
        <Link to="/register" className="btn btn-primary">
          Create free account
        </Link>
        <Link to="/login" className="btn btn-ghost">
          I already have one
        </Link>
      </div>

      <div className="landing-features">
        <div className="feature">
          <span className="feature-num mono">01</span>
          <h3>Organize categories</h3>
          <p className="muted small">Group questions by topic and difficulty for focused rounds.</p>
        </div>
        <div className="feature">
          <span className="feature-num mono">02</span>
          <h3>Race a live timer</h3>
          <p className="muted small">Every question ticks down on a countdown ring — answer before it empties.</p>
        </div>
        <div className="feature">
          <span className="feature-num mono">03</span>
          <h3>Climb the leaderboard</h3>
          <p className="muted small">Best scores per player, ranked per category, updated after every round.</p>
        </div>
      </div>
    </div>
  </div>
);

export default Landing;
