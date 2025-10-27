'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  Plus,
  Zap,
  Target,
  MessageSquare,
  Calendar,
  FileText,
  Palette,
  ShoppingCart,
  BarChart3,
  HelpCircle,
  LogOut,
  ChevronDown,
  Globe,
  Moon,
  Sun,
  Monitor,
  RefreshCw,
  Download,
  Upload,
  Share2,
  Copy,
  Star,
  Heart,
  Flag,
  MoreHorizontal,
  Command,
  Keyboard,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Signal,
  SignalZero,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { GlobalSearch } from './global-search'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: string
  read: boolean
  action_url?: string
}

interface QuickAction {
  id: string
  label: string
  description: string
  icon: React.ComponentType<any>
  action: () => void
  shortcut?: string
  badge?: string
}

interface EnhancedHeaderProps {
  user?: {
    name: string
    email: string
    avatar_url?: string
    role: string
  }
  notifications?: Notification[]
  onNotificationClick?: (notification: Notification) => void
  onQuickAction?: (action: QuickAction) => void
  className?: string
}

export function EnhancedHeader({ 
  user, 
  notifications = [], 
  onNotificationClick,
  onQuickAction,
  className 
}: EnhancedHeaderProps) {
  const { toast } = useToast()
  const [showGlobalSearch, setShowGlobalSearch] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')
  const [notificationsCount, setNotificationsCount] = useState(0)
  const [isOnline, setIsOnline] = useState(true)
  const [batteryLevel, setBatteryLevel] = useState(100)

  useEffect(() => {
    setNotificationsCount(notifications.filter(n => !n.read).length)
  }, [notifications])

  useEffect(() => {
    // Monitor online status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    // Monitor battery level (if available)
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100))
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100))
        })
      })
    }
  }, [])

  const quickActions: QuickAction[] = [
    {
      id: 'new-theme',
      label: 'New Theme',
      description: 'Create a new theme',
      icon: Palette,
      action: () => {
        window.location.href = '/theme-studio?action=create'
        onQuickAction?.({ id: 'new-theme', label: 'New Theme', description: 'Create a new theme', icon: Palette, action: () => {} })
      },
      shortcut: 'Ctrl+N'
    },
    {
      id: 'new-project',
      label: 'New Project',
      description: 'Start a new project',
      icon: Target,
      action: () => {
        window.location.href = '/task-manager?action=create-project'
        onQuickAction?.({ id: 'new-project', label: 'New Project', description: 'Start a new project', icon: Target, action: () => {} })
      },
      shortcut: 'Ctrl+Shift+N'
    },
    {
      id: 'new-ticket',
      label: 'New Ticket',
      description: 'Create support ticket',
      icon: MessageSquare,
      action: () => {
        window.location.href = '/support?action=create'
        onQuickAction?.({ id: 'new-ticket', label: 'New Ticket', description: 'Create support ticket', icon: MessageSquare, action: () => {} })
      },
      shortcut: 'Ctrl+T'
    },
    {
      id: 'upload-marketplace',
      label: 'Upload to Marketplace',
      description: 'Upload theme to marketplace',
      icon: Upload,
      action: () => {
        window.location.href = '/marketplace?action=upload'
        onQuickAction?.({ id: 'upload-marketplace', label: 'Upload to Marketplace', description: 'Upload theme to marketplace', icon: Upload, action: () => {} })
      },
      shortcut: 'Ctrl+U'
    }
  ]

  const handleNotificationClick = (notification: Notification) => {
    onNotificationClick?.(notification)
    if (notification.action_url) {
      window.location.href = notification.action_url
    }
  }

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme as any)
    // In real implementation, this would update the theme
    toast({
      title: "Theme Updated",
      description: `Switched to ${newTheme} theme`,
    })
  }

  const handleKeyboardShortcut = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'k':
          e.preventDefault()
          setShowGlobalSearch(true)
          break
        case 'n':
          e.preventDefault()
          quickActions[0].action()
          break
        case 't':
          e.preventDefault()
          quickActions[2].action()
          break
        case 'u':
          e.preventDefault()
          quickActions[3].action()
          break
      }
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyboardShortcut)
    return () => document.removeEventListener('keydown', handleKeyboardShortcut)
  }, [])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-400" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" />
      default:
        return <Bell className="h-4 w-4 text-blue-400" />
    }
  }

  const getBatteryIcon = () => {
    if (batteryLevel > 75) return <Battery className="h-4 w-4 text-green-400" />
    if (batteryLevel > 25) return <Battery className="h-4 w-4 text-yellow-400" />
    return <BatteryLow className="h-4 w-4 text-red-400" />
  }

  const getSignalIcon = () => {
    if (isOnline) return <Signal className="h-4 w-4 text-green-400" />
    return <SignalZero className="h-4 w-4 text-red-400" />
  }

  return (
    <header className={`glass border-b border-white/10 ${className}`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Logo and Search */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Palette className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-heading text-xl gradient-text">PulseGen Studio</h1>
                <p className="text-xs text-muted-foreground">Theme Builder</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowGlobalSearch(true)}
                className="glass hover:glass-hover"
              >
                <Search className="h-4 w-4 mr-2" />
                Search...
                <kbd className="ml-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <Command className="h-3 w-3" />
                  K
                </kbd>
              </Button>
            </div>
          </div>

          {/* Center Section - Quick Actions */}
          <div className="hidden lg:flex items-center space-x-2">
            {quickActions.slice(0, 4).map((action) => (
              <Button
                key={action.id}
                variant="ghost"
                size="sm"
                onClick={action.action}
                className="glass hover:glass-hover"
                title={`${action.description} (${action.shortcut})`}
              >
                <action.icon className="h-4 w-4 mr-2" />
                {action.label}
                {action.badge && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {action.badge}
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          {/* Right Section - Status, Notifications, User */}
          <div className="flex items-center space-x-2">
            {/* Status Indicators */}
            <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
              {getSignalIcon()}
              {getBatteryIcon()}
              <span className="text-xs">{batteryLevel}%</span>
            </div>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="glass hover:glass-hover relative">
                  <Bell className="h-4 w-4" />
                  {notificationsCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {notificationsCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass-card w-80" align="end">
                <div className="p-3 border-b border-white/10">
                  <h4 className="font-semibold">Notifications</h4>
                  <p className="text-sm text-muted-foreground">
                    {notificationsCount} unread notifications
                  </p>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className="p-3 cursor-pointer"
                      >
                        <div className="flex items-start space-x-3">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{notification.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(notification.timestamp).toLocaleString()}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                          )}
                        </div>
                      </DropdownMenuItem>
                    ))
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="glass hover:glass-hover">
                  {theme === 'light' ? <Sun className="h-4 w-4" /> : 
                   theme === 'dark' ? <Moon className="h-4 w-4" /> : 
                   <Monitor className="h-4 w-4" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass-card" align="end">
                <DropdownMenuItem onClick={() => handleThemeChange('light')}>
                  <Sun className="h-4 w-4 mr-2" />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleThemeChange('dark')}>
                  <Moon className="h-4 w-4 mr-2" />
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleThemeChange('system')}>
                  <Monitor className="h-4 w-4 mr-2" />
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Quick Actions Dropdown */}
            <DropdownMenu open={showQuickActions} onOpenChange={setShowQuickActions}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="glass hover:glass-hover">
                  <Plus className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass-card w-64" align="end">
                {quickActions.map((action) => (
                  <DropdownMenuItem
                    key={action.id}
                    onClick={action.action}
                    className="p-3 cursor-pointer"
                  >
                    <action.icon className="h-4 w-4 mr-3" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{action.label}</p>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </div>
                    {action.shortcut && (
                      <kbd className="text-xs text-muted-foreground">
                        {action.shortcut}
                      </kbd>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="glass hover:glass-hover">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass-card w-64" align="end">
                <div className="p-3 border-b border-white/10">
                  <p className="font-medium">{user?.name || 'User'}</p>
                  <p className="text-sm text-muted-foreground">{user?.email || 'user@example.com'}</p>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {user?.role || 'User'}
                  </Badge>
                </div>
                <DropdownMenuItem onClick={() => window.location.href = '/dashboard'}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.location.href = '/settings'}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.location.href = '/account'}>
                  <User className="h-4 w-4 mr-2" />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.location.href = '/help'}>
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Help & Support
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => window.location.href = '/auth/logout'}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Global Search Dialog */}
      <GlobalSearch 
        open={showGlobalSearch} 
        onOpenChange={setShowGlobalSearch} 
      />
    </header>
  )
}
