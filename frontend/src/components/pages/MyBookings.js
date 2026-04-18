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
  const [resourcesMap, setResourcesMap] = useState({}); // { resourceId: { name, type, location, capacity } }

  // Filter states
  const [filters, setFilters] = useState({
    resourceName: '',
    resourceType: '',
    location: '',
    minCapacity: '',
  });

  // Fetch all resources and user bookings
  useEffect(() => {
    fetchResourcesAndBookings();
  }, []);

  const fetchResourcesAndBookings = async () => {
    try {
      setLoading(true);
      // Fetch all resources
      const resourcesRes = await api.get('/resources');
      const resources = resourcesRes.data;
      const map = {};
      resources.forEach(res => {
        map[res.id] = {
          name: res.name,
          type: res.type,
          location: res.location,
          capacity: res.capacity
        };
      });
      setResourcesMap(map);

      // Fetch user's bookings
      const bookingsRes = await api.get('/bookings');
      setBookings(bookingsRes.data);
      setFilteredBookings(bookingsRes.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch data', err);
      setError('Unable to load your bookings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Apply filters whenever filters or bookings/resources change
  useEffect(() => {
    if (!bookings.length) {
      setFilteredBookings([]);
      return;
    }

    let filtered = [...bookings];

    // Filter by resource name
    if (filters.resourceName.trim()) {
      const nameLower = filters.resourceName.toLowerCase();
      filtered = filtered.filter(booking => {
        const res = resourcesMap[booking.resourceId];
        return res?.name?.toLowerCase().includes(nameLower);
      });
    }

    // Filter by resource type
    if (filters.resourceType) {
      filtered = filtered.filter(booking => {
        const res = resourcesMap[booking.resourceId];
        return res?.type === filters.resourceType;
      });
    }

    // Filter by location
    if (filters.location.trim()) {
      const locLower = filters.location.toLowerCase();
      filtered = filtered.filter(booking => {
        const res = resourcesMap[booking.resourceId];
        return res?.location?.toLowerCase().includes(locLower);
      });
    }

    // Filter by minimum capacity
    if (filters.minCapacity) {
      const minCap = parseInt(filters.minCapacity, 10);
      if (!isNaN(minCap)) {
        filtered = filtered.filter(booking => {
          const res = resourcesMap[booking.resourceId];
          return res?.capacity >= minCap;
        });
      }
    }

    setFilteredBookings(filtered);
  }, [filters, bookings, resourcesMap]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      resourceName: '',
      resourceType: '',
      location: '',
      minCapacity: '',
    });
  };

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings');
      setBookings(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch bookings', err);
      setError('Unable to load your bookings. Please try again later.');
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

  // Get unique resource types from resourcesMap for dropdown
  const resourceTypes = [...new Set(Object.values(resourcesMap).map(r => r.type))];

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

      {/* Advanced Filters Section */}
      <div className="filters-card">
        <div className="filters-grid">
          <div className="filter-group">
            <label>Resource Name</label>
            <input
              type="text"
              name="resourceName"
              value={filters.resourceName}
              onChange={handleFilterChange}
              placeholder="e.g., Auditorium, Lab 101"
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <label>Resource Type</label>
            <select
              name="resourceType"
              value={filters.resourceType}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All types</option>
              {resourceTypes.map(type => (
                <option key={type} value={type}>{type.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="e.g., Building A, Floor 2"
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <label>Min. Capacity</label>
            <input
              type="number"
              name="minCapacity"
              value={filters.minCapacity}
              onChange={handleFilterChange}
              placeholder="e.g., 30"
              className="filter-input"
            />
          </div>
        </div>
        <div className="filter-actions">
          <button onClick={clearFilters} className="btn-clear-filters">Clear all filters</button>
          <div className="booking-stats">
            {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''} found
          </div>
        </div>
      </div>

      {/* Bookings Grid */}
      {filteredBookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <h3>No bookings found</h3>
          <p>
            {Object.values(filters).some(v => v) 
              ? "No bookings match your filters. Try clearing them."
              : "You haven't made any bookings yet."}
          </p>
          {!Object.values(filters).some(v => v) && (
            <button onClick={() => window.location.href = '/resources'} className="btn-browse">
              Browse Resources
            </button>
          )}
        </div>
      ) : (
        <div className="bookings-grid">
          {filteredBookings.map((booking) => {
            const resourceInfo = resourcesMap[booking.resourceId] || { name: 'Unknown Resource', type: 'N/A', location: 'N/A', capacity: 'N/A' };
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
                  <h3 className="resource-name">{resourceInfo.name}</h3>
                  <div className="resource-meta">
                    <span className="resource-type">{resourceInfo.type.replace('_', ' ')}</span>
                    <span className="resource-location">📍 {resourceInfo.location}</span>
                    <span className="resource-capacity">👥 Capacity: {resourceInfo.capacity}</span>
                  </div>
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