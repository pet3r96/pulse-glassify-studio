'use client'

import { useState, useEffect, createContext, useContext } from 'react'
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
  User, 
  Building, 
  Settings, 
  Palette, 
  BarChart3, 
  MessageSquare,
  Target,
  Calendar,
  Bell,
  Star,
  Heart,
  Flag,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Lightbulb,
  Zap,
  TrendingUp,
  DollarSign,
  Users,
  Globe,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Copy,
  Share2,
  Download,
  Upload,
  Save,
  Send,
  Play,
  Pause,
  RotateCcw,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  X,
  Check,
  ArrowRight,
  ArrowLeft,
  Home,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  BookOpen
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

// Context Types
interface UserContext {
  id: string
  name: string
  email: string
  role: 'super_admin' | 'agency' | 'subaccount'
  agency_id?: string
  permissions: string[]
  preferences: {
    theme: 'light' | 'dark' | 'system'
    notifications: boolean
    language: string
    timezone: string
  }
}

interface AppContext {
  currentPage: string
  currentSection: string
  breadcrumbs: Array<{ label: string; href: string }>
  recentActions: Array<{ action: string; timestamp: string; url: string }>
  suggestions: Array<{ title: string; description: string; action: () => void }>
  notifications: Array<{ id: string; title: string; message: string; type: 'info' | 'success' | 'warning' | 'error'; timestamp: string }>
}

interface ContextAwareUIProps {
  children: React.ReactNode
  user?: UserContext
  appContext?: AppContext
  className?: string
}

// Context
const UserContext = createContext<UserContext | null>(null)
const AppContext = createContext<AppContext | null>(null)

export const useUserContext = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUserContext must be used within a UserContextProvider')
  }
  return context
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider')
  }
  return context
}

