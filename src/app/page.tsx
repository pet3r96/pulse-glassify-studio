import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import ThemeStudioAccess from "@/components/theme-studio-access"
import { 
  Palette, 
  Zap, 
  Users, 
  BarChart3, 
  Globe, 
  Workflow,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Shield,
  Clock
} from "lucide-react"

export default function HomePage() {
  const features = [
    {
      icon: Palette,
      title: "Theme Studio",
      description: "Visual theme builder with live preview across all GHL interfaces",
      gradient: "from-pink-500/20 to-purple-500/20",
      iconColor: "text-pink-400 dark:text-pink-300"
    },
    {
      icon: Zap,
      title: "Smart Deployment",
      description: "Schedule deployments, version control, and 48-hour rollback window",
      gradient: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-400 dark:text-blue-300"
    },
    {
      icon: Globe,
      title: "Embedded Apps",
      description: "Run PulseStudio tools directly inside GoHighLevel",
      gradient: "from-purple-500/20 to-pink-500/20",
      iconColor: "text-purple-400 dark:text-purple-300"
    },
    {
      icon: Workflow,
      title: "Workflow Automation",
      description: "Create custom workflows and automation triggers",
      gradient: "from-green-500/20 to-emerald-500/20",
      iconColor: "text-green-400 dark:text-green-300"
    },
    {
      icon: MessageSquare,
      title: "Support Hub",
      description: "Integrated project management and support ticket system",
      gradient: "from-yellow-500/20 to-amber-500/20",
      iconColor: "text-yellow-400 dark:text-yellow-300"
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Track theme performance and user engagement",
      gradient: "from-cyan-500/20 to-blue-500/20",
      iconColor: "text-cyan-400 dark:text-cyan-300"
    }
  ]

  const stats = [
    { number: "500+", label: "Agencies" },
    { number: "10K+", label: "Themes Created" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" }
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Agency Owner",
      content: "PulseStudio transformed our client onboarding process. The theme builder is incredibly intuitive.",
      avatar: "SJ"
    },
    {
      name: "Mike Chen",
      role: "Marketing Director",
      content: "The embedded apps feature is a game-changer. Our team can work directly in GoHighLevel now.",
      avatar: "MC"
    },
    {
      name: "Emily Rodriguez",
      role: "Creative Director",
      content: "The marketplace has given us access to amazing themes and components. Highly recommended!",
      avatar: "ER"
    }
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="pt-24 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center max-w-7xl">
          <div className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 shadow-sm mb-8">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium metadata">Now in Beta</span>
          </div>
          
          <h1 className="h1 text-4xl sm:text-5xl md:text-7xl bg-gradient-primary-accent bg-clip-text text-transparent mb-6">
            Transform Your GoHighLevel Experience
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Professional theme builder with deployment infrastructure, version control, 
            and rollback capabilities. The complete UI operating system for GoHighLevel agencies.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link href="/auth?mode=signup">
              <Button size="lg" variant="gradient" className="text-lg px-8 py-6">
                Start Building
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link href="/auth">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                View Demo
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold gradient-text mb-2">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Theme Studio Access for Logged In Users */}
      <ThemeStudioAccess />

      {/* Features Section */}
      <section className="py-gutter-lg px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-gutter-lg">
            <h2 className="h2 text-3xl sm:text-4xl bg-gradient-primary-accent bg-clip-text text-transparent mb-4">
              Everything You Need to Customize GHL
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              From visual theme builders to marketplace integrations, 
              we've got everything agencies need to succeed.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {features.map((feature, index) => (
              <Card key={index} className="group cursor-pointer hover:-translate-y-1 transition-all">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-primary-accent/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="h3 text-xl mb-3 text-card-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-gutter-lg px-4 sm:px-6 lg:px-8 bg-gradient-primary-accent/5">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-gutter-lg">
            <h2 className="h2 text-3xl sm:text-4xl bg-gradient-primary-accent bg-clip-text text-transparent mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Get started in minutes with our simple 3-step process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-gutter max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary-accent rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="h3 text-xl mb-4">Connect Your GHL Account</h3>
              <p className="text-muted-foreground leading-relaxed">
                Enter your GoHighLevel API key to securely connect your account
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="h3 text-xl mb-4">Design Your Theme</h3>
              <p className="text-muted-foreground leading-relaxed">
                Use our visual builder to create custom themes with live preview
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="h3 text-xl mb-4">Deploy & Manage</h3>
              <p className="text-muted-foreground leading-relaxed">
                Deploy themes instantly and manage them with version control
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-gutter-lg px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-gutter-lg">
            <h2 className="h2 text-3xl sm:text-4xl bg-gradient-primary-accent bg-clip-text text-transparent mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Join hundreds of agencies already using PulseStudio
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-gutter">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:-translate-y-1 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gradient-primary-accent rounded-full flex items-center justify-center text-white font-bold mr-3 shadow-sm">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="h4 font-semibold text-card-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground metadata">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[hsl(var(--color-primary))]/20 via-[hsl(var(--color-secondary))]/20 to-[hsl(var(--color-accent))]/20">
        <div className="container mx-auto max-w-7xl text-center">
          <h2 className="font-heading text-3xl sm:text-4xl gradient-text mb-4">
            Ready to Transform Your GHL Experience?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of agencies already using PulseStudio to create 
            stunning, branded GoHighLevel dashboards.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth?mode=signup">
              <Button size="lg" variant="gradient" className="text-lg px-8 py-6">
                Get Started Free
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link href="/auth">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-[hsl(var(--color-primary))] to-[hsl(var(--color-secondary))] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">P</span>
                </div>
                <span className="font-heading text-lg gradient-text">PulseStudio</span>
              </div>
              <p className="text-muted-foreground text-sm">
                The complete UI operating system for GoHighLevel agencies.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/theme-studio" className="hover:text-foreground transition-colors">Theme Studio</Link></li>
                <li><Link href="/marketplace" className="hover:text-foreground transition-colors">Marketplace</Link></li>
                <li><Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/support" className="hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link href="/settings" className="hover:text-foreground transition-colors">Settings</Link></li>
                <li><Link href="/auth" className="hover:text-foreground transition-colors">Sign In</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 PulseGen Media. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
