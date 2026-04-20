import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const TicketForm = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [formData, setFormData] = useState({
    resourceId: '',
    location: '',
    category: '',
    description: '',
    priority: 'MEDIUM',
    preferredContact: '',
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
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      setError('You can upload a maximum of 3 images');
      return;
    }
    setImageFiles(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index) => {
    const newFiles = [...imageFiles];
    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const validateForm = () => {
    if (!formData.location.trim()) { setError('Please provide a location (building/room)'); return false; }
    if (!formData.category) { setError('Please select a category'); return false; }
    if (!formData.description.trim()) { setError('Please describe the issue'); return false; }
    if (!formData.preferredContact.trim()) { setError('Please provide a preferred contact (email or phone)'); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      const ticketData = {
        resourceId: formData.resourceId || null,
        location: formData.location,
        category: formData.category,
        description: formData.description,
        priority: formData.priority,
        preferredContact: formData.preferredContact,
      };
      formDataToSend.append('ticket', new Blob([JSON.stringify(ticketData)], { type: 'application/json' }));
      imageFiles.forEach(file => { formDataToSend.append('images', file); });
      await api.post('/tickets', formDataToSend, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/tickets');
    } catch (err) {
      console.error('Ticket creation failed', err);
      const message = err.response?.data?.message || 'Failed to submit ticket. Please try again.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const priorityOptions = [
    {
      value: 'HIGH',
      icon: '🔴',
      label: 'High',
      sub: 'Urgent / Safety hazard',
      badgeClass: 'priority-badge-high',
    },
    {
      value: 'MEDIUM',
      icon: '🟡',
      label: 'Medium',
      sub: 'Affects operations',
      badgeClass: 'priority-badge-medium',
    },
    {
      value: 'LOW',
      icon: '🟢',
      label: 'Low',
      sub: 'Cosmetic / Minor issue',
      badgeClass: 'priority-badge-low',
    },
  ];

  return (
    <div className="ticket-page">

      {/* ── Hero Banner ── */}
      <div className="ticket-hero">
        <span className="ticket-hero-icon">🛠️</span>
        <h1>Report an Incident</h1>
        <p>Submit a maintenance or IT issue ticket — we'll get it resolved fast.</p>
      </div>

      {/* ── Form Card ── */}
      <div className="ticket-card">

        {/* Card Header */}
        <div className="ticket-card-header">
          <div className="ticket-card-header-icon">🎫</div>
          <div className="ticket-card-header-text">
            <h2>Incident Details</h2>
            <p>Please fill in all required fields to help us prioritise your ticket</p>
          </div>
        </div>

        <div className="ticket-card-body">

          {/* Error Alert */}
          {error && (
            <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="ticket-form">

            {/* Affected Resource */}
            <span className="ticket-section-label">📦 Resource</span>
            <div className="form-group">
              <label className="form-label">Affected Resource <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.72rem' }}>(optional)</span></label>
              <select
                name="resourceId"
                value={formData.resourceId}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">— Not specific (general issue) —</option>
                {resources.map(res => (
                  <option key={res.id} value={res.id}>{res.name} — {res.location}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <span className="ticket-section-label">📍 Location</span>
            <div className="form-group">
              <label className="form-label">Location <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>*</span></label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., Block A — Room 201, Library 3rd Floor"
                required
              />
            </div>

            {/* Category */}
            <span className="ticket-section-label">🗂️ Category & Priority</span>
            <div className="form-group">
              <label className="form-label">Category <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>*</span></label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">— Select a category —</option>
                <option value="ELECTRICAL">⚡ Electrical</option>
                <option value="PLUMBING">🔧 Plumbing</option>
                <option value="IT">💻 IT / Network</option>
                <option value="FURNITURE">🪑 Furniture</option>
                <option value="CLEANING">🧹 Cleaning</option>
                <option value="OTHER">📌 Other</option>
              </select>
            </div>

            {/* Priority Selector */}
            <div className="form-group">
              <label className="form-label" style={{ marginBottom: '0.6rem' }}>Priority Level <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>*</span></label>
              <div className="ticket-priority-grid">
                {priorityOptions.map(opt => (
                  <label key={opt.value} className="ticket-priority-option">
                    <input
                      type="radio"
                      name="priority"
                      value={opt.value}
                      checked={formData.priority === opt.value}
                      onChange={handleChange}
                    />
                    <div className={`ticket-priority-badge ${opt.badgeClass}`}>
                      <span className="ticket-priority-icon">{opt.icon}</span>
                      <span className="ticket-priority-label">{opt.label}</span>
                      <span className="ticket-priority-sub">{opt.sub}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <span className="ticket-section-label">📝 Description</span>
            <div className="form-group">
              <label className="form-label">Describe the Issue <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>*</span></label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="form-textarea"
                placeholder="Provide as much detail as possible — when it started, what you observed, any safety concerns…"
                required
              />
            </div>

            {/* Contact */}
            <div className="form-group">
              <label className="form-label">Preferred Contact <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>*</span></label>
              <input
                type="text"
                name="preferredContact"
                value={formData.preferredContact}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., john@university.edu or 0712345678"
                required
              />
            </div>

            {/* Image Upload */}
            <span className="ticket-section-label">📎 Evidence Images</span>
            <div className="form-group">
              <label className="form-label" style={{ marginBottom: '0.5rem' }}>Attach Images <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.72rem' }}>(up to 3)</span></label>
              <div className="ticket-upload-zone">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
                <span className="ticket-upload-icon">📤</span>
                <p className="ticket-upload-text">Click or drag images here</p>
                <p className="ticket-upload-hint">PNG, JPG, WEBP — max 5 MB per image</p>
              </div>

              {imagePreviews.length > 0 && (
                <div className="ticket-preview-grid">
                  {imagePreviews.map((preview, idx) => (
                    <div key={idx} className="ticket-preview-item">
                      <img src={preview} alt={`preview ${idx + 1}`} className="ticket-image" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="ticket-preview-remove"
                        title="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="ticket-form-actions">
              <button
                type="button"
                onClick={() => navigate('/tickets')}
                className="ticket-btn-cancel"
              >
                ← Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="ticket-btn-submit"
              >
                {submitting ? (
                  <>
                    <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></span>
                    Submitting…
                  </>
                ) : (
                  '🎫 Submit Ticket'
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default TicketForm;