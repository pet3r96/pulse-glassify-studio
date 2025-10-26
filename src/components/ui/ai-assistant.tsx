'use client'

import { useState, useEffect, useRef } from 'react'
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
  Bot, 
  MessageSquare, 
  Send, 
  Lightbulb, 
  Target, 
  Palette, 
  Settings, 
  BarChart3, 
  Users, 
  Zap,
  CheckCircle,
  AlertCircle,
  Info,
  Star,
  Heart,
  TrendingUp,
  Download,
  Upload,
  Copy,
  Share2,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  ArrowRight,
  ArrowLeft,
  Home,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Clock,
  Calendar,
  Globe,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Play,
  Pause,
  Stop,
  RotateCcw,
  Save,
  Activity,
  DollarSign,
  ShoppingCart,
  MessageCircle,
  Phone,
  Mail,
  Calendar as CalendarIcon,
  FileText,
  Code,
  Image,
  Video,
  Music,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Signal,
  SignalZero
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface AIMessage {
  id: string
  type: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  suggestions?: string[]
  actions?: AIAction[]
  metadata?: any
}

interface AIAction {
  id: string
  label: string
  description: string
  icon: React.ComponentType<any>
  action: () => void
  type: 'primary' | 'secondary' | 'danger'
}

interface AISuggestion {
  id: string
  title: string
  description: string
  category: 'onboarding' | 'optimization' | 'feature' | 'troubleshooting'
  priority: 'high' | 'medium' | 'low'
  action: () => void
  completed: boolean
}

interface AIAssistantProps {
  onActionExecute?: (action: AIAction) => void
  onSuggestionApply?: (suggestion: AISuggestion) => void
  className?: string
}

