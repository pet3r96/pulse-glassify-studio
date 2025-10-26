'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  Users, 
  BarChart3, 
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react'

export default function AdminPage() {
  const stats = [
    { label: 'Total Users', value: '1,234', change: '+12%', color: 'text-blue-400' },
    { label: 'Active Agencies', value: '456', change: '+8%', color: 'text-green-400' },
    { label: 'Themes Created', value: '8,901', change: '+23%', color: 'text-purple-400' },
    { label: 'Revenue', value: '$45,678', change: '+15%', color: 'text-yellow-400' }
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'user_registration',
      message: 'New agency "Creative Solutions" registered',
      timestamp: '2 minutes ago',
      status: 'success'
    },
    {
      id: 2,
      type: 'theme_upload',
      message: 'Theme "Modern Dashboard" uploaded to marketplace',
      timestamp: '15 minutes ago',
      status: 'pending'
    },
    {
      id: 3,
      type: 'payment_received',
      message: 'Payment of $99 received from Agency Pro',
      timestamp: '1 hour ago',
      status: 'success'
    },
    {
      id: 4,
      type: 'system_alert',
      message: 'High CPU usage detected on server 3',
      timestamp: '2 hours ago',
      status: 'warning'
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />
      case 'pending':
        return <Clock className="h-4 w-4 text-blue-400" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div className="glass border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-heading gradient-text flex items-center">
                <Shield className="mr-3 h-8 w-8" />
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">System administration and monitoring</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="glass">
                <Settings className="h-4 w-4 mr-2" />
                System Settings
              </Button>
              <Button className="btn-primary">
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                <p className={`text-xs ${stat.color} flex items-center`}>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  System events and user activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 glass rounded-lg">
                      {getStatusIcon(activity.status)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common administrative tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Users
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    System Settings
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Shield className="h-4 w-4 mr-2" />
                    Security Logs
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card mt-6">
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Status</span>
                    <Badge className="bg-green-500/20 text-green-400">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database</span>
                    <Badge className="bg-green-500/20 text-green-400">Healthy</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">CDN</span>
                    <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Backups</span>
                    <Badge className="bg-yellow-500/20 text-yellow-400">Pending</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
