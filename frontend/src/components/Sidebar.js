import { NavLink } from 'react-router-dom';
import { useAuth } from '../components/context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  const userLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/bookings', label: 'My Bookings' },
    { to: '/tickets', label: 'My Tickets' },
    { to: '/resources', label: 'Browse Resources' },
    { to: '/notifications', label: 'Notifications' },
  ];

  const adminLinks = [
    
    { to: '/admin/resources', label: 'Manage Resources' },
    { to: '/admin/bookings', label: 'All Bookings' },
    { to: '/admin/tickets', label: 'All Tickets' },
    { to: '/admin/users', label: 'Manage Users' },
  ];

  const links = isAdmin ? [...userLinks, ...adminLinks] : userLinks;

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">Smart Campus</div>
      <nav className="sidebar-nav">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;