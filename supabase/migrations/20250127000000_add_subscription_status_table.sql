-- Create subscription_status table for Stripe integration
CREATE TABLE IF NOT EXISTS subscription_status (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  status TEXT CHECK (status IN ('active', 'trialing', 'past_due', 'canceled', 'inactive')) DEFAULT 'inactive' NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_price_id TEXT,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Add stripe_customer_id to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscription_status_user_id ON subscription_status(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_status_stripe_customer_id ON subscription_status(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscription_status_stripe_subscription_id ON subscription_status(stripe_subscription_id);

-- Enable RLS
ALTER TABLE subscription_status ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for subscription_status
CREATE POLICY "Users can view their own subscription status" ON subscription_status FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own subscription status" ON subscription_status FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own subscription status" ON subscription_status FOR UPDATE USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_subscription_status_updated_at
  BEFORE UPDATE ON subscription_status
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
