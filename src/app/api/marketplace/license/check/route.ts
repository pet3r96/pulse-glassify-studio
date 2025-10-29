import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isLicenseValid } from '@/lib/marketplace/licenses';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const supabase = createClient();
  const { searchParams } = new URL(req.url);
  const themeId = searchParams.get('themeId');
  if (!themeId) return NextResponse.json({ error: 'Missing themeId' }, { status: 400 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: license } = await supabase
    .from('themes_licenses')
    .select('*')
    .eq('user_id', user.id)
    .eq('theme_id', themeId)
    .maybeSingle();

  if (!license) return NextResponse.json({ owned: false });

  const validity = isLicenseValid(license);
  return NextResponse.json({ owned: validity.valid, reason: validity.reason, license });
}


