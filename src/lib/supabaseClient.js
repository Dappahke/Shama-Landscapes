// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Fetch environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Guard against missing variables
if (!supabaseUrl || !supabaseKey) {
  // This prevents build-time errors and gives a clear message
  throw new Error(
    "Supabase environment variables are missing. " +
    "Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are defined in your .env.local file."
  );
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;