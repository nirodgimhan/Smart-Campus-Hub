import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    // Filter bookings based on search term
    if (!searchTerm.trim()) {
      setFilteredBookings(bookings);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = bookings.filter(booking =>
        booking.resourceId?.toLowerCase().includes(lowercasedSearch) ||
        booking.purpose?.toLowerCase().includes(lowercasedSearch) ||
        booking.status?.toLowerCase().includes(lowercasedSearch)
      );
      setFilteredBookings(filtered);
    }
  }, [searchTerm, bookings]);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings');
      setBookings(response.data);
      setFilteredBookings(response.data);
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
      await fetchBookings();
    } catch (err) {
      console.error('Cancel failed', err);
      alert(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelLoading(null);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'PENDING': return { label: 'Pending', className: 'status-pending' };
      case 'APPROVED': return { label: 'Approved', className: 'status-approved' };
      case 'REJECTED': return { label: 'Rejected', className: 'status-rejected' };
      case 'CANCELLED': return { label: 'Cancelled', className: 'status-cancelled' };
      default: return { label: status, className: 'status-default' };
    }
  };

  const formatDate = (dateTime) => {
    return new Date(dateTime).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bookings-loader">
        <div className="bookings-spinner"></div>
        <p>Loading your bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bookings-error">
        <span className="error-icon">⚠️</span>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bookings-page">
      <div className="bookings-header">
        <div>
          <h1 className="bookings-title">My Bookings</h1>
          <p className="bookings-subtitle">View and manage all your facility & equipment reservations</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-wrapper">
        <div className="search-box">
          <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by resource, purpose, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button className="search-clear" onClick={() => setSearchTerm('')}>
              ✕
            </button>
          )}
        </div>
        <div className="booking-stats">
          <span>{filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''} found</span>
        </div>
      </div>

      {/* Bookings Grid */}
      {filteredBookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <h3>No bookings found</h3>
          <p>
            {searchTerm
              ? `No results match "${searchTerm}". Try a different search term.`
              : "You haven't made any bookings yet."}
          </p>
          {!searchTerm && (
            <button onClick={() => window.location.href = '/resources'} className="btn-browse">
              Browse Resources
            </button>
          )}
        </div>
      ) : (
        <div className="bookings-grid">
          {filteredBookings.map((booking) => {
            const statusConfig = getStatusConfig(booking.status);
            const isPending = booking.status === 'PENDING';
            const isApproved = booking.status === 'APPROVED';
            const canCancel = isApproved;

            return (
              <div key={booking.id} className="booking-card">
                <div className="card-header">
                  <span className={`status-badge ${statusConfig.className}`}>
                    {statusConfig.label}
                  </span>
                  <span className="booking-id">ID: {booking.id.slice(-6)}</span>
                </div>
                <div className="card-body">
                  <h3 className="resource-name">{booking.resourceId}</h3>
                  <div className="booking-detail">
                    <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <div className="detail-label">Date & Time</div>
                      <div className="detail-value">{formatDate(booking.startTime)} – {formatDate(booking.endTime)}</div>
                    </div>
                  </div>
                  <div className="booking-detail">
                    <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <div className="detail-label">Purpose</div>
                      <div className="detail-value">{booking.purpose || '—'}</div>
                    </div>
                  </div>
                  {booking.expectedAttendees && (
                    <div className="booking-detail">
                      <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <div>
                        <div className="detail-label">Expected Attendees</div>
                        <div className="detail-value">{booking.expectedAttendees}</div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="card-footer">
                  {canCancel && (
                    <button
                      onClick={() => handleCancel(booking.id)}
                      disabled={cancelLoading === booking.id}
                      className="btn-cancel"
                    >
                      {cancelLoading === booking.id ? (
                        <span className="btn-spinner"></span>
                      ) : (
                        'Cancel Booking'
                      )}
                    </button>
                  )}
                  {isPending && (
                    <div className="pending-note">
                      <span>⏳ Awaiting admin approval</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookings;