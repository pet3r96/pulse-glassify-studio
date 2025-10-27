'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { 
  Palette,
  Store,
  Users,
  Settings,
  Zap,
  TrendingUp,
  Calendar,
  MessageSquare,
  ArrowRight,
  Plus,
  Eye,
  Download,
  Star
} from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  themes_created: number
  themes_active: number
  marketplace_listings: number
  total_downloads: number
  subscription_status: string
  trial_days_left?: number
}

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<DashboardStats>({
    themes_created: 0,
    themes_active: 0,
    marketplace_listings: 0,
    total_downloads: 0,
    subscription_status: 'incomplete',
  })
  const [loading, setLoading] = useState(true)

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
      
      // Load dashboard stats
      await loadStats(parsedUser)
    } catch (error) {
      console.error('Error loading user:', error)
      router.push('/auth')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async (userData: any) => {
    try {
      // In a real app, this would fetch from API
      // For now, we'll use mock data
      setStats({
        themes_created: 3,
        themes_active: 1,
        marketplace_listings: 2,
        total_downloads: 47,
        subscription_status: userData.subscription_status?.status || 'incomplete',
        trial_days_left: 7,
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const getSubscriptionBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>
      case 'trialing':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Trial</Badge>
      case 'canceled':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Canceled</Badge>
      default:
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Incomplete</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <div className="animate-pulse-glow mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mx-auto"></div>
          </div>
          <h2 className="text-xl font-heading gradient-text">Loading Dashboard...</h2>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div className="border-b border-white/10 glass">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-heading gradient-text">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user.name}</p>
            </div>
            <div className="flex items-center gap-4">
              {getSubscriptionBadge(stats.subscription_status)}
              {stats.trial_days_left && (
                <Badge variant="outline" className="glass">
                  {stats.trial_days_left} days left
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/theme-studio">
            <Card className="glass-card hover:glass-hover transition-all duration-300 group cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Palette className="h-6 w-6 text-white" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <h3 className="font-heading text-lg mb-2 group-hover:gradient-text transition-all">
                  Theme Studio
                </h3>
                <p className="text-sm text-muted-foreground">
                  Create and customize themes
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/marketplace">
            <Card className="glass-card hover:glass-hover transition-all duration-300 group cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Store className="h-6 w-6 text-white" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <h3 className="font-heading text-lg mb-2 group-hover:gradient-text transition-all">
                  Marketplace
                </h3>
                <p className="text-sm text-muted-foreground">
                  Buy and sell themes
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/task-manager">
            <Card className="glass-card hover:glass-hover transition-all duration-300 group cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <h3 className="font-heading text-lg mb-2 group-hover:gradient-text transition-all">
                  Project Manager
                </h3>
                <p className="text-sm text-muted-foreground">
                  Manage tasks and tickets
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/settings">
            <Card className="glass-card hover:glass-hover transition-all duration-300 group cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-slate-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Settings className="h-6 w-6 text-white" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <h3 className="font-heading text-lg mb-2 group-hover:gradient-text transition-all">
                  Settings
                </h3>
                <p className="text-sm text-muted-foreground">
                  Account and preferences
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Themes Created</p>
                  <p className="text-2xl font-bold gradient-text">{stats.themes_created}</p>
                </div>
                <Palette className="h-8 w-8 text-pink-500/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Themes</p>
                  <p className="text-2xl font-bold gradient-text">{stats.themes_active}</p>
                </div>
                <Zap className="h-8 w-8 text-purple-500/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Marketplace Listings</p>
                  <p className="text-2xl font-bold gradient-text">{stats.marketplace_listings}</p>
                </div>
                <Store className="h-8 w-8 text-blue-500/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Downloads</p>
                  <p className="text-2xl font-bold gradient-text">{stats.total_downloads}</p>
                </div>
                <Download className="h-8 w-8 text-green-500/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Themes
              </CardTitle>
              <CardDescription>Your latest theme creations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 glass rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Palette className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Dark Glass Theme</p>
                      <p className="text-sm text-muted-foreground">Created 2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="glass">Active</Badge>
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 glass rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <Store className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Modern Agency Theme</p>
                      <p className="text-sm text-muted-foreground">Created 1 week ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="glass">Marketplace</Badge>
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>Get started with common tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start glass hover:glass-hover">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Theme
                </Button>
                <Button className="w-full justify-start glass hover:glass-hover" variant="outline">
                  <Store className="h-4 w-4 mr-2" />
                  Browse Marketplace
                </Button>
                <Button className="w-full justify-start glass hover:glass-hover" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Deployment
                </Button>
                <Button className="w-full justify-start glass hover:glass-hover" variant="outline">
                  <Star className="h-4 w-4 mr-2" />
                  Rate Themes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subscription Status */}
        {stats.subscription_status !== 'active' && (
          <Card className="glass-card mt-8 border-yellow-500/20 bg-yellow-500/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-lg mb-2">Complete Your Setup</h3>
                  <p className="text-muted-foreground">
                    {stats.subscription_status === 'incomplete' 
                      ? 'Set up billing to unlock all features'
                      : 'Your trial is active - upgrade to continue after trial ends'
                    }
                  </p>
                </div>
                <Button className="btn-primary">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  {stats.subscription_status === 'incomplete' ? 'Set Up Billing' : 'Upgrade Now'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}