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
