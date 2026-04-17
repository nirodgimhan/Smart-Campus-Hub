import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const BrowseResources = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    location: '',
    minCapacity: '',
  });

  useEffect(() => {
    fetchResources();
  }, [filters.type, filters.location, filters.minCapacity]);

  useEffect(() => {
    // Apply client-side search filter on resource name
    if (!filters.search.trim()) {
      setFilteredResources(resources);
    } else {
      const searchLower = filters.search.toLowerCase();
      const filtered = resources.filter(r =>
        r.name?.toLowerCase().includes(searchLower)
      );
      setFilteredResources(filtered);
    }
  }, [filters.search, resources]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.location) params.append('location', filters.location);
      if (filters.minCapacity) params.append('minCapacity', filters.minCapacity);
      const response = await api.get(`/resources?${params.toString()}`);
      setResources(response.data);
      setFilteredResources(response.data);
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
    setFilters({
      search: '',
      type: '',
      location: '',
      minCapacity: '',
    });
  };

  const resourceTypes = [
    'LECTURE_HALL', 'LAB', 'MEETING_ROOM', 'EQUIPMENT'
  ];

  if (loading) {
    return (
      <div className="resources-loader">
        <div className="resources-spinner"></div>
        <p>Loading resources...</p>
      </div>
    );
  }

  return (
    <div className="browse-resources-page">
      <div className="resources-header">
        <div>
          <h1 className="resources-title">Browse Resources</h1>
          <p className="resources-subtitle">Find and book available facilities and equipment</p>
        </div>
        <Link to="/bookings/new" className="btn-new-booking">+ New Booking</Link>
      </div>

      {/* Filters Section */}
      <div className="filters-card">
        <div className="filters-grid">
          <div className="filter-group">
            <label>Search by name</label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="e.g., Auditorium, Lab 101"
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <label>Resource Type</label>
            <select name="type" value={filters.type} onChange={handleFilterChange} className="filter-select">
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
        </div>
      </div>

      {error && <div className="resources-error">{error}</div>}

      {/* Results */}
      {filteredResources.length === 0 ? (
        <div className="empty-resources">
          <div className="empty-icon">🔍</div>
          <h3>No resources found</h3>
          <p>Try adjusting your filters or clear them to see all available resources.</p>
          <button onClick={clearFilters} className="btn-clear">Clear Filters</button>
        </div>
      ) : (
        <>
          <div className="results-stats">
            Found {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''}
          </div>
          <div className="resources-grid">
            {filteredResources.map((resource) => (
              <div key={resource.id} className="resource-card">
                <div className="card-header">
                  <h3 className="resource-name">{resource.name}</h3>
                  <span className={`status-badge ${resource.status === 'ACTIVE' ? 'status-active' : 'status-inactive'}`}>
                    {resource.status === 'ACTIVE' ? 'Available' : 'Out of Service'}
                  </span>
                </div>
                <div className="card-details">
                  <div className="detail-item">
                    <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <div>
                      <span className="detail-label">Type</span>
                      <span className="detail-value">{resource.type.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <span className="detail-label">Location</span>
                      <span className="detail-value">{resource.location}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <div>
                      <span className="detail-label">Capacity</span>
                      <span className="detail-value">{resource.capacity} people</span>
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  {resource.status === 'ACTIVE' ? (
                    <Link to={`/bookings/new?resourceId=${resource.id}`} className="btn-book">
                      Book Now →
                    </Link>
                  ) : (
                    <button disabled className="btn-disabled">Unavailable</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BrowseResources;