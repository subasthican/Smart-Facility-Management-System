import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  const cards = [
    {
      title: "My Bookings",
      description: "View and manage your facility bookings",
      icon: "📅",
      link: "/bookings",
      color: "#0f766e"
    },
    {
      title: "Facilities",
      description: "Explore available facilities and resources",
      icon: "🏢",
      link: "/facilities",
      color: "#0f172a"
    },
    {
      title: "Assets",
      description: "Browse and manage assets",
      icon: "🔧",
      link: "/assets",
      color: "#334155"
    },
    {
      title: "Incident Tickets",
      description: "Report issues and track ticket progress",
      icon: "🎫",
      link: "/tickets",
      color: "#be123c"
    },
    {
      title: "Notifications",
      description: "View system alerts and booking updates",
      icon: "🔔",
      link: "/notifications",
      color: "#1d4ed8"
    }
  ];

  if (user?.role === "ADMIN") {
    cards.push(
      {
        title: "Student Management",
        description: "Add, edit, and activate or deactivate student accounts",
        icon: "🎓",
        link: "/admin/students",
        color: "#0369a1"
      },
      {
        title: "Staff Management",
        description: "Add, edit, and activate or deactivate staff accounts",
        icon: "🧑‍💼",
        link: "/admin/staff",
        color: "#0f766e"
      }
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Welcome, {user?.email}! 👋</h1>
        <p style={styles.subtitle}>You're logged in as <strong>{user?.role}</strong></p>
      </div>

      <div style={styles.grid}>
        {cards.map((card, idx) => (
          <Link key={idx} to={card.link} style={{ textDecoration: "none" }}>
            <div style={{...styles.card, borderLeft: `4px solid ${card.color}`}}>
              <div style={styles.cardIcon}>{card.icon}</div>
              <h3 style={styles.cardTitle}>{card.title}</h3>
              <p style={styles.cardDescription}>{card.description}</p>
              <div style={styles.cardArrow}>→</div>
            </div>
          </Link>
        ))}
      </div>

      {user?.role === "STUDENT" && (
        <div style={styles.ctaBox}>
          <h3>Ready to book a facility?</h3>
          <p>Start by creating a new booking to reserve space for your needs.</p>
          <Link to="/create-booking" style={styles.ctaBtn}>
            Create New Booking
          </Link>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    padding: "8px 0",
  },
  header: {
    marginBottom: "48px",
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#475569",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
    marginBottom: "40px",
  },
  card: {
    background: "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(241,245,249,0.86))",
    border: "1px solid rgba(15, 23, 42, 0.12)",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 18px 34px rgba(15, 23, 42, 0.1)",
    transition: "all 0.3s ease",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
  },
  cardIcon: {
    fontSize: "40px",
    marginBottom: "12px",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "8px",
  },
  cardDescription: {
    fontSize: "14px",
    color: "#475569",
    marginBottom: "12px",
  },
  cardArrow: {
    fontSize: "20px",
    color: "#64748b",
    transition: "all 0.3s ease",
  },
  ctaBox: {
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    color: "white",
    padding: "40px",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow: "0 18px 34px rgba(15, 23, 42, 0.22)",
  },
  ctaBtn: {
    display: "inline-block",
    marginTop: "16px",
    padding: "12px 32px",
    backgroundColor: "white",
    color: "#0f172a",
    textDecoration: "none",
    borderRadius: "10px",
    fontWeight: "600",
    transition: "all 0.3s ease",
  },
};

export default Dashboard;