import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/context/AuthContext';
import api from '../components/services/api';

const AdminProfile = () => {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, bookings: 0, tickets: 0 });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [profileRes, usersRes, bookingsRes, ticketsRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/admin/users'),
          api.get('/bookings/all'),
          api.get('/tickets/all'),
        ]);
        setAdmin(profileRes.data);
        setStats({
          users: usersRes.data.length,
          bookings: bookingsRes.data.length,
          tickets: ticketsRes.data.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length,
        });
      } catch (error) {
        console.error('Failed to fetch admin data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const handleQuickAction = (path) => {
    navigate(path);
  };

  const openEditModal = () => {
    setEditForm({ name: admin.name, email: admin.email });
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
      setAdmin(response.data);
      closeModal();
      alert('Profile updated successfully');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile';
      setEditError(msg);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeactivate = () => {
    if (window.confirm('Are you sure you want to deactivate your admin account? You will be logged out.')) {
      logout();
      navigate('/login');
    }
  };

  if (loading) return <div className="loading-screen">Loading admin profile...</div>;

  return (
    <div className="profile-container">
      {/* Profile header */}
      <div className="profile-header">
        <img
          src={admin?.pictureUrl || 'https://randomuser.me/api/portraits/men/32.jpg'}
          alt={admin?.name}
          className="profile-avatar"
        />
        <div className="profile-info">
          <h1>{admin?.name}</h1>
          <p>{admin?.email}</p>
        </div>
        <div className="profile-badge admin">Administrator</div>
      </div>

      <div className="profile-grid">
        {/* Admin Information */}
        <div className="profile-card">
          <h3>Admin Information</h3>
          <div className="info-row">
            <span className="info-label">Full name:</span>
            <span className="info-value">{admin?.name}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Email:</span>
            <span className="info-value">{admin?.email}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Role:</span>
            <span className="info-value">System Administrator</span>
          </div>
          <div className="info-row">
            <span className="info-label">Admin since:</span>
            <span className="info-value">{new Date(admin?.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Platform Statistics */}
        <div className="profile-card">
          <h3>Platform Statistics</h3>
          <div className="stat-row">
            <span className="stat-label">Total Users</span>
            <span className="stat-number">{stats.users}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Total Bookings</span>
            <span className="stat-number">{stats.bookings}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Open Tickets</span>
            <span className="stat-number">{stats.tickets}</span>
          </div>
        </div>

        {/* Quick Admin Actions */}
        <div className="profile-card">
          <h3>Quick Admin Actions</h3>
          <ul className="quick-actions">
            <li className="quick-action-item">
              <button onClick={() => handleQuickAction('/admin/resources')} className="quick-action-btn">➕ Create new resource</button>
            </li>
            <li className="quick-action-item">
              <button onClick={() => handleQuickAction('/admin/bookings')} className="quick-action-btn">📅 Review pending bookings</button>
            </li>
            <li className="quick-action-item">
              <button onClick={() => handleQuickAction('/admin/tickets')} className="quick-action-btn">🔧 Assign technicians</button>
            </li>
            <li className="quick-action-item">
              <button onClick={() => handleQuickAction('/admin/users')} className="quick-action-btn">👥 Invite new admin</button>
            </li>
          </ul>
        </div>
      </div>

      <div className="profile-actions">
        <button onClick={openEditModal} className="btn-edit">EDIT</button>
        <button onClick={handleDeactivate} className="btn-deactivate">DEACTIVATE</button>
      </div>

      {/* Edit Profile Modal (same as user) */}
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

export default AdminProfile;