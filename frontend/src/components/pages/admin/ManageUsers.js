import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = async (userId, role, add) => {
    setUpdating(userId);
    try {
      await api.put(`/admin/users/${userId}/role?role=${role}&add=${add}`);
      fetchUsers();
    } catch (err) {
      alert('Failed to update role');
    } finally {
      setUpdating(null);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Delete this user? All associated data will be lost.')) {
      await api.delete(`/admin/users/${userId}`);
      fetchUsers();
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setEditForm({ name: user.name, email: user.email });
    setShowEditModal(true);
  };

  const closeModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
    setEditForm({ name: '', email: '' });
    setEditLoading(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim() || !editForm.email.trim()) {
      alert('Name and email are required');
      return;
    }
    setEditLoading(true);
    try {
      await api.put(`/admin/users/${editingUser.id}`, editForm);
      await fetchUsers();
      closeModal();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user');
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  return (
    <div className="admin-container">
      {/* Gradient header */}
      <div className="users-header">
        <div className="users-title-section">
          <h1 className="admin-title">Manage Users</h1>
          <p className="users-subtitle">View and manage user roles and permissions</p>
        </div>
      </div>

      {error && <div className="alert error">{error}</div>}

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Roles</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td data-label="Name">{user.name}</td>
                <td data-label="Email">{user.email}</td>
                <td data-label="Roles">
                  <div className="role-buttons">
                    {['ADMIN', 'TECHNICIAN'].map(role => {
                      const hasRole = user.roles?.includes(`ROLE_${role}`);
                      return (
                        <button
                          key={role}
                          onClick={() => toggleRole(user.id, role, !hasRole)}
                          disabled={updating === user.id}
                          className={`role-toggle ${hasRole ? 'active' : 'inactive'}`}
                        >
                          {role} {hasRole ? '✓' : '+'}
                        </button>
                      );
                    })}
                  </div>
                </td>
                <td data-label="Actions">
                  <button onClick={() => openEditModal(user)} className="btn edit">Edit</button>
                  <button onClick={() => deleteUser(user.id)} className="btn delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">Edit User</div>
            <form onSubmit={handleUpdateUser}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={closeModal} className="btn cancel">Cancel</button>
                <button type="submit" disabled={editLoading} className="btn save">
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;