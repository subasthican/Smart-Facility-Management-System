import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button} disabled={submitting}>
            {submitting ? "Signing in..." : "Login"}
          </button>
        </form>
        <div style={styles.demoBox}>
          <p style={styles.demoTitle}>Default Admin Login</p>
          <p style={styles.demoText}>Email: admin@gmail.com</p>
          <p style={styles.demoText}>Password: admin123</p>
        </div>
        <p style={styles.link}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
  },
  card: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    width: "400px",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#1d1d1f",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#1d1d1f",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: "10px",
  },
  demoBox: {
    backgroundColor: "#f5f5f5",
    borderRadius: "6px",
    padding: "10px 12px",
    marginTop: "10px",
  },
  demoTitle: {
    margin: "0 0 6px 0",
    fontWeight: "600",
    color: "#1d1d1f",
    fontSize: "14px",
  },
  demoText: {
    margin: "2px 0",
    fontSize: "13px",
    color: "#333",
  },
  link: {
    textAlign: "center",
    marginTop: "15px",
    fontSize: "14px",
  },
};

export default Login;
