import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader.js";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

const getStatusClass = (status) => {
  if (status === "CONFIRMED") return "bg-emerald-600";
  if (status === "PENDING") return "bg-amber-500";
  if (status === "CANCELLED") return "bg-rose-600";
  return "bg-sky-600";
};

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token, user } = useAuth();

  const fetchUserBookings = useCallback(async () => {
    try {
      const endpoint = user?.role === "STUDENT"
        ? `${API_BASE}/bookings/my`
        : `${API_BASE}/bookings`;

      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const data = await response.json();
      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, user?.role]);

  useEffect(() => {
    fetchUserBookings();
  }, [fetchUserBookings]);

  const handleCancel = async (bookingId) => {
    try {
      const response = await fetch(
        `${API_BASE}/bookings/${bookingId}/cancel`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to cancel booking");
      }

      setBookings(
        bookings.map((b) =>
          b.id === bookingId ? { ...b, status: "CANCELLED" } : b
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleConfirm = async (bookingId) => {
    try {
      const response = await fetch(
        `${API_BASE}/bookings/${bookingId}/confirm`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to confirm booking");
      }

      setBookings(
        bookings.map((b) =>
          b.id === bookingId ? { ...b, status: "CONFIRMED" } : b
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className="py-5 text-center text-slate-700">Loading bookings...</p>;

  return (
    <section className="sf-page">
      <PageHeader
        breadcrumb="Operations / Bookings"
        title={user?.role === "STUDENT" ? "My Bookings" : "All Bookings"}
        subtitle="Track reservations with real-time status and clear action controls."
        actions={user?.role === "STUDENT" ? <Link to="/create-booking" className="sf-btn-primary no-underline">+ New Booking</Link> : null}
      />

      {error && <p className="mb-3 rounded-xl border border-rose-200 bg-rose-100 px-4 py-3 text-center text-sm text-rose-800">Error: {error}</p>}

      {bookings.length === 0 ? (
        <div className="sf-card border-dashed border-slate-300 bg-white/70 px-5 py-10 text-center text-slate-600">
          <p className="text-lg font-semibold text-slate-700">No bookings yet</p>
          <p className="mt-1 text-sm text-slate-500">Create a new booking to get started.</p>
          {user?.role === "STUDENT" && <Link to="/create-booking" className="mt-4 inline-block sf-btn-primary no-underline">Create one now</Link>}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-900/15 bg-white/85">
          <table className="w-full border-separate border-spacing-0 bg-white/90">
            <thead>
              <tr className="bg-indigo-50">
                <th className="border-b border-slate-300/50 px-4 py-3 text-left text-sm font-bold text-slate-700">Facility</th>
                <th className="border-b border-slate-300/50 px-4 py-3 text-left text-sm font-bold text-slate-700">Start Time</th>
                <th className="border-b border-slate-300/50 px-4 py-3 text-left text-sm font-bold text-slate-700">End Time</th>
                <th className="border-b border-slate-300/50 px-4 py-3 text-left text-sm font-bold text-slate-700">Status</th>
                <th className="border-b border-slate-300/50 px-4 py-3 text-left text-sm font-bold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="bg-white/85">
                  <td className="border-b border-slate-300/30 px-4 py-3 text-sm text-slate-700">{booking.facilityName}</td>
                  <td className="border-b border-slate-300/30 px-4 py-3 text-sm text-slate-700">{new Date(booking.startTime).toLocaleString()}</td>
                  <td className="border-b border-slate-300/30 px-4 py-3 text-sm text-slate-700">{new Date(booking.endTime).toLocaleString()}</td>
                  <td className="border-b border-slate-300/30 px-4 py-3 text-sm text-slate-700">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold text-white ${getStatusClass(booking.status)}`}>{booking.status}</span>
                  </td>
                  <td className="border-b border-slate-300/30 px-4 py-3 text-sm text-slate-700">
                    {user?.role === "ADMIN" && booking.status === "PENDING" ? (
                      <>
                        <button
                          onClick={() => handleConfirm(booking.id)}
                          className="mr-2 rounded-xl bg-teal-700 px-3 py-1.5 text-xs font-semibold text-white"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleCancel(booking.id)}
                          className="rounded-xl bg-rose-700 px-3 py-1.5 text-xs font-semibold text-white"
                        >
                          Cancel
                        </button>
                      </>
                    ) : user?.role === "STUDENT" && (booking.status === "PENDING" || booking.status === "CONFIRMED") ? (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        className="rounded-xl bg-rose-700 px-3 py-1.5 text-xs font-semibold text-white"
                      >
                        Cancel
                      </button>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default Bookings;
