-- Meetings & Agendas: meeting list, agenda builder, invite/calendar, minutes and action items.
-- Table name per spec: "meetings_&_agendas" (quoted); using meetings_agendas for compatibility.
-- Run in Supabase SQL editor or via Supabase CLI.

CREATE TABLE IF NOT EXISTS meetings_agendas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'scheduled', 'completed', 'cancelled', 'active')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE meetings_agendas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "meetings_agendas_read_own" ON meetings_agendas
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "meetings_agendas_insert_own" ON meetings_agendas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "meetings_agendas_update_own" ON meetings_agendas
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "meetings_agendas_delete_own" ON meetings_agendas
  FOR DELETE USING (auth.uid() = user_id);

-- Agenda items: topics, owners, time allocation, linked decision/file attachments
CREATE TABLE IF NOT EXISTS meetings_agenda_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID NOT NULL REFERENCES meetings_agendas(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  owner_id UUID,
  duration_minutes INT,
  sort_order INT NOT NULL DEFAULT 0,
  linked_decision_id UUID,
  linked_file_ids TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE meetings_agenda_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "meetings_agenda_items_read" ON meetings_agenda_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM meetings_agendas m WHERE m.id = meeting_id AND m.user_id = auth.uid())
  );
CREATE POLICY "meetings_agenda_items_insert" ON meetings_agenda_items
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM meetings_agendas m WHERE m.id = meeting_id AND m.user_id = auth.uid())
  );
CREATE POLICY "meetings_agenda_items_update" ON meetings_agenda_items
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM meetings_agendas m WHERE m.id = meeting_id AND m.user_id = auth.uid())
  );
CREATE POLICY "meetings_agenda_items_delete" ON meetings_agenda_items
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM meetings_agendas m WHERE m.id = meeting_id AND m.user_id = auth.uid())
  );

-- Attendees
CREATE TABLE IF NOT EXISTS meetings_attendees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID NOT NULL REFERENCES meetings_agendas(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  role TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE meetings_attendees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "meetings_attendees_read" ON meetings_attendees
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM meetings_agendas m WHERE m.id = meeting_id AND m.user_id = auth.uid())
  );
CREATE POLICY "meetings_attendees_insert" ON meetings_attendees
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM meetings_agendas m WHERE m.id = meeting_id AND m.user_id = auth.uid())
  );
CREATE POLICY "meetings_attendees_update" ON meetings_attendees
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM meetings_agendas m WHERE m.id = meeting_id AND m.user_id = auth.uid())
  );
CREATE POLICY "meetings_attendees_delete" ON meetings_attendees
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM meetings_agendas m WHERE m.id = meeting_id AND m.user_id = auth.uid())
  );

-- Action items (from minutes), can be converted to tasks/decisions
CREATE TABLE IF NOT EXISTS meetings_action_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID NOT NULL REFERENCES meetings_agendas(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  assignee_id UUID,
  due_date DATE,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'done')),
  converted_to_task_id UUID,
  converted_to_decision_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE meetings_action_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "meetings_action_items_read" ON meetings_action_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM meetings_agendas m WHERE m.id = meeting_id AND m.user_id = auth.uid())
  );
CREATE POLICY "meetings_action_items_insert" ON meetings_action_items
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM meetings_agendas m WHERE m.id = meeting_id AND m.user_id = auth.uid())
  );
CREATE POLICY "meetings_action_items_update" ON meetings_action_items
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM meetings_agendas m WHERE m.id = meeting_id AND m.user_id = auth.uid())
  );
CREATE POLICY "meetings_action_items_delete" ON meetings_action_items
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM meetings_agendas m WHERE m.id = meeting_id AND m.user_id = auth.uid())
  );

-- Meeting notes (minutes)
CREATE TABLE IF NOT EXISTS meetings_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID NOT NULL REFERENCES meetings_agendas(id) ON DELETE CASCADE,
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(meeting_id)
);

ALTER TABLE meetings_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "meetings_notes_read" ON meetings_notes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM meetings_agendas m WHERE m.id = meeting_id AND m.user_id = auth.uid())
  );
CREATE POLICY "meetings_notes_insert" ON meetings_notes
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM meetings_agendas m WHERE m.id = meeting_id AND m.user_id = auth.uid())
  );
CREATE POLICY "meetings_notes_update" ON meetings_notes
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM meetings_agendas m WHERE m.id = meeting_id AND m.user_id = auth.uid())
  );
CREATE POLICY "meetings_notes_delete" ON meetings_notes
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM meetings_agendas m WHERE m.id = meeting_id AND m.user_id = auth.uid())
  );
