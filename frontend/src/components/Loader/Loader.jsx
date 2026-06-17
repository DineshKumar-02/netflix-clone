// ============================================
// Loader Component
// ============================================
// Pure CSS loading spinner displayed during data fetching
// and auth state resolution.

import './Loader.css';

function Loader() {
  return (
    <div className="loader-overlay" id="app-loader">
      {/* Netflix-style "N" logo animation */}
      <div className="loader-container">
        <div className="loader-spinner">
          <div className="loader-ring"></div>
          <div className="loader-ring"></div>
          <div className="loader-ring"></div>
        </div>
        <p className="loader-text">Loading...</p>
      </div>
    </div>
  );
}

export default Loader;
