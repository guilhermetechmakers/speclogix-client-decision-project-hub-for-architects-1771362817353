-- Templates & Workflow Library: reusable project templates (phases, decisions, tasks, roles).
-- Table name: templates_workflow_library (safe identifier; spec referenced "templates_&_workflow_library").
-- Run in Supabase SQL editor or via Supabase CLI.

CREATE TABLE IF NOT EXISTS templates_workflow_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'draft')),
  version INT DEFAULT 1,
  shared_with_firm BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add optional columns if table was created by an earlier migration
ALTER TABLE templates_workflow_library ADD COLUMN IF NOT EXISTS version INT DEFAULT 1;
ALTER TABLE templates_workflow_library ADD COLUMN IF NOT EXISTS shared_with_firm BOOLEAN DEFAULT FALSE;

-- Keep updated_at in sync
CREATE OR REPLACE FUNCTION set_templates_workflow_library_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS templates_workflow_library_updated_at ON templates_workflow_library;
CREATE TRIGGER templates_workflow_library_updated_at
  BEFORE UPDATE ON templates_workflow_library
  FOR EACH ROW EXECUTE PROCEDURE set_templates_workflow_library_updated_at();

-- Enable RLS
ALTER TABLE templates_workflow_library ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "templates_workflow_library_read_own" ON templates_workflow_library
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "templates_workflow_library_insert_own" ON templates_workflow_library
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "templates_workflow_library_update_own" ON templates_workflow_library
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own data
CREATE POLICY "templates_workflow_library_delete_own" ON templates_workflow_library
  FOR DELETE USING (auth.uid() = user_id);

-- Optional: template_phases (for editor)
CREATE TABLE IF NOT EXISTS template_phases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id UUID NOT NULL REFERENCES templates_workflow_library(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE template_phases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "template_phases_read_own" ON template_phases
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM templates_workflow_library t WHERE t.id = template_id AND t.user_id = auth.uid())
  );
CREATE POLICY "template_phases_insert_own" ON template_phases
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM templates_workflow_library t WHERE t.id = template_id AND t.user_id = auth.uid())
  );
CREATE POLICY "template_phases_update_own" ON template_phases
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM templates_workflow_library t WHERE t.id = template_id AND t.user_id = auth.uid())
  );
CREATE POLICY "template_phases_delete_own" ON template_phases
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM templates_workflow_library t WHERE t.id = template_id AND t.user_id = auth.uid())
  );

-- Index for list by user
CREATE INDEX IF NOT EXISTS idx_templates_workflow_library_user_id ON templates_workflow_library(user_id);
CREATE INDEX IF NOT EXISTS idx_template_phases_template_id ON template_phases(template_id);
