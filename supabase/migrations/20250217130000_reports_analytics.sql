-- Reports & Analytics: saved reports, dashboard stats, alerting, scheduled exports.
-- Table name per spec: "reports_&_analytics"; using reports_analytics for compatibility.
-- Run in Supabase SQL editor or via Supabase CLI.

CREATE TABLE IF NOT EXISTS reports_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE reports_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reports_analytics_read_own" ON reports_analytics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "reports_analytics_insert_own" ON reports_analytics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "reports_analytics_update_own" ON reports_analytics
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "reports_analytics_delete_own" ON reports_analytics
  FOR DELETE USING (auth.uid() = user_id);
