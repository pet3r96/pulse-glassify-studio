'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, CreditCard } from 'lucide-react';
import { getUserSubscriptionStatus } from '@/lib/subscription/utils';

interface SubscriptionStatusProps {
  userId: string;
}

export function SubscriptionStatus({ userId }: SubscriptionStatusProps) {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const response = await fetch('/api/subscription/status');
        const data = await response.json();
        setSubscription(data);
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubscription();
  }, []);

  const handleSubscribe = async (plan: 'agency' | 'subaccount') => {
    try {
      const response = await fetch('/api/subscription/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
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
      <Card className="bg-surface/50 backdrop-blur-sm border-white/10">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-white/20 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-white/10 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card className="bg-surface/50 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <XCircle className="h-5 w-5 text-red-400" />
            Subscription Required
          </CardTitle>
          <CardDescription className="text-white/70">
            Choose a plan to access all PulseGen Studio features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <h3 className="font-semibold text-white mb-2">Agency Plan</h3>
              <p className="text-2xl font-bold text-white mb-2">$97<span className="text-sm text-white/70">/month</span></p>
              <ul className="text-sm text-white/70 space-y-1 mb-4">
                <li>• Unlimited subaccounts</li>
                <li>• Full theme customization</li>
                <li>• Project management tools</li>
                <li>• Priority support</li>
              </ul>
              <Button 
                onClick={() => handleSubscribe('agency')}
                className="w-full bg-gradient-primary hover:opacity-90"
              >
                Subscribe
              </Button>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <h3 className="font-semibold text-white mb-2">Subaccount Plan</h3>
              <p className="text-2xl font-bold text-white mb-2">$27<span className="text-sm text-white/70">/month</span></p>
              <ul className="text-sm text-white/70 space-y-1 mb-4">
                <li>• Single location access</li>
                <li>• Theme customization</li>
                <li>• Basic support</li>
                <li>• Standard features</li>
              </ul>
              <Button 
                onClick={() => handleSubscribe('subaccount')}
                className="w-full bg-gradient-primary hover:opacity-90"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = () => {
    switch (subscription.status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'trialing':
        return <AlertCircle className="h-5 w-5 text-yellow-400" />;
      case 'past_due':
        return <XCircle className="h-5 w-5 text-red-400" />;
      case 'canceled':
        return <XCircle className="h-5 w-5 text-red-400" />;
      default:
        return <XCircle className="h-5 w-5 text-red-400" />;
    }
  };

  const getStatusColor = () => {
    switch (subscription.status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'trialing':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'past_due':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'canceled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
  };

  return (
    <Card className="bg-surface/50 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          {getStatusIcon()}
          Subscription Status
        </CardTitle>
        <CardDescription className="text-white/70">
          Manage your PulseGen Studio subscription
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-medium">{subscription.plan || 'Unknown Plan'}</p>
            <Badge className={`${getStatusColor()} border`}>
              {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
            </Badge>
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
        
        {subscription.currentPeriodEnd && (
          <div className="text-sm text-white/70">
            <p>Next billing: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}</p>
          </div>
        )}

        {!subscription.hasAccess && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-red-400 text-sm">
              Your subscription is inactive. Please update your payment method to continue using PulseGen Studio.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
