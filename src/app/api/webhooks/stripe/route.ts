import { NextRequest, NextResponse } from 'next/server';
import { stripe, STRIPE_WEBHOOK_SECRET } from '@/lib/stripe/config';
import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  if (!stripe || !STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 500 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session, supabase);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice, supabase);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice, supabase);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription, supabase);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription, supabase);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session, supabase: any) {
  const userId = session.metadata?.userId;
  const planId = session.metadata?.planId;
  const tier = session.metadata?.tier;

  if (!userId || !planId || !tier) {
    console.error('Missing metadata in checkout session');
    return;
  }

  // Get subscription details
  const subscription = await stripe!.subscriptions.retrieve(session.subscription as string);

  // Create or update subscription record
  const { error: subError } = await supabase
    .from('subscriptions')
    .upsert({
      id: subscription.id,
      user_id: userId,
      status: subscription.status,
      plan_id: planId,
      current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
      current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
      trial_start: (subscription as any).trial_start ? new Date((subscription as any).trial_start * 1000).toISOString() : null,
      trial_end: (subscription as any).trial_end ? new Date((subscription as any).trial_end * 1000).toISOString() : null,
    });

  if (subError) {
    console.error('Error creating subscription record:', subError);
    return;
  }

  // Update subscription status
  const { error: statusError } = await supabase
    .from('subscription_status')
    .upsert({
      user_id: userId,
      status: subscription.status === 'active' ? 'active' : 'trialing',
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: subscription.id,
      stripe_price_id: (subscription.items.data[0] as any).price.id,
      current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
      current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
    });

  if (statusError) {
    console.error('Error updating subscription status:', statusError);
    return;
  }

  // If user is agency, create agency workspace
  if (tier === 'pro' || tier === 'accelerator') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .single();

    const { error: agencyError } = await supabase
      .from('agencies')
      .insert({
        name: profile?.full_name ? `${profile.full_name}'s Agency` : 'My Agency',
        owner_id: userId,
        subscription_id: subscription.id,
        subscription_status: subscription.status === 'active' ? 'active' : 'trial',
      });

    if (agencyError) {
      console.error('Error creating agency:', agencyError);
    } else {
      // Update user's agency_id
      const { data: agency } = await supabase
        .from('agencies')
        .select('id')
        .eq('owner_id', userId)
        .single();

      if (agency) {
        await supabase
          .from('profiles')
          .update({ agency_id: agency.id })
          .eq('id', userId);
      }
    }
  }

  console.log(`Checkout completed for user ${userId} with plan ${planId}`);
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice, supabase: any) {
  const subscriptionId = (invoice as any).subscription as string;
  
  if (!subscriptionId) return;

  // Get subscription details
  const subscription = await stripe!.subscriptions.retrieve(subscriptionId);
  const userId = subscription.metadata?.userId;

  if (!userId) return;

  // Update subscription status to active
  const { error } = await supabase
    .from('subscription_status')
    .update({
      status: 'active',
      current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
      current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
    })
    .eq('user_id', userId);

  if (error) {
    console.error('Error updating subscription status:', error);
  }

  console.log(`Payment succeeded for subscription ${subscriptionId}`);
}

async function handlePaymentFailed(invoice: Stripe.Invoice, supabase: any) {
  const subscriptionId = (invoice as any).subscription as string;
  
  if (!subscriptionId) return;

  // Get subscription details
  const subscription = await stripe!.subscriptions.retrieve(subscriptionId);
  const userId = subscription.metadata?.userId;

  if (!userId) return;

  // Update subscription status to past_due
  const { error } = await supabase
    .from('subscription_status')
    .update({ status: 'past_due' })
    .eq('user_id', userId);

  if (error) {
    console.error('Error updating subscription status:', error);
  }

  console.log(`Payment failed for subscription ${subscriptionId}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription, supabase: any) {
  const userId = subscription.metadata?.userId;

  if (!userId) return;

  // Update subscription record
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
      current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
    })
    .eq('id', subscription.id);

  if (error) {
    console.error('Error updating subscription:', error);
  }

  // Update subscription status
  const { error: statusError } = await supabase
    .from('subscription_status')
    .update({
      status: subscription.status,
      current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
      current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
    })
    .eq('user_id', userId);

  if (statusError) {
    console.error('Error updating subscription status:', statusError);
  }

  console.log(`Subscription updated: ${subscription.id} - ${subscription.status}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription, supabase: any) {
  const userId = subscription.metadata?.userId;

  if (!userId) return;

  // Update subscription status to canceled
  const { error } = await supabase
    .from('subscription_status')
    .update({ status: 'canceled' })
    .eq('user_id', userId);

  if (error) {
    console.error('Error updating subscription status:', error);
  }

  // Rollback themes and remove injection
  await rollbackUserThemes(userId, supabase);

  console.log(`Subscription canceled: ${subscription.id}`);
}

async function rollbackUserThemes(userId: string, supabase: any) {
  try {
    // Get user's agency
    const { data: profile } = await supabase
      .from('profiles')
      .select('agency_id')
      .eq('id', userId)
      .single();

    if (!profile?.agency_id) return;

    // Get all active theme deployments for this agency
    const { data: deployments } = await supabase
      .from('theme_deployments')
      .select('id, theme_id')
      .eq('agency_id', profile.agency_id)
      .eq('status', 'active');

    if (!deployments) return;

    // Mark all deployments as rolled back
    for (const deployment of deployments) {
      await supabase
        .from('theme_deployments')
        .update({ 
          status: 'rolled_back',
          rollback_available_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        })
        .eq('id', deployment.id);
    }

    console.log(`Rolled back ${deployments.length} theme deployments for user ${userId}`);
  } catch (error) {
    console.error('Error rolling back themes:', error);
  }
}
