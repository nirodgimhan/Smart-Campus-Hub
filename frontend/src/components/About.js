import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  const teamMembers = [
    { name: 'Dr. Amal Perera', role: 'Project Lead', icon: '👨‍🏫' },
    { name: 'Ms. Nimali Fernando', role: 'Operations Manager', icon: '👩‍💼' },
    { name: 'Mr. Kasun Bandara', role: 'Lead Developer', icon: '👨‍💻' },
    { name: 'Ms. Tharushi Silva', role: 'UX Designer', icon: '🎨' },
  ];

  const stats = [
    { value: '98%', label: 'User Satisfaction' },
    { value: '24/7', label: 'Support Available' },
    { value: '500+', label: 'Daily Bookings' },
    { value: '15min', label: 'Avg. Response Time' },
  ];

  return (
    <div className="about-page">
      {/* Hero Section with Gradient */}
      <div className="about-hero">
        <div className="about-hero-content">
          <h1 className="about-title">About Smart Campus Hub</h1>
          <p className="about-subtitle">
            Empowering campus communities through smart resource management and seamless digital experiences
          </p>
        </div>
      </div>

      <div className="about-container">
        {/* Stats Section */}
        <div className="about-stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="about-stat-card">
              <div className="about-stat-value">{stat.value}</div>
              <div className="about-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission Section */}
        <section className="about-section">
          <div className="about-section-icon">🎯</div>
          <h2>Our Mission</h2>
          <p>
            Smart Campus Hub is dedicated to streamlining campus operations by providing
            a centralised platform for booking facilities, managing support tickets,
            and enhancing communication between students, faculty, and administrators.
            We strive to eliminate inefficiencies and create a connected, paperless campus environment.
          </p>
        </section>

        {/* What We Offer */}
        <section className="about-section">
          <div className="about-section-icon">✨</div>
          <h2>What We Offer</h2>
          <div className="about-offerings-grid">
            <div className="offering-card">
              <div className="offering-icon">📅</div>
              <h3>Easy Booking</h3>
              <p>Book lecture halls, labs, meeting rooms, and equipment with conflict-free scheduling.</p>
            </div>
            <div className="offering-card">
              <div className="offering-icon">🎫</div>
              <h3>Incident Reporting</h3>
              <p>Report issues instantly with images, track ticket status, and get real-time updates.</p>
            </div>
            <div className="offering-card">
              <div className="offering-icon">🔔</div>
              <h3>Real-time Notifications</h3>
              <p>Receive instant alerts for booking approvals, ticket updates, and system announcements.</p>
            </div>
            <div className="offering-card">
              <div className="offering-icon">👥</div>
              <h3>Role-Based Access</h3>
              <p>Tailored experiences for students, technicians, faculty, and administrators.</p>
            </div>
            <div className="offering-card">
              <div className="offering-icon">📊</div>
              <h3>Analytics Dashboard</h3>
              <p>Gain insights into resource utilisation, booking trends, and ticket resolution metrics.</p>
            </div>
            <div className="offering-card">
              <div className="offering-icon">🔒</div>
              <h3>Secure & Reliable</h3>
              <p>Enterprise-grade security with encrypted data and role-based permissions.</p>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="about-section">
          <div className="about-section-icon">🌟</div>
          <h2>Our Vision</h2>
          <p>
            To create a seamless, paperless campus experience where resources are utilised
            optimally, communication flows effortlessly, and every user enjoys a hassle‑free
            digital environment. We envision a future where technology bridges gaps and
            empowers education.
          </p>
        </section>

        {/* Team Section */}
        <section className="about-section">
          <div className="about-section-icon">👥</div>
          <h2>Meet the Team</h2>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-icon">{member.icon}</div>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <div className="about-cta">
          <h3>Ready to transform your campus experience?</h3>
          <Link to="/signup" className="btn-primary">Get Started Today</Link>
        </div>
      </div>
    </div>
  );
};

export default About;