import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is required');
}

if (!process.env.STRIPE_PUBLISHABLE_KEY) {
  throw new Error('STRIPE_PUBLISHABLE_KEY is required');
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('STRIPE_WEBHOOK_SECRET is required');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-09-30.clover',
  typescript: true,
});

export const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY;
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

// Subscription pricing tiers
export const SUBSCRIPTION_PLANS = {
  agency: {
    priceId: process.env.STRIPE_AGENCY_PRICE_ID || 'price_agency_monthly',
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
    priceId: process.env.STRIPE_SUBACCOUNT_PRICE_ID || 'price_subaccount_monthly',
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
