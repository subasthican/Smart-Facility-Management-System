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
    <section className="relative min-h-[calc(100vh-180px)] overflow-hidden rounded-3xl border border-slate-300/70 bg-sf-shell p-7 shadow-shell backdrop-blur-md">
      <div className="pointer-events-none absolute -right-24 -top-40 h-[440px] w-[440px] rounded-full bg-cyan-200/45 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-52 -left-28 h-[460px] w-[460px] rounded-full bg-indigo-200/40 blur-3xl" />

      <div className="relative z-10 mx-auto mb-8 max-w-3xl text-center">
        <p className="mb-4 inline-block rounded-full border border-slate-300/70 bg-white/75 px-3 py-2 text-xs uppercase tracking-[0.14em] text-slate-700 shadow-inner">
          Smart Facility Management
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">{roleTitle}</h1>
        <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
          A clean and comfortable workspace to manage bookings, facilities, and assets with clear role-based actions.
        </p>

        {!user ? (
          <div className="mt-5 inline-block rounded-full border border-slate-300/60 bg-white/45 p-2 shadow-inner">
            <div className="flex flex-wrap justify-center gap-2">
              <Link to="/register" className="rounded-full bg-gradient-to-br from-slate-900 to-slate-800 px-6 py-3 text-sm font-semibold text-white no-underline shadow-lg">
                Get Started
              </Link>
              <Link to="/login" className="rounded-full border border-slate-300/80 bg-white/70 px-6 py-3 text-sm font-semibold text-slate-700 no-underline shadow">
                Sign In
              </Link>
            </div>
          </div>
        ) : null}
      </div>

      {user?.role === "ADMIN" && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          <Card title="User Management" text="Create and manage student/staff accounts." link="/admin/students" />
          <Card title="Bookings Review" text="Approve and monitor all bookings." link="/bookings" />
          <Card title="Facilities & Assets" text="Manage catalogues and availability." link="/facilities" />
        </div>
      )}

      {user?.role === "STUDENT" && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          <Card title="Create Booking" text="Reserve facilities quickly and easily." link="/create-booking" />
          <Card title="My Bookings" text="Track status and cancel when needed." link="/bookings" />
          <Card title="Explore Facilities" text="View available spaces and resources." link="/facilities" />
        </div>
      )}

      {user?.role === "STAFF" && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          <Card title="Bookings Overview" text="View current booking activity." link="/bookings" />
          <Card title="Facilities" text="Check facility status and details." link="/facilities" />
          <Card title="Assets" text="Inspect assets assigned to facilities." link="/assets" />
        </div>
      )}
    </section>
  );
};

const Card = ({ title, text, link }) => (
  <article className="sf-card border border-slate-300/70 bg-white/70 p-4">
    <h3 className="mb-2 text-lg font-bold text-slate-900">{title}</h3>
    <p className="mb-3 text-sm leading-relaxed text-slate-600">{text}</p>
    <Link to={link} className="text-sm font-bold text-slate-900 no-underline">
      Open
    </Link>
  </article>
);

export default Home;
