import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

const Facilities = () => {
  const { token } = useAuth();
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
      <h2>Facilities Catalogue</h2>

      {error && <p style={styles.error}>{error}</p>}

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
                  <button style={styles.deleteBtn} onClick={() => handleDelete(f.id)}>Delete</button>
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
  container: { padding: "20px" },
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
  },
  button: {
    backgroundColor: "#1d1d1f",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    padding: "10px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  deleteBtn: {
    backgroundColor: "#d64545",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    padding: "6px 10px",
  },
  error: {
    color: "#d64545",
    marginBottom: "10px",
  },
};

export default Facilities;
