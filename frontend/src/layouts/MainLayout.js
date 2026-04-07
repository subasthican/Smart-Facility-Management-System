import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen flex-col bg-sf-shell">
      <header className="sticky top-0 z-20 border-b border-slate-900/10 bg-white/55 shadow-lg backdrop-blur-md backdrop-saturate-150">
        <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="text-xs font-bold tracking-[0.12em] text-slate-900">SMARTFACILITY</div>
          <nav className="flex flex-wrap items-center gap-3">
            <Link to="/" className="rounded-full border border-slate-900/10 bg-white/40 px-3 py-2 text-sm text-slate-700 shadow-inner no-underline">Home</Link>
            <Link to="/facilities" className="rounded-full border border-slate-900/10 bg-white/40 px-3 py-2 text-sm text-slate-700 shadow-inner no-underline">Facilities</Link>
            <Link to="/assets" className="rounded-full border border-slate-900/10 bg-white/40 px-3 py-2 text-sm text-slate-700 shadow-inner no-underline">Assets</Link>
            <Link to="/bookings" className="rounded-full border border-slate-900/10 bg-white/40 px-3 py-2 text-sm text-slate-700 shadow-inner no-underline">Bookings</Link>
          </nav>
          <div className="flex flex-wrap items-center gap-2">
            {user ? (
              <>
                <Link to="/dashboard" className="rounded-full bg-gradient-to-br from-slate-900 to-slate-800 px-4 py-2 text-sm font-semibold text-white no-underline shadow-lg">Dashboard</Link>
                <span className="rounded-full border border-slate-900/20 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-700">{user.role}</span>
                <button type="button" onClick={handleLogout} className="rounded-full bg-gradient-to-br from-rose-700 to-rose-800 px-4 py-2 text-sm font-semibold text-white shadow-md">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="rounded-full border border-slate-900/20 bg-white/60 px-4 py-2 text-sm font-medium text-slate-800 no-underline shadow">Sign in</Link>
                <Link to="/register" className="rounded-full bg-gradient-to-br from-slate-900 to-slate-800 px-4 py-2 text-sm font-semibold text-white no-underline shadow-lg">Get started</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1200px] flex-1 px-6 py-6">
        {children}
      </main>

      <footer className="mt-4 border-t border-slate-900/10 bg-gradient-to-b from-white/60 to-slate-100/75 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-start justify-between gap-5 px-6 py-6">
          <div className="max-w-sm">
            <p className="mb-1 text-sm font-semibold text-slate-900">Smart Facility Management System</p>
            <p className="text-sm text-slate-600">Precision tools for campus operations and scheduling.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/bookings" className="rounded-full border border-slate-900/15 bg-white/70 px-3 py-1.5 text-xs text-slate-800 no-underline shadow">Bookings</Link>
            <Link to="/facilities" className="rounded-full border border-slate-900/15 bg-white/70 px-3 py-1.5 text-xs text-slate-800 no-underline shadow">Facilities</Link>
            <Link to="/assets" className="rounded-full border border-slate-900/15 bg-white/70 px-3 py-1.5 text-xs text-slate-800 no-underline shadow">Assets</Link>
          </div>
          <div className="ml-auto">
            <p className="text-xs text-slate-500">2026 Smart Facility</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;