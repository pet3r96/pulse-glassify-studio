import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, User, Building2, Users } from "lucide-react";
import logo from "@/assets/pulsegen-logo.png";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(searchParams.get("mode") === "signup");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"agency" | "subaccount">("agency");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: {
              full_name: fullName,
              role: role,
            },
          },
        });

        if (error) throw error;

        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Welcome back!",
          description: "You've successfully signed in.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-20 w-96 h-96 gradient-pulse rounded-full blur-[120px] opacity-20 animate-pulse-glow" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pulseBlue rounded-full blur-[120px] opacity-20 animate-pulse-glow" />
      </div>

      <div className="w-full max-w-md">
        <div className="glass-card space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-fit mx-auto mb-4">
              <img src={logo} alt="PulseGen Media" className="w-16 h-16 mx-auto" />
            </div>
            <h1 className="font-heading text-3xl gradient-text">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-muted-foreground">
              {isSignUp 
                ? "Start building your custom dashboards" 
                : "Sign in to continue to PulseStudio"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={isSignUp}
                    className="glass border-white/10 focus:border-pulsePurple"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    Account Type
                  </Label>
                  <RadioGroup value={role} onValueChange={(value) => setRole(value as "agency" | "subaccount")}>
                    <div className="flex items-center space-x-2 glass p-4 rounded-lg border border-white/10 hover:border-pulsePurple/50 transition-colors">
                      <RadioGroupItem value="agency" id="agency" />
                      <Label htmlFor="agency" className="flex items-center gap-2 cursor-pointer flex-1">
                        <Building2 className="w-4 h-4" />
                        <div>
                          <div className="font-medium">Agency</div>
                          <div className="text-xs text-muted-foreground">Manage multiple subaccounts</div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 glass p-4 rounded-lg border border-white/10 hover:border-pulsePurple/50 transition-colors">
                      <RadioGroupItem value="subaccount" id="subaccount" />
                      <Label htmlFor="subaccount" className="flex items-center gap-2 cursor-pointer flex-1">
                        <Users className="w-4 h-4" />
                        <div>
                          <div className="font-medium">Subaccount</div>
                          <div className="text-xs text-muted-foreground">Individual account access</div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="glass border-white/10 focus:border-pulsePurple"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="glass border-white/10 focus:border-pulsePurple"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full gradient-pulse hover-glow text-lg py-6"
              disabled={loading}
            >
              {loading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
            </Button>
          </form>

          {/* Toggle */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-muted-foreground hover:text-pulsePurple transition-colors"
            >
              {isSignUp 
                ? "Already have an account? Sign in" 
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
