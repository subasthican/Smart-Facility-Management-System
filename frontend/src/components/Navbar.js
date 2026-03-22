import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <h1 style={styles.logo}>Smart Facility</h1>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        {user && <Link to="/dashboard" style={styles.link}>Dashboard</Link>}
        {user && <Link to="/bookings" style={styles.link}>Bookings</Link>}
        {user && <Link to="/facilities" style={styles.link}>Facilities</Link>}
        {user && <Link to="/assets" style={styles.link}>Assets</Link>}
        {user?.role === "ADMIN" && <Link to="/admin/users" style={styles.link}>User Management</Link>}
        {user ? (
          <>
            <span style={styles.role}>{user.role}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#1d1d1f",
    color: "#fff"
  },
  logo: { fontSize: "24px", fontWeight: "bold" },
  links: { display: "flex", gap: "15px", alignItems: "center" },
  link: { color: "#fff", textDecoration: "none", fontSize: "16px" },
  role: { color: "#aaa", fontSize: "14px" },
  logoutBtn: {
    backgroundColor: "transparent",
    color: "#ff4d4d",
    border: "1px solid #ff4d4d",
    padding: "5px 12px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px"
  }
};

export default Navbar;