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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Password and Confirm Password do not match.");
      return;
    }

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

      setMessage(`User created successfully with ID ${data.userId}`);
      setForm({ fullName: "", email: "", password: "", confirmPassword: "", role: "STAFF" });
    } catch (e) {
      setError(e.message || "Failed to create user");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Admin - User Management</h2>
      {message && <p style={styles.success}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          style={styles.input}
          placeholder="Full Name"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          required
        />
        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          required
        />
        <select
          style={styles.input}
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="STAFF">STAFF</option>
          <option value="STUDENT">STUDENT</option>
        </select>
        <button style={styles.button} type="submit">Create User</button>
      </form>
    </div>
  );
};

const styles = {
  container: { padding: "20px", maxWidth: "700px", margin: "0 auto" },
  form: { display: "grid", gap: "10px", marginTop: "15px" },
  input: { padding: "10px", border: "1px solid #ccc", borderRadius: "6px" },
  button: {
    backgroundColor: "#1d1d1f",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    padding: "10px",
  },
  success: { color: "#2e7d32" },
  error: { color: "#d32f2f" },
};

export default AdminUsers;
