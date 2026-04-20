import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/context/AuthContext';
import api from '../components/services/api';

const UserProfile = () => {
  const { user: authUser, login } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ bookings: 0, activeTickets: 0 });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [profileRes, bookingsRes, ticketsRes] = await Promise.all([
        api.get('/auth/me'),
        api.get('/bookings'),
        api.get('/tickets'),
      ]);
      setUser(profileRes.data);
      const activeTickets = ticketsRes.data.filter(
        ticket => ticket.status === 'OPEN' || ticket.status === 'IN_PROGRESS'
      ).length;
      setStats({
        bookings: bookingsRes.data.length,
        activeTickets: activeTickets,
      });
    } catch (error) {
      console.error('Failed to fetch user profile data', error);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = () => {
    setEditForm({ name: user.name, email: user.email });
    setEditError('');
    setShowEditModal(true);
  };

  const closeModal = () => {
    setShowEditModal(false);
    setEditForm({ name: '', email: '' });
    setEditLoading(false);
    setEditError('');
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim() || !editForm.email.trim()) {
      setEditError('Name and email are required');
      return;
    }
    setEditLoading(true);
    setEditError('');
    try {
      const response = await api.put('/auth/update', editForm);
      setUser(response.data);
      closeModal();
      alert('Profile updated successfully');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile';
      setEditError(msg);
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) return <div className="loading-screen">Loading profile...</div>;

  return (
    <div className="profile-container">
      {/* Profile header */}
      <div className="profile-header">
        <img
          src={user?.pictureUrl || 'https://randomuser.me/api/portraits/lego/1.jpg'}
          alt={user?.name}
          className="profile-avatar"
        />
        <div className="profile-info">
          <h1>{user?.name}</h1>
          <p>{user?.email}</p>
        </div>
        <div className="profile-badge">Active Member</div>
      </div>

      <div className="profile-grid">
        {/* Personal Information */}
        <div className="profile-card">
          <h3>Personal Information</h3>
          <div className="info-row">
            <span className="info-label">Full name:</span>
            <span className="info-value">{user?.name}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Email:</span>
            <span className="info-value">{user?.email}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Member since:</span>
            <span className="info-value">{new Date(user?.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Account Statistics */}
        <div className="profile-card">
          <h3>Account Statistics</h3>
          <div className="stat-row">
            <span className="stat-label">Total Bookings</span>
            <span className="stat-number">{stats.bookings}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Active Tickets</span>
            <span className="stat-number">{stats.activeTickets}</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="profile-card">
          <h3>Recent Activity</h3>
          <div className="info-row">
            <span className="info-label">No recent activity to display.</span>
          </div>
        </div>
      </div>

      <div className="profile-actions">
        <button onClick={openEditModal} className="btn-edit">EDIT</button>
      </div>

      {/* Edit Profile Modal (same as before) */}
      {showEditModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">Edit Profile</div>
            <form onSubmit={handleUpdateProfile}>
              <div className="modal-body">
                {editError && <div className="alert error mb-3">{editError}</div>}
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" name="name" value={editForm.name} onChange={handleEditChange} className="form-input" required />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" name="email" value={editForm.email} onChange={handleEditChange} className="form-input" required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={closeModal} className="btn cancel">Cancel</button>
                <button type="submit" disabled={editLoading} className="btn save">{editLoading ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;