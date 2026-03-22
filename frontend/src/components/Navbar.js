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
    padding: "14px 22px",
    background: "rgba(20, 28, 44, 0.82)",
    color: "#fff",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.3)",
    borderBottom: "1px solid rgba(255,255,255,0.12)",
    backdropFilter: "blur(10px)",
    position: "sticky",
    top: 0,
    zIndex: 30,
    gap: "14px",
    flexWrap: "wrap",
  },
  logo: { 
    fontSize: "22px", 
    fontWeight: "700",
    letterSpacing: "0.01em",
    background: "linear-gradient(135deg, #ffffff, #b9c9ff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text"
  },
  links: { display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" },
  link: { 
    color: "#fff", 
    textDecoration: "none", 
    fontSize: "13px",
    fontWeight: "600",
    opacity: 0.95,
    padding: "8px 11px",
    borderRadius: "999px",
    transition: "all 0.28s ease",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)"
  },
  role: { 
    color: "#dbe5ff", 
    fontSize: "12px",
    fontWeight: "600",
    backgroundColor: "rgba(255,255,255,0.14)",
    padding: "6px 12px",
    borderRadius: "20px"
  },
  logoutBtn: {
    backgroundColor: "rgba(244, 63, 94, 0.18)",
    color: "#fff",
    border: "1px solid rgba(244, 63, 94, 0.45)",
    padding: "8px 13px",
    borderRadius: "999px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
    transition: "all 0.3s ease"
  }
};

export default Navbar;