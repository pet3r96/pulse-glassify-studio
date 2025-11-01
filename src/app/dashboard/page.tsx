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
        return <Badge className="bg-green-500/20 text-green-400 dark:text-green-300 border-green-500/30">Active</Badge>
      case 'trialing':
        return <Badge className="bg-blue-500/20 text-blue-400 dark:text-blue-300 border-blue-500/30">Trial</Badge>
      case 'canceled':
        return <Badge className="bg-red-500/20 text-red-400 dark:text-red-300 border-red-500/30">Canceled</Badge>
      default:
        return <Badge className="bg-yellow-500/20 text-yellow-400 dark:text-yellow-300 border-yellow-500/30">Incomplete</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <div className="animate-pulse mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[hsl(var(--color-primary))] to-[hsl(var(--color-secondary))] rounded-full mx-auto"></div>
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
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="h1 text-2xl md:text-3xl bg-gradient-primary-accent bg-clip-text text-transparent">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Welcome back, {user.name || 'User'}</p>
            </div>
            <div className="flex items-center gap-4">
              {getSubscriptionBadge(stats.subscription_status)}
              {stats.trial_days_left && (
                <Badge variant="outline" className="bg-card border-border">
                  {stats.trial_days_left} days left
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-gutter-lg">
        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-gutter-lg">
          <Link href="/theme-studio">
            <Card className="group hover:-translate-y-1 transition-all cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-primary-accent rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <Palette className="h-6 w-6 text-white" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <h3 className="h3 text-lg mb-2 text-card-foreground">
                  Theme Studio
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Create and customize themes
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/marketplace">
            <Card className="group hover:-translate-y-1 transition-all cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <Store className="h-6 w-6 text-white" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <h3 className="h3 text-lg mb-2 text-card-foreground">
                  Marketplace
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Buy and sell themes
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/task-manager">
            <Card className="group hover:-translate-y-1 transition-all cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-success to-success/80 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <h3 className="h3 text-lg mb-2 text-card-foreground">
                  Project Manager
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Manage tasks and tickets
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/settings">
            <Card className="group hover:-translate-y-1 transition-all cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-muted to-muted/80 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <Settings className="h-6 w-6 text-foreground" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <h3 className="h3 text-lg mb-2 text-card-foreground">
                  Settings
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Account and preferences
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-gutter-lg">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground metadata mb-1">Themes Created</p>
                  <p className="text-2xl font-bold bg-gradient-primary-accent bg-clip-text text-transparent">{stats.themes_created}</p>
                </div>
                <Palette className="h-8 w-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground metadata mb-1">Active Themes</p>
                  <p className="text-2xl font-bold bg-gradient-primary-accent bg-clip-text text-transparent">{stats.themes_active}</p>
                </div>
                <Zap className="h-8 w-8 text-accent/50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground metadata mb-1">Marketplace Listings</p>
                  <p className="text-2xl font-bold bg-gradient-primary-accent bg-clip-text text-transparent">{stats.marketplace_listings}</p>
                </div>
                <Store className="h-8 w-8 text-accent/50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground metadata mb-1">Total Downloads</p>
                  <p className="text-2xl font-bold bg-gradient-primary-accent bg-clip-text text-transparent">{stats.total_downloads}</p>
                </div>
                <Download className="h-8 w-8 text-success/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-gutter mb-gutter-lg">
          <Card>
            <CardHeader>
              <CardTitle className="h3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Themes
              </CardTitle>
              <CardDescription>Your latest theme creations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-primary-accent rounded-lg flex items-center justify-center shadow-sm">
                      <Palette className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">Dark Glass Theme</p>
                      <p className="text-sm text-muted-foreground">Created 2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-card">Active</Badge>
                    <Link href="/theme-studio">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center shadow-sm">
                      <Store className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">Modern Agency Theme</p>
                      <p className="text-sm text-muted-foreground">Created 1 week ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-card">Marketplace</Badge>
                    <Link href="/marketplace">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="h3 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>Get started with common tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/theme-studio">
                  <Button className="w-full justify-start hover:bg-muted/50" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Theme
                  </Button>
                </Link>
                <Link href="/marketplace">
                  <Button className="w-full justify-start hover:bg-muted/50" variant="outline">
                    <Store className="h-4 w-4 mr-2" />
                    Browse Marketplace
                  </Button>
                </Link>
                <Link href="/theme-studio">
                  <Button className="w-full justify-start hover:bg-muted/50" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Deployment
                  </Button>
                </Link>
                <Link href="/marketplace">
                  <Button className="w-full justify-start hover:bg-muted/50" variant="outline">
                    <Star className="h-4 w-4 mr-2" />
                    Rate Themes
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subscription Status */}
        <Card className="mb-gutter-lg">
          <CardHeader>
            <CardTitle className="h3">Subscription Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/account/billing">
              <Button variant="outline">Manage Subscription</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
