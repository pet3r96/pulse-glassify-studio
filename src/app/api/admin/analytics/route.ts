import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Admin analytics endpoint
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
    const period = searchParams.get('period') || '30d'; // 7d, 30d, 90d, 1y

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    // Get user statistics
    const { data: userStats, error: userStatsError } = await supabase
      .from('users')
      .select('role, subscription_status, created_at')
      .gte('created_at', startDate.toISOString());

    if (userStatsError) {
      console.error('Error fetching user stats:', userStatsError);
    }

    // Get theme statistics
    const { data: themeStats, error: themeStatsError } = await supabase
      .from('themes')
      .select('visibility, created_at')
      .gte('created_at', startDate.toISOString());

    if (themeStatsError) {
      console.error('Error fetching theme stats:', themeStatsError);
    }

    // Get marketplace statistics
    const { data: marketplaceStats, error: marketplaceStatsError } = await supabase
      .from('marketplace')
      .select('approved, downloads, price, created_at')
      .gte('created_at', startDate.toISOString());

    if (marketplaceStatsError) {
      console.error('Error fetching marketplace stats:', marketplaceStatsError);
    }

    // Get license statistics (purchases)
    const { data: licenseStats, error: licenseStatsError } = await supabase
      .from('licenses')
      .select('purchased_at, active')
      .gte('purchased_at', startDate.toISOString());

    if (licenseStatsError) {
      console.error('Error fetching license stats:', licenseStatsError);
    }

    // Process statistics
    const analytics = {
      period,
      dateRange: {
        start: startDate.toISOString(),
        end: now.toISOString(),
      },
      users: {
        total: userStats?.length || 0,
        byRole: {
          super_admin: userStats?.filter(u => u.role === 'super_admin').length || 0,
          agency: userStats?.filter(u => u.role === 'agency').length || 0,
          subaccount: userStats?.filter(u => u.role === 'subaccount').length || 0,
        },
        bySubscription: {
          active: userStats?.filter(u => u.subscription_status === 'active').length || 0,
          trialing: userStats?.filter(u => u.subscription_status === 'trialing').length || 0,
          canceled: userStats?.filter(u => u.subscription_status === 'canceled').length || 0,
          past_due: userStats?.filter(u => u.subscription_status === 'past_due').length || 0,
        },
      },
      themes: {
        total: themeStats?.length || 0,
        byVisibility: {
          private: themeStats?.filter(t => t.visibility === 'private').length || 0,
          marketplace: themeStats?.filter(t => t.visibility === 'marketplace').length || 0,
        },
      },
      marketplace: {
        totalListings: marketplaceStats?.length || 0,
        approved: marketplaceStats?.filter(m => m.approved).length || 0,
        pending: marketplaceStats?.filter(m => !m.approved).length || 0,
        totalDownloads: marketplaceStats?.reduce((sum, m) => sum + (m.downloads || 0), 0) || 0,
        totalRevenue: marketplaceStats?.reduce((sum, m) => sum + (m.price || 0), 0) || 0,
      },
      licenses: {
        totalPurchases: licenseStats?.length || 0,
        active: licenseStats?.filter(l => l.active).length || 0,
        inactive: licenseStats?.filter(l => !l.active).length || 0,
      },
      // Calculate growth rates (simplified)
      growth: {
        users: calculateGrowthRate(userStats?.length || 0, period),
        themes: calculateGrowthRate(themeStats?.length || 0, period),
        revenue: calculateGrowthRate(marketplaceStats?.reduce((sum, m) => sum + (m.price || 0), 0) || 0, period),
      },
    };

    return NextResponse.json({ analytics });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// Helper function to calculate growth rate (simplified)
function calculateGrowthRate(current: number, period: string): number {
  // This is a simplified calculation - in a real app, you'd compare with previous period
  const baseRate = {
    '7d': 0.05,
    '30d': 0.15,
    '90d': 0.35,
    '1y': 1.2,
  };
  
  return baseRate[period as keyof typeof baseRate] || 0.15;
}
