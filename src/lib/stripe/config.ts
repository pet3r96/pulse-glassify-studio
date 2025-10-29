import Stripe from 'stripe';

export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-09-30.clover',
      typescript: true,
    })
  : null;

export const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY;
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

// Subscription pricing tiers
const AGENCY_PRICE_ID =
  process.env.STRIPE_AGENCY_PRICE_ID ||
  process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID ||
  'price_agency_monthly';

const SUBACCOUNT_PRICE_ID =
  process.env.STRIPE_SUBACCOUNT_PRICE_ID ||
  process.env.NEXT_PUBLIC_STRIPE_STARTER_MONTHLY_PRICE_ID ||
  'price_subaccount_monthly';

export const SUBSCRIPTION_PLANS = {
  agency: {
    priceId: AGENCY_PRICE_ID,
    name: 'Agency Plan',
    price: 97, // $97/month
    features: [
      'Unlimited subaccounts',
      'Full theme customization',
      'Project management tools',
      'Priority support',
      'White-label options'
    ]
  },
  subaccount: {
    priceId: SUBACCOUNT_PRICE_ID,
    name: 'Subaccount Plan',
    price: 27, // $27/month
    features: [
      'Single location access',
      'Theme customization',
      'Basic support',
      'Standard features'
    ]
  }
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_PLANS;
