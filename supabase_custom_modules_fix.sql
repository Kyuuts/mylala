-- ==============================================================================
-- MYLALA PWA - RLS FIX FOR CUSTOM MODULES & FLASHCARDS (BUG-06 REMEDIATION)
-- Mengizinkan pembuatan modul & kartu kustom oleh siswa terautentikasi
-- sekaligus melindungi integritas kurikulum materi bawaan (Master Curriculum)
-- Jalankan skrip ini di Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. Pastikan kolom kepemilikan dan penanda kustom tersedia
ALTER TABLE modules ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE modules ADD COLUMN IF NOT EXISTS is_custom BOOLEAN DEFAULT false;

ALTER TABLE flashcards ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE flashcards ADD COLUMN IF NOT EXISTS is_custom BOOLEAN DEFAULT false;

-- 2. Berikan hak akses tabel ke authenticated & anon
GRANT SELECT, INSERT, UPDATE, DELETE ON modules TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON flashcards TO authenticated;
GRANT SELECT ON modules TO anon;
GRANT SELECT ON flashcards TO anon;

-- 3. Kebijakan Row Level Security (RLS) untuk tabel 'modules'
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;

-- Publik & seluruh siswa dapat membaca kurikulum materi dan modul kustom
DROP POLICY IF EXISTS "Public read modules" ON modules;
CREATE POLICY "Public read modules" ON modules
    FOR SELECT USING (true);

-- Siswa terautentikasi dapat membuat modul kustom miliknya
DROP POLICY IF EXISTS "Users can insert own modules" ON modules;
CREATE POLICY "Users can insert own modules" ON modules
    FOR INSERT
    WITH CHECK (
        auth.uid() IS NOT NULL AND (user_id = auth.uid()::text OR user_id IS NULL)
    );

-- Siswa HANYA dapat mengubah modul miliknya (Kurikulum master user_id IS NULL aman dari modifikasi)
DROP POLICY IF EXISTS "Users can update own modules" ON modules;
CREATE POLICY "Users can update own modules" ON modules
    FOR UPDATE
    USING (
        auth.uid() IS NOT NULL AND user_id = auth.uid()::text
    )
    WITH CHECK (
        auth.uid() IS NOT NULL AND user_id = auth.uid()::text
    );

-- Siswa HANYA dapat menghapus modul buatannya sendiri
DROP POLICY IF EXISTS "Users can delete own modules" ON modules;
CREATE POLICY "Users can delete own modules" ON modules
    FOR DELETE
    USING (
        auth.uid() IS NOT NULL AND user_id = auth.uid()::text
    );

-- 4. Kebijakan Row Level Security (RLS) untuk tabel 'flashcards'
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;

-- Publik & seluruh siswa dapat membaca kartu flashcards
DROP POLICY IF EXISTS "Public read flashcards" ON flashcards;
CREATE POLICY "Public read flashcards" ON flashcards
    FOR SELECT USING (true);

-- Siswa terautentikasi dapat menambahkan kartu baru
DROP POLICY IF EXISTS "Users can insert own flashcards" ON flashcards;
CREATE POLICY "Users can insert own flashcards" ON flashcards
    FOR INSERT
    WITH CHECK (
        auth.uid() IS NOT NULL
    );

-- Siswa HANYA dapat mengubah kartu miliknya
DROP POLICY IF EXISTS "Users can update own flashcards" ON flashcards;
CREATE POLICY "Users can update own flashcards" ON flashcards
    FOR UPDATE
    USING (
        auth.uid() IS NOT NULL AND user_id = auth.uid()::text
    )
    WITH CHECK (
        auth.uid() IS NOT NULL AND user_id = auth.uid()::text
    );

-- Siswa HANYA dapat menghapus kartu buatannya sendiri
DROP POLICY IF EXISTS "Users can delete own flashcards" ON flashcards;
CREATE POLICY "Users can delete own flashcards" ON flashcards
    FOR DELETE
    USING (
        auth.uid() IS NOT NULL AND user_id = auth.uid()::text
    );
