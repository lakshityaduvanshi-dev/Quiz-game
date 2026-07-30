import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const AdminLayout = () => (
  <div className="page container admin-shell">
    <div className="page-head">
      <div>
        <span className="eyebrow">Admin panel</span>
        <h1>Content &amp; question management</h1>
      </div>
      <span className="pill admin-pill">Admin only</span>
    </div>

    <nav className="admin-tabs">
      <NavLink to="/admin" end className={({ isActive }) => (isActive ? "active" : "")}>
        Overview
      </NavLink>
      <NavLink to="/admin/categories" className={({ isActive }) => (isActive ? "active" : "")}>
        Categories
      </NavLink>
      <NavLink to="/admin/questions" className={({ isActive }) => (isActive ? "active" : "")}>
        Questions
      </NavLink>
    </nav>

    <Outlet />
  </div>
);

export default AdminLayout;
