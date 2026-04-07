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
      color: "#6366f1"
    },
    {
      title: "Facilities",
      description: "Explore available facilities and resources",
      icon: "🏢",
      link: "/facilities",
      color: "#ec4899"
    },
    {
      title: "Assets",
      description: "Browse and manage assets",
      icon: "🔧",
      link: "/assets",
      color: "#f59e0b"
    },
    {
      title: "Incident Tickets",
      description: "Report issues and track ticket progress",
      icon: "🎫",
      link: "/tickets",
      color: "#ef4444"
    },
    {
      title: "Notifications",
      description: "View system alerts and booking updates",
      icon: "🔔",
      link: "/notifications",
      color: "#10b981"
    }
  ];

  if (user?.role === "ADMIN") {
    cards.push(
      {
        title: "Student Management",
        description: "Add, edit, and activate or deactivate student accounts",
        icon: "🎓",
        link: "/admin/students",
        color: "#2563eb"
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
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "32px 20px",
  },
  header: {
    marginBottom: "48px",
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#6b7280",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
    marginBottom: "40px",
  },
  card: {
    backgroundColor: "white",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
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
    color: "#1f2937",
    marginBottom: "8px",
  },
  cardDescription: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "12px",
  },
  cardArrow: {
    fontSize: "20px",
    color: "#9ca3af",
    transition: "all 0.3s ease",
  },
  ctaBox: {
    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    color: "white",
    padding: "40px",
    borderRadius: "12px",
    textAlign: "center",
  },
  ctaBtn: {
    display: "inline-block",
    marginTop: "16px",
    padding: "12px 32px",
    backgroundColor: "white",
    color: "#6366f1",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "600",
    transition: "all 0.3s ease",
  },
};

export default Dashboard;