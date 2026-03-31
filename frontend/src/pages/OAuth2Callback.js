import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const OAuth2Callback = () => {
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        setError("OAuth login failed: token not received");
        return;
      }

      loginWithToken(token);
      navigate("/dashboard");
    } catch (e) {
      setError("OAuth login failed. Please try again.");
    }
  }, [loginWithToken, navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {error ? (
          <>
            <h2 style={styles.title}>OAuth Login Error</h2>
            <p style={styles.error}>{error}</p>
            <button style={styles.button} onClick={() => navigate("/login")}>Back to Login</button>
          </>
        ) : (
          <>
            <h2 style={styles.title}>Signing you in...</h2>
            <p style={styles.text}>Completing OAuth login, please wait.</p>
          </>
        )}
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
    width: "420px",
    textAlign: "center",
  },
  title: {
    marginBottom: "14px",
    color: "#1d1d1f",
  },
  text: {
    color: "#444",
    marginBottom: "10px",
  },
  error: {
    color: "#d92d20",
    marginBottom: "16px",
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
};

export default OAuth2Callback;
