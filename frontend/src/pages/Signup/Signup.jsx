// ============================================
// Signup Page
// ============================================
// Registration form with email, password,
// confirm password, validation, and Supabase auth.

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../Login/Login.css'; // Reuse shared auth styles

function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
      setError('Please enter a password.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validate()) return;

    setLoading(true);
    try {
      await signUp(email, password);
      setSuccess('Account created! Check your email to confirm, then sign in.');
      // Redirect to login after 3 seconds
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" id="signup-page">
      {/* Background */}
      <div className="auth-page__background" />

      {/* Logo */}
      <div className="auth-page__header">
        <Link to="/" className="auth-page__logo">
          <span className="auth-page__logo-text">NETFLIX</span>
        </Link>
      </div>

      {/* Signup Form */}
      <div className="auth-page__content">
        <div className="auth-card fade-in">
          <h1 className="auth-card__title">Sign Up</h1>

          {/* Error message */}
          {error && (
            <div className="auth-card__error" id="signup-error">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
              </svg>
              {error}
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="auth-card__success" id="signup-success">
              ✓ {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-card__form">
            {/* Email */}
            <div className="auth-card__field">
              <input
                type="email"
                className={`auth-card__input ${email ? 'auth-card__input--filled' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="signup-email"
                autoComplete="email"
              />
              <label className="auth-card__label">Email address</label>
            </div>

            {/* Password */}
            <div className="auth-card__field">
              <input
                type={showPassword ? 'text' : 'password'}
                className={`auth-card__input ${password ? 'auth-card__input--filled' : ''}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="signup-password"
                autoComplete="new-password"
              />
              <label className="auth-card__label">Password</label>
              <button
                type="button"
                className="auth-card__toggle-pw"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'HIDE' : 'SHOW'}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="auth-card__field">
              <input
                type={showPassword ? 'text' : 'password'}
                className={`auth-card__input ${confirmPassword ? 'auth-card__input--filled' : ''}`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                id="signup-confirm-password"
                autoComplete="new-password"
              />
              <label className="auth-card__label">Confirm password</label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="auth-card__submit"
              disabled={loading}
              id="signup-submit"
            >
              {loading ? (
                <span className="auth-card__spinner" />
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="auth-card__footer">
            <p className="auth-card__footer-text">
              Already have an account?{' '}
              <Link to="/login" className="auth-card__footer-link" id="goto-login">
                Sign in now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
