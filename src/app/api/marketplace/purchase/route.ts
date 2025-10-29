import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Placeholder: return a stub checkoutUrl. In Phase 2, create real Stripe Checkout for marketplace items.
  return NextResponse.json({ success: true, checkoutUrl: '/subscribe?locked=true' });
}


