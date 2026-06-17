// ============================================
// Navbar Component
// ============================================
// Netflix-style sticky navbar with:
// - Logo on the left
// - Navigation links
// - Search toggle
// - Profile menu
// - Mobile hamburger menu
// - Transparent → solid background on scroll

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SearchBar from '../SearchBar/SearchBar';
import './Navbar.css';

function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Track scroll position for navbar background
  const [scrolled, setScrolled] = useState(false);
  // Mobile menu toggle
  const [menuOpen, setMenuOpen] = useState(false);
  // Profile dropdown toggle
  const [profileOpen, setProfileOpen] = useState(false);

  // Listen for scroll events
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Close mobile menu when clicking a link
  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} id="main-navbar">
      <div className="navbar__container">
        {/* Left side — Logo + Links */}
        <div className="navbar__left">
          {/* Netflix-style Logo */}
          <Link to="/" className="navbar__logo" id="navbar-logo">
            <span className="navbar__logo-text">NETFLIX</span>
          </Link>

          {/* Desktop Navigation Links */}
          <ul className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
            <li><Link to="/" className="navbar__link" onClick={closeMenu}>Home</Link></li>
            <li><Link to="/my-list" className="navbar__link" onClick={closeMenu}>My List</Link></li>
          </ul>
        </div>

        {/* Right side — Search + Profile */}
        <div className="navbar__right">
          {/* Search Bar */}
          <SearchBar />

          {/* Profile Section */}
          <div className="navbar__profile" id="navbar-profile">
            <button
              className="navbar__profile-btn"
              onClick={() => setProfileOpen(!profileOpen)}
              aria-label="Profile menu"
            >
              {/* Profile avatar icon */}
              <div className="navbar__avatar">
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
              </div>
              {/* Dropdown arrow */}
              <span className={`navbar__caret ${profileOpen ? 'navbar__caret--open' : ''}`}>▾</span>
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <div className="navbar__dropdown" id="profile-dropdown">
                <div className="navbar__dropdown-email">
                  {user?.email || 'User'}
                </div>
                <hr className="navbar__dropdown-divider" />
                <button
                  className="navbar__dropdown-item"
                  onClick={handleSignOut}
                  id="sign-out-btn"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            id="hamburger-btn"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
