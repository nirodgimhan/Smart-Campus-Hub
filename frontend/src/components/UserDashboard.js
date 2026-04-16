import { useEffect, useState } from 'react';
import api from '../components/services/api';
import { useAuth } from '../components/context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  const [userStats, setUserStats] = useState({ bookings: 0, tickets: 0, notifications: 0 });
  const [adminStats, setAdminStats] = useState({ resources: 0, pendingBookings: 0, openTickets: 0, users: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllStats = async () => {
      try {
        // Always fetch user stats
        const [bookings, tickets, notifs] = await Promise.all([
          api.get('/bookings'),
          api.get('/tickets'),
          api.get('/notifications'),
        ]);
        setUserStats({
          bookings: bookings.data.length,
          tickets: tickets.data.length,
          notifications: notifs.data.filter(n => !n.read).length,
        });

        // If admin, fetch admin stats
        if (isAdmin) {
          const [resources, allBookings, allTickets, users] = await Promise.all([
            api.get('/resources'),
            api.get('/bookings/all'),
            api.get('/tickets/all'),
            api.get('/admin/users'),
          ]);
          setAdminStats({
            resources: resources.data.length,
            pendingBookings: allBookings.data.filter(b => b.status === 'PENDING').length,
            openTickets: allTickets.data.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length,
            users: users.data.length,
          });
        }
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllStats();
  }, [isAdmin]);

  if (isLoading) {
    return (
      <div className="dashboard">
        <div className="welcome-section">
          <h1 className="welcome-title">Loading your dashboard...</h1>
        </div>
        <div className="stats-skeleton">
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
          {isAdmin && <div className="skeleton-card"></div>}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Welcome Section */}
      <div className="welcome-section">
        <h1 className="welcome-title">
          Welcome back, <span className="highlight">{user?.name?.split(' ')[0] || 'User'}</span>
        </h1>
        <p className="welcome-subtitle">
          {isAdmin
            ? 'Admin overview – manage campus resources, bookings, tickets and users.'
            : 'Here’s what’s happening with your campus hub activity today.'}
        </p>
      </div>

      {/* User Stats Section */}
      <div className="stats-section">
        <h2 className="section-title">Your Activity</h2>
        <div className="stats-grid">
          <div className="stat-card bookings-card">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <h3 className="stat-title">My Bookings</h3>
              <p className="stat-number">{userStats.bookings}</p>
              <a href="/bookings" className="stat-link">View all →</a>
            </div>
          </div>
          <div className="stat-card tickets-card">
            <div className="stat-icon">🎫</div>
            <div className="stat-content">
              <h3 className="stat-title">My Tickets</h3>
              <p className="stat-number">{userStats.tickets}</p>
              <a href="/tickets" className="stat-link">View all →</a>
            </div>
          </div>
          <div className="stat-card notifications-card">
            <div className="stat-icon">🔔</div>
            <div className="stat-content">
              <h3 className="stat-title">Unread Notifications</h3>
              <p className="stat-number">{userStats.notifications}</p>
              <a href="/notifications" className="stat-link">Check →</a>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Stats Section (only visible to admin) */}
      {isAdmin && (
        <div className="stats-section">
          <h2 className="section-title">Admin Overview</h2>
          <div className="stats-grid admin-grid">
            <div className="stat-card resources-card">
              <div className="stat-icon">📦</div>
              <div className="stat-content">
                <h3 className="stat-title">Total Resources</h3>
                <p className="stat-number">{adminStats.resources}</p>
                <a href="/admin/resources" className="stat-link">Manage →</a>
              </div>
            </div>
            <div className="stat-card pending-card">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <h3 className="stat-title">Pending Bookings</h3>
                <p className="stat-number">{adminStats.pendingBookings}</p>
                <a href="/admin/bookings" className="stat-link">Review →</a>
              </div>
            </div>
            <div className="stat-card opentickets-card">
              <div className="stat-icon">🕒</div>
              <div className="stat-content">
                <h3 className="stat-title">Open Tickets</h3>
                <p className="stat-number">{adminStats.openTickets}</p>
                <a href="/admin/tickets" className="stat-link">Manage →</a>
              </div>
            </div>
            <div className="stat-card users-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <h3 className="stat-title">Active Users</h3>
                <p className="stat-number">{adminStats.users}</p>
                <a href="/admin/users" className="stat-link">View all →</a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions & Recent Activity */}
      <div className="dashboard-grid">
        <div className="card quick-actions">
          <h2 className="card-title">Quick Actions</h2>
          <div className="action-buttons">
            <a href="/resources" className="action-btn primary">
              <span className="btn-icon">📚</span>
              Browse & Book Resources
            </a>
            <a href="/tickets/new" className="action-btn secondary">
              <span className="btn-icon">⚠️</span>
              Report an Incident
            </a>
            {isAdmin && (
              <>
                <a href="/admin/resources/new" className="action-btn tertiary">
                  <span className="btn-icon">➕</span>
                  Add New Resource
                </a>
                <a href="/admin/users" className="action-btn quaternary">
                  <span className="btn-icon">👤</span>
                  Manage Users
                </a>
              </>
            )}
          </div>
        </div>
        <div className="card recent-activity-card">
          <h2 className="card-title">Recent Activity</h2>
          <div className="activity-placeholder">
            <div className="placeholder-icon">📋</div>
            <p className="placeholder-text">No recent activity yet.</p>
            <p className="placeholder-subtext">Your bookings and tickets will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;