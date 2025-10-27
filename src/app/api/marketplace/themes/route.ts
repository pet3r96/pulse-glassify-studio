import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, price, category, tags, css, js } = await request.json();

    if (!name || !description || !price) {
      return NextResponse.json({ 
        error: 'Name, description, and price are required' 
      }, { status: 400 });
    }

    // Check if user has Stripe Connect account
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('stripe_connect_account_id, stripe_connect_enabled')
      .eq('id', user.id)
      .single();

    if (userError || !userData?.stripe_connect_account_id) {
      return NextResponse.json({ 
        error: 'Stripe Connect account required to sell themes' 
      }, { status: 400 });
    }

    // Create theme
    const { data: theme, error: themeError } = await supabase
      .from('themes')
      .insert({
        name,
        description,
        owner_id: user.id,
        agency_id: user.user_metadata?.agency_id || null,
        visibility: 'marketplace',
        metadata: {
          category,
          tags: tags || [],
          price,
        },
      })
      .select()
      .single();

    if (themeError) {
      console.error('Error creating theme:', themeError);
      return NextResponse.json({ error: 'Failed to create theme' }, { status: 500 });
    }

    // Create theme version
    const { data: version, error: versionError } = await supabase
      .from('theme_versions')
      .insert({
        theme_id: theme.id,
        css_code: css || '',
        js_code: js || '',
        version_number: 1,
        is_active: true,
        change_log: 'Initial version',
      })
      .select()
      .single();

    if (versionError) {
      console.error('Error creating theme version:', versionError);
      return NextResponse.json({ error: 'Failed to create theme version' }, { status: 500 });
    }

    // Create marketplace listing
    const { data: marketplace, error: marketplaceError } = await supabase
      .from('marketplace')
      .insert({
        theme_id: theme.id,
        price: price,
        rating: 0,
        downloads: 0,
        approved: false, // Requires admin approval
        stripe_connect_acc: userData.stripe_connect_account_id,
      })
      .select()
      .single();

    if (marketplaceError) {
      console.error('Error creating marketplace listing:', marketplaceError);
      return NextResponse.json({ error: 'Failed to create marketplace listing' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      theme: {
        ...theme,
        version,
        marketplace,
      },
      message: 'Theme created successfully and submitted for approval',
    });
  } catch (error) {
    console.error('Theme creation error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
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
        ),
        marketplace!inner(
          price,
          rating,
          downloads,
          approved,
          stripe_connect_acc
        )
      `)
      .eq('owner_id', user.id)
      .eq('visibility', 'marketplace')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching themes:', error);
      return NextResponse.json({ error: 'Failed to fetch themes' }, { status: 500 });
    }

    return NextResponse.json({ themes });
  } catch (error) {
    console.error('Theme fetch error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
