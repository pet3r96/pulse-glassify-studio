-- Marketplace licenses table
CREATE TABLE IF NOT EXISTS themes_licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  theme_id TEXT NOT NULL,
  license_key TEXT NOT NULL,
  license_type TEXT NOT NULL CHECK (license_type IN ('single','unlimited','commercial')),
  download_limit INT,
  downloads_used INT NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_theme_licenses_user ON themes_licenses(user_id);
CREATE INDEX IF NOT EXISTS idx_theme_licenses_theme ON themes_licenses(theme_id);
CREATE UNIQUE INDEX IF NOT EXISTS uniq_theme_license_key ON themes_licenses(license_key);

ALTER TABLE themes_licenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own theme licenses" ON themes_licenses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own theme licenses" ON themes_licenses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own theme licenses" ON themes_licenses FOR UPDATE USING (auth.uid() = user_id);

