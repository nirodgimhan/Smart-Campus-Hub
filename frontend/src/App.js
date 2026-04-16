import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

const AppLayout = ({ children }) => {
  const { user } = useAuth();
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        {user && <Sidebar />}
        <main className="flex-1 bg-gray-100 p-4">{children}</main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />

            <Route path="/dashboard" element={
              <PrivateRoute>
                <UserDashboard />
              </PrivateRoute>
            } />
           

            {/* Placeholder routes – implement as needed */}
            <Route path="/bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
            <Route path="/bookings/new" element={<PrivateRoute><BookingForm /></PrivateRoute>} />
            <Route path="/tickets" element={<PrivateRoute><MyTickets /></PrivateRoute>} />
            <Route path="/tickets/new" element={<PrivateRoute><TicketForm /></PrivateRoute>} />
            <Route path="/resources" element={<PrivateRoute><BrowseResources /></PrivateRoute>} />
            <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
            <Route path="/admin/resources" element={<PrivateRoute roles={['ROLE_ADMIN']}><ManageResources /></PrivateRoute>} />
            <Route path="/admin/bookings" element={<PrivateRoute roles={['ROLE_ADMIN']}><AllBookings /></PrivateRoute>} />
            <Route path="/admin/tickets" element={<PrivateRoute roles={['ROLE_ADMIN']}><AllTickets /></PrivateRoute>} />
            <Route path="/admin/users" element={<PrivateRoute roles={['ROLE_ADMIN']}><ManageUsers /></PrivateRoute>} />
            <Route path="/tickets/new" element={<PrivateRoute><div>Create Ticket</div></PrivateRoute>} />
          </Routes>
        </AppLayout>
      </AuthProvider>
    </Router>
  );
}

export default App;