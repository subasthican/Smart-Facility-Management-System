import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8081/api";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverCode, setServerCode] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const requestCode = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send code");

      setSuccess(data.message || "Reset code sent");
      if (data.code) {
        setServerCode(data.code);
      }
      setStep(2);
    } catch (err) {
      setError(err.message || "Failed to send code");
    } finally {
      setSaving(false);
    }
  };

  const resetPassword = async (e) => {
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
      const res = await fetch(`${API_BASE}/auth/forgot-password/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          code: code.trim(),
          newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset password");

      setSuccess("Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-5 py-10">
      <div className="sf-auth-card w-full max-w-md p-12">
        <h2 className="text-center text-3xl font-bold sf-title">Forgot Password</h2>
        <p className="mb-8 mt-2 text-center text-sm sf-subtitle">
          {step === 1 ? "Enter your email to receive a reset code." : "Enter the code sent to your email and set a new password."}
        </p>

        {error && <div className="mb-5 rounded-xl border border-rose-200 bg-rose-100 px-4 py-3 text-sm text-rose-800">{error}</div>}
        {success && <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-100 px-4 py-3 text-sm text-emerald-800">{success}</div>}

        {step === 1 ? (
          <form onSubmit={requestCode}>
            <label className="sf-label">Email Address</label>
            <input
              className="sf-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />

            <button className="sf-btn-primary mt-5 w-full py-3 text-base" type="submit" disabled={saving}>
              {saving ? "Sending..." : "Send Reset Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={resetPassword}>
            <label className="sf-label">Reset Code</label>
            <input
              className="sf-input"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter 6-digit code"
              required
            />

            {serverCode && (
              <p className="mt-2 rounded-lg border border-amber-300/45 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                Dev code preview: <strong>{serverCode}</strong>
              </p>
            )}

            <label className="sf-label mt-4">New Password</label>
            <div className="relative">
              <input
                className="sf-input pr-12"
                type={showNewPassword ? "text" : "password"}
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

            <label className="sf-label mt-4">Confirm Password</label>
            <div className="relative">
              <input
                className="sf-input pr-12"
                type={showConfirmPassword ? "text" : "password"}
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

            <button className="sf-btn-primary mt-5 w-full py-3 text-base" type="submit" disabled={saving}>
              {saving ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <p className="mt-5 text-center text-sm sf-subtitle">
          Back to <Link to="/login" className="font-semibold text-teal-700 no-underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
