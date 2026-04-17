import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
      setError('Unable to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await Promise.all(notifications.filter(n => !n.isRead).map(n => api.put(`/notifications/${n.id}/read`)));
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all as read', err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'BOOKING_STATUS': return '📅';
      case 'TICKET_STATUS': return '🔧';
      case 'TICKET_COMMENT': return '💬';
      default: return '🔔';
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    return d.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="notifications-loader">
        <div className="notifications-spinner"></div>
        <p>Loading notifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notifications-error">
        <span className="error-icon">⚠️</span>
        <p>{error}</p>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <div>
          <h1 className="notifications-title">Notifications</h1>
          <p className="notifications-subtitle">Stay updated on your bookings and tickets</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="btn-mark-all">
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="empty-notifications">
          <div className="empty-icon">🔔</div>
          <h3>No notifications yet</h3>
          <p>When you receive updates about your bookings or tickets, they'll appear here.</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`notification-item ${!notif.isRead ? 'unread' : ''}`}
              onClick={() => markAsRead(notif.id)}
            >
              <div className="notification-icon">{getNotificationIcon(notif.type)}</div>
              <div className="notification-content">
                <p className="notification-message">{notif.message}</p>
                <div className="notification-footer">
                  <span className="notification-time">{formatDate(notif.createdAt)}</span>
                  {!notif.isRead && <span className="unread-badge">New</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;