"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Moon, Sun, Palette, Home, BarChart3, Settings, User, CreditCard, Store, Shield } from "lucide-react"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { supabase } from '@/lib/supabase/client'
import { evaluateAccess, getUserSubscriptionStatus } from '@/lib/subscription/utils'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Theme Builder", href: "/theme-builder", icon: Palette },
    { name: "Marketplace", href: "/marketplace", icon: Store },
    { name: "Support Hub", href: "/support", icon: Settings },
    { name: "Project Manager", href: "/project-manager", icon: Settings },
    { name: "Funnel Blocks", href: "/funnel-blocks", icon: Settings },
    { name: "Billing", href: "/billing", icon: CreditCard },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setShowAdmin(false); return }
        const statusRow: any = await getUserSubscriptionStatus(user.id)
        const access = evaluateAccess(statusRow?.status || 'inactive')
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle()
        const isSuper = (profile as any)?.role === 'super_admin'
        setShowAdmin(isSuper && !access.locked)
      } catch (_) { setShowAdmin(false) }
    })()
  }, [])

  // Hide navigation on auth pages
  if (pathname === '/auth' || pathname.startsWith('/auth')) {
    return null;
  }

  if (showAdmin) {
    navigation.push({ name: "Admin", href: "/admin", icon: Shield })
  }

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border">
      <div className="max-w-[1400px] mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-r from-[hsl(var(--color-primary))] to-[hsl(var(--color-secondary))] group-hover:scale-110 transition-transform">
            <Palette className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-heading font-bold bg-gradient-to-r from-[hsl(var(--color-primary))] to-[hsl(var(--color-secondary))] bg-clip-text text-transparent">
            PulseStudio
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-2 transition-colors border-b-2 pb-1 ${
                  isActive
                    ? 'border-accent text-foreground font-semibold'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Link href="/auth">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/auth?mode=signup">
            <Button variant="gradient">Get Started</Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col space-y-4 mt-8">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center space-x-2 transition-colors ${
                        isActive
                          ? 'text-foreground font-semibold'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
                <div className="pt-4 border-t border-border">
                  <Button
                    variant="ghost"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="w-full justify-start mb-2"
                    aria-label="Toggle theme"
                  >
                    {theme === 'dark' ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </Button>
                  <Link href="/auth" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth?mode=signup" onClick={() => setIsOpen(false)}>
                    <Button variant="gradient" className="w-full mt-2">Get Started</Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
