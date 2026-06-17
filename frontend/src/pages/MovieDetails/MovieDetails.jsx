// ============================================
// Movie Details Page (Supabase Watchlist)
// ============================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import supabase from '../../services/supabase';
import { getMovieDetails, getTrailerKey, getImageUrl, getBackdropUrl } from '../../services/tmdb';
import Navbar from '../../components/Navbar/Navbar';
import Loader from '../../components/Loader/Loader';
import './MovieDetails.css';

function MovieDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInList, setIsInList] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const loadMovie = async () => {
      setLoading(true);
      const data = await getMovieDetails(id);
      setMovie(data);
      setLoading(false);
    };
    loadMovie();
  }, [id]);

  useEffect(() => {
    const checkIsInList = async () => {
      if (!user || !id) return;
      try {
        const { data, error } = await supabase
          .from('watchlist')
          .select('id')
          .eq('user_id', user.id)
          .eq('movie_id', parseInt(id));
        if (error) throw error;
        setIsInList(data && data.length > 0);
      } catch (err) {
        console.error('Error checking watchlist:', err);
      }
    };
    checkIsInList();
  }, [user, id]);

  const handleToggleList = async () => {
    if (!user || !movie) return;
    try {
      if (isInList) {
        const { error } = await supabase
          .from('watchlist')
          .delete()
          .eq('user_id', user.id)
          .eq('movie_id', movie.id);
        if (error) throw error;
        setIsInList(false);
      } else {
        const { error } = await supabase
          .from('watchlist')
          .insert([{
            user_id: user.id,
            movie_id: movie.id,
            movie_data: {
              id: movie.id,
              title: movie.title,
              poster_path: movie.poster_path,
              backdrop_path: movie.backdrop_path,
              vote_average: movie.vote_average,
              release_date: movie.release_date,
              overview: movie.overview
            }
          }]);
        if (error) throw error;
        setIsInList(true);
      }
    } catch (err) {
      console.error('Error toggling watchlist:', err);
    }
  };

  if (loading) return <Loader />;
  if (!movie) {
    return (
      <div className="movie-details__error">
        <Navbar />
        <div className="movie-details__error-content">
          <h2>Movie not found</h2>
          <button onClick={() => navigate('/')} className="movie-details__back-btn">Go Home</button>
        </div>
      </div>
    );
  }

  const trailerKey = getTrailerKey(movie.videos);
  const formatRuntime = (min) => { if (!min) return 'N/A'; return `${Math.floor(min / 60)}h ${min % 60}m`; };

  return (
    <div className="movie-details" id="movie-details-page">
      <Navbar />
      <div className="movie-details__backdrop" style={{ backgroundImage: `url(${getBackdropUrl(movie.backdrop_path)})` }}>
        <div className="movie-details__backdrop-overlay" />
      </div>
      <div className="movie-details__content fade-in-up">
        <button className="movie-details__back" onClick={() => navigate(-1)}>← Back</button>
        <div className="movie-details__main">
          <div className="movie-details__poster-wrapper">
            <img src={getImageUrl(movie.poster_path, 'w500')} alt={movie.title} className="movie-details__poster" onError={(e) => { e.target.style.display = 'none'; }} />
          </div>
          <div className="movie-details__info">
            <h1 className="movie-details__title">{movie.title}</h1>
            {movie.tagline && <p className="movie-details__tagline">"{movie.tagline}"</p>}
            <div className="movie-details__meta">
              <span className="movie-details__rating">⭐ {movie.vote_average?.toFixed(1)}/10</span>
              <span className="movie-details__dot">•</span>
              <span>{movie.release_date?.split('-')[0]}</span>
              <span className="movie-details__dot">•</span>
              <span>{formatRuntime(movie.runtime)}</span>
            </div>
            <div className="movie-details__genres">
              {movie.genres?.map((g) => <span key={g.id} className="movie-details__genre-tag">{g.name}</span>)}
            </div>
            <div className="movie-details__overview">
              <h3>Overview</h3>
              <p>{movie.overview || 'No overview available.'}</p>
            </div>
            <div className="movie-details__actions">
              {trailerKey && (
                <button className="movie-details__btn movie-details__btn--play" onClick={() => setShowTrailer(true)}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5v14l11-7z" /></svg> Play Trailer
                </button>
              )}
              <button className={`movie-details__btn movie-details__btn--list ${isInList ? 'movie-details__btn--in-list' : ''}`} onClick={handleToggleList}>
                {isInList ? '✓ In My List' : '+ Add to List'}
              </button>
            </div>
            <div className="movie-details__extra">
              {movie.vote_count > 0 && <p><strong>Votes:</strong> {movie.vote_count?.toLocaleString()}</p>}
              {movie.budget > 0 && <p><strong>Budget:</strong> ${(movie.budget / 1000000).toFixed(0)}M</p>}
              {movie.revenue > 0 && <p><strong>Revenue:</strong> ${(movie.revenue / 1000000).toFixed(0)}M</p>}
            </div>
          </div>
        </div>
      </div>
      {showTrailer && trailerKey && (
        <div className="movie-details__trailer-modal">
          <div className="movie-details__trailer-backdrop" onClick={() => setShowTrailer(false)} />
          <div className="movie-details__trailer-container fade-in">
            <button className="movie-details__trailer-close" onClick={() => setShowTrailer(false)}>✕</button>
            <iframe src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`} title="Trailer" className="movie-details__trailer-iframe" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieDetails;
