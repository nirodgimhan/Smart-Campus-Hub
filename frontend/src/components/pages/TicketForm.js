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
    if (!formData.location.trim()) {
      setError('Please provide a location (building/room)');
      return false;
    }
    if (!formData.category) {
      setError('Please select a category');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Please describe the issue');
      return false;
    }
    if (!formData.preferredContact.trim()) {
      setError('Please provide a preferred contact (email or phone)');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      // Create a JSON object for the ticket
      const ticketData = {
        resourceId: formData.resourceId || null,
        location: formData.location,
        category: formData.category,
        description: formData.description,
        priority: formData.priority,
        preferredContact: formData.preferredContact,
      };
      formDataToSend.append('ticket', new Blob([JSON.stringify(ticketData)], { type: 'application/json' }));
      // Append images
      imageFiles.forEach(file => {
        formDataToSend.append('images', file);
      });

      await api.post('/tickets', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/tickets'); // Redirect to My Tickets page
    } catch (err) {
      console.error('Ticket creation failed', err);
      const message = err.response?.data?.message || 'Failed to submit ticket. Please try again.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-bold">Report an Incident</h2>
          <p className="text-sm text-gray-500">Submit a maintenance or IT issue ticket</p>
        </div>
        <div className="card-body">
          {error && (
            <div className="alert alert-error mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group">
              <label className="form-label">Affected Resource (optional)</label>
              <select
                name="resourceId"
                value={formData.resourceId}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">-- Not specific (general issue) --</option>
                {resources.map(res => (
                  <option key={res.id} value={res.id}>
                    {res.name} - {res.location}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="form-input"
                placeholder="Building name, room number"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">-- Select category --</option>
                <option value="ELECTRICAL">Electrical</option>
                <option value="PLUMBING">Plumbing</option>
                <option value="IT">IT / Network</option>
                <option value="FURNITURE">Furniture</option>
                <option value="CLEANING">Cleaning</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority *</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="form-select"
              >
                <option value="HIGH">High (Urgent / Safety hazard)</option>
                <option value="MEDIUM">Medium (Affects operations)</option>
                <option value="LOW">Low (Cosmetic / Minor issue)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="form-textarea"
                placeholder="Please describe the issue in detail..."
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Contact (email or phone) *</label>
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

            <div className="form-group">
              <label className="form-label">Attach Images (up to 3, evidence)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="form-input"
              />
              <p className="text-xs text-gray-500 mt-1">Max 5MB per image</p>
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {imagePreviews.map((preview, idx) => (
                    <div key={idx} className="relative">
                      <img src={preview} alt={`preview ${idx}`} className="ticket-image" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/tickets')}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary"
              >
                {submitting ? (
                  <>
                    <span className="spinner mr-2"></span>
                    Submitting...
                  </>
                ) : (
                  'Submit Ticket'
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