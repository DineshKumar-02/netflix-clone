// ============================================
// Home Page
// ============================================
// Main page after login. Uses Supabase watchlist.

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import supabase from '../../services/supabase';
import requests from '../../services/tmdb';
import Navbar from '../../components/Navbar/Navbar';
import Banner from '../../components/Banner/Banner';
import MovieRow from '../../components/MovieRow/MovieRow';
import Footer from '../../components/Footer/Footer';
import './Home.css';

function Home() {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState([]);

  const fetchWatchlist = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('watchlist')
        .select('*')
        .eq('user_id', user.id);
      if (error) throw error;
      setWatchlist(data || []);
    } catch (err) {
      console.error('Watchlist error:', err);
    }
  }, [user]);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  const handleAddToList = async (movie) => {
    if (!user) return;
    const exists = watchlist.some((item) => item.movie_id === movie.id);
    if (exists) return;
    const newItem = {
      user_id: user.id,
      movie_id: movie.id,
      movie_data: {
        id: movie.id,
        title: movie.title || movie.name,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
        overview: movie.overview,
      }
    };
    try {
      const { data, error } = await supabase
        .from('watchlist')
        .insert([newItem])
        .select();
      if (error) throw error;
      if (data && data[0]) {
        setWatchlist((prev) => [...prev, data[0]]);
      }
    } catch (err) {
      console.error('Error adding to watchlist:', err);
    }
  };

  const handleRemoveFromList = async (movieId) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('user_id', user.id)
        .eq('movie_id', movieId);
      if (error) throw error;
      setWatchlist((prev) => prev.filter((item) => item.movie_id !== movieId));
    } catch (err) {
      console.error('Error removing from watchlist:', err);
    }
  };

  return (
    <div className="home" id="home-page">
      <Navbar />
      <Banner />
      <main className="home__content">
        <MovieRow title="🔥 Trending Now" fetchUrl={requests.fetchTrending} watchlist={watchlist} onAddToList={handleAddToList} onRemoveFromList={handleRemoveFromList} />
        <MovieRow title="⭐ Top Rated" fetchUrl={requests.fetchTopRated} watchlist={watchlist} onAddToList={handleAddToList} onRemoveFromList={handleRemoveFromList} />
        <MovieRow title="💥 Action" fetchUrl={requests.fetchAction} watchlist={watchlist} onAddToList={handleAddToList} onRemoveFromList={handleRemoveFromList} />
        <MovieRow title="😂 Comedy" fetchUrl={requests.fetchComedy} watchlist={watchlist} onAddToList={handleAddToList} onRemoveFromList={handleRemoveFromList} />
        <MovieRow title="👻 Horror" fetchUrl={requests.fetchHorror} watchlist={watchlist} onAddToList={handleAddToList} onRemoveFromList={handleRemoveFromList} />
        <MovieRow title="💕 Romance" fetchUrl={requests.fetchRomance} watchlist={watchlist} onAddToList={handleAddToList} onRemoveFromList={handleRemoveFromList} />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
