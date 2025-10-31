'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap } from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  monthlyPriceId: string;
  annualPriceId: string;
  features: string[];
  popular?: boolean;
  tier: 'starter' | 'pro' | 'accelerator';
}

const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter OS',
    description: 'Core tools for single subaccount and branded basics',
    monthlyPrice: 59,
    annualPrice: 600,
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_MONTHLY_PRICE_ID || '',
    annualPriceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_ANNUAL_PRICE_ID || '',
    features: [
      'Basic Theme Studio',
      'Menu rename/hide',
      'Login branding',
      'Global search UX',
      'Advanced animations',
      'Marketplace limited (no selling)',
      'Basic support',
      '1 subaccount included'
    ],
    tier: 'starter'
  },
  {
    id: 'pro',
    name: 'Agency Pro OS',
    description: 'Advanced capabilities and selling with client roles',
    monthlyPrice: 149,
    annualPrice: 1500,
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID || '',
    annualPriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_ANNUAL_PRICE_ID || '',
    features: [
      'All Starter features',
      'Unlimited Marketplace downloads',
      'Sell themes/widgets (90% revenue)',
      'Versioning',
      'AI Builder',
      'Navigation layouts',
      'Snapshot branding',
      'Client portal & roles',
      '3 subaccounts included'
    ],
    popular: true,
    tier: 'pro'
  },
  {
    id: 'accelerator',
    name: 'Accelerator OS',
    description: 'Full white-label, reseller mode, and priority support',
    monthlyPrice: 397,
    annualPrice: 3600,
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_ACCELERATOR_MONTHLY_PRICE_ID || '',
    annualPriceId: process.env.NEXT_PUBLIC_STRIPE_ACCELERATOR_ANNUAL_PRICE_ID || '',
    features: [
      'All Pro features',
      'White Label',
      'Support Hub',
      'Project Manager',
      'Funnel Pro Blocks',
      'Analytics',
      'Reseller mode',
      'Priority support',
      'Unlimited subaccounts'
    ],
    tier: 'accelerator'
  }
];

