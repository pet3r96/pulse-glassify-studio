import { NextRequest, NextResponse } from 'next/server';
import { stripe, STRIPE_WEBHOOK_SECRET } from '@/lib/stripe/config';
import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

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
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object as Stripe.Subscription, supabase);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionCancellation(event.data.object as Stripe.Subscription, supabase);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.Invoice, supabase);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailure(event.data.object as Stripe.Invoice, supabase);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription, supabase: any) {
  const customerId = subscription.customer as string;
  
  // Update subscription status
  const { error: updateError } = await supabase
    .from('subscription_status')
    .upsert({
      user_id: customerId, // This should be mapped to actual user_id
      status: subscription.status,
      stripe_subscription_id: subscription.id,
      current_period_end: null, // Will be updated when we have proper Stripe types
      updated_at: new Date().toISOString(),
    });

  if (updateError) {
    console.error('Error updating subscription status:', updateError);
    throw updateError;
  }

  // If subscription is active, ensure user can access features
  if (subscription.status === 'active') {
    console.log(`Subscription activated for customer: ${customerId}`);
  }
}

async function handleSubscriptionCancellation(subscription: Stripe.Subscription, supabase: any) {
  const customerId = subscription.customer as string;
  
  // Update subscription status to canceled
  const { error: updateError } = await supabase
    .from('subscription_status')
    .upsert({
      user_id: customerId,
      status: 'canceled',
      stripe_subscription_id: subscription.id,
      current_period_end: null, // Will be updated when we have proper Stripe types
      updated_at: new Date().toISOString(),
    });

  if (updateError) {
    console.error('Error updating subscription status:', updateError);
    throw updateError;
  }

  // Force revert themes for this user
  await revertUserThemes(customerId, supabase);
  
  console.log(`Subscription canceled for customer: ${customerId}`);
}

async function handlePaymentSuccess(invoice: Stripe.Invoice, supabase: any) {
  const customerId = invoice.customer as string;
  
  // Update subscription status to active
  const { error: updateError } = await supabase
    .from('subscription_status')
    .upsert({
      user_id: customerId,
      status: 'active',
      stripe_subscription_id: null, // Will be updated when we have proper Stripe types
      updated_at: new Date().toISOString(),
    });

  if (updateError) {
    console.error('Error updating subscription status after payment:', updateError);
    throw updateError;
  }

  console.log(`Payment succeeded for customer: ${customerId}`);
}

async function handlePaymentFailure(invoice: Stripe.Invoice, supabase: any) {
  const customerId = invoice.customer as string;
  
  // Update subscription status to past_due
  const { error: updateError } = await supabase
    .from('subscription_status')
    .upsert({
      user_id: customerId,
      status: 'past_due',
      stripe_subscription_id: null, // Will be updated when we have proper Stripe types
      updated_at: new Date().toISOString(),
    });

  if (updateError) {
    console.error('Error updating subscription status after payment failure:', updateError);
    throw updateError;
  }

  // Force revert themes for this user (no grace period)
  await revertUserThemes(customerId, supabase);
  
  console.log(`Payment failed for customer: ${customerId}`);
}

async function revertUserThemes(customerId: string, supabase: any) {
  try {
    // Get user's themes
    const { data: themes, error: themesError } = await supabase
      .from('themes')
      .select('id')
      .eq('owner_id', customerId);

    if (themesError) {
      console.error('Error fetching user themes:', themesError);
      return;
    }

    // Revert all themes to default (empty CSS/JS)
    for (const theme of themes || []) {
      const { error: revertError } = await supabase
        .from('theme_versions')
        .insert({
          theme_id: theme.id,
          css_code: '',
          js_code: '',
          version_number: 1,
          is_active: true,
        });

      if (revertError) {
        console.error('Error reverting theme:', revertError);
      }
    }

    console.log(`Reverted themes for customer: ${customerId}`);
  } catch (error) {
    console.error('Error in revertUserThemes:', error);
  }
}
