import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageHeader from "../components/PageHeader.js";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const canEditFullName = user?.role === "STUDENT" || user?.role === "STAFF";

  useEffect(() => {
    setFullName(user?.fullName || "");
    setPhoneNumber(user?.phoneNumber || "");
  }, [user?.fullName, user?.phoneNumber]);

  const handleSaveProfile = async () => {
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      await updateProfile({ fullName, phoneNumber });
      setSuccess("Profile updated successfully.");
    } catch (e) {
      setError(e.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

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
          <p className="mt-2 text-lg font-bold sf-title">{user?.fullName || "Name not set"}</p>
          <p className="mt-1 text-sm sf-subtitle">Email: {user?.email || "Unknown user"}</p>
          <p className="mt-1 text-sm sf-subtitle">Phone: {user?.phoneNumber || "Not set"}</p>
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
        <h2 className="mb-3 text-xl font-bold sf-title">Profile details</h2>
        {canEditFullName ? (
          <>
            <p className="mb-2 text-sm sf-subtitle">Current saved name: <strong>{user?.fullName || "Not set"}</strong></p>

            <label className="sf-label">New Full Name</label>
            <input
              type="text"
              className="sf-input max-w-md"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Update your full name"
            />

            <label className="mt-3 sf-label">Phone Number (Optional)</label>
            <input
              type="tel"
              className="sf-input max-w-md"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number (optional)"
            />
            <p className="mt-2 text-xs sf-subtitle">Leave phone number empty if you do not want to add it.</p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={saving}
                className="sf-btn-primary"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
            {error ? <p className="mt-2 text-sm text-rose-700">{error}</p> : null}
            {success ? <p className="mt-2 text-sm text-emerald-700">{success}</p> : null}
          </>
        ) : (
          <p className="text-sm sf-subtitle">Full name editing is available for student and lecturer accounts.</p>
        )}
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
