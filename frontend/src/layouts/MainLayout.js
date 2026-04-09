import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import ShinyText from "../components/ShinyText";
import Beams from "../components/Beams";

const ThemeToggleIcon = ({ isDark }) => (
  isDark ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 4.5V2.5M12 21.5V19.5M4.5 12H2.5M21.5 12H19.5M6.34 6.34L4.93 4.93M19.07 19.07L17.66 17.66M17.66 6.34L19.07 4.93M4.93 19.07L6.34 17.66M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20.354 15.354C19.3267 15.7788 18.2257 15.9979 17.114 16C12.326 16 8.5 12.174 8.5 7.386C8.5021 6.27433 8.72116 5.17334 9.146 4.146C7.67344 4.75884 6.41491 5.79281 5.52926 7.11895C4.64361 8.44508 4.17031 10.0041 4.16992 11.599C4.16992 16.015 7.75492 19.6 12.1709 19.6C13.7659 19.5996 15.3249 19.1263 16.6511 18.2407C17.9772 17.355 19.0112 16.0965 19.624 14.624C19.849 15.1688 20.0951 15.4112 20.354 15.354Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
);

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isGuestHome = !user && location.pathname === "/";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={`relative flex min-h-screen flex-col ${isGuestHome ? "bg-sf-shell" : isDark ? "bg-[#020202] text-slate-100" : "bg-sf-shell text-slate-900"}`}>
      {!isGuestHome && (
        <>
          <div
            className="pointer-events-none absolute inset-0"
            style={
              isDark
                ? undefined
                : {
                    opacity: 0.3,
                    filter: "grayscale(1) contrast(1.24) brightness(1.1)",
                    mixBlendMode: "normal",
                  }
            }
          >
            <Beams
              beamWidth={3}
              beamHeight={30}
              beamNumber={20}
              lightColor="#ffffff"
              speed={2}
              noiseIntensity={1.55}
              scale={0.2}
              rotation={30}
            />
          </div>
          <div className={`pointer-events-none absolute inset-0 ${isDark ? "bg-gradient-to-b from-black/30 via-black/55 to-black/80" : "bg-gradient-to-b from-white/74 via-slate-100/58 to-slate-200/46"}`} />
          {!isDark && (
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(1200px 520px at 15% 20%, rgba(203,213,225,0.32), transparent 55%), radial-gradient(900px 480px at 85% 72%, rgba(148,163,184,0.22), transparent 60%), linear-gradient(120deg, rgba(148,163,184,0.12), transparent 32%, rgba(100,116,139,0.08) 70%, transparent)",
              }}
            />
          )}
        </>
      )}

      {!isGuestHome && (
      <header className={`sticky top-0 z-20 border-b shadow-lg backdrop-blur-md backdrop-saturate-150 ${isDark ? "border-white/10 bg-black/35" : "border-slate-900/10 bg-white/55"}`}>
        <div className={`mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-4 px-6 ${user ? "py-4" : "py-3"}`}>
          <div className={user ? "" : isDark ? "flex flex-wrap items-center gap-4 rounded-full border border-white/10 bg-black/55 px-5 py-3 shadow-2xl shadow-black/30 backdrop-blur-xl" : "flex flex-wrap items-center gap-4 rounded-full border border-slate-900/10 bg-white/70 px-5 py-3 shadow-2xl shadow-slate-900/10 backdrop-blur-xl"}>
            <div className="text-xs font-bold tracking-[0.12em]">
              <ShinyText
                text="SMART FACILITY"
                speed={2.1}
                delay={0}
                color={isDark ? "#94a3b8" : "#334155"}
                shineColor={isDark ? "#ffffff" : "#ffffff"}
                spread={120}
                direction="left"
                yoyo={false}
                pauseOnHover={false}
                disabled={false}
              />
            </div>
          </div>
          <nav className={`flex flex-wrap items-center gap-3 rounded-full px-3 py-2 shadow-2xl backdrop-blur-xl ${isDark ? "border border-white/10 bg-black/55 shadow-black/30" : "border border-slate-900/10 bg-white/70 shadow-slate-900/10"}`}>
            <Link
              to="/"
              className={isDark ? "rounded-full border border-white/10 bg-white/8 px-3 py-2 text-sm text-white/90 shadow-inner no-underline" : "rounded-full border border-slate-900/10 bg-white/80 px-3 py-2 text-sm text-slate-700 shadow-inner no-underline"}
            >
              Home
            </Link>
            {user ? (
              <>
                <Link to="/facilities" className={isDark ? "rounded-full border border-white/10 bg-white/8 px-3 py-2 text-sm text-white/90 shadow-inner no-underline" : "rounded-full border border-slate-900/10 bg-white/80 px-3 py-2 text-sm text-slate-700 shadow-inner no-underline"}>Facilities</Link>
                <Link to="/assets" className={isDark ? "rounded-full border border-white/10 bg-white/8 px-3 py-2 text-sm text-white/90 shadow-inner no-underline" : "rounded-full border border-slate-900/10 bg-white/80 px-3 py-2 text-sm text-slate-700 shadow-inner no-underline"}>Assets</Link>
                <Link to="/bookings" className={isDark ? "rounded-full border border-white/10 bg-white/8 px-3 py-2 text-sm text-white/90 shadow-inner no-underline" : "rounded-full border border-slate-900/10 bg-white/80 px-3 py-2 text-sm text-slate-700 shadow-inner no-underline"}>Bookings</Link>
              </>
            ) : null}
          </nav>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className={isDark ? "inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white" : "inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-900/15 bg-white/80 text-slate-700"}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              <ThemeToggleIcon isDark={isDark} />
            </button>
            {user ? (
              <>
                <Link to="/dashboard" className="rounded-full bg-gradient-to-br from-slate-900 to-slate-800 px-4 py-2 text-sm font-semibold text-white no-underline shadow-lg">Dashboard</Link>
                <Link to="/profile" className={isDark ? "rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white no-underline shadow" : "rounded-full border border-slate-900/15 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 no-underline shadow"}>Profile</Link>
                <span className={isDark ? "rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white/90" : "rounded-full border border-slate-900/15 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-700"}>{user.role}</span>
                <button type="button" onClick={handleLogout} className="rounded-full bg-gradient-to-br from-rose-700 to-rose-800 px-4 py-2 text-sm font-semibold text-white shadow-md">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className={isDark ? "rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white no-underline shadow" : "rounded-full border border-slate-900/20 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 no-underline shadow"}>Sign in</Link>
              </>
            )}
          </div>
        </div>
      </header>
      )}

      <main className={isGuestHome ? "w-full flex-1" : "relative z-10 mx-auto w-full max-w-[1200px] flex-1 px-6 py-6"}>
        {children}
      </main>

      {!isGuestHome && (
      <footer className={`relative z-10 mt-4 border-t backdrop-blur-md ${isDark ? "border-white/10 bg-black/45" : "border-slate-900/10 bg-white/70"}`}>
        <div className="mx-auto grid w-full max-w-[1200px] gap-6 px-6 py-6 md:grid-cols-3">
          <div className="max-w-sm">
            <p className={`mb-2 text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Smart Facility Management System</p>
            <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              A student management platform for bookings, facilities, assets, incidents, and role-based access.
            </p>
          </div>

          <div>
            <p className={`mb-2 text-xs font-bold uppercase tracking-[0.12em] ${isDark ? "text-slate-400" : "text-slate-500"}`}>Quick Links</p>
            <div className="flex flex-wrap gap-2">
              <Link to="/" className={isDark ? "rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white/90 no-underline shadow" : "rounded-full border border-slate-900/10 bg-white/80 px-3 py-1.5 text-xs text-slate-700 no-underline shadow"}>Home</Link>
              <Link to="/dashboard" className={isDark ? "rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white/90 no-underline shadow" : "rounded-full border border-slate-900/10 bg-white/80 px-3 py-1.5 text-xs text-slate-700 no-underline shadow"}>Dashboard</Link>
              <Link to="/profile" className={isDark ? "rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white/90 no-underline shadow" : "rounded-full border border-slate-900/10 bg-white/80 px-3 py-1.5 text-xs text-slate-700 no-underline shadow"}>Profile</Link>
              <Link to="/bookings" className={isDark ? "rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white/90 no-underline shadow" : "rounded-full border border-slate-900/10 bg-white/80 px-3 py-1.5 text-xs text-slate-700 no-underline shadow"}>Bookings</Link>
              <Link to="/facilities" className={isDark ? "rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white/90 no-underline shadow" : "rounded-full border border-slate-900/10 bg-white/80 px-3 py-1.5 text-xs text-slate-700 no-underline shadow"}>Facilities</Link>
              <Link to="/assets" className={isDark ? "rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white/90 no-underline shadow" : "rounded-full border border-slate-900/10 bg-white/80 px-3 py-1.5 text-xs text-slate-700 no-underline shadow"}>Assets</Link>
            </div>
          </div>

          <div className="md:text-right">
            <p className={`mb-2 text-xs font-bold uppercase tracking-[0.12em] ${isDark ? "text-slate-400" : "text-slate-500"}`}>Support</p>
            <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>Help desk: support@smartfacility.local</p>
            <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>Version: Campus release</p>
            <p className={`mt-2 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>2026 Smart Facility</p>
          </div>
        </div>
      </footer>
      )}
    </div>
  );
};

export default MainLayout;