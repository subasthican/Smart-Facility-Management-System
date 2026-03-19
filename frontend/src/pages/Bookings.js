import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserBookings();
  }, [token]);

  const fetchUserBookings = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/bookings/my", {
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
  };

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

  if (loading) return <p style={styles.loading}>Loading bookings...</p>;
  if (error) return <p style={styles.error}>Error: {error}</p>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>My Bookings</h2>
        <Link to="/create-booking" style={styles.createBtn}>
          + New Booking
        </Link>
      </div>

      {bookings.length === 0 ? (
        <p style={styles.noBookings}>No bookings yet. Create one now!</p>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th>Facility</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} style={styles.tableRow}>
                  <td>{booking.facilityName}</td>
                  <td>{new Date(booking.startTime).toLocaleString()}</td>
                  <td>{new Date(booking.endTime).toLocaleString()}</td>
                  <td style={getStatusStyle(booking.status)}>
                    {booking.status}
                  </td>
                  <td>
                    {booking.status === "PENDING" || booking.status === "CONFIRMED" ? (
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
  padding: "5px 10px",
  borderRadius: "5px",
  color: "#fff",
  fontWeight: "bold",
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
  container: { padding: "20px", maxWidth: "1200px", margin: "0 auto" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  createBtn: {
    backgroundColor: "#4CAF50",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "5px",
    textDecoration: "none",
    cursor: "pointer",
  },
  tableContainer: { overflowX: "auto" },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  tableHeader: {
    backgroundColor: "#1d1d1f",
    color: "#fff",
    textAlign: "left",
  },
  tableRow: { borderBottom: "1px solid #ddd" },
  cancelBtn: {
    backgroundColor: "#f44336",
    color: "#fff",
    padding: "5px 10px",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer",
  },
  disabled: { color: "#999" },
  noBookings: { textAlign: "center", padding: "40px", color: "#666" },
  loading: { textAlign: "center", padding: "20px" },
  error: { color: "red", textAlign: "center", padding: "20px" },
};

export default Bookings;
