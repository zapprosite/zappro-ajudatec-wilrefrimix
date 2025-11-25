import { createClient } from '@supabase/supabase-js';

// Singleton pattern para o client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client para uso no cliente (browser)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper types
export type { User, Session } from '@supabase/supabase-js';
