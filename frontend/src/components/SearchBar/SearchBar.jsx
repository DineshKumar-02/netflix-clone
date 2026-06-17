// ============================================
// SearchBar Component
// ============================================
// Expanding search input with debounced TMDB search.
// Shows results in a dropdown below the search bar.

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchMovies, getImageUrl } from '../../services/tmdb';
import './SearchBar.css';

function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Focus input when search opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Debounced search — waits 400ms after user stops typing
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const debounceTimer = setTimeout(async () => {
      setLoading(true);
      const data = await searchMovies(query);
      setResults(data.slice(0, 8)); // Limit to 8 results
      setLoading(false);
    }, 400);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
        setQuery('');
        setResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navigate to movie details
  const handleResultClick = (movieId) => {
    navigate(`/movie/${movieId}`);
    setIsOpen(false);
    setQuery('');
    setResults([]);
  };

  return (
    <div className="search" ref={searchRef} id="search-bar">
      {/* Search Toggle Button */}
      <button
        className="search__toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle search"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </button>

      {/* Expandable Search Input */}
      <div className={`search__input-container ${isOpen ? 'search__input-container--open' : ''}`}>
        <input
          ref={inputRef}
          type="text"
          className="search__input"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          id="search-input"
        />
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (query.trim() !== '') && (
        <div className="search__results" id="search-results">
          {loading ? (
            <div className="search__loading">Searching...</div>
          ) : results.length > 0 ? (
            results.map((movie) => (
              <button
                key={movie.id}
                className="search__result-item"
                onClick={() => handleResultClick(movie.id)}
              >
                <img
                  src={getImageUrl(movie.poster_path, 'w92')}
                  alt={movie.title}
                  className="search__result-poster"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div className="search__result-info">
                  <span className="search__result-title">{movie.title}</span>
                  <span className="search__result-year">
                    {movie.release_date?.split('-')[0] || 'N/A'}
                  </span>
                </div>
                <span className="search__result-rating">
                  ⭐ {movie.vote_average?.toFixed(1)}
                </span>
              </button>
            ))
          ) : (
            <div className="search__no-results">No results found</div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
