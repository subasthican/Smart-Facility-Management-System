import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
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
import IncidentTickets from "./pages/IncidentTickets";
import Notifications from "./pages/Notifications";
import OAuth2Callback from "./pages/OAuth2Callback";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import AIChat from "./pages/AIChat";
import Quizzes from "./pages/Quizzes";
import Notebook from "./pages/Notebook";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/oauth2/callback" element={<OAuth2Callback />} />
              <Route
                path="/reset-password"
                element={
                  <ProtectedRoute allowedRoles={["STUDENT", "STAFF", "ADMIN"]}>
                    <ResetPassword />
                  </ProtectedRoute>
                }
              />

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
                  <ProtectedRoute allowedRoles={["STUDENT", "STAFF", "ADMIN"]}>
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
                path="/admin/students"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN"]}>
                    <AdminUsers managedRole="STUDENT" />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/staff"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN"]}>
                    <AdminUsers managedRole="STAFF" />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/tickets"
                element={
                  <ProtectedRoute allowedRoles={["STUDENT", "STAFF", "ADMIN"]}>
                    <IncidentTickets />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/notifications"
                element={
                  <ProtectedRoute allowedRoles={["STUDENT", "STAFF", "ADMIN"]}>
                    <Notifications />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={["STUDENT", "STAFF", "ADMIN"]}>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/ai-chat"
                element={
                  <ProtectedRoute allowedRoles={["STUDENT", "STAFF", "ADMIN"]}>
                    <AIChat />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/quizzes"
                element={
                  <ProtectedRoute allowedRoles={["STUDENT", "STAFF", "ADMIN"]}>
                    <Quizzes />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/notebooks"
                element={
                  <ProtectedRoute allowedRoles={["STUDENT", "STAFF", "ADMIN"]}>
                    <Notebook />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </MainLayout>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
