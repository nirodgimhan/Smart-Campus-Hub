import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/context/AuthContext';
import api from '../components/services/api';

const AdminProfile = () => {
  const { user: authUser } = useAuth();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, bookings: 0, tickets: 0 });

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [profileRes, usersRes, bookingsRes, ticketsRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/admin/users'),
          api.get('/bookings/all'),
          api.get('/tickets/all'),
        ]);
        setAdmin(profileRes.data);
        setStats({
          users: usersRes.data.length,
          bookings: bookingsRes.data.length,
          tickets: ticketsRes.data.length,
        });
      } catch (error) {
        console.error('Failed to fetch admin data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) return <div className="loading-screen">Loading admin profile...</div>;

  return (
    <main className="flex-1 p-8 overflow-auto">
      {/* Profile header */}
      <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-wrap items-center gap-4 mb-8">
        <img
          src={admin?.pictureUrl || 'https://randomuser.me/api/portraits/men/32.jpg'}
          alt={admin?.name}
          className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{admin?.name}</h1>
          <p className="text-gray-500">{admin?.email}</p>
        </div>
        <div className="ml-auto bg-purple-100 text-purple-800 px-4 py-1.5 rounded-full text-sm font-semibold">
          Administrator
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h3 className="text-lg font-semibold border-l-4 border-blue-500 pl-3 mb-4">
              Admin Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex">
                <span className="w-32 text-gray-500">Full name:</span>
                <span>{admin?.name}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-gray-500">Email:</span>
                <span>{admin?.email}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-gray-500">Role:</span>
                <span>System Administrator</span>
              </div>
              <div className="flex">
                <span className="w-32 text-gray-500">Admin since:</span>
                <span>{new Date(admin?.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h3 className="text-lg font-semibold border-l-4 border-blue-500 pl-3 mb-4">
              Platform Statistics
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Total Users</span>
                <span className="font-semibold">{stats.users}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Bookings</span>
                <span className="font-semibold">{stats.bookings}</span>
              </div>
              <div className="flex justify-between">
                <span>Open Tickets</span>
                <span className="font-semibold">{stats.tickets}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column – Admin actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h3 className="text-lg font-semibold border-l-4 border-blue-500 pl-3 mb-4">
              Quick Admin Actions
            </h3>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 transition">
                ➕ Create new resource
              </button>
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 transition">
                📅 Review pending bookings
              </button>
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 transition">
                🔧 Assign technicians
              </button>
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 transition">
                👥 Invite new admin
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition">
              EDIT
            </button>
            <button className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition">
              DEACTIVATE
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminProfile;