import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/IncidentTickets.css";

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
    } catch (error) {
      console.error("Error fetching tickets:", error);
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
      await axios.post(
        `${API_BASE}/incident-tickets`,
        { ...newTicket, reportedBy: user?.email || "" },
        { headers: authHeaders }
      );
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
    } catch (error) {
      console.error("Error creating ticket:", error);
      setError("Unable to create ticket right now.");
    }
  };

  const handleUpdateTicket = async (id, updatedTicket) => {
    try {
      setError("");
      await axios.put(`${API_BASE}/incident-tickets/${id}`, updatedTicket, {
        headers: authHeaders,
      });
      setEditingTicket(null);
      fetchTickets();
    } catch (error) {
      console.error("Error updating ticket:", error);
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
    } catch (error) {
      console.error("Error deleting ticket:", error);
      setError("Unable to delete ticket.");
    }
  };

  const priorityClass = (priority) => {
    if (priority === "HIGH") return "pill high";
    if (priority === "MEDIUM") return "pill medium";
    return "pill low";
  };

  const statusClass = (status) => {
    if (status === "CLOSED") return "pill closed";
    if (status === "IN_PROGRESS") return "pill progress";
    if (status === "ASSIGNED") return "pill assigned";
    if (status === "REJECTED") return "pill rejected";
    return "pill open";
  };

  return (
    <div className="tickets-page">
      <div className="tickets-shell">
        <div className="tickets-header">
          <h1>Incident Tickets</h1>
          <p>Create, track, and update facility incident requests.</p>
        </div>

        {error && <p className="tickets-error">{error}</p>}

        <div className="tickets-form-card">
          <h2>Create New Ticket</h2>
          <div className="tickets-form-grid">
            <input
              type="text"
              placeholder="Title"
              value={newTicket.title}
              onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
            />
            <input
              type="text"
              placeholder="Location"
              value={newTicket.location}
              onChange={(e) => setNewTicket({ ...newTicket, location: e.target.value })}
            />
          </div>
          <textarea
            placeholder="Description"
            value={newTicket.description}
            onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
          />
          <div className="tickets-form-actions">
            <select
              value={newTicket.priority}
              onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
            <button onClick={handleCreateTicket}>Create Ticket</button>
          </div>
        </div>

        <div className="tickets-list-wrap">
          <h2>All Tickets</h2>
          {loading ? (
            <p className="tickets-loading">Loading tickets...</p>
          ) : tickets.length === 0 ? (
            <p className="tickets-empty">No tickets yet. Create your first incident ticket above.</p>
          ) : (
            <div className="tickets-list">
              {tickets.map((ticket) => (
                <article key={ticket.id} className="ticket-item">
                  <div className="ticket-top">
                    <h3>{ticket.title}</h3>
                    <div className="ticket-pills">
                      <span className={priorityClass(ticket.priority)}>{ticket.priority}</span>
                      <span className={statusClass(ticket.status)}>{ticket.status}</span>
                    </div>
                  </div>
                  <p className="ticket-description">{ticket.description}</p>
                  <div className="ticket-meta">
                    <span>Location: {ticket.location || "-"}</span>
                    <span>Reported By: {ticket.reportedBy || "-"}</span>
                    <span>Assigned To: {ticket.assignedTo || "-"}</span>
                  </div>

                  {ticket.technicianNotes && (
                    <p className="ticket-notes">Technician Notes: {ticket.technicianNotes}</p>
                  )}

                  {ticket.imageUrl && <img src={ticket.imageUrl} alt="Ticket" className="ticket-image" />}

                  <div className="ticket-actions">
                    <button onClick={() => setEditingTicket(ticket)} className="secondary-btn">Edit</button>
                    <button onClick={() => handleDeleteTicket(ticket.id)} className="danger-btn">Delete</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {editingTicket && (
          <div className="ticket-modal-overlay">
            <div className="ticket-modal">
              <h2>Edit Ticket</h2>
              <input
                type="text"
                value={editingTicket.title}
                onChange={(e) => setEditingTicket({ ...editingTicket, title: e.target.value })}
              />
              <textarea
                value={editingTicket.description}
                onChange={(e) => setEditingTicket({ ...editingTicket, description: e.target.value })}
              />
              <input
                type="text"
                value={editingTicket.location || ""}
                onChange={(e) => setEditingTicket({ ...editingTicket, location: e.target.value })}
              />
              <div className="ticket-modal-grid">
                <select
                  value={editingTicket.priority}
                  onChange={(e) => setEditingTicket({ ...editingTicket, priority: e.target.value })}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
                <select
                  value={editingTicket.status}
                  onChange={(e) => setEditingTicket({ ...editingTicket, status: e.target.value })}
                >
                  <option value="OPEN">Open</option>
                  <option value="ASSIGNED">Assigned</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="CLOSED">Closed</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
              <input
                type="text"
                placeholder="Assigned To (email)"
                value={editingTicket.assignedTo || ""}
                onChange={(e) => setEditingTicket({ ...editingTicket, assignedTo: e.target.value })}
              />
              <textarea
                placeholder="Technician Notes"
                value={editingTicket.technicianNotes || ""}
                onChange={(e) => setEditingTicket({ ...editingTicket, technicianNotes: e.target.value })}
              />
              <input
                type="text"
                placeholder="Image URL"
                value={editingTicket.imageUrl || ""}
                onChange={(e) => setEditingTicket({ ...editingTicket, imageUrl: e.target.value })}
              />
              <div className="ticket-modal-actions">
                <button onClick={() => handleUpdateTicket(editingTicket.id, editingTicket)}>Update</button>
                <button onClick={() => setEditingTicket(null)} className="secondary-btn">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncidentTickets;