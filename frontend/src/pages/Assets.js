import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import PageHeader from "../components/PageHeader.js";
import AppModal from "../components/AppModal";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

const emptyForm = {
  assetName: "",
  category: "",
  serialNumber: "",
  condition: "GOOD",
  facilityId: "",
};

const parseJsonSafely = async (response) => {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const getConditionClass = (condition) => {
  if (condition === "GOOD") return "bg-emerald-100 text-emerald-800";
  if (condition === "NEEDS_REPAIR") return "bg-amber-100 text-amber-800";
  return "bg-rose-100 text-rose-800";
};

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
      const assetsUrl = filterFacilityId === "ALL"
        ? `${API_BASE}/assets`
        : `${API_BASE}/assets/facility/${filterFacilityId}`;

      const [fRes, aRes] = await Promise.all([
        fetch(`${API_BASE}/facilities`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(assetsUrl, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const fData = await parseJsonSafely(fRes);
      const aData = await parseJsonSafely(aRes);

      if (!fRes.ok) throw new Error(fData?.error || `Failed to load facilities (HTTP ${fRes.status})`);
      if (!aRes.ok) throw new Error(aData?.error || `Failed to load assets (HTTP ${aRes.status})`);

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

      const url = modalMode === "create" ? `${API_BASE}/assets` : `${API_BASE}/assets/${selectedId}`;
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
      if (!res.ok) throw new Error(data?.error || `Failed to ${modalMode} asset (HTTP ${res.status})`);

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
      if (!res.ok) throw new Error(data?.error || `Failed to delete asset (HTTP ${res.status})`);
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
    <section className="sf-page">
      <PageHeader
        breadcrumb="Operations / Assets"
        title="Assets Catalogue"
        subtitle="Track all equipment across facilities with instant filtering."
        actions={isAdmin ? <button className="sf-btn-primary" type="button" onClick={openAddModal}>Add Asset</button> : null}
      />

      {message && <p className="mb-3 rounded-xl border border-emerald-200 bg-emerald-100 px-4 py-3 text-sm text-emerald-800">{message}</p>}
      {error && <p className="mb-3 rounded-xl border border-rose-200 bg-rose-100 px-4 py-3 text-sm text-rose-800">{error}</p>}

      <div className="mb-3 text-sm font-semibold text-slate-700">
        <label>Filter by Facility:&nbsp;</label>
        <select className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm" value={filterFacilityId} onChange={(e) => setFilterFacilityId(e.target.value)}>
          <option value="ALL">All</option>
          {facilities.map((f) => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="sf-card py-8 text-center text-slate-600">Loading assets...</div>
      ) : assets.length === 0 ? (
        <div className="sf-card border-dashed border-slate-300 bg-white/80 p-6 text-center">
          <p className="text-lg font-semibold text-slate-700">No assets found</p>
          <p className="mt-1 text-sm text-slate-500">Try a different facility filter or add a new asset.</p>
          {isAdmin && <button className="mt-4 sf-btn-primary" type="button" onClick={openAddModal}>Add Asset</button>}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-900/15 bg-white/90">
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="border-b border-slate-300/50 bg-indigo-50 px-4 py-3 text-left text-sm font-bold text-slate-700">Asset</th>
                <th className="border-b border-slate-300/50 bg-indigo-50 px-4 py-3 text-left text-sm font-bold text-slate-700">Category</th>
                <th className="border-b border-slate-300/50 bg-indigo-50 px-4 py-3 text-left text-sm font-bold text-slate-700">Serial</th>
                <th className="border-b border-slate-300/50 bg-indigo-50 px-4 py-3 text-left text-sm font-bold text-slate-700">Condition</th>
                <th className="border-b border-slate-300/50 bg-indigo-50 px-4 py-3 text-left text-sm font-bold text-slate-700">Facility</th>
                <th className="border-b border-slate-300/50 bg-indigo-50 px-4 py-3 text-left text-sm font-bold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((a) => (
                <tr key={a.id} className="bg-white/90">
                  <td className="border-b border-slate-300/30 px-4 py-3 text-sm text-slate-700">{a.assetName}</td>
                  <td className="border-b border-slate-300/30 px-4 py-3 text-sm text-slate-700">{a.category}</td>
                  <td className="border-b border-slate-300/30 px-4 py-3 font-mono text-sm text-slate-700">{a.serialNumber}</td>
                  <td className="border-b border-slate-300/30 px-4 py-3 text-sm text-slate-700">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${getConditionClass(a.condition)}`}>{a.condition}</span>
                  </td>
                  <td className="border-b border-slate-300/30 px-4 py-3 text-sm text-slate-700">{facilityName(a.facilityId)}</td>
                  <td className="border-b border-slate-300/30 px-4 py-3">
                    {isAdmin ? (
                      <div className="flex flex-wrap gap-2">
                        <button className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700" type="button" onClick={() => openEditModal(a)}>Update</button>
                        <button className="rounded-xl bg-rose-700 px-3 py-1.5 text-xs font-semibold text-white" type="button" onClick={() => handleDelete(a.id)}>Delete</button>
                      </div>
                    ) : (
                      <span className="text-xs font-semibold text-slate-500">Read-only</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <AppModal onClose={resetModal}>
          <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
            <h3 className="mb-4 text-xl font-bold text-slate-900">{modalMode === "create" ? "Add Asset" : "Update Asset"}</h3>
            <form onSubmit={submitModal} className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Asset Name" value={form.assetName} onChange={(e) => setForm((prev) => ({ ...prev, assetName: e.target.value }))} required />
              <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Category" value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))} required />
              <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Serial Number" value={form.serialNumber} onChange={(e) => setForm((prev) => ({ ...prev, serialNumber: e.target.value }))} required />
              <select className="rounded-xl border border-slate-300 px-3 py-2 text-sm" value={form.condition} onChange={(e) => setForm((prev) => ({ ...prev, condition: e.target.value }))}>
                <option value="GOOD">GOOD</option>
                <option value="NEEDS_REPAIR">NEEDS_REPAIR</option>
                <option value="OUT_OF_SERVICE">OUT_OF_SERVICE</option>
              </select>
              <select className="rounded-xl border border-slate-300 px-3 py-2 text-sm" value={form.facilityId} onChange={(e) => setForm((prev) => ({ ...prev, facilityId: e.target.value }))} required>
                <option value="">Select Facility</option>
                {facilities.map((f) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
              <div className="col-span-full mt-2 flex justify-end gap-2">
                <button type="button" className="sf-btn-secondary" onClick={resetModal} disabled={submitting}>Cancel</button>
                <button type="submit" className="sf-btn-primary" disabled={submitting}>
                  {submitting ? "Saving..." : modalMode === "create" ? "Add Asset" : "Update Asset"}
                </button>
              </div>
            </form>
          </div>
        </AppModal>
      )}
    </section>
  );
};

export default Assets;
