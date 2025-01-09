import { createClient } from '@supabase/supabase-js';

// When using Lovable's Supabase integration, the URL and key are automatically injected
declare global {
  interface Window {
    SUPABASE_URL: string;
    SUPABASE_ANON_KEY: string;
  }
}

// Wait for the window object to be populated with Supabase credentials
const getSupabaseClient = () => {
  if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
    console.error('Supabase credentials not found. Please ensure you have connected your Supabase project in the Lovable interface.');
    return null;
  }
  
  return createClient(
    window.SUPABASE_URL,
    window.SUPABASE_ANON_KEY
  );
};

export const supabase = getSupabaseClient();