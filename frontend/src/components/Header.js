import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import api from '../components/services/api';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data);
      const unread = response.data.filter(n => !n.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="app-header">
      <div className="header-container">
        <Link to="/" className="logo">Smart Campus Hub</Link>

        <div className="desktop-nav">
          <Link to="/" className="nav-link">Home</Link>
          {/* Browse Resources is visible ONLY after login */}
          {user && (
            <>
              <Link to="/resources" className="nav-link">Browse Resources</Link>
              {/* New Ticket link removed */}
            </>
          )}
          <Link to="/about" className="nav-link">About Us</Link>
          <Link to="/privacy" className="nav-link">Privacy Policy</Link>
        </div>

        <div className="user-actions">
          {user ? (
            <>
              <div className="notification-wrapper" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="notification-bell"
                >
                  <svg className="bell-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                  )}
                </button>

                {showNotifications && (
                  <div className="dropdown notification-dropdown">
                    <div className="dropdown-header">Notifications</div>
                    <div className="dropdown-list">
                      {notifications.length === 0 ? (
                        <div className="dropdown-empty">No notifications</div>
                      ) : (
                        notifications.map(notif => (
                          <div
                            key={notif.id}
                            className={`dropdown-item ${!notif.isRead ? 'unread' : ''}`}
                            onClick={() => markAsRead(notif.id)}
                          >
                            <p className="item-message">{notif.message}</p>
                            <span className="item-date">{new Date(notif.createdAt).toLocaleString()}</span>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="dropdown-footer">
                      <Link to="/notifications" className="view-all">View all</Link>
                    </div>
                  </div>
                )}
              </div>

              <div className="profile-wrapper" ref={dropdownRef}>
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="profile-trigger"
                >
                  {user.pictureUrl ? (
                    <img src={user.pictureUrl} alt={user.name} className="avatar" />
                  ) : (
                    <div className="avatar-placeholder">{user.name?.charAt(0).toUpperCase() || 'U'}</div>
                  )}
                  <span className="user-email">{user.email}</span>
                  <svg className="chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showProfileDropdown && (
                  <div className="dropdown profile-dropdown">
                    <Link to="/dashboard" className="dropdown-link" onClick={() => setShowProfileDropdown(false)}>Dashboard</Link>
                    <Link to="/profile" className="dropdown-link" onClick={() => setShowProfileDropdown(false)}>Profile</Link>
                    <hr className="dropdown-divider" />
                    <button onClick={() => { setShowProfileDropdown(false); handleLogout(); }} className="dropdown-logout">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline">Login</Link>
              <Link to="/signup" className="btn-primary">Signup</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;