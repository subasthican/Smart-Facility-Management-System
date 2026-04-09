import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import PageHeader from "../components/PageHeader.js";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8081/api";

const typeIcon = (type) => {
  if (type === "INFO") return "ℹ️";
  if (type === "SUCCESS") return "✅";
  if (type === "WARNING") return "⚠️";
  if (type === "ERROR") return "❌";
  return "📬";
};

const typeClass = (type, isDark) => {
  if (type === "INFO") return isDark ? "border-l-blue-400" : "border-l-blue-600";
  if (type === "SUCCESS") return isDark ? "border-l-emerald-400" : "border-l-emerald-600";
  if (type === "WARNING") return isDark ? "border-l-amber-400" : "border-l-amber-500";
  if (type === "ERROR") return isDark ? "border-l-rose-400" : "border-l-rose-600";
  return isDark ? "border-l-slate-400" : "border-l-slate-600";
};

const Notifications = () => {
  const { user, token } = useAuth();
  const { isDark } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNotifications(data || []);
    } catch (err) {
      console.error("Error loading notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const markAsRead = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) loadNotifications();
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE}/notifications/read-all`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) loadNotifications();
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/notifications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) loadNotifications();
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    if (filter === "read") return n.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <section className="sf-page">
      <PageHeader
        breadcrumb="Operations / Notifications"
        title="Notifications"
        subtitle="View system alerts, booking updates, and action reminders."
        actions={(
          <>
            <span className={isDark ? "rounded-full border border-rose-400/40 bg-rose-400/20 px-3 py-1 text-xs font-semibold text-rose-100" : "rounded-full bg-rose-600 px-3 py-1 text-xs font-semibold text-white"}>{unreadCount} New</span>
            {unreadCount > 0 && <button className="sf-btn-primary" onClick={markAllAsRead}>Mark All as Read</button>}
          </>
        )}
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <button className={`rounded-full border px-4 py-2 text-sm font-medium ${filter === "all" ? (isDark ? "border-white/20 bg-white/15 text-white" : "border-slate-900 bg-slate-900 text-white") : "sf-btn-secondary"}`} onClick={() => setFilter("all")}>All ({notifications.length})</button>
        <button className={`rounded-full border px-4 py-2 text-sm font-medium ${filter === "unread" ? (isDark ? "border-white/20 bg-white/15 text-white" : "border-slate-900 bg-slate-900 text-white") : "sf-btn-secondary"}`} onClick={() => setFilter("unread")}>Unread ({unreadCount})</button>
        <button className={`rounded-full border px-4 py-2 text-sm font-medium ${filter === "read" ? (isDark ? "border-white/20 bg-white/15 text-white" : "border-slate-900 bg-slate-900 text-white") : "sf-btn-secondary"}`} onClick={() => setFilter("read")}>Read ({notifications.length - unreadCount})</button>
      </div>

      {loading ? (
        <div className="sf-card py-10 text-center sf-subtitle">Loading notifications...</div>
      ) : filteredNotifications.length === 0 ? (
        <div className="sf-card border-dashed px-5 py-12 text-center sf-subtitle">
          <p className="text-lg">📭 No {filter !== "all" ? filter : ""} notifications</p>
          <span className="text-sm">You're all caught up!</span>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredNotifications.map((notification) => (
            <article
              key={notification.id}
              className={`rounded-xl border border-l-4 p-4 shadow-sm ${isDark ? "border-white/10 bg-black/35" : "border-slate-300/40 bg-white/90"} ${typeClass(notification.type, isDark)} ${notification.isRead ? "opacity-80" : ""}`}
            >
              <div className="flex gap-3">
                <div className="text-2xl">{typeIcon(notification.type)}</div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold" style={{ color: "var(--text-strong)" }}>{notification.title}</h3>
                    <span className={isDark ? "rounded border border-white/10 bg-white/10 px-2 py-0.5 text-[11px] font-bold uppercase text-slate-200" : "rounded bg-white/70 px-2 py-0.5 text-[11px] font-bold uppercase text-slate-700"}>{notification.type}</span>
                  </div>
                  <p className="mb-2 text-sm" style={{ color: "var(--text-muted)" }}>{notification.message}</p>
                  <div className="flex flex-wrap gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
                    {notification.relatedEntity && <span>📎 {notification.relatedEntity}</span>}
                    <span>🕐 {new Date(notification.createdAt).toLocaleDateString()} {new Date(notification.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {!notification.isRead && (
                    <button className={isDark ? "rounded-lg border border-emerald-400/35 bg-emerald-400/15 px-2 py-1 text-xs text-emerald-100" : "rounded-lg border border-emerald-300 bg-emerald-50 px-2 py-1 text-xs text-emerald-700"} onClick={() => markAsRead(notification.id)} title="Mark as read">✓</button>
                  )}
                  <button className={isDark ? "rounded-lg border border-rose-400/35 bg-rose-400/15 px-2 py-1 text-xs text-rose-100" : "rounded-lg border border-rose-300 bg-rose-50 px-2 py-1 text-xs text-rose-700"} onClick={() => deleteNotification(notification.id)} title="Delete">🗑️</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default Notifications;
