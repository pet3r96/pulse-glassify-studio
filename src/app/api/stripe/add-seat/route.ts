import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe/config';

export const dynamic = 'force-dynamic';

export async function POST(_req: NextRequest) {
  try {
    if (!stripe) return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const EXTRA_SEAT_PRICE = process.env.STRIPE_EXTRA_SEAT_PRICE_ID;
    if (!EXTRA_SEAT_PRICE) return NextResponse.json({ error: 'Missing STRIPE_EXTRA_SEAT_PRICE_ID' }, { status: 500 });

    // Get or create Stripe customer
    let customerId: string;
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, email')
      .eq('id', user.id)
      .maybeSingle();

    if ((profile as any)?.stripe_customer_id) {
      customerId = (profile as any).stripe_customer_id as string;
    } else {
      const customer = await stripe.customers.create({
        email: (profile as any)?.email,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
      await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: EXTRA_SEAT_PRICE, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?seats=updated&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?seats=cancelled`,
      subscription_data: {
        metadata: {
          userId: user.id,
          add_on_seats: '1',
          kind: 'extra_seat',
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error('add-seat error', e);
    return NextResponse.json({ error: 'Failed to create seat checkout' }, { status: 500 });
  }
}


