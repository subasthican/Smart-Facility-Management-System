import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Beams from "../components/Beams";

const guestHighlights = [
  {
    title: "Smart Bookings",
    text: "Reserve labs, classrooms, and meeting spaces in seconds with clear availability and instant confirmation.",
  },
  {
    title: "Live Facility Status",
    text: "Know which spaces are open, busy, or under maintenance before planning your day.",
  },
  {
    title: "Asset Tracking",
    text: "Find equipment, check usage, and request support from one dashboard.",
  },
  {
    title: "Role-Based Workspace",
    text: "Students, staff, and admins get personalized tools and quick actions.",
  },
];

const guestStats = [
  { label: "Facilities", value: "40+" },
  { label: "Daily Bookings", value: "1,200+" },
  { label: "Active Users", value: "10K+" },
  { label: "Response Time", value: "< 2 min" },
];

const roleContent = {
  ADMIN: {
    title: "Admin Home",
    subtitle: "Control users, monitor activity, and keep every facility running smoothly.",
    cards: [
      { title: "User Management", text: "Create and manage student/staff accounts.", link: "/admin/students" },
      { title: "Bookings Review", text: "Approve and monitor all bookings.", link: "/bookings" },
      { title: "Facilities & Assets", text: "Manage catalogues and availability.", link: "/facilities" },
    ],
    quickActions: [
      { label: "Add New Student", link: "/admin/students" },
      { label: "Open Booking Queue", link: "/bookings" },
      { label: "Check Assets", link: "/assets" },
    ],
  },
  STUDENT: {
    title: "Student Home",
    subtitle: "Plan your study day with fast booking, facility details, and clear booking status.",
    cards: [
      { title: "Create Booking", text: "Reserve facilities quickly and easily.", link: "/create-booking" },
      { title: "My Bookings", text: "Track status and cancel when needed.", link: "/bookings" },
      { title: "Explore Facilities", text: "View available spaces and resources.", link: "/facilities" },
    ],
    quickActions: [
      { label: "Book Study Room", link: "/create-booking" },
      { label: "View My Schedule", link: "/bookings" },
      { label: "Browse Facilities", link: "/facilities" },
    ],
  },
  STAFF: {
    title: "Staff Home",
    subtitle: "Support classes and events by tracking spaces, equipment, and booking flow in one place.",
    cards: [
      { title: "Bookings Overview", text: "View current booking activity.", link: "/bookings" },
      { title: "Facilities", text: "Check facility status and details.", link: "/facilities" },
      { title: "Assets", text: "Inspect assets assigned to facilities.", link: "/assets" },
    ],
    quickActions: [
      { label: "Open Facility List", link: "/facilities" },
      { label: "Review Bookings", link: "/bookings" },
      { label: "Track Equipment", link: "/assets" },
    ],
  },
};

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

