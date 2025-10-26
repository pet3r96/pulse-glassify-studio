import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import logo from "./assets/pulsegen-logo.png";
import heroDashboard from "./assets/hero-dashboard.jpg";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="group-hover:scale-110 transition-transform">
                <Image src={logo} alt="PulseGen Media" width={40} height={40} />
              </div>
              <div>
                <h1 className="font-heading text-xl gradient-text">PulseStudio</h1>
                <p className="text-[10px] text-muted-foreground">by PulseGen Media</p>
              </div>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link href="/auth">
                <Button variant="ghost" className="hover:bg-white/5">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth?mode=signup">
                <Button className="gradient-pulse hover-glow">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center">
          <h1 className="font-heading text-5xl md:text-7xl gradient-text mb-6">
            Transform Your GoHighLevel Experience
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Professional theme builder with deployment infrastructure, version control, and rollback capabilities
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth?mode=signup">
              <Button size="lg" className="gradient-pulse hover-glow">
                Start Building
              </Button>
            </Link>
            <Link href="/auth">
              <Button size="lg" variant="outline" className="glass">
                View Demo
              </Button>
            </Link>
          </div>
          
          <div className="mt-16 glass-card p-4 rounded-xl max-w-5xl mx-auto">
            <Image 
              src={heroDashboard} 
              alt="PulseStudio Dashboard" 
              className="rounded-lg w-full"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <h2 className="font-heading text-4xl text-center mb-12 gradient-text">
            Enterprise-Grade Theme Management
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-6">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="font-heading text-xl mb-3">Theme Studio</h3>
              <p className="text-muted-foreground">
                Visual theme builder with live preview across all GHL interfaces
              </p>
            </div>
            <div className="glass-card p-6">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="font-heading text-xl mb-3">Smart Deployment</h3>
              <p className="text-muted-foreground">
                Schedule deployments, version control, and 48-hour rollback window
              </p>
            </div>
            <div className="glass-card p-6">
              <div className="text-4xl mb-4">🔌</div>
              <h3 className="font-heading text-xl mb-3">Plugin System</h3>
              <p className="text-muted-foreground">
                Project Manager, Global Search, and custom action buttons
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
