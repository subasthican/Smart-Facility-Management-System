import React, { useState, useEffect, useCallback } from 'react';
import '../styles/Notifications.css';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'http://localhost:8081/api';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [loading, setLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/notifications/user/${user.email}`);
      const data = await res.json();
      setNotifications(data || []);
    } catch (err) {
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const markAsRead = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
        method: 'PUT',
      });
      if (res.ok) {
        loadNotifications();
      }
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE}/notifications/user/${user.email}/read-all`, {
        method: 'PUT',
      });
      if (res.ok) {
        loadNotifications();
      }
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/notifications/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        loadNotifications();
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const getFilteredNotifications = () => {
    if (filter === 'unread') {
      return notifications.filter(n => !n.isRead);
    } else if (filter === 'read') {
      return notifications.filter(n => n.isRead);
    }
    return notifications;
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'INFO':
        return 'ℹ️';
      case 'SUCCESS':
        return '✅';
      case 'WARNING':
        return '⚠️';
      case 'ERROR':
        return '❌';
      default:
        return '📬';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'INFO':
        return '#0066cc';
      case 'SUCCESS':
        return '#28a745';
      case 'WARNING':
        return '#ff9800';
      case 'ERROR':
        return '#dc3545';
      default:
        return '#666';
    }
  };

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h1>🔔 Notifications</h1>
        <div className="notifications-stats">
          <span className="unread-badge">{unreadCount} New</span>
          {unreadCount > 0 && (
            <button className="mark-all-btn" onClick={markAllAsRead}>
              Mark All as Read
            </button>
          )}
        </div>
      </div>

      <div className="notifications-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({notifications.length})
        </button>
        <button
          className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Unread ({unreadCount})
        </button>
        <button
          className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
          onClick={() => setFilter('read')}
        >
          Read ({notifications.length - unreadCount})
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading notifications...</div>
      ) : filteredNotifications.length === 0 ? (
        <div className="empty-state">
          <p>📭 No {filter !== 'all' ? filter : ''} notifications</p>
          <span>You're all caught up!</span>
        </div>
      ) : (
        <div className="notifications-list">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
              style={{ borderLeftColor: getTypeColor(notification.type) }}
            >
              <div className="notification-icon">
                {getTypeIcon(notification.type)}
              </div>

              <div className="notification-content">
                <div className="notification-header">
                  <h3>{notification.title}</h3>
                  <span className="notification-type">{notification.type}</span>
                </div>
                <p className="notification-message">{notification.message}</p>
                <div className="notification-meta">
                  {notification.relatedEntity && (
                    <span className="related-entity">
                      📎 {notification.relatedEntity}
                    </span>
                  )}
                  <span className="notification-time">
                    🕐 {new Date(notification.createdAt).toLocaleDateString()}{' '}
                    {new Date(notification.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              <div className="notification-actions">
                {!notification.isRead && (
                  <button
                    className="action-btn read-btn"
                    onClick={() => markAsRead(notification.id)}
                    title="Mark as read"
                  >
                    ✓
                  </button>
                )}
                <button
                  className="action-btn delete-btn"
                  onClick={() => deleteNotification(notification.id)}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
