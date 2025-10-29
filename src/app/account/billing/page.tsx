'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

interface SubscriptionData {
  status: string;
  current_period_end: string;
  stripe_price_id: string;
  plan_name: string;
  amount: number;
  interval: string;
}

export default function BillingPage() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  // Using the exported supabase client

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: subscriptionData, error } = await supabase
        .from('subscription_status')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error || !subscriptionData) {
        console.error('Error fetching subscription:', error);
        setLoading(false);
        return;
      }

      // Map subscription data
      const planInfo = getPlanInfo((subscriptionData as any).stripe_price_id || '');
      
      setSubscription({
        status: (subscriptionData as any).status || 'inactive',
        current_period_end: (subscriptionData as any).current_period_end || '',
        stripe_price_id: (subscriptionData as any).stripe_price_id || '',
        plan_name: planInfo.name,
        amount: planInfo.amount,
        interval: planInfo.interval,
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlanInfo = (priceId: string) => {
    // This would typically come from your Stripe configuration
    const plans: Record<string, { name: string; amount: number; interval: string }> = {
      [process.env.NEXT_PUBLIC_STRIPE_STARTER_MONTHLY_PRICE_ID || '']: {
        name: 'Starter',
        amount: 27,
        interval: 'month'
      },
      [process.env.NEXT_PUBLIC_STRIPE_STARTER_ANNUAL_PRICE_ID || '']: {
        name: 'Starter',
        amount: 270,
        interval: 'year'
      },
      [process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID || '']: {
        name: 'Agency Pro',
        amount: 97,
        interval: 'month'
      },
      [process.env.NEXT_PUBLIC_STRIPE_PRO_ANNUAL_PRICE_ID || '']: {
        name: 'Agency Pro',
        amount: 970,
        interval: 'year'
      },
      [process.env.NEXT_PUBLIC_STRIPE_ACCELERATOR_MONTHLY_PRICE_ID || '']: {
        name: 'Accelerator',
        amount: 197,
        interval: 'month'
      },
      [process.env.NEXT_PUBLIC_STRIPE_ACCELERATOR_ANNUAL_PRICE_ID || '']: {
        name: 'Accelerator',
        amount: 1970,
        interval: 'year'
      }
    };

    return plans[priceId] || { name: 'Unknown Plan', amount: 0, interval: 'month' };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'trialing':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'past_due':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'canceled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <XCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'trialing':
        return <Badge className="bg-blue-100 text-blue-800">Trial</Badge>;
      case 'past_due':
        return <Badge className="bg-yellow-100 text-yellow-800">Past Due</Badge>;
      case 'canceled':
        return <Badge className="bg-red-100 text-red-800">Canceled</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
    }
  };

  const handleManageBilling = async () => {
    setPortalLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      });

      const { url, error } = await response.json();

      if (error) {
        console.error('Error creating portal session:', error);
        return;
      }

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setPortalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">No Active Subscription</h1>
            <p className="text-gray-600 mb-8">
              You don't have an active subscription. Subscribe to access all features.
            </p>
            <Button onClick={() => window.location.href = '/subscribe'}>
              View Plans
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Subscription</h1>
          <p className="text-gray-600">Manage your subscription and billing information</p>
        </div>

        {/* Current Plan */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(subscription.status)}
                  Current Plan
                </CardTitle>
                <CardDescription>
                  {subscription.plan_name} - ${subscription.amount}/{subscription.interval}
                </CardDescription>
              </div>
              {getStatusBadge(subscription.status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Next billing: {new Date(subscription.current_period_end).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Billed {subscription.interval}ly
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Billing Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Billing Management</CardTitle>
            <CardDescription>
              Update your payment method, view invoices, or change your plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                onClick={handleManageBilling}
                disabled={portalLoading}
                className="w-full md:w-auto"
              >
                {portalLoading ? (
                  <div className="flex items-center">
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Manage Billing
                  </div>
                )}
              </Button>
              
              <div className="text-sm text-gray-600">
                <p>• Update payment methods</p>
                <p>• Download invoices</p>
                <p>• Change subscription plan</p>
                <p>• Cancel subscription</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Status Info */}
        {subscription.status === 'past_due' && (
          <Card className="mb-8 border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <AlertTriangle className="w-5 h-5" />
                Payment Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-700 mb-4">
                Your payment failed. Please update your payment method to continue using the service.
              </p>
              <Button
                onClick={handleManageBilling}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                Update Payment Method
              </Button>
            </CardContent>
          </Card>
        )}

        {subscription.status === 'canceled' && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800">
                <XCircle className="w-5 h-5" />
                Subscription Canceled
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700 mb-4">
                Your subscription has been canceled. You can resubscribe at any time.
              </p>
              <Button
                onClick={() => window.location.href = '/subscribe'}
                className="bg-red-600 hover:bg-red-700"
              >
                Resubscribe
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Refresh Button */}
        <div className="text-center">
          <Button
            variant="outline"
            onClick={fetchSubscriptionData}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Status
          </Button>
        </div>
      </div>
    </div>
  );
}
