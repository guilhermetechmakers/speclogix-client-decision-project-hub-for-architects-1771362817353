-- Approvals & E-signatures: lightweight e-sign and approval flows with audit trail.
-- Table name per spec: "approvals_&_e-signatures"; using approvals_e_signatures for compatibility.
-- Run in Supabase SQL editor or via Supabase CLI.

CREATE TABLE IF NOT EXISTS approvals_e_signatures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'signed', 'cancelled', 'overdue')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE approvals_e_signatures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "approvals_e_signatures_read_own" ON approvals_e_signatures
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "approvals_e_signatures_insert_own" ON approvals_e_signatures
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "approvals_e_signatures_update_own" ON approvals_e_signatures
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "approvals_e_signatures_delete_own" ON approvals_e_signatures
  FOR DELETE USING (auth.uid() = user_id);

-- Workflow config: signers, e-sign or checkbox, approval order (parallel/sequential)
CREATE TABLE IF NOT EXISTS approval_workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  approval_id UUID NOT NULL REFERENCES approvals_e_signatures(id) ON DELETE CASCADE,
  approval_type TEXT NOT NULL DEFAULT 'e_sign' CHECK (approval_type IN ('e_sign', 'checkbox')),
  approval_order TEXT NOT NULL DEFAULT 'sequential' CHECK (approval_order IN ('parallel', 'sequential')),
  require_signers TEXT[] DEFAULT '{}',
  legal_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE approval_workflows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "approval_workflows_read_own" ON approval_workflows
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM approvals_e_signatures a WHERE a.id = approval_id AND a.user_id = auth.uid())
  );
CREATE POLICY "approval_workflows_insert_own" ON approval_workflows
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM approvals_e_signatures a WHERE a.id = approval_id AND a.user_id = auth.uid())
  );
CREATE POLICY "approval_workflows_update_own" ON approval_workflows
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM approvals_e_signatures a WHERE a.id = approval_id AND a.user_id = auth.uid())
  );
CREATE POLICY "approval_workflows_delete_own" ON approval_workflows
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM approvals_e_signatures a WHERE a.id = approval_id AND a.user_id = auth.uid())
  );

-- Pending items for inbox (reminders, overdue)
CREATE TABLE IF NOT EXISTS approval_pending_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_id UUID NOT NULL REFERENCES approval_workflows(id) ON DELETE CASCADE,
  signer_email TEXT NOT NULL,
  due_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reminder', 'overdue', 'signed')),
  reminder_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE approval_pending_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "approval_pending_items_read_own" ON approval_pending_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM approval_workflows w
      JOIN approvals_e_signatures a ON a.id = w.approval_id
      WHERE w.id = workflow_id AND a.user_id = auth.uid()
    )
  );
CREATE POLICY "approval_pending_items_insert_own" ON approval_pending_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM approval_workflows w
      JOIN approvals_e_signatures a ON a.id = w.approval_id
      WHERE w.id = workflow_id AND a.user_id = auth.uid()
    )
  );
CREATE POLICY "approval_pending_items_update_own" ON approval_pending_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM approval_workflows w
      JOIN approvals_e_signatures a ON a.id = w.approval_id
      WHERE w.id = workflow_id AND a.user_id = auth.uid()
    )
  );
CREATE POLICY "approval_pending_items_delete_own" ON approval_pending_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM approval_workflows w
      JOIN approvals_e_signatures a ON a.id = w.approval_id
      WHERE w.id = workflow_id AND a.user_id = auth.uid()
    )
  );

-- Signed documents archive (signed PDFs and metadata)
CREATE TABLE IF NOT EXISTS signed_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  approval_id UUID NOT NULL REFERENCES approvals_e_signatures(id) ON DELETE CASCADE,
  signer_email TEXT NOT NULL,
  signed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  ip_address TEXT,
  signature_data TEXT,
  document_url TEXT,
  file_name TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE signed_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "signed_documents_read_own" ON signed_documents
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM approvals_e_signatures a WHERE a.id = approval_id AND a.user_id = auth.uid())
  );
CREATE POLICY "signed_documents_insert_own" ON signed_documents
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM approvals_e_signatures a WHERE a.id = approval_id AND a.user_id = auth.uid())
  );
CREATE POLICY "signed_documents_delete_own" ON signed_documents
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM approvals_e_signatures a WHERE a.id = approval_id AND a.user_id = auth.uid())
  );
