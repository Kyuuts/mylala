-- ==============================================================================
-- MYLALA - DATABASE SYNC FIX FOR PROFILES & CROSS-DEVICE ACCOUNTS
-- Jalankan script ini di Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. Tambahkan kolom avatar_url ke user_weekly_stats (untuk foto profil di klasemen liga)
ALTER TABLE user_weekly_stats ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 2. Buat tabel user_accounts agar registrasi di HP langsung tersimpan di cloud & bisa login di Laptop
CREATE TABLE IF NOT EXISTS user_accounts (
    id VARCHAR(100) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    salt TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'member',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Buka izin akses Row Level Security (RLS) untuk user_accounts
ALTER TABLE user_accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all for user_accounts" ON user_accounts;
CREATE POLICY "Allow public all for user_accounts" ON user_accounts
    FOR ALL USING (true) WITH CHECK (true);

-- 4. Buka izin akses Row Level Security (RLS) untuk user_weekly_stats
ALTER TABLE user_weekly_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all for user_weekly_stats" ON user_weekly_stats;
CREATE POLICY "Allow public all for user_weekly_stats" ON user_weekly_stats
    FOR ALL USING (true) WITH CHECK (true);

-- 5. Masukkan akun admin default (imam) agar langsung sinkron di semua perangkat
INSERT INTO user_accounts (id, username, email, name, salt, password_hash, role)
VALUES (
    'admin-imam-001',
    'imam',
    'imam@mylala.app',
    'Imam',
    'mylala_admin_salt_2026',
    'd03e6af7680f447830431fc0eff5a9be99d23c9d7c330e8941e748786f6f1369',
    'admin'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    username = EXCLUDED.username;

-- 6. Tambahkan ke publikasi Realtime Supabase (Idempotent)
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE user_accounts;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;
