import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

const AdminUsers = () => {
  const { token } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "STAFF",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState(null);

  const loadUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch(`${API_BASE}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to load users");
      }
      setUsers(data);
    } catch (e) {
      setError(e.message || "Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
  }, [token]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Password and Confirm Password do not match.");
      return;
    }

    setSubmitting(true);

    try {
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
          role: form.role,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create user");
      }

      setMessage(`✓ User created successfully with ID ${data.userId}`);
      setForm({ fullName: "", email: "", password: "", confirmPassword: "", role: "STAFF" });
      loadUsers();
    } catch (e) {
      setError(e.message || "Failed to create user");
    } finally {
      setSubmitting(false);
    }
  };

  const updateUserStatus = async (userId, active) => {
    setUpdatingUserId(userId);
    setMessage("");
    setError("");

    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ active }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update user status");
      }

      setMessage(`✓ User status updated to ${active ? "Active" : "Inactive"}`);
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, active } : u)));
    } catch (e) {
      setError(e.message || "Failed to update user status");
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>User Management</h1>
        <p style={styles.subtitle}>Create and manage system users</p>
      </div>

      <div style={styles.formContainer}>
        <h2 style={styles.formTitle}>Create New User</h2>
        
        {message && <div style={styles.success}>{message}</div>}
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              style={styles.input}
              placeholder="John Doe"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              placeholder="user@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Role</label>
            <select
              style={styles.input}
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="STAFF">STAFF</option>
              <option value="STUDENT">STUDENT</option>
            </select>
          </div>

          <button style={styles.button} type="submit" disabled={submitting}>
            {submitting ? "Creating user..." : "Create User"}
          </button>
        </form>
      </div>

      <div style={styles.listContainer}>
        <h2 style={styles.formTitle}>Manage User Status</h2>
        {loadingUsers ? (
          <p style={styles.helperText}>Loading users...</p>
        ) : users.length === 0 ? (
          <p style={styles.helperText}>No staff/student users found.</p>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td style={styles.td}>{u.fullName}</td>
                    <td style={styles.td}>{u.email}</td>
                    <td style={styles.td}>{u.role}</td>
                    <td style={styles.td}>
                      <span style={u.active ? styles.activePill : styles.inactivePill}>
                        {u.active ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {u.active ? (
                        <button
                          style={styles.deactivateBtn}
                          onClick={() => updateUserStatus(u.id, false)}
                          disabled={updatingUserId === u.id}
                        >
                          {updatingUserId === u.id ? "Updating..." : "Set Inactive"}
                        </button>
                      ) : (
                        <button
                          style={styles.activateBtn}
                          onClick={() => updateUserStatus(u.id, true)}
                          disabled={updatingUserId === u.id}
                        >
                          {updatingUserId === u.id ? "Updating..." : "Set Active"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: "700px", margin: "0 auto", padding: "32px 20px" },
  header: { marginBottom: "32px" },
  title: { fontSize: "32px", fontWeight: "700", color: "#1f2937", marginBottom: "8px" },
  subtitle: { fontSize: "16px", color: "#6b7280" },
  formContainer: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "32px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
    marginBottom: "24px",
  },
  listContainer: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
  },
  formTitle: { fontSize: "20px", fontWeight: "700", color: "#1f2937", marginBottom: "24px" },
  helperText: { color: "#64748b", fontWeight: "600" },
  form: { display: "grid", gap: "20px" },
  formGroup: { display: "flex", flexDirection: "column" },
  label: { marginBottom: "8px", color: "#374151", fontSize: "14px", fontWeight: "600" },
  input: {
    padding: "12px 16px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    transition: "all 0.3s ease",
    outline: "none"
  },
  button: {
    backgroundColor: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    padding: "12px 16px",
    fontWeight: "600",
    marginTop: "12px",
    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    boxShadow: "0 10px 30px rgba(99, 102, 241, 0.2)"
  },
  success: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "20px",
    border: "1px solid #bbf7d0"
  },
  error: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "20px",
    border: "1px solid #fecaca"
  },
  tableWrap: {
    border: "1px solid rgba(15, 23, 42, 0.12)",
    borderRadius: "12px",
    overflow: "hidden",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
  },
  th: {
    textAlign: "left",
    padding: "12px 14px",
    backgroundColor: "#eef2ff",
    color: "#25324b",
    fontWeight: "700",
    fontSize: "14px",
    borderBottom: "1px solid rgba(148,163,184,0.35)",
  },
  td: {
    padding: "12px 14px",
    color: "#334155",
    fontSize: "14px",
    borderBottom: "1px solid rgba(148,163,184,0.2)",
    verticalAlign: "middle",
  },
  activePill: {
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    backgroundColor: "#dcfce7",
    color: "#166534",
  },
  inactivePill: {
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  },
  activateBtn: {
    backgroundColor: "#059669",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "6px 10px",
    cursor: "pointer",
    fontWeight: "600",
  },
  deactivateBtn: {
    backgroundColor: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "6px 10px",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default AdminUsers;
