import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Bookings from "./pages/Bookings";
import CreateBooking from "./pages/CreateBooking";
import Facilities from "./pages/Facilities";
import Assets from "./pages/Assets";
import AdminUsers from "./pages/AdminUsers";
import OAuth2Callback from "./pages/OAuth2Callback";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Router>
      <AuthProvider>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/oauth2/callback" element={<OAuth2Callback />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/bookings"
              element={
                <ProtectedRoute allowedRoles={["STUDENT", "STAFF", "ADMIN"]}>
                  <Bookings />
                </ProtectedRoute>
              }
            />

            <Route
              path="/create-booking"
              element={
                <ProtectedRoute allowedRoles={["STUDENT"]}>
                  <CreateBooking />
                </ProtectedRoute>
              }
            />

            <Route
              path="/facilities"
              element={
                <ProtectedRoute allowedRoles={["STUDENT", "STAFF", "ADMIN"]}>
                  <Facilities />
                </ProtectedRoute>
              }
            />

            <Route
              path="/assets"
              element={
                <ProtectedRoute allowedRoles={["STUDENT", "STAFF", "ADMIN"]}>
                  <Assets />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
          </Routes>
        </MainLayout>
      </AuthProvider>
    </Router>
  );
}

export default App;
