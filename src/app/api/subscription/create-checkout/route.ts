import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createCheckoutSession, createBillingPortalSession, getPriceIdForRole } from '@/lib/stripe/utils';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { plan } = await request.json();

    if (!plan || !['agency', 'subaccount'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // Get user details
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('stripe_customer_id, email, name')
      .eq('id', user.id)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create Stripe customer if doesn't exist
    let customerId = userData.stripe_customer_id;
    if (!customerId) {
      const { createStripeCustomer } = await import('@/lib/stripe/utils');
      const customer = await createStripeCustomer({
        userId: user.id,
        email: userData.email,
        name: userData.name,
        role: plan as 'agency' | 'subaccount',
      });
      customerId = customer.id;
    }

    // Create checkout session
    const priceId = getPriceIdForRole(plan as 'agency' | 'subaccount');
    const session = await createCheckoutSession(
      customerId,
      priceId,
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`
    );

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
