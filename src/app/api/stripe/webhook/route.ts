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

  const userId = await resolveUserIdByStripeCustomer(customerId, supabase);
  const currentPeriodEnd = (subscription as any).current_period_end
    ? new Date((subscription as any).current_period_end * 1000).toISOString()
    : null;
  const currentPeriodStart = (subscription as any).current_period_start
    ? new Date((subscription as any).current_period_start * 1000).toISOString()
    : null;
  const priceId = Array.isArray(subscription.items.data) && subscription.items.data[0]?.price?.id
    ? subscription.items.data[0].price.id
    : null;

  const { error: updateError } = await supabase
    .from('subscription_status')
    .upsert({
      user_id: userId,
      status: subscription.status,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: customerId,
      stripe_price_id: priceId,
      current_period_end: currentPeriodEnd,
      current_period_start: currentPeriodStart,
      updated_at: new Date().toISOString(),
    });

  if (updateError) {
    console.error('Error updating subscription status:', updateError);
    throw updateError;
  }

  await logBillingEvent(userId, subscription.status === 'active' ? 'activated' : 'upgrade', subscription.id, supabase);

  if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
    await revertUserThemes(userId, supabase);
    await logBillingEvent(userId, 'rollback', subscription.id, supabase);
  }
}

async function handleSubscriptionCancellation(subscription: Stripe.Subscription, supabase: any) {
  const customerId = subscription.customer as string;
  const userId = await resolveUserIdByStripeCustomer(customerId, supabase);

  const { error: updateError } = await supabase
    .from('subscription_status')
    .upsert({
      user_id: userId,
      status: 'canceled',
      stripe_subscription_id: subscription.id,
      stripe_customer_id: customerId,
      updated_at: new Date().toISOString(),
    });

  if (updateError) {
    console.error('Error updating subscription status:', updateError);
    throw updateError;
  }

  await revertUserThemes(userId, supabase);
  await logBillingEvent(userId, 'cancel', subscription.id, supabase);
}

async function handlePaymentSuccess(invoice: Stripe.Invoice, supabase: any) {
  const customerId = invoice.customer as string;
  const userId = await resolveUserIdByStripeCustomer(customerId, supabase);

  const { error: updateError } = await supabase
    .from('subscription_status')
    .upsert({
      user_id: userId,
      status: 'active',
      stripe_customer_id: customerId,
      updated_at: new Date().toISOString(),
    });

  if (updateError) {
    console.error('Error updating subscription status after payment:', updateError);
    throw updateError;
  }

  await logBillingEvent(userId, 'activated', (invoice as any).subscription as string, supabase);
}

async function handlePaymentFailure(invoice: Stripe.Invoice, supabase: any) {
  const customerId = invoice.customer as string;
  const userId = await resolveUserIdByStripeCustomer(customerId, supabase);

  const { error: updateError } = await supabase
    .from('subscription_status')
    .upsert({
      user_id: userId,
      status: 'past_due',
      stripe_customer_id: customerId,
      updated_at: new Date().toISOString(),
    });

  if (updateError) {
    console.error('Error updating subscription status after payment failure:', updateError);
    throw updateError;
  }

  await logBillingEvent(userId, 'failed', (invoice as any).subscription as string, supabase);
}

async function resolveUserIdByStripeCustomer(stripeCustomerId: string, supabase: any): Promise<string> {
  const { data: statusRow } = await supabase
    .from('subscription_status')
    .select('user_id')
    .eq('stripe_customer_id', stripeCustomerId)
    .maybeSingle();
  if (statusRow?.user_id) return statusRow.user_id;

  const { data: profileRow } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', stripeCustomerId)
    .maybeSingle();
  if (profileRow?.id) return profileRow.id;

  return stripeCustomerId;
}

async function logBillingEvent(userId: string, event: 'activated'|'failed'|'rollback'|'upgrade'|'cancel', stripeSubscriptionId: string | null, supabase: any) {
  await supabase.from('billing_events').insert({
    user_id: userId,
    event,
    stripe_subscription_id: stripeSubscriptionId,
  });
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
