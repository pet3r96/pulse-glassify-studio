import { createClient } from '@/lib/supabase/server';
import { getSubscriptionStatus } from '@/lib/stripe/utils';

export interface SubscriptionInfo {
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'inactive';
  hasAccess: boolean;
  currentPeriodEnd?: Date;
  plan?: 'agency' | 'subaccount';
}

export async function getUserSubscriptionStatus(userId: string): Promise<SubscriptionInfo> {
  const supabase = createClient();

  try {
    // Check if user has billing override (Super Admin feature)
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('override_billing, stripe_customer_id')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error fetching user data:', userError);
      return { status: 'inactive', hasAccess: false };
    }

    // Super Admin override
    if (userData.override_billing) {
      return { status: 'active', hasAccess: true };
    }

    // Check subscription status from database
    const { data: subscriptionData, error: subError } = await supabase
      .from('subscription_status')
      .select('status, current_period_end')
      .eq('user_id', userId)
      .single();

    if (subError || !subscriptionData) {
      return { status: 'inactive', hasAccess: false };
    }

    const hasAccess = ['active', 'trialing'].includes(subscriptionData.status);
    
    return {
      status: subscriptionData.status as any,
      hasAccess,
      currentPeriodEnd: subscriptionData.current_period_end ? new Date(subscriptionData.current_period_end) : undefined,
    };
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return { status: 'inactive', hasAccess: false };
  }
}

export async function requireActiveSubscription(userId: string): Promise<boolean> {
  const subscription = await getUserSubscriptionStatus(userId);
  return subscription.hasAccess;
}

export async function getSubscriptionPlan(userId: string): Promise<'agency' | 'subaccount' | null> {
  const supabase = createClient();

  try {
    const { data: userData, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (error || !userData) {
      return null;
    }

    return userData.role as 'agency' | 'subaccount';
  } catch (error) {
    console.error('Error getting subscription plan:', error);
    return null;
  }
}
