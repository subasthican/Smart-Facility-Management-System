import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const tokens = {
  surfaceBase: "#dfe8f7",
  textPrimary: "#0f172a",
  textSecondary: "#334155",
  textMuted: "#475569",
  borderSoft: "rgba(15, 23, 42, 0.14)",
  glassFill: "rgba(255, 255, 255, 0.48)",
  glassFillStrong: "rgba(255, 255, 255, 0.68)",
  highlight: "rgba(255, 255, 255, 0.84)",
  shadowDark: "rgba(15, 23, 42, 0.24)",
  shadowSoft: "rgba(15, 23, 42, 0.12)",
  accentStart: "#0f172a",
  accentEnd: "#1e293b",
};

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
      <div style={styles.bgOrbTop} aria-hidden="true" />
      <div style={styles.bgOrbBottom} aria-hidden="true" />
      <section style={styles.hero}>
        <div style={styles.content}>
          <p style={styles.eyebrow}>Smart Facility Management</p>
          <h1 style={styles.title}>{roleTitle}</h1>
          <p style={styles.subtitle}>
            A clean and comfortable workspace to manage bookings, facilities, and assets with clear role-based actions.
          </p>

          {!user ? (
            <div style={styles.ctasPanel}>
              <div style={styles.ctas}>
                <Link to="/register" style={styles.ctaBtn}>Get Started</Link>
                <Link to="/login" style={styles.ctaBtnSecondary}>Sign In</Link>
              </div>
            </div>
          ) : null}
        </div>

        {user?.role === "ADMIN" && (
          <div style={styles.grid}>
            <Card title="User Management" text="Create and manage student/staff accounts." link="/admin/students" />
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
    color: tokens.textPrimary,
    position: "relative",
    overflow: "hidden",
    background: `
      radial-gradient(1200px 420px at 18% -4%, rgba(147, 197, 253, 0.38), transparent 55%),
      radial-gradient(900px 360px at 92% 8%, rgba(196, 181, 253, 0.3), transparent 58%),
      linear-gradient(165deg, ${tokens.surfaceBase} 0%, #e9f1ff 48%, #dce5f5 100%)
    `,
  },
  bgOrbTop: {
    position: "absolute",
    width: "440px",
    height: "440px",
    borderRadius: "50%",
    background: "radial-gradient(circle at 35% 35%, rgba(125, 211, 252, 0.38), rgba(125, 211, 252, 0))",
    top: "-170px",
    right: "-90px",
    pointerEvents: "none",
  },
  bgOrbBottom: {
    position: "absolute",
    width: "460px",
    height: "460px",
    borderRadius: "50%",
    background: "radial-gradient(circle at 50% 50%, rgba(129, 140, 248, 0.34), rgba(129, 140, 248, 0))",
    bottom: "-220px",
    left: "-120px",
    pointerEvents: "none",
  },
  hero: {
    borderRadius: "24px",
    border: `1px solid ${tokens.borderSoft}`,
    background: `linear-gradient(180deg, ${tokens.glassFillStrong}, ${tokens.glassFill})`,
    boxShadow: `
      14px 14px 34px ${tokens.shadowSoft},
      -14px -14px 30px ${tokens.highlight},
      0 26px 56px ${tokens.shadowDark},
      inset 1px 1px 0 rgba(255,255,255,0.64),
      inset -1px -1px 0 rgba(148,163,184,0.24)
    `,
    backdropFilter: "blur(14px) saturate(148%)",
    WebkitBackdropFilter: "blur(14px) saturate(148%)",
    padding: "44px 28px",
    position: "relative",
    zIndex: 1,
    overflow: "hidden",
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
    background: "rgba(255,255,255,0.72)",
    border: `1px solid ${tokens.borderSoft}`,
    color: tokens.textSecondary,
    boxShadow: "inset 2px 2px 6px rgba(15, 23, 42, 0.06), inset -2px -2px 6px rgba(255,255,255,0.9)",
  },
  title: {
    fontSize: "clamp(32px, 4vw, 52px)",
    fontWeight: 700,
    letterSpacing: "-0.02em",
    color: "#0b1428",
    lineHeight: 1.1,
    marginBottom: "12px",
    textShadow: "0 1px 0 rgba(255,255,255,0.75)",
  },
  subtitle: {
    fontSize: "16px",
    color: tokens.textMuted,
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
  ctasPanel: {
    display: "inline-block",
    padding: "10px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.36)",
    border: "1px solid rgba(15, 23, 42, 0.09)",
    boxShadow: "inset 4px 4px 10px rgba(15,23,42,0.08), inset -4px -4px 10px rgba(255,255,255,0.68)",
  },
  ctaBtn: {
    padding: "13px 26px",
    background: `linear-gradient(140deg, ${tokens.accentStart} 0%, ${tokens.accentEnd} 100%)`,
    color: "#ffffff",
    textDecoration: "none",
    borderRadius: "999px",
    fontWeight: 600,
    fontSize: "14px",
    letterSpacing: "0.01em",
    border: "1px solid rgba(255,255,255,0.28)",
    boxShadow: "10px 10px 22px rgba(15, 23, 42, 0.3), -4px -4px 14px rgba(255,255,255,0.35)",
  },
  ctaBtnSecondary: {
    padding: "13px 26px",
    background: "rgba(255,255,255,0.62)",
    color: tokens.textSecondary,
    textDecoration: "none",
    borderRadius: "999px",
    fontWeight: 600,
    fontSize: "14px",
    border: `1px solid ${tokens.borderSoft}`,
    boxShadow: "8px 8px 16px rgba(15, 23, 42, 0.13), -6px -6px 14px rgba(255,255,255,0.78)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "12px",
  },
  card: {
    background: "rgba(255,255,255,0.62)",
    border: `1px solid ${tokens.borderSoft}`,
    borderRadius: "14px",
    padding: "16px",
    textAlign: "left",
    boxShadow: "10px 10px 20px rgba(15, 23, 42, 0.1), -7px -7px 16px rgba(255,255,255,0.75)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
  },
  cardTitle: {
    fontSize: "18px",
    marginBottom: "6px",
    color: tokens.textPrimary,
  },
  cardText: {
    fontSize: "14px",
    color: tokens.textMuted,
    lineHeight: 1.5,
    marginBottom: "12px",
  },
  cardLink: {
    display: "inline-block",
    textDecoration: "none",
    color: tokens.textPrimary,
    fontWeight: "700",
    fontSize: "14px",
  },
};

export default Home;