// Smart Suggestions Component
export function SmartSuggestions() {
  const user = useUserContext()
  const app = useAppContext()
  const { toast } = useToast()
  const [suggestions, setSuggestions] = useState(app.suggestions)

  const handleSuggestionClick = (suggestion: any) => {
    suggestion.action()
    toast({
      title: "Suggestion Applied",
      description: suggestion.title,
    })
  }

  if (suggestions.length === 0) return null

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-yellow-400" />
          Smart Suggestions
        </CardTitle>
        <CardDescription>
          AI-powered recommendations based on your activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="ghost"
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full justify-start glass hover:glass-hover h-auto p-3"
            >
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <p className="font-medium text-sm">{suggestion.title}</p>
                  <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Context-Aware Navigation
export function ContextAwareNavigation() {
  const user = useUserContext()
  const app = useAppContext()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const getNavigationItems = () => {
    const baseItems = [
      { label: 'Dashboard', href: '/dashboard', icon: Home, roles: ['super_admin', 'agency', 'subaccount'] },
      { label: 'Theme Studio', href: '/theme-studio', icon: Palette, roles: ['super_admin', 'agency', 'subaccount'] },
      { label: 'Marketplace', href: '/marketplace', icon: Globe, roles: ['super_admin', 'agency', 'subaccount'] },
      { label: 'Task Manager', href: '/task-manager', icon: Target, roles: ['super_admin', 'agency', 'subaccount'] },
      { label: 'Support', href: '/support', icon: MessageSquare, roles: ['super_admin', 'agency', 'subaccount'] },
    ]

    if (user.role === 'super_admin') {
      baseItems.push(
        { label: 'Admin Panel', href: '/admin', icon: Settings, roles: ['super_admin'] },
        { label: 'Analytics', href: '/analytics', icon: BarChart3, roles: ['super_admin'] }
      )
    }

    return baseItems.filter(item => item.roles.includes(user.role))
  }

  const navigationItems = getNavigationItems()

  return (
    <nav className={`glass border-r border-white/10 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Palette className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-heading text-lg gradient-text">PulseGen</h1>
                <p className="text-xs text-muted-foreground">Studio</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="glass hover:glass-hover"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = app.currentPage === item.href
            return (
              <Button
                key={item.href}
                variant="ghost"
                className={`w-full justify-start glass hover:glass-hover ${isActive ? 'bg-blue-500/20 text-blue-400' : ''}`}
                onClick={() => window.location.href = item.href}
              >
                <Icon className="h-4 w-4 mr-3" />
                {!isCollapsed && <span>{item.label}</span>}
              </Button>
            )
          })}
        </div>

        {!isCollapsed && (
          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-sm text-white font-bold">
                  {user.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.role}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

// Smart Breadcrumbs
export function SmartBreadcrumbs() {
  const app = useAppContext()

  if (app.breadcrumbs.length === 0) return null

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
      {app.breadcrumbs.map((crumb, index) => (
        <div key={index} className="flex items-center space-x-2">
          {index > 0 && <ChevronRight className="h-4 w-4" />}
          <a
            href={crumb.href}
            className="hover:text-white transition-colors"
          >
            {crumb.label}
          </a>
        </div>
      ))}
    </nav>
  )
}

// Context-Aware Quick Actions
export function ContextAwareQuickActions() {
  const user = useUserContext()
  const app = useAppContext()
  const { toast } = useToast()

  const getContextualActions = () => {
    const actions = []

    // Page-specific actions
    switch (app.currentPage) {
      case '/theme-studio':
        actions.push(
          { label: 'New Theme', icon: Plus, action: () => window.location.href = '/theme-studio?action=create' },
          { label: 'Import Theme', icon: Upload, action: () => window.location.href = '/theme-studio?action=import' },
          { label: 'Preview', icon: Eye, action: () => window.location.href = '/theme-studio?action=preview' }
        )
        break
      case '/task-manager':
        actions.push(
          { label: 'New Task', icon: Plus, action: () => window.location.href = '/task-manager?action=create' },
          { label: 'New Project', icon: Target, action: () => window.location.href = '/task-manager?action=create-project' },
          { label: 'Calendar View', icon: Calendar, action: () => window.location.href = '/task-manager?view=calendar' }
        )
        break
      case '/marketplace':
        actions.push(
          { label: 'Upload Item', icon: Upload, action: () => window.location.href = '/marketplace?action=upload' },
          { label: 'My Items', icon: User, action: () => window.location.href = '/marketplace?filter=my-items' },
          { label: 'Favorites', icon: Heart, action: () => window.location.href = '/marketplace?filter=favorites' }
        )
        break
      case '/support':
        actions.push(
          { label: 'New Ticket', icon: Plus, action: () => window.location.href = '/support?action=create' },
          { label: 'My Tickets', icon: User, action: () => window.location.href = '/support?filter=my-tickets' },
          { label: 'Knowledge Base', icon: BookOpen, action: () => window.location.href = '/support/kb' }
        )
        break
    }

    // Role-specific actions
    if (user.role === 'super_admin') {
      actions.push(
        { label: 'Admin Panel', icon: Settings, action: () => window.location.href = '/admin' },
        { label: 'Analytics', icon: BarChart3, action: () => window.location.href = '/analytics' }
      )
    }

    return actions
  }

  const contextualActions = getContextualActions()

  if (contextualActions.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {contextualActions.map((action, index) => {
        const Icon = action.icon
        return (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            onClick={action.action}
            className="glass hover:glass-hover"
          >
            <Icon className="h-4 w-4 mr-2" />
            {action.label}
          </Button>
        )
      })}
    </div>
  )
}

// Smart Notifications
export function SmartNotifications() {
  const app = useAppContext()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState(app.notifications)

  const handleNotificationClick = (notification: any) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    )
    
    toast({
      title: notification.title,
      description: notification.message,
    })
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-400" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" />
      default:
        return <Info className="h-4 w-4 text-blue-400" />
    }
  }

  if (notifications.length === 0) return null

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="h-5 w-5 mr-2 text-blue-400" />
          Notifications
        </CardTitle>
        <CardDescription>
          {notifications.length} unread notifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Button
              key={notification.id}
              variant="ghost"
              onClick={() => handleNotificationClick(notification)}
              className="w-full justify-start glass hover:glass-hover h-auto p-3"
            >
              <div className="flex items-start space-x-3">
                {getNotificationIcon(notification.type)}
                <div className="flex-1 text-left">
                  <p className="font-medium text-sm">{notification.title}</p>
                  <p className="text-xs text-muted-foreground">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Main Context-Aware UI Component
export function ContextAwareUI({ children, user, appContext, className }: ContextAwareUIProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Mock data for demonstration
  const defaultUser: UserContext = user || {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'agency',
    agency_id: 'agency-1',
    permissions: ['read', 'write', 'delete'],
    preferences: {
      theme: 'dark',
      notifications: true,
      language: 'en',
      timezone: 'UTC'
    }
  }

  const defaultAppContext: AppContext = appContext || {
    currentPage: '/dashboard',
    currentSection: 'overview',
    breadcrumbs: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Overview', href: '/dashboard/overview' }
    ],
    recentActions: [
      { action: 'Created theme', timestamp: '2024-01-22T10:30:00Z', url: '/theme-studio' },
      { action: 'Updated project', timestamp: '2024-01-22T09:15:00Z', url: '/task-manager' }
    ],
    suggestions: [
      { title: 'Optimize your theme', description: 'Your theme could load 20% faster', action: () => {} },
      { title: 'Add more tags', description: 'Tag your themes for better organization', action: () => {} }
    ],
    notifications: [
      { id: '1', title: 'Theme Published', message: 'Your theme has been successfully published', type: 'success', timestamp: '2024-01-22T10:30:00Z' },
      { id: '2', title: 'New Message', message: 'You have a new support ticket', type: 'info', timestamp: '2024-01-22T09:15:00Z' }
    ]
  }

  return (
    <UserContext.Provider value={defaultUser}>
      <AppContext.Provider value={defaultAppContext}>
        <div className={`min-h-screen bg-[var(--color-bg)] ${className}`}>
          <div className="flex">
            <ContextAwareNavigation />
            <div className="flex-1 p-6">
              <SmartBreadcrumbs />
              <ContextAwareQuickActions />
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                  {children}
                </div>
                <div className="lg:col-span-1 space-y-6">
                  <SmartSuggestions />
                  <SmartNotifications />
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppContext.Provider>
    </UserContext.Provider>
  )
}
