import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", adminCode: "" });
  const [showAdminCode, setShowAdminCode] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(form.name, form.email, form.password, form.adminCode || undefined);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create your account. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <span className="eyebrow">Get started</span>
        <h1>Create your account</h1>
        <p className="muted">Build quizzes, race the clock, and see your name on the leaderboard.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="form">
          <label>
            Name
            <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="Ada Lovelace" />
          </label>
          <label>
            Email
            <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" />
          </label>
          <label>
            Password
            <input type="password" name="password" required minLength={6} value={form.password} onChange={handleChange} placeholder="At least 6 characters" />
          </label>
          {showAdminCode ? (
            <label>
              Admin invite code
              <input
                type="text"
                name="adminCode"
                value={form.adminCode}
                onChange={handleChange}
                placeholder="Optional — leave blank for a participant account"
              />
            </label>
          ) : (
            <button type="button" className="link-btn" onClick={() => setShowAdminCode(true)}>
              Have an admin invite code?
            </button>
          )}

          <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
            {submitting ? "Creating account…" : "Sign up"}
          </button>
        </form>

        <p className="muted small">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
