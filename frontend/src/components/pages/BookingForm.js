import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const BookingForm = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    resourceId: '',
    startTime: '',
    endTime: '',
    purpose: '',
    expectedAttendees: '',
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const response = await api.get('/resources');
      setResources(response.data);
    } catch (err) {
      console.error('Failed to fetch resources', err);
      setError('Could not load resources. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.resourceId) { setError('Please select a resource'); return false; }
    if (!formData.startTime) { setError('Please select start date & time'); return false; }
    if (!formData.endTime) { setError('Please select end date & time'); return false; }
    const start = new Date(formData.startTime);
    const end = new Date(formData.endTime);
    if (end <= start) { setError('End time must be after start time'); return false; }
    if (!formData.purpose.trim()) { setError('Please enter a purpose'); return false; }
    if (formData.expectedAttendees && formData.expectedAttendees < 1) {
      setError('Expected attendees must be at least 1'); return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      await api.post('/bookings', {
        resourceId: formData.resourceId,
        startTime: formData.startTime,
        endTime: formData.endTime,
        purpose: formData.purpose,
        expectedAttendees: formData.expectedAttendees ? parseInt(formData.expectedAttendees) : null,
      });
      navigate('/bookings');
    } catch (err) {
      console.error('Booking failed', err);
      const message = err.response?.data?.message || 'Failed to create booking. Please try again.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="booking-page">

      {/* ── Hero Banner ── */}
      <div className="booking-hero">
        <span className="booking-hero-icon">🏛️</span>
        <h1>Request a Booking</h1>
        <p>Reserve a campus resource — rooms, labs, equipment, and more.</p>
      </div>

      {/* ── Form Card ── */}
      <div className="booking-card">

        {/* Card Header */}
        <div className="booking-card-header">
          <div className="booking-card-header-icon">📋</div>
          <div className="booking-card-header-text">
            <h2>Booking Details</h2>
            <p>Fill in the details below to submit your request</p>
          </div>
        </div>

        <div className="booking-card-body">

          {/* Error Alert */}
          {error && (
            <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
              ⚠️ {error}
            </div>
          )}

          {loading ? (
            <div className="booking-loading">
              <div className="spinner"></div>
              <p>Loading available resources…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="booking-form">

              {/* Resource */}
              <span className="booking-section-label">📦 Resource</span>
              <div className="form-group">
                <label className="form-label">
                  Select Resource
                  <span className="label-required">*</span>
                </label>
                <select
                  name="resourceId"
                  value={formData.resourceId}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">— Choose a resource —</option>
                  {resources.map(res => (
                    <option key={res.id} value={res.id}>
                      {res.name} ({res.type}) · Capacity: {res.capacity}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time */}
              <span className="booking-section-label">🕐 Schedule</span>
              <div className="booking-date-grid">
                <div className="form-group">
                  <label className="form-label">
                    Start Date & Time
                    <span className="label-required">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    End Date & Time
                    <span className="label-required">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              {/* Purpose */}
              <span className="booking-section-label">📝 Details</span>
              <div className="form-group">
                <label className="form-label">
                  Purpose
                  <span className="label-required">*</span>
                </label>
                <textarea
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  rows="3"
                  className="form-textarea"
                  placeholder="e.g., Lecture, Team meeting, Project work, Workshop…"
                  required
                />
              </div>

              {/* Expected Attendees */}
              <div className="form-group">
                <label className="form-label">
                  Expected Attendees
                  <span className="label-optional">(optional)</span>
                </label>
                <input
                  type="number"
                  name="expectedAttendees"
                  value={formData.expectedAttendees}
                  onChange={handleChange}
                  min="1"
                  className="form-input"
                  placeholder="e.g., 20"
                />
                <p className="booking-hint">ℹ️ Leave blank if not applicable</p>
              </div>

              {/* Actions */}
              <div className="booking-form-actions">
                <button
                  type="button"
                  onClick={() => navigate('/resources')}
                  className="booking-btn-cancel"
                >
                  ← Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="booking-btn-submit"
                >
                  {submitting ? (
                    <>
                      <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></span>
                      Submitting…
                    </>
                  ) : (
                    '✓ Submit Request'
                  )}
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingForm;