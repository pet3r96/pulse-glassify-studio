'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Palette, 
  Zap, 
  Users, 
  BarChart3, 
  Settings, 
  Plus,
  Eye,
  Download,
  Upload,
  Globe,
  Workflow,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import { supabase, getCurrentUser, getUserProfile, getUserAgency } from '@/lib/supabase/client'
import Link from 'next/link'

interface DashboardStats {
  totalThemes: number
  activeDeployments: number
  teamMembers: number
  supportTickets: number
  completedTasks: number
  pendingTasks: number
}

interface RecentActivity {
  id: string
  type: 'theme' | 'deployment' | 'task' | 'ticket'
  title: string
  description: string
  timestamp: string
  status: 'success' | 'warning' | 'error' | 'info'
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [agency, setAgency] = useState<any>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalThemes: 0,
    activeDeployments: 0,
    teamMembers: 0,
    supportTickets: 0,
    completedTasks: 0,
    pendingTasks: 0
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.push('/auth')
        return
      }

      const userProfile = await getUserProfile(currentUser.id)
      const userAgency = await getUserAgency(currentUser.id)

      setUser(currentUser)
      setProfile(userProfile)
      setAgency(userAgency)

      // Load dashboard stats
      await loadStats((userAgency as any)?.id)
      await loadRecentActivity((userAgency as any)?.id)

    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async (agencyId: string) => {
    if (!agencyId) return

    try {
      const { data: themes } = await (supabase as any)
        .from('themes')
        .select('id')
        .eq('agency_id', agencyId)

      const { data: deployments } = await (supabase as any)
        .from('theme_deployments')
        .select('id')
        .eq('agency_id', agencyId)
        .gte('rollback_available_until', new Date().toISOString())

      const { data: members } = await (supabase as any)
        .from('profiles')
        .select('id')
        .eq('agency_id', agencyId)

      const { data: tickets } = await (supabase as any)
        .from('support_tickets')
        .select('id')
        .eq('agency_id', agencyId)

      const { data: tasks } = await (supabase as any)
        .from('tasks')
        .select('id, status')
        .eq('agency_id', agencyId)

      const completedTasks = tasks?.filter((task: any) => task.status === 'completed').length || 0
      const pendingTasks = tasks?.filter((task: any) => task.status !== 'completed').length || 0

      setStats({
        totalThemes: themes?.length || 0,
        activeDeployments: deployments?.length || 0,
        teamMembers: members?.length || 0,
        supportTickets: tickets?.length || 0,
        completedTasks,
        pendingTasks
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const loadRecentActivity = async (agencyId: string) => {
    if (!agencyId) return

    try {
      // This would be a more complex query in a real implementation
      // For now, we'll create mock data
      setRecentActivity([
        {
          id: '1',
          type: 'theme',
          title: 'Modern Dashboard Theme',
          description: 'Theme deployed successfully',
          timestamp: '2 hours ago',
          status: 'success'
        },
        {
          id: '2',
          type: 'task',
          title: 'Update client branding',
          description: 'Task completed by John Doe',
          timestamp: '4 hours ago',
          status: 'success'
        },
        {
          id: '3',
          type: 'ticket',
          title: 'Login issue reported',
          description: 'New support ticket created',
          timestamp: '6 hours ago',
          status: 'warning'
        }
      ])
    } catch (error) {
      console.error('Error loading recent activity:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <div className="animate-pulse-glow mb-4">
            <Palette className="h-12 w-12 mx-auto text-purple-400" />
          </div>
          <h2 className="text-xl font-heading gradient-text">Loading PulseStudio...</h2>
          <p className="text-muted-foreground mt-2">Setting up your dashboard</p>
        </div>
      </div>
    )
  }

  const quickActions = [
    {
      title: 'Theme Studio',
      description: 'Create and customize themes',
      icon: Palette,
      href: '/theme-studio',
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/20'
    },
    {
      title: 'Deploy Theme',
      description: 'Deploy to GoHighLevel',
      icon: Zap,
      href: '/deploy',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      title: 'Team Members',
      description: 'Manage your team',
      icon: Users,
      href: '/team',
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      title: 'Analytics',
      description: 'View performance data',
      icon: BarChart3,
      href: '/analytics',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-400" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" />
      default:
        return <Clock className="h-4 w-4 text-blue-400" />
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div className="glass border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-heading gradient-text">
                Welcome back, {profile?.full_name || 'User'}!
              </h1>
              <p className="text-muted-foreground">
                {agency?.name || 'Your Agency'} • {profile?.role?.replace('_', ' ').toUpperCase()}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="glass">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                New Theme
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Themes</CardTitle>
              <Palette className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">{stats.totalThemes}</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Deployments</CardTitle>
              <Zap className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">{stats.activeDeployments}</div>
              <p className="text-xs text-muted-foreground">
                Live on GoHighLevel
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">{stats.teamMembers}</div>
              <p className="text-xs text-muted-foreground">
                Active collaborators
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Support Tickets</CardTitle>
              <MessageSquare className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">{stats.supportTickets}</div>
              <p className="text-xs text-muted-foreground">
                Open requests
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-heading gradient-text mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <Card className="glass-hover cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg ${action.bgColor}`}>
                          <action.icon className={`h-6 w-6 ${action.color}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold group-hover:gradient-text transition-all">
                            {action.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-2xl font-heading gradient-text mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <Card key={activity.id} className="glass-card">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      {getStatusIcon(activity.status)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {activity.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {activity.timestamp}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Trial Status */}
        {agency?.subscription_status === 'trial' && (
          <Card className="glass-card mt-8 border-yellow-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-yellow-400">Trial Period</h3>
                  <p className="text-muted-foreground">
                    Your trial ends in {Math.ceil((new Date(agency.trial_ends_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                  </p>
                </div>
                <Button className="btn-primary">
                  Upgrade Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}