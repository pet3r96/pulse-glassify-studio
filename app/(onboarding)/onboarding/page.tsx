'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { StepGHLApiKey } from "../../components/onboarding/StepGHLApiKey";
import { StepBaseTheme } from "../../components/onboarding/StepBaseTheme";
import { StepBranding } from "../../components/onboarding/StepBranding";
import { StepThemeSelection } from "../../components/onboarding/StepThemeSelection";
import { StepEmbeddedMode } from "../../components/onboarding/StepEmbeddedMode";
import { completeOnboarding } from "./actions";

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    apiKey: '',
    apiKeyValid: false,
    baseTheme: 'dark' as 'light' | 'dark',
    logoUrl: '',
    faviconUrl: '',
    selectedTheme: null as string | null,
    embeddedMode: false,
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  function updateFormData(data: Partial<typeof formData>) {
    setFormData(prev => ({ ...prev, ...data }));
  }

  function nextStep() {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  }

  function prevStep() {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }

  async function handleComplete() {
    if (!formData.apiKeyValid) {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid GoHighLevel API key",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await completeOnboarding(formData);
      toast({
        title: "Welcome to PulseStudio!",
        description: "Your account is ready. Redirecting to dashboard...",
      });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to complete onboarding",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl glass-card">
        <CardHeader>
          <CardTitle className="font-heading text-2xl gradient-text">
            Welcome to PulseStudio
          </CardTitle>
          <CardDescription>
            Step {currentStep} of {totalSteps}: Let's set up your account
          </CardDescription>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
        <CardContent>
          {currentStep === 1 && (
            <StepGHLApiKey 
              apiKey={formData.apiKey}
              apiKeyValid={formData.apiKeyValid}
              onUpdate={updateFormData}
            />
          )}
          {currentStep === 2 && (
            <StepBaseTheme 
              baseTheme={formData.baseTheme}
              onUpdate={updateFormData}
            />
          )}
          {currentStep === 3 && (
            <StepBranding 
              logoUrl={formData.logoUrl}
              faviconUrl={formData.faviconUrl}
              onUpdate={updateFormData}
            />
          )}
          {currentStep === 4 && (
            <StepThemeSelection 
              selectedTheme={formData.selectedTheme}
              onUpdate={updateFormData}
            />
          )}
          {currentStep === 5 && (
            <StepEmbeddedMode 
              embeddedMode={formData.embeddedMode}
              onUpdate={updateFormData}
            />
          )}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="glass"
            >
              Back
            </Button>
            {currentStep < totalSteps ? (
              <Button
                onClick={nextStep}
                className="gradient-pulse"
                disabled={currentStep === 1 && !formData.apiKeyValid}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                className="gradient-pulse"
                disabled={loading || !formData.apiKeyValid}
              >
                {loading ? "Completing..." : "Complete Setup"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
