-- Create billing_events table for QA automation and admin monitoring
CREATE TABLE IF NOT EXISTS billing_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  event TEXT CHECK (event IN ('activated','failed','rollback','upgrade','cancel')) NOT NULL,
  stripe_subscription_id TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_billing_events_user_id ON billing_events(user_id);
CREATE INDEX IF NOT EXISTS idx_billing_events_recorded_at ON billing_events(recorded_at);

ALTER TABLE billing_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own billing events" ON billing_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view billing events" ON billing_events FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'super_admin'));

