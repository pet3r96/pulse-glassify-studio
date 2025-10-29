import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isLicenseValid } from '@/lib/marketplace/licenses';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { themeId } = await req.json();
  if (!themeId) return NextResponse.json({ error: 'Missing themeId' }, { status: 400 });

  const { data: license } = await supabase
    .from('themes_licenses')
    .select('*')
    .eq('user_id', user.id)
    .eq('theme_id', themeId)
    .maybeSingle();

  if (!license) return NextResponse.json({ error: 'No license' }, { status: 403 });
  const validity = isLicenseValid(license);
  if (!validity.valid) return NextResponse.json({ error: validity.reason || 'invalid' }, { status: 403 });

  const newDownloads = (license.downloads_used || 0) + 1;
  const { error } = await supabase
    .from('themes_licenses')
    .update({ downloads_used: newDownloads })
    .eq('id', license.id);
  if (error) return NextResponse.json({ error: 'Update failed' }, { status: 500 });

  return NextResponse.json({ success: true });
}


