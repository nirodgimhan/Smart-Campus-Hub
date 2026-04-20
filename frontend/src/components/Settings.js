import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/context/AuthContext';
import { useTheme } from '../components/context/ThemeContext';
import api from '../components/services/api';

const Settings = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
  });
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Change password modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const res = await api.get('/auth/preferences');
        if (res.data) {
          setNotifications(res.data.notifications || { email: true, push: true });
          setProfileVisibility(res.data.profileVisibility || 'public');
          setLanguage(res.data.language || 'en');
        }
      } catch (err) {
        console.error('Failed to load preferences', err);
      }
    };
    if (user) fetchPreferences();
  }, [user]);

  const savePreferences = async () => {
    setLoading(true);
    try {
      await api.put('/auth/preferences', {
        notifications,
        profileVisibility,
        language,
      });
      setMessage({ text: 'Preferences saved successfully!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (err) {
      setMessage({ text: 'Failed to save preferences', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const openPasswordModal = () => {
    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordError('');
    setShowPasswordModal(true);
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordError('');
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    setPasswordError('');
  };

  const submitPasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    setPasswordLoading(true);
    try {
      await api.post('/auth/change-password', {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });
      alert('Password changed successfully');
      closePasswordModal();
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure? This action is permanent and cannot be undone.')) {
      try {
        await api.delete('/auth/account');
        logout(); // clear local state and token
        window.location.href = '/login';
      } catch (err) {
        alert('Failed to delete account');
      }
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div className="settings-header-content">
          <h1 className="settings-title">Settings</h1>
          <p className="settings-subtitle">Manage your account preferences and privacy</p>
        </div>
      </div>

      <div className="settings-container">
        {message.text && (
          <div className={`settings-message ${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Appearance */}
        <div className="settings-card">
          <h2>Appearance</h2>
          <div className="toggle-row">
            <span className="toggle-label">Dark Mode</span>
            <label className="toggle-switch">
              <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        {/* Notifications */}
        <div className="settings-card">
          <h2>Notifications</h2>
          <div className="checkbox-row">
            <span className="checkbox-label">Email Notifications</span>
            <input
              type="checkbox"
              checked={notifications.email}
              onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
              className="checkbox-input"
            />
          </div>
          <div className="checkbox-row">
            <span className="checkbox-label">Push Notifications</span>
            <input
              type="checkbox"
              checked={notifications.push}
              onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
              className="checkbox-input"
            />
          </div>
        </div>

        {/* Profile Visibility */}
        <div className="settings-card">
          <h2>Profile Visibility</h2>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                value="public"
                checked={profileVisibility === 'public'}
                onChange={() => setProfileVisibility('public')}
              />
              <span>Public</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                value="private"
                checked={profileVisibility === 'private'}
                onChange={() => setProfileVisibility('private')}
              />
              <span>Private</span>
            </label>
          </div>
        </div>

        {/* Language */}
        <div className="settings-card">
          <h2>Language</h2>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="settings-select"
          >
            <option value="en">English</option>
            <option value="si">Sinhala</option>
            <option value="ta">Tamil</option>
          </select>
        </div>

        {/* Account Actions */}
        <div className="settings-card">
          <h2>Account</h2>
          <div className="account-actions">
            <button onClick={openPasswordModal} className="account-link">
              Change Password
            </button>
            <button onClick={handleDeleteAccount} className="account-link danger">
              Delete Account
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={savePreferences}
            disabled={loading}
            className="settings-save-btn"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={closePasswordModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">Change Password</div>
            <form onSubmit={submitPasswordChange}>
              <div className="modal-body">
                {passwordError && (
                  <div className="alert error" style={{ marginBottom: '1rem' }}>
                    {passwordError}
                  </div>
                )}
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    name="oldPassword"
                    value={passwordForm.oldPassword}
                    onChange={handlePasswordChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={closePasswordModal} className="btn cancel">Cancel</button>
                <button type="submit" disabled={passwordLoading} className="btn save">
                  {passwordLoading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;