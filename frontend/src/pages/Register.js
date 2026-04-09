import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [oauthEnabled, setOauthEnabled] = useState(false);
  const [oauthMessage, setOauthMessage] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();
  const googleOAuthUrl = "http://localhost:8081/api/oauth2/authorization/google";

  useEffect(() => {
    const checkOauthStatus = async () => {
      try {
        const res = await fetch(
          `http://localhost:8081/api/auth/oauth/google/enabled?ts=${Date.now()}`,
          { cache: "no-store" }
        );
        const data = await res.json();
        setOauthEnabled(Boolean(data.enabled));
        if (!data.enabled) {
          setOauthMessage(data.message || "Google OAuth is not configured.");
        }
      } catch (e) {
        setOauthEnabled(false);
        setOauthMessage("Cannot verify OAuth configuration.");
      }
    };

    checkOauthStatus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Password and Confirm Password do not match.");
      return;
    }

    setSubmitting(true);

    try {
      await register(fullName.trim(), email.trim().toLowerCase(), password, "STUDENT");
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message || "Registration failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">
        <div className="sf-auth-card p-12">
          <h2 className="text-center text-3xl font-bold sf-title">Create Account</h2>
          <p className="mb-8 mt-2 text-center text-sm sf-subtitle">Fill in your details to join our platform</p>

          {error && <div className="mb-5 rounded-xl border border-rose-200 bg-rose-100 px-4 py-3 text-sm text-rose-800">{error}</div>}
          {success && <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-100 px-4 py-3 text-sm text-emerald-800">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="sf-label">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="sf-input"
                required
              />
            </div>

            <div className="mb-5">
              <label className="sf-label">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="sf-input"
                required
              />
            </div>

            <div className="mb-5">
              <label className="sf-label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="sf-input pr-12"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
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
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="sf-input pr-12"
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

            <button type="submit" className="sf-btn-primary mt-3 w-full py-3 text-base" disabled={submitting}>
              {submitting ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="my-6 text-center text-xs font-semibold sf-subtitle">OR</div>
          {oauthEnabled ? (
            <a href={googleOAuthUrl} className="sf-btn-secondary block w-full px-4 py-3 text-center text-sm no-underline">Sign up with Google</a>
          ) : (
            <button type="button" className="block w-full cursor-not-allowed rounded-xl border px-4 py-3 text-center text-sm font-semibold opacity-70" disabled>
              Sign up with Google (Not Configured)
            </button>
          )}

          {!oauthEnabled && oauthMessage && <p className="mt-2 text-center text-xs text-amber-700">{oauthMessage}</p>}

          <p className="mt-5 text-center text-sm sf-subtitle">
            Already have an account? <Link to="/login" className="font-semibold text-teal-700 no-underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
