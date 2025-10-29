import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserSubscriptionStatus, getSubscriptionPlan, PLAN_CONFIG } from '@/lib/subscription/utils';
import { stripe } from '@/lib/stripe/config';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

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

    // Compute allowed seats (included + add-on seats from Stripe metadata)
    let addOnSeats = 0;
    if (stripe) {
      const { data: statusRow } = await createClient()
        .from('subscription_status')
        .select('stripe_subscription_id')
        .eq('user_id', user.id)
        .maybeSingle();
      const subId = (statusRow as any)?.stripe_subscription_id;
      if (subId) {
        try {
          const s = await stripe.subscriptions.retrieve(subId);
          const meta = (s as any)?.metadata || {};
          const parsed = parseInt(meta.add_on_seats || '0', 10);
          if (!Number.isNaN(parsed)) addOnSeats = parsed;
        } catch (e) {
          // ignore metadata fetch errors
        }
      }
    }

    const tier = (plan as any)?.plan as keyof typeof PLAN_CONFIG;
    const includedSeats = PLAN_CONFIG[tier]?.includedSeats || 0;
    const allowedSeats = (includedSeats === Number.MAX_SAFE_INTEGER) ? includedSeats : includedSeats + addOnSeats;

    return NextResponse.json({
      ...subscription,
      plan,
      allowedSeats,
    });
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    return NextResponse.json({ error: 'Failed to fetch subscription status' }, { status: 500 });
  }
}
