# 🍿 NETFLIX CLONE — Premium React + Supabase Streaming Platform

A premium, highly interactive Netflix Clone built from the ground up to deliver a cinematic browsing experience. Powered by **React (Vite)**, **Vanilla CSS** (60+ micro-animations and HSL colors), **Supabase Auth & Database**, and the **TMDB Movie API**.

---

## ✨ Features of the Cinematic Experience

*   **🔒 Secure Supabase Authentication:** Real signup, sign-in, and sign-out flow with protected route guards and automatic session persistence.
*   **🎬 Live TMDB Integration:** Fetches real-time movie backdrops, posters, ratings, overviews, and YouTube trailers.
*   **🚀 Interactive Setup Wizard:** Guided in-app setup allows users to paste their TMDB API Key directly in the UI if it's missing from environment variables.
*   **💖 Live Watchlist (My List):** Synced directly with a Supabase PostgreSQL database using Row-Level Security (RLS) rules.
*   **🔍 Debounced Search:** Expandable search bar with debounced TMDB API requests for instant, performant search suggestions.
*   **🌟 Modern Visual Polish:** Shimmering skeleton loads, cinematic ring spinners, responsive breakpoints (mobile/tablet/desktop), and fluid hover zooms.

---

## 📁 Anatomy of the Codebase (File-by-File Breakdown)

