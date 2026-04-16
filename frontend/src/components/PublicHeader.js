import React from 'react';
import { Link } from 'react-router-dom';

const PublicHeader = () => {
  return (
    <header className="public-header">
      <div className="header-container">
        <Link to="/" className="logo">
          <div className="logo-icon">SCH</div>
          <span className="logo-text">Smart Campus Hub</span>
        </Link>

        <nav className="public-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
        </nav>

        <div className="auth-buttons">
          <Link to="/login" className="btn-outline-light">Login</Link>
          <Link to="/signup" className="btn-primary-light">Register</Link>
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;