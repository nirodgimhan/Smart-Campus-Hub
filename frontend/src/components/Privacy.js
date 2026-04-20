import React from 'react';
import { Link } from 'react-router-dom';

const Privacy = () => {
  const keyPoints = [
    { icon: '🔒', title: 'Encryption', desc: 'All data encrypted in transit & at rest' },
    { icon: '👁️', title: 'Transparency', desc: 'Clear about how we use your data' },
    { icon: '⚙️', title: 'User Control', desc: 'Manage your data anytime' },
    { icon: '📜', title: 'Compliance', desc: 'GDPR & local privacy laws compliant' },
  ];

  return (
    <div className="privacy-page">
      {/* Hero Section with Gradient */}
      <div className="privacy-hero">
        <div className="privacy-hero-content">
          <h1 className="privacy-title">Privacy Policy</h1>
          <p className="privacy-subtitle">Last updated: April 2025</p>
          <p className="privacy-subtitle-secondary">
            Your privacy matters. Learn how we protect and handle your information.
          </p>
        </div>
      </div>

      <div className="privacy-container">
        {/* Key Points Grid */}
        <div className="privacy-key-grid">
          {keyPoints.map((point, idx) => (
            <div key={idx} className="privacy-key-card">
              <div className="privacy-key-icon">{point.icon}</div>
              <h3>{point.title}</h3>
              <p>{point.desc}</p>
            </div>
          ))}
        </div>

        {/* Main Content Sections */}
        <div className="privacy-content">
          <section className="privacy-section">
            <h2>1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as your name, email address,
              student/faculty ID, and any other details you submit when creating an account,
              making bookings, or reporting tickets. We also automatically collect usage data
              (e.g., IP address, browser type, pages visited) to improve our services.
            </p>
          </section>

          <section className="privacy-section">
            <h2>2. How We Use Your Information</h2>
            <p>
              Your data is used solely to provide and improve our services – processing bookings,
              managing support tickets, sending notifications (booking approvals, ticket updates),
              ensuring campus security, and analysing usage patterns. <strong>We never sell your
              personal information to third parties.</strong> We may share data with campus
              authorities only when required by law or to protect safety.
            </p>
          </section>

          <section className="privacy-section">
            <h2>3. Data Security</h2>
            <p>
              We implement industry‑standard security measures to protect your data from
              unauthorised access, alteration, or disclosure. All sensitive information is
              encrypted in transit (TLS 1.3) and at rest (AES-256). Access to personal data
              is restricted to authorised personnel only.
            </p>
          </section>

          <section className="privacy-section">
            <h2>4. Your Rights</h2>
            <p>
              You may access, update, or delete your personal information at any time through
              your profile settings. You can request a copy of your data or ask us to restrict
              processing. For any privacy concerns, please contact our support team at
              <a href="mailto:privacy@smarthub.com"> privacy@smarthub.com</a>.
            </p>
          </section>

          <section className="privacy-section">
            <h2>5. Cookies & Tracking</h2>
            <p>
              We use essential cookies to provide core functionality (authentication, sessions).
              You may disable non‑essential cookies via your browser settings. Third‑party
              analytics help us improve performance but do not track you across other sites.
            </p>
          </section>

          <section className="privacy-section">
            <h2>6. Changes to This Policy</h2>
            <p>
              We may update this policy from time to time. Significant changes will be notified
              via email or a prominent notice on the platform. Continued use of the service
              after changes constitutes acceptance of the updated policy.
            </p>
          </section>
        </div>

        {/* Call to Action */}
        <div className="privacy-cta">
          <h3>Have questions about your privacy?</h3>
          <p>Contact our Data Protection Officer for any concerns or requests.</p>
          <Link to="/contact" className="btn-primary">Contact Us</Link>
        </div>
      </div>
    </div>
  );
};

export default Privacy;