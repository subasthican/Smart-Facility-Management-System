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
        const res = await fetch("http://localhost:8080/api/auth/oauth/google/enabled");
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
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.subtitle}>Fill in your details to join our platform</p>
          
          {error && <div style={styles.error}>{error}</div>}
          {success && <div style={styles.success}>{success}</div>}
          
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={styles.input}
                required
              />
            </div>

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

            <div style={styles.formGroup}>
              <label style={styles.label}>Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={styles.input}
                required
              />
            </div>

            <button type="submit" style={styles.button} disabled={submitting}>
              {submitting ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div style={styles.divider}>OR</div>
          {oauthEnabled ? (
            <a href={googleOAuthUrl} style={styles.oauthBtn}>Sign up with Google</a>
          ) : (
            <button type="button" style={styles.oauthBtnDisabled} disabled>
              Sign up with Google (Not Configured)
            </button>
          )}

          {!oauthEnabled && oauthMessage && <p style={styles.oauthHint}>{oauthMessage}</p>}

          <p style={styles.link}>
            Already have an account? <Link to="/login" style={styles.linkText}>Sign in</Link>
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
    backgroundColor: "white",
    padding: "48px",
    borderRadius: "16px",
    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.1)",
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
  success: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "14px",
    border: "1px solid #bbf7d0",
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
    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 10px 30px rgba(99, 102, 241, 0.2)",
    marginTop: "12px",
  },
  divider: {
    textAlign: "center",
    color: "#9ca3af",
    margin: "24px 0",
    fontSize: "12px",
    fontWeight: "600",
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
  link: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "14px",
    color: "#6b7280",
  },
  linkText: {
    color: "#6366f1",
    textDecoration: "none",
    fontWeight: "600",
    transition: "color 0.3s ease",
  },
};

export default Register;
