'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SubscriptionStatus } from '@/components/subscription/SubscriptionStatus';
import { 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ArrowLeft,
  Crown,
  Zap
} from 'lucide-react';
import Link from 'next/link';

interface Plan {
  id: 'agency' | 'subaccount';
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
}

const PLANS: Plan[] = [
  {
    id: 'agency',
    name: 'Agency Plan',
    price: 97,
    features: [
      'Unlimited subaccounts',
      'Full theme customization',
      'Project management tools',
      'Priority support',
      'White-label options',
      'Advanced analytics',
      'Custom integrations'
    ],
    popular: true
  },
  {
    id: 'subaccount',
    name: 'Subaccount Plan',
    price: 27,
    features: [
      'Single location access',
      'Theme customization',
      'Basic support',
      'Standard features',
      'Theme marketplace access'
    ]
  }
];

export default function BillingPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        router.push('/auth');
        return;
      }
      
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      console.error('Error loading user:', error);
      router.push('/auth');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: 'agency' | 'subaccount') => {
    try {
      const response = await fetch('/api/subscription/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  const handleManageBilling = async () => {
    try {
      const response = await fetch('/api/subscription/billing-portal', {
        method: 'POST',
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error opening billing portal:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <div className="animate-pulse-glow mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mx-auto"></div>
          </div>
          <h2 className="text-xl font-heading gradient-text">Loading Billing...</h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div className="border-b border-white/10 glass">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-heading gradient-text">Billing & Subscription</h1>
                <p className="text-muted-foreground">Manage your PulseGen Studio subscription</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Current Subscription Status */}
        <div className="mb-8">
          <SubscriptionStatus userId={user.id} />
        </div>

        {/* Pricing Plans */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-heading gradient-text mb-4">Choose Your Plan</h2>
            <p className="text-muted-foreground text-lg">
              Select the perfect plan for your GoHighLevel agency needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {PLANS.map((plan) => (
              <Card 
                key={plan.id}
                className={`glass-card hover:glass-hover transition-all duration-300 ${
                  plan.popular ? 'border-pink-500/50 bg-pink-500/5' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-primary text-white px-4 py-1">
                      <Crown className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl font-heading gradient-text">
                    {plan.name}
                  </CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold gradient-text">${plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                        <span className="text-white/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    onClick={() => handleSubscribe(plan.id)}
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-primary hover:opacity-90' 
                        : 'glass hover:glass-hover'
                    }`}
                    size="lg"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    {plan.popular ? 'Get Started' : 'Choose Plan'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Billing Management */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Billing Management
            </CardTitle>
            <CardDescription>
              Manage your payment methods, view invoices, and update billing information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white mb-2">Payment Methods & Invoices</h3>
                <p className="text-sm text-muted-foreground">
                  Update your payment method, download invoices, and manage your billing preferences
                </p>
              </div>
              <Button 
                onClick={handleManageBilling}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Manage Billing
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="glass-card mt-8">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>Common questions about PulseGen Studio billing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-white mb-2">Can I change my plan anytime?</h4>
              <p className="text-sm text-muted-foreground">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">What happens if my payment fails?</h4>
              <p className="text-sm text-muted-foreground">
                If payment fails, your subscription will be immediately suspended and themes will revert to default. No grace period is provided.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">Do you offer refunds?</h4>
              <p className="text-sm text-muted-foreground">
                Refunds are handled on a case-by-case basis. Contact support for assistance with billing issues.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
