-- Add onboarding tracking to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Add GHL API key storage to agencies
ALTER TABLE agencies 
ADD COLUMN IF NOT EXISTS ghl_api_key TEXT,
ADD COLUMN IF NOT EXISTS ghl_api_key_valid BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS ghl_api_key_last_validated TIMESTAMPTZ;

-- Add branding assets to agencies
ALTER TABLE agencies 
ADD COLUMN IF NOT EXISTS favicon_url TEXT;

-- Add embedded mode configuration to agencies
ALTER TABLE agencies 
ADD COLUMN IF NOT EXISTS embedded_mode_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS embedded_token TEXT UNIQUE;

-- Add base theme preference to agencies
ALTER TABLE agencies 
ADD COLUMN IF NOT EXISTS base_theme TEXT DEFAULT 'dark' 
CHECK (base_theme IN ('light', 'dark'));

-- Theme versioning for rollback capability
CREATE TABLE IF NOT EXISTS theme_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_id UUID REFERENCES themes(id) ON DELETE CASCADE NOT NULL,
  version_number INTEGER NOT NULL,
  colors JSONB NOT NULL,
  fonts JSONB,
  css TEXT,
  js TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(theme_id, version_number)
);

-- Deployment tracking with scheduling & rollback chain
CREATE TABLE IF NOT EXISTS theme_deployments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_id UUID REFERENCES themes(id) ON DELETE CASCADE NOT NULL,
  theme_version_id UUID REFERENCES theme_versions(id),
  agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE NOT NULL,
  subaccount_id UUID REFERENCES subaccounts(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'active', 'failed', 'rolled_back')),
  scheduled_for TIMESTAMPTZ,
  deployed_at TIMESTAMPTZ,
  deployed_by UUID REFERENCES auth.users(id),
  rollback_from_deployment_id UUID REFERENCES theme_deployments(id),
  deployment_code TEXT NOT NULL,
  license_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Subaccount-specific theme overrides
CREATE TABLE IF NOT EXISTS subaccount_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subaccount_id UUID REFERENCES subaccounts(id) ON DELETE CASCADE NOT NULL UNIQUE,
  theme_id UUID REFERENCES themes(id) ON DELETE SET NULL,
  deployment_id UUID REFERENCES theme_deployments(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Deployment audit trail
CREATE TABLE IF NOT EXISTS deployment_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deployment_id UUID REFERENCES theme_deployments(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('created', 'scheduled', 'deployed', 'failed', 'rolled_back')),
  user_id UUID REFERENCES auth.users(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Plugin configuration tracking
CREATE TABLE IF NOT EXISTS plugin_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE NOT NULL,
  plugin_name TEXT NOT NULL CHECK (plugin_name IN ('project-manager', 'global-search', 'contact-actions')),
  enabled BOOLEAN DEFAULT FALSE,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(agency_id, plugin_name)
);

-- Enable RLS on new tables
ALTER TABLE theme_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE theme_deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subaccount_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE deployment_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE plugin_configs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for theme_versions
CREATE POLICY "Users can view versions of their agency's themes"
ON theme_versions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM themes t
    JOIN profiles p ON p.agency_id = t.agency_id
    WHERE t.id = theme_versions.theme_id 
    AND p.id = auth.uid()
  )
);

CREATE POLICY "Users can create versions of their agency's themes"
ON theme_versions FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM themes t
    JOIN profiles p ON p.agency_id = t.agency_id
    WHERE t.id = theme_versions.theme_id 
    AND p.id = auth.uid()
  )
);

-- RLS Policies for theme_deployments
CREATE POLICY "Users can view their agency's deployments"
ON theme_deployments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.agency_id = theme_deployments.agency_id 
    AND profiles.id = auth.uid()
  )
);

CREATE POLICY "Agency owners can create deployments"
ON theme_deployments FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM agencies 
    WHERE agencies.id = theme_deployments.agency_id 
    AND agencies.owner_id = auth.uid()
  )
);

