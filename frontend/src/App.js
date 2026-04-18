import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/context/AuthContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Signup from './components/Signup';
import OAuth2Redirect from './components/OAuth2Redirect';
import UserDashboard from './components/UserDashboard';
import PrivateRoute from './components/PrivateRoute';
import MyBookings from './components/pages/MyBookings';
import BookingForm from './components/pages/BookingForm';
import TicketForm from './components/pages/TicketForm';
import MyTickets from './components/pages/MyTickets';
import BrowseResources from './components/pages/BrowseResources';
import Notifications from './components/pages/Notifications';
import ManageResources from './components/pages/admin/ManageResources';
import AllBookings from './components/pages/admin/AllBookings';
import AllTickets from './components/pages/admin/AllTickets';
import ManageUsers from './components/pages/admin/ManageUsers';
import UserProfile from './components/UserProfile';
import AdminProfile from './components/AdminProfile';
import About from './components/About';
import Privacy from './components/Privacy';

// Layout component that conditionally shows Sidebar
const AppLayout = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const isLoggedIn = !!user;

  // Routes that should NOT show the sidebar (even when logged in)
  const noSidebarRoutes = ['/', '/about', '/privacy', '/resources'];
  const shouldShowSidebar = isLoggedIn && !noSidebarRoutes.includes(location.pathname);

  return (
    <div className="app">
      <Header />
      {shouldShowSidebar && <Sidebar />}
      <main className={shouldShowSidebar ? 'main-content-with-sidebar' : 'main-content-full'}>
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppLayout>
          <Routes>
            {/* Public routes – no sidebar */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />

            {/* Protected routes – sidebar will be shown (except /resources) */}
            <Route path="/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
            <Route path="/admin/profile" element={<PrivateRoute roles={['ROLE_ADMIN']}><AdminProfile /></PrivateRoute>} />
            <Route path="/bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
            <Route path="/bookings/new" element={<PrivateRoute><BookingForm /></PrivateRoute>} />
            <Route path="/tickets" element={<PrivateRoute><MyTickets /></PrivateRoute>} />
            <Route path="/tickets/new" element={<PrivateRoute><TicketForm /></PrivateRoute>} />
            <Route path="/resources" element={<PrivateRoute><BrowseResources /></PrivateRoute>} />
            <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />

            {/* Admin routes – sidebar shown */}
            <Route path="/admin/resources" element={<PrivateRoute roles={['ROLE_ADMIN']}><ManageResources /></PrivateRoute>} />
            <Route path="/admin/bookings" element={<PrivateRoute roles={['ROLE_ADMIN']}><AllBookings /></PrivateRoute>} />
            <Route path="/admin/tickets" element={<PrivateRoute roles={['ROLE_ADMIN']}><AllTickets /></PrivateRoute>} />
            <Route path="/admin/users" element={<PrivateRoute roles={['ROLE_ADMIN']}><ManageUsers /></PrivateRoute>} />
          </Routes>
        </AppLayout>
      </AuthProvider>
    </Router>
  );
}

export default App;