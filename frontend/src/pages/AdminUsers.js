import React, { useState } from "react";
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
    } catch (e) {
      setError(e.message || "Failed to create user");
    } finally {
      setSubmitting(false);
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
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)"
  },
  formTitle: { fontSize: "20px", fontWeight: "700", color: "#1f2937", marginBottom: "24px" },
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
  }
};

export default AdminUsers;
