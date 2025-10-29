-- Create billing_events table for QA and monitoring
CREATE TABLE IF NOT EXISTS billing_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  event TEXT CHECK (event IN ('activated','failed','rollback','upgrade','cancel')) NOT NULL,
  stripe_subscription_id TEXT,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_billing_events_user_id ON billing_events(user_id);
CREATE INDEX IF NOT EXISTS idx_billing_events_recorded_at ON billing_events(recorded_at);

ALTER TABLE billing_events ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own billing events; admins can have a separate policy/group
CREATE POLICY "Users can view their own billing events" ON billing_events FOR SELECT USING (auth.uid() = user_id);


