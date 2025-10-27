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
  Zap, 
  Target,
  Search, 
  Palette, 
  MessageSquare, 
  Calendar,
  FileText,
  Upload,
  Download,
  Settings,
  BarChart3,
  Users,
  Bell,
  Star,
  Heart,
  Flag,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Copy,
  Share2,
  RefreshCw,
  Play,
  Pause,
  RotateCcw,
  Save,
  Send,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Globe,
  Shield,
  Activity,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Award,
  Bookmark,
  Archive,
  Trash,
  MoreHorizontal
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  category: 'automation' | 'content' | 'communication' | 'analytics' | 'tools'
  color: string
  shortcut?: string
  requires_input?: boolean
  is_premium?: boolean
  ghl_integration?: boolean
  action: () => void
}

interface QuickActionPanelProps {
  onActionExecute?: (action: QuickAction) => void
  className?: string
}

export function QuickActionPanel({ onActionExecute, className }: QuickActionPanelProps) {
  const { toast } = useToast()
  const [selectedCategory, setSelectedCategory] = useState<string>('automation')
  const [searchQuery, setSearchQuery] = useState('')
  const [showActionDialog, setShowActionDialog] = useState(false)
  const [selectedAction, setSelectedAction] = useState<QuickAction | null>(null)
  const [actionData, setActionData] = useState<any>({})
  const [loading, setLoading] = useState(false)

  const quickActions: QuickAction[] = [
    // Automation Actions
    {
      id: 'auto-welcome-sequence',
      title: 'Welcome Sequence',
      description: 'Set up automated welcome emails for new contacts',
      icon: MessageSquare,
      category: 'automation',
      color: 'text-blue-400',
      shortcut: 'Ctrl+W',
      requires_input: true,
      ghl_integration: true,
      action: () => handleActionClick('auto-welcome-sequence')
    },
    {
      id: 'auto-follow-up',
      title: 'Follow-up Sequence',
      description: 'Create automated follow-up campaigns',
      icon: RefreshCw,
      category: 'automation',
      color: 'text-green-400',
      requires_input: true,
      ghl_integration: true,
      action: () => handleActionClick('auto-follow-up')
    },
    {
      id: 'auto-task-creation',
      title: 'Auto Task Creation',
      description: 'Automatically create tasks based on triggers',
      icon: Target,
      category: 'automation',
      color: 'text-purple-400',
      requires_input: true,
      ghl_integration: true,
      action: () => handleActionClick('auto-task-creation')
    },
    {
      id: 'auto-tagging',
      title: 'Smart Tagging',
      description: 'Automatically tag contacts based on behavior',
      icon: Flag,
      category: 'automation',
      color: 'text-orange-400',
      requires_input: true,
      ghl_integration: true,
      action: () => handleActionClick('auto-tagging')
    },

    // Content Actions
    {
      id: 'create-theme',
      title: 'Create Theme',
      description: 'Start building a new theme from scratch',
      icon: Palette,
      category: 'content',
      color: 'text-pink-400',
      shortcut: 'Ctrl+N',
      action: () => window.location.href = '/theme-studio?action=create'
    },
    {
      id: 'upload-marketplace',
      title: 'Upload to Marketplace',
      description: 'Upload theme or component to marketplace',
      icon: Upload,
      category: 'content',
      color: 'text-cyan-400',
      requires_input: true,
      action: () => handleActionClick('upload-marketplace')
    },
    {
      id: 'duplicate-theme',
      title: 'Duplicate Theme',
      description: 'Create a copy of an existing theme',
      icon: Copy,
      category: 'content',
      color: 'text-yellow-400',
      requires_input: true,
      action: () => handleActionClick('duplicate-theme')
    },
    {
      id: 'export-theme',
      title: 'Export Theme',
      description: 'Export theme as downloadable package',
      icon: Download,
      category: 'content',
      color: 'text-indigo-400',
      requires_input: true,
      action: () => handleActionClick('export-theme')
    },

    // Communication Actions
    {
      id: 'send-broadcast',
      title: 'Send Broadcast',
      description: 'Send message to multiple contacts',
      icon: Send,
      category: 'communication',
      color: 'text-red-400',
      requires_input: true,
      ghl_integration: true,
      action: () => handleActionClick('send-broadcast')
    },
    {
      id: 'schedule-meeting',
      title: 'Schedule Meeting',
      description: 'Book a meeting with contacts',
      icon: Calendar,
      category: 'communication',
      color: 'text-emerald-400',
      requires_input: true,
      ghl_integration: true,
      action: () => handleActionClick('schedule-meeting')
    },
    {
      id: 'create-ticket',
      title: 'Create Support Ticket',
      description: 'Submit a new support request',
      icon: MessageSquare,
      category: 'communication',
      color: 'text-rose-400',
      action: () => window.location.href = '/support?action=create'
    },
    {
      id: 'send-sms',
      title: 'Send SMS',
      description: 'Send text message to contact',
      icon: MessageSquare,
      category: 'communication',
      color: 'text-violet-400',
      requires_input: true,
      ghl_integration: true,
      action: () => handleActionClick('send-sms')
    },

    // Analytics Actions
    {
      id: 'view-analytics',
      title: 'View Analytics',
      description: 'Open analytics dashboard',
      icon: BarChart3,
      category: 'analytics',
      color: 'text-blue-500',
      action: () => window.location.href = '/analytics'
    },
    {
      id: 'export-report',
      title: 'Export Report',
      description: 'Generate and download reports',
      icon: FileText,
      category: 'analytics',
      color: 'text-green-500',
      requires_input: true,
      action: () => handleActionClick('export-report')
    },
    {
      id: 'track-performance',
      title: 'Track Performance',
      description: 'Monitor theme and campaign performance',
      icon: TrendingUp,
      category: 'analytics',
      color: 'text-purple-500',
      action: () => window.location.href = '/analytics/performance'
    },
    {
      id: 'audit-logs',
      title: 'View Audit Logs',
      description: 'Review system activity and changes',
      icon: Activity,
      category: 'analytics',
      color: 'text-orange-500',
      action: () => window.location.href = '/admin/audit-logs'
    },

    // Tools Actions
    {
      id: 'api-testing',
      title: 'API Testing',
      description: 'Test GoHighLevel API connections',
      icon: Settings,
      category: 'tools',
      color: 'text-gray-400',
      action: () => window.location.href = '/tools/api-testing'
    },
    {
      id: 'backup-data',
      title: 'Backup Data',
      description: 'Create backup of themes and settings',
      icon: Shield,
      category: 'tools',
      color: 'text-slate-400',
      requires_input: true,
      action: () => handleActionClick('backup-data')
    },
    {
      id: 'system-diagnostics',
      title: 'System Diagnostics',
      description: 'Run system health checks',
      icon: Activity,
      category: 'tools',
      color: 'text-zinc-400',
      action: () => window.location.href = '/admin/diagnostics'
    },
    {
      id: 'bulk-import',
      title: 'Bulk Import',
      description: 'Import themes or contacts in bulk',
      icon: Upload,
      category: 'tools',
      color: 'text-stone-400',
      requires_input: true,
      action: () => handleActionClick('bulk-import')
    }
  ]

  const categories = [
    { id: 'automation', label: 'Automation', icon: Zap },
    { id: 'content', label: 'Content', icon: Palette },
    { id: 'communication', label: 'Communication', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'tools', label: 'Tools', icon: Settings }
  ]

  const handleActionClick = (actionId: string) => {
    const action = quickActions.find(a => a.id === actionId)
    if (!action) return

    if (action.requires_input) {
      setSelectedAction(action)
      setActionData({})
      setShowActionDialog(true)
    } else {
      action.action()
      onActionExecute?.(action)
    }
  }

  const handleActionSubmit = async () => {
    if (!selectedAction) return

    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Action Executed",
        description: `${selectedAction.title} has been executed successfully`,
      })
      
      onActionExecute?.(selectedAction)
      setShowActionDialog(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to execute action",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredActions = quickActions.filter(action => {
    const matchesCategory = action.category === selectedCategory
    const matchesSearch = action.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         action.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    return category?.icon || Settings
  }

  const getCategoryColor = (categoryId: string) => {
    switch (categoryId) {
      case 'automation':
        return 'text-blue-400'
      case 'content':
        return 'text-pink-400'
      case 'communication':
        return 'text-green-400'
      case 'analytics':
        return 'text-purple-400'
      case 'tools':
        return 'text-gray-400'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <div className={className}>
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-blue-400" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Execute common tasks and workflows instantly
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-xs">
              {filteredActions.length} actions
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Input
                placeholder="Search actions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass pl-10"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>

            {/* Category Tabs */}
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="grid w-full grid-cols-5 glass">
                {categories.map((category) => {
                  const Icon = getCategoryIcon(category.id)
                  return (
                    <TabsTrigger key={category.id} value={category.id} className="flex items-center space-x-1">
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{category.label}</span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>

              <TabsContent value={selectedCategory} className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredActions.map((action) => {
                    const Icon = getCategoryIcon(action.category)
                    return (
                      <Button
                        key={action.id}
                        variant="ghost"
                        onClick={action.action}
                        className="glass hover:glass-hover h-auto p-4 flex flex-col items-start space-y-2"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center space-x-2">
                            <action.icon className={`h-5 w-5 ${action.color}`} />
                            <span className="font-medium text-sm">{action.title}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {action.ghl_integration && (
                              <Badge variant="secondary" className="text-xs">
                                GHL
                              </Badge>
                            )}
                            {action.is_premium && (
                              <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">
                                Pro
                              </Badge>
                            )}
                            {action.shortcut && (
                              <kbd className="text-xs text-muted-foreground">
                                {action.shortcut}
                              </kbd>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground text-left">
                          {action.description}
                        </p>
                      </Button>
                    )
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent className="glass-card max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {selectedAction && <selectedAction.icon className={`h-5 w-5 ${selectedAction.color}`} />}
              <span>{selectedAction?.title}</span>
            </DialogTitle>
            <DialogDescription>
              {selectedAction?.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedAction?.id === 'auto-welcome-sequence' && (
              <>
                <div>
                  <Label htmlFor="sequence-name">Sequence Name</Label>
                  <Input
                    id="sequence-name"
                    value={actionData.name || ''}
                    onChange={(e) => setActionData((prev: any) => ({ ...prev, name: e.target.value }))}
                    placeholder="Welcome New Contacts"
                    className="glass mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="trigger-event">Trigger Event</Label>
                  <Select
                    value={actionData.trigger || ''}
                    onValueChange={(value) => setActionData((prev: any) => ({ ...prev, trigger: value }))}
                  >
                    <SelectTrigger className="glass mt-2">
                      <SelectValue placeholder="Select trigger" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new-contact">New Contact Added</SelectItem>
                      <SelectItem value="form-submit">Form Submission</SelectItem>
                      <SelectItem value="tag-added">Tag Added</SelectItem>
                      <SelectItem value="purchase">Purchase Made</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="email-count">Number of Emails</Label>
                  <Input
                    id="email-count"
                    type="number"
                    value={actionData.emailCount || ''}
                    onChange={(e) => setActionData((prev: any) => ({ ...prev, emailCount: e.target.value }))}
                    placeholder="3"
                    className="glass mt-2"
                  />
                </div>
              </>
            )}

            {selectedAction?.id === 'send-broadcast' && (
              <>
                <div>
                  <Label htmlFor="broadcast-subject">Subject</Label>
                  <Input
                    id="broadcast-subject"
                    value={actionData.subject || ''}
                    onChange={(e) => setActionData((prev: any) => ({ ...prev, subject: e.target.value }))}
                    placeholder="Broadcast subject"
                    className="glass mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="broadcast-message">Message</Label>
                  <Textarea
                    id="broadcast-message"
                    value={actionData.message || ''}
                    onChange={(e) => setActionData((prev: any) => ({ ...prev, message: e.target.value }))}
                    placeholder="Your message..."
                    className="glass mt-2"
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="broadcast-audience">Audience</Label>
                  <Select
                    value={actionData.audience || ''}
                    onValueChange={(value) => setActionData((prev: any) => ({ ...prev, audience: value }))}
                  >
                    <SelectTrigger className="glass mt-2">
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-contacts">All Contacts</SelectItem>
                      <SelectItem value="tagged">Tagged Contacts</SelectItem>
                      <SelectItem value="custom">Custom List</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {selectedAction?.id === 'backup-data' && (
              <>
                <div>
                  <Label htmlFor="backup-name">Backup Name</Label>
                  <Input
                    id="backup-name"
                    value={actionData.name || ''}
                    onChange={(e) => setActionData((prev: any) => ({ ...prev, name: e.target.value }))}
                    placeholder="Backup_2024_01_22"
                    className="glass mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="backup-items">Items to Backup</Label>
                  <div className="space-y-2 mt-2">
                    {['themes', 'contacts', 'settings', 'workflows'].map((item) => (
                      <label key={item} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={actionData[item] || false}
                          onChange={(e) => setActionData((prev: any) => ({ ...prev, [item]: e.target.checked }))}
                          className="rounded"
                        />
                        <span className="text-sm capitalize">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowActionDialog(false)}
                className="glass"
              >
                Cancel
              </Button>
              <Button
                onClick={handleActionSubmit}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Executing...' : 'Execute Action'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
