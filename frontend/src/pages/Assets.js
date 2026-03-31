import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8081/api";

const emptyForm = {
  assetName: "",
  category: "",
  serialNumber: "",
  condition: "GOOD",
  facilityId: "",
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
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterFacilityId, setFilterFacilityId] = useState("ALL");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedId, setSelectedId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const assetsUrl =
        filterFacilityId === "ALL"
          ? `${API_BASE}/assets`
          : `${API_BASE}/assets/facility/${filterFacilityId}`;

      const [fRes, aRes] = await Promise.all([
        fetch(`${API_BASE}/facilities`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(assetsUrl, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const fData = await parseJsonSafely(fRes);
      const aData = await parseJsonSafely(aRes);

      if (!fRes.ok) {
        throw new Error(fData?.error || `Failed to load facilities (HTTP ${fRes.status})`);
      }
      if (!aRes.ok) {
        throw new Error(aData?.error || `Failed to load assets (HTTP ${aRes.status})`);
      }

      setFacilities(Array.isArray(fData) ? fData : []);
      setAssets(Array.isArray(aData) ? aData : []);
    } catch (e) {
      setError(e.message || "Failed to load assets data");
    } finally {
      setLoading(false);
    }
  }, [token, filterFacilityId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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

  const openEditModal = (asset) => {
    setError("");
    setMessage("");
    setModalMode("edit");
    setSelectedId(asset.id);
    setForm({
      assetName: asset.assetName || "",
      category: asset.category || "",
      serialNumber: asset.serialNumber || "",
      condition: asset.condition || "GOOD",
      facilityId: String(asset.facilityId || ""),
    });
    setIsModalOpen(true);
  };

  const submitModal = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      if (!form.assetName.trim() || !form.category.trim() || !form.serialNumber.trim() || !form.facilityId) {
        throw new Error("Asset name, category, serial number and facility are required");
      }

      const payload = {
        assetName: form.assetName.trim(),
        category: form.category.trim(),
        serialNumber: form.serialNumber.trim(),
        condition: form.condition,
        facilityId: Number(form.facilityId),
      };

      const url = modalMode === "create"
        ? `${API_BASE}/assets`
        : `${API_BASE}/assets/${selectedId}`;
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
        throw new Error(data?.error || `Failed to ${modalMode} asset (HTTP ${res.status})`);
      }

      setMessage(modalMode === "create" ? "Asset added successfully" : "Asset updated successfully");
      resetModal();
      await loadData();
    } catch (e) {
      setError(e.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this asset?")) return;
    setError("");
    setMessage("");

    try {
      const res = await fetch(`${API_BASE}/assets/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await parseJsonSafely(res);
      if (!res.ok) {
        throw new Error(data?.error || `Failed to delete asset (HTTP ${res.status})`);
      }
      setMessage("Asset deleted successfully");
      await loadData();
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
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.title}>Assets Catalogue</h2>
          <p style={styles.subtitle}>Track all equipment across facilities with instant filtering.</p>
        </div>
        {isAdmin && (
          <button style={styles.button} type="button" onClick={openAddModal}>Add Asset</button>
        )}
      </div>

      {message && <p style={styles.success}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}

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
                  <td style={styles.tdActions}>
                    {isAdmin ? (
                      <>
                        <button style={styles.editBtn} type="button" onClick={() => openEditModal(a)}>Update</button>
                        <button style={styles.deleteBtn} type="button" onClick={() => handleDelete(a.id)}>Delete</button>
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
            <h3 style={styles.modalTitle}>{modalMode === "create" ? "Add Asset" : "Update Asset"}</h3>
            <form onSubmit={submitModal} style={styles.form}>
              <input
                style={styles.input}
                placeholder="Asset Name"
                value={form.assetName}
                onChange={(e) => setForm((prev) => ({ ...prev, assetName: e.target.value }))}
                required
              />
              <input
                style={styles.input}
                placeholder="Category"
                value={form.category}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                required
              />
              <input
                style={styles.input}
                placeholder="Serial Number"
                value={form.serialNumber}
                onChange={(e) => setForm((prev) => ({ ...prev, serialNumber: e.target.value }))}
                required
              />
              <select
                style={styles.input}
                value={form.condition}
                onChange={(e) => setForm((prev) => ({ ...prev, condition: e.target.value }))}
              >
                <option value="GOOD">GOOD</option>
                <option value="NEEDS_REPAIR">NEEDS_REPAIR</option>
                <option value="OUT_OF_SERVICE">OUT_OF_SERVICE</option>
              </select>
              <select
                style={styles.input}
                value={form.facilityId}
                onChange={(e) => setForm((prev) => ({ ...prev, facilityId: e.target.value }))}
                required
              >
                <option value="">Select Facility</option>
                {facilities.map((f) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>

              <div style={styles.modalActions}>
                <button type="button" style={styles.cancelBtn} onClick={resetModal} disabled={submitting}>Cancel</button>
                <button type="submit" style={styles.button} disabled={submitting}>
                  {submitting ? "Saving..." : modalMode === "create" ? "Add Asset" : "Update Asset"}
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
  filterBar: {
    marginBottom: "12px",
    color: "#334155",
    fontWeight: "600",
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

export default Assets;
