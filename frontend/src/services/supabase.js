// ============================================
// Supabase Client Configuration
// ============================================
// Creates and exports the Supabase client instance
// used across the app for authentication and database.

import { createClient } from '@supabase/supabase-js';

// Read environment variables from .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create the Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
