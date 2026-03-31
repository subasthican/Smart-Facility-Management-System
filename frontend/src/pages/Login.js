import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const googleOAuthUrl = "http://localhost:8080/api/oauth2/authorization/google";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
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
          <button type="submit" style={styles.button}>Login</button>
        </form>
        <div style={styles.divider}>or</div>
        <a href={googleOAuthUrl} style={styles.oauthBtn}>Continue with Google</a>
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
  divider: {
    textAlign: "center",
    margin: "12px 0",
    color: "#777",
    fontSize: "13px",
  },
  oauthBtn: {
    display: "block",
    width: "100%",
    padding: "12px",
    backgroundColor: "#fff",
    color: "#1d1d1f",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "15px",
    textDecoration: "none",
    textAlign: "center",
    boxSizing: "border-box",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: "10px",
  },
  link: {
    textAlign: "center",
    marginTop: "15px",
    fontSize: "14px",
  },
};

export default Login;
