import React, { useEffect, useState } from "react";
import api from "../../services/api";
import Loader from "../../components/Loader";

const emptyForm = { name: "", description: "", icon: "📚" };

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/categories", { params: { search, sort } });
      setCategories(res.data);
    } catch (err) {
      setError("Could not load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(load, 250);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, sort]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, form);
      } else {
        await api.post("/categories", form);
      }
      resetForm();
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save category.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat._id);
    setForm({ name: cat.name, description: cat.description || "", icon: cat.icon || "📚" });
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Delete "${cat.name}" and all of its questions?`)) return;
    try {
      await api.delete(`/categories/${cat._id}`);
      load();
    } catch (err) {
      setError("Could not delete category.");
    }
  };

  return (
    <div className="admin-panel-section">
      {error && <div className="alert alert-error">{error}</div>}

      <div className="dash-grid">
        <section className="card">
          <h2>{editingId ? "Edit category" : "New category"}</h2>
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label>
                Icon
                <input value={form.icon} maxLength={2} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
              </label>
              <label style={{ flex: 2 }}>
                Name
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Geography" />
              </label>
            </div>
            <label>
              Description
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="What does this category cover?"
              />
            </label>
            <div className="form-row">
              <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? "Saving…" : editingId ? "Update category" : "Add category"}
              </button>
              {editingId && (
                <button className="btn btn-ghost" type="button" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="card">
          <div className="filter-row">
            <input
              className="search-input"
              placeholder="Search categories…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="name">Sort: A–Z</option>
              <option value="newest">Sort: Newest</option>
            </select>
          </div>

          {loading ? (
            <Loader label="Loading categories" />
          ) : categories.length === 0 ? (
            <p className="muted">No categories match your search.</p>
          ) : (
            <ul className="entity-list">
              {categories.map((cat) => (
                <li key={cat._id}>
                  <div>
                    <span className="entity-icon">{cat.icon}</span>
                    <div>
                      <strong>{cat.name}</strong>
                      <p className="muted small">{cat.description || "No description"}</p>
                    </div>
                  </div>
                  <div className="entity-actions">
                    <span className="pill">{cat.questionCount} Qs</span>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(cat)}>
                      Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(cat)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminCategories;