CREATE POLICY "Agency owners can update deployments"
ON theme_deployments FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM agencies 
    WHERE agencies.id = theme_deployments.agency_id 
    AND agencies.owner_id = auth.uid()
  )
);

-- RLS Policies for subaccount_themes
CREATE POLICY "Users can view their agency's subaccount themes"
ON subaccount_themes FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM subaccounts s
    JOIN profiles p ON p.agency_id = s.agency_id
    WHERE s.id = subaccount_themes.subaccount_id 
    AND p.id = auth.uid()
  )
);

CREATE POLICY "Agency owners can manage subaccount themes"
ON subaccount_themes FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM subaccounts s
    JOIN agencies a ON a.id = s.agency_id
    WHERE s.id = subaccount_themes.subaccount_id 
    AND a.owner_id = auth.uid()
  )
);

-- RLS Policies for deployment_logs
CREATE POLICY "Users can view logs for their agency's deployments"
ON deployment_logs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM theme_deployments td
    JOIN profiles p ON p.agency_id = td.agency_id
    WHERE td.id = deployment_logs.deployment_id 
    AND p.id = auth.uid()
  )
);

CREATE POLICY "System can insert deployment logs"
ON deployment_logs FOR INSERT
WITH CHECK (true);

-- RLS Policies for plugin_configs
CREATE POLICY "Users can view their agency's plugins"
ON plugin_configs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.agency_id = plugin_configs.agency_id 
    AND profiles.id = auth.uid()
  )
);

CREATE POLICY "Agency owners can manage plugins"
ON plugin_configs FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM agencies 
    WHERE agencies.id = plugin_configs.agency_id 
    AND agencies.owner_id = auth.uid()
  )
);

-- Database Functions for Deployment Management
CREATE OR REPLACE FUNCTION get_active_deployment(subaccount_uuid UUID)
RETURNS UUID
LANGUAGE sql
STABLE
AS $$
  SELECT deployment_id 
  FROM subaccount_themes 
  WHERE subaccount_id = subaccount_uuid 
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION create_theme_snapshot(theme_uuid UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_version_id UUID;
  next_version_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(version_number), 0) + 1 
  INTO next_version_num
  FROM theme_versions 
  WHERE theme_id = theme_uuid;
  
  INSERT INTO theme_versions (theme_id, version_number, colors, fonts, css, js, created_by)
  SELECT id, next_version_num, colors, fonts, css, js, auth.uid()
  FROM themes 
  WHERE id = theme_uuid
  RETURNING id INTO new_version_id;
  
  RETURN new_version_id;
END;
$$;

CREATE OR REPLACE FUNCTION rollback_deployment(deployment_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  previous_deployment_id UUID;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM theme_deployments 
    WHERE id = deployment_uuid 
    AND deployed_at > now() - INTERVAL '48 hours'
  ) THEN
    RAISE EXCEPTION 'Rollback window expired (48 hours)';
  END IF;
  
  UPDATE theme_deployments 
  SET status = 'rolled_back', updated_at = now()
  WHERE id = deployment_uuid;
  
  SELECT id INTO previous_deployment_id
  FROM theme_deployments
  WHERE agency_id = (SELECT agency_id FROM theme_deployments WHERE id = deployment_uuid)
  AND status = 'active'
  AND deployed_at < (SELECT deployed_at FROM theme_deployments WHERE id = deployment_uuid)
  ORDER BY deployed_at DESC
  LIMIT 1;
  
  IF previous_deployment_id IS NOT NULL THEN
    UPDATE theme_deployments 
    SET status = 'active', updated_at = now()
    WHERE id = previous_deployment_id;
  END IF;
  
  RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION process_scheduled_deployments()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  processed_count INTEGER := 0;
BEGIN
  UPDATE theme_deployments
  SET status = 'active', deployed_at = now()
  WHERE status = 'scheduled' 
  AND scheduled_for <= now();
  
  GET DIAGNOSTICS processed_count = ROW_COUNT;
  RETURN processed_count;
END;
$$;