import React, { useEffect, useState } from "react";
import api from "../../services/api";
import Loader from "../../components/Loader";

const emptyForm = {
  category: "",
  text: "",
  options: ["", "", "", ""],
  correctOptionIndex: 0,
  difficulty: "medium",
  points: 10,
};

const AdminQuestions = () => {
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/categories").then((res) => {
      setCategories(res.data);
      setForm((f) => (f.category ? f : { ...f, category: res.data[0]?._id || "" }));
    });
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/questions", {
        params: { search, category: filterCategory, difficulty: filterDifficulty, page, limit: 8 },
      });
      setQuestions(res.data.questions);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch (err) {
      setError("Could not load questions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filterCategory, filterDifficulty, page]);

  const resetForm = () => {
    setForm({ ...emptyForm, category: categories[0]?._id || "" });
    setEditingId(null);
  };

  const handleOptionChange = (i, value) => {
    const options = [...form.options];
    options[i] = value;
    setForm({ ...form, options });
  };

  const addOption = () => {
    if (form.options.length >= 6) return;
    setForm({ ...form, options: [...form.options, ""] });
  };

  const removeOption = (i) => {
    if (form.options.length <= 2) return;
    const options = form.options.filter((_, idx) => idx !== i);
    const correctOptionIndex = form.correctOptionIndex >= options.length ? 0 : form.correctOptionIndex;
    setForm({ ...form, options, correctOptionIndex });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const cleanOptions = form.options.map((o) => o.trim()).filter(Boolean);
    if (cleanOptions.length < 2) {
      setError("Provide at least two options.");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, options: cleanOptions };
      if (editingId) {
        await api.put(`/questions/${editingId}`, payload);
      } else {
        await api.post("/questions", payload);
      }
      resetForm();
      setPage(1);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save question.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (q) => {
    setEditingId(q._id);
    setForm({
      category: q.category?._id || q.category,
      text: q.text,
      options: q.options,
      correctOptionIndex: q.correctOptionIndex,
      difficulty: q.difficulty,
      points: q.points,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (q) => {
    if (!window.confirm("Delete this question?")) return;
    try {
      await api.delete(`/questions/${q._id}`);
      load();
    } catch (err) {
      setError("Could not delete question.");
    }
  };

  return (
    <div className="admin-panel-section">
      {error && <div className="alert alert-error">{error}</div>}

      <section className="card">
        <h2>{editingId ? "Edit question" : "New question"}</h2>
        {categories.length === 0 ? (
          <p className="muted">Create a category first before adding questions.</p>
        ) : (
          <form className="form" onSubmit={handleSubmit}>
            <label>
              Question text
              <textarea
                rows={2}
                required
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                placeholder="What is the capital of Japan?"
              />
            </label>

            <div className="form-row">
              <label>
                Category
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.icon} {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Difficulty
                <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </label>
              <label>
                Points
                <input
                  type="number"
                  min={1}
                  value={form.points}
                  onChange={(e) => setForm({ ...form, points: Number(e.target.value) })}
                />
              </label>
            </div>

            <label>Options (select the correct one)</label>
            {form.options.map((opt, i) => (
              <div className="option-row" key={i}>
                <input
                  type="radio"
                  name="correctOption"
                  checked={form.correctOptionIndex === i}
                  onChange={() => setForm({ ...form, correctOptionIndex: i })}
                  aria-label={`Mark option ${i + 1} correct`}
                />
                <input
                  required
                  value={opt}
                  onChange={(e) => handleOptionChange(i, e.target.value)}
                  placeholder={`Option ${i + 1}`}
                />
                {form.options.length > 2 && (
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => removeOption(i)}>
                    Remove
                  </button>
                )}
              </div>
            ))}
            {form.options.length < 6 && (
              <button type="button" className="btn btn-ghost btn-sm" onClick={addOption}>
                + Add option
              </button>
            )}

            <div className="form-row">
              <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? "Saving…" : editingId ? "Update question" : "Add question"}
              </button>
              {editingId && (
                <button className="btn btn-ghost" type="button" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}
      </section>

      <section className="card">
        <div className="filter-row">
          <input className="search-input" placeholder="Search questions…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          <select value={filterCategory} onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}>
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          <select value={filterDifficulty} onChange={(e) => { setFilterDifficulty(e.target.value); setPage(1); }}>
            <option value="">All difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {loading ? (
          <Loader label="Loading questions" />
        ) : questions.length === 0 ? (
          <p className="muted">No questions match your filters.</p>
        ) : (
          <>
            <ul className="entity-list">
              {questions.map((q) => (
                <li key={q._id}>
                  <div>
                    <span className="entity-icon">{q.category?.icon || "❓"}</span>
                    <div>
                      <strong>{q.text}</strong>
                      <p className="muted small">
                        {q.category?.name} · Correct: {q.options[q.correctOptionIndex]}
                      </p>
                    </div>
                  </div>
                  <div className="entity-actions">
                    <span className={`pill pill-${q.difficulty}`}>{q.difficulty}</span>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(q)}>
                      Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(q)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="pagination">
              <button className="btn btn-ghost btn-sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </button>
              <span className="muted small">
                Page {page} of {pages} · {total} questions
              </span>
              <button className="btn btn-ghost btn-sm" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
                Next
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default AdminQuestions;
