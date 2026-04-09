import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [oauthEnabled, setOauthEnabled] = useState(false);
  const [oauthMessage, setOauthMessage] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const googleOAuthUrl = "http://localhost:8081/api/oauth2/authorization/google";
  const demoCredentials = [
    { label: "Admin ⭐", email: "admin@test.com", password: "Admin@123" },
    { label: "Customer", email: "customer@gmail.com", password: "Customer123" },
    { label: "Lecturer", email: "lecturer@gmail.com", password: "Lecturer123" },
  ];

  const fillCredentials = (email, password) => {
    setEmail(email);
    setPassword(password);
  };

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

            <button type="submit" className="sf-btn-primary mt-3 w-full py-3 text-base" disabled={submitting}>
              {submitting ? "Signing in..." : "Sign In"}
            </button>

            <p className="mt-3 text-right text-xs">
              <Link to="/forgot-password" className="font-semibold text-teal-700 no-underline">Forgot password?</Link>
            </p>
          </form>

          <div className="my-6 text-center text-xs font-semibold sf-subtitle">OR</div>

          {oauthEnabled ? (
            <a
              href={googleOAuthUrl}
              className="sf-btn-secondary flex w-full items-center justify-center gap-2 px-4 py-3 text-center text-sm no-underline"
            >
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.657 32.657 29.221 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.153 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.153 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.14 35.091 26.715 36 24 36c-5.2 0-9.623-3.319-11.283-7.946l-6.522 5.025C9.513 39.556 16.227 44 24 44z"/>
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.05 12.05 0 0 1-4.084 5.571h.001l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
              </svg>
              <span>Continue with Google</span>
            </a>
          ) : (
            <button type="button" className="block w-full cursor-not-allowed rounded-xl border px-4 py-3 text-center text-sm font-semibold opacity-70" disabled>
              Continue with Google (Not Configured)
            </button>
          )}

          {!oauthEnabled && oauthMessage && <p className="mt-2 text-center text-xs text-amber-700">{oauthMessage}</p>}

          <div className="my-6 text-center text-xs font-semibold sf-subtitle">OR</div>

          <div className="mb-5 rounded-xl border border-teal-400/35 bg-teal-500/10 p-4">
            <p className="mb-3 text-xs font-bold text-teal-700">📌 Demo Credentials (Click to fill)</p>
            <p className="mb-4 text-xs text-teal-600">⭐ <strong>Admin account:</strong> Can create, edit, and delete quizzes</p>
            <div className="space-y-3">
              {demoCredentials.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => fillCredentials(item.email, item.password)}
                  className="w-full text-left rounded-lg border border-teal-400/25 bg-white/35 px-3 py-2 hover:bg-teal-400/15 hover:border-teal-400/50 transition-all"
                >
                  <p className="mb-1 text-xs font-bold text-teal-800">{item.label}</p>
                  <div className="mb-1 flex justify-between text-xs" style={{ color: "var(--text-muted)" }}>
                    <span>Email:</span>
                    <code>{item.email}</code>
                  </div>
                  <div className="flex justify-between text-xs" style={{ color: "var(--text-muted)" }}>
                    <span>Password:</span>
                    <code>{item.password}</code>
                  </div>
                </button>
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
