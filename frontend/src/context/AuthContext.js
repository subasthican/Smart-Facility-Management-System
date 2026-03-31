import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // On mount, check if token exists and decode user info
  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({ email: payload.sub, role: payload.role });
      } catch (e) {
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  // Register
  const register = async (fullName, email, password, role) => {
    const response = await fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, password, role }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Registration failed");
    }

    return data;
  };

  // Login
  const login = async (email, password) => {
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Login failed");
    }

    localStorage.setItem("token", data.token);
    setToken(data.token);

    const payload = JSON.parse(atob(data.token.split(".")[1]));
    setUser({ email: payload.sub, role: payload.role });

    return data;
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
