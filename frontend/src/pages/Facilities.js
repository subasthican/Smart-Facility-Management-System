import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import PageHeader from "../components/PageHeader.js";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

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
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const getFacilityStatusClass = (status) => {
  if (status === "AVAILABLE") return "bg-emerald-100 text-emerald-800";
  if (status === "UNDER_MAINTENANCE") return "bg-amber-100 text-amber-800";
  return "bg-rose-100 text-rose-800";
};

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
      if (!res.ok) throw new Error(data?.error || `Failed to load facilities (HTTP ${res.status})`);
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

      const url = modalMode === "create" ? `${API_BASE}/facilities` : `${API_BASE}/facilities/${selectedId}`;
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
      if (!res.ok) throw new Error(data?.error || `Failed to ${modalMode} facility (HTTP ${res.status})`);

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
      if (!res.ok) throw new Error(data?.error || `Failed to delete facility (HTTP ${res.status})`);
      setMessage("Facility deleted successfully");
      await loadFacilities();
    } catch (e) {
      setError(e.message || "Failed to delete facility");
    }
  };

  return (
    <section className="sf-page">
      <PageHeader
        breadcrumb="Operations / Facilities"
        title="Facilities Catalogue"
        subtitle="Manage facility inventory, availability, and capacity."
        actions={isAdmin ? <button className="sf-btn-primary" type="button" onClick={openAddModal}>Add Facility</button> : null}
      />

      {message && <p className="mb-3 rounded-xl border border-emerald-200 bg-emerald-100 px-4 py-3 text-sm text-emerald-800">{message}</p>}
      {error && <p className="mb-3 rounded-xl border border-rose-200 bg-rose-100 px-4 py-3 text-sm text-rose-800">{error}</p>}

      {loading ? (
        <div className="sf-card py-8 text-center text-slate-600">Loading facilities...</div>
      ) : facilities.length === 0 ? (
        <div className="sf-card border-dashed border-slate-300 bg-white/80 p-6 text-center">
          <p className="text-lg font-semibold text-slate-700">No facilities available</p>
          <p className="mt-1 text-sm text-slate-500">Add your first facility to start managing spaces.</p>
          {isAdmin && <button className="mt-4 sf-btn-primary" type="button" onClick={openAddModal}>Add Facility</button>}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-900/15 bg-white/90">
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="border-b border-slate-300/50 bg-indigo-50 px-4 py-3 text-left text-sm font-bold text-slate-700">Name</th>
                <th className="border-b border-slate-300/50 bg-indigo-50 px-4 py-3 text-left text-sm font-bold text-slate-700">Type</th>
                <th className="border-b border-slate-300/50 bg-indigo-50 px-4 py-3 text-left text-sm font-bold text-slate-700">Location</th>
                <th className="border-b border-slate-300/50 bg-indigo-50 px-4 py-3 text-left text-sm font-bold text-slate-700">Capacity</th>
                <th className="border-b border-slate-300/50 bg-indigo-50 px-4 py-3 text-left text-sm font-bold text-slate-700">Status</th>
                <th className="border-b border-slate-300/50 bg-indigo-50 px-4 py-3 text-left text-sm font-bold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {facilities.map((f) => (
                <tr key={f.id} className="bg-white/90">
                  <td className="border-b border-slate-300/30 px-4 py-3 text-sm text-slate-700">{f.name}</td>
                  <td className="border-b border-slate-300/30 px-4 py-3 text-sm text-slate-700">{f.type}</td>
                  <td className="border-b border-slate-300/30 px-4 py-3 text-sm text-slate-700">{f.location}</td>
                  <td className="border-b border-slate-300/30 px-4 py-3 text-sm text-slate-700">{f.capacity}</td>
                  <td className="border-b border-slate-300/30 px-4 py-3 text-sm text-slate-700">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${getFacilityStatusClass(f.status)}`}>{f.status}</span>
                  </td>
                  <td className="border-b border-slate-300/30 px-4 py-3">
                    {isAdmin ? (
                      <div className="flex flex-wrap gap-2">
                        <button className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700" type="button" onClick={() => openEditModal(f)}>Update</button>
                        <button className="rounded-xl bg-rose-700 px-3 py-1.5 text-xs font-semibold text-white" type="button" onClick={() => handleDelete(f.id)}>Delete</button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4">
          <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
            <h3 className="mb-4 text-xl font-bold text-slate-900">{modalMode === "create" ? "Add Facility" : "Update Facility"}</h3>
            <form onSubmit={submitModal} className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Facility Name" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} required />
              <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Location" value={form.location} onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))} required />
              <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm" type="number" placeholder="Capacity" value={form.capacity} onChange={(e) => setForm((prev) => ({ ...prev, capacity: e.target.value }))} required />
              <select className="rounded-xl border border-slate-300 px-3 py-2 text-sm" value={form.type} onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}>
                <option value="LAB">LAB</option>
                <option value="HALL">HALL</option>
                <option value="CLASSROOM">CLASSROOM</option>
                <option value="MEETING_ROOM">MEETING_ROOM</option>
              </select>
              <select className="rounded-xl border border-slate-300 px-3 py-2 text-sm" value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}>
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="UNDER_MAINTENANCE">UNDER_MAINTENANCE</option>
                <option value="UNAVAILABLE">UNAVAILABLE</option>
              </select>
              <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Description" value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} />
              <div className="col-span-full mt-2 flex justify-end gap-2">
                <button type="button" className="sf-btn-secondary" onClick={resetModal} disabled={submitting}>Cancel</button>
                <button type="submit" className="sf-btn-primary" disabled={submitting}>
                  {submitting ? "Saving..." : modalMode === "create" ? "Add Facility" : "Update Facility"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Facilities;
