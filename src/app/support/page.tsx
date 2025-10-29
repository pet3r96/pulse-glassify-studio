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
  Plus, 
  Search, 
  Filter, 
  MessageSquare,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
  Edit,
  Trash2,
  Flag,
  Bell,
  Settings,
  BarChart3,
  Ticket,
  Mail,
  Phone,
  Calendar,
  Tag,
  UserCheck,
  Reply,
  Archive,
  Star,
  Crown,
  ArrowRight
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import { UpgradeModal } from '@/components/ui/upgrade-modal'
import { evaluateAccess, getUserSubscriptionStatus } from '@/lib/subscription/utils'

interface SupportTicket {
  id: string
  subject: string
  description: string
  status: 'open' | 'in_progress' | 'closed' | 'pending'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: 'technical' | 'billing' | 'feature_request' | 'bug_report' | 'general'
  assigned_to: string | null
  assigned_user?: {
    id: string
    name: string
    avatar_url: string
  }
  created_by: string
  created_user?: {
    id: string
    name: string
    avatar_url: string
  }
  created_at: string
  updated_at: string
  last_reply_at: string | null
  replies_count: number
  is_urgent: boolean
  tags: string[]
  satisfaction_rating?: number
  resolution_notes?: string
}

interface TicketStats {
  total_tickets: number
  open_tickets: number
  in_progress_tickets: number
  closed_tickets: number
  urgent_tickets: number
  avg_response_time: number
  satisfaction_score: number
}

