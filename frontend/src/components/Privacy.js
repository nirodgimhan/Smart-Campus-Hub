// src/components/pages/Privacy.jsx
import React from 'react';

const Privacy = () => {
  return (
    <div className="privacy-container">
      <div className="privacy-header">
        <h1>Privacy Policy</h1>
        <p>Last updated: April 2025</p>
      </div>
      <div className="privacy-content">
        <section>
          <h2>Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as your name, email address,
            and any other details you submit when creating an account, making bookings, or
            reporting tickets.
          </p>
        </section>
        <section>
          <h2>How We Use Your Information</h2>
          <p>
            Your data is used solely to provide and improve our services – processing bookings,
            managing support tickets, sending notifications, and ensuring campus security.
            We never sell your personal information to third parties.
          </p>
        </section>
        <section>
          <h2>Data Security</h2>
          <p>
            We implement industry‑standard security measures to protect your data from
            unauthorised access, alteration, or disclosure. All sensitive information is
            encrypted in transit and at rest.
          </p>
        </section>
        <section>
          <h2>Your Rights</h2>
          <p>
            You may access, update, or delete your personal information at any time through
            your profile settings. For any privacy concerns, please contact our support team.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;