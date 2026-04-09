import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { user, resetFirstLoginPassword, logout } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSaving(true);
    try {
      await resetFirstLoginPassword(newPassword);
      setSuccess("Password reset successful. Redirecting...");
      setTimeout(() => navigate("/dashboard"), 900);
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-5 py-10">
      <div className="sf-auth-card w-full max-w-md p-12">
        <h2 className="text-center text-3xl font-bold sf-title">Reset Your Password</h2>
        <p className="mb-8 mt-2 text-center text-sm sf-subtitle">
          Welcome {user?.email}. You must set a new password before using your account.
        </p>

        {error && <div className="mb-5 rounded-xl border border-rose-200 bg-rose-100 px-4 py-3 text-sm text-rose-800">{error}</div>}
        {success && <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-100 px-4 py-3 text-sm text-emerald-800">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="sf-label">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                className="sf-input pr-12"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                onClick={() => setShowNewPassword((prev) => !prev)}
                aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                title={showNewPassword ? "Hide new password" : "Show new password"}
              >
                {showNewPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M3 3L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    <path d="M10.58 10.58C10.21 10.95 10 11.46 10 12C10 13.1 10.9 14 12 14C12.54 14 13.05 13.79 13.42 13.42" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    <path d="M9.88 5.09C10.56 4.89 11.27 4.78 12 4.78C16.5 4.78 20.11 8.31 21.47 11.36C21.65 11.76 21.65 12.24 21.47 12.64C20.96 13.79 20.1 15.04 18.92 16.07" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    <path d="M6.23 6.23C4.49 7.35 3.22 9.03 2.53 10.58C2.35 10.98 2.35 11.46 2.53 11.86C3.89 14.91 7.5 18.44 12 18.44C13.76 18.44 15.35 17.9 16.74 17.03" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M2.53 11.36C3.89 8.31 7.5 4.78 12 4.78C16.5 4.78 20.11 8.31 21.47 11.36C21.65 11.76 21.65 12.24 21.47 12.64C20.11 15.69 16.5 19.22 12 19.22C7.5 19.22 3.89 15.69 2.53 12.64C2.35 12.24 2.35 11.76 2.53 11.36Z" stroke="currentColor" strokeWidth="1.8"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="mb-5">
            <label className="sf-label">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="sf-input pr-12"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                title={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M3 3L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    <path d="M10.58 10.58C10.21 10.95 10 11.46 10 12C10 13.1 10.9 14 12 14C12.54 14 13.05 13.79 13.42 13.42" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    <path d="M9.88 5.09C10.56 4.89 11.27 4.78 12 4.78C16.5 4.78 20.11 8.31 21.47 11.36C21.65 11.76 21.65 12.24 21.47 12.64C20.96 13.79 20.1 15.04 18.92 16.07" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    <path d="M6.23 6.23C4.49 7.35 3.22 9.03 2.53 10.58C2.35 10.98 2.35 11.46 2.53 11.86C3.89 14.91 7.5 18.44 12 18.44C13.76 18.44 15.35 17.9 16.74 17.03" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M2.53 11.36C3.89 8.31 7.5 4.78 12 4.78C16.5 4.78 20.11 8.31 21.47 11.36C21.65 11.76 21.65 12.24 21.47 12.64C20.11 15.69 16.5 19.22 12 19.22C7.5 19.22 3.89 15.69 2.53 12.64C2.35 12.24 2.35 11.76 2.53 11.36Z" stroke="currentColor" strokeWidth="1.8"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="sf-btn-primary mt-3 w-full py-3 text-base" disabled={saving}>
            {saving ? "Saving..." : "Set New Password"}
          </button>
        </form>

        <button
          type="button"
          className="sf-btn-secondary mt-3 w-full py-3 text-base"
          onClick={logout}
          disabled={saving}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
