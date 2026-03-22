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
    padding: "16px 32px",
    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    color: "#fff",
    boxShadow: "0 10px 30px rgba(99, 102, 241, 0.2)",
    borderBottom: "1px solid rgba(255,255,255,0.1)"
  },
  logo: { 
    fontSize: "28px", 
    fontWeight: "700",
    letterSpacing: "-0.5px",
    background: "linear-gradient(135deg, #fff, #e0e7ff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text"
  },
  links: { display: "flex", gap: "24px", alignItems: "center" },
  link: { 
    color: "#fff", 
    textDecoration: "none", 
    fontSize: "14px",
    fontWeight: "500",
    opacity: 0.9,
    padding: "8px 12px",
    borderRadius: "6px",
    transition: "all 0.3s ease"
  },
  role: { 
    color: "#e0e7ff", 
    fontSize: "12px",
    fontWeight: "600",
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: "6px 12px",
    borderRadius: "20px"
  },
  logoutBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.3)",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.3s ease"
  }
};

export default Navbar;