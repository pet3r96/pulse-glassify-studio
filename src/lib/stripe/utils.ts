import { createClient } from '@/lib/supabase/server';
import { stripe, SUBSCRIPTION_PLANS } from './config';
import { SubscriptionTier } from './config';

export interface CreateCustomerData {
  userId: string;
  email: string;
  name: string;
  role: 'agency' | 'subaccount';
}

export async function createStripeCustomer(data: CreateCustomerData) {
  const supabase = createClient();
  
  try {
    // Create customer in Stripe
    const customer = await stripe.customers.create({
      email: data.email,
      name: data.name,
      metadata: {
        userId: data.userId,
        role: data.role,
      },
    });

    // Update user with Stripe customer ID
    const { error } = await supabase
      .from('users')
      .update({ stripe_customer_id: customer.id })
      .eq('id', data.userId);

    if (error) {
      console.error('Error updating user with Stripe customer ID:', error);
      throw error;
    }

    return customer;
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    throw error;
  }
}

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        customerId,
      },
    });

    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

export async function createBillingPortalSession(customerId: string, returnUrl: string) {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return session;
  } catch (error) {
    console.error('Error creating billing portal session:', error);
    throw error;
  }
}

export async function getSubscriptionStatus(customerId: string) {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return { status: 'inactive', subscription: null };
    }

    const subscription = subscriptions.data[0];
    return {
      status: subscription.status,
      subscription,
      currentPeriodEnd: null, // Will be updated when we have proper Stripe types
    };
  } catch (error) {
    console.error('Error getting subscription status:', error);
    throw error;
  }
}

export async function cancelSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
}

export function getPriceIdForRole(role: 'agency' | 'subaccount'): string {
  return SUBSCRIPTION_PLANS[role].priceId;
}

export function getPlanForRole(role: 'agency' | 'subaccount') {
  return SUBSCRIPTION_PLANS[role];
}
