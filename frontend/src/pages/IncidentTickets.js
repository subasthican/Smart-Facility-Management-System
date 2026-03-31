import React, { useState, useEffect } from 'react';
import axios from 'axios';

const IncidentTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    location: '',
    resourceType: '',
    resourceId: '',
    priority: 'MEDIUM',
    status: 'OPEN',
    reportedBy: 'admin@gmail.com', // Assuming logged in user
    assignedTo: '',
    technicianNotes: '',
    imageUrl: ''
  });
  const [editingTicket, setEditingTicket] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await axios.get('/api/incident-tickets');
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const handleCreateTicket = async () => {
    try {
      await axios.post('/api/incident-tickets', newTicket);
      setNewTicket({
        title: '',
        description: '',
        location: '',
        resourceType: '',
        resourceId: '',
        priority: 'MEDIUM',
        status: 'OPEN',
        reportedBy: 'admin@gmail.com',
        assignedTo: '',
        technicianNotes: '',
        imageUrl: ''
      });
      fetchTickets();
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

  const handleUpdateTicket = async (id, updatedTicket) => {
    try {
      await axios.put(`/api/incident-tickets/${id}`, updatedTicket);
      setEditingTicket(null);
      fetchTickets();
    } catch (error) {
      console.error('Error updating ticket:', error);
    }
  };

  const handleDeleteTicket = async (id) => {
    try {
      await axios.delete(`/api/incident-tickets/${id}`);
      fetchTickets();
    } catch (error) {
      console.error('Error deleting ticket:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Incident Tickets</h1>

      {/* Create Ticket Form */}
      <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
        <h2>Create New Ticket</h2>
        <input
          type="text"
          placeholder="Title"
          value={newTicket.title}
          onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
          style={{ display: 'block', marginBottom: '10px', width: '100%' }}
        />
        <textarea
          placeholder="Description"
          value={newTicket.description}
          onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
          style={{ display: 'block', marginBottom: '10px', width: '100%', height: '60px' }}
        />
        <input
          type="text"
          placeholder="Location"
          value={newTicket.location}
          onChange={(e) => setNewTicket({ ...newTicket, location: e.target.value })}
          style={{ display: 'block', marginBottom: '10px', width: '100%' }}
        />
        <select
          value={newTicket.priority}
          onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
          style={{ display: 'block', marginBottom: '10px' }}
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
        <button onClick={handleCreateTicket} style={{ padding: '10px 20px' }}>Create Ticket</button>
      </div>

      {/* Tickets List */}
      <div>
        <h2>All Tickets</h2>
        {tickets.map(ticket => (
          <div key={ticket.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <h3>{ticket.title}</h3>
            <p><strong>Description:</strong> {ticket.description}</p>
            <p><strong>Location:</strong> {ticket.location}</p>
            <p><strong>Priority:</strong> {ticket.priority}</p>
            <p><strong>Status:</strong> {ticket.status}</p>
            <p><strong>Reported By:</strong> {ticket.reportedBy}</p>
            <p><strong>Assigned To:</strong> {ticket.assignedTo}</p>
            <p><strong>Technician Notes:</strong> {ticket.technicianNotes}</p>
            {ticket.imageUrl && <img src={ticket.imageUrl} alt="Ticket" style={{ maxWidth: '200px' }} />}
            <div style={{ marginTop: '10px' }}>
              <button onClick={() => setEditingTicket(ticket)} style={{ marginRight: '10px' }}>Edit</button>
              <button onClick={() => handleDeleteTicket(ticket.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal/Form */}
      {editingTicket && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '5px', width: '500px' }}>
            <h2>Edit Ticket</h2>
            <input
              type="text"
              value={editingTicket.title}
              onChange={(e) => setEditingTicket({ ...editingTicket, title: e.target.value })}
              style={{ display: 'block', marginBottom: '10px', width: '100%' }}
            />
            <textarea
              value={editingTicket.description}
              onChange={(e) => setEditingTicket({ ...editingTicket, description: e.target.value })}
              style={{ display: 'block', marginBottom: '10px', width: '100%', height: '60px' }}
            />
            <input
              type="text"
              value={editingTicket.location}
              onChange={(e) => setEditingTicket({ ...editingTicket, location: e.target.value })}
              style={{ display: 'block', marginBottom: '10px', width: '100%' }}
            />
            <select
              value={editingTicket.priority}
              onChange={(e) => setEditingTicket({ ...editingTicket, priority: e.target.value })}
              style={{ display: 'block', marginBottom: '10px' }}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
            <select
              value={editingTicket.status}
              onChange={(e) => setEditingTicket({ ...editingTicket, status: e.target.value })}
              style={{ display: 'block', marginBottom: '10px' }}
            >
              <option value="OPEN">Open</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="CLOSED">Closed</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <input
              type="text"
              placeholder="Assigned To (email)"
              value={editingTicket.assignedTo || ''}
              onChange={(e) => setEditingTicket({ ...editingTicket, assignedTo: e.target.value })}
              style={{ display: 'block', marginBottom: '10px', width: '100%' }}
            />
            <textarea
              placeholder="Technician Notes"
              value={editingTicket.technicianNotes || ''}
              onChange={(e) => setEditingTicket({ ...editingTicket, technicianNotes: e.target.value })}
              style={{ display: 'block', marginBottom: '10px', width: '100%', height: '60px' }}
            />
            <input
              type="text"
              placeholder="Image URL"
              value={editingTicket.imageUrl || ''}
              onChange={(e) => setEditingTicket({ ...editingTicket, imageUrl: e.target.value })}
              style={{ display: 'block', marginBottom: '10px', width: '100%' }}
            />
            <button onClick={() => handleUpdateTicket(editingTicket.id, editingTicket)} style={{ marginRight: '10px' }}>Update</button>
            <button onClick={() => setEditingTicket(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentTickets;