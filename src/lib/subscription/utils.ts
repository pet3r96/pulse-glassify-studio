import { supabase } from '@/lib/supabase/client';

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

    // Map price IDs to plan names
    const priceIdToPlan: { [key: string]: string } = {
      'price_starter': 'starter',
      'price_pro': 'pro',
      'price_accelerator': 'accelerator',
    };

    const plan = priceIdToPlan[(data as any)?.stripe_price_id] || 'free';
    return { plan, status: (data as any)?.status || 'inactive' };
  } catch (error) {
    console.error('Error in getSubscriptionPlan:', error);
    return { plan: 'free' };
  }
}
