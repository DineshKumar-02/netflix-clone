// ============================================
// App — Root Component with Routing
// ============================================
// Handles all page routing with protected routes.
// Shows SetupScreen if TMDB API key is not configured.
// Authenticated users see Home, MyList, MovieDetails.
// Unauthenticated users see Login/Signup.

import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { hasValidApiKey } from './services/tmdb';
import Loader from './components/Loader/Loader';
import SetupScreen from './components/SetupScreen/SetupScreen';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Home from './pages/Home/Home';
import MovieDetails from './pages/MovieDetails/MovieDetails';
import MyList from './pages/MyList/MyList';

function App() {
  const { user, loading } = useAuth();
  // Track if API key is configured (can change at runtime)
  const [apiKeyReady, setApiKeyReady] = useState(hasValidApiKey());

  // Show loader while checking auth state
  if (loading) return <Loader />;

  // Show setup screen if TMDB API key is missing
  if (!apiKeyReady) {
    return (
      <SetupScreen
        onComplete={() => setApiKeyReady(true)}
      />
    );
  }

  return (
    <Routes>
      {/* Public Routes — redirect to home if already logged in */}
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/signup"
        element={user ? <Navigate to="/" replace /> : <Signup />}
      />

      {/* Protected Routes — redirect to login if not authenticated */}
      <Route
        path="/"
        element={user ? <Home /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/movie/:id"
        element={user ? <MovieDetails /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/my-list"
        element={user ? <MyList /> : <Navigate to="/login" replace />}
      />

      {/* Catch-all — redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
