import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [oauthEnabled, setOauthEnabled] = useState(false);
  const [oauthMessage, setOauthMessage] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();
  const googleOAuthUrl = "http://localhost:8080/api/oauth2/authorization/google";

  useEffect(() => {
    const checkOauthStatus = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/auth/oauth/google/enabled?ts=${Date.now()}`,
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
        <div className="sf-card border border-slate-900/10 bg-gradient-to-b from-white/95 to-slate-100/85 p-12">
          <h2 className="text-center text-3xl font-bold text-slate-900">Create Account</h2>
          <p className="mb-8 mt-2 text-center text-sm text-slate-500">Fill in your details to join our platform</p>

          {error && <div className="mb-5 rounded-xl border border-rose-200 bg-rose-100 px-4 py-3 text-sm text-rose-800">{error}</div>}
          {success && <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-100 px-4 py-3 text-sm text-emerald-800">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white/95 px-4 py-3 text-sm"
                required
              />
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white/95 px-4 py-3 text-sm"
                required
              />
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white/95 px-4 py-3 text-sm"
                required
              />
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white/95 px-4 py-3 text-sm"
                required
              />
            </div>

            <button type="submit" className="sf-btn-primary mt-3 w-full py-3 text-base" disabled={submitting}>
              {submitting ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="my-6 text-center text-xs font-semibold text-slate-400">OR</div>
          {oauthEnabled ? (
            <a href={googleOAuthUrl} className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-900 no-underline">Sign up with Google</a>
          ) : (
            <button type="button" className="block w-full cursor-not-allowed rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-center text-sm font-semibold text-slate-500" disabled>
              Sign up with Google (Not Configured)
            </button>
          )}

          {!oauthEnabled && oauthMessage && <p className="mt-2 text-center text-xs text-amber-700">{oauthMessage}</p>}

          <p className="mt-5 text-center text-sm text-slate-500">
            Already have an account? <Link to="/login" className="font-semibold text-teal-700 no-underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
