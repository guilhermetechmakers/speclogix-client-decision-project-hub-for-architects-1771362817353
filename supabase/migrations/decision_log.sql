-- decision_log table for Client Portal decision tracking
-- Run this migration in Supabase SQL editor or via Supabase CLI

CREATE TABLE IF NOT EXISTS decision_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE decision_log ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "decision_log_read_own" ON decision_log
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "decision_log_insert_own" ON decision_log
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "decision_log_update_own" ON decision_log
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own data
CREATE POLICY "decision_log_delete_own" ON decision_log
  FOR DELETE USING (auth.uid() = user_id);
