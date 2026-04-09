import React, { useState } from "react";
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
  const [isAiDockOpen, setIsAiDockOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isAiEmbed =
    location.pathname === "/ai-chat" &&
    new URLSearchParams(location.search).get("embed") === "1";
  const isGuestHome = !user && location.pathname === "/";
  const isAuthRoute = ["/login", "/register", "/oauth2/callback", "/forgot-password", "/reset-password"].includes(location.pathname);
  const isAuthenticated = !!user;
  const isAuthenticatedHome = !!user && location.pathname === "/";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={`relative flex min-h-screen flex-col ${isGuestHome ? (isDark ? "bg-[#020202] text-slate-100" : "bg-sf-shell text-slate-900") : isDark ? "bg-[#020202] text-slate-100" : "bg-sf-shell text-slate-900"}`}>
      {!isGuestHome && !isAiEmbed && (
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

      {isGuestHome && !isAiEmbed && (
        <div className="absolute left-0 right-0 top-0 z-20 px-6 pt-6 sm:px-8 sm:pt-8">
          <div className={`mx-auto flex w-full max-w-[760px] items-center justify-between rounded-full border px-4 py-3 shadow-2xl backdrop-blur-xl sm:px-6 ${isDark ? "border-white/15 bg-black/45 shadow-black/40" : "border-slate-900/10 bg-white/75 shadow-slate-900/15"}`}>
            <p className={`text-xs font-bold uppercase tracking-[0.14em] ${isDark ? "text-white/90" : "text-slate-800"}`}>SMART FACILITY</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className={isDark ? "inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white" : "inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-900/15 bg-white/85 text-slate-700"}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                <ThemeToggleIcon isDark={isDark} />
              </button>
              <Link to="/" className={isDark ? "rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white no-underline" : "rounded-full border border-slate-900/15 bg-white/85 px-4 py-2 text-sm font-semibold text-slate-700 no-underline"}>Home</Link>
              <Link to="/login" className={isDark ? "rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white no-underline" : "rounded-full border border-slate-900/15 bg-white/85 px-4 py-2 text-sm font-semibold text-slate-700 no-underline"}>Sign in</Link>
            </div>
          </div>
        </div>
      )}

      {isAuthRoute && !isAiEmbed && (
        <div className="px-6 pt-6 sm:px-8 sm:pt-8">
          <div className={`mx-auto flex w-full max-w-[760px] items-center justify-between rounded-full border px-4 py-3 shadow-2xl backdrop-blur-xl sm:px-6 ${isDark ? "border-white/15 bg-black/45 shadow-black/40" : "border-slate-900/10 bg-white/75 shadow-slate-900/15"}`}>
            <p className={`text-xs font-bold uppercase tracking-[0.14em] ${isDark ? "text-white/90" : "text-slate-800"}`}>SMART FACILITY</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className={isDark ? "inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white" : "inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-900/15 bg-white/85 text-slate-700"}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                <ThemeToggleIcon isDark={isDark} />
              </button>
              <Link to="/" className={isDark ? "rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white no-underline" : "rounded-full border border-slate-900/15 bg-white/85 px-4 py-2 text-sm font-semibold text-slate-700 no-underline"}>Home</Link>
              {user ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className={isDark ? "rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white" : "rounded-full border border-slate-900/15 bg-white/85 px-4 py-2 text-sm font-semibold text-slate-700"}
                >
                  Logout
                </button>
              ) : (
                <Link to={location.pathname === "/login" ? "/register" : "/login"} className={isDark ? "rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white no-underline" : "rounded-full border border-slate-900/15 bg-white/85 px-4 py-2 text-sm font-semibold text-slate-700 no-underline"}>
                  {location.pathname === "/login" ? "Register" : "Sign in"}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {!isGuestHome && !isAuthRoute && !isAiEmbed && (
      <header className={isAuthenticated ? "absolute left-0 right-0 top-0 z-20 pt-6" : `sticky top-0 z-20 border-b shadow-lg backdrop-blur-md backdrop-saturate-150 ${isDark ? "border-white/10 bg-black/35" : "border-slate-900/10 bg-white/55"}`}>
        <div className={`mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-4 px-6 ${user ? "rounded-full border px-5 py-3 shadow-2xl backdrop-blur-xl " + (isDark ? "border-white/15 bg-black/45 shadow-black/30" : "border-slate-900/10 bg-white/75 shadow-slate-900/10") : "py-3"}`}>
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
          <nav className={`flex flex-wrap items-center gap-3 ${user ? "" : `rounded-full px-3 py-2 shadow-2xl backdrop-blur-xl ${isDark ? "border border-white/10 bg-black/55 shadow-black/30" : "border border-slate-900/10 bg-white/70 shadow-slate-900/10"}`}`}>
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
                <Link to="/quizzes" className={isDark ? "rounded-full border border-white/10 bg-white/8 px-3 py-2 text-sm text-white/90 shadow-inner no-underline" : "rounded-full border border-slate-900/10 bg-white/80 px-3 py-2 text-sm text-slate-700 shadow-inner no-underline"}>Quizzes</Link>
                <Link to="/notebooks" className={isDark ? "rounded-full border border-white/10 bg-white/8 px-3 py-2 text-sm text-white/90 shadow-inner no-underline" : "rounded-full border border-slate-900/10 bg-white/80 px-3 py-2 text-sm text-slate-700 shadow-inner no-underline"}>Notebook</Link>
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

      <main className={
        isAiEmbed
          ? "w-full flex-1 p-0"
          : isGuestHome
          ? "w-full flex-1"
          : isAuthenticatedHome
            ? "w-full flex-1"
            : isAuthRoute
              ? "relative z-10 mx-auto w-full max-w-[1200px] flex-1 px-6 py-6"
            : isAuthenticated
              ? "relative z-10 mx-auto w-full max-w-[1200px] flex-1 px-6 pb-6 pt-28"
              : "relative z-10 mx-auto w-full max-w-[1200px] flex-1 px-6 py-6"
      }>
        {children}
      </main>

      {isAuthenticated && !isAiEmbed && (
        <Link
          to="/quizzes"
          aria-label="Open Quiz Management"
          title="Open Quiz Management"
          className={`group z-[9999] inline-flex h-14 w-14 items-center justify-center rounded-full border no-underline shadow-2xl backdrop-blur-xl transition hover:-translate-y-0.5 ${isDark ? "border-emerald-300/45 bg-slate-900/90 text-emerald-200 shadow-emerald-500/30" : "border-emerald-400/55 bg-white/90 text-emerald-700 shadow-emerald-500/30"}`}
          style={{ position: "fixed", right: "24px", bottom: "92px", left: "auto", top: "auto" }}
        >
          <span className={`pointer-events-none absolute inset-0 rounded-full blur-md ${isDark ? "bg-emerald-400/25" : "bg-emerald-400/25"}`} />
          <span className={`pointer-events-none absolute -inset-1 rounded-full border ${isDark ? "border-emerald-300/30" : "border-emerald-400/35"} opacity-70 group-hover:opacity-100`} />
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="relative z-10">
            <path d="M9 4H15M7 6H17C18.1046 6 19 6.89543 19 8V20L16 18L13 20L10 18L7 20V8C7 6.89543 7.89543 6 9 6Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 10H14M10 13H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      )}

      {isAuthenticated && !isAiEmbed && (
        <button
          type="button"
          aria-label={isAiDockOpen ? "Close AI Chat" : "Open AI Chat"}
          title={isAiDockOpen ? "Close AI Chat" : "Open AI Chat"}
          onClick={() => setIsAiDockOpen((prev) => !prev)}
          className={`group z-[9999] inline-flex h-14 w-14 items-center justify-center rounded-full border no-underline shadow-2xl backdrop-blur-xl transition hover:-translate-y-0.5 ${isDark ? "border-cyan-300/45 bg-slate-900/90 text-cyan-200 shadow-cyan-500/30" : "border-sky-400/55 bg-white/90 text-sky-700 shadow-sky-500/30"}`}
          style={{ position: "fixed", right: "24px", bottom: "24px", left: "auto", top: "auto" }}
        >
          <span className={`pointer-events-none absolute inset-0 rounded-full blur-md ${isDark ? "bg-cyan-400/25" : "bg-sky-400/25"}`} />
          <span className={`pointer-events-none absolute -inset-1 rounded-full border ${isDark ? "border-cyan-300/30" : "border-sky-400/35"} opacity-70 group-hover:opacity-100`} />
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="relative z-10">
            <path d="M7 9H17M7 13H14M21 12C21 16.4183 16.9706 20 12 20C10.7364 20 9.53294 19.7685 8.45172 19.3512L3 20L4.03774 16.0732C3.37727 14.896 3 13.4913 3 12C3 7.58172 7.02944 4 12 4C16.9706 4 21 7.58172 21 12Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      {isAuthenticated && !isAiEmbed && isAiDockOpen && (
        <div
          className={`z-[9998] overflow-hidden rounded-2xl border shadow-2xl ${isDark ? "border-white/15 bg-black/85" : "border-slate-900/15 bg-white/95"}`}
          style={{
            position: "fixed",
            right: "24px",
            bottom: "92px",
            width: "min(360px, calc(100vw - 24px))",
            height: "min(460px, calc(100vh - 120px))",
          }}
        >
          <div className={`flex items-center justify-between border-b px-4 py-2 ${isDark ? "border-white/10" : "border-slate-900/10"}`}>
            <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>AI Chat</p>
            <div className="flex items-center gap-2">
              <Link to="/ai-chat" className={isDark ? "rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white no-underline" : "rounded-full border border-slate-900/15 bg-white px-3 py-1 text-xs text-slate-700 no-underline"}>
                Full Page
              </Link>
              <button
                type="button"
                onClick={() => setIsAiDockOpen(false)}
                className={isDark ? "rounded-full border border-white/15 bg-white/10 px-2 py-1 text-xs text-white" : "rounded-full border border-slate-900/15 bg-white px-2 py-1 text-xs text-slate-700"}
                aria-label="Close AI Chat"
                title="Close AI Chat"
              >
                X
              </button>
            </div>
          </div>
          <iframe
            title="AI Chat Dock"
            src={`/ai-chat?embed=1&theme=${isDark ? "dark" : "light"}`}
            className="h-[calc(100%-45px)] w-full border-0"
          />
        </div>
      )}

      {!isGuestHome && !isAiEmbed && (
      <footer className="relative z-10 mt-8 pb-6">
        <div className="mx-auto grid w-full max-w-[1200px] gap-4 px-6 py-5 md:grid-cols-3">
          <div className={`rounded-2xl border p-4 ${isDark ? "border-white/10 bg-white/5" : "border-slate-900/10 bg-white/70"}`}>
            <p className={`mb-2 text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Smart Facility Management System</p>
            <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              A student management platform for bookings, facilities, assets, incidents, and role-based access.
            </p>
          </div>

          <div className={`rounded-2xl border p-4 ${isDark ? "border-white/10 bg-white/5" : "border-slate-900/10 bg-white/70"}`}>
            <p className={`mb-3 text-xs font-bold uppercase tracking-[0.12em] ${isDark ? "text-slate-400" : "text-slate-500"}`}>Quick Links</p>
            <div className="flex flex-wrap gap-2">
              <Link to="/" className={isDark ? "rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white/90 no-underline shadow" : "rounded-full border border-slate-900/10 bg-white/85 px-3 py-1.5 text-xs text-slate-700 no-underline shadow"}>Home</Link>
              <Link to="/dashboard" className={isDark ? "rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white/90 no-underline shadow" : "rounded-full border border-slate-900/10 bg-white/85 px-3 py-1.5 text-xs text-slate-700 no-underline shadow"}>Dashboard</Link>
              <Link to="/profile" className={isDark ? "rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white/90 no-underline shadow" : "rounded-full border border-slate-900/10 bg-white/85 px-3 py-1.5 text-xs text-slate-700 no-underline shadow"}>Profile</Link>
              <Link to="/bookings" className={isDark ? "rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white/90 no-underline shadow" : "rounded-full border border-slate-900/10 bg-white/85 px-3 py-1.5 text-xs text-slate-700 no-underline shadow"}>Bookings</Link>
              <Link to="/facilities" className={isDark ? "rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white/90 no-underline shadow" : "rounded-full border border-slate-900/10 bg-white/85 px-3 py-1.5 text-xs text-slate-700 no-underline shadow"}>Facilities</Link>
              <Link to="/assets" className={isDark ? "rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white/90 no-underline shadow" : "rounded-full border border-slate-900/10 bg-white/85 px-3 py-1.5 text-xs text-slate-700 no-underline shadow"}>Assets</Link>
              <Link to="/quizzes" className={isDark ? "rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white/90 no-underline shadow" : "rounded-full border border-slate-900/10 bg-white/85 px-3 py-1.5 text-xs text-slate-700 no-underline shadow"}>Quizzes</Link>
              <Link to="/notebooks" className={isDark ? "rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white/90 no-underline shadow" : "rounded-full border border-slate-900/10 bg-white/85 px-3 py-1.5 text-xs text-slate-700 no-underline shadow"}>Notebook</Link>
              <Link to="/ai-chat" className={isDark ? "rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white/90 no-underline shadow" : "rounded-full border border-slate-900/10 bg-white/85 px-3 py-1.5 text-xs text-slate-700 no-underline shadow"}>AI Chat</Link>
            </div>
          </div>

          <div className={`rounded-2xl border p-4 md:text-right ${isDark ? "border-white/10 bg-white/5" : "border-slate-900/10 bg-white/70"}`}>
            <p className={`mb-3 text-xs font-bold uppercase tracking-[0.12em] ${isDark ? "text-slate-400" : "text-slate-500"}`}>Support</p>
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