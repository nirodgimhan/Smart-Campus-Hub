import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/all');
      setBookings(response.data);
    } catch (err) {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus, reason = '') => {
    setActionLoading(id);
    try {
      if (newStatus === 'APPROVED') {
        await api.put(`/bookings/${id}/approve?reason=${encodeURIComponent(reason)}`);
      } else if (newStatus === 'REJECTED') {
        await api.put(`/bookings/${id}/reject?reason=${encodeURIComponent(reason)}`);
      }
      fetchBookings();
    } catch (err) {
      alert('Failed to update booking');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredBookings = filterStatus === 'ALL' ? bookings : bookings.filter(b => b.status === filterStatus);
  const statuses = ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'];

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Bookings</h1>
      <div className="mb-4 flex gap-2">
        <button className={`btn-sm ${filterStatus === 'ALL' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilterStatus('ALL')}>All</button>
        {statuses.map(s => (
          <button key={s} className={`btn-sm ${filterStatus === s ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilterStatus(s)}>{s}</button>
        ))}
      </div>

      {error && <div className="alert alert-error mb-4">{error}</div>}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Resource ID</th>
              <th>User ID</th>
              <th>Start</th>
              <th>End</th>
              <th>Purpose</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map(b => (
              <tr key={b.id}>
                <td>{b.resourceId}</td>
                <td>{b.userId}</td>
                <td>{new Date(b.startTime).toLocaleString()}</td>
                <td>{new Date(b.endTime).toLocaleString()}</td>
                <td>{b.purpose}</td>
                <td><span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span></td>
                <td>
                  {b.status === 'PENDING' && (
                    <>
                      <button onClick={() => {
                        const reason = prompt('Approval reason (optional)');
                        updateStatus(b.id, 'APPROVED', reason);
                      }} className="btn-primary btn-sm mr-2" disabled={actionLoading === b.id}>Approve</button>
                      <button onClick={() => {
                        const reason = prompt('Rejection reason');
                        if (reason) updateStatus(b.id, 'REJECTED', reason);
                      }} className="btn-danger btn-sm" disabled={actionLoading === b.id}>Reject</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllBookings;