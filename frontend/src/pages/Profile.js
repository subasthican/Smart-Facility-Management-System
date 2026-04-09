import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageHeader from "../components/PageHeader.js";

const Profile = () => {
  const { user } = useAuth();

  return (
    <section className="sf-page space-y-6">
      <PageHeader
        breadcrumb="Account / Profile"
        title="Profile & Support"
        subtitle="Review your account role, session status, and quick links for the student management system."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <article className="sf-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.12em] sf-subtitle">Signed in as</p>
          <p className="mt-2 text-lg font-bold sf-title">{user?.email || "Unknown user"}</p>
          <p className="mt-1 text-sm sf-subtitle">Role: {user?.role || "N/A"}</p>
        </article>
        <article className="sf-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.12em] sf-subtitle">Session</p>
          <p className="mt-2 text-lg font-bold sf-title">Active</p>
          <p className="mt-1 text-sm sf-subtitle">Your token-based session is loaded in the app context.</p>
        </article>
        <article className="sf-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.12em] sf-subtitle">Support</p>
          <p className="mt-2 text-lg font-bold sf-title">Help desk</p>
          <p className="mt-1 text-sm sf-subtitle">support@smartfacility.local</p>
        </article>
      </div>

      <div className="sf-card p-5">
        <h2 className="mb-3 text-xl font-bold sf-title">Quick actions</h2>
        <div className="flex flex-wrap gap-2">
          <Link to="/dashboard" className="sf-btn-primary rounded-full px-4 py-2 text-sm no-underline">Dashboard</Link>
          <Link to="/bookings" className="sf-btn-secondary rounded-full px-4 py-2 text-sm no-underline">Bookings</Link>
          <Link to="/notifications" className="sf-btn-secondary rounded-full px-4 py-2 text-sm no-underline">Notifications</Link>
          <Link to="/facilities" className="sf-btn-secondary rounded-full px-4 py-2 text-sm no-underline">Facilities</Link>
        </div>
      </div>
    </section>
  );
};

export default Profile;
