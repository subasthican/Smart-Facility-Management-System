import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import PageHeader from "../components/PageHeader.js";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

const typeIcon = (type) => {
  if (type === "INFO") return "ℹ️";
  if (type === "SUCCESS") return "✅";
  if (type === "WARNING") return "⚠️";
  if (type === "ERROR") return "❌";
  return "📬";
};

const typeClass = (type) => {
  if (type === "INFO") return "border-l-blue-600 bg-blue-50 text-blue-700";
  if (type === "SUCCESS") return "border-l-emerald-600 bg-emerald-50 text-emerald-700";
  if (type === "WARNING") return "border-l-amber-500 bg-amber-50 text-amber-700";
  if (type === "ERROR") return "border-l-rose-600 bg-rose-50 text-rose-700";
  return "border-l-slate-600 bg-slate-50 text-slate-700";
};

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/notifications/user/${user.email}`);
      const data = await res.json();
      setNotifications(data || []);
    } catch (err) {
      console.error("Error loading notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const markAsRead = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/notifications/${id}/read`, { method: "PUT" });
      if (res.ok) loadNotifications();
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE}/notifications/user/${user.email}/read-all`, { method: "PUT" });
      if (res.ok) loadNotifications();
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/notifications/${id}`, { method: "DELETE" });
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
            <span className="rounded-full bg-rose-600 px-3 py-1 text-xs font-semibold text-white">{unreadCount} New</span>
            {unreadCount > 0 && <button className="sf-btn-primary" onClick={markAllAsRead}>Mark All as Read</button>}
          </>
        )}
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <button className={`rounded-full border px-4 py-2 text-sm font-medium ${filter === "all" ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white text-slate-600"}`} onClick={() => setFilter("all")}>All ({notifications.length})</button>
        <button className={`rounded-full border px-4 py-2 text-sm font-medium ${filter === "unread" ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white text-slate-600"}`} onClick={() => setFilter("unread")}>Unread ({unreadCount})</button>
        <button className={`rounded-full border px-4 py-2 text-sm font-medium ${filter === "read" ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white text-slate-600"}`} onClick={() => setFilter("read")}>Read ({notifications.length - unreadCount})</button>
      </div>

      {loading ? (
        <div className="sf-card py-10 text-center text-slate-500">Loading notifications...</div>
      ) : filteredNotifications.length === 0 ? (
        <div className="sf-card border-dashed border-slate-300 bg-white/70 px-5 py-12 text-center text-slate-500">
          <p className="text-lg">📭 No {filter !== "all" ? filter : ""} notifications</p>
          <span className="text-sm">You're all caught up!</span>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredNotifications.map((notification) => (
            <article
              key={notification.id}
              className={`rounded-xl border border-slate-300/40 border-l-4 bg-white/90 p-4 shadow-sm ${typeClass(notification.type)} ${notification.isRead ? "opacity-80" : ""}`}
            >
              <div className="flex gap-3">
                <div className="text-2xl">{typeIcon(notification.type)}</div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-900">{notification.title}</h3>
                    <span className="rounded bg-white/70 px-2 py-0.5 text-[11px] font-bold uppercase">{notification.type}</span>
                  </div>
                  <p className="mb-2 text-sm text-slate-600">{notification.message}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                    {notification.relatedEntity && <span>📎 {notification.relatedEntity}</span>}
                    <span>🕐 {new Date(notification.createdAt).toLocaleDateString()} {new Date(notification.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {!notification.isRead && (
                    <button className="rounded-lg border border-emerald-300 bg-emerald-50 px-2 py-1 text-xs" onClick={() => markAsRead(notification.id)} title="Mark as read">✓</button>
                  )}
                  <button className="rounded-lg border border-rose-300 bg-rose-50 px-2 py-1 text-xs" onClick={() => deleteNotification(notification.id)} title="Delete">🗑️</button>
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
