// src/pages/Login.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../components/context/AuthContext';

const Login = () => {
  const { localLogin, socialLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const urlError = new URLSearchParams(location.search).get('error');

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await localLogin(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocial = (provider) => socialLogin(provider);

  return (
    <div className="login-ui-page">
      <div className="login-ui-card">
        <div className="login-ui-header">
          <h2>LOGIN</h2>
          <p>Welcome back! Please login to your account.</p>
        </div>

        {(error || urlError) && (
          <div className="login-ui-alert">
            {error || (urlError === 'oauth_failed' ? 'Social login failed. Please try again.' : 'An error occurred.')}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-ui-form">
          <div className="login-ui-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-ui-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="login-ui-forgot">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button type="submit" disabled={loading} className="login-ui-btn login-ui-btn-primary">
            {loading ? 'Signing in...' : 'LOGIN'}
          </button>
        </form>

        <div className="login-ui-divider">
          <span>Or Login With</span>
        </div>

        <div className="login-ui-social">
          <button onClick={() => handleSocial('google')} className="login-ui-social-btn google">
            <svg viewBox="0 0 24 24">
              <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
            </svg>
            Google
          </button>
        </div>

        <p className="login-ui-footer">
          Don't have an account? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;