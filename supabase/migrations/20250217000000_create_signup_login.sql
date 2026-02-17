-- signup_/_login table (unified auth session/metadata)
-- Table name uses quoted identifier to match spec: signup_/_login

CREATE TABLE IF NOT EXISTS "signup_/_login" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE "signup_/_login" ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "signup_login_read_own" ON "signup_/_login"
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "signup_login_insert_own" ON "signup_/_login"
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "signup_login_update_own" ON "signup_/_login"
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own data
CREATE POLICY "signup_login_delete_own" ON "signup_/_login"
  FOR DELETE USING (auth.uid() = user_id);

-- Optional: updated_at trigger
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS signup_login_updated_at ON "signup_/_login";
CREATE TRIGGER signup_login_updated_at
  BEFORE UPDATE ON "signup_/_login"
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
