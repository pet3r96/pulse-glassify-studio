import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const themeData = await request.json();
    const { name, description, css, js, colors, fonts, layout, animations } = themeData;

    if (!name || !css) {
      return NextResponse.json({ error: 'Name and CSS are required' }, { status: 400 });
    }

    // Save theme to database
    const { data: theme, error: themeError } = await supabase
      .from('themes')
      .insert({
        name,
        description: description || '',
        owner_id: user.id,
        agency_id: user.user_metadata?.agency_id || null,
        visibility: 'private',
        metadata: {
          colors,
          fonts,
          layout,
          animations,
        },
      })
      .select()
      .single();

    if (themeError) {
      console.error('Error saving theme:', themeError);
      return NextResponse.json({ error: 'Failed to save theme' }, { status: 500 });
    }

    // Save theme version
    const { data: version, error: versionError } = await supabase
      .from('theme_versions')
      .insert({
        theme_id: theme.id,
        css_code: css,
        js_code: js || '',
        version_number: 1,
        is_active: true,
        change_log: 'Initial version',
      })
      .select()
      .single();

    if (versionError) {
      console.error('Error saving theme version:', versionError);
      return NextResponse.json({ error: 'Failed to save theme version' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      theme: {
        ...theme,
        version,
      },
    });
  } catch (error) {
    console.error('Theme save error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's themes
    const { data: themes, error } = await supabase
      .from('themes')
      .select(`
        *,
        theme_versions!inner(
          css_code,
          js_code,
          version_number,
          is_active
        )
      `)
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching themes:', error);
      return NextResponse.json({ error: 'Failed to fetch themes' }, { status: 500 });
    }

    return NextResponse.json({ themes });
  } catch (error) {
    console.error('Theme fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
