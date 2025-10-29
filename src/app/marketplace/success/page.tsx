'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Download, 
  Eye, 
  ArrowRight,
  Store,
  CreditCard,
  Calendar,
  User
} from 'lucide-react';
import Link from 'next/link';

interface PurchaseData {
  themeId: string;
  themeName: string;
  price: number;
  purchaseDate: string;
  licenseId: string;
  status: 'success' | 'pending' | 'failed';
}

function MarketplaceSuccessPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [purchaseData, setPurchaseData] = useState<PurchaseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      completePurchase(sessionId);
    } else {
      setIsLoading(false);
    }
  }, [searchParams]);

  const completePurchase = async (sessionId: string) => {
    try {
      const response = await fetch('/api/marketplace/purchase', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json();
      
      if (data.success) {
        setPurchaseData({
          themeId: data.license.theme_id,
          themeName: 'Purchased Theme', // In a real app, this would come from the API
          price: 29.99, // In a real app, this would come from the API
          purchaseDate: new Date().toISOString(),
          licenseId: data.license.id,
          status: 'success',
        });
      } else {
        setPurchaseData({
          themeId: '',
          themeName: 'Unknown Theme',
          price: 0,
          purchaseDate: new Date().toISOString(),
          licenseId: '',
          status: 'failed',
        });
      }
    } catch (error) {
      console.error('Error completing purchase:', error);
      setPurchaseData({
        themeId: '',
        themeName: 'Unknown Theme',
        price: 0,
        purchaseDate: new Date().toISOString(),
        licenseId: '',
        status: 'failed',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTheme = async () => {
    if (!purchaseData) return;

    try {
      const response = await fetch(`/api/marketplace/download/${purchaseData.themeId}`);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${purchaseData.themeName.replace(/\s+/g, '-').toLowerCase()}-theme.json`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading theme:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <Card className="glass-card p-8 text-center">
          <div className="animate-pulse-glow mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mx-auto"></div>
          </div>
          <h2 className="text-xl font-heading gradient-text">Processing Purchase...</h2>
          <p className="text-white/70 mt-2">Please wait while we complete your order</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <Card className="glass-card mb-6">
            <CardContent className="p-8 text-center">
              {purchaseData?.status === 'success' ? (
                <div>
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  </div>
                  <h1 className="text-3xl font-heading gradient-text mb-2">Purchase Successful!</h1>
                  <p className="text-white/70 text-lg">
                    Your theme has been added to your account
                  </p>
                </div>
              ) : (
                <div>
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-red-400" />
                  </div>
                  <h1 className="text-3xl font-heading gradient-text mb-2">Purchase Failed</h1>
                  <p className="text-white/70 text-lg">
                    There was an issue processing your payment
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Purchase Details */}
          {purchaseData && (
            <Card className="glass-card mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Purchase Details
                </CardTitle>
                <CardDescription>
                  Your purchase information and next steps
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-white/70">Theme Name</p>
                    <p className="font-medium text-white">{purchaseData.themeName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/70">Price</p>
                    <p className="font-medium text-white">${purchaseData.price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/70">Purchase Date</p>
                    <p className="font-medium text-white">
                      {new Date(purchaseData.purchaseDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-white/70">License ID</p>
                    <p className="font-medium text-white font-mono text-sm">
                      {purchaseData.licenseId.slice(0, 8)}...
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <Badge className={
                    purchaseData.status === 'success' 
                      ? 'bg-green-500/20 text-green-400 border-green-500/30'
                      : 'bg-red-500/20 text-red-400 border-red-500/30'
                  }>
                    {purchaseData.status === 'success' ? 'Completed' : 'Failed'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          {purchaseData?.status === 'success' && (
            <Card className="glass-card mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRight className="h-5 w-5" />
                  Next Steps
                </CardTitle>
                <CardDescription>
                  What you can do with your new theme
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg glass">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Download className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white">Download Theme Files</h4>
                      <p className="text-sm text-white/70">Get the CSS and JavaScript files for your theme</p>
                    </div>
                    <Button
                      onClick={downloadTheme}
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Download
                    </Button>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg glass">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Eye className="h-5 w-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white">Preview Theme</h4>
                      <p className="text-sm text-white/70">See how your theme looks in GoHighLevel</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Preview
                    </Button>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg glass">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <Store className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white">Deploy to GHL</h4>
                      <p className="text-sm text-white/70">Use the injection system to deploy your theme</p>
                    </div>
                    <Link href="/injection">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        Deploy
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <Link href="/marketplace" className="flex-1">
              <Button
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                <Store className="h-4 w-4 mr-2" />
                Browse More Themes
              </Button>
            </Link>
            
            <Link href="/dashboard" className="flex-1">
              <Button className="w-full bg-gradient-primary hover:opacity-90">
                <ArrowRight className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Button>
            </Link>
          </div>

          {/* Support */}
          <Card className="glass-card mt-6">
            <CardContent className="p-6 text-center">
              <h3 className="font-medium text-white mb-2">Need Help?</h3>
              <p className="text-white/70 text-sm mb-4">
                If you have any questions about your purchase or need assistance with your theme
              </p>
              <Link href="/support">
                <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                  Contact Support
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function MarketplaceSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MarketplaceSuccessPageContent />
    </Suspense>
  );
}
