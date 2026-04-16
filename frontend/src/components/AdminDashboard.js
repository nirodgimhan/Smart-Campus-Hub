import { useEffect, useState } from 'react';
import api from '../components/services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ resources: 0, pendingBookings: 0, openTickets: 0, users: 0 });

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const [resources, bookings, tickets, users] = await Promise.all([
          api.get('/resources'),
          api.get('/bookings/all'),
          api.get('/tickets/all'),
          api.get('/admin/users'), // custom endpoint
        ]);
        setStats({
          resources: resources.data.length,
          pendingBookings: bookings.data.filter(b => b.status === 'PENDING').length,
          openTickets: tickets.data.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length,
          users: users.data.length,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchAdminStats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold">Resources</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.resources}</p>
          <a href="/admin/resources" className="text-blue-500 hover:underline">Manage →</a>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold">Pending Bookings</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.pendingBookings}</p>
          <a href="/admin/bookings" className="text-blue-500 hover:underline">Review →</a>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold">Open Tickets</h3>
          <p className="text-3xl font-bold text-red-600">{stats.openTickets}</p>
          <a href="/admin/tickets" className="text-blue-500 hover:underline">Manage →</a>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold">Users</h3>
          <p className="text-3xl font-bold text-green-600">{stats.users}</p>
          <a href="/admin/users" className="text-blue-500 hover:underline">Manage →</a>
        </div>
      </div>
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <p className="text-gray-500">Detailed logs and charts can be added here.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;