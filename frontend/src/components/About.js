import React from 'react';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About Smart Campus Hub</h1>
        <p>Empowering campus communities through smart resource management</p>
      </div>
      <div className="about-content">
        <section>
          <h2>Our Mission</h2>
          <p>
            Smart Campus Hub is dedicated to streamlining campus operations by providing
            a centralised platform for booking facilities, managing support tickets,
            and enhancing communication between students, faculty, and administrators.
          </p>
        </section>
        <section>
          <h2>What We Offer</h2>
          <ul>
            <li>📅 Easy booking of lecture halls, labs, meeting rooms, and equipment</li>
            <li>🎫 Efficient incident reporting and ticket tracking</li>
            <li>🔔 Real‑time notifications for booking approvals and ticket updates</li>
            <li>👥 Role‑based access for students, technicians, and admins</li>
          </ul>
        </section>
        <section>
          <h2>Our Vision</h2>
          <p>
            To create a seamless, paperless campus experience where resources are utilised
            optimally and every user enjoys a hassle‑free digital environment.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;