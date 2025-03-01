
// Re-export the supabase client from the integrations directory
import { supabase } from '@/integrations/supabase/client';

export { supabase };

// Add type safety for profiles table
export type Profile = {
  id: string;
  full_name: string | null;
  updated_at: string | null;
};
