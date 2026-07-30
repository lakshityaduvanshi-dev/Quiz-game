import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const links = user
    ? [
        { to: "/dashboard", label: "Dashboard" },
        { to: "/leaderboard", label: "Leaderboard" },
        ...(user.role === "admin" ? [{ to: "/admin", label: "Admin panel" }] : []),
      ]
    : [];

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to={user ? "/dashboard" : "/"} className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">Q</span>
          <span>QuizDeck</span>
        </NavLink>

        <button className="nav-toggle" onClick={() => setOpen((o) => !o)} aria-label="Toggle navigation">
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav-links ${open ? "open" : ""}`}>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? "active" : "")} onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}
          {user ? (
            <div className="nav-user">
              <span className="nav-user-name">
                {user.name}
                {user.role === "admin" && <span className="pill admin-pill">Admin</span>}
              </span>
              <button className="btn btn-ghost" onClick={handleLogout}>
                Log out
              </button>
            </div>
          ) : (
            <div className="nav-user">
              <NavLink to="/login" className="btn btn-ghost">
                Log in
              </NavLink>
              <NavLink to="/register" className="btn btn-primary">
                Sign up
              </NavLink>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
