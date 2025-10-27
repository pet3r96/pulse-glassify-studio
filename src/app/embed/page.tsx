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
  Globe, 
  Shield, 
  Key, 
  Settings, 
  BarChart3, 
  Eye,
  Copy,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  Activity,
  TrendingUp,
  Lock,
  Unlock,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  ExternalLink,
  Code,
  Palette,
  Target,
  MessageSquare,
  ShoppingCart
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { 
  generateEmbedToken, 
  validateEmbedToken, 
  generateEmbedUrl, 
  createSignedEmbedUrl,
  logEmbedActivity,
  getEmbedAnalytics,
  generateEmbedSnippet,
  generateCSSInjectionSnippet,
  generateJSInjectionSnippet,
  updateModuleStatus,
  getModuleStatus,
  trackEmbedEvent,
  handleEmbedError,
  type EmbedToken,
  type EmbedConfig,
  type EmbedLog,
  type EmbedAnalytics
} from '@/lib/embed/embed-manager'

export default function EmbedPage() {
  const { toast } = useToast()
  const [tokens, setTokens] = useState<EmbedToken[]>([])
  const [configs, setConfigs] = useState<EmbedConfig[]>([])
  const [logs, setLogs] = useState<EmbedLog[]>([])
  const [analytics, setAnalytics] = useState<EmbedAnalytics[]>([])
  const [loading, setLoading] = useState(false)
  const [showCreateTokenDialog, setShowCreateTokenDialog] = useState(false)
  const [showConfigDialog, setShowConfigDialog] = useState(false)
  const [selectedToken, setSelectedToken] = useState<EmbedToken | null>(null)
  const [newToken, setNewToken] = useState({
    permissions: ['read', 'write'],
    expires_in_days: 30,
    max_usage: 0
  })
  const [newConfig, setNewConfig] = useState<Partial<EmbedConfig>>({
    modules: {
      theme_studio: true,
      marketplace: true,
      task_manager: true,
      support: true,
      analytics: true
    },
    security: {
      allowed_domains: [],
      require_https: false
    }
  })

  useEffect(() => {
    loadEmbedData()
  }, [])

  const loadEmbedData = async () => {
    setLoading(true)
    try {
      // Mock data - in real implementation, this would fetch from Supabase
      const mockTokens: EmbedToken[] = [
        {
          id: 'token-1',
          agency_id: 'agency-1',
          token: 'pk_live_1234567890abcdef',
          expires_at: '2024-02-22T00:00:00Z',
          permissions: ['read', 'write'],
          is_active: true,
          created_at: '2024-01-22T00:00:00Z',
          last_used: '2024-01-22T10:30:00Z',
          usage_count: 45
        },
        {
          id: 'token-2',
          agency_id: 'agency-1',
          token: 'pk_test_abcdef1234567890',
          expires_at: '2024-01-25T00:00:00Z',
          permissions: ['read'],
          is_active: true,
          created_at: '2024-01-20T00:00:00Z',
          usage_count: 12
        }
      ]

      const mockConfigs: EmbedConfig[] = [
        {
          agency_id: 'agency-1',
          modules: {
            theme_studio: true,
            marketplace: true,
            task_manager: false,
            support: true,
            analytics: true
          },
          branding: {
            logo_url: '/logo.png',
            primary_color: '#3B82F6',
            secondary_color: '#8B5CF6'
          },
          security: {
            allowed_domains: ['example.com', '*.example.com'],
            require_https: true
          }
        }
      ]

      const mockLogs: EmbedLog[] = [
        {
          id: 'log-1',
          token_id: 'token-1',
          agency_id: 'agency-1',
          action: 'theme_loaded',
          details: { theme_id: 'theme-1', page: '/theme-studio' },
          ip_address: '192.168.1.1',
          user_agent: 'Mozilla/5.0...',
          timestamp: '2024-01-22T10:30:00Z',
          success: true
        },
        {
          id: 'log-2',
          token_id: 'token-1',
          agency_id: 'agency-1',
          action: 'api_call',
          details: { endpoint: '/api/themes', method: 'GET' },
          ip_address: '192.168.1.1',
          user_agent: 'Mozilla/5.0...',
          timestamp: '2024-01-22T10:25:00Z',
          success: true
        }
      ]

      const mockAnalytics: EmbedAnalytics[] = [
        {
          token_id: 'token-1',
          agency_id: 'agency-1',
          page_views: 1250,
          unique_visitors: 45,
          actions_performed: 320,
          errors_count: 12,
          avg_session_duration: 1800,
          last_activity: '2024-01-22T10:30:00Z',
          created_at: '2024-01-22T00:00:00Z'
        }
      ]

      setTokens(mockTokens)
      setConfigs(mockConfigs)
      setLogs(mockLogs)
      setAnalytics(mockAnalytics)
    } catch (error) {
      console.error('Error loading embed data:', error)
      toast({
        title: "Error",
        description: "Failed to load embed data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateToken = async () => {
    setLoading(true)
    try {
      const token = generateEmbedToken('agency-1', newToken.permissions)
      setTokens(prev => [token, ...prev])
      setNewToken({
        permissions: ['read', 'write'],
        expires_in_days: 30,
        max_usage: 0
      })
      setShowCreateTokenDialog(false)
      
      toast({
        title: "Token Created",
        description: "New embed token has been created successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create token",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateConfig = async () => {
    setLoading(true)
    try {
      const config: EmbedConfig = {
        agency_id: 'agency-1',
        modules: newConfig.modules!,
        branding: newConfig.branding ?? {},
        security: newConfig.security!
      }
      setConfigs(prev => [config, ...prev])
      setNewConfig({
        modules: {
          theme_studio: true,
          marketplace: true,
          task_manager: true,
          support: true,
          analytics: true
        },
        security: {
          allowed_domains: [],
          require_https: false
        }
      })
      setShowConfigDialog(false)
      
      toast({
        title: "Config Created",
        description: "New embed configuration has been created successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create configuration",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token)
    toast({
      title: "Copied",
      description: "Token copied to clipboard",
    })
  }

  const handleCopyEmbedCode = (token: string) => {
    const snippet = generateEmbedSnippet('agency-1', configs[0])
    navigator.clipboard.writeText(snippet)
    toast({
      title: "Copied",
      description: "Embed code copied to clipboard",
    })
  }

  const handleToggleTokenStatus = async (tokenId: string) => {
    try {
      setTokens(prev => prev.map(token => 
        token.id === tokenId 
          ? { ...token, is_active: !token.is_active }
          : token
      ))
      
      toast({
        title: "Token Updated",
        description: "Token status has been updated",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update token status",
        variant: "destructive",
      })
    }
  }

  const getTokenStatusColor = (token: EmbedToken) => {
    if (!token.is_active) return 'bg-gray-500/20 text-gray-400'
    if (new Date(token.expires_at) < new Date()) return 'bg-red-500/20 text-red-400'
    return 'bg-green-500/20 text-green-400'
  }

  const getTokenStatusText = (token: EmbedToken) => {
    if (!token.is_active) return 'Inactive'
    if (new Date(token.expires_at) < new Date()) return 'Expired'
    return 'Active'
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div className="glass border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-heading gradient-text">Embed Management</h1>
              <p className="text-muted-foreground">Manage embedded apps and integration tokens</p>
            </div>
            <div className="flex items-center gap-4">
              <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="glass">
                    <Settings className="h-4 w-4 mr-2" />
                    Configuration
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-card max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Embed Configuration</DialogTitle>
                    <DialogDescription>
                      Configure embed settings and security
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Enabled Modules</Label>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        {Object.entries(newConfig.modules || {}).map(([module, enabled]) => (
                          <label key={module} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={enabled}
                              onChange={(e) => setNewConfig(prev => ({
                                ...prev,
                                modules: {
                                  ...prev.modules!,
                                  [module]: e.target.checked
                                }
                              }))}
                              className="rounded"
                            />
                            <span className="text-sm capitalize">{module.replace('_', ' ')}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="allowed-domains">Allowed Domains</Label>
                      <Textarea
                        id="allowed-domains"
                        value={newConfig.security?.allowed_domains?.join('\n') || ''}
                        onChange={(e) => setNewConfig(prev => ({
                          ...prev,
                          security: {
                            ...prev.security!,
                            allowed_domains: e.target.value.split('\n').filter(d => d.trim())
                          }
                        }))}
                        placeholder="example.com&#10;*.example.com"
                        className="glass mt-2"
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="require-https"
                        checked={newConfig.security?.require_https || false}
                        onChange={(e) => setNewConfig(prev => ({
                          ...prev,
                          security: {
                            ...prev.security!,
                            require_https: e.target.checked
                          }
                        }))}
                        className="rounded"
                      />
                      <Label htmlFor="require-https">Require HTTPS</Label>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowConfigDialog(false)}
                        className="glass"
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleCreateConfig} className="btn-primary">
                        Save Configuration
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Dialog open={showCreateTokenDialog} onOpenChange={setShowCreateTokenDialog}>
                <DialogTrigger asChild>
                  <Button className="btn-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    New Token
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-card">
                  <DialogHeader>
                    <DialogTitle>Create Embed Token</DialogTitle>
                    <DialogDescription>
                      Generate a new token for embedding PulseGen Studio
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Permissions</Label>
                      <div className="space-y-2 mt-2">
                        {['read', 'write', 'delete', 'admin'].map((permission) => (
                          <label key={permission} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={newToken.permissions.includes(permission)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewToken(prev => ({
                                    ...prev,
                                    permissions: [...prev.permissions, permission]
                                  }))
                                } else {
                                  setNewToken(prev => ({
                                    ...prev,
                                    permissions: prev.permissions.filter(p => p !== permission)
                                  }))
                                }
                              }}
                              className="rounded"
                            />
                            <span className="text-sm capitalize">{permission}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="expires-in">Expires In (Days)</Label>
                      <Input
                        id="expires-in"
                        type="number"
                        value={newToken.expires_in_days}
                        onChange={(e) => setNewToken(prev => ({ ...prev, expires_in_days: parseInt(e.target.value) }))}
                        className="glass mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="max-usage">Max Usage (0 = unlimited)</Label>
                      <Input
                        id="max-usage"
                        type="number"
                        value={newToken.max_usage}
                        onChange={(e) => setNewToken(prev => ({ ...prev, max_usage: parseInt(e.target.value) }))}
                        className="glass mt-2"
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowCreateTokenDialog(false)}
                        className="glass"
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleCreateToken} className="btn-primary">
                        Create Token
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
        <Tabs defaultValue="tokens" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 glass">
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
            <TabsTrigger value="configs">Configurations</TabsTrigger>
            <TabsTrigger value="logs">Activity Logs</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Tokens Tab */}
          <TabsContent value="tokens" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tokens.map((token) => (
                <Card key={token.id} className="glass-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Embed Token</CardTitle>
                      <Badge className={getTokenStatusColor(token)}>
                        {getTokenStatusText(token)}
                      </Badge>
                    </div>
                    <CardDescription>
                      Created {new Date(token.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">Token</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input
                            value={token.token}
                            readOnly
                            className="glass font-mono text-xs"
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCopyToken(token.token)}
                            className="glass"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm text-muted-foreground">Permissions</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {token.permissions.map((permission) => (
                            <Badge key={permission} variant="secondary" className="text-xs">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Usage:</span>
                          <span className="ml-1">{token.usage_count}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Expires:</span>
                          <span className="ml-1">{new Date(token.expires_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleTokenStatus(token.id)}
                          className="glass flex-1"
                        >
                          {token.is_active ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopyEmbedCode(token.token)}
                          className="glass flex-1"
                        >
                          <Code className="h-4 w-4 mr-1" />
                          Code
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Configurations Tab */}
          <TabsContent value="configs" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {configs.map((config, index) => (
                <Card key={index} className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="h-5 w-5 mr-2" />
                      Configuration
                    </CardTitle>
                    <CardDescription>
                      Agency: {config.agency_id}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">Enabled Modules</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {Object.entries(config.modules).map(([module, enabled]) => (
                            <div key={module} className="flex items-center space-x-2">
                              {enabled ? (
                                <CheckCircle className="h-4 w-4 text-green-400" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-gray-400" />
                              )}
                              <span className="text-sm capitalize">{module.replace('_', ' ')}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm text-muted-foreground">Security Settings</Label>
                        <div className="space-y-2 mt-2">
                          <div className="flex items-center space-x-2">
                            {config.security.require_https ? (
                              <CheckCircle className="h-4 w-4 text-green-400" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-gray-400" />
                            )}
                            <span className="text-sm">HTTPS Required</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Allowed Domains: {config.security.allowed_domains.length}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Activity Logs Tab */}
          <TabsContent value="logs" className="space-y-4">
            <div className="space-y-4">
              {logs.map((log) => (
                <Card key={log.id} className="glass-card">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {log.success ? (
                            <CheckCircle className="h-4 w-4 text-green-400" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-400" />
                          )}
                          <span className="font-medium">{log.action}</span>
                          <Badge variant="secondary" className="text-xs">
                            {log.token_id}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {JSON.stringify(log.details, null, 2)}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>IP: {log.ip_address}</span>
                          <span>{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {analytics.map((analytic) => (
                <Card key={analytic.token_id} className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Analytics</CardTitle>
                    <CardDescription>
                      Token: {analytic.token_id}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-2xl font-bold gradient-text">{analytic.page_views}</div>
                          <p className="text-xs text-muted-foreground">Page Views</p>
                        </div>
                        <div>
                          <div className="text-2xl font-bold gradient-text">{analytic.unique_visitors}</div>
                          <p className="text-xs text-muted-foreground">Unique Visitors</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-2xl font-bold gradient-text">{analytic.actions_performed}</div>
                          <p className="text-xs text-muted-foreground">Actions</p>
                        </div>
                        <div>
                          <div className="text-2xl font-bold gradient-text">{analytic.errors_count}</div>
                          <p className="text-xs text-muted-foreground">Errors</p>
                        </div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        Avg Session: {Math.round(analytic.avg_session_duration / 60)}m
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
