'use client'

import { useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { signup, login, validateGHLAPIKey } from '@/lib/auth'
import { SignupFormData, LoginFormData, UserRole } from '@/lib/supabase/types'
import Link from 'next/link'
import { 
  Mail, 
  Lock, 
  User, 
  Building, 
  ArrowRight,
  Eye,
  EyeOff,
  Key,
  CheckCircle,
  XCircle
} from 'lucide-react'

function AuthForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [ghlApiKeyValidating, setGhlApiKeyValidating] = useState(false)
  const [ghlApiKeyValid, setGhlApiKeyValid] = useState<boolean | null>(null)
  
  const [signupData, setSignupData] = useState<SignupFormData>({
    name: '',
    email: '',
    password: '',
    role: 'agency',
    agency_name: '',
    subaccount_name: '',
    ghl_api_key: ''
  })
  
  const [loginData, setLoginData] = useState<LoginFormData>({
    email: '',
    password: ''
  })

  const validateGHLKey = async (apiKey: string) => {
    if (!apiKey.trim()) {
      setGhlApiKeyValid(null)
      return
    }

    setGhlApiKeyValidating(true)
    try {
      const result = await validateGHLAPIKey(apiKey)
      setGhlApiKeyValid(result.valid)
      
      if (!result.valid) {
        toast({
          title: "Invalid API Key",
          description: result.error || "Please check your GoHighLevel API key",
          variant: "destructive",
        })
      }
    } catch (error) {
      setGhlApiKeyValid(false)
      toast({
        title: "Validation Error",
        description: "Failed to validate API key",
        variant: "destructive",
      })
    } finally {
      setGhlApiKeyValidating(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await login(loginData)
      
      if (result.error) {
        throw new Error(result.error)
      }

      if (!result.data) {
        throw new Error('Login failed')
      }

      // Store user data in localStorage (in production, use proper session management)
      localStorage.setItem('user', JSON.stringify(result.data))
      
      toast({
        title: "Welcome back!",
        description: `Signed in as ${result.data.name}`,
      })

      // Redirect based on subscription status
      if (result.data.subscription_status?.status === 'active') {
        router.push('/dashboard')
      } else {
        router.push('/onboarding')
      }
    } catch (error: any) {
      toast({
        title: "Sign In Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields based on role
    if (signupData.role === 'agency' && !signupData.agency_name) {
      toast({
        title: "Missing Information",
        description: "Please enter your agency name",
        variant: "destructive",
      })
      return
    }
    
    if (signupData.role === 'subaccount' && !signupData.subaccount_name) {
      toast({
        title: "Missing Information", 
        description: "Please enter your subaccount name",
        variant: "destructive",
      })
      return
    }

    if (!signupData.ghl_api_key || !ghlApiKeyValid) {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid GoHighLevel API key",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const result = await signup(signupData)
      
      if (result.error) {
        throw new Error(result.error)
      }

      if (!result.data) {
        throw new Error('Signup failed')
      }

      toast({
        title: "Account Created!",
        description: "Welcome to PulseGen Studio. Redirecting to onboarding...",
      })

      // Store user data
      localStorage.setItem('user', JSON.stringify(result.data))
      
      // Redirect to onboarding
      router.push('/onboarding')
    } catch (error: any) {
      toast({
        title: "Signup Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--color-bg)]">
      <div className="absolute top-6 left-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <div>
            <h1 className="font-heading text-xl gradient-text">PulseGen Studio</h1>
            <p className="text-[10px] text-muted-foreground">GHL Operating System</p>
          </div>
        </Link>
      </div>

      <Card className="w-full max-w-md glass-card">
        <CardHeader className="text-center">
          <CardTitle className="font-heading text-2xl gradient-text">Welcome</CardTitle>
          <CardDescription>Sign in to your account or create a new one</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 glass">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4 mt-6">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signin-email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="you@agency.com"
                      className="pl-10 glass"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter your password"
                      className="pl-10 pr-10 glass"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full btn-primary" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 mt-6">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-name"
                      type="text"
                      value={signupData.name}
                      onChange={(e) => setSignupData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="John Doe"
                      className="pl-10 glass"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      value={signupData.email}
                      onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="you@agency.com"
                      className="pl-10 glass"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      value={signupData.password}
                      onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Create a password"
                      className="pl-10 pr-10 glass"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-role">Account Type</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Select 
                      value={signupData.role} 
                      onValueChange={(value: UserRole) => setSignupData(prev => ({ ...prev, role: value }))}
                    >
                      <SelectTrigger className="pl-10 glass">
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="agency">Agency Owner</SelectItem>
                        <SelectItem value="subaccount">Subaccount User</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {signupData.role === 'agency' && (
                  <div className="space-y-2">
                    <Label htmlFor="signup-agency-name">Agency Name</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-agency-name"
                        type="text"
                        value={signupData.agency_name}
                        onChange={(e) => setSignupData(prev => ({ ...prev, agency_name: e.target.value }))}
                        placeholder="Your Agency Name"
                        className="pl-10 glass"
                        required
                      />
                    </div>
                  </div>
                )}

                {signupData.role === 'subaccount' && (
                  <div className="space-y-2">
                    <Label htmlFor="signup-subaccount-name">Subaccount Name</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-subaccount-name"
                        type="text"
                        value={signupData.subaccount_name}
                        onChange={(e) => setSignupData(prev => ({ ...prev, subaccount_name: e.target.value }))}
                        placeholder="Your Subaccount Name"
                        className="pl-10 glass"
                        required
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="signup-ghl-key">GoHighLevel API Key</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-ghl-key"
                      type="password"
                      value={signupData.ghl_api_key}
                      onChange={(e) => {
                        setSignupData(prev => ({ ...prev, ghl_api_key: e.target.value }))
                        validateGHLKey(e.target.value)
                      }}
                      placeholder="Enter your GHL API key"
                      className="pl-10 pr-10 glass"
                      required
                    />
                    <div className="absolute right-3 top-3 h-4 w-4">
                      {ghlApiKeyValidating ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                      ) : ghlApiKeyValid === true ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : ghlApiKeyValid === false ? (
                        <XCircle className="h-4 w-4 text-red-500" />
                      ) : null}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    We'll validate your API key to ensure you have access to GoHighLevel
                  </p>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full btn-primary" 
                  disabled={loading || ghlApiKeyValidating || !ghlApiKeyValid}
                >
                  {loading ? "Creating account..." : "Create Account"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <div className="glass-card p-8 text-center">
          <div className="animate-pulse-glow mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mx-auto"></div>
          </div>
          <h2 className="text-xl font-heading gradient-text">Loading...</h2>
        </div>
      </div>
    }>
      <AuthForm />
    </Suspense>
  )
}