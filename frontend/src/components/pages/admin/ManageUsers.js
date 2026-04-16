import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(null);

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

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  return (
    <div className="admin-container">
      <h1 className="admin-title">Manage Users</h1>
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
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
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
                <td>
                  <button onClick={() => deleteUser(user.id)} className="btn delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;