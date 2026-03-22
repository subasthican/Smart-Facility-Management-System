import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMouseMove = (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      setPointer({ x, y });
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  const stageTransform = useMemo(() => {
    const rotateY = pointer.x * 5;
    const rotateX = pointer.y * -4;
    return `perspective(1300px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
  }, [pointer.x, pointer.y]);

  const motionStyles = `
    .home-shell {
      position: relative;
      overflow: hidden;
    }

    .home-noise {
      position: absolute;
      inset: 0;
      background-image: radial-gradient(rgba(10, 18, 35, 0.06) 0.7px, transparent 0.7px);
      background-size: 3px 3px;
      opacity: 0.32;
      pointer-events: none;
    }

    .motion-light {
      position: absolute;
      border-radius: 50%;
      filter: blur(8px);
      opacity: 0.78;
      animation: floatShift 9s ease-in-out infinite;
      pointer-events: none;
    }

    .motion-light.two {
      animation-duration: 12s;
      animation-delay: -2.8s;
    }

    .motion-light.three {
      animation-duration: 10.5s;
      animation-delay: -4.1s;
    }

    .home-stage {
      transform-style: preserve-3d;
      transition: transform 320ms ease-out;
      will-change: transform;
    }

    .elevate-card {
      transform: translateZ(34px);
      transition: transform 260ms ease, box-shadow 260ms ease;
    }

    .elevate-card:hover {
      transform: translateZ(56px) translateY(-4px);
      box-shadow: 0 24px 34px rgba(18, 33, 59, 0.18);
    }

    .home-fade {
      opacity: 0;
      transform: translateY(18px);
      animation: riseIn 920ms cubic-bezier(0.18, 0.9, 0.2, 1) forwards;
    }

    .home-fade.delay-1 { animation-delay: 120ms; }
    .home-fade.delay-2 { animation-delay: 260ms; }
    .home-fade.delay-3 { animation-delay: 380ms; }

    .shine-bar {
      position: absolute;
      inset: 0;
      background: linear-gradient(110deg, rgba(255,255,255,0) 25%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 75%);
      transform: translateX(-130%);
      animation: sheen 6s ease-in-out infinite;
      pointer-events: none;
    }

    @keyframes riseIn {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes floatShift {
      0%, 100% {
        transform: translate3d(0, 0, 0) scale(1);
      }
      50% {
        transform: translate3d(18px, -20px, 0) scale(1.08);
      }
    }

    @keyframes sheen {
      0% { transform: translateX(-130%); }
      52%, 100% { transform: translateX(130%); }
    }

    @media (max-width: 860px) {
      .home-stage {
        transform: none !important;
      }

      .elevate-card {
        transform: none;
      }
    }
  `;

  return (
    <div style={styles.page} className="home-shell">
      <style>{motionStyles}</style>
      <div className="home-noise" />

      <section style={{ ...styles.hero, transform: stageTransform }} className="home-stage" aria-label="Premium hero">
        <div style={styles.heroFrame} className="home-stage" aria-hidden="true" />
        <div style={styles.ambientGlowOne} className="motion-light" />
        <div style={styles.ambientGlowTwo} className="motion-light two" />
        <div style={styles.ambientGlowThree} className="motion-light three" />
        <div className="shine-bar" />

        <div style={{ ...styles.content, transform: stageTransform }}>
          <p style={styles.eyebrow} className="home-fade">Facility orchestration reimagined</p>
          <h1 style={styles.title} className="home-fade delay-1">A cinematic control center for modern campuses.</h1>
          <p style={styles.subtitle}>
            Book spaces, manage assets, and coordinate operations through a high-motion, high-clarity digital experience with premium depth and fluid interactions.
          </p>

          <div style={styles.ctas} className="home-fade delay-2">
            {user ? (
              <>
                <Link to="/dashboard" style={styles.ctaBtn}>Enter Dashboard</Link>
                <Link to="/bookings" style={styles.ctaBtnSecondary}>View Bookings</Link>
              </>
            ) : (
              <>
                <Link to="/register" style={styles.ctaBtn}>Start Free</Link>
                <Link to="/login" style={styles.ctaBtnSecondary}>Sign In</Link>
              </>
            )}
          </div>

          <div style={styles.kpis} className="home-fade delay-3">
            <div style={styles.kpiPill}>99.9% Scheduling Uptime</div>
            <div style={styles.kpiPill}>Sub-second Booking UX</div>
            <div style={styles.kpiPill}>Role-aware Security</div>
          </div>
        </div>

        <div style={styles.featureRail}>
          <article style={styles.featureCard} className="elevate-card home-fade delay-1">
            <h3 style={styles.featureTitle}>3D-Like Visual Depth</h3>
            <p style={styles.featureText}>Layered surfaces, cinematic gradients, and shadow hierarchy for a premium look.</p>
          </article>
          <article style={styles.featureCard} className="elevate-card home-fade delay-2">
            <h3 style={styles.featureTitle}>Unified Operations</h3>
            <p style={styles.featureText}>Bookings, facilities, and assets connected in one sleek workflow.</p>
          </article>
          <article style={styles.featureCard} className="elevate-card home-fade delay-3">
            <h3 style={styles.featureTitle}>Role-Aware Precision</h3>
            <p style={styles.featureText}>Students, staff, and admins each get the exact controls they need.</p>
          </article>
        </div>
      </section>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "calc(100vh - 180px)",
    paddingBottom: "10px",
    fontFamily: "Avenir Next, SF Pro Display, Helvetica Neue, Arial, sans-serif",
    color: "#14171c",
  },
  hero: {
    position: "relative",
    overflow: "hidden",
    borderRadius: "30px",
    border: "1px solid rgba(18, 24, 39, 0.08)",
    background: "linear-gradient(145deg, #ffffff 0%, #f4f7ff 44%, #edf3ff 100%)",
    boxShadow: "0 36px 70px rgba(31, 41, 55, 0.18), inset 0 1px 0 rgba(255,255,255,0.8)",
    padding: "66px 44px 40px",
    isolation: "isolate",
  },
  heroFrame: {
    position: "absolute",
    inset: "10px",
    borderRadius: "24px",
    border: "1px solid rgba(255, 255, 255, 0.7)",
    pointerEvents: "none",
    opacity: 0.72,
  },
  ambientGlowOne: {
    position: "absolute",
    width: "420px",
    height: "420px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(90, 120, 255, 0.36) 0%, rgba(90, 120, 255, 0) 72%)",
    top: "-170px",
    right: "-90px",
    pointerEvents: "none",
  },
  ambientGlowTwo: {
    position: "absolute",
    width: "360px",
    height: "360px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(32, 168, 255, 0.2) 0%, rgba(32, 168, 255, 0) 72%)",
    bottom: "-130px",
    left: "-90px",
    pointerEvents: "none",
  },
  ambientGlowThree: {
    position: "absolute",
    width: "280px",
    height: "280px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(24, 229, 195, 0.22) 0%, rgba(24, 229, 195, 0) 72%)",
    top: "34%",
    right: "32%",
    pointerEvents: "none",
  },
  content: {
    textAlign: "center",
    maxWidth: "860px",
    margin: "0 auto 42px",
    position: "relative",
    zIndex: 2,
  },
  eyebrow: {
    display: "inline-block",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.14em",
    padding: "8px 12px",
    borderRadius: "999px",
    marginBottom: "18px",
    background: "rgba(255,255,255,0.85)",
    border: "1px solid rgba(17, 24, 39, 0.12)",
    color: "#2a3347",
  },
  title: {
    fontSize: "clamp(38px, 6vw, 74px)",
    fontWeight: 700,
    letterSpacing: "-0.028em",
    background: "linear-gradient(160deg, #0f172a 0%, #2f3f63 55%, #4e6f9d 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    lineHeight: 1.03,
    marginBottom: "16px",
  },
  subtitle: {
    fontSize: "clamp(16px, 2vw, 21px)",
    color: "#3a465f",
    maxWidth: "760px",
    margin: "0 auto 30px",
    lineHeight: 1.6,
  },
  kpis: {
    marginTop: "16px",
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  kpiPill: {
    fontSize: "12px",
    color: "#1d2a44",
    padding: "8px 12px",
    borderRadius: "999px",
    border: "1px solid rgba(24, 39, 68, 0.18)",
    background: "rgba(255,255,255,0.82)",
    backdropFilter: "blur(6px)",
  },
  ctas: {
    display: "flex",
    gap: "14px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  ctaBtn: {
    padding: "13px 24px",
    background: "linear-gradient(140deg, #111827 0%, #1f2937 100%)",
    color: "#ffffff",
    textDecoration: "none",
    borderRadius: "999px",
    fontWeight: 600,
    fontSize: "14px",
    letterSpacing: "0.01em",
    border: "1px solid rgba(255,255,255,0.25)",
    boxShadow: "0 14px 28px rgba(17, 24, 39, 0.22)",
  },
  ctaBtnSecondary: {
    padding: "13px 24px",
    background: "rgba(255,255,255,0.85)",
    color: "#1f2a44",
    textDecoration: "none",
    borderRadius: "999px",
    fontWeight: 600,
    fontSize: "14px",
    border: "1px solid rgba(17, 24, 39, 0.14)",
  },
  featureRail: {
    position: "relative",
    zIndex: 2,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
  },
  featureCard: {
    background: "linear-gradient(160deg, rgba(255,255,255,0.95) 0%, rgba(244,248,255,0.92) 100%)",
    border: "1px solid rgba(15, 23, 42, 0.09)",
    borderRadius: "18px",
    padding: "20px",
    textAlign: "left",
    boxShadow: "0 14px 26px rgba(31, 41, 55, 0.12)",
  },
  featureTitle: {
    fontSize: "16px",
    marginBottom: "8px",
    color: "#121827",
    letterSpacing: "-0.01em",
  },
  featureText: {
    fontSize: "14px",
    color: "#445069",
    lineHeight: 1.55,
  },
};

export default Home;