import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

const IncidentTickets = () => {
  const { user, token } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    location: "",
    resourceType: "",
    resourceId: "",
    priority: "MEDIUM",
    status: "OPEN",
    reportedBy: "",
    assignedTo: "",
    technicianNotes: "",
    imageUrl: "",
  });
  const [editingTicket, setEditingTicket] = useState(null);

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const fetchTickets = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${API_BASE}/incident-tickets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(response.data);
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setError("Failed to load tickets. Check backend status and login session.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleCreateTicket = async () => {
    if (!newTicket.title.trim() || !newTicket.description.trim() || !newTicket.location.trim()) {
      setError("Please fill title, description, and location.");
      return;
    }

    try {
      setError("");
      await axios.post(`${API_BASE}/incident-tickets`, { ...newTicket, reportedBy: user?.email || "" }, { headers: authHeaders });
      setNewTicket({
        title: "",
        description: "",
        location: "",
        resourceType: "",
        resourceId: "",
        priority: "MEDIUM",
        status: "OPEN",
        reportedBy: "",
        assignedTo: "",
        technicianNotes: "",
        imageUrl: "",
      });
      fetchTickets();
    } catch (err) {
      console.error("Error creating ticket:", err);
      setError("Unable to create ticket right now.");
    }
  };

  const handleUpdateTicket = async (id, updatedTicket) => {
    try {
      setError("");
      await axios.put(`${API_BASE}/incident-tickets/${id}`, updatedTicket, { headers: authHeaders });
      setEditingTicket(null);
      fetchTickets();
    } catch (err) {
      console.error("Error updating ticket:", err);
      setError("Unable to update ticket.");
    }
  };

  const handleDeleteTicket = async (id) => {
    try {
      setError("");
      await axios.delete(`${API_BASE}/incident-tickets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTickets();
    } catch (err) {
      console.error("Error deleting ticket:", err);
      setError("Unable to delete ticket.");
    }
  };

  const priorityClass = (priority) => {
    if (priority === "HIGH") return "bg-rose-100 text-rose-800";
    if (priority === "MEDIUM") return "bg-amber-100 text-amber-800";
    return "bg-emerald-100 text-emerald-800";
  };

  const statusClass = (status) => {
    if (status === "CLOSED") return "bg-emerald-100 text-emerald-800";
    if (status === "IN_PROGRESS") return "bg-cyan-100 text-cyan-800";
    if (status === "ASSIGNED") return "bg-violet-100 text-violet-800";
    if (status === "REJECTED") return "bg-slate-100 text-slate-700";
    return "bg-blue-100 text-blue-800";
  };

  return (
    <section className="sf-page">
      <div className="mb-4">
        <h1 className="sf-title">Incident Tickets</h1>
        <p className="sf-subtitle mt-1">Create, track, and update facility incident requests.</p>
      </div>

      {error && <p className="mb-4 rounded-xl border border-rose-200 bg-rose-100 px-4 py-3 text-sm text-rose-800">{error}</p>}

      <div className="mb-4 rounded-2xl border border-slate-300/50 bg-white/90 p-4">
        <h2 className="mb-3 text-xl font-bold text-slate-800">Create New Ticket</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm" type="text" placeholder="Title" value={newTicket.title} onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })} />
          <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm" type="text" placeholder="Location" value={newTicket.location} onChange={(e) => setNewTicket({ ...newTicket, location: e.target.value })} />
        </div>
        <textarea className="mt-3 min-h-24 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Description" value={newTicket.description} onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })} />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <select className="rounded-xl border border-slate-300 px-3 py-2 text-sm" value={newTicket.priority} onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
          <button className="sf-btn-primary" onClick={handleCreateTicket}>Create Ticket</button>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-xl font-bold text-slate-800">All Tickets</h2>
        {loading ? (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white/80 p-6 text-center text-slate-600">Loading tickets...</p>
        ) : tickets.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white/80 p-6 text-center text-slate-600">No tickets yet. Create your first incident ticket above.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {tickets.map((ticket) => (
              <article key={ticket.id} className="rounded-xl border border-slate-300/60 bg-white/95 p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h3 className="text-lg font-bold text-slate-900">{ticket.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${priorityClass(ticket.priority)}`}>{ticket.priority}</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass(ticket.status)}`}>{ticket.status}</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-slate-700">{ticket.description}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-600">
                  <span>Location: {ticket.location || "-"}</span>
                  <span>Reported By: {ticket.reportedBy || "-"}</span>
                  <span>Assigned To: {ticket.assignedTo || "-"}</span>
                </div>

                {ticket.technicianNotes && <p className="mt-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">Technician Notes: {ticket.technicianNotes}</p>}
                {ticket.imageUrl && <img src={ticket.imageUrl} alt="Ticket" className="mt-3 max-w-[260px] rounded-lg border border-slate-300" />}

                <div className="mt-3 flex gap-2">
                  <button onClick={() => setEditingTicket(ticket)} className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">Edit</button>
                  <button onClick={() => handleDeleteTicket(ticket.id)} className="rounded-xl bg-rose-700 px-3 py-1.5 text-xs font-semibold text-white">Delete</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {editingTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
            <h2 className="mb-3 text-xl font-bold text-slate-900">Edit Ticket</h2>
            <div className="grid gap-3">
              <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm" type="text" value={editingTicket.title} onChange={(e) => setEditingTicket({ ...editingTicket, title: e.target.value })} />
              <textarea className="min-h-24 rounded-xl border border-slate-300 px-3 py-2 text-sm" value={editingTicket.description} onChange={(e) => setEditingTicket({ ...editingTicket, description: e.target.value })} />
              <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm" type="text" value={editingTicket.location || ""} onChange={(e) => setEditingTicket({ ...editingTicket, location: e.target.value })} />
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <select className="rounded-xl border border-slate-300 px-3 py-2 text-sm" value={editingTicket.priority} onChange={(e) => setEditingTicket({ ...editingTicket, priority: e.target.value })}>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
                <select className="rounded-xl border border-slate-300 px-3 py-2 text-sm" value={editingTicket.status} onChange={(e) => setEditingTicket({ ...editingTicket, status: e.target.value })}>
                  <option value="OPEN">Open</option>
                  <option value="ASSIGNED">Assigned</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="CLOSED">Closed</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
              <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm" type="text" placeholder="Assigned To (email)" value={editingTicket.assignedTo || ""} onChange={(e) => setEditingTicket({ ...editingTicket, assignedTo: e.target.value })} />
              <textarea className="min-h-20 rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Technician Notes" value={editingTicket.technicianNotes || ""} onChange={(e) => setEditingTicket({ ...editingTicket, technicianNotes: e.target.value })} />
              <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm" type="text" placeholder="Image URL" value={editingTicket.imageUrl || ""} onChange={(e) => setEditingTicket({ ...editingTicket, imageUrl: e.target.value })} />
              <div className="mt-1 flex justify-end gap-2">
                <button className="sf-btn-primary" onClick={() => handleUpdateTicket(editingTicket.id, editingTicket)}>Update</button>
                <button className="sf-btn-secondary" onClick={() => setEditingTicket(null)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default IncidentTickets;
