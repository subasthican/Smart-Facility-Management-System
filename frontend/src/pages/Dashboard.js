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
      border: "border-l-teal-700",
    },
    {
      title: "Facilities",
      description: "Explore available facilities and resources",
      icon: "🏢",
      link: "/facilities",
      border: "border-l-slate-900",
    },
    {
      title: "Assets",
      description: "Browse and manage assets",
      icon: "🔧",
      link: "/assets",
      border: "border-l-slate-700",
    },
    {
      title: "Incident Tickets",
      description: "Report issues and track ticket progress",
      icon: "🎫",
      link: "/tickets",
      border: "border-l-rose-700",
    },
    {
      title: "Notifications",
      description: "View system alerts and booking updates",
      icon: "🔔",
      link: "/notifications",
      border: "border-l-blue-700",
    }
  ];

  if (user?.role === "ADMIN") {
    cards.push(
      {
        title: "Student Management",
        description: "Add, edit, and activate or deactivate student accounts",
        icon: "🎓",
        link: "/admin/students",
        border: "border-l-sky-700",
      },
      {
        title: "Staff Management",
        description: "Add, edit, and activate or deactivate staff accounts",
        icon: "🧑‍💼",
        link: "/admin/staff",
        border: "border-l-teal-700",
      }
    );
  }

  return (
    <section className="sf-page relative overflow-hidden">
      <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-cyan-200/45 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />

      <div className="relative mb-12">
        <h1 className="sf-title">Welcome, {user?.email}! 👋</h1>
        <p className="sf-subtitle mt-2">You're logged in as <strong>{user?.role}</strong></p>
      </div>

      <div className="relative mb-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card, idx) => (
          <Link key={idx} to={card.link} className="no-underline">
            <article className={`sf-card border-l-4 p-6 transition hover:-translate-y-1 ${card.border}`}>
              <div className="mb-3 text-4xl">{card.icon}</div>
              <h3 className="mb-2 text-lg font-bold text-slate-900">{card.title}</h3>
              <p className="mb-3 text-sm text-slate-600">{card.description}</p>
              <div className="text-lg text-slate-500">→</div>
            </article>
          </Link>
        ))}
      </div>

      {user?.role === "STUDENT" && (
        <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-10 text-center text-white shadow-2xl">
          <h3>Ready to book a facility?</h3>
          <p className="mt-2 text-slate-200">Start by creating a new booking to reserve space for your needs.</p>
          <Link to="/create-booking" className="mt-5 inline-block rounded-xl bg-white px-8 py-3 font-semibold text-slate-900 no-underline shadow-md">
            Create New Booking
          </Link>
        </div>
      )}
    </section>
  );
};

export default Dashboard;