import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/context/AuthContext';

const HomePage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ resources: 0, bookings: 0, tickets: 0 });

  useEffect(() => {
    // Simulate fetching stats - replace with actual API call later
    setStats({ resources: 24, bookings: 156, tickets: 42 });
  }, []);

  return (
    <div className="homepage">
      {/* Hero Section with Glassmorphism */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Smart Campus <span className="gradient-text">Operations Hub</span>
          </h1>
          <p className="hero-subtitle">
            Manage facility bookings, report incidents, and stay updated – all in one intelligent platform.
          </p>
          <div className="hero-buttons">
            {!user ? (
              <>
                <Link to="/login" className="btn-primary btn-large">Get Started</Link>
                <Link to="/browse" className="btn-outline btn-large">Explore Resources</Link>
              </>
            ) : (
              <Link to="/dashboard" className="btn-primary btn-large">Go to Dashboard</Link>
            )}
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">{stats.resources}+</span>
            <span className="stat-label">Resources</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.bookings}+</span>
            <span className="stat-label">Bookings</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.tickets}+</span>
            <span className="stat-label">Tickets Resolved</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Everything you need to manage campus operations</h2>
          <p className="section-subtitle">Streamlined tools for students, faculty, and administrators</p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Book Resources</h3>
              <p>Lecture halls, labs, meeting rooms, and equipment with conflict‑free scheduling.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔧</div>
              <h3>Report Incidents</h3>
              <p>Submit tickets with images, track status, and communicate with technicians.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔔</div>
              <h3>Real‑time Notifications</h3>
              <p>Stay informed about booking approvals, ticket updates, and comments.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Analytics Dashboard</h3>
              <p>View usage trends, resource occupancy, and ticket resolution metrics.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Role‑Based Access</h3>
              <p>Student, technician, and admin roles with tailored permissions.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Reliable</h3>
              <p>Enterprise‑grade security with JWT authentication and data protection.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to transform your campus experience?</h2>
          <p>Join hundreds of users already streamlining their campus operations.</p>
          {!user ? (
            <Link to="/signup" className="btn-primary btn-large">Create Free Account</Link>
          ) : (
            <Link to="/dashboard" className="btn-primary btn-large">Go to Dashboard</Link>
          )}
        </div>
      </section>

      {/* Footer Preview */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>Smart Campus Hub</h3>
            <p>Empowering smarter campus operations.</p>
          </div>
          <div className="footer-links">
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </div>
          <div className="footer-copyright">
            &copy; {new Date().getFullYear()} Smart Campus Hub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;