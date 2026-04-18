import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  // Base links for all authenticated users (including quick actions)
  const baseLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { to: '/bookings/new', label: 'New Booking', icon: '➕' },
    { to: '/tickets/new', label: 'New Ticket', icon: '🆕' },
    { to: '/bookings', label: 'My Bookings', icon: '📅' },
    { to: '/tickets', label: 'My Tickets', icon: '🎫' },
  ];

  // Admin links
  const adminLinks = [
    { to: '/admin/resources', label: 'Manage Resources', icon: '📦' },
    { to: '/admin/bookings', label: 'All Bookings', icon: '📋' },
    { to: '/admin/tickets', label: 'All Tickets', icon: '🔧' },
    { to: '/admin/users', label: 'Manage Users', icon: '👥' },
  ];

  const links = isAdmin ? [...baseLinks, ...adminLinks] : baseLinks;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNotifications = () => {
    navigate('/notifications');
  };

  const handleSettings = () => {
    navigate('/profile');
  };

  return (
    <aside className="sidebar">
      {/* Profile Section - Centered */}
      <div className="sidebar-profile">
        <img
          src={user?.pictureUrl || 'https://randomuser.me/api/portraits/lego/1.jpg'}
          alt={user?.name}
          className="sidebar-avatar"
        />
        <div className="sidebar-email">{user?.email}</div>
      </div>

      {/* Navigation Links with Icons */}
      <nav className="sidebar-nav">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="link-icon">{link.icon}</span>
            <span className="link-label">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer Icons - Always at Bottom */}
      <div className="sidebar-footer">
        <button onClick={handleNotifications} className="sidebar-footer-btn" title="Notifications">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        <button onClick={handleSettings} className="sidebar-footer-btn" title="Settings">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        <button onClick={handleLogout} className="sidebar-footer-btn" title="Logout">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;