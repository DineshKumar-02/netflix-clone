// ============================================
// My List Page (Supabase)
// ============================================
// Displays the user's watchlist stored in Supabase.
// Features:
// - Grid of saved movies
// - Remove from list
// - Empty state with browse link
// - Responsive grid layout

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import supabase from '../../services/supabase';
import { getImageUrl } from '../../services/tmdb';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './MyList.css';

function MyList() {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch watchlist from Supabase
  const fetchWatchlist = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('watchlist')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWatchlist(data || []);
    } catch (err) {
      console.error('Error fetching watchlist:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  // Remove a movie from the watchlist
  const handleRemove = async (movieId) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('user_id', user.id)
        .eq('movie_id', movieId);

      if (error) throw error;
      // Update local state immediately for instant feedback
      setWatchlist((prev) => prev.filter((item) => item.movie_id !== movieId));
    } catch (err) {
      console.error('Error removing from watchlist:', err);
    }
  };

  return (
    <div className="my-list" id="my-list-page">
      <Navbar />

      <div className="my-list__container container">
        {/* Page Header */}
        <div className="my-list__header fade-in-up">
          <h1 className="my-list__title">My List</h1>
          <p className="my-list__count">
            {watchlist.length} {watchlist.length === 1 ? 'title' : 'titles'}
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="my-list__grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="my-list__skeleton" />
            ))}
          </div>
        ) : watchlist.length === 0 ? (
          /* Empty State */
          <div className="my-list__empty fade-in">
            <div className="my-list__empty-icon">🎬</div>
            <h2>Your list is empty</h2>
            <p>Add movies and shows to your list to watch them later.</p>
            <Link to="/" className="my-list__browse-btn">
              Browse Movies
            </Link>
          </div>
        ) : (
          /* Watchlist Grid */
          <div className="my-list__grid fade-in-up">
            {watchlist.map((item) => {
              const movie = item.movie_data;
              if (!movie) return null;

              return (
                <div key={item.id} className="my-list__card">
                  {/* Poster with link */}
                  <Link to={`/movie/${movie.id}`} className="my-list__card-link">
                    <div className="my-list__card-poster">
                      {movie.poster_path ? (
                        <img
                          src={getImageUrl(movie.poster_path, 'w342')}
                          alt={movie.title}
                          className="my-list__card-img"
                          loading="lazy"
                        />
                      ) : (
                        <div className="my-list__card-placeholder">
                          <span>🎬</span>
                        </div>
                      )}
                      {/* Hover play overlay */}
                      <div className="my-list__card-overlay">
                        <span className="my-list__card-play">▶</span>
                      </div>
                    </div>
                  </Link>

                  {/* Card info */}
                  <div className="my-list__card-info">
                    <Link to={`/movie/${movie.id}`}>
                      <h3 className="my-list__card-title">{movie.title}</h3>
                    </Link>
                    <div className="my-list__card-meta">
                      {movie.vote_average && (
                        <span className="my-list__card-rating">
                          ⭐ {movie.vote_average.toFixed(1)}
                        </span>
                      )}
                      {movie.release_date && (
                        <span className="my-list__card-year">
                          {movie.release_date.split('-')[0]}
                        </span>
                      )}
                    </div>
                    <button
                      className="my-list__remove-btn"
                      onClick={() => handleRemove(item.movie_id)}
                    >
                      ✕ Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default MyList;
