import { createClient } from '@supabase/supabase-js';

// For development, we'll use environment variables if available, otherwise fallback to the window object
const supabaseUrl = 'https://zpxciicizzdyxqqnixra.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpweGNpaWNpenpleXhxcW5peHJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDUwNzc0ODAsImV4cCI6MjAyMDY1MzQ4MH0.vxjjKhXHgNvhO_FUSPEwNL_aKfHVVZJ8lMKk_nHXxbY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Add type safety for profiles table
export type Profile = {
  id: string;
  full_name: string | null;
  updated_at: string | null;
};