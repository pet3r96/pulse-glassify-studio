-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create 'profiles' table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('super_admin', 'agency', 'subaccount')) DEFAULT 'subaccount' NOT NULL,
  agency_id UUID REFERENCES public.agencies (id) ON DELETE SET NULL,
  onboarding_completed BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create 'agencies' table
CREATE TABLE agencies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  owner_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  ghl_api_key_encrypted TEXT,
  ghl_api_key_valid BOOLEAN DEFAULT FALSE NOT NULL,
  ghl_api_key_last_validated TIMESTAMP WITH TIME ZONE,
  logo_url TEXT,
  favicon_url TEXT,
  base_theme TEXT,
  embedded_mode_enabled BOOLEAN DEFAULT FALSE NOT NULL,
  embedded_token TEXT UNIQUE,
  subscription_id TEXT,
  subscription_status TEXT CHECK (subscription_status IN ('active', 'trial', 'past_due', 'canceled', 'unpaid')),
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create 'themes' table
CREATE TABLE themes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID REFERENCES public.agencies (id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  css_code TEXT,
  js_code TEXT,
  version INTEGER DEFAULT 1 NOT NULL,
  is_published BOOLEAN DEFAULT FALSE NOT NULL,
  is_marketplace_item BOOLEAN DEFAULT FALSE NOT NULL,
  marketplace_price NUMERIC(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create 'theme_deployments' table
CREATE TABLE theme_deployments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  theme_id UUID REFERENCES public.themes (id) ON DELETE CASCADE NOT NULL,
  agency_id UUID REFERENCES public.agencies (id) ON DELETE CASCADE NOT NULL,
  deployed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  rollback_available_until TIMESTAMP WITH TIME ZONE,
  status TEXT CHECK (status IN ('active', 'rolled_back', 'failed')) DEFAULT 'active' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create 'marketplace_items' table
CREATE TABLE marketplace_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  theme_id UUID REFERENCES public.themes (id) ON DELETE CASCADE NOT NULL,
  seller_id UUID REFERENCES public.profiles (id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create 'subscriptions' table (for Stripe integration)
CREATE TABLE subscriptions (
  id TEXT PRIMARY KEY, -- Stripe Subscription ID
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  agency_id UUID REFERENCES public.agencies (id) ON DELETE CASCADE,
  status TEXT NOT NULL, -- e.g., 'active', 'trialing', 'past_due', 'canceled'
  plan_id TEXT NOT NULL,
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create 'support_tickets' table
CREATE TABLE support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID REFERENCES public.agencies (id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT CHECK (status IN ('open', 'in_progress', 'closed', 'pending')) DEFAULT 'open' NOT NULL,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium' NOT NULL,
  assigned_to UUID REFERENCES public.profiles (id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create 'tasks' table
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID REFERENCES public.agencies (id) ON DELETE CASCADE NOT NULL,
  assigned_to UUID REFERENCES public.profiles (id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('todo', 'in_progress', 'completed')) DEFAULT 'todo' NOT NULL,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium' NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE,
  project_id UUID,
  estimated_hours INTEGER,
  actual_hours INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create 'projects' table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID REFERENCES public.agencies (id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('active', 'completed', 'on_hold')) DEFAULT 'active' NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create 'webhooks' table
CREATE TABLE webhooks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID REFERENCES public.agencies (id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  event_type TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create 'analytics_events' table
CREATE TABLE analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID REFERENCES public.agencies (id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create 'activity_log' table
CREATE TABLE activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID REFERENCES public.agencies (id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE theme_deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (TRUE);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- Create RLS Policies for agencies
CREATE POLICY "Agencies are viewable by their members." ON agencies FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.agency_id = agencies.id AND profiles.id = auth.uid()));
CREATE POLICY "Agency owners can insert their agency." ON agencies FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Agency members can update their agency." ON agencies FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.agency_id = agencies.id AND profiles.id = auth.uid()));
CREATE POLICY "Agency owners can delete their agency." ON agencies FOR DELETE USING (auth.uid() = owner_id);

-- Create RLS Policies for themes
CREATE POLICY "Themes are viewable by agency members." ON themes FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.agency_id = themes.agency_id AND profiles.id = auth.uid()));
CREATE POLICY "Agency members can insert themes." ON themes FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.agency_id = themes.agency_id AND profiles.id = auth.uid()));
CREATE POLICY "Agency members can update themes." ON themes FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.agency_id = themes.agency_id AND profiles.id = auth.uid()));
CREATE POLICY "Agency members can delete themes." ON themes FOR DELETE USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.agency_id = themes.agency_id AND profiles.id = auth.uid()));

-- Create RLS Policies for theme_deployments
CREATE POLICY "Deployments are viewable by agency members." ON theme_deployments FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.agency_id = theme_deployments.agency_id AND profiles.id = auth.uid()));
CREATE POLICY "Agency members can insert deployments." ON theme_deployments FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.agency_id = theme_deployments.agency_id AND profiles.id = auth.uid()));
CREATE POLICY "Agency members can update deployments." ON theme_deployments FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.agency_id = theme_deployments.agency_id AND profiles.id = auth.uid()));

