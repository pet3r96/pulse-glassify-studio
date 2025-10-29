import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { event = 'failed' } = await req.json();
  // Log the simulated event for QA
  await supabase.from('billing_events').insert({ user_id: user.id, event, stripe_subscription_id: null });
  return NextResponse.json({ ok: true });
}


