'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { 
  Check, 
  X, 
  ArrowRight, 
  ArrowLeft,
  Key,
  Palette,
  Upload,
  Settings,
  Zap
} from 'lucide-react'
import { supabase, getCurrentUser, validateGHLApiKey, encryptApiKey } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface OnboardingData {
  apiKey: string
  apiKeyValid: boolean
  baseTheme: 'light' | 'dark'
  logoUrl: string
  faviconUrl: string
  embeddedMode: boolean
}

export default function OnboardingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(false)
  const [user, setUser] = useState<any>(null)
  
  const [formData, setFormData] = useState<OnboardingData>({
    apiKey: '',
    apiKeyValid: false,
    baseTheme: 'dark',
    logoUrl: '',
    faviconUrl: '',
    embeddedMode: false
  })

  const totalSteps = 5
  const progress = (currentStep / totalSteps) * 100

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.push('/auth')
        return
      }
      setUser(currentUser)
    } catch (error) {
      console.error('Error loading user:', error)
      router.push('/auth')
    }
  }

  const updateFormData = (data: Partial<OnboardingData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const validateApiKey = async () => {
    if (!formData.apiKey) {
      toast({
        title: "Error",
        description: "Please enter an API key",
        variant: "destructive",
      })
      return
    }

    setValidating(true)
    try {
      const result = await validateGHLApiKey(formData.apiKey)
      if (result.valid) {
        updateFormData({ apiKeyValid: true })
        toast({
          title: "Success!",
          description: "API key is valid",
        })
      } else {
        updateFormData({ apiKeyValid: false })
        toast({
          title: "Invalid API Key",
          description: "Please check your API key and try again",
          variant: "destructive",
        })
      }
    } catch (error) {
      updateFormData({ apiKeyValid: false })
      toast({
        title: "Error",
        description: "Failed to validate API key",
        variant: "destructive",
      })
    } finally {
      setValidating(false)
    }
  }

  const completeOnboarding = async () => {
    if (!formData.apiKeyValid) {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid GoHighLevel API key",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Create or update agency
      const encryptedApiKey = await encryptApiKey(formData.apiKey)
      
      const { data: agency, error: agencyError } = await (supabase as any)
        .from('agencies')
        .upsert({
          owner_id: user.id,
          name: user.email?.split('@')[0] || 'My Agency',
          ghl_api_key_encrypted: encryptedApiKey,
          ghl_api_key_valid: true,
          ghl_api_key_last_validated: new Date().toISOString(),
          logo_url: formData.logoUrl,
          favicon_url: formData.faviconUrl,
          base_theme: formData.baseTheme,
          embedded_mode_enabled: formData.embeddedMode,
          embedded_token: formData.embeddedMode ? crypto.randomUUID() : null
        })
        .select()
        .single()

      if (agencyError) throw agencyError

      // Update user profile
      const { error: profileError } = await (supabase as any)
        .from('profiles')
        .update({
          agency_id: (agency as any).id,
          onboarding_completed: true
        })
        .eq('id', user.id)

      if (profileError) throw profileError

      toast({
        title: "Welcome to PulseStudio!",
        description: "Your account is ready. Redirecting to dashboard...",
      })

      router.push('/dashboard')
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to complete onboarding",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-heading gradient-text mb-2">GoHighLevel API Key</h3>
              <p className="text-muted-foreground">
                Connect your GoHighLevel account to get started
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="api-key">API Key</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="api-key"
                    type="password"
                    value={formData.apiKey}
                    onChange={(e) => updateFormData({ apiKey: e.target.value, apiKeyValid: false })}
                    placeholder="Enter your GHL API key"
                    className="glass"
                  />
                  <Button
                    onClick={validateApiKey}
                    disabled={validating || !formData.apiKey}
                    className="btn-primary"
                  >
                    {validating ? "Validating..." : "Validate"}
                  </Button>
                </div>
                {formData.apiKeyValid && (
                  <p className="text-sm text-green-400 flex items-center gap-1 mt-2">
                    <Check className="w-4 h-4" /> API key is valid
                  </p>
                )}
                {formData.apiKey && !formData.apiKeyValid && !validating && (
                  <p className="text-sm text-red-400 flex items-center gap-1 mt-2">
                    <X className="w-4 h-4" /> Please validate your API key
                  </p>
                )}
              </div>

              <div className="glass-card p-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Where to find your API key:</strong><br />
                  1. Log into GoHighLevel<br />
                  2. Go to Settings → API Keys<br />
                  3. Create or copy your API key
                </p>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-heading gradient-text mb-2">Base Theme</h3>
              <p className="text-muted-foreground">
                Choose your default theme style
              </p>
            </div>

            <RadioGroup
              value={formData.baseTheme}
              onValueChange={(value) => updateFormData({ baseTheme: value as 'light' | 'dark' })}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark" className="flex-1 cursor-pointer">
                  <div className="glass-card p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-800 rounded"></div>
                      <div>
                        <p className="font-medium">Dark Theme</p>
                        <p className="text-sm text-muted-foreground">Modern, sleek dark interface</p>
                      </div>
                    </div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light" className="flex-1 cursor-pointer">
                  <div className="glass-card p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded"></div>
                      <div>
                        <p className="font-medium">Light Theme</p>
                        <p className="text-sm text-muted-foreground">Clean, bright interface</p>
                      </div>
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-heading gradient-text mb-2">Branding</h3>
              <p className="text-muted-foreground">
                Upload your logo and favicon
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="logo-url">Logo URL</Label>
                <Input
                  id="logo-url"
                  value={formData.logoUrl}
                  onChange={(e) => updateFormData({ logoUrl: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  className="glass mt-2"
                />
              </div>
              <div>
                <Label htmlFor="favicon-url">Favicon URL</Label>
                <Input
                  id="favicon-url"
                  value={formData.faviconUrl}
                  onChange={(e) => updateFormData({ faviconUrl: e.target.value })}
                  placeholder="https://example.com/favicon.ico"
                  className="glass mt-2"
                />
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-heading gradient-text mb-2">Embedded Mode</h3>
              <p className="text-muted-foreground">
                Enable embedded apps inside GoHighLevel
              </p>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Enable Embedded Mode</h4>
                  <p className="text-sm text-muted-foreground">
                    Allow PulseStudio apps to run inside GoHighLevel
                  </p>
                </div>
                <Switch
                  checked={formData.embeddedMode}
                  onCheckedChange={(checked) => updateFormData({ embeddedMode: checked })}
                />
              </div>
            </div>

            {formData.embeddedMode && (
              <div className="glass-card p-4 bg-blue-500/10 border-blue-500/20">
                <p className="text-sm text-blue-400">
                  <strong>Embed Code:</strong> Add this to your GoHighLevel custom CSS:
                </p>
                <code className="block mt-2 p-2 bg-black/20 rounded text-xs font-mono">
                  {`window.addEventListener("message",(e)=>{
if(e.origin.includes("pulsegenstudio.app")&&e.data?.type==="PG_THEME"){
const{css,js}=e.data.payload;
let style=document.querySelector("#pgTheme")||document.createElement("style");
style.id="pgTheme";style.textContent=css;
document.head.appendChild(style);
if(js)eval(js);
}});`}
                </code>
              </div>
            )}
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-heading gradient-text mb-2">Ready to Go!</h3>
              <p className="text-muted-foreground">
                Review your settings and complete setup
              </p>
            </div>

            <div className="glass-card p-6">
              <h4 className="font-medium mb-4">Setup Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>API Key:</span>
                  <span className="text-green-400">✓ Valid</span>
                </div>
                <div className="flex justify-between">
                  <span>Base Theme:</span>
                  <span className="capitalize">{formData.baseTheme}</span>
                </div>
                <div className="flex justify-between">
                  <span>Logo:</span>
                  <span>{formData.logoUrl ? '✓ Set' : 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Favicon:</span>
                  <span>{formData.faviconUrl ? '✓ Set' : 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Embedded Mode:</span>
                  <span>{formData.embeddedMode ? '✓ Enabled' : 'Disabled'}</span>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl glass-card">
        <CardHeader>
          <div className="text-center">
            <h1 className="text-3xl font-heading gradient-text mb-2">
              Welcome to PulseStudio
            </h1>
            <p className="text-muted-foreground">
              Step {currentStep} of {totalSteps}: Let's set up your account
            </p>
            <Progress value={progress} className="mt-4" />
          </div>
        </CardHeader>
        <CardContent>
          {renderStep()}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="glass"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            {currentStep < totalSteps ? (
              <Button
                onClick={nextStep}
                className="btn-primary"
                disabled={currentStep === 1 && !formData.apiKeyValid}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={completeOnboarding}
                className="btn-primary"
                disabled={loading || !formData.apiKeyValid}
              >
                {loading ? "Completing..." : "Complete Setup"}
                <Zap className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
