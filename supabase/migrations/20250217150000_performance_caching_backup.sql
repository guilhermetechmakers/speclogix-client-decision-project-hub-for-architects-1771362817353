-- Performance, Caching & Backup: policies and configuration.
-- Table name: performance_caching_backup (valid SQL identifier).
-- Run in Supabase SQL editor or via Supabase CLI.

CREATE TABLE IF NOT EXISTS performance_caching_backup (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE performance_caching_backup ENABLE ROW LEVEL SECURITY;

CREATE POLICY "performance_caching_backup_read_own" ON performance_caching_backup
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "performance_caching_backup_insert_own" ON performance_caching_backup
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "performance_caching_backup_update_own" ON performance_caching_backup
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "performance_caching_backup_delete_own" ON performance_caching_backup
  FOR DELETE USING (auth.uid() = user_id);
