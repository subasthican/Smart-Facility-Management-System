import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const MainLayout = ({ children }) => {
  const { user } = useAuth();

  return (
    <div style={styles.pageShell}>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.brand}>SMARTFACILITY</div>
          <nav style={styles.headerNav}>
            <Link to="/" style={styles.navLink}>Home</Link>
            <Link to="/facilities" style={styles.navLink}>Facilities</Link>
            <Link to="/assets" style={styles.navLink}>Assets</Link>
            <Link to="/bookings" style={styles.navLink}>Bookings</Link>
          </nav>
          <div style={styles.headerActions}>
            {user ? (
              <>
                <Link to="/dashboard" style={styles.headerButtonPrimary}>Dashboard</Link>
                {user.role === "ADMIN" && <Link to="/admin/users" style={styles.headerButtonGhost}>Admin</Link>}
              </>
            ) : (
              <>
                <Link to="/login" style={styles.headerButtonGhost}>Sign in</Link>
                <Link to="/register" style={styles.headerButtonPrimary}>Get started</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main style={styles.mainContent}>
        {children}
      </main>

      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <div style={styles.footerLeft}>
            <p style={styles.footerBrand}>Smart Facility Management System</p>
            <p style={styles.footerCopy}>Precision tools for campus operations and scheduling.</p>
          </div>
          <div style={styles.footerLinks}>
            <Link to="/bookings" style={styles.footerLink}>Bookings</Link>
            <Link to="/facilities" style={styles.footerLink}>Facilities</Link>
            <Link to="/assets" style={styles.footerLink}>Assets</Link>
          </div>
          <div style={styles.footerRight}>
            <p style={styles.footerSmall}>2026 Smart Facility</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  pageShell: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "radial-gradient(110% 70% at 50% 0%, #f6f8ff 0%, #eef2ff 45%, #e9edf4 100%)",
  },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 20,
    backdropFilter: "blur(14px)",
    background: "rgba(250, 252, 255, 0.76)",
    borderBottom: "1px solid rgba(20, 23, 28, 0.08)",
  },
  headerInner: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "16px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "18px",
    flexWrap: "wrap",
  },
  brand: {
    fontWeight: 700,
    letterSpacing: "0.12em",
    fontSize: "12px",
    color: "#1c2333",
  },
  headerNav: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    flexWrap: "wrap",
  },
  navLink: {
    textDecoration: "none",
    color: "#384258",
    fontSize: "14px",
    padding: "8px 10px",
    borderRadius: "999px",
    border: "1px solid transparent",
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  headerButtonGhost: {
    textDecoration: "none",
    fontSize: "14px",
    color: "#253042",
    padding: "8px 14px",
    borderRadius: "999px",
    border: "1px solid rgba(36, 47, 67, 0.2)",
  },
  headerButtonPrimary: {
    textDecoration: "none",
    fontSize: "14px",
    color: "#ffffff",
    padding: "9px 16px",
    borderRadius: "999px",
    background: "linear-gradient(140deg, #1f2937 0%, #111827 100%)",
    boxShadow: "0 8px 20px rgba(17, 24, 39, 0.25)",
  },
  mainContent: {
    flex: 1,
    maxWidth: "1280px",
    width: "100%",
    margin: "0 auto",
    padding: "24px",
  },
  footer: {
    marginTop: "18px",
    borderTop: "1px solid rgba(15, 23, 42, 0.08)",
    background: "linear-gradient(180deg, rgba(248, 250, 253, 0.72) 0%, rgba(233, 240, 252, 0.8) 100%)",
    backdropFilter: "blur(10px)",
  },
  footerInner: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "24px",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "20px",
    flexWrap: "wrap",
  },
  footerLeft: {
    maxWidth: "360px",
  },
  footerBrand: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#162135",
    marginBottom: "6px",
  },
  footerCopy: {
    fontSize: "13px",
    color: "#556078",
  },
  footerLinks: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  footerLink: {
    textDecoration: "none",
    color: "#26324b",
    fontSize: "13px",
    padding: "7px 11px",
    borderRadius: "999px",
    border: "1px solid rgba(22, 33, 53, 0.12)",
    background: "rgba(255,255,255,0.72)",
  },
  footerRight: {
    marginLeft: "auto",
  },
  footerSmall: {
    fontSize: "12px",
    color: "#607089",
  },
};

export default MainLayout;