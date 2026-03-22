import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

const getFacilityStatusStyle = (status) => ({
  ...styles.pill,
  backgroundColor:
    status === "AVAILABLE"
      ? "#dcfce7"
      : status === "UNDER_MAINTENANCE"
      ? "#fef3c7"
      : "#fee2e2",
  color:
    status === "AVAILABLE"
      ? "#166534"
      : status === "UNDER_MAINTENANCE"
      ? "#92400e"
      : "#991b1b",
});

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
        <p style={styles.loading}>Loading...</p>
      ) : facilities.length === 0 ? (
        <div style={styles.emptyState}>No facilities available.</div>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Location</th>
                <th style={styles.th}>Capacity</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {facilities.map((f) => (
                <tr key={f.id} style={styles.row}>
                  <td style={styles.td}>{f.name}</td>
                  <td style={styles.td}>{f.type}</td>
                  <td style={styles.td}>{f.location}</td>
                  <td style={styles.td}>{f.capacity}</td>
                  <td style={styles.td}><span style={getFacilityStatusStyle(f.status)}>{f.status}</span></td>
                  <td style={styles.td}>
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
        </div>
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
    borderCollapse: "separate",
    borderSpacing: 0,
    background: "rgba(255,255,255,0.84)",
  },
  tableWrap: {
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid rgba(15, 23, 42, 0.12)",
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
  row: {
    backgroundColor: "rgba(255,255,255,0.85)",
  },
  pill: {
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
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
    color: "#64748b",
    fontSize: "13px",
    fontWeight: "600",
  },
  loading: {
    color: "#475569",
    fontSize: "14px",
    padding: "14px 0",
  },
  emptyState: {
    color: "#475569",
    backgroundColor: "rgba(255,255,255,0.8)",
    border: "1px dashed rgba(100,116,139,0.4)",
    borderRadius: "12px",
    padding: "16px",
    textAlign: "center",
    fontWeight: "600",
  },
};

export default Facilities;
