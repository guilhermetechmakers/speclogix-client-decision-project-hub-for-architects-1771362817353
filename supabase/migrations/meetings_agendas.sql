-- Meetings & Agendas: meeting records for agendas, invite sync, minutes, action items.
-- Run in Supabase SQL editor or via Supabase CLI.
-- Table name is quoted because it contains "&".

CREATE TABLE IF NOT EXISTS "meetings_&_agendas" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'scheduled', 'completed', 'cancelled', 'active')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  location TEXT,
  timezone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE "meetings_&_agendas" ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "meetings_agendas_read_own" ON "meetings_&_agendas"
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "meetings_agendas_insert_own" ON "meetings_&_agendas"
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "meetings_agendas_update_own" ON "meetings_&_agendas"
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own data
CREATE POLICY "meetings_agendas_delete_own" ON "meetings_&_agendas"
  FOR DELETE USING (auth.uid() = user_id);
