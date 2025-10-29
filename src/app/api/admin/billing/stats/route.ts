import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const PRICE_TO_PLAN: Record<string, 'starter'|'pro'|'accelerator'> = {
  [process.env.NEXT_PUBLIC_STRIPE_STARTER_MONTHLY_PRICE_ID || '']: 'starter',
  [process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID || '']: 'pro',
  [process.env.NEXT_PUBLIC_STRIPE_ACCELERATOR_MONTHLY_PRICE_ID || '']: 'accelerator',
};

const PLAN_PRICES = { starter: 59, pro: 149, accelerator: 397 };
const PLAN_INCLUDED_SEATS = { starter: 1, pro: 3, accelerator: 9999999 };

export async function GET(req: NextRequest) {
  const supabase = createClient();
  const url = new URL(req.url);
  const statusFilter = url.searchParams.get('status');
  const planFilter = url.searchParams.get('plan') as 'starter'|'pro'|'accelerator'|null;

  const query = supabase
    .from('subscription_status')
    .select('status, stripe_price_id');

  const { data: rows, error } = await query;
  if (error) return NextResponse.json({ error: 'Failed to load' }, { status: 500 });

  const filtered = (rows || []).filter((r: any) => {
    const plan = PRICE_TO_PLAN[r.stripe_price_id || ''];
    const statusOk = statusFilter ? r.status === statusFilter : true;
    const planOk = planFilter ? plan === planFilter : true;
    return statusOk && planOk;
  });

  const totalSubscriptions = filtered.length;
  const byPlanCount: Record<'starter'|'pro'|'accelerator', number> = { starter: 0, pro: 0, accelerator: 0 };
  for (const r of filtered) {
    const plan = PRICE_TO_PLAN[r.stripe_price_id || ''];
    if (plan) byPlanCount[plan] += 1;
  }

  const mrr = (byPlanCount.starter * PLAN_PRICES.starter) + (byPlanCount.pro * PLAN_PRICES.pro) + (byPlanCount.accelerator * PLAN_PRICES.accelerator);
  const arr = mrr * 12;
  const activeSeats = (byPlanCount.starter * PLAN_INCLUDED_SEATS.starter) + (byPlanCount.pro * PLAN_INCLUDED_SEATS.pro) + (byPlanCount.accelerator * PLAN_INCLUDED_SEATS.accelerator);

  // Simple 12-point MRR history placeholder (flat)
  const mrrHistory = Array.from({ length: 12 }).map((_, i) => ({ month: i + 1, mrr }));

  return NextResponse.json({
    totalSubscriptions,
    mrr,
    arr,
    activeSeats,
    byPlanCount,
    mrrHistory,
  });
}


