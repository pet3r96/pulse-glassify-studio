import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Placeholder: if you maintain subaccounts as profiles with agency_id, count them here.
  // Example implementation (uncomment if schema matches):
  // const { count } = await supabase
  //   .from('profiles')
  //   .select('*', { count: 'exact', head: true })
  //   .eq('agency_id', user.id)
  //   .eq('role', 'subaccount');

  // Without schema guarantees, return 0 so UI can still render gracefully.
  return NextResponse.json({ currentSubaccounts: 0 });
}


