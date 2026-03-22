import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  const roleTitle =
    user?.role === "ADMIN"
      ? "Admin Home"
      : user?.role === "STUDENT"
      ? "Student Home"
      : user?.role === "STAFF"
      ? "Staff Home"
      : "Welcome";

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.content}>
          <p style={styles.eyebrow}>Smart Facility Management</p>
          <h1 style={styles.title}>{roleTitle}</h1>
          <p style={styles.subtitle}>
            A clean and comfortable workspace to manage bookings, facilities, and assets with clear role-based actions.
          </p>

          {!user ? (
            <div style={styles.ctas}>
              <Link to="/register" style={styles.ctaBtn}>Get Started</Link>
              <Link to="/login" style={styles.ctaBtnSecondary}>Sign In</Link>
            </div>
          ) : null}
        </div>

        {user?.role === "ADMIN" && (
          <div style={styles.grid}>
            <Card title="User Management" text="Create and manage student/staff accounts." link="/admin/users" />
            <Card title="Bookings Review" text="Approve and monitor all bookings." link="/bookings" />
            <Card title="Facilities & Assets" text="Manage catalogues and availability." link="/facilities" />
          </div>
        )}

        {user?.role === "STUDENT" && (
          <div style={styles.grid}>
            <Card title="Create Booking" text="Reserve facilities quickly and easily." link="/create-booking" />
            <Card title="My Bookings" text="Track status and cancel when needed." link="/bookings" />
            <Card title="Explore Facilities" text="View available spaces and resources." link="/facilities" />
          </div>
        )}

        {user?.role === "STAFF" && (
          <div style={styles.grid}>
            <Card title="Bookings Overview" text="View current booking activity." link="/bookings" />
            <Card title="Facilities" text="Check facility status and details." link="/facilities" />
            <Card title="Assets" text="Inspect assets assigned to facilities." link="/assets" />
          </div>
        )}
      </section>
    </div>
  );
};

const Card = ({ title, text, link }) => (
  <article style={styles.card}>
    <h3 style={styles.cardTitle}>{title}</h3>
    <p style={styles.cardText}>{text}</p>
    <Link to={link} style={styles.cardLink}>Open</Link>
  </article>
);

const styles = {
  page: {
    minHeight: "calc(100vh - 180px)",
    paddingBottom: "10px",
    fontFamily: "Avenir Next, SF Pro Display, Helvetica Neue, Arial, sans-serif",
    color: "#14171c",
  },
  hero: {
    borderRadius: "20px",
    border: "1px solid rgba(18, 24, 39, 0.08)",
    background: "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(244,248,255,0.88))",
    boxShadow: "0 20px 40px rgba(31, 41, 55, 0.12)",
    padding: "44px 28px",
  },
  content: {
    textAlign: "center",
    maxWidth: "780px",
    margin: "0 auto 28px",
  },
  eyebrow: {
    display: "inline-block",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.14em",
    padding: "8px 12px",
    borderRadius: "999px",
    marginBottom: "14px",
    background: "rgba(255,255,255,0.85)",
    border: "1px solid rgba(17, 24, 39, 0.12)",
    color: "#2a3347",
  },
  title: {
    fontSize: "clamp(32px, 4vw, 52px)",
    fontWeight: 700,
    letterSpacing: "-0.02em",
    color: "#0f172a",
    lineHeight: 1.1,
    marginBottom: "12px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#3a465f",
    maxWidth: "680px",
    margin: "0 auto 20px",
    lineHeight: 1.6,
  },
  ctas: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  ctaBtn: {
    padding: "13px 24px",
    background: "linear-gradient(140deg, #111827 0%, #1f2937 100%)",
    color: "#ffffff",
    textDecoration: "none",
    borderRadius: "999px",
    fontWeight: 600,
    fontSize: "14px",
    letterSpacing: "0.01em",
    border: "1px solid rgba(255,255,255,0.25)",
    boxShadow: "0 8px 16px rgba(17, 24, 39, 0.18)",
  },
  ctaBtnSecondary: {
    padding: "13px 24px",
    background: "rgba(255,255,255,0.85)",
    color: "#1f2a44",
    textDecoration: "none",
    borderRadius: "999px",
    fontWeight: 600,
    fontSize: "14px",
    border: "1px solid rgba(17, 24, 39, 0.14)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "12px",
  },
  card: {
    background: "rgba(255,255,255,0.9)",
    border: "1px solid rgba(15, 23, 42, 0.09)",
    borderRadius: "14px",
    padding: "16px",
    textAlign: "left",
    boxShadow: "0 10px 20px rgba(31, 41, 55, 0.08)",
  },
  cardTitle: {
    fontSize: "18px",
    marginBottom: "6px",
    color: "#1e293b",
  },
  cardText: {
    fontSize: "14px",
    color: "#475569",
    lineHeight: 1.5,
    marginBottom: "12px",
  },
  cardLink: {
    display: "inline-block",
    textDecoration: "none",
    color: "#0f172a",
    fontWeight: "700",
    fontSize: "14px",
  },
};

export default Home;