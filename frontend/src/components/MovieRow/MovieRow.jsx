// ============================================
// MovieRow Component
// ============================================
// Horizontal scrolling row of MovieCards.
// Features:
// - Genre title
// - Left/right scroll arrows
// - Smooth horizontal scroll
// - Lazy loading of movies

import { useState, useEffect, useRef } from 'react';
import { fetchMovies } from '../../services/tmdb';
import MovieCard from '../MovieCard/MovieCard';
import './MovieRow.css';

function MovieRow({ title, fetchUrl, watchlist = [], onAddToList, onRemoveFromList }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const rowRef = useRef(null);

  // Track if scroll arrows should show
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Fetch movies for this row
  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      const data = await fetchMovies(fetchUrl);
      setMovies(data);
      setLoading(false);
    };
    loadMovies();
  }, [fetchUrl]);

  // Update arrow visibility based on scroll position
  const updateArrows = () => {
    if (!rowRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
    setShowLeftArrow(scrollLeft > 20);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
  };

  // Scroll the row left or right
  const scroll = (direction) => {
    if (!rowRef.current) return;
    const scrollAmount = rowRef.current.clientWidth * 0.75;
    rowRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });

    // Update arrows after scroll animation
    setTimeout(updateArrows, 400);
  };

  // Check if a movie is in the watchlist
  const isInWatchlist = (movieId) => {
    return watchlist.some((item) => item.movie_id === movieId);
  };

  if (loading) {
    return (
      <div className="movie-row">
        <h2 className="movie-row__title">{title}</h2>
        <div className="movie-row__loading">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="movie-row__skeleton" />
          ))}
        </div>
      </div>
    );
  }

  if (movies.length === 0) return null;

  return (
    <div className="movie-row fade-in">
      <h2 className="movie-row__title">{title}</h2>

      <div className="movie-row__container">
        {/* Left scroll arrow */}
        {showLeftArrow && (
          <button
            className="movie-row__arrow movie-row__arrow--left"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            ‹
          </button>
        )}

        {/* Scrollable movie cards */}
        <div
          className="movie-row__cards"
          ref={rowRef}
          onScroll={updateArrows}
        >
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isInList={isInWatchlist(movie.id)}
              onAddToList={onAddToList}
              onRemoveFromList={onRemoveFromList}
            />
          ))}
        </div>

        {/* Right scroll arrow */}
        {showRightArrow && (
          <button
            className="movie-row__arrow movie-row__arrow--right"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            ›
          </button>
        )}
      </div>
    </div>
  );
}

export default MovieRow;
