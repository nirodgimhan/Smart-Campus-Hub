import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredTickets(tickets);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = tickets.filter(ticket =>
        ticket.category?.toLowerCase().includes(lowercasedSearch) ||
        ticket.location?.toLowerCase().includes(lowercasedSearch) ||
        ticket.description?.toLowerCase().includes(lowercasedSearch) ||
        ticket.status?.toLowerCase().includes(lowercasedSearch) ||
        ticket.priority?.toLowerCase().includes(lowercasedSearch)
      );
      setFilteredTickets(filtered);
    }
  }, [searchTerm, tickets]);

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

      {/* Search Bar */}
      <div className="search-section">
        <div className="search-box">
          <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by category, location, description, status, or priority..."
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
        <div className="ticket-stats">
          <span>{filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''} found</span>
        </div>
      </div>

      {/* Tickets Grid */}
      {filteredTickets.length === 0 ? (
        <div className="empty-tickets">
          <div className="empty-icon">🎫</div>
          <h3>No tickets found</h3>
          <p>
            {searchTerm
              ? `No results match "${searchTerm}". Try a different search term.`
              : "You haven't submitted any tickets yet."}
          </p>
          {!searchTerm && (
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
                        <img key={idx} src={url} alt="Evidence" className="ticket-image" />
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
  );
};

export default MyTickets;