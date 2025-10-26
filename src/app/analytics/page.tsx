'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  MousePointer,
  Clock,
  DollarSign,
  Star,
  Heart,
  Download,
  Upload,
  Palette,
  Target,
  MessageSquare,
  ShoppingCart,
  Settings,
  RefreshCw,
  Calendar,
  Filter,
  Search,
  Download as DownloadIcon,
  Share2,
  MoreHorizontal,
  AlertCircle,
  CheckCircle,
  Info,
  Lightbulb,
  Zap,
  Target as TargetIcon,
  Activity,
  Globe,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface AnalyticsData {
  overview: {
    total_themes: number
    published_themes: number
    marketplace_downloads: number
    total_revenue: number
    active_users: number
    page_views: number
    bounce_rate: number
    avg_session_duration: number
  }
  themes: {
    id: string
    name: string
    views: number
    downloads: number
    rating: number
    revenue: number
    created_at: string
  }[]
  users: {
    date: string
    new_users: number
    active_users: number
    returning_users: number
  }[]
  revenue: {
    date: string
    amount: number
    source: 'marketplace' | 'subscription' | 'custom'
  }[]
  devices: {
    device_type: string
    percentage: number
    count: number
  }[]
  countries: {
    country: string
    percentage: number
    count: number
  }[]
  ai_insights: {
    id: string
    type: 'optimization' | 'trend' | 'alert' | 'suggestion'
    title: string
    description: string
    impact: 'high' | 'medium' | 'low'
    action_required: boolean
    created_at: string
  }[]
}

