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
  if (!text) {
    return null;
  }

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
    () => users.filter((user) => user.role === managedRole),
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
      if (!res.ok) {
        throw new Error(data?.error || `Failed to load users (HTTP ${res.status})`);
      }
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
    if (!selectedUserId) {
      throw new Error("Missing user ID for update");
    }
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
      if (!res.ok) {
        throw new Error(data?.error || `Failed to update status (HTTP ${res.status})`);
      }

      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, active } : u)));
      setMessage(`${roleLabel} marked as ${active ? "active" : "inactive"}`);
    } catch (e) {
      setError(e.message || "Failed to update status");
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.title}>{roleLabel} Management</h1>
          <p style={styles.subtitle}>Manage {roleLabel.toLowerCase()} users with add, update, and active controls.</p>
        </div>
        <div style={styles.headerActions}>
          <button style={styles.secondaryButton} type="button" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
          <button style={styles.primaryButton} type="button" onClick={openAddModal}>
            Add {roleLabel}
          </button>
        </div>
      </div>

      {message && <div style={styles.success}>{message}</div>}
      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loadingUsers ? (
              <tr>
                <td colSpan={4} style={styles.emptyRow}>Loading {roleLabel.toLowerCase()} data...</td>
              </tr>
            ) : managedUsers.length === 0 ? (
              <tr>
                <td colSpan={4} style={styles.emptyRow}>No {roleLabel.toLowerCase()} users found.</td>
              </tr>
            ) : (
              managedUsers.map((user) => (
                <tr key={user.id}>
                  <td style={styles.td}>{user.fullName}</td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>
                    <span style={user.active ? styles.activePill : styles.inactivePill}>
                      {user.active ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </td>
                  <td style={styles.tdActions}>
                    <button style={styles.editBtn} type="button" onClick={() => openEditModal(user)}>
                      Update
                    </button>
                    {user.active ? (
                      <button
                        style={styles.deactivateBtn}
                        type="button"
                        onClick={() => updateUserStatus(user.id, false)}
                        disabled={updatingUserId === user.id}
                      >
                        {updatingUserId === user.id ? "Saving..." : "Set Inactive"}
                      </button>
                    ) : (
                      <button
                        style={styles.activateBtn}
                        type="button"
                        onClick={() => updateUserStatus(user.id, true)}
                        disabled={updatingUserId === user.id}
                      >
                        {updatingUserId === user.id ? "Saving..." : "Set Active"}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>{modalMode === "create" ? `Add ${roleLabel}` : `Update ${roleLabel}`}</h2>
            <form onSubmit={submitModal} style={styles.form}>
              <label style={styles.label}>Full Name</label>
              <input
                style={styles.input}
                value={form.fullName}
                onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
                placeholder={`${roleLabel} full name`}
                required
              />

              <label style={styles.label}>Email</label>
              <input
                style={styles.input}
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder={`${roleLabel.toLowerCase()}@example.com`}
                required
              />

              {modalMode === "create" && (
                <>
                  <label style={styles.label}>Password</label>
                  <input
                    style={styles.input}
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                    required
                  />

                  <label style={styles.label}>Confirm Password</label>
                  <input
                    style={styles.input}
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                  />
                </>
              )}

              <div style={styles.modalActions}>
                <button style={styles.cancelBtn} type="button" onClick={resetModal} disabled={submitting}>
                  Cancel
                </button>
                <button style={styles.primaryButton} type="submit" disabled={submitting}>
                  {submitting ? "Saving..." : modalMode === "create" ? `Add ${roleLabel}` : `Update ${roleLabel}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  page: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "28px 20px",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  headerActions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  title: {
    fontSize: "30px",
    margin: 0,
    color: "#0f172a",
  },
  subtitle: {
    margin: "8px 0 0 0",
    color: "#475569",
  },
  success: {
    marginBottom: "14px",
    background: "#dcfce7",
    color: "#166534",
    border: "1px solid #bbf7d0",
    padding: "10px 12px",
    borderRadius: "8px",
    fontWeight: "600",
  },
  error: {
    marginBottom: "14px",
    background: "#fee2e2",
    color: "#991b1b",
    border: "1px solid #fecaca",
    padding: "10px 12px",
    borderRadius: "8px",
    fontWeight: "600",
  },
  tableWrap: {
    border: "1px solid rgba(15, 23, 42, 0.14)",
    borderRadius: "12px",
    overflow: "hidden",
    background: "#ffffff",
    boxShadow: "0 12px 28px rgba(15, 23, 42, 0.08)",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
  },
  th: {
    textAlign: "left",
    padding: "12px 14px",
    background: "#f1f5f9",
    color: "#1e293b",
    fontSize: "13px",
    letterSpacing: "0.03em",
    borderBottom: "1px solid rgba(148, 163, 184, 0.35)",
  },
  td: {
    padding: "12px 14px",
    borderBottom: "1px solid rgba(148, 163, 184, 0.2)",
    color: "#334155",
    fontSize: "14px",
  },
  tdActions: {
    padding: "10px 14px",
    borderBottom: "1px solid rgba(148, 163, 184, 0.2)",
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  emptyRow: {
    padding: "20px",
    textAlign: "center",
    color: "#64748b",
    fontWeight: "600",
  },
  activePill: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "999px",
    background: "#dcfce7",
    color: "#166534",
    fontSize: "12px",
    fontWeight: "700",
  },
  inactivePill: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "999px",
    background: "#fee2e2",
    color: "#991b1b",
    fontSize: "12px",
    fontWeight: "700",
  },
  primaryButton: {
    border: "none",
    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    color: "#ffffff",
    fontWeight: "700",
    borderRadius: "8px",
    padding: "10px 14px",
    cursor: "pointer",
  },
  secondaryButton: {
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#334155",
    fontWeight: "700",
    borderRadius: "8px",
    padding: "10px 14px",
    cursor: "pointer",
  },
  editBtn: {
    border: "1px solid #93c5fd",
    background: "#eff6ff",
    color: "#1d4ed8",
    fontWeight: "700",
    borderRadius: "8px",
    padding: "7px 10px",
    cursor: "pointer",
  },
  activateBtn: {
    border: "none",
    background: "#16a34a",
    color: "#ffffff",
    fontWeight: "700",
    borderRadius: "8px",
    padding: "7px 10px",
    cursor: "pointer",
  },
  deactivateBtn: {
    border: "none",
    background: "#dc2626",
    color: "#ffffff",
    fontWeight: "700",
    borderRadius: "8px",
    padding: "7px 10px",
    cursor: "pointer",
  },
  modalBackdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.48)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    padding: "18px",
  },
  modal: {
    width: "100%",
    maxWidth: "480px",
    background: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 20px 45px rgba(2, 6, 23, 0.3)",
    padding: "20px",
  },
  modalTitle: {
    marginTop: 0,
    marginBottom: "14px",
    color: "#0f172a",
  },
  form: {
    display: "grid",
    gap: "10px",
  },
  label: {
    color: "#334155",
    fontSize: "13px",
    fontWeight: "700",
  },
  input: {
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    padding: "10px 12px",
    fontSize: "14px",
    outline: "none",
  },
  modalActions: {
    marginTop: "10px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
  },
  cancelBtn: {
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#334155",
    borderRadius: "8px",
    padding: "10px 12px",
    cursor: "pointer",
    fontWeight: "700",
  },
};

export default AdminUsers;
