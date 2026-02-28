import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={styles.nav}>
      <h1 style={styles.logo}>Smart Facility</h1>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/dashboard" style={styles.link}>Dashboard</Link>
        <Link to="/login" style={styles.link}>Login</Link>
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
  links: { display: "flex", gap: "15px" },
  link: { color: "#fff", textDecoration: "none", fontSize: "16px" }
};

export default Navbar;