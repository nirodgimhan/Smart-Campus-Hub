import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/context/AuthContext';
import api from '../components/services/api';

const UserProfile = () => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get('/auth/me');
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch profile', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  if (loading) return <div className="loading-screen">Loading profile...</div>;

  return (
    <main className="flex-1 p-8 overflow-auto">
      {/* Profile header */}
      <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-wrap items-center gap-4 mb-8">
        <img
          src={user?.pictureUrl || 'https://randomuser.me/api/portraits/lego/1.jpg'}
          alt={user?.name}
          className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{user?.name}</h1>
          <p className="text-gray-500">{user?.email}</p>
        </div>
        <div className="ml-auto bg-green-100 text-green-800 px-4 py-1.5 rounded-full text-sm font-semibold">
          Active Member
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h3 className="text-lg font-semibold border-l-4 border-blue-500 pl-3 mb-4">
            Personal Information
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex">
              <span className="w-32 text-gray-500">Full name:</span>
              <span>{user?.name}</span>
            </div>
            <div className="flex">
              <span className="w-32 text-gray-500">Email:</span>
              <span>{user?.email}</span>
            </div>
            <div className="flex">
              <span className="w-32 text-gray-500">Member since:</span>
              <span>{new Date(user?.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Account Statistics */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h3 className="text-lg font-semibold border-l-4 border-blue-500 pl-3 mb-4">
            Account Statistics
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Total Bookings</span>
              <span className="font-semibold">—</span>
            </div>
            <div className="flex justify-between">
              <span>Active Tickets</span>
              <span className="font-semibold">—</span>
            </div>
          </div>
        </div>

        {/* Optional: Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm p-5 lg:col-span-2">
          <h3 className="text-lg font-semibold border-l-4 border-blue-500 pl-3 mb-4">
            Recent Activity
          </h3>
          <div className="text-sm text-gray-500">No recent activity to display.</div>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition">
          EDIT
        </button>
      </div>
    </main>
  );
};

export default UserProfile;