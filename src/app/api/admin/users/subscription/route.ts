import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// User subscription override endpoint
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

    const { userId, status, reason } = await request.json();

    if (!userId || !status) {
      return NextResponse.json({ 
        error: 'User ID and status are required' 
      }, { status: 400 });
    }

    if (!['active', 'trialing', 'canceled', 'past_due'].includes(status)) {
      return NextResponse.json({ 
        error: 'Invalid subscription status' 
      }, { status: 400 });
    }

    // Update user subscription status
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        subscription_status: status,
        subscription_override: true,
        override_reason: reason || 'Super admin override',
        override_date: new Date().toISOString(),
        override_by: user.id,
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating user subscription:', updateError);
      return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 });
    }

    // If canceling, trigger theme rollback
    if (status === 'canceled') {
      // Get user's active themes
      const { data: themes, error: themesError } = await supabase
        .from('themes')
        .select('id')
        .eq('owner_id', userId)
        .eq('is_active', true);

      if (themesError) {
        console.error('Error fetching user themes:', themesError);
      } else if (themes && themes.length > 0) {
        // Deactivate themes
        await supabase
          .from('themes')
          .update({ is_active: false })
          .eq('owner_id', userId);

        // Log the rollback action
        await supabase
          .from('admin_actions')
          .insert({
            action: 'theme_rollback',
            target_user_id: userId,
            performed_by: user.id,
            reason: 'Subscription canceled - automatic rollback',
            metadata: {
              themes_affected: themes.length,
              rollback_date: new Date().toISOString(),
            },
          });
      }
    }

    // Log the admin action
    await supabase
      .from('admin_actions')
      .insert({
        action: 'subscription_override',
        target_user_id: userId,
        performed_by: user.id,
        reason: reason || 'Super admin override',
        metadata: {
          old_status: 'unknown', // In a real app, you'd track the previous status
          new_status: status,
          override_date: new Date().toISOString(),
        },
      });

    return NextResponse.json({
      success: true,
      message: `User subscription ${status} successfully`,
    });
  } catch (error) {
    console.error('Subscription override error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// Get all users for admin management
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const role = searchParams.get('role');
    const status = searchParams.get('status');

    let query = supabase
      .from('users')
      .select(`
        id,
        name,
        email,
        role,
        agency_id,
        subaccount_id,
        subscription_status,
        subscription_override,
        override_reason,
        created_at,
        last_login,
        stripe_customer_id
      `)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (role) {
      query = query.eq('role', role);
    }

    if (status) {
      query = query.eq('subscription_status', status);
    }

    const { data: users, error, count } = await query;

    if (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    return NextResponse.json({ 
      users,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('User fetch error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
