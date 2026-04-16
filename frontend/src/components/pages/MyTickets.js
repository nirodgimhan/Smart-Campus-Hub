import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await api.get('/tickets');
      setTickets(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch tickets', err);
      setError('Unable to load your tickets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'OPEN': return 'badge-open';
      case 'IN_PROGRESS': return 'badge-in-progress';
      case 'RESOLVED': return 'badge-resolved';
      case 'CLOSED': return 'badge-closed';
      case 'REJECTED': return 'badge-rejected';
      default: return 'badge';
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p className="ml-2">Loading your tickets...</p>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Tickets</h1>
          <p className="text-gray-600">Track and manage your incident reports</p>
        </div>
        <Link to="/tickets/new" className="btn-primary">
          + New Ticket
        </Link>
      </div>

      {tickets.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500">You haven't submitted any tickets yet.</p>
            <Link to="/tickets/new" className="btn-primary mt-4 inline-block">
              Report an Issue
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="card hover:shadow-md transition">
              <div className="p-5">
                <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">#{ticket.id.slice(-6)} - {ticket.category}</h3>
                    <p className="text-sm text-gray-500">Location: {ticket.location}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`badge ${getPriorityBadgeClass(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                    <span className={`badge ${getStatusBadgeClass(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 mb-3">{ticket.description}</p>
                {ticket.imageUrls && ticket.imageUrls.length > 0 && (
                  <div className="flex gap-2 mb-3">
                    {ticket.imageUrls.slice(0, 3).map((url, idx) => (
                      <img key={idx} src={url} alt="evidence" className="w-16 h-16 object-cover rounded" />
                    ))}
                  </div>
                )}
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Created: {formatDate(ticket.createdAt)}</span>
                  {ticket.assignedTo && <span>Assigned to technician</span>}
                  {ticket.status !== 'CLOSED' && ticket.status !== 'REJECTED' && (
                    <Link to={`/tickets/${ticket.id}`} className="text-blue-600 hover:underline">View Details →</Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTickets;