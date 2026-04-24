import React, { useState, useEffect } from 'react';
import { getNotifications, markNotificationRead, deleteNotification } from '../components/services/api';

const NotificationPanel = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    const res = await getNotifications();
    setNotifications(res.data);
  };

  const markRead = async (id) => {
    await markNotificationRead(id);
    loadNotifications();
  };
  const remove = async (id) => {
    await deleteNotification(id);
    loadNotifications();
  };

  return (
    <div className="notification-panel">
      <div style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
        <strong>Notifications</strong>
        <button onClick={onClose} style={{ float: 'right' }}>X</button>
      </div>
      {notifications.length === 0 && <div className="notification-item">No notifications</div>}
      {notifications.map(n => (
        <div key={n.id} className={`notification-item ${!n.read ? 'unread' : ''}`}>
          <div className="title">{n.title}</div>
          <div className="message">{n.message}</div>
          <div className="time">{new Date(n.createdAt).toLocaleString()}</div>
          {!n.read && <button onClick={() => markRead(n.id)}>Mark read</button>}
          <button onClick={() => remove(n.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default NotificationPanel;