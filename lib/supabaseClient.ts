
import { createClient } from '@supabase/supabase-js';

// Load Supabase URL and API key from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL and/or key are missing. Please check your .env.local file.");
}

// Create and export the Supabase client instance
export const supabase = createClient(supabaseUrl as string, supabaseAnonKey as string);
