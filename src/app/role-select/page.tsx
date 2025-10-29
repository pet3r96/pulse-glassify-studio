'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, User, Check, ArrowRight } from 'lucide-react';

interface RoleOption {
  id: 'agency' | 'subaccount';
  name: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  recommended?: boolean;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    id: 'subaccount',
    name: 'Subaccount',
    description: 'Individual user with single GHL location access',
    icon: <User className="w-8 h-8" />,
    features: [
      'Single GHL location access',
      'Basic theme customization',
      'Standard support',
      'Up to 5 themes',
      'Basic analytics'
    ]
  },
  {
    id: 'agency',
    name: 'Agency',
    description: 'Agency owner with multiple client locations',
    icon: <Building2 className="w-8 h-8" />,
    features: [
      'Unlimited GHL locations',
      'Advanced theme customization',
      'Priority support',
      'Unlimited themes',
      'Advanced analytics',
      'Marketplace selling',
      'White-label options',
      'Project management tools'
    ],
    recommended: true
  }
];

export default function RoleSelectPage() {
  const [selectedRole, setSelectedRole] = useState<'agency' | 'subaccount' | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // Using the exported supabase client

  const handleRoleSelect = async (role: 'agency' | 'subaccount') => {
    setLoading(true);

    try {
      // Update user profile with selected role
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth');
        return;
      }

      const { error } = await (supabase as any)
        .from('profiles')
        .update({ role })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating role:', error);
        return;
      }

      // Redirect to subscription page
      router.push('/subscribe');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Role
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Select the role that best describes how you'll use PulseGen Studio
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {ROLE_OPTIONS.map((option) => (
            <Card
              key={option.id}
              className={`relative cursor-pointer transition-all duration-200 hover:shadow-xl ${
                selectedRole === option.id
                  ? 'ring-2 ring-blue-500 shadow-xl'
                  : 'hover:shadow-lg'
              } ${option.recommended ? 'border-blue-200' : ''}`}
              onClick={() => setSelectedRole(option.id)}
            >
              {option.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-4 py-1">
                    <Check className="w-4 h-4 mr-1" />
                    Recommended
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                  {option.icon}
                </div>
                <CardTitle className="text-2xl font-bold">{option.name}</CardTitle>
                <CardDescription className="text-gray-600">
                  {option.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-3">
                  {option.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              {selectedRole === option.id && (
                <div className="absolute inset-0 bg-blue-50 bg-opacity-50 rounded-lg flex items-center justify-center">
                  <div className="bg-blue-600 text-white px-4 py-2 rounded-full font-medium">
                    Selected
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <Button
            onClick={() => selectedRole && handleRoleSelect(selectedRole)}
            disabled={!selectedRole || loading}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              <>
                Continue to Subscription
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Don't worry, you can always change your role later in your account settings.
          </p>
        </div>
      </div>
    </div>
  );
}
