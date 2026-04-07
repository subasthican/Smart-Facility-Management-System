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
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Sign in to your account to continue</p>
          
          {error && <div style={styles.error}>{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            
            <button type="submit" style={styles.button} disabled={submitting}>
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div style={styles.divider}>OR</div>

          {oauthEnabled ? (
            <a href={googleOAuthUrl} style={styles.oauthBtn}>Continue with Google</a>
          ) : (
            <button type="button" style={styles.oauthBtnDisabled} disabled>
              Continue with Google (Not Configured)
            </button>
          )}

          {!oauthEnabled && oauthMessage && <p style={styles.oauthHint}>{oauthMessage}</p>}

          <div style={styles.divider}>OR</div>

          <div style={styles.demoBox}>
            <p style={styles.demoTitle}>📌 Demo Credentials</p>
            <div style={styles.demoItem}>
              <span>Email:</span>
              <code>admin@gmail.com</code>
            </div>
            <div style={styles.demoItem}>
              <span>Password:</span>
              <code>admin123</code>
            </div>
          </div>
          
          <p style={styles.link}>
            Don't have an account? <Link to="/register" style={styles.linkText}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "calc(100vh - 80px)",
    padding: "40px 20px",
  },
  wrapper: {
    width: "100%",
    maxWidth: "450px",
  },
  card: {
    background: "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(241,245,249,0.86))",
    border: "1px solid rgba(15, 23, 42, 0.12)",
    padding: "48px",
    borderRadius: "18px",
    boxShadow: "0 24px 44px rgba(15, 23, 42, 0.14)",
  },
  title: {
    textAlign: "center",
    marginBottom: "8px",
    color: "#1f2937",
    fontSize: "28px",
    fontWeight: "700",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: "32px",
    color: "#6b7280",
    fontSize: "14px",
  },
  error: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "14px",
    border: "1px solid #fecaca",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    color: "#374151",
    fontSize: "14px",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    boxSizing: "border-box",
    transition: "all 0.3s ease",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 14px 26px rgba(15, 23, 42, 0.25)",
    marginTop: "12px",
  },
  oauthBtn: {
    display: "block",
    width: "100%",
    padding: "12px",
    backgroundColor: "#fff",
    color: "#1d1d1f",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    textDecoration: "none",
    textAlign: "center",
    boxSizing: "border-box",
    fontWeight: "600",
  },
  oauthBtnDisabled: {
    display: "block",
    width: "100%",
    padding: "12px",
    backgroundColor: "#f3f4f6",
    color: "#6b7280",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    textAlign: "center",
    boxSizing: "border-box",
    fontWeight: "600",
    cursor: "not-allowed",
  },
  oauthHint: {
    marginTop: "10px",
    color: "#b45309",
    fontSize: "12px",
    textAlign: "center",
  },
  divider: {
    textAlign: "center",
    color: "#9ca3af",
    margin: "24px 0",
    position: "relative",
    fontSize: "12px",
    fontWeight: "600",
  },
  demoBox: {
    backgroundColor: "#ecfeff",
    border: "1px solid #99f6e4",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "20px",
  },
  demoTitle: {
    margin: "0 0 12px 0",
    fontWeight: "700",
    color: "#0f766e",
    fontSize: "13px",
  },
  demoItem: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px",
    color: "#374151",
    marginBottom: "8px",
  },
  link: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "14px",
    color: "#6b7280",
  },
  linkText: {
    color: "#0f766e",
    textDecoration: "none",
    fontWeight: "600",
    transition: "color 0.3s ease",
  },
};

export default Login;
