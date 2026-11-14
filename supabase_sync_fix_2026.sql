-- ==============================================================================
-- MYLALA PWA - DATABASE SYNC AND CROSS-DEVICE FIX 2026
-- Script ini memastikan tabel user_weekly_stats dan user_accounts memiliki
-- kebijakan Row Level Security (RLS) yang tepat untuk sinkronisasi antar perangkat.
-- Jalankan di Supabase SQL Editor: https://supabase.com/dashboard/project/rnbdddalidngbigucjqx/sql
-- ==============================================================================

-- 1. Pastikan kolom avatar_url tersedia di user_weekly_stats
ALTER TABLE IF EXISTS public.user_weekly_stats 
    ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 2. Pastikan kebijakan RLS pada user_weekly_stats mengizinkan anon membaca & meng-update data sinkronisasi
ALTER TABLE IF EXISTS public.user_weekly_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all for user_weekly_stats" ON public.user_weekly_stats;
CREATE POLICY "Allow public all for user_weekly_stats" ON public.user_weekly_stats
    FOR ALL USING (true) WITH CHECK (true);

-- 3. Beri izin tabel user_accounts jika digunakan sebagai mirror sekunder
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_accounts') THEN
        ALTER TABLE public.user_accounts ENABLE ROW LEVEL SECURITY;
        GRANT ALL ON public.user_accounts TO anon, authenticated;
        DROP POLICY IF EXISTS "Allow public all for user_accounts" ON public.user_accounts;
        CREATE POLICY "Allow public all for user_accounts" ON public.user_accounts
            FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- 4. Pastikan tabel masuk ke realtime publication
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE user_weekly_stats;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;
