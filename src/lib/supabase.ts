import { createClient } from '@supabase/supabase-js';

// When using Lovable's Supabase integration, the URL and key are automatically injected
declare global {
  interface Window {
    SUPABASE_URL: string;
    SUPABASE_ANON_KEY: string;
  }
}

export const supabase = createClient(
  window.SUPABASE_URL,
  window.SUPABASE_ANON_KEY
);