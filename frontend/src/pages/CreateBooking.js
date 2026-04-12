import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8081/api";
const MIN_BOOKING_MINUTES = 30;
const MAX_BOOKING_MINUTES = 5 * 60;
const OPEN_HOUR = 8;
const CLOSE_HOUR = 22;

const getLocalDatetimeInputValue = (date) => {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
};

const isWithinOperatingHours = (start, end) => {
  const startHour = start.getHours() + start.getMinutes() / 60;
  const endHour = end.getHours() + end.getMinutes() / 60;
  return startHour >= OPEN_HOUR && endHour <= CLOSE_HOUR;
};

const hasSameUserOverlap = (bookings, candidateStart, candidateEnd) => {
  return bookings.some((booking) => {
    if (!booking?.startTime || !booking?.endTime) return false;
    if (booking.status === "CANCELLED") return false;

    const existingStart = new Date(booking.startTime);
    const existingEnd = new Date(booking.endTime);

    return candidateStart < existingEnd && candidateEnd > existingStart;
  });
};

const hasFacilityOverlap = (bookings, candidateStart, candidateEnd) => {
  return bookings.some((booking) => {
    if (!booking?.startTime || !booking?.endTime) return false;
    if (booking.status === "CANCELLED") return false;

    const existingStart = new Date(booking.startTime);
    const existingEnd = new Date(booking.endTime);

    return candidateStart < existingEnd && candidateEnd > existingStart;
  });
};

const CreateBooking = () => {
  const [facilityName, setFacilityName] = useState("");
  const [facilities, setFacilities] = useState([]);
  const [loadingFacilities, setLoadingFacilities] = useState(true);
  const [facilityBookings, setFacilityBookings] = useState([]);
  const [loadingFacilityBookings, setLoadingFacilityBookings] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();
  const nowIso = getLocalDatetimeInputValue(new Date());
  const maxAdvanceDate = new Date();
  maxAdvanceDate.setMonth(maxAdvanceDate.getMonth() + 1);
  const maxAdvanceIso = getLocalDatetimeInputValue(maxAdvanceDate);

  useEffect(() => {
    const loadFacilities = async () => {
      if (!token) return;

      try {
        setLoadingFacilities(true);
        const response = await fetch(`${API_BASE}/facilities`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to load facilities");
        }

        const data = await response.json();
        const availableFacilities = Array.isArray(data)
          ? data.filter((facility) => facility?.status === "AVAILABLE")
          : [];

        setFacilities(availableFacilities);
      } catch (err) {
        setError(err.message || "Failed to load facilities");
      } finally {
        setLoadingFacilities(false);
      }
    };

    loadFacilities();
  }, [token]);

  useEffect(() => {
    const loadFacilityBookings = async () => {
      if (!token || !facilityName) {
        setFacilityBookings([]);
        return;
      }

      try {
        setLoadingFacilityBookings(true);
        const response = await fetch(`${API_BASE}/bookings/facility/${encodeURIComponent(facilityName)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to load facility booking slots");
        }

        const data = await response.json();
        setFacilityBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Failed to load facility booking slots");
      } finally {
        setLoadingFacilityBookings(false);
      }
    };

    loadFacilityBookings();
  }, [facilityName, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!facilityName || !startTime || !endTime) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    const selectedStart = new Date(startTime);
    const selectedEnd = new Date(endTime);

    if (selectedStart < new Date()) {
      setError("Start time cannot be in the past");
      setLoading(false);
      return;
    }

    if (selectedStart >= selectedEnd) {
      setError("End time must be after start time");
      setLoading(false);
      return;
    }

    const durationMinutes = Math.round((selectedEnd - selectedStart) / 60000);
    if (durationMinutes < MIN_BOOKING_MINUTES) {
      setError("Minimum booking duration is 30 minutes.");
      setLoading(false);
      return;
    }

    if (durationMinutes > MAX_BOOKING_MINUTES) {
      setError("Maximum booking duration is 5 hours.");
      setLoading(false);
      return;
    }

    if (!isWithinOperatingHours(selectedStart, selectedEnd)) {
      setError("Bookings are allowed only between 8:00 AM and 10:00 PM.");
      setLoading(false);
      return;
    }

    if (selectedStart > maxAdvanceDate || selectedEnd > maxAdvanceDate) {
      setError("Bookings can be made only up to 1 month in advance.");
      setLoading(false);
      return;
    }

    try {
      const bookingsResponse = await fetch(`${API_BASE}/bookings/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (bookingsResponse.ok) {
        const myBookings = await bookingsResponse.json();
        if (hasSameUserOverlap(Array.isArray(myBookings) ? myBookings : [], selectedStart, selectedEnd)) {
          setError("You already have a booking that overlaps with this time slot. Please choose a different time.");
          setLoading(false);
          return;
        }
      }

      if (hasFacilityOverlap(facilityBookings, selectedStart, selectedEnd)) {
        setError("This facility is already booked for the selected time. Please choose another available slot.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          facilityName,
          // Keep local datetime selected by the user to avoid timezone shifts.
          startTime,
          endTime,
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
        <p className="mb-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-xs text-blue-900">
          University rules: Minimum 30 minutes, maximum 5 hours, booking hours are from 8:00 AM to 10:00 PM, and bookings are allowed only up to 1 month ahead.
        </p>
        {error && <p className="mb-3 rounded-xl border border-rose-200 bg-rose-100 px-4 py-3 text-center text-sm text-rose-800">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label className="sf-label">Facility Name *</label>
          <select
            value={facilityName}
            onChange={(e) => setFacilityName(e.target.value)}
            className="sf-input mb-4"
            disabled={loadingFacilities}
            required
          >
            <option value="">
              {loadingFacilities ? "Loading facilities..." : "Select a facility"}
            </option>
            {facilities.map((facility) => (
              <option key={facility.id} value={facility.name}>
                {facility.name} - {facility.type} - {facility.location} ({facility.capacity})
              </option>
            ))}
          </select>
          {!loadingFacilities && facilities.length === 0 && (
            <p className="mb-4 text-xs sf-subtitle">No AVAILABLE facilities found. Ask admin to mark facilities as AVAILABLE.</p>
          )}

          {facilityName && (
            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
              <p className="font-semibold">Booked slots for {facilityName}</p>
              {loadingFacilityBookings ? (
                <p className="mt-1">Checking current bookings...</p>
              ) : (
                (() => {
                  const selectedDate = startTime ? startTime.slice(0, 10) : "";
                  const bookedSlots = facilityBookings
                    .filter((booking) => booking?.status !== "CANCELLED")
                    .filter((booking) => {
                      if (!selectedDate) return true;
                      if (!booking?.startTime) return false;
                      return booking.startTime.slice(0, 10) === selectedDate;
                    })
                    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

                  if (bookedSlots.length === 0) {
                    return <p className="mt-1">No booked slots{selectedDate ? " on selected date" : ""}. This time range is available.</p>;
                  }

                  return (
                    <ul className="mt-1 list-disc pl-5">
                      {bookedSlots.map((booking) => (
                        <li key={booking.id}>
                          {new Date(booking.startTime).toLocaleString()} - {new Date(booking.endTime).toLocaleString()} ({booking.status})
                        </li>
                      ))}
                    </ul>
                  );
                })()
              )}
            </div>
          )}

          <label className="sf-label">Start Time *</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="sf-input mb-4"
            min={nowIso}
            max={maxAdvanceIso}
            required
          />

          <label className="sf-label">End Time *</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="sf-input mb-4"
            min={startTime || nowIso}
            max={maxAdvanceIso}
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
