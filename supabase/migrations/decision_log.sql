-- Decision Log (Approvals & E-signature Capture): comparison cards for client choices.
-- Implements task schema: decision_log table + RLS. Extended tables support options,
-- cost impacts, comments, audit timeline, and version history.
-- Run in Supabase SQL editor or via Supabase CLI.

-- Main decision_log table
CREATE TABLE IF NOT EXISTS decision_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  summary TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'changes_requested', 'active')),
  phase TEXT DEFAULT 'design' CHECK (phase IN ('concept', 'design', 'construction', 'closeout', 'other')),
  approver_id UUID,
  approver_email TEXT,
  due_date DATE,
  recommended_option_id UUID,
  selected_option_id UUID,
  signed_at TIMESTAMP WITH TIME ZONE,
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

-- Optional: decision_options (if backend stores options in separate table)
CREATE TABLE IF NOT EXISTS decision_option (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  decision_id UUID NOT NULL REFERENCES decision_log(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  media_urls TEXT[] DEFAULT '{}',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE decision_option ENABLE ROW LEVEL SECURITY;

CREATE POLICY "decision_option_read_via_decision" ON decision_option
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM decision_log d WHERE d.id = decision_id AND d.user_id = auth.uid())
  );
CREATE POLICY "decision_option_insert_via_decision" ON decision_option
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM decision_log d WHERE d.id = decision_id AND d.user_id = auth.uid())
  );
CREATE POLICY "decision_option_update_via_decision" ON decision_option
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM decision_log d WHERE d.id = decision_id AND d.user_id = auth.uid())
  );
CREATE POLICY "decision_option_delete_via_decision" ON decision_option
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM decision_log d WHERE d.id = decision_id AND d.user_id = auth.uid())
  );

-- Optional: cost_impacts (if stored per option)
CREATE TABLE IF NOT EXISTS decision_cost_impact (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  option_id UUID NOT NULL REFERENCES decision_option(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  amount_cents BIGINT NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD'
);

ALTER TABLE decision_cost_impact ENABLE ROW LEVEL SECURITY;

CREATE POLICY "decision_cost_impact_read_via_option" ON decision_cost_impact
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM decision_option o
      JOIN decision_log d ON d.id = o.decision_id
      WHERE o.id = option_id AND d.user_id = auth.uid()
    )
  );
CREATE POLICY "decision_cost_impact_insert_via_option" ON decision_cost_impact
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM decision_option o
      JOIN decision_log d ON d.id = o.decision_id
      WHERE o.id = option_id AND d.user_id = auth.uid()
    )
  );
CREATE POLICY "decision_cost_impact_update_via_option" ON decision_cost_impact
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM decision_option o
      JOIN decision_log d ON d.id = o.decision_id
      WHERE o.id = option_id AND d.user_id = auth.uid()
    )
  );
CREATE POLICY "decision_cost_impact_delete_via_option" ON decision_cost_impact
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM decision_option o
      JOIN decision_log d ON d.id = o.decision_id
      WHERE o.id = option_id AND d.user_id = auth.uid()
    )
  );

-- Optional: comments and audit (if stored in DB)
CREATE TABLE IF NOT EXISTS decision_comment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  decision_id UUID NOT NULL REFERENCES decision_log(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE decision_comment ENABLE ROW LEVEL SECURITY;

CREATE POLICY "decision_comment_read_own_decision" ON decision_comment
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM decision_log d WHERE d.id = decision_id AND d.user_id = auth.uid())
  );
CREATE POLICY "decision_comment_insert_own_decision" ON decision_comment
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM decision_log d WHERE d.id = decision_id AND d.user_id = auth.uid())
  );

CREATE TABLE IF NOT EXISTS decision_audit (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  decision_id UUID NOT NULL REFERENCES decision_log(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE decision_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "decision_audit_read_own_decision" ON decision_audit
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM decision_log d WHERE d.id = decision_id AND d.user_id = auth.uid())
  );
CREATE POLICY "decision_audit_insert_own_decision" ON decision_audit
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM decision_log d WHERE d.id = decision_id AND d.user_id = auth.uid())
  );

-- Optional: version history for VersioningView (chronological versions, diff, export PDF)
CREATE TABLE IF NOT EXISTS decision_version (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  decision_id UUID NOT NULL REFERENCES decision_log(id) ON DELETE CASCADE,
  version_number INT NOT NULL DEFAULT 1,
  snapshot JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE decision_version ENABLE ROW LEVEL SECURITY;

CREATE POLICY "decision_version_read_own_decision" ON decision_version
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM decision_log d WHERE d.id = decision_id AND d.user_id = auth.uid())
  );
CREATE POLICY "decision_version_insert_own_decision" ON decision_version
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM decision_log d WHERE d.id = decision_id AND d.user_id = auth.uid())
  );
