import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    searchTerm: '',
    category: '',
    location: '',
    priority: '',
    status: '',
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  // Apply filters whenever tickets or filter values change
  useEffect(() => {
    if (!tickets.length) {
      setFilteredTickets([]);
      return;
    }

    let filtered = [...tickets];

    // 1. Free‑text search (category, location, description)
    if (filters.searchTerm.trim()) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(ticket =>
        ticket.category?.toLowerCase().includes(term) ||
        ticket.location?.toLowerCase().includes(term) ||
        ticket.description?.toLowerCase().includes(term)
      );
    }

    // 2. Filter by category (exact match)
    if (filters.category) {
      filtered = filtered.filter(ticket => ticket.category === filters.category);
    }

    // 3. Filter by location (text search)
    if (filters.location.trim()) {
      const loc = filters.location.toLowerCase();
      filtered = filtered.filter(ticket =>
        ticket.location?.toLowerCase().includes(loc)
      );
    }

    // 4. Filter by priority
    if (filters.priority) {
      filtered = filtered.filter(ticket => ticket.priority === filters.priority);
    }

    // 5. Filter by status
    if (filters.status) {
      filtered = filtered.filter(ticket => ticket.status === filters.status);
    }

    setFilteredTickets(filtered);
  }, [filters, tickets]);

  const fetchTickets = async () => {
    try {
      const response = await api.get('/tickets');
      setTickets(response.data);
      setFilteredTickets(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch tickets', err);
      setError('Unable to load your tickets. Please try again.');
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
      searchTerm: '',
      category: '',
      location: '',
      priority: '',
      status: '',
    });
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'OPEN': return { label: 'Open', className: 'status-open' };
      case 'IN_PROGRESS': return { label: 'In Progress', className: 'status-progress' };
      case 'RESOLVED': return { label: 'Resolved', className: 'status-resolved' };
      case 'CLOSED': return { label: 'Closed', className: 'status-closed' };
      case 'REJECTED': return { label: 'Rejected', className: 'status-rejected' };
      default: return { label: status, className: 'status-default' };
    }
  };

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'HIGH': return { label: 'High', className: 'priority-high' };
      case 'MEDIUM': return { label: 'Medium', className: 'priority-medium' };
      case 'LOW': return { label: 'Low', className: 'priority-low' };
      default: return { label: priority, className: 'priority-default' };
    }
  };

  const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url}`;
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(getImageUrl(imageUrl));
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  // Extract unique values for dropdowns
  const categories = [...new Set(tickets.map(t => t.category).filter(Boolean))];
  const priorities = ['HIGH', 'MEDIUM', 'LOW'];
  const statuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'];

  if (loading) {
    return (
      <div className="tickets-loader">
        <div className="tickets-spinner"></div>
        <p>Loading your tickets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tickets-error">
        <span className="error-icon">⚠️</span>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="tickets-page">
        <div className="tickets-header">
          <div>
            <h1 className="tickets-title">My Tickets</h1>
            <p className="tickets-subtitle">Track and manage your incident reports</p>
          </div>
          <Link to="/tickets/new" className="btn-new-ticket">
            + New Ticket
          </Link>
        </div>

        {/* Advanced Filters Section */}
        <div className="filters-card">
          <div className="filters-grid">
            <div className="filter-group">
              <label>Search</label>
              <input
                type="text"
                name="searchTerm"
                value={filters.searchTerm}
                onChange={handleFilterChange}
                placeholder="Category, location or description..."
                className="filter-input"
              />
            </div>
            <div className="filter-group">
              <label>Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="">All categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
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
              <label>Priority</label>
              <select
                name="priority"
                value={filters.priority}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="">All priorities</option>
                {priorities.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="">All statuses</option>
                {statuses.map(s => (
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="filter-actions">
            <button onClick={clearFilters} className="btn-clear-filters">Clear all filters</button>
            <div className="ticket-stats">
              {filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>

        {/* Tickets Grid */}
        {filteredTickets.length === 0 ? (
          <div className="empty-tickets">
            <div className="empty-icon">🎫</div>
            <h3>No tickets found</h3>
            <p>
              {Object.values(filters).some(v => v)
                ? "No tickets match your filters. Try clearing them."
                : "You haven't submitted any tickets yet."}
            </p>
            {!Object.values(filters).some(v => v) && (
              <Link to="/tickets/new" className="btn-report">
                Report an Issue
              </Link>
            )}
          </div>
        ) : (
          <div className="tickets-grid">
            {filteredTickets.map((ticket) => {
              const statusConfig = getStatusConfig(ticket.status);
              const priorityConfig = getPriorityConfig(ticket.priority);
              const isActive = ticket.status !== 'CLOSED' && ticket.status !== 'REJECTED';

              return (
                <div key={ticket.id} className="ticket-card">
                  <div className="card-badges">
                    <span className={`priority-badge ${priorityConfig.className}`}>
                      {priorityConfig.label}
                    </span>
                    <span className={`status-badge ${statusConfig.className}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                  <div className="card-body">
                    <div className="ticket-header">
                      <h3 className="ticket-category">{ticket.category}</h3>
                      <span className="ticket-id">ID: {ticket.id.slice(-6)}</span>
                    </div>
                    <div className="ticket-location">
                      <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{ticket.location}</span>
                    </div>
                    <p className="ticket-description">{ticket.description}</p>
                    
                    {ticket.imageUrls && ticket.imageUrls.length > 0 && (
                      <div className="ticket-images">
                        {ticket.imageUrls.slice(0, 3).map((url, idx) => (
                          <img 
                            key={idx} 
                            src={getImageUrl(url)} 
                            alt="Evidence" 
                            className="ticket-image"
                            onClick={() => openImageModal(url)}
                            style={{ cursor: 'pointer' }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ))}
                        {ticket.imageUrls.length > 3 && (
                          <div className="image-more">+{ticket.imageUrls.length - 3}</div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="card-footer">
                    <div className="ticket-meta">
                      <span>Created: {formatDate(ticket.createdAt)}</span>
                      {ticket.assignedTo && <span>👤 Technician assigned</span>}
                    </div>
                    {isActive && (
                      <Link to={`/tickets/${ticket.id}`} className="view-details">
                        View Details →
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="image-modal-overlay" onClick={closeModal}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="image-modal-close" onClick={closeModal}>×</button>
            <img src={selectedImage} alt="Full size evidence" className="image-modal-img" />
          </div>
        </div>
      )}
    </>
  );
};

export default MyTickets;