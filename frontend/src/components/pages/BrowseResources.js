import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const BrowseResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    minCapacity: '',
  });

  useEffect(() => {
    fetchResources();
  }, [filters]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.location) params.append('location', filters.location);
      if (filters.minCapacity) params.append('minCapacity', filters.minCapacity);
      const response = await api.get(`/resources?${params.toString()}`);
      setResources(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch resources', err);
      setError('Unable to load resources. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ type: '', location: '', minCapacity: '' });
  };

  const resourceTypes = [
    'LECTURE_HALL', 'LAB', 'MEETING_ROOM', 'EQUIPMENT'
  ];

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p className="ml-2">Loading resources...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Browse Resources</h1>
          <p className="text-gray-600">Find and book available facilities and equipment</p>
        </div>
        <Link to="/bookings/new" className="btn-primary">New Booking</Link>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="form-label">Resource Type</label>
              <select name="type" value={filters.type} onChange={handleFilterChange} className="form-select">
                <option value="">All</option>
                {resourceTypes.map(type => (
                  <option key={type} value={type}>{type.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Location</label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="e.g., Building A"
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Min Capacity</label>
              <input
                type="number"
                name="minCapacity"
                value={filters.minCapacity}
                onChange={handleFilterChange}
                placeholder="e.g., 30"
                className="form-input"
              />
            </div>
            <div className="flex items-end">
              <button onClick={clearFilters} className="btn-secondary w-full">Clear Filters</button>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {resources.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-12">
            <p className="text-gray-500">No resources match your criteria.</p>
            <button onClick={clearFilters} className="btn-primary mt-4">Clear Filters</button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <div key={resource.id} className="card hover:shadow-lg transition">
              <div className="card-body">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{resource.name}</h3>
                  <span className={`badge ${resource.status === 'ACTIVE' ? 'badge-approved' : 'badge-rejected'}`}>
                    {resource.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-2">Type: {resource.type.replace('_', ' ')}</p>
                <p className="text-sm text-gray-500 mb-2">Location: {resource.location}</p>
                <p className="text-sm text-gray-500 mb-4">Capacity: {resource.capacity}</p>
                {resource.status === 'ACTIVE' ? (
                  <Link to={`/bookings/new?resourceId=${resource.id}`} className="btn-primary w-full text-center">
                    Book Now
                  </Link>
                ) : (
                  <button disabled className="btn-secondary w-full opacity-50 cursor-not-allowed">
                    Out of Service
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseResources;