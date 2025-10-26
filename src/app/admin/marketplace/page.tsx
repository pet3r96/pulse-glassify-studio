'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Download,
  Clock,
  TrendingUp,
  Users,
  DollarSign,
  AlertTriangle,
  Search,
  Filter,
  MoreHorizontal,
  Star,
  Award,
  Palette,
  Code,
  FileText,
  Settings
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface PendingItem {
  id: string
  name: string
  description: string
  type: 'theme' | 'component' | 'template'
  price_cents: number
  preview_url: string
  created_at: string
  author: {
    id: string
    name: string
    email: string
    avatar_url: string
  }
  tags: string[]
  category: string
  status: 'pending' | 'approved' | 'rejected'
  rejection_reason?: string
  admin_notes?: string
}

interface MarketplaceStats {
  total_items: number
  pending_approval: number
  approved_items: number
  rejected_items: number
  total_revenue: number
  monthly_revenue: number
  top_authors: Array<{
    id: string
    name: string
    items_count: number
    revenue: number
  }>
}

export default function AdminMarketplacePage() {
  const { toast } = useToast()
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([])
  const [approvedItems, setApprovedItems] = useState<PendingItem[]>([])
  const [rejectedItems, setRejectedItems] = useState<PendingItem[]>([])
  const [stats, setStats] = useState<MarketplaceStats>({
    total_items: 0,
    pending_approval: 0,
    approved_items: 0,
    rejected_items: 0,
    total_revenue: 0,
    monthly_revenue: 0,
    top_authors: []
  })
  const [loading, setLoading] = useState(false)
  const [selectedItem, setSelectedItem] = useState<PendingItem | null>(null)
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [reviewNotes, setReviewNotes] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    loadPendingItems()
    loadStats()
  }, [])

  const loadPendingItems = async () => {
    setLoading(true)
    try {
      // Mock data - in real implementation, this would fetch from API
      const mockItems: PendingItem[] = [
        {
          id: '1',
          name: 'Dark Mode Dashboard',
          description: 'A sleek dark mode theme for GoHighLevel dashboards with modern UI elements',
          type: 'theme',
          price_cents: 2500,
          preview_url: '/api/placeholder/300/200',
          created_at: '2024-01-15T10:30:00Z',
          author: {
            id: '1',
            name: 'John Designer',
            email: 'john@example.com',
            avatar_url: '/api/placeholder/40/40'
          },
          tags: ['dark-mode', 'dashboard', 'modern'],
          category: 'dashboard',
          status: 'pending'
        },
        {
          id: '2',
          name: 'Contact Form Widget',
          description: 'Advanced contact form component with validation and styling',
          type: 'component',
          price_cents: 1500,
          preview_url: '/api/placeholder/300/200',
          created_at: '2024-01-14T14:20:00Z',
          author: {
            id: '2',
            name: 'Sarah Developer',
            email: 'sarah@example.com',
            avatar_url: '/api/placeholder/40/40'
          },
          tags: ['form', 'widget', 'validation'],
          category: 'forms',
          status: 'pending'
        },
        {
          id: '3',
          name: 'Agency Landing Page',
          description: 'Professional landing page template for agencies',
          type: 'template',
          price_cents: 5000,
          preview_url: '/api/placeholder/300/200',
          created_at: '2024-01-13T09:15:00Z',
          author: {
            id: '3',
            name: 'Mike Agency',
            email: 'mike@agency.com',
            avatar_url: '/api/placeholder/40/40'
          },
          tags: ['landing', 'agency', 'professional'],
          category: 'landing',
          status: 'approved'
        },
        {
          id: '4',
          name: 'Broken Theme',
          description: 'This theme has issues and needs to be rejected',
          type: 'theme',
          price_cents: 1000,
          preview_url: '/api/placeholder/300/200',
          created_at: '2024-01-12T16:45:00Z',
          author: {
            id: '4',
            name: 'Bad Developer',
            email: 'bad@example.com',
            avatar_url: '/api/placeholder/40/40'
          },
          tags: ['broken', 'theme'],
          category: 'dashboard',
          status: 'rejected',
          rejection_reason: 'Theme has CSS errors and does not render properly'
        }
      ]

      setPendingItems(mockItems.filter(item => item.status === 'pending'))
      setApprovedItems(mockItems.filter(item => item.status === 'approved'))
      setRejectedItems(mockItems.filter(item => item.status === 'rejected'))
    } catch (error) {
      console.error('Error loading pending items:', error)
      toast({
        title: "Error",
        description: "Failed to load pending items",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      // Mock data - in real implementation, this would fetch from API
      const mockStats: MarketplaceStats = {
        total_items: 156,
        pending_approval: 12,
        approved_items: 134,
        rejected_items: 10,
        total_revenue: 45678,
        monthly_revenue: 12345,
        top_authors: [
          { id: '1', name: 'ThemeCraft Studio', items_count: 15, revenue: 12500 },
          { id: '2', name: 'BrandMaster', items_count: 12, revenue: 9800 },
          { id: '3', name: 'MobilePro', items_count: 8, revenue: 7200 }
        ]
      }
      setStats(mockStats)
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const handleApprove = async (itemId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setPendingItems(prev => prev.filter(item => item.id !== itemId))
      setApprovedItems(prev => {
        const item = pendingItems.find(i => i.id === itemId)
        return item ? [{ ...item, status: 'approved' as const }, ...prev] : prev
      })
      
      toast({
        title: "Approved!",
        description: "Item has been approved and published to marketplace",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve item",
        variant: "destructive",
      })
    }
  }

  const handleReject = async (itemId: string, reason: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setPendingItems(prev => prev.filter(item => item.id !== itemId))
      setRejectedItems(prev => {
        const item = pendingItems.find(i => i.id === itemId)
        return item ? [{ ...item, status: 'rejected' as const, rejection_reason: reason }, ...prev] : prev
      })
      
      toast({
        title: "Rejected",
        description: "Item has been rejected and author will be notified",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject item",
        variant: "destructive",
      })
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'theme':
        return <Palette className="h-4 w-4" />
      case 'component':
        return <Code className="h-4 w-4" />
      case 'template':
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'theme':
        return 'text-purple-400'
      case 'component':
        return 'text-blue-400'
      case 'template':
        return 'text-green-400'
      default:
        return 'text-gray-400'
    }
  }

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`
  }

  const filteredItems = [...pendingItems, ...approvedItems, ...rejectedItems].filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.author.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div className="glass border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-heading gradient-text flex items-center">
                <Shield className="mr-3 h-8 w-8" />
                Marketplace Admin
              </h1>
              <p className="text-muted-foreground">Manage marketplace items and approvals</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="glass">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">{stats.total_items}</div>
              <p className="text-xs text-muted-foreground">
                +12 from last month
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              <Clock className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">{stats.pending_approval}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting review
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">${stats.total_revenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +${stats.monthly_revenue.toLocaleString()} this month
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">
                {Math.round((stats.approved_items / (stats.approved_items + stats.rejected_items)) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Items approved
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="search">Search</Label>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search items..."
                      className="pl-10 glass"
                    />
                  </div>
                </div>

                <div>
                  <Label>Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="glass mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Top Authors */}
            <Card className="glass-card mt-6">
              <CardHeader>
                <CardTitle>Top Authors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.top_authors.map((author) => (
                    <div key={author.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{author.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {author.items_count} items
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">${author.revenue.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Items List */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="pending" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 glass">
                <TabsTrigger value="pending" className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Pending ({pendingItems.length})
                </TabsTrigger>
                <TabsTrigger value="approved" className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approved ({approvedItems.length})
                </TabsTrigger>
                <TabsTrigger value="rejected" className="flex items-center">
                  <XCircle className="h-4 w-4 mr-2" />
                  Rejected ({rejectedItems.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-4">
                {pendingItems.map((item) => (
                  <Card key={item.id} className="glass-card">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className={`p-2 rounded-lg bg-white/5 ${getTypeColor(item.type)}`}>
                              {getTypeIcon(item.type)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{item.name}</h3>
                              <p className="text-sm text-muted-foreground">{item.type} • {item.category}</p>
                            </div>
                            <Badge className="bg-yellow-500/20 text-yellow-400">
                              Pending Review
                            </Badge>
                          </div>
                          
                          <p className="text-muted-foreground mb-4">{item.description}</p>
                          
                          <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <span className="text-xs text-white font-bold">
                                  {item.author.name.charAt(0)}
                                </span>
                              </div>
                              <span>{item.author.name}</span>
                            </div>
                            <span>•</span>
                            <span>{formatPrice(item.price_cents)}</span>
                            <span>•</span>
                            <span>{new Date(item.created_at).toLocaleDateString()}</span>
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {item.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <Button size="sm" variant="outline" className="glass">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="glass">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(item.id)}
                            className="btn-primary"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedItem(item)
                              setShowReviewDialog(true)
                            }}
                            className="glass"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="approved" className="space-y-4">
                {approvedItems.map((item) => (
                  <Card key={item.id} className="glass-card">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className={`p-2 rounded-lg bg-white/5 ${getTypeColor(item.type)}`}>
                              {getTypeIcon(item.type)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{item.name}</h3>
                              <p className="text-sm text-muted-foreground">{item.type} • {item.category}</p>
                            </div>
                            <Badge className="bg-green-500/20 text-green-400">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approved
                            </Badge>
                          </div>
                          
                          <p className="text-muted-foreground mb-4">{item.description}</p>
                          
                          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <span className="text-xs text-white font-bold">
                                  {item.author.name.charAt(0)}
                                </span>
                              </div>
                              <span>{item.author.name}</span>
                            </div>
                            <span>•</span>
                            <span>{formatPrice(item.price_cents)}</span>
                            <span>•</span>
                            <span>{new Date(item.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <Button size="sm" variant="outline" className="glass">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="glass">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="rejected" className="space-y-4">
                {rejectedItems.map((item) => (
                  <Card key={item.id} className="glass-card">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className={`p-2 rounded-lg bg-white/5 ${getTypeColor(item.type)}`}>
                              {getTypeIcon(item.type)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{item.name}</h3>
                              <p className="text-sm text-muted-foreground">{item.type} • {item.category}</p>
                            </div>
                            <Badge className="bg-red-500/20 text-red-400">
                              <XCircle className="h-3 w-3 mr-1" />
                              Rejected
                            </Badge>
                          </div>
                          
                          <p className="text-muted-foreground mb-4">{item.description}</p>
                          
                          {item.rejection_reason && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
                              <p className="text-sm text-red-400">
                                <strong>Rejection Reason:</strong> {item.rejection_reason}
                              </p>
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <span className="text-xs text-white font-bold">
                                  {item.author.name.charAt(0)}
                                </span>
                              </div>
                              <span>{item.author.name}</span>
                            </div>
                            <span>•</span>
                            <span>{formatPrice(item.price_cents)}</span>
                            <span>•</span>
                            <span>{new Date(item.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <Button size="sm" variant="outline" className="glass">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="glass">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Rejection Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle>Reject Item</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting this item. The author will be notified.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejection-reason">Rejection Reason</Label>
              <Textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain why this item is being rejected..."
                className="glass mt-2"
                rows={4}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowReviewDialog(false)}
                className="glass"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (selectedItem && rejectionReason) {
                    handleReject(selectedItem.id, rejectionReason)
                    setShowReviewDialog(false)
                    setRejectionReason('')
                    setSelectedItem(null)
                  }
                }}
                disabled={!rejectionReason}
                className="bg-red-500 hover:bg-red-600"
              >
                Reject Item
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

