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
    <div className="flex min-h-[75vh] items-center justify-center px-5 py-8">
      <div className="sf-auth-card w-full max-w-md p-10 text-center">
        {error ? (
          <>
            <h2 className="mb-3 text-2xl font-bold sf-title">OAuth Login Error</h2>
            <p className="mb-4 text-sm text-rose-700">{error}</p>
            <button className="sf-btn-primary w-full py-3" onClick={() => navigate("/login")}>Back to Login</button>
          </>
        ) : (
          <>
            <h2 className="mb-3 text-2xl font-bold sf-title">Signing you in...</h2>
            <p className="text-sm sf-subtitle">Completing OAuth login, please wait.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default OAuth2Callback;
