import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8081/api";

const getLocalDatetimeInputValue = (date) => {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
};

const CreateBooking = () => {
  const [facilityName, setFacilityName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();
  const nowIso = getLocalDatetimeInputValue(new Date());

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!facilityName || !startTime || !endTime) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (new Date(startTime) < new Date()) {
      setError("Start time cannot be in the past");
      setLoading(false);
      return;
    }

    if (new Date(startTime) >= new Date(endTime)) {
      setError("End time must be after start time");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/bookings`, {
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
    <div className="flex min-h-[80vh] items-center justify-center px-5 py-8">
      <div className="sf-auth-card w-full max-w-xl p-10">
        <h2 className="text-center text-3xl font-bold tracking-tight sf-title">Create New Booking</h2>
        <p className="mb-4 mt-1 text-center text-sm sf-subtitle">Reserve facilities with precision scheduling.</p>
        {error && <p className="mb-3 rounded-xl border border-rose-200 bg-rose-100 px-4 py-3 text-center text-sm text-rose-800">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label className="sf-label">Facility Name *</label>
          <select
            value={facilityName}
            onChange={(e) => setFacilityName(e.target.value)}
            className="sf-input mb-4"
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

          <label className="sf-label">Start Time *</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="sf-input mb-4"
            min={nowIso}
            required
          />

          <label className="sf-label">End Time *</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="sf-input mb-4"
            min={startTime || nowIso}
            required
          />

          <label className="sf-label">Notes (Optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="sf-input mb-4 min-h-[100px] resize-y"
            placeholder="Any special requests or notes..."
          />

          <button
            type="submit"
            disabled={loading}
            className={`sf-btn-primary w-full py-3 text-base ${loading ? "cursor-not-allowed opacity-60" : ""}`}
          >
            {loading ? "Creating..." : "Create Booking"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBooking;
