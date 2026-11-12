import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://rnbdddalidngbigucjqx.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_wYyJKnqNrHdHDQxk-T-v6w_VXzMsMy1';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  DEFAULT_SUPABASE_URL;

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = () => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    !supabaseUrl.includes('your-project-ref') &&
    supabaseUrl.startsWith('https://')
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

if (!isSupabaseConfigured()) {
  console.info(
    'ℹ️ Supabase environment variables not detected or incomplete. Running in offline/mock mode using local storage cache.'
  );
} else {
  console.info('✅ Supabase client successfully initialized with project URL:', supabaseUrl);
}
