import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      background: '#2c3e50',
      color: '#ecf0f1',
      textAlign: 'center',
      padding: '20px',
      marginTop: 'auto'
    }}>
      <p>&copy; {new Date().getFullYear()} Smart Campus Hub. All rights reserved.</p>
      <p>Contact: support@smartcampus.com</p>
    </footer>
  );
};

export default Footer;