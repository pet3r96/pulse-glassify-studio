import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { event, stripe_subscription_id } = await req.json();
  if (!event) return NextResponse.json({ error: 'Missing event' }, { status: 400 });

  // Allow custom events like seat_limit_exceeded
  const { error } = await supabase.from('billing_events').insert({
    user_id: user.id,
    event,
    stripe_subscription_id: stripe_subscription_id || null,
  });
  if (error) return NextResponse.json({ error: 'Failed to log event' }, { status: 500 });

  return NextResponse.json({ ok: true });
}


