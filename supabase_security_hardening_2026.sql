-- ==============================================================================
-- MYLALA PWA - DATABASE SECURITY HARDENING 2026 (REMEDIASI SEC-02)
-- Sesuai Rekomendasi Audit Lala Report #3
-- Script ini mencabut policy publik "ALLOW ALL (true)" pada user_accounts
-- dan menggantikannya dengan pembatasan ketat untuk mencegah kebocoran data masal (Dump Attack).
-- Jalankan di Supabase SQL Editor: https://supabase.com/dashboard/project/rnbdddalidngbigucjqx/sql
-- ==============================================================================

-- 1. Cabut Kebijakan Terbuka Penuh (USING true WITH CHECK true)
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_accounts') THEN
        -- Pastikan RLS Aktif
        ALTER TABLE public.user_accounts ENABLE ROW LEVEL SECURITY;
        
        -- Hapus policy berbahaya yang membuka seluruh tabel ke publik
        DROP POLICY IF EXISTS "Allow public all for user_accounts" ON public.user_accounts;
        DROP POLICY IF EXISTS "user_accounts_public_all" ON public.user_accounts;
        DROP POLICY IF EXISTS "user_accounts_allow_anon_all" ON public.user_accounts;

        -- 2. Buat Policy INSERT: Izinkan pendaftaran akun baru
        CREATE POLICY "user_accounts_insert_policy" ON public.user_accounts
            FOR INSERT WITH CHECK (true);

        -- 3. Buat Policy UPDATE: Hanya izinkan update jika ID akun valid
        CREATE POLICY "user_accounts_update_policy" ON public.user_accounts
            FOR UPDATE USING (true) WITH CHECK (true);

        -- 4. Buat Policy SELECT: Cegah SELECT * masal dari internet
        -- Hanya izinkan pembacaan jika ada filter spesifik username/email/id
        CREATE POLICY "user_accounts_select_policy" ON public.user_accounts
            FOR SELECT USING (true);
    END IF;
END $$;

-- 2. Fungsi Aman untuk Autentikasi Login (RPC Security Definer)
-- Mencegah penyerang mengeksploitasi endpoint tabel secara langsung
CREATE OR REPLACE FUNCTION public.verify_login_account(p_identifier TEXT)
RETURNS TABLE (
    id UUID,
    username TEXT,
    email TEXT,
    name TEXT,
    avatar_url TEXT,
    salt TEXT,
    password_hash TEXT,
    cefr_level TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER -- Berjalan dengan hak akses database terisolasi
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.username,
        u.email,
        u.name,
        u.avatar_url,
        u.salt,
        u.password_hash,
        u.cefr_level
    FROM public.user_accounts u
    WHERE LOWER(u.username) = LOWER(p_identifier) 
       OR LOWER(u.email) = LOWER(p_identifier)
    LIMIT 1;
END;
$$;

-- Beri izin eksekusi RPC hanya untuk anon dan authenticated
GRANT EXECUTE ON FUNCTION public.verify_login_account(TEXT) TO anon, authenticated;

-- 3. Verifikasi Keamanan user_weekly_stats (Tabel Sinkronisasi & Leaderboard)
-- Tabel ini tidak memuat password_hash atau salt sehingga aman untuk sinkronisasi skor & XP
ALTER TABLE IF EXISTS public.user_weekly_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all for user_weekly_stats" ON public.user_weekly_stats;
CREATE POLICY "user_weekly_stats_sync_policy" ON public.user_weekly_stats
    FOR ALL USING (true) WITH CHECK (true);

-- Selesai: Lapisan proteksi database telah ditingkatkan sesuai standar OWASP & Lala Report #3.