export default function AnalyticsPage() {
  const { toast } = useToast()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [dateRange, setDateRange] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('overview')
  const [showExportDialog, setShowExportDialog] = useState(false)

  useEffect(() => {
    loadAnalyticsData()
  }, [dateRange])

  const loadAnalyticsData = async () => {
    setLoading(true)
    try {
      // Mock data - in real implementation, this would fetch from Supabase
      const mockData: AnalyticsData = {
        overview: {
          total_themes: 24,
          published_themes: 18,
          marketplace_downloads: 1250,
          total_revenue: 15750,
          active_users: 145,
          page_views: 12500,
          bounce_rate: 32.5,
          avg_session_duration: 8.5
        },
        themes: [
          {
            id: 'theme-1',
            name: 'Modern Dashboard Pro',
            views: 1250,
            downloads: 89,
            rating: 4.8,
            revenue: 2670,
            created_at: '2024-01-15T00:00:00Z'
          },
          {
            id: 'theme-2',
            name: 'Mobile-First Theme',
            views: 980,
            downloads: 67,
            rating: 4.6,
            revenue: 2010,
            created_at: '2024-01-10T00:00:00Z'
          },
          {
            id: 'theme-3',
            name: 'Dark Mode Elite',
            views: 2100,
            downloads: 156,
            rating: 4.9,
            revenue: 4680,
            created_at: '2024-01-05T00:00:00Z'
          }
        ],
        users: [
          { date: '2024-01-01', new_users: 12, active_users: 45, returning_users: 33 },
          { date: '2024-01-02', new_users: 8, active_users: 52, returning_users: 44 },
          { date: '2024-01-03', new_users: 15, active_users: 67, returning_users: 52 },
          { date: '2024-01-04', new_users: 22, active_users: 89, returning_users: 67 },
          { date: '2024-01-05', new_users: 18, active_users: 95, returning_users: 77 },
          { date: '2024-01-06', new_users: 25, active_users: 112, returning_users: 87 },
          { date: '2024-01-07', new_users: 30, active_users: 142, returning_users: 112 }
        ],
        revenue: [
          { date: '2024-01-01', amount: 450, source: 'marketplace' },
          { date: '2024-01-02', amount: 320, source: 'subscription' },
          { date: '2024-01-03', amount: 680, source: 'marketplace' },
          { date: '2024-01-04', amount: 890, source: 'custom' },
          { date: '2024-01-05', amount: 750, source: 'marketplace' },
          { date: '2024-01-06', amount: 920, source: 'subscription' },
          { date: '2024-01-07', amount: 1100, source: 'marketplace' }
        ],
        devices: [
          { device_type: 'Desktop', percentage: 65, count: 8125 },
          { device_type: 'Mobile', percentage: 28, count: 3500 },
          { device_type: 'Tablet', percentage: 7, count: 875 }
        ],
        countries: [
          { country: 'United States', percentage: 35, count: 4375 },
          { country: 'Canada', percentage: 15, count: 1875 },
          { country: 'United Kingdom', percentage: 12, count: 1500 },
          { country: 'Australia', percentage: 10, count: 1250 },
          { country: 'Germany', percentage: 8, count: 1000 },
          { country: 'Other', percentage: 20, count: 2500 }
        ],
        ai_insights: [
          {
            id: 'insight-1',
            type: 'optimization',
            title: 'Theme Load Time Optimization',
            description: 'Your "Modern Dashboard Pro" theme could load 23% faster by optimizing CSS delivery',
            impact: 'high',
            action_required: true,
            created_at: '2024-01-22T10:30:00Z'
          },
          {
            id: 'insight-2',
            type: 'trend',
            title: 'Mobile Usage Increasing',
            description: 'Mobile traffic has increased 15% this week. Consider optimizing mobile themes',
            impact: 'medium',
            action_required: false,
            created_at: '2024-01-22T09:15:00Z'
          },
          {
            id: 'insight-3',
            type: 'suggestion',
            title: 'New Theme Category Trending',
            description: 'Dark mode themes are trending. Consider creating more dark mode options',
            impact: 'medium',
            action_required: false,
            created_at: '2024-01-22T08:45:00Z'
          },
          {
            id: 'insight-4',
            type: 'alert',
            title: 'High Bounce Rate Detected',
            description: 'Bounce rate increased to 45% on theme preview pages. Check loading performance',
            impact: 'high',
            action_required: true,
            created_at: '2024-01-22T07:20:00Z'
          }
        ]
      }

      setData(mockData)
    } catch (error) {
      console.error('Error loading analytics data:', error)
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleExportData = async (format: string) => {
    try {
      // In real implementation, this would generate and download the file
      toast({
        title: "Export Started",
        description: `Exporting data as ${format.toUpperCase()}`,
      })
      setShowExportDialog(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive",
      })
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-500/20 text-red-400'
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'low':
        return 'bg-green-500/20 text-green-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'optimization':
        return <Zap className="h-4 w-4 text-blue-400" />
      case 'trend':
        return <TrendingUp className="h-4 w-4 text-green-400" />
      case 'alert':
        return <AlertCircle className="h-4 w-4 text-red-400" />
      case 'suggestion':
        return <Lightbulb className="h-4 w-4 text-yellow-400" />
      default:
        return <Info className="h-4 w-4 text-gray-400" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div className="glass border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-heading gradient-text">Analytics Dashboard</h1>
              <p className="text-muted-foreground">Track performance and get AI-powered insights</p>
            </div>
            <div className="flex items-center gap-4">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="glass w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              
              <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="glass">
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-card">
                  <DialogHeader>
                    <DialogTitle>Export Analytics Data</DialogTitle>
                    <DialogDescription>
                      Choose the format for your analytics export
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        onClick={() => handleExportData('csv')}
                        className="glass hover:glass-hover"
                      >
                        <DownloadIcon className="h-4 w-4 mr-2" />
                        CSV
                      </Button>
                      <Button
                        onClick={() => handleExportData('pdf')}
                        className="glass hover:glass-hover"
                      >
                        <DownloadIcon className="h-4 w-4 mr-2" />
                        PDF
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={selectedMetric} onValueChange={setSelectedMetric} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 glass">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="themes">Themes</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="glass-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Themes</CardTitle>
                  <Palette className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold gradient-text">{data.overview.total_themes}</div>
                  <p className="text-xs text-muted-foreground">
                    {data.overview.published_themes} published
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Downloads</CardTitle>
                  <Download className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold gradient-text">{data.overview.marketplace_downloads}</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold gradient-text">${data.overview.total_revenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    +8% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Users className="h-4 w-4 text-orange-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold gradient-text">{data.overview.active_users}</div>
                  <p className="text-xs text-muted-foreground">
                    {data.overview.page_views} page views
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Bounce Rate</span>
                      <span className="text-sm font-medium">{data.overview.bounce_rate}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Avg Session Duration</span>
                      <span className="text-sm font-medium">{data.overview.avg_session_duration}m</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Device Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.devices.map((device) => (
                      <div key={device.device_type} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {device.device_type === 'Desktop' && <Monitor className="h-4 w-4" />}
                          {device.device_type === 'Mobile' && <Smartphone className="h-4 w-4" />}
                          {device.device_type === 'Tablet' && <Tablet className="h-4 w-4" />}
                          <span className="text-sm">{device.device_type}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                              style={{ width: `${device.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{device.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Themes Tab */}
          <TabsContent value="themes" className="space-y-6">
            <div className="space-y-4">
              {data.themes.map((theme) => (
                <Card key={theme.id} className="glass-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{theme.name}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Views:</span>
                            <span className="ml-2 font-medium">{theme.views}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Downloads:</span>
                            <span className="ml-2 font-medium">{theme.downloads}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Rating:</span>
                            <span className="ml-2 font-medium flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 mr-1" />
                              {theme.rating}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Revenue:</span>
                            <span className="ml-2 font-medium">${theme.revenue}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" className="glass">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>Daily user activity over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.users.map((day) => (
                    <div key={day.date} className="flex items-center justify-between p-3 glass rounded-lg">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium">{new Date(day.date).toLocaleDateString()}</span>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>New: {day.new_users}</span>
                          <span>Active: {day.active_users}</span>
                          <span>Returning: {day.returning_users}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                            style={{ width: `${(day.active_users / 150) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Daily revenue by source</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.revenue.map((day) => (
                    <div key={day.date} className="flex items-center justify-between p-3 glass rounded-lg">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium">{new Date(day.date).toLocaleDateString()}</span>
                        <Badge variant="secondary" className="text-xs">
                          {day.source}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-green-400" />
                        <span className="font-medium">${day.amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="space-y-4">
              {data.ai_insights.map((insight) => (
                <Card key={insight.id} className="glass-card">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      {getInsightIcon(insight.type)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-lg">{insight.title}</h3>
                          <Badge className={getImpactColor(insight.impact)}>
                            {insight.impact}
                          </Badge>
                          {insight.action_required && (
                            <Badge className="bg-red-500/20 text-red-400">
                              Action Required
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground mb-4">{insight.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {new Date(insight.created_at).toLocaleString()}
                          </span>
                          {insight.action_required && (
                            <Button size="sm" className="btn-primary">
                              Take Action
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
