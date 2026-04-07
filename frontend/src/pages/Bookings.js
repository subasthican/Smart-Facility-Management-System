import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token, user } = useAuth();

  const fetchUserBookings = useCallback(async () => {
    try {
      const endpoint = user?.role === "STUDENT"
        ? "http://localhost:8080/api/bookings/my"
        : "http://localhost:8080/api/bookings";

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
        `http://localhost:8080/api/bookings/${bookingId}/cancel`,
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
        `http://localhost:8080/api/bookings/${bookingId}/confirm`,
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

  if (loading) return <p style={styles.loading}>Loading bookings...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>{user?.role === "STUDENT" ? "My Bookings" : "All Bookings"}</h2>
          <p style={styles.subtitle}>Track reservations with real-time status.</p>
        </div>
        {user?.role === "STUDENT" && (
          <Link to="/create-booking" style={styles.createBtn}>
            + New Booking
          </Link>
        )}
      </div>

      {error && <p style={styles.error}>Error: {error}</p>}

      {bookings.length === 0 ? (
        <p style={styles.noBookings}>No bookings yet. Create one now!</p>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Facility</th>
                <th style={styles.th}>Start Time</th>
                <th style={styles.th}>End Time</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} style={styles.tableRow}>
                  <td style={styles.td}>{booking.facilityName}</td>
                  <td style={styles.td}>{new Date(booking.startTime).toLocaleString()}</td>
                  <td style={styles.td}>{new Date(booking.endTime).toLocaleString()}</td>
                  <td style={styles.td}>
                    <span style={getStatusStyle(booking.status)}>{booking.status}</span>
                  </td>
                  <td style={styles.td}>
                    {user?.role === "ADMIN" && booking.status === "PENDING" ? (
                      <>
                        <button
                          onClick={() => handleConfirm(booking.id)}
                          style={styles.confirmBtn}
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleCancel(booking.id)}
                          style={styles.cancelBtn}
                        >
                          Cancel
                        </button>
                      </>
                    ) : user?.role === "STUDENT" && (booking.status === "PENDING" || booking.status === "CONFIRMED") ? (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        style={styles.cancelBtn}
                      >
                        Cancel
                      </button>
                    ) : (
                      <span style={styles.disabled}>-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const getStatusStyle = (status) => ({
  ...styles.pill,
  color: "#fff",
  backgroundColor:
    status === "CONFIRMED"
      ? "#4CAF50"
      : status === "PENDING"
      ? "#FF9800"
      : status === "CANCELLED"
      ? "#f44336"
      : "#2196F3",
});

const styles = {
  container: {
    width: "100%",
    padding: "20px",
    background: "linear-gradient(180deg, rgba(255,255,255,0.52), rgba(236,243,255,0.45))",
    border: "1px solid rgba(15, 23, 42, 0.08)",
    borderRadius: "18px",
    boxShadow: "0 20px 40px rgba(15, 23, 42, 0.08)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    gap: "12px",
    flexWrap: "wrap",
  },
  title: {
    fontSize: "30px",
    letterSpacing: "-0.02em",
    color: "#18253f",
    margin: 0,
  },
  subtitle: {
    color: "#52627f",
    fontSize: "14px",
    marginTop: "6px",
  },
  createBtn: {
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    color: "#fff",
    padding: "10px 18px",
    borderRadius: "999px",
    textDecoration: "none",
    cursor: "pointer",
    fontWeight: "600",
  },
  tableContainer: { overflowX: "auto", borderRadius: "14px", border: "1px solid rgba(15, 23, 42, 0.12)" },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
    background: "rgba(255,255,255,0.84)",
  },
  tableHeader: {
    backgroundColor: "#eef2ff",
  },
  th: {
    textAlign: "left",
    padding: "12px 14px",
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
  tableRow: { backgroundColor: "rgba(255,255,255,0.85)" },
  pill: {
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
  },
  cancelBtn: {
    backgroundColor: "#dc2626",
    color: "#fff",
    padding: "6px 11px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginRight: "6px",
    fontWeight: "600",
  },
  confirmBtn: {
    backgroundColor: "#059669",
    color: "#fff",
    padding: "6px 11px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginRight: "6px",
    fontWeight: "600",
  },
  disabled: { color: "#999" },
  noBookings: { textAlign: "center", padding: "40px", color: "#475569" },
  loading: { textAlign: "center", padding: "20px", color: "#334155" },
  error: {
    color: "#991b1b",
    backgroundColor: "#fee2e2",
    border: "1px solid #fecaca",
    borderRadius: "10px",
    textAlign: "center",
    padding: "10px",
    marginBottom: "12px",
  },
};

export default Bookings;
