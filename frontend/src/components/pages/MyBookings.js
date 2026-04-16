import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings');
      setBookings(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch bookings', err);
      setError('Unable to load your bookings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancelLoading(bookingId);
    try {
      await api.put(`/bookings/${bookingId}/cancel`);
      // Refresh bookings
      await fetchBookings();
    } catch (err) {
      console.error('Cancel failed', err);
      alert(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelLoading(null);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDING': return 'badge-pending';
      case 'APPROVED': return 'badge-approved';
      case 'REJECTED': return 'badge-rejected';
      case 'CANCELLED': return 'badge-cancelled';
      default: return 'badge';
    }
  };

  const formatDate = (dateTime) => {
    return new Date(dateTime).toLocaleString();
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p className="ml-2">Loading your bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Bookings</h1>
        <p className="text-gray-600">View and manage all your facility and equipment bookings</p>
      </div>

      {bookings.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-500">You have no bookings yet.</p>
            <button
              onClick={() => window.location.href = '/resources'}
              className="btn-primary mt-4"
            >
              Browse Resources
            </button>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Resource</th>
                <th>Date & Time</th>
                <th>Purpose</th>
                <th>Attendees</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="font-medium">{booking.resourceId}</td>
                  <td>
                    <div>{formatDate(booking.startTime)}</div>
                    <div className="text-xs text-gray-500">to {formatDate(booking.endTime)}</div>
                  </td>
                  <td>{booking.purpose}</td>
                  <td>{booking.expectedAttendees || '-'}</td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    {booking.status === 'APPROVED' && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        disabled={cancelLoading === booking.id}
                        className="btn-danger btn-sm"
                      >
                        {cancelLoading === booking.id ? (
                          <span className="spinner"></span>
                        ) : (
                          'Cancel'
                        )}
                      </button>
                    )}
                    {booking.status === 'PENDING' && (
                      <span className="text-yellow-600 text-sm">Awaiting approval</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyBookings;