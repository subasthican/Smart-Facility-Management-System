import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const roleSummaries = {
  STUDENT: {
    label: "Student workspace",
    description: "Book facilities, track reservations, and stay updated on incidents or notifications.",
    primaryAction: { label: "Create Booking", link: "/create-booking" },
    focus: "Bookings and notifications",
  },
  STAFF: {
    label: "Staff workspace",
    description: "Monitor bookings, inspect facilities, and respond to incidents with clear operations flow.",
    primaryAction: { label: "Review Bookings", link: "/bookings" },
    focus: "Operations and facility status",
  },
  ADMIN: {
    label: "Admin workspace",
    description: "Manage users, approvals, assets, and system activity from a single control center.",
    primaryAction: { label: "Manage Students", link: "/admin/students" },
    focus: "Users, approvals, and oversight",
  },
};

const Dashboard = () => {
  const { user } = useAuth();
  const roleSummary = roleSummaries[user?.role] || roleSummaries.STUDENT;

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

      <div className="relative mb-10 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="sf-card p-6 md:p-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] sf-subtitle">Dashboard</p>
          <h1 className="sf-title">Welcome, {user?.email}! 👋</h1>
          <p className="sf-subtitle mt-3 max-w-3xl">{roleSummary.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link to={roleSummary.primaryAction.link} className="sf-btn-primary no-underline">
              {roleSummary.primaryAction.label}
            </Link>
            <Link to="/profile" className="sf-btn-secondary no-underline">
              View Profile
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <article className="sf-card p-5">
            <p className="text-xs font-bold uppercase tracking-[0.12em] sf-subtitle">Role</p>
            <p className="mt-2 text-lg font-bold sf-title">{roleSummary.label}</p>
            <p className="mt-1 text-sm sf-subtitle">Logged in as <strong>{user?.role}</strong></p>
          </article>
          <article className="sf-card p-5">
            <p className="text-xs font-bold uppercase tracking-[0.12em] sf-subtitle">Focus</p>
            <p className="mt-2 text-lg font-bold sf-title">{roleSummary.focus}</p>
            <p className="mt-1 text-sm sf-subtitle">Use the quick links below to move faster.</p>
          </article>
        </div>
      </div>

      <div className="relative mb-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        <article className="sf-card border-l-4 border-l-teal-700 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.12em] sf-subtitle">Next step</p>
          <h3 className="mt-2 text-lg font-bold sf-title">{roleSummary.primaryAction.label}</h3>
          <p className="mt-2 text-sm sf-subtitle">The most common action for your role is one tap away.</p>
          <Link to={roleSummary.primaryAction.link} className="mt-4 inline-block text-sm font-bold no-underline" style={{ color: "var(--text-strong)" }}>Open</Link>
        </article>
        <article className="sf-card border-l-4 border-l-slate-900 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.12em] sf-subtitle">Shared modules</p>
          <h3 className="mt-2 text-lg font-bold sf-title">Bookings, facilities, assets</h3>
          <p className="mt-2 text-sm sf-subtitle">Core campus operations live in the shared modules below.</p>
          <Link to="/bookings" className="mt-4 inline-block text-sm font-bold no-underline" style={{ color: "var(--text-strong)" }}>Go to bookings</Link>
        </article>
        <article className="sf-card border-l-4 border-l-blue-700 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.12em] sf-subtitle">Account</p>
          <h3 className="mt-2 text-lg font-bold sf-title">Profile and support</h3>
          <p className="mt-2 text-sm sf-subtitle">Update your account context and access help links from one place.</p>
          <Link to="/profile" className="mt-4 inline-block text-sm font-bold no-underline" style={{ color: "var(--text-strong)" }}>Open profile</Link>
        </article>
      </div>

      <div className="relative mb-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card, idx) => (
          <Link key={idx} to={card.link} className="no-underline">
            <article className={`sf-card border-l-4 p-6 transition hover:-translate-y-1 ${card.border}`}>
              <div className="mb-3 text-4xl">{card.icon}</div>
              <h3 className="mb-2 text-lg font-bold sf-title">{card.title}</h3>
              <p className="mb-3 text-sm sf-subtitle">{card.description}</p>
              <div className="text-lg sf-subtitle">→</div>
            </article>
          </Link>
        ))}
      </div>

      {user?.role === "STUDENT" && (
        <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-10 text-center text-white shadow-2xl">
          <h3>Ready to book a facility?</h3>
          <p className="mt-2 text-slate-200">Create a new booking, then track it from your bookings page and notifications feed.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Link to="/create-booking" className="rounded-xl bg-white px-8 py-3 font-semibold text-slate-900 no-underline shadow-md">
              Create New Booking
            </Link>
            <Link to="/notifications" className="rounded-xl border border-white/20 bg-white/10 px-8 py-3 font-semibold text-white no-underline">
              Check Notifications
            </Link>
          </div>
        </div>
      )}

      {user?.role === "STAFF" && (
        <div className="sf-card relative p-8">
          <h3 className="text-xl font-bold sf-title">Operations snapshot</h3>
          <p className="mt-2 text-sm sf-subtitle">Use bookings, facilities, and assets to keep campus operations moving smoothly.</p>
        </div>
      )}

      {user?.role === "ADMIN" && (
        <div className="sf-card relative p-8">
          <h3 className="text-xl font-bold sf-title">Administration snapshot</h3>
          <p className="mt-2 text-sm sf-subtitle">Manage users, review bookings, and monitor notifications from the admin area.</p>
        </div>
      )}
    </section>
  );
};

export default Dashboard;