-- Create RLS Policies for marketplace_items
CREATE POLICY "Marketplace items are public." ON marketplace_items FOR SELECT USING (TRUE);
CREATE POLICY "Sellers can insert their items." ON marketplace_items FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Sellers can update their items." ON marketplace_items FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "Sellers can delete their items." ON marketplace_items FOR DELETE USING (auth.uid() = seller_id);

-- Create RLS Policies for subscriptions
CREATE POLICY "Subscriptions are viewable by owner." ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Subscriptions can be inserted by auth." ON subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Subscriptions can be updated by owner." ON subscriptions FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS Policies for support_tickets
CREATE POLICY "Tickets are viewable by agency members and assigned staff." ON support_tickets FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.agency_id = support_tickets.agency_id AND profiles.id = auth.uid()) OR auth.uid() = assigned_to);
CREATE POLICY "Agency members can insert tickets." ON support_tickets FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.agency_id = support_tickets.agency_id AND profiles.id = auth.uid()));
CREATE POLICY "Agency members and assigned staff can update tickets." ON support_tickets FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.agency_id = support_tickets.agency_id AND profiles.id = auth.uid()) OR auth.uid() = assigned_to);

-- Create RLS Policies for tasks
CREATE POLICY "Tasks are viewable by agency members and assigned staff." ON tasks FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.agency_id = tasks.agency_id AND profiles.id = auth.uid()) OR auth.uid() = assigned_to);
CREATE POLICY "Agency members can insert tasks." ON tasks FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.agency_id = tasks.agency_id AND profiles.id = auth.uid()));
CREATE POLICY "Agency members and assigned staff can update tasks." ON tasks FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.agency_id = tasks.agency_id AND profiles.id = auth.uid()) OR auth.uid() = assigned_to);

-- Create RLS Policies for projects
CREATE POLICY "Projects are viewable by agency members." ON projects FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.agency_id = projects.agency_id AND profiles.id = auth.uid()));
CREATE POLICY "Agency members can insert projects." ON projects FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.agency_id = projects.agency_id AND profiles.id = auth.uid()));
CREATE POLICY "Agency members can update projects." ON projects FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.agency_id = projects.agency_id AND profiles.id = auth.uid()));
CREATE POLICY "Agency members can delete projects." ON projects FOR DELETE USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.agency_id = projects.agency_id AND profiles.id = auth.uid()));

-- Create RLS Policies for webhooks
CREATE POLICY "Webhooks are viewable by agency members." ON webhooks FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.agency_id = webhooks.agency_id AND profiles.id = auth.uid()));
CREATE POLICY "Agency members can insert webhooks." ON webhooks FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.agency_id = webhooks.agency_id AND profiles.id = auth.uid()));
CREATE POLICY "Agency members can update webhooks." ON webhooks FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.agency_id = webhooks.agency_id AND profiles.id = auth.uid()));
CREATE POLICY "Agency members can delete webhooks." ON webhooks FOR DELETE USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.agency_id = webhooks.agency_id AND profiles.id = auth.uid()));

-- Create RLS Policies for analytics_events
CREATE POLICY "Analytics events are viewable by agency members." ON analytics_events FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.agency_id = analytics_events.agency_id AND profiles.id = auth.uid()));
CREATE POLICY "Agency members can insert analytics events." ON analytics_events FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.agency_id = analytics_events.agency_id AND profiles.id = auth.uid()));

-- Create RLS Policies for activity_log
CREATE POLICY "Activity log is viewable by agency members." ON activity_log FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.agency_id = activity_log.agency_id AND profiles.id = auth.uid()));
CREATE POLICY "Agency members can insert activity log." ON activity_log FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.agency_id = activity_log.agency_id AND profiles.id = auth.uid()));

-- Set up trigger for updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agencies_updated_at
  BEFORE UPDATE ON agencies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_themes_updated_at
  BEFORE UPDATE ON themes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketplace_items_updated_at
  BEFORE UPDATE ON marketplace_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at
  BEFORE UPDATE ON support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_webhooks_updated_at
  BEFORE UPDATE ON webhooks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_profiles_agency_id ON profiles(agency_id);
CREATE INDEX idx_themes_agency_id ON themes(agency_id);
CREATE INDEX idx_theme_deployments_agency_id ON theme_deployments(agency_id);
CREATE INDEX idx_theme_deployments_theme_id ON theme_deployments(theme_id);
CREATE INDEX idx_marketplace_items_seller_id ON marketplace_items(seller_id);
CREATE INDEX idx_marketplace_items_theme_id ON marketplace_items(theme_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_agency_id ON subscriptions(agency_id);
CREATE INDEX idx_support_tickets_agency_id ON support_tickets(agency_id);
CREATE INDEX idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX idx_support_tickets_assigned_to ON support_tickets(assigned_to);
CREATE INDEX idx_tasks_agency_id ON tasks(agency_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_projects_agency_id ON projects(agency_id);
CREATE INDEX idx_webhooks_agency_id ON webhooks(agency_id);
CREATE INDEX idx_analytics_events_agency_id ON analytics_events(agency_id);
CREATE INDEX idx_activity_log_agency_id ON activity_log(agency_id);
CREATE INDEX idx_activity_log_user_id ON activity_log(user_id);