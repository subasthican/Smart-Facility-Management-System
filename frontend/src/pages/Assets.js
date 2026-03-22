import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

const getConditionStyle = (condition) => ({
  ...styles.pill,
  backgroundColor:
    condition === "GOOD"
      ? "#dcfce7"
      : condition === "NEEDS_REPAIR"
      ? "#fef3c7"
      : "#fee2e2",
  color:
    condition === "GOOD"
      ? "#166534"
      : condition === "NEEDS_REPAIR"
      ? "#92400e"
      : "#991b1b",
});

const Assets = () => {
  const { token, user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [assets, setAssets] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterFacilityId, setFilterFacilityId] = useState("ALL");
  const [form, setForm] = useState({
    assetName: "",
    category: "",
    serialNumber: "",
    condition: "GOOD",
    facilityId: "",
  });

  const fetchFacilities = async () => {
    const res = await fetch(`${API_BASE}/facilities`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  };

  const fetchAssets = async () => {
    const url =
      filterFacilityId === "ALL"
        ? `${API_BASE}/assets`
        : `${API_BASE}/assets/facility/${filterFacilityId}`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  };

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [fData, aData] = await Promise.all([fetchFacilities(), fetchAssets()]);
      setFacilities(fData);
      setAssets(aData);
    } catch (e) {
      setError("Failed to load assets data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token, filterFacilityId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        ...form,
        facilityId: Number(form.facilityId),
      };
      const res = await fetch(`${API_BASE}/assets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create asset");
      }
      setForm({ assetName: "", category: "", serialNumber: "", condition: "GOOD", facilityId: "" });
      loadData();
    } catch (e) {
      setError(e.message || "Failed to create asset");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this asset?")) return;
    try {
      const res = await fetch(`${API_BASE}/assets/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete asset");
      }
      loadData();
    } catch (e) {
      setError(e.message || "Failed to delete asset");
    }
  };

  const facilityName = (id) => {
    const found = facilities.find((f) => f.id === id);
    return found ? found.name : `#${id}`;
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Assets Catalogue</h2>
      <p style={styles.subtitle}>Track all equipment across facilities with instant filtering.</p>
      {error && <p style={styles.error}>{error}</p>}

      {isAdmin && (
        <form onSubmit={handleCreate} style={styles.form}>
          <input
            style={styles.input}
            placeholder="Asset Name"
            value={form.assetName}
            onChange={(e) => setForm({ ...form, assetName: e.target.value })}
            required
          />
          <input
            style={styles.input}
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          />
          <input
            style={styles.input}
            placeholder="Serial Number"
            value={form.serialNumber}
            onChange={(e) => setForm({ ...form, serialNumber: e.target.value })}
            required
          />
          <select
            style={styles.input}
            value={form.condition}
            onChange={(e) => setForm({ ...form, condition: e.target.value })}
          >
            <option value="GOOD">GOOD</option>
            <option value="NEEDS_REPAIR">NEEDS_REPAIR</option>
            <option value="OUT_OF_SERVICE">OUT_OF_SERVICE</option>
          </select>
          <select
            style={styles.input}
            value={form.facilityId}
            onChange={(e) => setForm({ ...form, facilityId: e.target.value })}
            required
          >
            <option value="">Select Facility</option>
            {facilities.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
          <button style={styles.button} type="submit">Add Asset</button>
        </form>
      )}

      <div style={styles.filterBar}>
        <label>Filter by Facility:&nbsp;</label>
        <select value={filterFacilityId} onChange={(e) => setFilterFacilityId(e.target.value)}>
          <option value="ALL">All</option>
          {facilities.map((f) => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p style={styles.loading}>Loading...</p>
      ) : assets.length === 0 ? (
        <div style={styles.emptyState}>No assets found for this filter.</div>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Asset</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Serial</th>
                <th style={styles.th}>Condition</th>
                <th style={styles.th}>Facility</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((a) => (
                <tr key={a.id} style={styles.row}>
                  <td style={styles.td}>{a.assetName}</td>
                  <td style={styles.td}>{a.category}</td>
                  <td style={{ ...styles.td, fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" }}>{a.serialNumber}</td>
                  <td style={styles.td}><span style={getConditionStyle(a.condition)}>{a.condition}</span></td>
                  <td style={styles.td}>{facilityName(a.facilityId)}</td>
                  <td style={styles.td}>
                    {isAdmin ? (
                      <button style={styles.deleteBtn} onClick={() => handleDelete(a.id)}>Delete</button>
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
  filterBar: {
    marginBottom: "12px",
    color: "#334155",
    fontWeight: "600",
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

export default Assets;
