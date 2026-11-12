import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://rnbdddalidngbigucjqx.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_wYyJKnqNrHdHDQxk-T-v6w_VXzMsMy1';

// Robust validator: rejects empty strings, placeholder variable names (e.g. 'VITE_SUPABASE_URL'), and invalid schemes
const isValidUrl = (url) => {
  return (
    typeof url === 'string' &&
    url.startsWith('https://') &&
    !url.includes('your-project-ref') &&
    !url.includes('VITE_')
  );
};

const isValidKey = (key) => {
  return (
    typeof key === 'string' &&
    key.length > 20 &&
    !key.includes('VITE_')
  );
};

const envUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL;

const envKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const supabaseUrl = isValidUrl(envUrl) ? envUrl : DEFAULT_SUPABASE_URL;
const supabaseAnonKey = isValidKey(envKey) ? envKey : DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = () => {
  return isValidUrl(supabaseUrl) && isValidKey(supabaseAnonKey);
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
