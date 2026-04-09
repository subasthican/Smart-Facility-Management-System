import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [oauthEnabled, setOauthEnabled] = useState(false);
  const [oauthMessage, setOauthMessage] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const googleOAuthUrl = "http://localhost:8080/api/oauth2/authorization/google";
  const demoCredentials = [
    { label: "Admin", email: "admin@gmail.com", password: "admin123" },
    { label: "Customer", email: "customer@gmail.com", password: "Customer123" },
    { label: "Lecturer", email: "lecturer@gmail.com", password: "Lecturer123" },
  ];

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
    setSubmitting(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">
        <div className="sf-auth-card p-12">
          <h2 className="text-center text-3xl font-bold sf-title">Welcome Back</h2>
          <p className="mb-8 mt-2 text-center text-sm sf-subtitle">Sign in to your account to continue</p>

          {error && <div className="mb-5 rounded-xl border border-rose-200 bg-rose-100 px-4 py-3 text-sm text-rose-800">{error}</div>}

          <form onSubmit={handleSubmit}>
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
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="sf-input"
                required
              />
            </div>

            <button type="submit" className="sf-btn-primary mt-3 w-full py-3 text-base" disabled={submitting}>
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="my-6 text-center text-xs font-semibold sf-subtitle">OR</div>

          {oauthEnabled ? (
            <a href={googleOAuthUrl} className="sf-btn-secondary block w-full px-4 py-3 text-center text-sm no-underline">Continue with Google</a>
          ) : (
            <button type="button" className="block w-full cursor-not-allowed rounded-xl border px-4 py-3 text-center text-sm font-semibold opacity-70" disabled>
              Continue with Google (Not Configured)
            </button>
          )}

          {!oauthEnabled && oauthMessage && <p className="mt-2 text-center text-xs text-amber-700">{oauthMessage}</p>}

          <div className="my-6 text-center text-xs font-semibold sf-subtitle">OR</div>

          <div className="mb-5 rounded-xl border border-teal-400/35 bg-teal-500/10 p-4">
            <p className="mb-3 text-xs font-bold text-teal-700">📌 Demo Credentials</p>
            <div className="space-y-3">
              {demoCredentials.map((item) => (
                <div key={item.label} className="rounded-lg border border-teal-400/25 bg-white/35 px-3 py-2">
                  <p className="mb-1 text-xs font-bold text-teal-800">{item.label}</p>
                  <div className="mb-1 flex justify-between text-xs" style={{ color: "var(--text-muted)" }}>
                    <span>Email:</span>
                    <code>{item.email}</code>
                  </div>
                  <div className="flex justify-between text-xs" style={{ color: "var(--text-muted)" }}>
                    <span>Password:</span>
                    <code>{item.password}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-5 text-center text-sm sf-subtitle">
            Don't have an account? <Link to="/register" className="font-semibold text-teal-700 no-underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
