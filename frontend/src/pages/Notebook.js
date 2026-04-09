import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import PageHeader from "../components/PageHeader";

const rawApiBase = process.env.REACT_APP_API_BASE_URL || "http://localhost:8081/api";
const API_BASE = /\/api\/?$/.test(rawApiBase)
  ? rawApiBase.replace(/\/$/, "")
  : `${rawApiBase.replace(/\/$/, "")}/api`;

const emptyNotebookDraft = { title: "", description: "" };
const emptyNoteDraft = { title: "", content: "", pageNumber: 1 };

const Notebook = () => {
  const { token, user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [savingNotebook, setSavingNotebook] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [notebooks, setNotebooks] = useState([]);
  const [selectedNotebookId, setSelectedNotebookId] = useState(null);
  const [selectedNotebook, setSelectedNotebook] = useState(null);

  const [editingNotebookId, setEditingNotebookId] = useState(null);
  const [editingNoteId, setEditingNoteId] = useState(null);

  const [notebookDraft, setNotebookDraft] = useState(emptyNotebookDraft);
  const [noteDraft, setNoteDraft] = useState(emptyNoteDraft);

  const authHeaders = useMemo(() => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }), [token]);

  const loadNotebooks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/notebooks`, { headers: authHeaders });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to load notebooks");
      setNotebooks(data || []);

      if (selectedNotebookId) {
        const found = (data || []).find((item) => item.id === selectedNotebookId);
        if (!found) {
          setSelectedNotebookId(null);
          setSelectedNotebook(null);
        }
      }
    } catch (err) {
      setError(err.message || "Failed to load notebooks");
    } finally {
      setLoading(false);
    }
  }, [authHeaders, selectedNotebookId]);

  const loadNotebookDetails = useCallback(async (notebookId) => {
    setError("");
    setSuccess("");
    try {
      const response = await fetch(`${API_BASE}/notebooks/${notebookId}`, { headers: authHeaders });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to load notebook details");
      setSelectedNotebookId(notebookId);
      setSelectedNotebook(data);
      setEditingNoteId(null);
      setNoteDraft(emptyNoteDraft);
    } catch (err) {
      setError(err.message || "Failed to load notebook details");
    }
  }, [authHeaders]);

  useEffect(() => {
    loadNotebooks();
  }, [loadNotebooks]);

  const resetNotebookDraft = () => {
    setEditingNotebookId(null);
    setNotebookDraft(emptyNotebookDraft);
  };

  const resetNoteDraft = () => {
    setEditingNoteId(null);
    setNoteDraft(emptyNoteDraft);
  };

  const submitNotebook = async (e) => {
    e.preventDefault();
    setSavingNotebook(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        title: notebookDraft.title.trim(),
        description: notebookDraft.description.trim(),
      };

      const url = editingNotebookId ? `${API_BASE}/notebooks/${editingNotebookId}` : `${API_BASE}/notebooks`;
      const method = editingNotebookId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || (editingNotebookId ? "Notebook update failed" : "Notebook creation failed"));

      setSuccess(editingNotebookId ? "Notebook updated successfully" : "Notebook created successfully");
      await loadNotebooks();
      resetNotebookDraft();

      if (editingNotebookId) {
        await loadNotebookDetails(editingNotebookId);
      } else if (data.notebookId) {
        await loadNotebookDetails(data.notebookId);
      }
    } catch (err) {
      setError(err.message || "Notebook action failed");
    } finally {
      setSavingNotebook(false);
    }
  };

  const editNotebook = (notebook) => {
    setEditingNotebookId(notebook.id);
    setNotebookDraft({
      title: notebook.title || "",
      description: notebook.description || "",
    });
  };

  const deleteNotebook = async (notebookId) => {
    if (!window.confirm("Delete this notebook and all its notes?")) return;

    setError("");
    setSuccess("");
    try {
      const response = await fetch(`${API_BASE}/notebooks/${notebookId}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to delete notebook");

      setSuccess("Notebook deleted successfully");
      if (selectedNotebookId === notebookId) {
        setSelectedNotebookId(null);
        setSelectedNotebook(null);
      }
      await loadNotebooks();
      resetNotebookDraft();
      resetNoteDraft();
    } catch (err) {
      setError(err.message || "Failed to delete notebook");
    }
  };

  const submitNote = async (e) => {
    e.preventDefault();
    if (!selectedNotebookId) return;

    setSavingNote(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        title: noteDraft.title.trim(),
        content: noteDraft.content,
        pageNumber: Number(noteDraft.pageNumber) || 1,
      };

      const url = editingNoteId
        ? `${API_BASE}/notebooks/${selectedNotebookId}/notes/${editingNoteId}`
        : `${API_BASE}/notebooks/${selectedNotebookId}/notes`;
      const method = editingNoteId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || (editingNoteId ? "Note update failed" : "Note creation failed"));

      setSuccess(editingNoteId ? "Note updated successfully" : "Note added successfully");
      await loadNotebookDetails(selectedNotebookId);
      await loadNotebooks();
      resetNoteDraft();
    } catch (err) {
      setError(err.message || "Note action failed");
    } finally {
      setSavingNote(false);
    }
  };

  const editNote = (note) => {
    setEditingNoteId(note.id);
    setNoteDraft({
      title: note.title || "",
      content: note.content || "",
      pageNumber: note.pageNumber || 1,
    });
  };

  const deleteNote = async (noteId) => {
    if (!selectedNotebookId) return;
    if (!window.confirm("Delete this note?")) return;

    setError("");
    setSuccess("");
    try {
      const response = await fetch(`${API_BASE}/notebooks/${selectedNotebookId}/notes/${noteId}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to delete note");

      setSuccess("Note deleted successfully");
      await loadNotebookDetails(selectedNotebookId);
      await loadNotebooks();
      if (editingNoteId === noteId) resetNoteDraft();
    } catch (err) {
      setError(err.message || "Failed to delete note");
    }
  };

  return (
    <section className="sf-page">
      <PageHeader
        breadcrumb="Workspace / Notebook"
        title="Notebook"
        subtitle={`Digital study notebook for ${user?.role === "STAFF" ? "Lecturers" : "Students and Lecturers"}. Create books and keep editable notes page-by-page.`}
      />

      {error && (
        <div className="mb-4 rounded-xl border border-rose-300/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-xl border border-emerald-300/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {success}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <aside className="sf-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-bold sf-title">My Notebooks</h3>
            <span className="rounded-full border border-amber-300/30 bg-amber-500/10 px-2 py-1 text-xs text-amber-200">
              {notebooks.length}
            </span>
          </div>

          {loading ? (
            <p className="sf-subtitle text-sm">Loading notebooks...</p>
          ) : notebooks.length === 0 ? (
            <p className="sf-subtitle text-sm">No notebooks yet. Create your first book below.</p>
          ) : (
            <div className="space-y-3">
              {notebooks.map((book) => (
                <article
                  key={book.id}
                  className={`rounded-xl border p-3 transition-all ${selectedNotebookId === book.id
                    ? "border-amber-300/50 bg-amber-500/10"
                    : "border-white/10 bg-white/5"}`}
                  style={{ boxShadow: selectedNotebookId === book.id ? "inset 0 0 0 1px rgba(253, 224, 71, 0.2)" : "none" }}
                >
                  <button
                    type="button"
                    onClick={() => loadNotebookDetails(book.id)}
                    className="w-full text-left"
                  >
                    <p className="text-sm font-semibold sf-title">{book.title}</p>
                    <p className="mt-1 text-xs sf-subtitle line-clamp-2">{book.description || "No description"}</p>
                    <p className="mt-2 text-xs text-amber-200">{book.noteCount || 0} notes</p>
                  </button>

                  <div className="mt-3 flex gap-2">
                    <button type="button" onClick={() => editNotebook(book)} className="sf-btn-secondary text-xs">Edit</button>
                    <button type="button" onClick={() => deleteNotebook(book.id)} className="sf-btn-secondary text-xs hover:border-rose-500/40 hover:bg-rose-500/10">Delete</button>
                  </div>
                </article>
              ))}
            </div>
          )}

          <form onSubmit={submitNotebook} className="mt-5 rounded-xl border border-white/10 p-3">
            <p className="mb-2 text-sm font-semibold">{editingNotebookId ? "Edit Book" : "Create Book"}</p>
            <input
              className="sf-input mb-2"
              placeholder="Book title"
              value={notebookDraft.title}
              onChange={(e) => setNotebookDraft((prev) => ({ ...prev, title: e.target.value }))}
            />
            <textarea
              className="sf-input mb-2"
              rows={2}
              placeholder="Short description"
              value={notebookDraft.description}
              onChange={(e) => setNotebookDraft((prev) => ({ ...prev, description: e.target.value }))}
            />
            <div className="flex gap-2">
              <button type="submit" disabled={savingNotebook} className="sf-btn-primary text-xs">
                {savingNotebook ? "Saving..." : editingNotebookId ? "Update Book" : "Create Book"}
              </button>
              {editingNotebookId && (
                <button type="button" onClick={resetNotebookDraft} className="sf-btn-secondary text-xs">Cancel</button>
              )}
            </div>
          </form>
        </aside>

        <section className="sf-card p-5" style={{
          backgroundImage: "linear-gradient(90deg, rgba(180,83,9,0.18) 0 14px, transparent 14px), repeating-linear-gradient(180deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 34px)",
          backgroundColor: "rgba(23, 23, 23, 0.75)",
        }}>
          {!selectedNotebook ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-lg font-semibold sf-title">Open a notebook to start writing</p>
              <p className="mt-2 text-sm sf-subtitle">Choose a book from the left, then add pages and edit notes.</p>
            </div>
          ) : (
            <>
              <div className="mb-4 rounded-xl border border-amber-300/35 bg-amber-500/10 p-4">
                <p className="text-xs uppercase tracking-[0.08em] text-amber-200">Active Book</p>
                <h3 className="mt-1 text-2xl font-bold sf-title">{selectedNotebook.title}</h3>
                <p className="mt-1 text-sm sf-subtitle">{selectedNotebook.description || "No description"}</p>
              </div>

              <form onSubmit={submitNote} className="mb-5 rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="mb-2 text-sm font-semibold">{editingNoteId ? "Edit Page" : "Add New Page"}</p>
                <div className="grid gap-2 sm:grid-cols-[1fr_120px]">
                  <input
                    className="sf-input"
                    placeholder="Note title"
                    value={noteDraft.title}
                    onChange={(e) => setNoteDraft((prev) => ({ ...prev, title: e.target.value }))}
                  />
                  <input
                    className="sf-input"
                    type="number"
                    min={1}
                    value={noteDraft.pageNumber}
                    onChange={(e) => setNoteDraft((prev) => ({ ...prev, pageNumber: e.target.value }))}
                    placeholder="Page"
                  />
                </div>
                <textarea
                  className="sf-input mt-2"
                  rows={5}
                  placeholder="Write your note here..."
                  value={noteDraft.content}
                  onChange={(e) => setNoteDraft((prev) => ({ ...prev, content: e.target.value }))}
                />
                <div className="mt-2 flex gap-2">
                  <button type="submit" disabled={savingNote} className="sf-btn-primary text-xs">
                    {savingNote ? "Saving..." : editingNoteId ? "Update Page" : "Add Page"}
                  </button>
                  {editingNoteId && (
                    <button type="button" onClick={resetNoteDraft} className="sf-btn-secondary text-xs">Cancel</button>
                  )}
                </div>
              </form>

              <div className="space-y-3">
                {selectedNotebook.notes?.length ? selectedNotebook.notes.map((note) => (
                  <article key={note.id} className="rounded-xl border border-amber-300/20 bg-black/20 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-base font-semibold">Page {note.pageNumber}: {note.title}</h4>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => editNote(note)} className="sf-btn-secondary text-xs">Edit</button>
                        <button type="button" onClick={() => deleteNote(note.id)} className="sf-btn-secondary text-xs hover:border-rose-500/40 hover:bg-rose-500/10">Delete</button>
                      </div>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-sm sf-subtitle">{note.content || "(empty page)"}</p>
                  </article>
                )) : (
                  <p className="rounded-xl border border-white/10 bg-white/5 p-5 text-sm sf-subtitle">This book has no notes yet.</p>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </section>
  );
};

export default Notebook;
