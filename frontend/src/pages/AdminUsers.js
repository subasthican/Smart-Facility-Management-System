import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

const emptyForm = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const parseJsonSafely = async (response) => {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const AdminUsers = ({ managedRole = "STAFF" }) => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const roleLabel = managedRole === "STUDENT" ? "Student" : "Staff";

  const managedUsers = useMemo(
    () => users.filter((u) => u.role === managedRole),
    [users, managedRole]
  );

  const loadUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch(`${API_BASE}/admin/users/list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      const data = await parseJsonSafely(res);
      if (!res.ok) throw new Error(data?.error || `Failed to load users (HTTP ${res.status})`);
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
  }, [token]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const resetModal = () => {
    setIsModalOpen(false);
    setModalMode("create");
    setSelectedUserId(null);
    setForm(emptyForm);
  };

  const openAddModal = () => {
    setError("");
    setMessage("");
    setModalMode("create");
    setSelectedUserId(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setError("");
    setMessage("");
    setModalMode("edit");
    setSelectedUserId(user.id);
    setForm({
      fullName: user.fullName || "",
      email: user.email || "",
      password: "",
      confirmPassword: "",
    });
    setIsModalOpen(true);
  };

  const handleCreateUser = async () => {
    if (!form.fullName.trim() || !form.email.trim() || !form.password) {
      throw new Error("Full name, email, and password are required");
    }
    if (form.password !== form.confirmPassword) {
      throw new Error("Password and confirm password do not match");
    }

    const res = await fetch(`${API_BASE}/admin/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: managedRole,
      }),
    });

    const data = await parseJsonSafely(res);
    if (!res.ok) {
      throw new Error(data?.error || `Failed to create ${roleLabel.toLowerCase()} (HTTP ${res.status})`);
    }
  };

  const handleEditUser = async () => {
    if (!selectedUserId) throw new Error("Missing user ID for update");
    if (!form.fullName.trim() || !form.email.trim()) {
      throw new Error("Full name and email are required");
    }

    const res = await fetch(`${API_BASE}/admin/users/${selectedUserId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
      }),
    });

    const data = await parseJsonSafely(res);
    if (!res.ok) {
      throw new Error(data?.error || `Failed to update ${roleLabel.toLowerCase()} (HTTP ${res.status})`);
    }
  };

  const submitModal = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      if (modalMode === "create") {
        await handleCreateUser();
        setMessage(`${roleLabel} added successfully`);
      } else {
        await handleEditUser();
        setMessage(`${roleLabel} updated successfully`);
      }
      resetModal();
      await loadUsers();
    } catch (e) {
      setError(e.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const updateUserStatus = async (userId, active) => {
    setUpdatingUserId(userId);
    setError("");
    setMessage("");

    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ active }),
      });

      const data = await parseJsonSafely(res);
      if (!res.ok) throw new Error(data?.error || `Failed to update status (HTTP ${res.status})`);

      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, active } : u)));
      setMessage(`${roleLabel} marked as ${active ? "active" : "inactive"}`);
    } catch (e) {
      setError(e.message || "Failed to update status");
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <section className="sf-page">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="sf-title">{roleLabel} Management</h1>
          <p className="sf-subtitle mt-1">Manage {roleLabel.toLowerCase()} users with add, update, and active controls.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="sf-btn-secondary" type="button" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
          <button className="sf-btn-primary" type="button" onClick={openAddModal}>Add {roleLabel}</button>
        </div>
      </div>

      {message && <div className="mb-3 rounded-xl border border-emerald-200 bg-emerald-100 px-4 py-3 text-sm text-emerald-800">{message}</div>}
      {error && <div className="mb-3 rounded-xl border border-rose-200 bg-rose-100 px-4 py-3 text-sm text-rose-800">{error}</div>}

      <div className="overflow-hidden rounded-2xl border border-slate-900/15 bg-white shadow-sm">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="border-b border-slate-300/50 bg-slate-100 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-700">Name</th>
              <th className="border-b border-slate-300/50 bg-slate-100 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-700">Email</th>
              <th className="border-b border-slate-300/50 bg-slate-100 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-700">Status</th>
              <th className="border-b border-slate-300/50 bg-slate-100 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loadingUsers ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-sm font-semibold text-slate-500">Loading {roleLabel.toLowerCase()} data...</td>
              </tr>
            ) : managedUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-sm font-semibold text-slate-500">No {roleLabel.toLowerCase()} users found.</td>
              </tr>
            ) : (
              managedUsers.map((user) => (
                <tr key={user.id} className="bg-white/90">
                  <td className="border-b border-slate-300/30 px-4 py-3 text-sm text-slate-700">{user.fullName}</td>
                  <td className="border-b border-slate-300/30 px-4 py-3 text-sm text-slate-700">{user.email}</td>
                  <td className="border-b border-slate-300/30 px-4 py-3 text-sm text-slate-700">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${user.active ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                      {user.active ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </td>
                  <td className="border-b border-slate-300/30 px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700" type="button" onClick={() => openEditModal(user)}>
                        Update
                      </button>
                      {user.active ? (
                        <button
                          className="rounded-xl bg-rose-700 px-3 py-1.5 text-xs font-semibold text-white"
                          type="button"
                          onClick={() => updateUserStatus(user.id, false)}
                          disabled={updatingUserId === user.id}
                        >
                          {updatingUserId === user.id ? "Saving..." : "Set Inactive"}
                        </button>
                      ) : (
                        <button
                          className="rounded-xl bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white"
                          type="button"
                          onClick={() => updateUserStatus(user.id, true)}
                          disabled={updatingUserId === user.id}
                        >
                          {updatingUserId === user.id ? "Saving..." : "Set Active"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
            <h2 className="mb-4 text-xl font-bold text-slate-900">{modalMode === "create" ? `Add ${roleLabel}` : `Update ${roleLabel}`}</h2>
            <form onSubmit={submitModal} className="grid gap-3">
              <label className="text-sm font-semibold text-slate-700">Full Name</label>
              <input
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                value={form.fullName}
                onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
                placeholder={`${roleLabel} full name`}
                required
              />

              <label className="text-sm font-semibold text-slate-700">Email</label>
              <input
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder={`${roleLabel.toLowerCase()}@example.com`}
                required
              />

              {modalMode === "create" && (
                <>
                  <label className="text-sm font-semibold text-slate-700">Password</label>
                  <input
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                    required
                  />

                  <label className="text-sm font-semibold text-slate-700">Confirm Password</label>
                  <input
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                  />
                </>
              )}

              <div className="mt-2 flex justify-end gap-2">
                <button className="sf-btn-secondary" type="button" onClick={resetModal} disabled={submitting}>Cancel</button>
                <button className="sf-btn-primary" type="submit" disabled={submitting}>
                  {submitting ? "Saving..." : modalMode === "create" ? `Add ${roleLabel}` : `Update ${roleLabel}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminUsers;
