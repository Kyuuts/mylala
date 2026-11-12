-- ==============================================================================
-- MYLALA PWA - DATABASE SECURITY LOCKDOWN & RLS REMEDIATION
-- Target: Menutup VULN-01 (Critical), VULN-02 (Critical), VULN-04 (High), VULN-06 (High)
-- Jalankan script ini di Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- ==============================================================================
-- 1. HARDENING TABEL KURIKULUM: modules & flashcards (Menutup VULN-06)
-- Mencegah Defacement & Sabotase Konten Materi oleh Publik
-- ==============================================================================
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public all for modules" ON modules;
DROP POLICY IF EXISTS "Allow public insert for modules" ON modules;
DROP POLICY IF EXISTS "Public read modules" ON modules;

CREATE POLICY "Public read modules" ON modules
    FOR SELECT USING (true);

-- Cabut seluruh izin manipulasi data dari peran anonim
REVOKE INSERT, UPDATE, DELETE ON modules FROM anon, authenticated;

ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public all for flashcards" ON flashcards;
DROP POLICY IF EXISTS "Allow public insert for flashcards" ON flashcards;
DROP POLICY IF EXISTS "Public read flashcards" ON flashcards;

CREATE POLICY "Public read flashcards" ON flashcards
    FOR SELECT USING (true);

REVOKE INSERT, UPDATE, DELETE ON flashcards FROM anon, authenticated;


-- ==============================================================================
-- 2. HARDENING TABEL LEADERBOARD: user_weekly_stats (Menutup VULN-04)
-- Mencegah Injeksi Skor Fiktif (9999999 XP) & Manipulasi Liga
-- ==============================================================================
-- Tambahkan kolom avatar_url jika belum ada
ALTER TABLE user_weekly_stats ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Batasi integritas data: skor XP maksimal 50.000 / minggu & streak maksimal 3650
ALTER TABLE user_weekly_stats DROP CONSTRAINT IF EXISTS check_weekly_xp_range;
ALTER TABLE user_weekly_stats ADD CONSTRAINT check_weekly_xp_range
    CHECK (weekly_xp >= 0 AND weekly_xp <= 50000 AND streak >= 0 AND streak <= 3650);

ALTER TABLE user_weekly_stats ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public all for user_weekly_stats" ON user_weekly_stats;
DROP POLICY IF EXISTS "Public can read leaderboard" ON user_weekly_stats;
DROP POLICY IF EXISTS "Users can only update their own stats" ON user_weekly_stats;

-- Publik diizinkan membaca klasemen mingguan
CREATE POLICY "Public can read leaderboard" ON user_weekly_stats
    FOR SELECT USING (true);

-- Hanya pemilik akun sah (auth.uid) yang boleh memasukkan atau memperbarui skornya
CREATE POLICY "Users can only update their own stats" ON user_weekly_stats
    FOR ALL USING (
        auth.uid() IS NOT NULL AND auth.uid()::text = user_id
    )
    WITH CHECK (
        auth.uid() IS NOT NULL AND auth.uid()::text = user_id
    );


-- ==============================================================================
-- 3. HARDENING TABEL PROGRES BELAJAR: user_progress (Menutup VULN-2.3)
-- Mencegah Perusakan & Reset Algoritma SRS Siswa Lain
-- ==============================================================================
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public insert/update for user_progress" ON user_progress;
DROP POLICY IF EXISTS "Allow public all for user_progress" ON user_progress;
DROP POLICY IF EXISTS "Users can only read own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can only update own progress" ON user_progress;

-- Siswa hanya boleh membaca progres kartu miliknya sendiri
CREATE POLICY "Users can only read own progress" ON user_progress
    FOR SELECT USING (
        auth.uid() IS NOT NULL AND auth.uid()::text = user_id
    );

-- Siswa hanya boleh menyimpan/mengubah hasil latihan miliknya sendiri
CREATE POLICY "Users can only update own progress" ON user_progress
    FOR ALL USING (
        auth.uid() IS NOT NULL AND auth.uid()::text = user_id
    )
    WITH CHECK (
        auth.uid() IS NOT NULL AND auth.uid()::text = user_id
    );


-- ==============================================================================
-- 4. PEMBUATAN TABEL PROFIL RESMI: profiles (Menutup VULN-01 & VULN-02)
-- Menghilangkan Tabel user_accounts Berkredensial Kustom
-- Tabel profiles HANYA memuat data publik, TANPA PASSWORD & TANPA SALT
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'member',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Siapapun boleh membaca username dan avatar (untuk leaderboard & tampilan)
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

-- Hanya pemilik akun yang boleh membuat profil miliknya
CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Hanya pemilik akun yang boleh mengubah nama atau foto profil miliknya
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);


-- ==============================================================================
-- 5. TRIGGER OTOMATIS & FUNGSI LOGIN DENGAN USERNAME
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, name, avatar_url, role)
  VALUES (
    NEW.id,
    lower(coalesce(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))),
    coalesce(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    coalesce(NEW.raw_user_meta_data->>'role', 'member')
  )
  ON CONFLICT (id) DO UPDATE SET
    name = coalesce(EXCLUDED.name, profiles.name),
    username = coalesce(EXCLUDED.username, profiles.username),
    avatar_url = coalesce(EXCLUDED.avatar_url, profiles.avatar_url),
    updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Fungsi RPC Aman untuk Login via Username (Hanya mengembalikan email untuk username spesifik)
CREATE OR REPLACE FUNCTION public.get_email_for_username(target_username TEXT)
RETURNS TEXT AS $$
DECLARE
  matched_email TEXT;
BEGIN
  SELECT u.email INTO matched_email
  FROM auth.users u
  JOIN public.profiles p ON p.id = u.id
  WHERE lower(p.username) = lower(trim(target_username))
  LIMIT 1;

  RETURN matched_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.get_email_for_username(TEXT) TO anon, authenticated;


-- ==============================================================================
-- 6. PENGAMANAN & PENCABUTAN AKSES user_accounts (Menutup VULN-01)
-- Cabut seluruh izin anonim dari tabel user_accounts kustom
-- ==============================================================================
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_accounts') THEN
        ALTER TABLE user_accounts ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Allow public all for user_accounts" ON user_accounts;
        REVOKE ALL ON user_accounts FROM anon;
    END IF;
END $$;

-- Realtime publikasi untuk profiles & user_weekly_stats
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;
