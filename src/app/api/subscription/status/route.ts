import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserSubscriptionStatus, getSubscriptionPlan } from '@/lib/subscription/utils';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get subscription status
    const subscription = await getUserSubscriptionStatus(user.id);
    const plan = await getSubscriptionPlan(user.id);

    return NextResponse.json({
      ...subscription,
      plan,
    });
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    return NextResponse.json({ error: 'Failed to fetch subscription status' }, { status: 500 });
  }
}
