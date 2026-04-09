import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppModal from "../components/AppModal";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8081/api";

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
  const [recentCredentials, setRecentCredentials] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const roleLabel = managedRole === "STUDENT" ? "Student" : "Staff";

  const formatDateTime = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleString();
  };

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
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const openAddModal = () => {
    setError("");
    setMessage("");
    setRecentCredentials(null);
    setModalMode("create");
    setSelectedUserId(null);
    setForm(emptyForm);
    setShowPassword(false);
    setShowConfirmPassword(false);
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
    setShowPassword(false);
    setShowConfirmPassword(false);
    setIsModalOpen(true);
  };

  const handleCreateUser = async () => {
    if (!form.fullName.trim() || !form.email.trim()) {
      throw new Error("Full name and email are required");
    }
    if (form.password && form.password !== form.confirmPassword) {
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

    return data;
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
        const data = await handleCreateUser();
        const tempPassword = data?.temporaryPassword || form.password;
        setMessage(
          `${roleLabel} added successfully. Temporary password: ${tempPassword}. User must reset password on first login.`
        );
        setRecentCredentials({
          email: form.email.trim().toLowerCase(),
          role: managedRole,
          temporaryPassword: tempPassword,
        });
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

      <div className="sf-table-wrap">
        <table className="sf-table">
          <thead>
            <tr>
              <th className="sf-th">Name</th>
              <th className="sf-th">Email</th>
              <th className="sf-th">Temp Password</th>
              <th className="sf-th">Password Reset</th>
              <th className="sf-th">Last Changed</th>
              <th className="sf-th">Status</th>
              <th className="sf-th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loadingUsers ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-sm font-semibold sf-subtitle">Loading {roleLabel.toLowerCase()} data...</td>
              </tr>
            ) : managedUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-sm font-semibold sf-subtitle">No {roleLabel.toLowerCase()} users found.</td>
              </tr>
            ) : (
              managedUsers.map((user) => (
                <tr key={user.id}>
                  <td className="sf-td">{user.fullName}</td>
                  <td className="sf-td">{user.email}</td>
                  <td className="sf-td">
                    {user.temporaryPassword ? (
                      <code className="rounded bg-amber-100 px-2 py-1 text-xs text-amber-900">{user.temporaryPassword}</code>
                    ) : (
                      <span className="text-xs sf-subtitle">-</span>
                    )}
                  </td>
                  <td className="sf-td">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${user.mustResetPassword ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
                      {user.mustResetPassword ? "REQUIRED" : "COMPLETED"}
                    </span>
                  </td>
                  <td className="sf-td text-xs sf-subtitle">{formatDateTime(user.lastPasswordChangedAt)}</td>
                  <td className="sf-td">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${user.active ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                      {user.active ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </td>
                  <td className="sf-td">
                    <div className="flex flex-wrap gap-2">
                      <button className="sf-btn-secondary px-3 py-1.5 text-xs" type="button" onClick={() => openEditModal(user)}>
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

      {recentCredentials && (
        <div className="mt-4 rounded-xl border border-amber-300/40 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold">Temporary credentials generated</p>
          <p className="mt-1">Email: {recentCredentials.email}</p>
          <p className="mt-1">Temporary Password: <strong>{recentCredentials.temporaryPassword}</strong></p>
          <p className="mt-2 text-xs">Share this password with the user. They will be forced to reset it on first login.</p>
          <button
            className="sf-btn-secondary mt-3 px-3 py-1.5 text-xs"
            type="button"
            onClick={() => setRecentCredentials(null)}
          >
            Hide Temporary Password
          </button>
        </div>
      )}

      {isModalOpen && (
        <AppModal onClose={resetModal}>
          <div className="sf-modal-card">
            <h2 className="mb-5 text-2xl font-bold sf-title">{modalMode === "create" ? `Add ${roleLabel}` : `Update ${roleLabel}`}</h2>
            <form onSubmit={submitModal} className="grid gap-3">
              <label className="sf-label">Full Name</label>
              <input
                className="sf-input text-base"
                value={form.fullName}
                onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
                placeholder={`${roleLabel} full name`}
                required
              />

              <label className="sf-label">Email</label>
              <input
                className="sf-input text-base"
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder={`${roleLabel.toLowerCase()}@example.com`}
                required
              />

              {modalMode === "create" && (
                <>
                  <label className="sf-label">Password</label>
                  <div className="relative">
                    <input
                      className="sf-input pr-12 text-base"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                      placeholder="Leave blank to auto-generate"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold sf-subtitle"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>

                  <label className="sf-label">Confirm Password</label>
                  <div className="relative">
                    <input
                      className="sf-input pr-12 text-base"
                      type={showConfirmPassword ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirm only if password is entered"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold sf-subtitle"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
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
        </AppModal>
      )}
    </section>
  );
};

export default AdminUsers;
