-- ============================================================
-- Supabase Database Schema: Watchlist Table
-- ============================================================
-- This script sets up the `watchlist` table and configures
-- Row Level Security (RLS) to ensure users can only access 
-- their own data.

-- 1. Create the Watchlist Table
CREATE TABLE watchlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  movie_id INTEGER NOT NULL,
  movie_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable Row Level Security (RLS)
-- This is critical to prevent unauthorized access to other users' watchlists.
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;

-- 3. Define Security Policies (RLS Rules)

-- Policy: Allow users to view ONLY their own watchlist records
CREATE POLICY "Users can view own watchlist"
  ON watchlist FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Allow users to insert records ONLY for themselves
CREATE POLICY "Users can insert own watchlist"
  ON watchlist FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Allow users to delete ONLY their own watchlist records
CREATE POLICY "Users can delete own watchlist"
  ON watchlist FOR DELETE
  USING (auth.uid() = user_id);

-- 4. Unique Constraint
-- Prevent duplicate entries of the same movie for the same user
CREATE UNIQUE INDEX watchlist_user_movie_unique
  ON watchlist (user_id, movie_id);
