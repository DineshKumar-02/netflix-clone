// ============================================
// TMDB API Service
// ============================================
// Handles all movie data fetching from The Movie Database API.
// Supports runtime API key configuration via localStorage
// so users don't need to edit .env files.

const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p';

// ----- API Key Management -----
// Priority: localStorage > .env variable
export function getApiKey() {
  return localStorage.getItem('tmdb_api_key') || import.meta.env.VITE_TMDB_API_KEY || '';
}

export function setApiKey(key) {
  localStorage.setItem('tmdb_api_key', key);
}

export function hasValidApiKey() {
  const key = getApiKey();
  return key && key !== '' && key !== 'YOUR_TMDB_API_KEY_HERE';
}

// ----- Image URL Helpers -----
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return null;
  return `${IMG_BASE}/${size}${path}`;
};

export const getBackdropUrl = (path) => {
  if (!path) return null;
  return `${IMG_BASE}/original${path}`;
};

// ----- API Endpoint URLs (dynamic — uses current key) -----
function getRequests() {
  const API_KEY = getApiKey();
  return {
    fetchTrending: `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`,
    fetchTopRated: `${BASE_URL}/movie/top_rated?api_key=${API_KEY}`,
    fetchAction: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=28`,
    fetchComedy: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=35`,
    fetchHorror: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=27`,
    fetchRomance: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=10749`,
    fetchDocumentaries: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=99`,
  };
}

// Export as a getter so it always uses the current key
const requests = new Proxy({}, {
  get(_, prop) {
    return getRequests()[prop];
  }
});

export default requests;

// ----- Fetch Functions -----

/**
 * Fetch movies from a given TMDB endpoint URL
 */
export async function fetchMovies(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch movies');
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('TMDB fetch error:', error);
    return [];
  }
}

/**
 * Search movies by query string
 */
export async function searchMovies(query) {
  if (!query || query.trim() === '') return [];
  try {
    const API_KEY = getApiKey();
    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Search failed');
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('TMDB search error:', error);
    return [];
  }
}

/**
 * Get full movie details by movie ID
 */
export async function getMovieDetails(movieId) {
  try {
    const API_KEY = getApiKey();
    const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos,credits`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch movie details');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('TMDB details error:', error);
    return null;
  }
}

/**
 * Get movie trailer key (YouTube)
 */
export function getTrailerKey(videos) {
  if (!videos || !videos.results) return null;
  const trailer = videos.results.find(
    (vid) => vid.type === 'Trailer' && vid.site === 'YouTube'
  );
  return trailer ? trailer.key : (videos.results[0]?.key || null);
}

/**
 * Validate an API key by making a test request
 */
export async function validateApiKey(key) {
  try {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${key}&page=1`);
    return response.ok;
  } catch {
    return false;
  }
}
