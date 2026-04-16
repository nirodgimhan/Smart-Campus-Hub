import { Link } from 'react-router-dom';
import { useAuth } from '../components/context/AuthContext';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-blue-600 mb-4">Smart Campus Operations Hub</h1>
        <p className="text-xl text-gray-600 mb-8">
          Manage facility bookings, report incidents, and stay updated – all in one place.
        </p>
        {!user ? (
          <div className="space-x-4">
            <Link to="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Get Started
            </Link>
          </div>
        ) : (
          <Link to="/dashboard" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
            Go to Dashboard
          </Link>
        )}
      </div>
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-3">📚</div>
            <h3 className="text-xl font-semibold mb-2">Book Resources</h3>
            <p>Lecture halls, labs, meeting rooms, and equipment with conflict-free scheduling.</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">🔧</div>
            <h3 className="text-xl font-semibold mb-2">Report Incidents</h3>
            <p>Submit tickets with images, track status, and communicate with technicians.</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">🔔</div>
            <h3 className="text-xl font-semibold mb-2">Real-time Notifications</h3>
            <p>Stay informed about booking approvals, ticket updates, and comments.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;