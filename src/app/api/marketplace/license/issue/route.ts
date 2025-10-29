import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateLicenseKey } from '@/lib/marketplace/licenses';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { themeId, license_type = 'single', download_limit, expires_at } = await req.json();
  if (!themeId) return NextResponse.json({ error: 'Missing themeId' }, { status: 400 });

  const licenseKey = generateLicenseKey('THEME');
  const { error } = await supabase.from('themes_licenses').insert({
    user_id: user.id,
    theme_id: themeId,
    license_key: licenseKey,
    license_type,
    download_limit: download_limit ?? (license_type === 'single' ? 5 : null),
    expires_at: expires_at ?? null,
  });
  if (error) return NextResponse.json({ error: 'Failed to issue license' }, { status: 500 });

  return NextResponse.json({ success: true, license_key: licenseKey });
}


