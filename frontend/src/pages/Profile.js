import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  return (
    <section className="sf-page space-y-6">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Account</p>
        <h1 className="sf-title">Profile & Support</h1>
        <p className="sf-subtitle mt-2">Review your account role, session status, and quick links for the student management system.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="sf-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Signed in as</p>
          <p className="mt-2 text-lg font-bold text-slate-900">{user?.email || "Unknown user"}</p>
          <p className="mt-1 text-sm text-slate-600">Role: {user?.role || "N/A"}</p>
        </article>
        <article className="sf-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Session</p>
          <p className="mt-2 text-lg font-bold text-slate-900">Active</p>
          <p className="mt-1 text-sm text-slate-600">Your token-based session is loaded in the app context.</p>
        </article>
        <article className="sf-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Support</p>
          <p className="mt-2 text-lg font-bold text-slate-900">Help desk</p>
          <p className="mt-1 text-sm text-slate-600">support@smartfacility.local</p>
        </article>
      </div>

      <div className="sf-card p-5">
        <h2 className="mb-3 text-xl font-bold text-slate-900">Quick actions</h2>
        <div className="flex flex-wrap gap-2">
          <Link to="/dashboard" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white no-underline">Dashboard</Link>
          <Link to="/bookings" className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 no-underline">Bookings</Link>
          <Link to="/notifications" className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 no-underline">Notifications</Link>
          <Link to="/facilities" className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 no-underline">Facilities</Link>
        </div>
      </div>
    </section>
  );
};

export default Profile;
