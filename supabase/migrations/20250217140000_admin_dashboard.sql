-- Admin Dashboard: firm-level admin records.
-- Run in Supabase SQL editor or via Supabase CLI.

CREATE TABLE IF NOT EXISTS admin_dashboard (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE admin_dashboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_dashboard_read_own" ON admin_dashboard
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "admin_dashboard_insert_own" ON admin_dashboard
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "admin_dashboard_update_own" ON admin_dashboard
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "admin_dashboard_delete_own" ON admin_dashboard
  FOR DELETE USING (auth.uid() = user_id);
