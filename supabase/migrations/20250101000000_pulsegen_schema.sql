-- PulseGen Studio Database Schema
-- Complete database structure for the platform

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_role AS ENUM ('super_admin', 'agency', 'subaccount');
CREATE TYPE subscription_status AS ENUM ('active', 'trial', 'past_due', 'canceled', 'unpaid');
CREATE TYPE theme_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'completed', 'cancelled');

-- Agencies table
CREATE TABLE agencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ghl_api_key_encrypted TEXT,
  ghl_api_key_valid BOOLEAN DEFAULT FALSE,
  ghl_api_key_last_validated TIMESTAMP WITH TIME ZONE,
  logo_url TEXT,
  favicon_url TEXT,
  base_theme TEXT DEFAULT 'dark',
  embedded_mode_enabled BOOLEAN DEFAULT FALSE,
  embedded_token TEXT UNIQUE,
  subscription_id TEXT,
  subscription_status subscription_status DEFAULT 'trial',
  trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '14 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'agency',
  agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subaccounts table
CREATE TABLE subaccounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  ghl_location_id TEXT,
  ghl_api_key_encrypted TEXT,
  ghl_api_key_valid BOOLEAN DEFAULT FALSE,
  theme_id UUID,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Themes table
CREATE TABLE themes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  css_content TEXT,
  js_content TEXT,
  status theme_status DEFAULT 'draft',
  is_public BOOLEAN DEFAULT FALSE,
  version INTEGER DEFAULT 1,
  parent_theme_id UUID REFERENCES themes(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Theme deployments table
CREATE TABLE theme_deployments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  theme_id UUID REFERENCES themes(id) ON DELETE CASCADE,
  agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
  subaccount_id UUID REFERENCES subaccounts(id) ON DELETE CASCADE,
  deployed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  rollback_available_until TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '48 hours'),
  deployment_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketplace items table
CREATE TABLE marketplace_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- 'theme', 'component', 'template'
  price_cents INTEGER DEFAULT 0,
  preview_url TEXT,
  download_url TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  download_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Support tickets table
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
  subaccount_id UUID REFERENCES subaccounts(id),
  title TEXT NOT NULL,
  description TEXT,
  status ticket_status DEFAULT 'open',
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  assigned_to UUID REFERENCES profiles(id),
  created_by UUID REFERENCES profiles(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
  subaccount_id UUID REFERENCES subaccounts(id),
  title TEXT NOT NULL,
  description TEXT,
  status task_status DEFAULT 'todo',
  priority TEXT DEFAULT 'medium',
  assigned_to UUID REFERENCES profiles(id),
  created_by UUID REFERENCES profiles(id),
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Webhooks table
CREATE TABLE webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  events TEXT[] NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  secret_key TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics table
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
  subaccount_id UUID REFERENCES subaccounts(id),
  event_type TEXT NOT NULL,
  event_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_agencies_owner_id ON agencies(owner_id);
CREATE INDEX idx_profiles_agency_id ON profiles(agency_id);
CREATE INDEX idx_subaccounts_agency_id ON subaccounts(agency_id);
CREATE INDEX idx_themes_agency_id ON themes(agency_id);
CREATE INDEX idx_theme_deployments_theme_id ON theme_deployments(theme_id);
CREATE INDEX idx_theme_deployments_agency_id ON theme_deployments(agency_id);
CREATE INDEX idx_support_tickets_agency_id ON support_tickets(agency_id);
CREATE INDEX idx_tasks_agency_id ON tasks(agency_id);
CREATE INDEX idx_analytics_agency_id ON analytics(agency_id);
CREATE INDEX idx_analytics_created_at ON analytics(created_at);

-- Row Level Security (RLS) policies
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subaccounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE theme_deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Agency policies
CREATE POLICY "Users can view their own agency" ON agencies
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can update their own agency" ON agencies
  FOR UPDATE USING (auth.uid() = owner_id);

-- Profile policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Subaccount policies
CREATE POLICY "Agency members can view subaccounts" ON subaccounts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.agency_id = subaccounts.agency_id
    )
  );

CREATE POLICY "Agency members can manage subaccounts" ON subaccounts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.agency_id = subaccounts.agency_id
    )
  );

-- Theme policies
CREATE POLICY "Agency members can view themes" ON themes
  FOR SELECT USING (
    is_public = true OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.agency_id = themes.agency_id
    )
  );

CREATE POLICY "Agency members can manage themes" ON themes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.agency_id = themes.agency_id
    )
  );

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_agencies_updated_at BEFORE UPDATE ON agencies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subaccounts_updated_at BEFORE UPDATE ON subaccounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_themes_updated_at BEFORE UPDATE ON themes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketplace_items_updated_at BEFORE UPDATE ON marketplace_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_webhooks_updated_at BEFORE UPDATE ON webhooks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
