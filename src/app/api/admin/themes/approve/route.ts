import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Theme approval endpoint
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is super_admin
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userError || userData?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Super admin access required' }, { status: 403 });
    }

    const { themeId, action } = await request.json();

    if (!themeId || !action) {
      return NextResponse.json({ 
        error: 'Theme ID and action are required' 
      }, { status: 400 });
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ 
        error: 'Action must be approve or reject' 
      }, { status: 400 });
    }

    // Update marketplace listing
    const { error: marketplaceError } = await supabase
      .from('marketplace')
      .update({ 
        approved: action === 'approve',
        reviewed_at: new Date().toISOString(),
        reviewed_by: user.id,
      })
      .eq('theme_id', themeId);

    if (marketplaceError) {
      console.error('Error updating marketplace:', marketplaceError);
      return NextResponse.json({ error: 'Failed to update theme status' }, { status: 500 });
    }

    // If approved, make theme visible in marketplace
    if (action === 'approve') {
      const { error: themeError } = await supabase
        .from('themes')
        .update({ visibility: 'marketplace' })
        .eq('id', themeId);

      if (themeError) {
        console.error('Error updating theme visibility:', themeError);
        return NextResponse.json({ error: 'Failed to update theme visibility' }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Theme ${action}d successfully`,
    });
  } catch (error) {
    console.error('Theme approval error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// Get pending themes for review
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is super_admin
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userError || userData?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Super admin access required' }, { status: 403 });
    }

    // Get themes pending approval
    const { data: themes, error } = await supabase
      .from('marketplace')
      .select(`
        *,
        themes!inner(
          id,
          name,
          description,
          owner_id,
          visibility,
          created_at,
          users!inner(
            name,
            email
          )
        )
      `)
      .eq('approved', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching pending themes:', error);
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
