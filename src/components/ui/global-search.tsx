'use client'

import { useState, useEffect, useRef } from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Palette, 
  Users, 
  Settings, 
  FileText, 
  Calendar,
  MessageSquare,
  Zap,
  ShoppingCart,
  BarChart3,
  Code,
  Target,
  Ticket,
  Clock,
  Star,
  TrendingUp,
  ArrowRight,
  Command as CommandIcon
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface SearchResult {
  id: string
  title: string
  description: string
  type: 'theme' | 'project' | 'task' | 'ticket' | 'user' | 'setting' | 'page' | 'action'
  category: string
  url: string
  icon: React.ComponentType<any>
  priority: number
  tags: string[]
  lastAccessed?: string
  isRecent?: boolean
}

interface GlobalSearchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [recentSearches, setRecentSearches] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  // Mock search results - in real implementation, this would search across the app
  const mockResults: SearchResult[] = [
    // Themes
    {
      id: 'theme-1',
      title: 'Modern Dashboard Pro',
      description: 'Clean, professional dashboard theme with dark mode support',
      type: 'theme',
      category: 'Themes',
      url: '/theme-studio',
      icon: Palette,
      priority: 1,
      tags: ['dashboard', 'dark-mode', 'professional'],
      lastAccessed: '2024-01-20T10:30:00Z'
    },
    {
      id: 'theme-2',
      title: 'Mobile-First Theme',
      description: 'Optimized for mobile devices with responsive design',
      type: 'theme',
      category: 'Themes',
      url: '/theme-studio',
      icon: Palette,
      priority: 2,
      tags: ['mobile', 'responsive', 'modern']
    },
    
    // Projects
    {
      id: 'project-1',
      title: 'Dashboard Redesign',
      description: 'Complete redesign of the main dashboard interface',
      type: 'project',
      category: 'Projects',
      url: '/task-manager',
      icon: Target,
      priority: 1,
      tags: ['dashboard', 'redesign', 'active']
    },
    {
      id: 'project-2',
      title: 'Documentation Project',
      description: 'Create comprehensive user and developer documentation',
      type: 'project',
      category: 'Projects',
      url: '/task-manager',
      icon: Target,
      priority: 2,
      tags: ['documentation', 'user-guide']
    },
    
    // Tasks
    {
      id: 'task-1',
      title: 'Implement dark mode theme',
      description: 'Create a comprehensive dark mode theme for the dashboard',
      type: 'task',
      category: 'Tasks',
      url: '/task-manager',
      icon: CheckCircle,
      priority: 1,
      tags: ['frontend', 'theme', 'accessibility']
    },
    {
      id: 'task-2',
      title: 'Fix mobile responsiveness issues',
      description: 'Address mobile layout problems on the theme studio page',
      type: 'task',
      category: 'Tasks',
      url: '/task-manager',
      icon: Clock,
      priority: 2,
      tags: ['mobile', 'responsive', 'bug']
    },
    
    // Tickets
    {
      id: 'ticket-1',
      title: 'Theme not applying correctly in GoHighLevel',
      description: 'I uploaded a theme but it\'s not showing up in my dashboard',
      type: 'ticket',
      category: 'Support',
      url: '/support',
      icon: Ticket,
      priority: 1,
      tags: ['theme', 'ghl-integration', 'deployment']
    },
    {
      id: 'ticket-2',
      title: 'Billing question about subscription upgrade',
      description: 'I want to upgrade my subscription but need help choosing a plan',
      type: 'ticket',
      category: 'Support',
      url: '/support',
      icon: MessageSquare,
      priority: 2,
      tags: ['billing', 'subscription', 'upgrade']
    },
    
    // Pages
    {
      id: 'page-1',
      title: 'Theme Studio',
      description: 'Create and customize your GoHighLevel themes',
      type: 'page',
      category: 'Navigation',
      url: '/theme-studio',
      icon: Palette,
      priority: 1,
      tags: ['themes', 'customization', 'studio']
    },
    {
      id: 'page-2',
      title: 'Marketplace',
      description: 'Discover and download themes, components, and templates',
      type: 'page',
      category: 'Navigation',
      url: '/marketplace',
      icon: ShoppingCart,
      priority: 1,
      tags: ['marketplace', 'themes', 'download']
    },
    {
      id: 'page-3',
      title: 'Task Manager',
      description: 'Manage projects, tasks, and team collaboration',
      type: 'page',
      category: 'Navigation',
      url: '/task-manager',
      icon: BarChart3,
      priority: 1,
      tags: ['tasks', 'projects', 'collaboration']
    },
    {
      id: 'page-4',
      title: 'Support Center',
      description: 'Manage support tickets and customer inquiries',
      type: 'page',
      category: 'Navigation',
      url: '/support',
      icon: MessageSquare,
      priority: 1,
      tags: ['support', 'tickets', 'help']
    },
    
    // Actions
    {
      id: 'action-1',
      title: 'Create New Theme',
      description: 'Start building a new theme from scratch',
      type: 'action',
      category: 'Quick Actions',
      url: '/theme-studio?action=create',
      icon: Plus,
      priority: 1,
      tags: ['create', 'theme', 'new']
    },
    {
      id: 'action-2',
      title: 'Upload to Marketplace',
      description: 'Upload a theme or component to the marketplace',
      type: 'action',
      category: 'Quick Actions',
      url: '/marketplace?action=upload',
      icon: Upload,
      priority: 1,
      tags: ['upload', 'marketplace', 'publish']
    },
    {
      id: 'action-3',
      title: 'Create New Project',
      description: 'Start a new project to organize your tasks',
      type: 'action',
      category: 'Quick Actions',
      url: '/task-manager?action=create-project',
      icon: Target,
      priority: 1,
      tags: ['create', 'project', 'new']
    },
    {
      id: 'action-4',
      title: 'New Support Ticket',
      description: 'Submit a new support request or question',
      type: 'action',
      category: 'Quick Actions',
      url: '/support?action=create',
      icon: MessageSquare,
      priority: 1,
      tags: ['support', 'ticket', 'help']
    }
  ]

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }

    setLoading(true)
    
    // Simulate search delay
    const timeoutId = setTimeout(() => {
      const filteredResults = mockResults.filter(result =>
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.description.toLowerCase().includes(query.toLowerCase()) ||
        result.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      ).sort((a, b) => a.priority - b.priority)
      
      setResults(filteredResults)
      setLoading(false)
    }, 150)

    return () => clearTimeout(timeoutId)
  }, [query])

  useEffect(() => {
    // Load recent searches from localStorage
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]')
    setRecentSearches(recent)
  }, [])

  const handleResultClick = (result: SearchResult) => {
    // Add to recent searches
    const recent = [result, ...recentSearches.filter(r => r.id !== result.id)].slice(0, 5)
    setRecentSearches(recent)
    localStorage.setItem('recentSearches', JSON.stringify(recent))
    
    // Navigate to result
    router.push(result.url)
    onOpenChange(false)
    setQuery('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onOpenChange(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'theme':
        return <Palette className="h-4 w-4" />
      case 'project':
        return <Target className="h-4 w-4" />
      case 'task':
        return <CheckCircle className="h-4 w-4" />
      case 'ticket':
        return <Ticket className="h-4 w-4" />
      case 'user':
        return <Users className="h-4 w-4" />
      case 'setting':
        return <Settings className="h-4 w-4" />
      case 'page':
        return <FileText className="h-4 w-4" />
      case 'action':
        return <Zap className="h-4 w-4" />
      default:
        return <Search className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'theme':
        return 'text-purple-400'
      case 'project':
        return 'text-blue-400'
      case 'task':
        return 'text-green-400'
      case 'ticket':
        return 'text-orange-400'
      case 'user':
        return 'text-pink-400'
      case 'setting':
        return 'text-gray-400'
      case 'page':
        return 'text-cyan-400'
      case 'action':
        return 'text-yellow-400'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card max-w-2xl p-0">
        <Command className="rounded-lg border shadow-md">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              ref={inputRef}
              placeholder="Search themes, projects, tasks, tickets..."
              value={query}
              onValueChange={setQuery}
              onKeyDown={handleKeyDown}
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
            <div className="ml-2 flex items-center space-x-1">
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <CommandIcon className="h-3 w-3" />
                K
              </kbd>
            </div>
          </div>
          <CommandList className="max-h-[400px] overflow-y-auto overflow-x-hidden">
            {loading && (
              <div className="flex items-center justify-center py-6">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            )}
            
            {!loading && query.length < 2 && recentSearches.length > 0 && (
              <CommandGroup heading="Recent Searches">
                {recentSearches.map((result) => (
                  <CommandItem
                    key={result.id}
                    value={result.title}
                    onSelect={() => handleResultClick(result)}
                    className="flex items-center space-x-3 px-3 py-2"
                  >
                    <div className={`flex-shrink-0 ${getTypeColor(result.type)}`}>
                      {getTypeIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{result.title}</span>
                        <Badge variant="secondary" className="text-xs">
                          {result.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {result.description}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            
            {!loading && query.length >= 2 && results.length === 0 && (
              <CommandEmpty>No results found for "{query}".</CommandEmpty>
            )}
            
            {!loading && results.length > 0 && (
              <>
                {Object.entries(
                  results.reduce((groups, result) => {
                    const category = result.category
                    if (!groups[category]) {
                      groups[category] = []
                    }
                    groups[category].push(result)
                    return groups
                  }, {} as Record<string, SearchResult[]>)
                ).map(([category, categoryResults]) => (
                  <CommandGroup key={category} heading={category}>
                    {categoryResults.map((result) => (
                      <CommandItem
                        key={result.id}
                        value={result.title}
                        onSelect={() => handleResultClick(result)}
                        className="flex items-center space-x-3 px-3 py-2"
                      >
                        <div className={`flex-shrink-0 ${getTypeColor(result.type)}`}>
                          {getTypeIcon(result.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{result.title}</span>
                            <Badge variant="secondary" className="text-xs">
                              {result.type}
                            </Badge>
                            {result.isRecent && (
                              <Badge className="bg-blue-500/20 text-blue-400 text-xs">
                                Recent
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {result.description}
                          </p>
                          {result.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {result.tags.slice(0, 3).map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {result.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{result.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ))}
              </>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}

