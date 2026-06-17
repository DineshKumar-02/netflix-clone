// ============================================
// Banner Component
// ============================================
// Hero banner showing a random trending movie with:
// - Full-width backdrop image
// - Gradient overlay
// - Movie title, description
// - Play and More Info buttons
// - Auto-rotate every 8 seconds

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMovies, getBackdropUrl } from '../../services/tmdb';
import requests from '../../services/tmdb';
import './Banner.css';

function Banner() {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeClass, setFadeClass] = useState('banner--visible');
  const navigate = useNavigate();

  // Fetch trending movies for the banner
  useEffect(() => {
    const loadBannerMovies = async () => {
      const data = await fetchMovies(requests.fetchTrending);
      // Filter movies that have backdrop images
      const filtered = data.filter((m) => m.backdrop_path);
      setMovies(filtered.slice(0, 10)); // Use top 10
    };
    loadBannerMovies();
  }, []);

  // Auto-rotate banner every 8 seconds
  const rotateMovie = useCallback(() => {
    if (movies.length === 0) return;

    // Fade out
    setFadeClass('banner--hidden');

    // After fade-out, switch movie and fade in
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
      setFadeClass('banner--visible');
    }, 500);
  }, [movies.length]);

  useEffect(() => {
    if (movies.length === 0) return;
    const interval = setInterval(rotateMovie, 8000);
    return () => clearInterval(interval);
  }, [movies.length, rotateMovie]);

  // Get the currently displayed movie
  const movie = movies[currentIndex];

  if (!movie) {
    return <div className="banner banner--loading" />;
  }

  // Truncate description to keep banner clean
  const truncate = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  };

  return (
    <header
      className={`banner ${fadeClass}`}
      id="hero-banner"
      style={{
        backgroundImage: `url(${getBackdropUrl(movie.backdrop_path)})`,
      }}
    >
      {/* Gradient overlays for readability */}
      <div className="banner__overlay" />

      {/* Banner Content */}
      <div className="banner__content">
        <h1 className="banner__title">
          {movie.title || movie.name || movie.original_title}
        </h1>

        {/* Rating badge */}
        <div className="banner__meta">
          <span className="banner__rating">
            ⭐ {movie.vote_average?.toFixed(1)}
          </span>
          <span className="banner__year">
            {(movie.release_date || movie.first_air_date)?.split('-')[0]}
          </span>
        </div>

        <p className="banner__description">
          {truncate(movie.overview, 200)}
        </p>

        {/* Action Buttons */}
        <div className="banner__buttons">
          <button
            className="banner__btn banner__btn--play"
            onClick={() => navigate(`/movie/${movie.id}`)}
            id="banner-play-btn"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            Play
          </button>
          <button
            className="banner__btn banner__btn--info"
            onClick={() => navigate(`/movie/${movie.id}`)}
            id="banner-info-btn"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            More Info
          </button>
        </div>
      </div>

      {/* Banner indicators */}
      <div className="banner__indicators">
        {movies.slice(0, 10).map((_, idx) => (
          <button
            key={idx}
            className={`banner__indicator ${idx === currentIndex ? 'banner__indicator--active' : ''}`}
            onClick={() => {
              setFadeClass('banner--hidden');
              setTimeout(() => {
                setCurrentIndex(idx);
                setFadeClass('banner--visible');
              }, 500);
            }}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </header>
  );
}

export default Banner;