function SubscribePageContent() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  // Using the exported supabase client

  useEffect(() => {
    // Check for user session from cookie or localStorage
    const checkUser = () => {
      // For now, we'll set user to null and handle auth in the component
      // This will be updated when we implement proper session management
      setUser(null);
    };
    checkUser();
  }, []);

  const handleSubscribe = async (plan: PricingPlan) => {
    if (!user) {
      router.push('/auth?redirect=/subscribe');
      return;
    }

    setLoading(plan.id);

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: isAnnual ? plan.annualPriceId : plan.monthlyPriceId,
          planId: plan.id,
          tier: plan.tier,
          userId: user.id,
          userEmail: user.email,
        }),
      });

      const { url, error } = await response.json();

      if (error) {
        console.error('Error creating checkout session:', error);
        return;
      }

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(null);
    }
  };

  const isLocked = searchParams.get('locked') === 'true';

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-[var(--color-bg)]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 gradient-text">
            Choose Your Plan
          </h1>
          <p className="text-xl text-[var(--pg-text-secondary)] mb-8">
            Unlock the full potential of PulseGen Studio
          </p>
          
          {isLocked && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
              <p className="text-amber-800">
                <strong>Subscription Required:</strong> You need an active subscription to access this feature.
              </p>
            </div>
          )}

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-white' : 'text-white/60'}`}>Monthly</span>
            <motion.button
              onClick={() => setIsAnnual(!isAnnual)}
              whileTap={{ scale: 0.98 }}
              className={`relative inline-flex h-8 w-16 items-center rounded-full border border-[var(--pg-border)] bg-white/10 dark:bg-black/20 transition-all`}
            >
              <span className={`absolute left-1 text-xs ${!isAnnual ? 'text-white' : 'text-white/60'}`}>M</span>
              <span className={`absolute right-1 text-xs ${isAnnual ? 'text-white' : 'text-white/60'}`}>Y</span>
              <motion.span
                layout
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className={`inline-block h-6 w-6 rounded-full bg-white shadow-md ${isAnnual ? 'translate-x-8' : 'translate-x-1'}`}
              />
            </motion.button>
            <span className={`text-sm font-medium ${isAnnual ? 'text-white' : 'text-white/60'}`}>Annual</span>
            {isAnnual && (
              <Badge variant="secondary" className="ml-2">Save 17%</Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PRICING_PLANS.map((plan) => (
            <motion.div key={plan.id} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35 }}>
              <Card
                className={`relative transition-transform duration-200 hover:scale-[1.02] ${
                  plan.popular ? 'ring-2 ring-[#0077FF]' : ''
                }`}
              >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="px-4 py-1 gradient-primary text-white border-none">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-[var(--pg-text-secondary)]">
                  {plan.description}
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-[var(--pg-text-secondary)] ml-1">
                    /{isAnnual ? 'year' : 'month'}
                  </span>
                </div>
                {isAnnual && (
                  <p className="text-sm text-green-500 font-medium">
                    Save ${(plan.monthlyPrice * 12) - plan.annualPrice}/year
                  </p>
                )}
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-white/90">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-6">
                <Button
                  onClick={() => handleSubscribe(plan)}
                  disabled={loading === plan.id}
                  className={`w-full ${plan.popular ? 'gradient-primary' : ''}`}
                  size="lg"
                >
                  {loading === plan.id ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    `Get ${plan.name}`
                  )}
                </Button>
              </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Feature Comparison
          </h2>
          <div className="rounded-xl overflow-hidden border border-[var(--pg-border)] bg-[var(--color-card)]">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                    Features
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-white/60 uppercase tracking-wider">
                    Starter
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-white/60 uppercase tracking-wider">
                    Agency Pro
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-white/60 uppercase tracking-wider">
                    Accelerator
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    GHL Locations
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70 text-center">
                    1
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70 text-center">
                    Unlimited
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70 text-center">
                    Unlimited
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    Theme Storage
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70 text-center">
                    Up to 5
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70 text-center">
                    Unlimited
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70 text-center">
                    Unlimited
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    Marketplace Selling
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70 text-center">
                    <span className="text-red-500">✗</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70 text-center">
                    <span className="text-green-500">✓</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70 text-center">
                    <span className="text-green-500">✓</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    White-label Options
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70 text-center">
                    <span className="text-red-500">✗</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70 text-center">
                    <span className="text-green-500">✓</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70 text-center">
                    <span className="text-green-500">✓</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    Reseller Rights
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70 text-center">
                    <span className="text-red-500">✗</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70 text-center">
                    <span className="text-red-500">✗</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70 text-center">
                    <span className="text-green-500">✓</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="rounded-xl border border-[var(--pg-border)] bg-[var(--color-card)] p-6">
              <h3 className="text-lg font-semibold mb-2">
                Can I change my plan later?
              </h3>
              <p className="text-[var(--pg-text-secondary)]">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated and reflected in your next billing cycle.
              </p>
            </div>
            <div className="rounded-xl border border-[var(--pg-border)] bg-[var(--color-card)] p-6">
              <h3 className="text-lg font-semibold mb-2">
                What happens if I cancel?
              </h3>
              <p className="text-[var(--pg-text-secondary)]">
                You can cancel anytime. Your themes will be removed from GHL locations and you'll lose access to premium features, but your account data will be preserved.
              </p>
            </div>
            <div className="rounded-xl border border-[var(--pg-border)] bg-[var(--color-card)] p-6">
              <h3 className="text-lg font-semibold mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-[var(--pg-text-secondary)]">
                We offer a 30-day money-back guarantee for all new subscriptions. Contact support if you're not satisfied.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SubscribePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SubscribePageContent />
    </Suspense>
  );
}
