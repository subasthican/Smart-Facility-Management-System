import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CreateBooking = () => {
  const [facilityName, setFacilityName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!facilityName || !startTime || !endTime) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (new Date(startTime) >= new Date(endTime)) {
      setError("End time must be after start time");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          facilityName,
          startTime: new Date(startTime).toISOString(),
          endTime: new Date(endTime).toISOString(),
          notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create booking");
      }

      navigate("/bookings");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create New Booking</h2>
        <p style={styles.subtitle}>Reserve facilities with precision scheduling.</p>
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Facility Name *</label>
          <select
            value={facilityName}
            onChange={(e) => setFacilityName(e.target.value)}
            style={styles.input}
            required
          >
            <option value="">Select a facility</option>
            <option value="Auditorium">Auditorium</option>
            <option value="Library Room A">Library Room A</option>
            <option value="Library Room B">Library Room B</option>
            <option value="Conference Hall">Conference Hall</option>
            <option value="Lab 101">Lab 101</option>
            <option value="Lab 102">Lab 102</option>
            <option value="Sports Field">Sports Field</option>
          </select>

          <label style={styles.label}>Start Time *</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            style={styles.input}
            required
          />

          <label style={styles.label}>End Time *</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            style={styles.input}
            required
          />

          <label style={styles.label}>Notes (Optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{ ...styles.input, minHeight: "100px", resize: "vertical" }}
            placeholder="Any special requests or notes..."
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Creating..." : "Create Booking"}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "80vh",
    padding: "20px",
  },
  card: {
    background: "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(243,247,255,0.88))",
    padding: "40px",
    borderRadius: "18px",
    boxShadow: "0 24px 50px rgba(15, 23, 42, 0.12)",
    border: "1px solid rgba(15, 23, 42, 0.1)",
    width: "100%",
    maxWidth: "500px",
  },
  title: {
    textAlign: "center",
    marginBottom: "6px",
    color: "#111827",
    fontSize: "30px",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: "18px",
    color: "#64748b",
    fontSize: "14px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    color: "#334155",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    marginBottom: "15px",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    fontSize: "14px",
    boxSizing: "border-box",
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(135deg, #111827, #1e293b)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "700",
  },
  error: {
    color: "#991b1b",
    textAlign: "center",
    marginBottom: "10px",
    padding: "10px",
    backgroundColor: "#fee2e2",
    borderRadius: "8px",
    border: "1px solid #fecaca",
  },
};

export default CreateBooking;
