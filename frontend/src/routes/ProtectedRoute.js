import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <p>Loading...</p>;
  }

  // Not logged in — redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.mustResetPassword && location.pathname !== "/reset-password") {
    return <Navigate to="/reset-password" replace />;
  }

  if (!user.mustResetPassword && location.pathname === "/reset-password") {
    return <Navigate to="/dashboard" replace />;
  }

  // Role check — if allowedRoles specified, check user's role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;