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
import { useToast } from '@/hooks/use-toast'
import { 
  Check, 
  X, 
  ArrowRight, 
  ArrowLeft,
  Key,
  Palette,
  Upload,
  Settings,
  Zap,
  CreditCard,
  Shield
} from 'lucide-react'

interface OnboardingData {
  stripe_customer_id?: string
  subscription_status: 'incomplete' | 'active' | 'trialing'
  base_theme: 'light' | 'dark' | 'glass'
  logo_url: string
  favicon_url: string
  embedded_mode: boolean
  navigation_config: Record<string, any>
}

export default function OnboardingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  
  const [formData, setFormData] = useState<OnboardingData>({
    subscription_status: 'incomplete',
    base_theme: 'glass',
    logo_url: '',
    favicon_url: '',
    embedded_mode: false,
    navigation_config: {}
  })

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const userData = localStorage.getItem('user')
      if (!userData) {
        router.push('/auth')
        return
      }
      
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      
      // Check if user already has active subscription
      if (parsedUser.subscription_status?.status === 'active') {
        router.push('/dashboard')
        return
      }
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

  const createStripeCustomer = async () => {
    try {
      const response = await fetch('/api/stripe/create-customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          name: user.name,
        }),
      })

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      return data.customer_id
    } catch (error: any) {
      throw new Error(`Failed to create Stripe customer: ${error.message}`)
    }
  }

  const completeOnboarding = async () => {
    setLoading(true)
    
    try {
      // Create Stripe customer
      const stripe_customer_id = await createStripeCustomer()
      
      // Update subscription status
      const response = await fetch('/api/subscription/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          stripe_customer_id,
          status: 'trialing', // Start with trial
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update subscription status')
      }

      // Create tenant config
      const configResponse = await fetch('/api/tenant-config/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          owner_type: user.role === 'agency' ? 'agency' : 'subaccount',
          owner_id: user.role === 'agency' ? user.agency_id : user.subaccount_id,
          navigation_config: formData.navigation_config,
          ui_flags: {
            base_theme: formData.base_theme,
            logo_url: formData.logo_url,
            favicon_url: formData.favicon_url,
            embedded_mode: formData.embedded_mode,
          },
        }),
      })

      if (!configResponse.ok) {
        throw new Error('Failed to create tenant configuration')
      }

      toast({
        title: "Welcome to PulseGen Studio!",
        description: "Your account is ready. Redirecting to billing...",
      })

      // Redirect to billing setup
      router.push('/account/billing')
    } catch (error: any) {
      toast({
        title: "Setup Error",
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
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-heading gradient-text mb-2">Welcome to PulseGen Studio</h3>
              <p className="text-muted-foreground">
                Let's set up your GoHighLevel operating system overlay
              </p>
            </div>

            <div className="glass-card p-6">
              <h4 className="font-medium mb-4">What you'll get:</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Complete UI theme control for GoHighLevel</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Real-time theme preview and deployment</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Marketplace to buy/sell themes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Project management and support tools</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Embedded apps inside GoHighLevel</span>
                </div>
              </div>
            </div>

            <div className="glass-card p-4 bg-blue-500/10 border-blue-500/20">
              <p className="text-sm text-blue-400">
                <strong>Account Type:</strong> {user?.role === 'agency' ? 'Agency Owner' : 'Subaccount User'}
              </p>
              <p className="text-sm text-blue-400 mt-1">
                <strong>Name:</strong> {user?.name}
              </p>
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
              value={formData.base_theme}
              onValueChange={(value) => updateFormData({ base_theme: value as 'light' | 'dark' | 'glass' })}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="glass" id="glass" />
                <Label htmlFor="glass" className="flex-1 cursor-pointer">
                  <div className="glass-card p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded backdrop-blur-sm border border-white/10"></div>
                      <div>
                        <p className="font-medium">Glass Theme</p>
                        <p className="text-sm text-muted-foreground">Modern glassmorphism design</p>
                      </div>
                    </div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark" className="flex-1 cursor-pointer">
                  <div className="glass-card p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-800 rounded"></div>
                      <div>
                        <p className="font-medium">Dark Theme</p>
                        <p className="text-sm text-muted-foreground">Sleek dark interface</p>
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
                Upload your logo and favicon (optional)
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="logo-url">Logo URL</Label>
                <Input
                  id="logo-url"
                  value={formData.logo_url}
                  onChange={(e) => updateFormData({ logo_url: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  className="glass mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This will replace the default PulseGen logo in your themes
                </p>
              </div>
              <div>
                <Label htmlFor="favicon-url">Favicon URL</Label>
                <Input
                  id="favicon-url"
                  value={formData.favicon_url}
                  onChange={(e) => updateFormData({ favicon_url: e.target.value })}
                  placeholder="https://example.com/favicon.ico"
                  className="glass mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This will be used as the browser tab icon
                </p>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Enable Embedded Mode</h4>
                  <p className="text-sm text-muted-foreground">
                    Allow PulseGen apps to run inside GoHighLevel
                  </p>
                </div>
                <Switch
                  checked={formData.embedded_mode}
                  onCheckedChange={(checked) => updateFormData({ embedded_mode: checked })}
                />
              </div>
            </div>

            {formData.embedded_mode && (
              <div className="glass-card p-4 bg-blue-500/10 border-blue-500/20">
                <p className="text-sm text-blue-400 mb-2">
                  <strong>Embed Code:</strong> Add this to your GoHighLevel custom CSS:
                </p>
                <code className="block p-3 bg-black/20 rounded text-xs font-mono overflow-x-auto">
                  {`window.addEventListener("message",(e)=>{
if(e.origin.includes("pulsegenstudio")&&e.data?.type==="PG_THEME"){
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

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-white" />
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
                  <span>Account Type:</span>
                  <span className="capitalize">{user?.role}</span>
                </div>
                <div className="flex justify-between">
                  <span>Base Theme:</span>
                  <span className="capitalize">{formData.base_theme}</span>
                </div>
                <div className="flex justify-between">
                  <span>Logo:</span>
                  <span>{formData.logo_url ? '✓ Set' : 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Favicon:</span>
                  <span>{formData.favicon_url ? '✓ Set' : 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Embedded Mode:</span>
                  <span>{formData.embedded_mode ? '✓ Enabled' : 'Disabled'}</span>
                </div>
              </div>
            </div>

            <div className="glass-card p-4 bg-yellow-500/10 border-yellow-500/20">
              <p className="text-sm text-yellow-400">
                <strong>Next:</strong> You'll be redirected to set up billing and start your trial.
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <div className="glass-card p-8 text-center">
          <div className="animate-pulse-glow mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mx-auto"></div>
          </div>
          <h2 className="text-xl font-heading gradient-text">Loading...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl glass-card">
        <CardHeader>
          <div className="text-center">
            <h1 className="text-3xl font-heading gradient-text mb-2">
              Welcome to PulseGen Studio
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
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={completeOnboarding}
                className="btn-primary"
                disabled={loading}
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