import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <div style={styles.content}>
          <h1 style={styles.title}>Smart Facility <br /> Management System</h1>
          <p style={styles.subtitle}>Manage bookings, resources, facilities, and assets seamlessly with an intelligent platform designed for modern facilities.</p>
          
          <div style={styles.ctas}>
            {user ? (
              <>
                <Link to="/dashboard" style={styles.ctaBtn}>Go to Dashboard</Link>
                <Link to="/bookings" style={styles.ctaBtnSecondary}>View Bookings</Link>
              </>
            ) : (
              <>
                <Link to="/login" style={styles.ctaBtn}>Login</Link>
                <Link to="/register" style={styles.ctaBtnSecondary}>Create Account</Link>
              </>
            )}
          </div>
        </div>

        <div style={styles.features}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>📅</div>
            <h3>Smart Bookings</h3>
            <p>Effortless facility and resource booking system</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🏢</div>
            <h3>Facility Management</h3>
            <p>Comprehensive management of all your facilities</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🔐</div>
            <h3>Role-Based Access</h3>
            <p>Secure role-based control for all users</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
  },
  hero: {
    maxWidth: "1200px",
    width: "100%",
  },
  content: {
    textAlign: "center",
    marginBottom: "60px",
  },
  title: {
    fontSize: "56px",
    fontWeight: "800",
    background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    marginBottom: "20px",
    lineHeight: "1.2",
  },
  subtitle: {
    fontSize: "18px",
    color: "#64748b",
    maxWidth: "600px",
    margin: "0 auto 40px",
    lineHeight: "1.8",
  },
  ctas: {
    display: "flex",
    gap: "16px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  ctaBtn: {
    padding: "14px 32px",
    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    color: "white",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "16px",
    boxShadow: "0 10px 30px rgba(99, 102, 241, 0.3)",
    transition: "all 0.3s ease",
    border: "none",
    cursor: "pointer"
  },
  ctaBtnSecondary: {
    padding: "14px 32px",
    background: "white",
    color: "#6366f1",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "16px",
    border: "2px solid #6366f1",
    transition: "all 0.3s ease",
    cursor: "pointer"
  },
  features: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
  },
  featureCard: {
    background: "white",
    padding: "32px",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
    textAlign: "center",
    transition: "all 0.3s ease",
    cursor: "pointer"
  },
  featureIcon: {
    fontSize: "48px",
    marginBottom: "16px",
  },
};

export default Home;