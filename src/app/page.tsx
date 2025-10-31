import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
      color: "text-pink-400",
      bgColor: "bg-pink-500/20"
    },
    {
      icon: Zap,
      title: "Smart Deployment",
      description: "Schedule deployments, version control, and 48-hour rollback window",
      color: "text-blue-400",
      bgColor: "bg-blue-500/20"
    },
    {
      icon: Globe,
      title: "Embedded Apps",
      description: "Run PulseStudio tools directly inside GoHighLevel",
      color: "text-purple-400",
      bgColor: "bg-purple-500/20"
    },
    {
      icon: Workflow,
      title: "Workflow Automation",
      description: "Create custom workflows and automation triggers",
      color: "text-green-400",
      bgColor: "bg-green-500/20"
    },
    {
      icon: MessageSquare,
      title: "Support Hub",
      description: "Integrated project management and support ticket system",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20"
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Track theme performance and user engagement",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/20"
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
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Hero Section */}
      <section className="pt-20 pb-20 px-6">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-6">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium">Now in Beta</span>
          </div>
          
          <h1 className="font-heading text-5xl md:text-7xl gradient-text mb-6">
            Transform Your GoHighLevel Experience
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Professional theme builder with deployment infrastructure, version control, 
            and rollback capabilities. The complete UI operating system for GoHighLevel agencies.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/auth?mode=signup">
              <Button size="lg" className="btn-primary hover-glow text-lg px-8 py-6">
                Start Building
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link href="/auth">
              <Button size="lg" variant="outline" className="glass text-lg px-8 py-6">
                View Demo
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
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
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl gradient-text mb-4">
              Everything You Need to Customize GHL
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From visual theme builders to marketplace integrations, 
              we've got everything agencies need to succeed.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="glass-card hover:glass-hover transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="font-heading text-xl mb-3 group-hover:gradient-text transition-all">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl gradient-text mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Get started in minutes with our simple 3-step process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="font-heading text-xl mb-4">Connect Your GHL Account</h3>
              <p className="text-muted-foreground">
                Enter your GoHighLevel API key to securely connect your account
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="font-heading text-xl mb-4">Design Your Theme</h3>
              <p className="text-muted-foreground">
                Use our visual builder to create custom themes with live preview
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="font-heading text-xl mb-4">Deploy & Manage</h3>
              <p className="text-muted-foreground">
                Deploy themes instantly and manage them with version control
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl gradient-text mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-muted-foreground">
              Join hundreds of agencies already using PulseStudio
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-pink-500/20 to-purple-500/20">
        <div className="container mx-auto text-center">
          <h2 className="font-heading text-4xl gradient-text mb-4">
            Ready to Transform Your GHL Experience?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of agencies already using PulseStudio to create 
            stunning, branded GoHighLevel dashboards.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth?mode=signup">
              <Button size="lg" className="btn-primary hover-glow text-lg px-8 py-6">
                Get Started Free
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link href="/auth">
              <Button size="lg" variant="outline" className="glass text-lg px-8 py-6">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">P</span>
                </div>
                <span className="font-heading text-lg gradient-text">PulseStudio</span>
              </div>
              <p className="text-muted-foreground text-sm">
                The complete UI operating system for GoHighLevel agencies.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/theme-studio" className="hover:text-foreground transition-colors">Theme Studio</Link></li>
                <li><Link href="/marketplace" className="hover:text-foreground transition-colors">Marketplace</Link></li>
                <li><Link href="/analytics" className="hover:text-foreground transition-colors">Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/docs" className="hover:text-foreground transition-colors">Documentation</Link></li>
                <li><Link href="/support" className="hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 PulseGen Media. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}