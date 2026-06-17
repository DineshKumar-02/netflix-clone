// ============================================
// Setup Screen Component
// ============================================
// Shown when TMDB API key is not configured.
// Guides the user through getting a free key
// and lets them paste it directly in the app.

import { useState } from 'react';
import { setApiKey, validateApiKey } from '../../services/tmdb';
import './SetupScreen.css';

function SetupScreen({ onComplete }) {
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  // Validate and save the API key
  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedKey = key.trim();

    if (!trimmedKey) {
      setError('Please enter your API key.');
      return;
    }

    setLoading(true);
    setError('');

    const isValid = await validateApiKey(trimmedKey);

    if (isValid) {
      setApiKey(trimmedKey);
      onComplete(); // Refresh the app
    } else {
      setError('Invalid API key. Please check and try again.');
    }

    setLoading(false);
  };

  return (
    <div className="setup" id="setup-screen">
      <div className="setup__background" />

      <div className="setup__container fade-in">
        {/* Logo */}
        <div className="setup__logo">
          <span className="setup__logo-text">NETFLIX</span>
        </div>

        <div className="setup__card">
          <h1 className="setup__title">Welcome! Let's set things up</h1>
          <p className="setup__subtitle">
            This app needs a free TMDB API key to fetch movie data. It takes less than 2 minutes.
          </p>

          {/* Step Indicator */}
          <div className="setup__steps">
            <div className={`setup__step ${step >= 1 ? 'setup__step--active' : ''}`}>
              <span className="setup__step-num">1</span>
              <span>Create Account</span>
            </div>
            <div className="setup__step-line" />
            <div className={`setup__step ${step >= 2 ? 'setup__step--active' : ''}`}>
              <span className="setup__step-num">2</span>
              <span>Get API Key</span>
            </div>
            <div className="setup__step-line" />
            <div className={`setup__step ${step >= 3 ? 'setup__step--active' : ''}`}>
              <span className="setup__step-num">3</span>
              <span>Paste Key</span>
            </div>
          </div>

          {/* Step 1: Create account */}
          {step === 1 && (
            <div className="setup__step-content fade-in">
              <div className="setup__instruction">
                <h3>📝 Create a free TMDB account</h3>
                <p>Click the button below to sign up. It's completely free — no credit card needed.</p>
              </div>
              <a
                href="https://www.themoviedb.org/signup"
                target="_blank"
                rel="noopener noreferrer"
                className="setup__btn setup__btn--primary"
              >
                Open TMDB Signup →
              </a>
              <button
                className="setup__btn setup__btn--secondary"
                onClick={() => setStep(2)}
              >
                I already have an account → Next
              </button>
            </div>
          )}

          {/* Step 2: Get API Key */}
          {step === 2 && (
            <div className="setup__step-content fade-in">
              <div className="setup__instruction">
                <h3>🔑 Get your API key</h3>
                <p>After logging in, click the link below to go directly to the API settings page. 
                   Click <strong>"Create"</strong>, choose <strong>"Developer"</strong>, and accept the terms.</p>
              </div>
              <a
                href="https://www.themoviedb.org/settings/api"
                target="_blank"
                rel="noopener noreferrer"
                className="setup__btn setup__btn--primary"
              >
                Open API Settings →
              </a>
              <div className="setup__nav-btns">
                <button className="setup__btn setup__btn--ghost" onClick={() => setStep(1)}>
                  ← Back
                </button>
                <button className="setup__btn setup__btn--secondary" onClick={() => setStep(3)}>
                  I have my key → Next
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Paste key */}
          {step === 3 && (
            <div className="setup__step-content fade-in">
              <div className="setup__instruction">
                <h3>📋 Paste your API key below</h3>
                <p>Copy the <strong>"API Key (v3 auth)"</strong> from your TMDB settings and paste it here.</p>
              </div>

              <form onSubmit={handleSubmit} className="setup__form">
                <div className="setup__field">
                  <input
                    type="text"
                    className="setup__input"
                    placeholder="e.g. 1a2b3c4d5e6f7g8h9i0j..."
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    id="setup-api-key-input"
                    autoFocus
                  />
                </div>

                {error && <div className="setup__error">{error}</div>}

                <button
                  type="submit"
                  className="setup__btn setup__btn--primary"
                  disabled={loading}
                  id="setup-submit-btn"
                >
                  {loading ? (
                    <span className="setup__spinner" />
                  ) : (
                    '✓ Validate & Start'
                  )}
                </button>
              </form>

              <button className="setup__btn setup__btn--ghost" onClick={() => setStep(2)}>
                ← Back
              </button>
            </div>
          )}
        </div>

        <p className="setup__footer-note">
          Your API key is stored locally in your browser and never shared.
        </p>
      </div>
    </div>
  );
}

export default SetupScreen;
