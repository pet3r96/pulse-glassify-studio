-- Create user role enum
CREATE TYPE user_role AS ENUM ('super_admin', 'agency', 'subaccount');

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'agency',
  full_name TEXT,
  agency_id UUID,
  subaccount_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create agencies table
CREATE TABLE agencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  domain TEXT,
  logo_url TEXT,
  api_key TEXT,
  active_theme_id UUID,
  owner_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their agency"
  ON agencies FOR SELECT
  USING (owner_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.agency_id = agencies.id
  ));

CREATE POLICY "Agency owners can update their agency"
  ON agencies FOR UPDATE
  USING (owner_id = auth.uid());

CREATE POLICY "Agency owners can create agencies"
  ON agencies FOR INSERT
  WITH CHECK (owner_id = auth.uid());

-- Create subaccounts table
CREATE TABLE subaccounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
  ghl_location_id TEXT,
  name TEXT NOT NULL,
  api_key TEXT,
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE subaccounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view subaccounts in their agency"
  ON subaccounts FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.agency_id = subaccounts.agency_id
  ));

-- Create themes table
CREATE TABLE themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
  css TEXT,
  js TEXT,
  colors JSONB,
  fonts JSONB,
  animations JSONB,
  layout JSONB,
  visibility TEXT DEFAULT 'private',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE themes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view themes in their agency"
  ON themes FOR SELECT
  USING (
    visibility = 'public' OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.agency_id = themes.agency_id
    )
  );

CREATE POLICY "Agency users can create themes"
  ON themes FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.agency_id = themes.agency_id
  ));

-- Create trigger for profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, role, full_name)
  VALUES (
    NEW.id,
    'agency',
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agencies_updated_at BEFORE UPDATE ON agencies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_themes_updated_at BEFORE UPDATE ON themes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();