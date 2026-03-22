import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

const Facilities = () => {
  const { token, user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    type: "LAB",
    location: "",
    capacity: "",
    status: "AVAILABLE",
    description: "",
  });

  const fetchFacilities = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/facilities`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to load facilities");
      }
      setFacilities(data);
    } catch (e) {
      setError(e.message || "Failed to load facilities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, [token]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const payload = {
        ...form,
        capacity: Number(form.capacity),
      };

      const res = await fetch(`${API_BASE}/facilities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create facility");
      }

      setForm({ name: "", type: "LAB", location: "", capacity: "", status: "AVAILABLE", description: "" });
      fetchFacilities();
    } catch (e) {
      setError(e.message || "Failed to create facility");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this facility?")) return;

    try {
      const res = await fetch(`${API_BASE}/facilities/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete facility");
      }
      fetchFacilities();
    } catch (e) {
      setError(e.message || "Failed to delete facility");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Facilities Catalogue</h2>
      <p style={styles.subtitle}>Manage facility inventory, availability, and capacity.</p>

      {error && <p style={styles.error}>{error}</p>}

      {isAdmin && (
        <form onSubmit={handleCreate} style={styles.form}>
          <input
            style={styles.input}
            placeholder="Facility Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            style={styles.input}
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            required
          />
          <input
            style={styles.input}
            type="number"
            placeholder="Capacity"
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: e.target.value })}
            required
          />
          <select
            style={styles.input}
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="LAB">LAB</option>
            <option value="HALL">HALL</option>
            <option value="CLASSROOM">CLASSROOM</option>
            <option value="MEETING_ROOM">MEETING_ROOM</option>
          </select>
          <select
            style={styles.input}
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="UNDER_MAINTENANCE">UNDER_MAINTENANCE</option>
            <option value="UNAVAILABLE">UNAVAILABLE</option>
          </select>
          <input
            style={styles.input}
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <button style={styles.button} type="submit">Add Facility</button>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Location</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {facilities.map((f) => (
              <tr key={f.id}>
                <td>{f.name}</td>
                <td>{f.type}</td>
                <td>{f.location}</td>
                <td>{f.capacity}</td>
                <td>{f.status}</td>
                <td>
                  {isAdmin ? (
                    <button style={styles.deleteBtn} onClick={() => handleDelete(f.id)}>Delete</button>
                  ) : (
                    <span style={styles.readOnly}>Read-only</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    background: "linear-gradient(180deg, rgba(255,255,255,0.52), rgba(236,243,255,0.45))",
    border: "1px solid rgba(15, 23, 42, 0.08)",
    borderRadius: "18px",
    boxShadow: "0 20px 40px rgba(15, 23, 42, 0.08)",
  },
  title: {
    fontSize: "30px",
    color: "#18253f",
    margin: 0,
    letterSpacing: "-0.02em",
  },
  subtitle: {
    color: "#52627f",
    fontSize: "14px",
    marginTop: "6px",
    marginBottom: "16px",
  },
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "10px",
    marginBottom: "20px",
    background: "rgba(255,255,255,0.72)",
    border: "1px solid rgba(15, 23, 42, 0.08)",
    borderRadius: "14px",
    padding: "12px",
  },
  input: {
    padding: "10px",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  button: {
    background: "linear-gradient(135deg, #111827, #1e293b)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    padding: "10px",
    fontWeight: "600",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "rgba(255,255,255,0.84)",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid rgba(15, 23, 42, 0.12)",
  },
  deleteBtn: {
    backgroundColor: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    padding: "6px 10px",
    fontWeight: "600",
  },
  error: {
    color: "#991b1b",
    backgroundColor: "#fee2e2",
    border: "1px solid #fecaca",
    borderRadius: "10px",
    padding: "10px",
    marginBottom: "10px",
  },
  readOnly: {
    color: "#666",
    fontSize: "13px",
  },
};

export default Facilities;