export default function SupportPage() {
  const { toast } = useToast()
  const [locked, setLocked] = useState(false)
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [stats, setStats] = useState<TicketStats>({
    total_tickets: 0,
    open_tickets: 0,
    in_progress_tickets: 0,
    closed_tickets: 0,
    urgent_tickets: 0,
    avg_response_time: 0,
    satisfaction_score: 0
  })
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    category: 'general' as const,
    tags: [] as string[]
  })

  useEffect(() => {
    loadTickets()
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLocked(true); return }
      const statusRow: any = await getUserSubscriptionStatus(user.id)
      const access = evaluateAccess(statusRow?.status || 'inactive')
      setLocked(access.locked)
    })()
  }, [])

  useEffect(() => {
    calculateStats()
  }, [tickets])

  const loadTickets = async () => {
    setLoading(true)
    try {
      // Mock data - in real implementation, this would fetch from Supabase
      const mockTickets: SupportTicket[] = [
        {
          id: '1',
          subject: 'Theme not applying correctly in GoHighLevel',
          description: 'I uploaded a theme but it\'s not showing up in my GoHighLevel dashboard. The preview looks correct but the actual application seems to be broken.',
          status: 'in_progress',
          priority: 'high',
          category: 'technical',
          assigned_to: 'support1',
          assigned_user: {
            id: 'support1',
            name: 'Sarah Support',
            avatar_url: '/api/placeholder/40/40'
          },
          created_by: 'user1',
          created_user: {
            id: 'user1',
            name: 'John Customer',
            avatar_url: '/api/placeholder/40/40'
          },
          created_at: '2024-01-20T10:30:00Z',
          updated_at: '2024-01-21T14:20:00Z',
          last_reply_at: '2024-01-21T14:20:00Z',
          replies_count: 3,
          is_urgent: false,
          tags: ['theme', 'ghl-integration', 'deployment'],
          satisfaction_rating: undefined
        },
        {
          id: '2',
          subject: 'Billing question about subscription upgrade',
          description: 'I want to upgrade my subscription but I\'m not sure which plan would be best for my agency. Can you help me understand the differences?',
          status: 'open',
          priority: 'medium',
          category: 'billing',
          assigned_to: null,
          created_by: 'user2',
          created_user: {
            id: 'user2',
            name: 'Mike Agency',
            avatar_url: '/api/placeholder/40/40'
          },
          created_at: '2024-01-21T09:15:00Z',
          updated_at: '2024-01-21T09:15:00Z',
          last_reply_at: null,
          replies_count: 0,
          is_urgent: false,
          tags: ['billing', 'subscription', 'upgrade']
        },
        {
          id: '3',
          subject: 'Feature request: Dark mode for theme studio',
          description: 'It would be great to have a dark mode option for the theme studio interface. Working late at night with the bright interface is straining my eyes.',
          status: 'pending',
          priority: 'low',
          category: 'feature_request',
          assigned_to: 'dev1',
          assigned_user: {
            id: 'dev1',
            name: 'Alex Developer',
            avatar_url: '/api/placeholder/40/40'
          },
          created_by: 'user3',
          created_user: {
            id: 'user3',
            name: 'Lisa Designer',
            avatar_url: '/api/placeholder/40/40'
          },
          created_at: '2024-01-19T16:45:00Z',
          updated_at: '2024-01-20T11:30:00Z',
          last_reply_at: '2024-01-20T11:30:00Z',
          replies_count: 2,
          is_urgent: false,
          tags: ['feature-request', 'ui', 'dark-mode']
        },
        {
          id: '4',
          subject: 'Critical: Dashboard completely broken after theme deployment',
          description: 'URGENT: After deploying a theme, my entire GoHighLevel dashboard is showing a white screen. This is affecting my business operations.',
          status: 'open',
          priority: 'urgent',
          category: 'bug_report',
          assigned_to: null,
          created_by: 'user4',
          created_user: {
            id: 'user4',
            name: 'Emergency User',
            avatar_url: '/api/placeholder/40/40'
          },
          created_at: '2024-01-22T08:30:00Z',
          updated_at: '2024-01-22T08:30:00Z',
          last_reply_at: null,
          replies_count: 0,
          is_urgent: true,
          tags: ['urgent', 'bug', 'dashboard', 'white-screen']
        },
        {
          id: '5',
          subject: 'How to integrate with Zapier?',
          description: 'I want to connect PulseGen Studio with Zapier to automate some workflows. Is this possible and how do I set it up?',
          status: 'closed',
          priority: 'low',
          category: 'general',
          assigned_to: 'support2',
          assigned_user: {
            id: 'support2',
            name: 'Tom Support',
            avatar_url: '/api/placeholder/40/40'
          },
          created_by: 'user5',
          created_user: {
            id: 'user5',
            name: 'Automation User',
            avatar_url: '/api/placeholder/40/40'
          },
          created_at: '2024-01-18T14:20:00Z',
          updated_at: '2024-01-19T10:15:00Z',
          last_reply_at: '2024-01-19T10:15:00Z',
          replies_count: 4,
          is_urgent: false,
          tags: ['integration', 'zapier', 'automation'],
          satisfaction_rating: 5,
          resolution_notes: 'Provided detailed integration guide and API documentation'
        }
      ]
      setTickets(mockTickets)
    } catch (error) {
      console.error('Error loading tickets:', error)
      toast({
        title: "Error",
        description: "Failed to load support tickets",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = () => {
    const totalTickets = tickets.length
    const openTickets = tickets.filter(ticket => ticket.status === 'open').length
    const inProgressTickets = tickets.filter(ticket => ticket.status === 'in_progress').length
    const closedTickets = tickets.filter(ticket => ticket.status === 'closed').length
    const urgentTickets = tickets.filter(ticket => ticket.priority === 'urgent' || ticket.is_urgent).length
    
    // Calculate average response time (mock data)
    const avgResponseTime = 2.5 // hours
    
    // Calculate satisfaction score
    const ratedTickets = tickets.filter(ticket => ticket.satisfaction_rating)
    const satisfactionScore = ratedTickets.length > 0 
      ? ratedTickets.reduce((sum, ticket) => sum + (ticket.satisfaction_rating || 0), 0) / ratedTickets.length
      : 0

    setStats({
      total_tickets: totalTickets,
      open_tickets: openTickets,
      in_progress_tickets: inProgressTickets,
      closed_tickets: closedTickets,
      urgent_tickets: urgentTickets,
      avg_response_time: avgResponseTime,
      satisfaction_score: satisfactionScore
    })
  }

  const handleCreateTicket = async () => {
    if (!newTicket.subject.trim() || !newTicket.description.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both subject and description",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const ticket: SupportTicket = {
        id: Date.now().toString(),
        subject: newTicket.subject,
        description: newTicket.description,
        status: 'open',
        priority: newTicket.priority,
        category: newTicket.category,
        assigned_to: null,
        created_by: 'current-user',
        created_user: {
          id: 'current-user',
          name: 'You',
          avatar_url: '/api/placeholder/40/40'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_reply_at: null,
        replies_count: 0,
        is_urgent: newTicket.priority === 'urgent',
        tags: newTicket.tags
      }

      setTickets(prev => [ticket, ...prev])
      setNewTicket({
        subject: '',
        description: '',
        priority: 'medium',
        category: 'general',
        tags: []
      })
      setShowCreateDialog(false)
      
      toast({
        title: "Ticket Created",
        description: "Your support ticket has been created successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create ticket",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateTicketStatus = async (ticketId: string, newStatus: SupportTicket['status']) => {
    try {
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, status: newStatus, updated_at: new Date().toISOString() }
          : ticket
      ))
      
      toast({
        title: "Ticket Updated",
        description: `Ticket status updated to ${newStatus.replace('_', ' ')}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update ticket status",
        variant: "destructive",
      })
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500/20 text-red-400'
      case 'high':
        return 'bg-orange-500/20 text-orange-400'
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'low':
        return 'bg-green-500/20 text-green-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-4 w-4 text-red-400" />
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-400" />
      case 'closed':
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-400" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical':
        return <Settings className="h-4 w-4" />
      case 'billing':
        return <MessageSquare className="h-4 w-4" />
      case 'feature_request':
        return <Star className="h-4 w-4" />
      case 'bug_report':
        return <AlertCircle className="h-4 w-4" />
      case 'general':
        return <MessageSquare className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter
    const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory
  })

  return (
    <>
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div className="glass border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-heading gradient-text">Support Center</h1>
              <p className="text-muted-foreground">Manage support tickets and customer inquiries</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="glass" onClick={() => setUpgradeOpen(true)} disabled={!locked}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button className="btn-primary" disabled={locked}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Ticket
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-card max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create Support Ticket</DialogTitle>
                    <DialogDescription>
                      Submit a new support request or question
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="ticket-subject">Subject</Label>
                      <Input
                        id="ticket-subject"
                        value={newTicket.subject}
                        onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="Brief description of your issue"
                        className="glass mt-2"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="ticket-priority">Priority</Label>
                        <Select
                          value={newTicket.priority}
                          onValueChange={(value) => setNewTicket(prev => ({ ...prev, priority: value as any }))}
                        >
                          <SelectTrigger className="glass mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="ticket-category">Category</Label>
                        <Select
                          value={newTicket.category}
                          onValueChange={(value) => setNewTicket(prev => ({ ...prev, category: value as any }))}
                        >
                          <SelectTrigger className="glass mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technical">Technical</SelectItem>
                            <SelectItem value="billing">Billing</SelectItem>
                            <SelectItem value="feature_request">Feature Request</SelectItem>
                            <SelectItem value="bug_report">Bug Report</SelectItem>
                            <SelectItem value="general">General</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="ticket-description">Description</Label>
                      <Textarea
                        id="ticket-description"
                        value={newTicket.description}
                        onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Please provide detailed information about your issue..."
                        className="glass mt-2"
                        rows={5}
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowCreateDialog(false)}
                        className="glass"
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleCreateTicket} disabled={loading || locked} className="btn-primary">
                        {loading ? 'Creating...' : 'Create Ticket'}
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
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
              <Ticket className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">{stats.total_tickets}</div>
              <p className="text-xs text-muted-foreground">
                All time
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">{stats.open_tickets}</div>
              <p className="text-xs text-muted-foreground">
                Need attention
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgent</CardTitle>
              <Flag className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">{stats.urgent_tickets}</div>
              <p className="text-xs text-muted-foreground">
                High priority
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
              <Star className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">
                {stats.satisfaction_score.toFixed(1)}/5
              </div>
              <p className="text-xs text-muted-foreground">
                Average rating
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Upgrade Banner */}
        <Card className="glass-card mb-6 border-gradient bg-gradient-to-r from-blue-500/10 to-purple-500/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Unlock Priority Support
                  </h3>
                  <p className="text-white/70 text-sm">
                    Upgrade to Agency Pro for faster response times and dedicated support
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                  onClick={() => window.location.href = '/subscribe'}
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade Now
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
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
                      placeholder="Search tickets..."
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
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Priority</Label>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="glass mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Category</Label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="glass mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                      <SelectItem value="feature_request">Feature Request</SelectItem>
                      <SelectItem value="bug_report">Bug Report</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 glass">
                <TabsTrigger value="all">All Tickets</TabsTrigger>
                <TabsTrigger value="open">Open</TabsTrigger>
                <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                <TabsTrigger value="closed">Closed</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {filteredTickets.map((ticket) => (
                  <Card key={ticket.id} className="glass-card hover:glass-hover transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            {getStatusIcon(ticket.status)}
                            <h3 className="font-semibold text-lg">{ticket.subject}</h3>
                            <Badge className={getPriorityColor(ticket.priority)}>
                              {ticket.priority}
                            </Badge>
                            <Badge variant="secondary" className="text-xs flex items-center">
                              {getCategoryIcon(ticket.category)}
                              <span className="ml-1">{ticket.category.replace('_', ' ')}</span>
                            </Badge>
                            {ticket.is_urgent && (
                              <Badge className="bg-red-500/20 text-red-400">
                                <Flag className="h-3 w-3 mr-1" />
                                Urgent
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-muted-foreground mb-4 line-clamp-2">{ticket.description}</p>
                          
                          <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <span className="text-xs text-white font-bold">
                                  {ticket.created_user?.name.charAt(0)}
                                </span>
                              </div>
                              <span>{ticket.created_user?.name}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                            </div>
                            {ticket.assigned_user && (
                              <div className="flex items-center space-x-2">
                                <UserCheck className="h-4 w-4" />
                                <span>Assigned to {ticket.assigned_user.name}</span>
                              </div>
                            )}
                            {ticket.replies_count > 0 && (
                              <div className="flex items-center space-x-1">
                                <Reply className="h-4 w-4" />
                                <span>{ticket.replies_count} replies</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {ticket.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <Select
                            value={ticket.status}
                            onValueChange={(value) => handleUpdateTicketStatus(ticket.id, value as SupportTicket['status'])}
                          >
                            <SelectTrigger className="w-32 glass">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="open">Open</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Button size="sm" variant="ghost" className="glass">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="open" className="space-y-4">
                {filteredTickets.filter(ticket => ticket.status === 'open').map((ticket) => (
                  <Card key={ticket.id} className="glass-card hover:glass-hover transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            {getStatusIcon(ticket.status)}
                            <h3 className="font-semibold text-lg">{ticket.subject}</h3>
                            <Badge className={getPriorityColor(ticket.priority)}>
                              {ticket.priority}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-4">{ticket.description}</p>
                          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <span className="text-xs text-white font-bold">
                                  {ticket.created_user?.name.charAt(0)}
                                </span>
                              </div>
                              <span>{ticket.created_user?.name}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateTicketStatus(ticket.id, 'in_progress')}
                          className="btn-primary"
                        >
                          Take Ticket
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="in_progress" className="space-y-4">
                {filteredTickets.filter(ticket => ticket.status === 'in_progress').map((ticket) => (
                  <Card key={ticket.id} className="glass-card hover:glass-hover transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            {getStatusIcon(ticket.status)}
                            <h3 className="font-semibold text-lg">{ticket.subject}</h3>
                            <Badge className={getPriorityColor(ticket.priority)}>
                              {ticket.priority}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-4">{ticket.description}</p>
                          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                            {ticket.assigned_user && (
                              <div className="flex items-center space-x-2">
                                <UserCheck className="h-4 w-4" />
                                <span>Assigned to {ticket.assigned_user.name}</span>
                              </div>
                            )}
                            {ticket.last_reply_at && (
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>Last reply {new Date(ticket.last_reply_at).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateTicketStatus(ticket.id, 'closed')}
                          className="btn-primary"
                        >
                          Close Ticket
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="closed" className="space-y-4">
                {filteredTickets.filter(ticket => ticket.status === 'closed').map((ticket) => (
                  <Card key={ticket.id} className="glass-card hover:glass-hover transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            {getStatusIcon(ticket.status)}
                            <h3 className="font-semibold text-lg line-through opacity-75">{ticket.subject}</h3>
                            <Badge className="bg-green-500/20 text-green-400">
                              Closed
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-4 opacity-75">{ticket.description}</p>
                          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <span className="text-xs text-white font-bold">
                                  {ticket.created_user?.name.charAt(0)}
                                </span>
                              </div>
                              <span>{ticket.created_user?.name}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>Closed {new Date(ticket.updated_at).toLocaleDateString()}</span>
                            </div>
                            {ticket.satisfaction_rating && (
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-400" />
                                <span>{ticket.satisfaction_rating}/5</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateTicketStatus(ticket.id, 'open')}
                          className="glass"
                        >
                          Reopen
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
    <UpgradeModal open={upgradeOpen} onOpenChange={setUpgradeOpen} title="Coming Soon — Accelerator OS" message="Support Hub is unlocked with Accelerator OS. Upgrade your plan to enable." cta="View Plans" />
    </>
  )
}

