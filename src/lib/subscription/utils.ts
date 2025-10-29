import { supabase } from '@/lib/supabase/client';

export const PLAN_CONFIG = {
  starter: { name: 'Starter OS', includedSeats: 1 },
  pro: { name: 'Agency Pro OS', includedSeats: 3 },
  accelerator: { name: 'Accelerator OS', includedSeats: Number.MAX_SAFE_INTEGER },
} as const;

export async function getUserSubscriptionStatus(userId: string) {
  try {
    const { data, error } = await supabase
      .from('subscription_status')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching subscription status:', error);
      return { status: 'inactive' };
    }

    return data || { status: 'inactive' };
  } catch (error) {
    console.error('Error in getUserSubscriptionStatus:', error);
    return { status: 'inactive' };
  }
}

export async function getSubscriptionPlan(userId: string) {
  try {
    const { data, error } = await supabase
      .from('subscription_status')
      .select('stripe_price_id, status')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching subscription plan:', error);
      return { plan: 'free' };
    }

    const priceIdToPlan: { [key: string]: 'starter' | 'pro' | 'accelerator' } = {
      [process.env.NEXT_PUBLIC_STRIPE_STARTER_MONTHLY_PRICE_ID || '']: 'starter',
      [process.env.NEXT_PUBLIC_STRIPE_STARTER_ANNUAL_PRICE_ID || '']: 'starter',
      [process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID || '']: 'pro',
      [process.env.NEXT_PUBLIC_STRIPE_PRO_ANNUAL_PRICE_ID || '']: 'pro',
      [process.env.NEXT_PUBLIC_STRIPE_ACCELERATOR_MONTHLY_PRICE_ID || '']: 'accelerator',
      [process.env.NEXT_PUBLIC_STRIPE_ACCELERATOR_ANNUAL_PRICE_ID || '']: 'accelerator',
    };

    const plan = priceIdToPlan[(data as any)?.stripe_price_id] || 'free';
    return { plan, status: (data as any)?.status || 'inactive' };
  } catch (error) {
    console.error('Error in getSubscriptionPlan:', error);
    return { plan: 'free' };
  }
}

export function evaluateAccess(status: string) {
  // Map Stripe status to enforcement flags
  switch (status) {
    case 'active':
      return { locked: false, publishDisabled: false, viewOnlyMarketplace: false, banner: null };
    case 'past_due':
      return { locked: false, publishDisabled: true, viewOnlyMarketplace: false, banner: 'Payment required. Update your method to restore publishing.' };
    case 'unpaid':
    case 'canceled':
      return { locked: true, publishDisabled: true, viewOnlyMarketplace: true, banner: 'Billing Required: Your subscription is not active. Please update your payment method to restore features.' };
    case 'incomplete':
    case 'incomplete_expired':
    case 'payment_failed':
      return { locked: false, publishDisabled: true, viewOnlyMarketplace: false, banner: 'Limited mode: Complete payment to enable publishing.' };
    default:
      return { locked: true, publishDisabled: true, viewOnlyMarketplace: true, banner: 'Billing Required: Your subscription is not active. Please update your payment method to restore features.' };
  }
}
