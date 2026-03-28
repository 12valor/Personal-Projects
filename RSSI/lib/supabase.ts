import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase' // Use your generated types file

// This creates a single instance of the Supabase client with your custom types
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)