import { useEffect, useState } from 'react';
import api from '../components/services/api';
import { useAuth } from '../components/context/AuthContext';

const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ bookings: 0, tickets: 0, notifications: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [bookings, tickets, notifs] = await Promise.all([
          api.get('/bookings'),
          api.get('/tickets'),
          api.get('/notifications'),
        ]);
        setStats({
          bookings: bookings.data.length,
          tickets: tickets.data.length,
          notifications: notifs.data.filter(n => !n.read).length,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Welcome, {user?.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">My Bookings</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.bookings}</p>
          <a href="/bookings" className="text-blue-500 hover:underline mt-2 inline-block">View all →</a>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">My Tickets</h3>
          <p className="text-3xl font-bold text-orange-600 mt-2">{stats.tickets}</p>
          <a href="/tickets" className="text-blue-500 hover:underline mt-2 inline-block">View all →</a>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Unread Notifications</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.notifications}</p>
          <a href="/notifications" className="text-blue-500 hover:underline mt-2 inline-block">Check →</a>
        </div>
      </div>
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a href="/resources" className="block bg-blue-100 text-blue-700 p-3 rounded hover:bg-blue-200">Browse & Book Resources</a>
            <a href="/tickets/new" className="block bg-red-100 text-red-700 p-3 rounded hover:bg-red-200">Report an Incident</a>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <p className="text-gray-500">No recent activity. Check your bookings and tickets.</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;