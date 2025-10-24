import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Palette, Sparkles, Shield, Code, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-dashboard.jpg";
import logo from "@/assets/pulsegen-logo.png";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 gradient-pulse rounded-full blur-[120px] opacity-20 animate-pulse-glow" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pulseBlue rounded-full blur-[120px] opacity-20 animate-pulse-glow" />
        </div>

        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block glass rounded-full px-4 py-2 text-sm animate-pulse-glow">
                <span className="gradient-text font-semibold">✨ Powered by PulseGen Media</span>
              </div>
              
              <h1 className="font-heading text-5xl lg:text-7xl leading-tight">
                Transform Your
                <span className="gradient-text"> GoHighLevel</span> Dashboard
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-xl">
                Create stunning, custom-branded dashboards for your agency and subaccounts. 
                No OAuth, no complexity—just beautiful themes deployed in seconds.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/auth?mode=signup">
                  <Button size="lg" className="gradient-pulse hover-glow text-lg px-8 py-6">
                    <img src={logo} alt="" className="w-5 h-5 mr-2" />
                    Start Building Free
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="glass border-white/10 hover:border-pulsePurple text-lg px-8 py-6">
                  View Demo
                </Button>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-pulsePink" />
                  <span className="text-sm">No coding required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-pulsePurple" />
                  <span className="text-sm">Secure & private</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="glass-card p-4 animate-pulse-glow">
                <img 
                  src={heroImage} 
                  alt="PulseStudio Dashboard" 
                  className="rounded-xl w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl lg:text-5xl mb-4">
              Everything You Need to
              <span className="gradient-text"> Customize</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional theme builder with real-time preview, marketplace, and instant deployment
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-card hover-glow group cursor-pointer">
              <div className="p-4 rounded-2xl bg-pulsePink/20 w-fit mb-4 group-hover:scale-110 transition-transform">
                <Palette className="w-8 h-8 text-pulsePink" />
              </div>
              <h3 className="font-heading text-2xl mb-3">Visual Theme Builder</h3>
              <p className="text-muted-foreground">
                Drag, drop, and customize every element with live preview. 
                Colors, fonts, layouts—all in real-time.
              </p>
            </div>

            <div className="glass-card hover-glow group cursor-pointer">
              <div className="p-4 rounded-2xl bg-pulsePurple/20 w-fit mb-4 group-hover:scale-110 transition-transform">
                <Code className="w-8 h-8 text-pulsePurple" />
              </div>
              <h3 className="font-heading text-2xl mb-3">CSS/JS Injection</h3>
              <p className="text-muted-foreground">
                Advanced customization with custom CSS and JavaScript. 
                Full control without OAuth complexity.
              </p>
            </div>

            <div className="glass-card hover-glow group cursor-pointer">
              <div className="p-4 rounded-2xl bg-pulseBlue/20 w-fit mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-8 h-8 text-pulseBlue" />
              </div>
              <h3 className="font-heading text-2xl mb-3">Theme Marketplace</h3>
              <p className="text-muted-foreground">
                Buy and sell premium themes. Monetize your designs or 
                jumpstart with pre-built templates.
              </p>
            </div>

            <div className="glass-card hover-glow group cursor-pointer">
              <div className="p-4 rounded-2xl bg-pulsePink/20 w-fit mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-pulsePink" />
              </div>
              <h3 className="font-heading text-2xl mb-3">Role-Based Access</h3>
              <p className="text-muted-foreground">
                Super admin, agency, and subaccount roles with granular 
                permissions and security.
              </p>
            </div>

            <div className="glass-card hover-glow group cursor-pointer">
              <div className="p-4 rounded-2xl bg-pulsePurple/20 w-fit mb-4 group-hover:scale-110 transition-transform">
                <img src={logo} alt="" className="w-8 h-8" />
              </div>
              <h3 className="font-heading text-2xl mb-3">Instant Deployment</h3>
              <p className="text-muted-foreground">
                Apply themes across all subaccounts instantly. 
                One-click rollback if needed.
              </p>
            </div>

            <div className="glass-card hover-glow group cursor-pointer">
              <div className="p-4 rounded-2xl bg-pulseBlue/20 w-fit mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-8 h-8 text-pulseBlue" />
              </div>
              <h3 className="font-heading text-2xl mb-3">Subscription Control</h3>
              <p className="text-muted-foreground">
                Automatic subscription validation and theme rollback 
                for expired accounts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="glass-card text-center space-y-6 relative overflow-hidden">
            <div className="absolute inset-0 gradient-pulse opacity-5" />
            <h2 className="font-heading text-4xl lg:text-5xl relative z-10">
              Ready to Transform Your Dashboards?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto relative z-10">
              Join agencies worldwide building beautiful, custom-branded experiences
            </p>
            <Link to="/auth?mode=signup">
              <Button size="lg" className="gradient-pulse hover-glow text-lg px-8 py-6 relative z-10">
                <img src={logo} alt="" className="w-5 h-5 mr-2" />
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 PulseStudio by PulseGen Media. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
