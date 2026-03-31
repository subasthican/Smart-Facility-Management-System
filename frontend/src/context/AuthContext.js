import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();
const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  const decodeToken = (jwt) => {
    const payload = JSON.parse(atob(jwt.split(".")[1]));
    return { email: payload.sub, role: payload.role };
  };

  const parseResponse = async (response) => {
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return response.json();
    }
    return { error: "Unexpected server response format" };
  };

  // On mount, check if token exists and decode user info
  useEffect(() => {
    if (token) {
      try {
        setUser(decodeToken(token));
      } catch (e) {
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  // Register
  const register = async (fullName, email, password, role) => {
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password, role }),
      });

      const data = await parseResponse(response);

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      return data;
    } catch (error) {
      if (error.name === "TypeError") {
        throw new Error("Cannot connect to server. Check backend is running.");
      }
      throw error;
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await parseResponse(response);

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(decodeToken(data.token));

      return data;
    } catch (error) {
      if (error.name === "TypeError") {
        throw new Error("Cannot connect to server. Check backend is running.");
      }
      throw error;
    }
  };

  // Login directly from an OAuth callback token
  const loginWithToken = (jwtToken) => {
    if (!jwtToken) {
      throw new Error("Missing OAuth token");
    }

    localStorage.setItem("token", jwtToken);
    setToken(jwtToken);

    const payload = JSON.parse(atob(jwtToken.split(".")[1]));
    setUser({ email: payload.sub, role: payload.role });
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, loginWithToken, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
