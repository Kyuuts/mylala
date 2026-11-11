-- ==============================================================================
-- MYLALA - REALTIME WEEKLY LEADERBOARD TABLE & PERMISSIONS
-- Run this script in the Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. Create 'user_weekly_stats' table
CREATE TABLE IF NOT EXISTS user_weekly_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    year_week VARCHAR(20) NOT NULL, -- e.g., '2026-W46'
    weekly_xp INT NOT NULL DEFAULT 0,
    cards_reviewed INT NOT NULL DEFAULT 0,
    streak INT NOT NULL DEFAULT 1,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_week UNIQUE (user_id, year_week)
);

-- 2. Index for instant leaderboard sorting
CREATE INDEX IF NOT EXISTS idx_weekly_stats_rank ON user_weekly_stats(year_week, weekly_xp DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE user_weekly_stats ENABLE ROW LEVEL SECURITY;

-- 4. Set RLS Policies (Allow everyone to view & update their score)
DROP POLICY IF EXISTS "Allow public read for user_weekly_stats" ON user_weekly_stats;
CREATE POLICY "Allow public read for user_weekly_stats" ON user_weekly_stats
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert/update for user_weekly_stats" ON user_weekly_stats;
CREATE POLICY "Allow public insert/update for user_weekly_stats" ON user_weekly_stats
    FOR ALL USING (true) WITH CHECK (true);

-- 5. Enable Realtime Replication
ALTER PUBLICATION supabase_realtime ADD TABLE user_weekly_stats;

-- 6. Clean reset: remove any test/dummy rows so leaderboard starts pure from 0
TRUNCATE TABLE user_weekly_stats;
