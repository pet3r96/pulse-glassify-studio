import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Palette, Users, TrendingUp, LogOut } from "lucide-react";
import logo from "@/assets/pulsegen-logo.png";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    } else {
      setUser(session.user);
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You've been successfully signed out.",
    });
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <img src={logo} alt="Loading" className="w-12 h-12" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="glass-card mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3">
              <img src={logo} alt="PulseGen Media" className="w-10 h-10" />
            </div>
            <div>
              <h1 className="font-heading text-2xl gradient-text">Welcome to PulseStudio</h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Button onClick={handleSignOut} variant="ghost" className="hover:bg-white/5">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="glass-card hover-glow cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-pulsePink/20 group-hover:scale-110 transition-transform">
              <Palette className="w-6 h-6 text-pulsePink" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Themes</p>
              <h3 className="font-heading text-3xl">0</h3>
            </div>
          </div>
        </div>

        <div className="glass-card hover-glow cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-pulsePurple/20 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-pulsePurple" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Subaccounts</p>
              <h3 className="font-heading text-3xl">0</h3>
            </div>
          </div>
        </div>

        <div className="glass-card hover-glow cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-pulseBlue/20 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6 text-pulseBlue" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Revenue</p>
              <h3 className="font-heading text-3xl">$0</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card">
        <h2 className="font-heading text-xl mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button className="gradient-pulse hover-glow justify-start h-auto py-4">
            <Palette className="w-5 h-5 mr-2" />
            <div className="text-left">
              <p className="font-semibold">Create New Theme</p>
              <p className="text-xs opacity-80">Build custom dashboard themes</p>
            </div>
          </Button>
          
          <Button variant="outline" className="glass border-white/10 justify-start h-auto py-4 hover:border-pulsePurple">
            <Users className="w-5 h-5 mr-2" />
            <div className="text-left">
              <p className="font-semibold">Manage Subaccounts</p>
              <p className="text-xs opacity-80">Connect and configure locations</p>
            </div>
          </Button>
        </div>
      </div>

      {/* Getting Started */}
      <div className="glass-card mt-6">
        <h2 className="font-heading text-xl mb-4">Getting Started</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full gradient-pulse flex items-center justify-center text-sm font-bold">1</div>
            <div>
              <p className="font-semibold">Connect Your GoHighLevel API Key</p>
              <p className="text-sm text-muted-foreground">Link your GHL account to start managing themes</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold">2</div>
            <div>
              <p className="font-semibold">Create Your First Theme</p>
              <p className="text-sm text-muted-foreground">Use the theme builder to customize your dashboard</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold">3</div>
            <div>
              <p className="font-semibold">Deploy to Your Subaccounts</p>
              <p className="text-sm text-muted-foreground">Apply themes across all your locations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