| Folder / File Path | Description | Key Tech / Role |
| :--- | :--- | :--- |
| **`database/`** | **Database Configuration** | SQL setups |
| ├── [database/schema.sql](file:///a:/Netflix%20clone/database/schema.sql) | Watchlist table definition & Row-Level Security (RLS) policies. | PostgreSQL |
| └── [database/auto_confirm_trigger.sql](file:///a:/Netflix%20clone/database/auto_confirm_trigger.sql) | SQL trigger to auto-verify emails at database signup. | PL/pgSQL |
| **`backend/`** | **Backend Server Skeleton** | Node.js |
| ├── [backend/server.js](file:///a:/Netflix%20clone/backend/server.js) | Express.js application server script with a health endpoint. | Node / Express |
| ├── [backend/package.json](file:///a:/Netflix%20clone/backend/package.json) | Backend dependencies (`express`, `cors`, `dotenv`). | NPM config |
| └── [backend/.gitignore](file:///a:/Netflix%20clone/backend/.gitignore) | Git ignore rules for node modules and environment variables. | Git config |
| **`frontend/`** | **React Client Application** | React + Vite |
| ├── [frontend/package.json](file:///a:/Netflix%20clone/frontend/package.json) | Frontend scripts, build pipeline, and dependency package list. | NPM config |
| ├── [frontend/vite.config.js](file:///a:/Netflix%20clone/frontend/vite.config.js) | Vite configuration defining bundler setup. | JavaScript |
| ├── [frontend/eslint.config.js](file:///a:/Netflix%20clone/frontend/eslint.config.js) | Code quality linting rules. | ESLint |
| ├── [frontend/index.html](file:///a:/Netflix%20clone/frontend/index.html) | Root HTML document with SEO meta tags, title, and viewport. | HTML5 |
| ├── [frontend/public/favicon.svg](file:///a:/Netflix%20clone/frontend/public/favicon.svg) | Custom Netflix-red letter "N" browser tab icon. | SVG |
| ├── [frontend/public/icons.svg](file:///a:/Netflix%20clone/frontend/public/icons.svg) | SVG sprite icon library for search, play, and list buttons. | SVG |
| └── **`frontend/src/`** | **Source Code Directory** | JSX / CSS |
|     ├── [src/main.jsx](file:///a:/Netflix%20clone/frontend/src/main.jsx) | Client entry point wrapping the app with Router and Auth. | React DOM |
|     ├── [src/App.jsx](file:///a:/Netflix%20clone/frontend/src/App.jsx) | Root routing router containing protected client routes. | React Router |
|     ├── [src/index.css](file:///a:/Netflix%20clone/frontend/src/index.css) | Global styles, HSL color tokens, and custom animations. | Vanilla CSS |
|     ├── [src/context/AuthContext.jsx](file:///a:/Netflix%20clone/frontend/src/context/AuthContext.jsx) | React Context managing user signup, login, and sessions. | Supabase Auth |
|     ├── [src/services/supabase.js](file:///a:/Netflix%20clone/frontend/src/services/supabase.js) | Initializes client credentials to connect with Supabase. | Supabase SDK |
|     └── [src/services/tmdb.js](file:///a:/Netflix%20clone/frontend/src/services/tmdb.js) | Fetches listings, details, search results, and trailers. | Fetch API |
| **`frontend/src/components/`** | **Reusable Core UI Components** | JSX + CSS |
| ├── [components/Navbar/](file:///a:/Netflix%20clone/frontend/src/components/Navbar) | Dark navigation header that goes solid black on scrolling. | Component |
| ├── [components/Banner/](file:///a:/Netflix%20clone/frontend/src/components/Banner) | Hero banner spotlighting trending movies with auto-rotate. | Component |
| ├── [components/MovieRow/](file:///a:/Netflix%20clone/frontend/src/components/MovieRow) | Horizontal row container for movies with scroll control arrows. | Component |
| ├── [components/MovieCard/](file:///a:/Netflix%20clone/frontend/src/components/MovieCard) | Poster cards displaying movie details, ratings, and list actions. | Component |
| ├── [components/SearchBar/](file:///a:/Netflix%20clone/frontend/src/components/SearchBar) | Expanding search input box with debounced API queries. | Component |
| ├── [components/SetupScreen/](file:///a:/Netflix%20clone/frontend/src/components/SetupScreen) | 3-step setup guide overlay for inputting TMDB API keys. | Component |
| └── [components/Footer/](file:///a:/Netflix%20clone/frontend/src/components/Footer) | Links grid footer mimicking the original Netflix interface. | Component |
| **`frontend/src/pages/`** | **Application Route Views** | JSX + CSS |
| ├── [pages/Home/](file:///a:/Netflix%20clone/frontend/src/pages/Home) | Orchestrates the primary dashboard, loading 6 genre rows. | View |
| ├── [pages/Login/](file:///a:/Netflix%20clone/frontend/src/pages/Login) | Form container validating emails and enabling password toggles. | View |
| ├── [pages/Signup/](file:///a:/Netflix%20clone/frontend/src/pages/Signup) | User registration card with validation checks. | View |
| ├── [pages/MovieDetails/](file:///a:/Netflix%20clone/frontend/src/pages/MovieDetails) | Shows synopses, ratings, budget data, and trailer play. | View |
| └── [pages/MyList/](file:///a:/Netflix%20clone/frontend/src/pages/MyList) | Grid layout displaying watchlist movies fetched from database. | View |

---

## ⚙️ Setting Up Your Home Theater

### 1. Supabase Initialization
1. In your **Supabase Dashboard**, open the **SQL Editor**.
2. Run the queries inside [database/schema.sql](file:///a:/Netflix%20clone/database/schema.sql) to set up the watchlist table and security policies.
3. Turn off **Confirm email** inside **Authentication ➜ Providers ➜ Email** to allow test account creation without requiring verification emails.

### 2. Configure Environment Variables
Open [frontend/.env](file:///a:/Netflix%20clone/frontend/.env) and insert your credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_public_key
VITE_TMDB_API_KEY=your_tmdb_key_here
```

### 3. Install & Run Locally

#### Frontend:
```bash
cd frontend
npm install
npm run dev
```

#### Backend:
```bash
cd backend
npm install
npm run start
```

---

## ☁️ Deploying to Render

### Deploy Frontend (Static Site)
*   **Build Command:** `npm run build`
*   **Publish Directory:** `dist`
*   **Root Directory:** `frontend`
*   **Environment Variables:** Add `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_TMDB_API_KEY`.

### Deploy Backend (Web Service)
*   **Build Command:** `npm install`
*   **Start Command:** `node server.js`
*   **Root Directory:** `backend`