export function AIAssistant({ onActionExecute, onSuggestionApply, className }: AIAssistantProps) {
  const { toast } = useToast()
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const onboardingSteps = [
    {
      id: 'welcome',
      title: 'Welcome to PulseGen Studio!',
      description: 'Let me help you get started with your theme customization journey.',
      suggestions: [
        'Set up your GoHighLevel API key',
        'Upload your agency logo',
        'Choose your base theme',
        'Configure embed settings'
      ]
    },
    {
      id: 'api-setup',
      title: 'API Integration',
      description: 'Connect your GoHighLevel account to start customizing themes.',
      suggestions: [
        'Enter your GHL API key',
        'Test the connection',
        'Verify permissions',
        'Set up webhooks'
      ]
    },
    {
      id: 'theme-selection',
      title: 'Choose Your Base Theme',
      description: 'Select a starting point for your custom theme.',
      suggestions: [
        'Browse theme templates',
        'Preview different styles',
        'Customize colors and fonts',
        'Test on different devices'
      ]
    },
    {
      id: 'customization',
      title: 'Theme Customization',
      description: 'Make the theme truly yours with advanced customization options.',
      suggestions: [
        'Edit CSS and JavaScript',
        'Add custom components',
        'Configure animations',
        'Test responsiveness'
      ]
    },
    {
      id: 'deployment',
      title: 'Deploy Your Theme',
      description: 'Push your custom theme to your GoHighLevel dashboard.',
      suggestions: [
        'Preview the final theme',
        'Deploy to staging',
        'Test functionality',
        'Go live'
      ]
    }
  ]

  useEffect(() => {
    // Initialize with welcome message
    if (messages.length === 0) {
      addMessage({
        type: 'assistant',
        content: 'Hello! I\'m your AI assistant. I\'m here to help you get the most out of PulseGen Studio. What would you like to work on today?',
        suggestions: [
          'Get started with theme creation',
          'Learn about marketplace features',
          'Set up project management',
          'Explore analytics'
        ]
      })
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const addMessage = (message: Omit<AIMessage, 'id' | 'timestamp'>) => {
    const newMessage: AIMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    }
    setMessages(prev => [...prev, newMessage])
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput('')
    setLoading(true)

    // Add user message
    addMessage({
      type: 'user',
      content: userMessage
    })

    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const response = generateAIResponse(userMessage)
      addMessage(response)
    } catch (error) {
      addMessage({
        type: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        suggestions: ['Try rephrasing your question', 'Check your internet connection', 'Contact support if the issue persists']
      })
    } finally {
      setLoading(false)
    }
  }

  const generateAIResponse = (userMessage: string): Omit<AIMessage, 'id' | 'timestamp'> => {
    const message = userMessage.toLowerCase()
    
    if (message.includes('theme') || message.includes('customize')) {
      return {
        type: 'assistant',
        content: 'Great! Let\'s work on your theme. I can help you with CSS customization, JavaScript enhancements, and responsive design. What specific aspect would you like to focus on?',
        suggestions: [
          'Customize colors and fonts',
          'Add animations and effects',
          'Make it mobile responsive',
          'Optimize for performance'
        ],
        actions: [
          {
            id: 'open-theme-studio',
            label: 'Open Theme Studio',
            description: 'Start customizing your theme',
            icon: Palette,
            action: () => window.location.href = '/theme-studio',
            type: 'primary'
          }
        ]
      }
    }
    
    if (message.includes('marketplace') || message.includes('sell')) {
      return {
        type: 'assistant',
        content: 'The marketplace is perfect for sharing your themes with others! I can help you prepare your theme for publication, set pricing, and optimize for discoverability.',
        suggestions: [
          'Prepare theme for marketplace',
          'Set competitive pricing',
          'Write compelling descriptions',
          'Add preview images'
        ],
        actions: [
          {
            id: 'open-marketplace',
            label: 'Browse Marketplace',
            description: 'Explore themes and components',
            icon: ShoppingCart,
            action: () => window.location.href = '/marketplace',
            type: 'primary'
          }
        ]
      }
    }
    
    if (message.includes('project') || message.includes('task')) {
      return {
        type: 'assistant',
        content: 'Project management helps you stay organized! I can help you create tasks, set deadlines, and track progress across your team.',
        suggestions: [
          'Create a new project',
          'Set up task templates',
          'Assign team members',
          'Track progress'
        ],
        actions: [
          {
            id: 'open-task-manager',
            label: 'Open Task Manager',
            description: 'Manage projects and tasks',
            icon: Target,
            action: () => window.location.href = '/task-manager',
            type: 'primary'
          }
        ]
      }
    }
    
    if (message.includes('analytics') || message.includes('performance')) {
      return {
        type: 'assistant',
        content: 'Analytics give you insights into how your themes are performing! I can help you understand user behavior, track conversions, and optimize for better results.',
        suggestions: [
          'View theme performance',
          'Analyze user behavior',
          'Track conversion rates',
          'Generate reports'
        ],
        actions: [
          {
            id: 'open-analytics',
            label: 'View Analytics',
            description: 'See performance insights',
            icon: BarChart3,
            action: () => window.location.href = '/analytics',
            type: 'primary'
          }
        ]
      }
    }
    
    if (message.includes('help') || message.includes('support')) {
      return {
        type: 'assistant',
        content: 'I\'m here to help! I can assist with theme creation, marketplace features, project management, and more. What specific area would you like help with?',
        suggestions: [
          'Theme creation guide',
          'Marketplace best practices',
          'Project management tips',
          'Contact support team'
        ],
        actions: [
          {
            id: 'contact-support',
            label: 'Contact Support',
            description: 'Get help from our team',
            icon: MessageCircle,
            action: () => window.location.href = '/support',
            type: 'primary'
          }
        ]
      }
    }
    
    // Default response
    return {
      type: 'assistant',
      content: 'I understand you\'re looking for help. I can assist you with theme creation, marketplace features, project management, analytics, and more. Could you be more specific about what you\'d like to work on?',
      suggestions: [
        'Create a new theme',
        'Browse the marketplace',
        'Manage projects',
        'View analytics'
      ]
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
  }

  const handleActionClick = (action: AIAction) => {
    action.action()
    onActionExecute?.(action)
    toast({
      title: "Action Executed",
      description: action.description,
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <Users className="h-4 w-4" />
      case 'assistant':
        return <Bot className="h-4 w-4" />
      case 'system':
        return <Settings className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const getActionColor = (type: string) => {
    switch (type) {
      case 'primary':
        return 'btn-primary'
      case 'secondary':
        return 'glass hover:glass-hover'
      case 'danger':
        return 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
      default:
        return 'glass hover:glass-hover'
    }
  }

  return (
    <div className={className}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="fixed bottom-6 right-6 h-14 w-14 rounded-full glass hover:glass-hover shadow-lg">
            <Bot className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="glass-card max-w-2xl h-[600px] p-0">
          <DialogHeader className="p-6 border-b border-white/10">
            <DialogTitle className="flex items-center">
              <Bot className="h-5 w-5 mr-2 text-blue-400" />
              AI Assistant
            </DialogTitle>
            <DialogDescription>
              Your intelligent helper for PulseGen Studio
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-blue-500' 
                      : message.type === 'assistant'
                      ? 'bg-purple-500'
                      : 'bg-gray-500'
                  }`}>
                    {getMessageIcon(message.type)}
                  </div>
                  
                  <div className={`flex-1 ${
                    message.type === 'user' ? 'text-right' : ''
                  }`}>
                    <div className={`inline-block p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-500/20 text-blue-100'
                        : 'glass'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                    
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="glass hover:glass-hover text-xs mr-2 mb-1"
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                    
                    {message.actions && message.actions.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {message.actions.map((action) => {
                          const Icon = action.icon
                          return (
                            <Button
                              key={action.id}
                              onClick={() => handleActionClick(action)}
                              className={`${getActionColor(action.type)} text-xs`}
                            >
                              <Icon className="h-3 w-3 mr-1" />
                              {action.label}
                            </Button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="glass p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input */}
            <div className="p-6 border-t border-white/10">
              <div className="flex space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about PulseGen Studio..."
                  className="glass flex-1"
                  disabled={loading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={loading || !input.trim()}
                  className="btn-primary"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
