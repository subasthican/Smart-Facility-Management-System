import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8081/api";

const emptyForm = {
  name: "",
  type: "LAB",
  location: "",
  capacity: "",
  status: "AVAILABLE",
  description: "",
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
  const [message, setMessage] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedId, setSelectedId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const loadFacilities = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/facilities`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await parseJsonSafely(res);
      if (!res.ok) {
        throw new Error(data?.error || `Failed to load facilities (HTTP ${res.status})`);
      }
      setFacilities(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Failed to load facilities");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadFacilities();
  }, [loadFacilities]);

  const resetModal = () => {
    setIsModalOpen(false);
    setModalMode("create");
    setSelectedId(null);
    setForm(emptyForm);
  };

  const openAddModal = () => {
    setError("");
    setMessage("");
    setModalMode("create");
    setSelectedId(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (facility) => {
    setError("");
    setMessage("");
    setModalMode("edit");
    setSelectedId(facility.id);
    setForm({
      name: facility.name || "",
      type: facility.type || "LAB",
      location: facility.location || "",
      capacity: String(facility.capacity || ""),
      status: facility.status || "AVAILABLE",
      description: facility.description || "",
    });
    setIsModalOpen(true);
  };

  const submitModal = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      if (!form.name.trim() || !form.location.trim() || !form.capacity) {
        throw new Error("Name, location, and capacity are required");
      }

      const payload = {
        ...form,
        name: form.name.trim(),
        location: form.location.trim(),
        description: form.description.trim(),
        capacity: Number(form.capacity),
      };

      const url = modalMode === "create"
        ? `${API_BASE}/facilities`
        : `${API_BASE}/facilities/${selectedId}`;

      const method = modalMode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await parseJsonSafely(res);
      if (!res.ok) {
        throw new Error(data?.error || `Failed to ${modalMode} facility (HTTP ${res.status})`);
      }

      setMessage(modalMode === "create" ? "Facility added successfully" : "Facility updated successfully");
      resetModal();
      await loadFacilities();
    } catch (e) {
      setError(e.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this facility?")) return;

    setError("");
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/facilities/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await parseJsonSafely(res);
      if (!res.ok) {
        throw new Error(data?.error || `Failed to delete facility (HTTP ${res.status})`);
      }
      setMessage("Facility deleted successfully");
      await loadFacilities();
    } catch (e) {
      setError(e.message || "Failed to delete facility");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.title}>Facilities Catalogue</h2>
          <p style={styles.subtitle}>Manage facility inventory, availability, and capacity.</p>
        </div>
        {isAdmin && (
          <button style={styles.button} type="button" onClick={openAddModal}>
            Add Facility
          </button>
        )}
      </div>

      {message && <p style={styles.success}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}

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
                  <td style={styles.tdActions}>
                    {isAdmin ? (
                      <>
                        <button style={styles.editBtn} type="button" onClick={() => openEditModal(f)}>Update</button>
                        <button style={styles.deleteBtn} type="button" onClick={() => handleDelete(f.id)}>Delete</button>
                      </>
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

      {isModalOpen && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>{modalMode === "create" ? "Add Facility" : "Update Facility"}</h3>
            <form onSubmit={submitModal} style={styles.form}>
              <input
                style={styles.input}
                placeholder="Facility Name"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
              <input
                style={styles.input}
                placeholder="Location"
                value={form.location}
                onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                required
              />
              <input
                style={styles.input}
                type="number"
                placeholder="Capacity"
                value={form.capacity}
                onChange={(e) => setForm((prev) => ({ ...prev, capacity: e.target.value }))}
                required
              />
              <select
                style={styles.input}
                value={form.type}
                onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
              >
                <option value="LAB">LAB</option>
                <option value="HALL">HALL</option>
                <option value="CLASSROOM">CLASSROOM</option>
                <option value="MEETING_ROOM">MEETING_ROOM</option>
              </select>
              <select
                style={styles.input}
                value={form.status}
                onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
              >
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="UNDER_MAINTENANCE">UNDER_MAINTENANCE</option>
                <option value="UNAVAILABLE">UNAVAILABLE</option>
              </select>
              <input
                style={styles.input}
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              />
              <div style={styles.modalActions}>
                <button type="button" style={styles.cancelBtn} onClick={resetModal} disabled={submitting}>Cancel</button>
                <button type="submit" style={styles.button} disabled={submitting}>
                  {submitting ? "Saving..." : modalMode === "create" ? "Add Facility" : "Update Facility"}
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
  container: {
    padding: "20px",
    background: "linear-gradient(180deg, rgba(255,255,255,0.52), rgba(236,243,255,0.45))",
    border: "1px solid rgba(15, 23, 42, 0.08)",
    borderRadius: "18px",
    boxShadow: "0 20px 40px rgba(15, 23, 42, 0.08)",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
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
    padding: "10px 12px",
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
  tdActions: {
    padding: "10px 14px",
    borderBottom: "1px solid rgba(148,163,184,0.2)",
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
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
  editBtn: {
    border: "1px solid #93c5fd",
    background: "#eff6ff",
    color: "#1d4ed8",
    fontWeight: "700",
    borderRadius: "8px",
    padding: "7px 10px",
    cursor: "pointer",
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
  success: {
    color: "#166534",
    backgroundColor: "#dcfce7",
    border: "1px solid #bbf7d0",
    borderRadius: "10px",
    padding: "10px",
    marginBottom: "10px",
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
    maxWidth: "720px",
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

export default Facilities;
