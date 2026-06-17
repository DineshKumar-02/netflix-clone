// ============================================
// Login Page
// ============================================
// Netflix-style login form with:
// - Email & password fields
// - Form validation
// - Show/hide password toggle
// - Link to signup
// - Supabase authentication

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form validation
  const validate = () => {
    if (!email.trim()) {
      setError('Please enter your email.');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (!password) {
      setError('Please enter your password.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;

    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" id="login-page">
      {/* Background with gradient overlay */}
      <div className="auth-page__background" />

      {/* Top Logo */}
      <div className="auth-page__header">
        <Link to="/" className="auth-page__logo">
          <span className="auth-page__logo-text">NETFLIX</span>
        </Link>
      </div>

      {/* Login Form Card */}
      <div className="auth-page__content">
        <div className="auth-card fade-in">
          <h1 className="auth-card__title">Sign In</h1>

          {/* Error message */}
          {error && (
            <div className="auth-card__error" id="login-error">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-card__form">
            {/* Email Field */}
            <div className="auth-card__field">
              <input
                type="email"
                className={`auth-card__input ${email ? 'auth-card__input--filled' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="login-email"
                autoComplete="email"
              />
              <label className="auth-card__label">Email address</label>
            </div>

            {/* Password Field */}
            <div className="auth-card__field">
              <input
                type={showPassword ? 'text' : 'password'}
                className={`auth-card__input ${password ? 'auth-card__input--filled' : ''}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="login-password"
                autoComplete="current-password"
              />
              <label className="auth-card__label">Password</label>
              {/* Show/Hide password toggle */}
              <button
                type="button"
                className="auth-card__toggle-pw"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'HIDE' : 'SHOW'}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="auth-card__submit"
              disabled={loading}
              id="login-submit"
            >
              {loading ? (
                <span className="auth-card__spinner" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer links */}
          <div className="auth-card__footer">
            <p className="auth-card__footer-text">
              New to Netflix?{' '}
              <Link to="/signup" className="auth-card__footer-link" id="goto-signup">
                Sign up now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
