import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AllTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedTech, setSelectedTech] = useState('');
  const [statusUpdate, setStatusUpdate] = useState({ status: '', resolution: '' });

  useEffect(() => {
    fetchTickets();
    fetchUsers();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await api.get('/tickets/all');
      setTickets(response.data);
    } catch (err) {
      setError('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to load users');
    }
  };

  const assignTechnician = async () => {
    if (!selectedTech) return;
    await api.put(`/tickets/${selectedTicket.id}/assign?technicianId=${selectedTech}`);
    fetchTickets();
    setShowAssignModal(false);
  };

  const updateTicketStatus = async (id, newStatus, resolutionNotes = '', reason = '') => {
    await api.put(`/tickets/${id}/status`, { status: newStatus, resolutionNotes, reason });
    fetchTickets();
    setStatusUpdate({ status: '', resolution: '' });
  };

  const filteredTickets = filterStatus === 'ALL' ? tickets : tickets.filter(t => t.status === filterStatus);
  const statuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'];

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Tickets</h1>
      <div className="mb-4 flex flex-wrap gap-2">
        <button className={`btn-sm ${filterStatus === 'ALL' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilterStatus('ALL')}>All</button>
        {statuses.map(s => (
          <button key={s} className={`btn-sm ${filterStatus === s ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilterStatus(s)}>{s}</button>
        ))}
      </div>

      {error && <div className="alert alert-error mb-4">{error}</div>}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Category</th>
              <th>Location</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map(t => (
              <tr key={t.id}>
                <td>{t.id.slice(-6)}</td>
                <td>{t.category}</td>
                <td>{t.location}</td>
                <td><span className={`badge ${t.priority === 'HIGH' ? 'badge-danger' : t.priority === 'MEDIUM' ? 'badge-warning' : 'badge-info'}`}>{t.priority}</span></td>
                <td><span className={`badge badge-${t.status.toLowerCase()}`}>{t.status}</span></td>
                <td>{t.assignedTo ? users.find(u => u.id === t.assignedTo)?.name || t.assignedTo : 'Unassigned'}</td>
                <td>
                  <button onClick={() => { setSelectedTicket(t); setShowAssignModal(true); }} className="btn-secondary btn-sm mr-2">Assign</button>
                  <select className="form-select text-sm w-32" onChange={e => updateTicketStatus(t.id, e.target.value)} value={t.status}>
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">Assign Technician</div>
            <div className="modal-body">
              <select className="form-select" value={selectedTech} onChange={e => setSelectedTech(e.target.value)}>
                <option value="">Select technician</option>
                {users.filter(u => u.roles.includes('ROLE_TECHNICIAN')).map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
              </select>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowAssignModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={assignTechnician} className="btn-primary">Assign</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllTickets;