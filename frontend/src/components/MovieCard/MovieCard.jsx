// ============================================
// MovieCard Component
// ============================================
// Individual movie poster card with:
// - Poster image
// - Hover scale + info overlay
// - Add to watchlist button
// - Rating badge
// - Click to navigate to details

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../../services/tmdb';
import './MovieCard.css';

function MovieCard({ movie, onAddToList, onRemoveFromList, isInList = false }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  // Navigate to movie details page
  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  // Handle watchlist toggle
  const handleListToggle = (e) => {
    e.stopPropagation(); // Prevent card click
    if (isInList && onRemoveFromList) {
      onRemoveFromList(movie.id);
    } else if (onAddToList) {
      onAddToList(movie);
    }
  };

  return (
    <div className="movie-card" onClick={handleClick} id={`movie-card-${movie.id}`}>
      {/* Poster Image */}
      <div className="movie-card__poster-wrapper">
        {!imageLoaded && !imageError && (
          <div className="movie-card__placeholder">
            <div className="movie-card__placeholder-shimmer" />
          </div>
        )}

        {!imageError ? (
          <img
            src={getImageUrl(movie.poster_path, 'w342')}
            alt={movie.title || movie.name}
            className={`movie-card__poster ${imageLoaded ? 'movie-card__poster--loaded' : ''}`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="movie-card__no-image">
            <span>🎬</span>
            <span>{movie.title || movie.name}</span>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="movie-card__overlay">
          <div className="movie-card__overlay-content">
            <h3 className="movie-card__title">
              {movie.title || movie.name}
            </h3>

            <div className="movie-card__info">
              <span className="movie-card__rating">
                ⭐ {movie.vote_average?.toFixed(1)}
              </span>
              <span className="movie-card__year">
                {(movie.release_date || movie.first_air_date)?.split('-')[0]}
              </span>
            </div>

            {/* Watchlist Button */}
            <button
              className={`movie-card__list-btn ${isInList ? 'movie-card__list-btn--active' : ''}`}
              onClick={handleListToggle}
              aria-label={isInList ? 'Remove from list' : 'Add to list'}
            >
              {isInList ? '✓ In List' : '+ My List'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