const Home = () => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const selectedRole = roleContent[user?.role] || null;

    if (!user) {
      return (
        <section className={`relative min-h-screen overflow-hidden ${isDark ? "bg-[#020202]" : "bg-[#eef4ff]"}`}>
          <div
            className="pointer-events-none absolute inset-0"
            style={
              isDark
                ? undefined
                : {
                    opacity: 0.32,
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
          <div className={`pointer-events-none absolute inset-0 ${isDark ? "bg-gradient-to-b from-black/20 via-black/45 to-black/70" : "bg-gradient-to-b from-white/74 via-slate-100/58 to-slate-200/46"}`} />
          {!isDark && (
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(1050px 500px at 18% 24%, rgba(203,213,225,0.32), transparent 55%), radial-gradient(900px 460px at 84% 75%, rgba(148,163,184,0.22), transparent 60%), linear-gradient(120deg, rgba(148,163,184,0.12), transparent 32%, rgba(100,116,139,0.08) 70%, transparent)",
              }}
            />
          )}

          <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6 pb-16 sm:px-8 sm:pb-20">
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
                  <Link to="/login" className={isDark ? "rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white no-underline" : "rounded-full border border-slate-900/15 bg-white/85 px-4 py-2 text-sm font-semibold text-slate-700 no-underline"}>Sign in</Link>
                </div>
              </div>
            </div>

            <section className="mx-auto flex min-h-[calc(100vh-180px)] max-w-5xl flex-col items-center justify-center text-center">
              <h1 className={`text-5xl font-black tracking-tight sm:text-6xl ${isDark ? "text-white" : "text-slate-900"}`}>Welcome</h1>
              <p className={`mx-auto mt-4 max-w-2xl text-base leading-relaxed sm:text-lg ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                A clean and comfortable workspace to manage bookings, facilities, and assets with clear role-based actions.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link to="/" className={isDark ? "rounded-full bg-gradient-to-br from-slate-100 to-white px-8 py-3 text-sm font-semibold text-slate-900 no-underline shadow-lg shadow-black/25" : "rounded-full bg-gradient-to-br from-slate-900 to-slate-800 px-8 py-3 text-sm font-semibold text-white no-underline shadow-lg shadow-slate-900/20"}>
                  Home
                </Link>
                <Link to="/login" className={isDark ? "rounded-full border border-white/15 bg-white/10 px-8 py-3 text-sm font-semibold text-white no-underline shadow backdrop-blur-sm" : "rounded-full border border-slate-900/15 bg-white/85 px-8 py-3 text-sm font-semibold text-slate-700 no-underline shadow"}>
                  Sign In
                </Link>
              </div>
            </section>

            <section className="mx-auto mt-2 max-w-5xl text-center sm:mt-4">
              <h2 className={isDark ? "text-3xl font-black tracking-tight text-white sm:text-4xl" : "text-3xl font-black tracking-tight text-slate-900 sm:text-4xl"}>
                Campus Home, Reimagined
              </h2>
              <p className={`mx-auto mt-3 max-w-3xl text-base leading-relaxed sm:text-lg ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                Help students and teachers manage classes, rooms, and resources without confusion. Everything from booking to support is available in one modern dashboard.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {guestStats.map((item) => (
                  <article
                    key={item.label}
                    className={isDark ? "rounded-2xl border border-white/10 bg-black/35 px-4 py-4 shadow-lg shadow-black/25 backdrop-blur-xl" : "rounded-2xl border border-slate-900/10 bg-white/80 px-4 py-4 shadow-lg shadow-slate-900/10 backdrop-blur-xl"}
                  >
                    <p className={isDark ? "text-2xl font-black text-white" : "text-2xl font-black text-slate-900"}>{item.value}</p>
                    <p className={isDark ? "mt-1 text-xs uppercase tracking-[0.12em] text-slate-300" : "mt-1 text-xs uppercase tracking-[0.12em] text-slate-600"}>{item.label}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-4 sm:mt-12 md:grid-cols-2">
              {guestHighlights.map((item) => (
                <article
                  key={item.title}
                  className={isDark ? "rounded-3xl border border-white/10 bg-black/35 p-5 shadow-xl shadow-black/25 backdrop-blur-xl" : "rounded-3xl border border-slate-900/10 bg-white/80 p-5 shadow-xl shadow-slate-900/10 backdrop-blur-xl"}
                >
                  <h3 className={isDark ? "text-lg font-bold text-white" : "text-lg font-bold text-slate-900"}>{item.title}</h3>
                  <p className={isDark ? "mt-2 text-sm leading-relaxed text-slate-200" : "mt-2 text-sm leading-relaxed text-slate-700"}>{item.text}</p>
                </article>
              ))}
            </section>

            <section className={isDark ? "mx-auto mt-10 max-w-5xl rounded-3xl border border-white/10 bg-black/40 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:mt-12 sm:p-8" : "mx-auto mt-10 max-w-5xl rounded-3xl border border-slate-900/10 bg-white/85 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur-xl sm:mt-12 sm:p-8"}>
              <h2 className={isDark ? "text-2xl font-bold text-white" : "text-2xl font-bold text-slate-900"}>Built for Students and Teachers</h2>
              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <article className={isDark ? "rounded-2xl border border-white/10 bg-white/5 p-5" : "rounded-2xl border border-slate-900/10 bg-slate-50 p-5"}>
                  <h3 className={isDark ? "text-base font-bold text-white" : "text-base font-bold text-slate-900"}>Student Benefits</h3>
                  <p className={isDark ? "mt-2 text-sm leading-relaxed text-slate-200" : "mt-2 text-sm leading-relaxed text-slate-700"}>
                    Book spaces quickly, track approvals, and find the right study environment without waiting.
                  </p>
                </article>
                <article className={isDark ? "rounded-2xl border border-white/10 bg-white/5 p-5" : "rounded-2xl border border-slate-900/10 bg-slate-50 p-5"}>
                  <h3 className={isDark ? "text-base font-bold text-white" : "text-base font-bold text-slate-900"}>Teacher Benefits</h3>
                  <p className={isDark ? "mt-2 text-sm leading-relaxed text-slate-200" : "mt-2 text-sm leading-relaxed text-slate-700"}>
                    Arrange classes, reserve labs, and coordinate facility resources with clear schedules and fewer clashes.
                  </p>
                </article>
              </div>
            </section>
          </div>
        </section>
      );
    }

  return (
      <section className={`relative min-h-[calc(100vh-180px)] overflow-hidden rounded-3xl p-7 shadow-shell backdrop-blur-md ${isDark ? "border border-white/10 bg-[#020202]" : "border border-slate-300/60 bg-slate-300/55"}`}>
      <div
        className="pointer-events-none absolute inset-0"
        style={
          isDark
            ? undefined
            : {
                opacity: 0.32,
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
      <div className={`pointer-events-none absolute inset-0 ${isDark ? "bg-gradient-to-b from-black/30 via-black/55 to-black/80" : "bg-gradient-to-b from-slate-200/35 via-slate-300/45 to-slate-400/35"}`} />
      <div className={`pointer-events-none absolute -right-24 -top-40 h-[440px] w-[440px] rounded-full blur-3xl ${isDark ? "bg-white/10" : "bg-slate-200/45"}`} />
      <div className={`pointer-events-none absolute -bottom-52 -left-28 h-[460px] w-[460px] rounded-full blur-3xl ${isDark ? "bg-cyan-300/10" : "bg-slate-300/35"}`} />

      <div className={`relative z-10 mb-8 mx-auto max-w-5xl rounded-[2rem] px-6 py-8 text-center shadow-2xl backdrop-blur-2xl sm:px-8 sm:py-10 ${isDark ? "border border-white/10 bg-black/35 shadow-black/40" : "border border-slate-300/60 bg-slate-100/70 shadow-slate-700/10"}`}>
        <p className={`mb-4 inline-block rounded-full px-3 py-2 text-xs uppercase tracking-[0.14em] shadow-inner ${isDark ? "border border-white/15 bg-white/8 text-white/80 shadow-black/20" : "border border-slate-300/70 bg-slate-200/70 text-slate-600 shadow-slate-400/20"}`}>
          Smart Facility Management
        </p>
        <h1 className={`text-4xl font-bold tracking-tight md:text-5xl ${isDark ? "text-white" : "text-slate-900"}`}>{selectedRole?.title || "Welcome"}</h1>
        <p className={`mx-auto mt-3 max-w-2xl text-base leading-relaxed ${isDark ? "text-slate-200" : "text-slate-700"}`}>
          {selectedRole?.subtitle || "A clean and comfortable workspace to manage bookings, facilities, and assets with clear role-based actions."}
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {selectedRole?.quickActions?.map((action) => (
            <Link
              key={action.label}
              to={action.link}
              className={isDark ? "rounded-full border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white no-underline shadow backdrop-blur-sm" : "rounded-full border border-slate-300/70 bg-slate-100/80 px-5 py-2.5 text-sm font-semibold text-slate-700 no-underline shadow"}
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="relative z-10 mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Today Bookings" value="126" hint="+12 from yesterday" isDark={isDark} />
        <StatCard label="Open Facilities" value="34" hint="2 under maintenance" isDark={isDark} />
        <StatCard label="Assets In Use" value="218" hint="78% utilization" isDark={isDark} />
        <StatCard label="Avg. Response" value="1.8m" hint="Support requests" isDark={isDark} />
      </div>

      <div className={`relative z-10 mb-8 rounded-3xl p-5 shadow-2xl backdrop-blur-xl sm:p-6 ${isDark ? "border border-white/10 bg-black/35 shadow-black/30" : "border border-slate-300/60 bg-slate-200/55 shadow-slate-700/10"}`}>
        <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>How to finish tasks faster</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <article className={isDark ? "rounded-2xl border border-white/10 bg-white/5 p-4" : "rounded-2xl border border-slate-300/70 bg-slate-100/60 p-4"}>
            <p className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>1. Check availability</p>
            <p className={`mt-1 text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>Open facilities and verify room status before creating requests.</p>
          </article>
          <article className={isDark ? "rounded-2xl border border-white/10 bg-white/5 p-4" : "rounded-2xl border border-slate-300/70 bg-slate-100/60 p-4"}>
            <p className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>2. Create booking</p>
            <p className={`mt-1 text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>Submit booking details with date, time, and required assets.</p>
          </article>
          <article className={isDark ? "rounded-2xl border border-white/10 bg-white/5 p-4" : "rounded-2xl border border-slate-300/70 bg-slate-100/60 p-4"}>
            <p className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>3. Track and update</p>
            <p className={`mt-1 text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>Monitor approval and update plans quickly from your dashboard.</p>
          </article>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {selectedRole?.cards?.map((item) => (
          <Card key={item.title} title={item.title} text={item.text} link={item.link} isDark={isDark} />
        ))}
      </div>

      <div className={`relative z-10 mt-8 rounded-3xl p-5 shadow-2xl backdrop-blur-xl sm:p-6 ${isDark ? "border border-white/10 bg-black/35 shadow-black/30" : "border border-slate-300/60 bg-slate-200/55 shadow-slate-700/10"}`}>
        <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Announcements</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <article className={isDark ? "rounded-2xl border border-white/10 bg-white/5 p-4" : "rounded-2xl border border-slate-300/70 bg-slate-100/60 p-4"}>
            <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Lab A upgraded with new systems</p>
            <p className={`mt-1 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>New machines are available for project classes from Monday.</p>
          </article>
          <article className={isDark ? "rounded-2xl border border-white/10 bg-white/5 p-4" : "rounded-2xl border border-slate-300/70 bg-slate-100/60 p-4"}>
            <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Weekend maintenance schedule</p>
            <p className={`mt-1 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>Main auditorium and Seminar Hall 2 will be unavailable on Saturday.</p>
          </article>
        </div>
      </div>
    </section>
  );
};

const Card = ({ title, text, link, isDark }) => (
  <article className={isDark ? "rounded-[24px] border border-white/10 bg-white/8 p-4 shadow-lg shadow-black/20 backdrop-blur-xl" : "rounded-[24px] border border-slate-300/70 bg-slate-100/68 p-4 shadow-lg shadow-slate-700/10 backdrop-blur-xl"}>
    <h3 className={`mb-2 text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{title}</h3>
    <p className={`mb-3 text-sm leading-relaxed ${isDark ? "text-slate-200" : "text-slate-600"}`}>{text}</p>
    <Link to={link} className={`text-sm font-bold no-underline ${isDark ? "text-white" : "text-slate-900"}`}>
      Open
    </Link>
  </article>
);

const StatCard = ({ label, value, hint, isDark }) => (
  <article className={isDark ? "rounded-2xl border border-white/10 bg-black/35 p-4 shadow-lg shadow-black/25 backdrop-blur-xl" : "rounded-2xl border border-slate-300/70 bg-slate-100/68 p-4 shadow-lg shadow-slate-700/10 backdrop-blur-xl"}>
    <p className={`text-xs uppercase tracking-[0.12em] ${isDark ? "text-slate-300" : "text-slate-600"}`}>{label}</p>
    <p className={`mt-2 text-2xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>{value}</p>
    <p className={`mt-1 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>{hint}</p>
  </article>
);

export default Home;
