'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Palette, 
  Eye, 
  Download, 
  Upload, 
  Settings,
  Plus,
  Copy,
  Save,
  RotateCcw,
  Play,
  Pause,
  Code,
  Monitor,
  Smartphone,
  Tablet,
  Zap,
  History,
  GitBranch,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import { CodeEditor } from '@/components/ui/code-editor'
import { VersionControl } from '@/components/theme/VersionControl'
import { DeploymentSystem } from '@/components/theme/DeploymentSystem'

interface ThemeData {
  id?: string
  name: string
  description: string
  css_content: string
  js_content: string
  status: 'draft' | 'published' | 'archived'
  version: number
  created_at?: string
  updated_at?: string
}

interface DeploymentData {
  id: string
  theme_id: string
  deployed_at: string
  status: 'success' | 'failed' | 'pending'
  rollback_available_until: string
}

export default function ThemeStudioPage() {
  const { toast } = useToast()
  const [currentTheme, setCurrentTheme] = useState<ThemeData>({
    name: 'New Theme',
    description: '',
    css_content: '',
    js_content: '',
    status: 'draft',
    version: 1
  })
  const [themes, setThemes] = useState<ThemeData[]>([])
  const [deployments, setDeployments] = useState<DeploymentData[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deploying, setDeploying] = useState(false)
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [isLivePreview, setIsLivePreview] = useState(true)
  const [activeTab, setActiveTab] = useState('css')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  
  const cssEditorRef = useRef<HTMLTextAreaElement>(null)
  const jsEditorRef = useRef<HTMLTextAreaElement>(null)
  const previewFrameRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    loadThemes()
    loadDeployments()
  }, [])

  useEffect(() => {
    if (isLivePreview && currentTheme.css_content) {
      updatePreview()
    }
  }, [currentTheme.css_content, currentTheme.js_content, isLivePreview])

  const loadThemes = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('themes')
        .select('*')
        .order('updated_at', { ascending: false })
      
      if (error) throw error
      setThemes(data || [])
      
      if (data && data.length > 0) {
        setCurrentTheme(data[0])
      }
    } catch (error) {
      console.error('Error loading themes:', error)
      toast({
        title: "Error",
        description: "Failed to load themes",
        variant: "destructive",
      })
    }
  }

  const loadDeployments = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('theme_deployments')
        .select('*')
        .order('deployed_at', { ascending: false })
        .limit(10)
      
      if (error) throw error
      setDeployments(data || [])
    } catch (error) {
      console.error('Error loading deployments:', error)
    }
  }

  const saveTheme = async () => {
    if (!currentTheme.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a theme name",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const themeData = {
        ...currentTheme,
        updated_at: new Date().toISOString()
      }

      let result
      if (currentTheme.id) {
        // Update existing theme
        const { data, error } = await (supabase as any)
          .from('themes')
          .update(themeData)
          .eq('id', currentTheme.id)
          .select()
          .single()
        
        if (error) throw error
        result = data
      } else {
        // Create new theme
        const { data, error } = await (supabase as any)
          .from('themes')
          .insert({
            ...themeData,
            created_at: new Date().toISOString()
          })
          .select()
          .single()
        
        if (error) throw error
        result = data
      }

      setCurrentTheme(result)
      setHasUnsavedChanges(false)
      await loadThemes()
      
      toast({
        title: "Success!",
        description: "Theme saved successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save theme",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const deployTheme = async () => {
    if (!currentTheme.id) {
      toast({
        title: "Error",
        description: "Please save the theme before deploying",
        variant: "destructive",
      })
      return
    }

    setDeploying(true)
    try {
      // Simulate deployment process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const deploymentData = {
        theme_id: currentTheme.id,
        deployed_at: new Date().toISOString(),
        status: 'success' as const,
        rollback_available_until: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
      }

      const { data, error } = await (supabase as any)
        .from('theme_deployments')
        .insert(deploymentData)
        .select()
        .single()

      if (error) throw error
      
      setDeployments(prev => [data, ...prev])
      
      toast({
        title: "Deployed!",
        description: "Theme deployed successfully to GoHighLevel",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to deploy theme",
        variant: "destructive",
      })
    } finally {
      setDeploying(false)
    }
  }

  const updatePreview = () => {
    if (!previewFrameRef.current) return

    const iframe = previewFrameRef.current
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
    
    if (!iframeDoc) return

    // Update CSS
    let styleEl = iframeDoc.getElementById('pg-theme-css') as HTMLStyleElement
    if (!styleEl) {
      styleEl = iframeDoc.createElement('style')
      styleEl.id = 'pg-theme-css'
      iframeDoc.head.appendChild(styleEl)
    }
    styleEl.textContent = currentTheme.css_content

    // Update JS
    if (currentTheme.js_content) {
      try {
        // Remove existing script
        const existingScript = iframeDoc.getElementById('pg-theme-js')
        if (existingScript) {
          existingScript.remove()
        }

        // Add new script
        const scriptEl = iframeDoc.createElement('script')
        scriptEl.id = 'pg-theme-js'
        scriptEl.textContent = currentTheme.js_content
        iframeDoc.head.appendChild(scriptEl)
      } catch (error) {
        console.error('Error executing JavaScript:', error)
      }
    }
  }

  const handleThemeChange = (field: keyof ThemeData, value: string) => {
    setCurrentTheme(prev => ({ ...prev, [field]: value }))
    setHasUnsavedChanges(true)
  }

  const createNewTheme = () => {
    setCurrentTheme({
      name: 'New Theme',
      description: '',
      css_content: '',
      js_content: '',
      status: 'draft',
      version: 1
    })
    setHasUnsavedChanges(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Code copied to clipboard",
    })
  }

  const getPreviewDimensions = () => {
    switch (previewMode) {
      case 'mobile':
        return { width: '375px', height: '667px' }
      case 'tablet':
        return { width: '768px', height: '1024px' }
      default:
        return { width: '100%', height: '600px' }
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div className="glass border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-heading gradient-text">Theme Studio</h1>
              <p className="text-muted-foreground">Create and customize your GoHighLevel themes</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant={isLivePreview ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsLivePreview(!isLivePreview)}
                  className={isLivePreview ? "btn-primary" : "glass"}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Live Preview
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={updatePreview}
                  className="glass"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={saveTheme}
                disabled={saving}
                className="glass"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button
                onClick={deployTheme}
                disabled={deploying || !currentTheme.id}
                className="btn-primary"
              >
                <Zap className="h-4 w-4 mr-2" />
                {deploying ? 'Deploying...' : 'Deploy'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Theme Controls */}
          <div className="lg:col-span-1">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="mr-2 h-5 w-5" />
                  Theme Settings
                </CardTitle>
                <CardDescription>
                  Configure your theme properties
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="theme-name">Theme Name</Label>
                    <Input
                      id="theme-name"
                      value={currentTheme.name}
                      onChange={(e) => handleThemeChange('name', e.target.value)}
                      className="glass mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="theme-description">Description</Label>
                    <Textarea
                      id="theme-description"
                      value={currentTheme.description}
                      onChange={(e) => handleThemeChange('description', e.target.value)}
                      className="glass mt-2"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="theme-status">Status</Label>
                    <Select
                      value={currentTheme.status}
                      onValueChange={(value) => handleThemeChange('status', value)}
                    >
                      <SelectTrigger className="glass mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span>Version</span>
                    <Badge variant="secondary">{currentTheme.version}</Badge>
                  </div>

                  {hasUnsavedChanges && (
                    <div className="flex items-center text-yellow-400 text-sm">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Unsaved changes
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Themes */}
            <Card className="glass-card mt-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <History className="mr-2 h-5 w-5" />
                    Recent Themes
                  </span>
                  <Button size="sm" variant="outline" onClick={createNewTheme}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {themes.slice(0, 5).map((theme) => (
                    <div
                      key={theme.id}
                      className={`p-3 glass rounded-lg cursor-pointer transition-all ${
                        currentTheme.id === theme.id ? 'ring-2 ring-purple-500' : ''
                      }`}
                      onClick={() => setCurrentTheme(theme)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{theme.name}</p>
                          <p className="text-xs text-muted-foreground">
                            v{theme.version} • {theme.status}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {theme.version}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Editor and Preview */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 glass">
                <TabsTrigger value="css" className="flex items-center">
                  <Code className="h-4 w-4 mr-2" />
                  CSS
                </TabsTrigger>
                <TabsTrigger value="js" className="flex items-center">
                  <Code className="h-4 w-4 mr-2" />
                  JavaScript
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="versions" className="flex items-center">
                  <GitBranch className="h-4 w-4 mr-2" />
                  Versions
                </TabsTrigger>
                <TabsTrigger value="deploy" className="flex items-center">
                  <Zap className="h-4 w-4 mr-2" />
                  Deploy
                </TabsTrigger>
              </TabsList>

              <TabsContent value="css" className="space-y-4">
                <CodeEditor
                  value={currentTheme.css_content}
                  onChange={(value) => handleThemeChange('css_content', value)}
                  language="css"
                  placeholder="/* Add your custom CSS here */"
                  height="500px"
                />
              </TabsContent>

              <TabsContent value="js" className="space-y-4">
                <CodeEditor
                  value={currentTheme.js_content}
                  onChange={(value) => handleThemeChange('js_content', value)}
                  language="javascript"
                  placeholder="// Add your custom JavaScript here"
                  height="500px"
                />
              </TabsContent>

              <TabsContent value="preview" className="space-y-4">
                <Card className="glass-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Live Preview</CardTitle>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant={previewMode === 'desktop' ? 'default' : 'outline'}
                            onClick={() => setPreviewMode('desktop')}
                            className={previewMode === 'desktop' ? 'btn-primary' : 'glass'}
                          >
                            <Monitor className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={previewMode === 'tablet' ? 'default' : 'outline'}
                            onClick={() => setPreviewMode('tablet')}
                            className={previewMode === 'tablet' ? 'btn-primary' : 'glass'}
                          >
                            <Tablet className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={previewMode === 'mobile' ? 'default' : 'outline'}
                            onClick={() => setPreviewMode('mobile')}
                            className={previewMode === 'mobile' ? 'btn-primary' : 'glass'}
                          >
                            <Smartphone className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <CardDescription>
                      See how your theme looks in real-time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg overflow-hidden bg-white/5">
                      <iframe
                        ref={previewFrameRef}
                        src="/preview-frame"
                        className="w-full border-0"
                        style={getPreviewDimensions()}
                        title="Theme Preview"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="versions" className="space-y-4">
                <VersionControl
                  themeId={currentTheme.id || ''}
                  currentVersion={currentTheme.version}
                  onVersionSelect={(version) => {
                    setCurrentTheme(prev => ({
                      ...prev,
                      css_content: version.css_content,
                      js_content: version.js_content,
                      version: version.version
                    }))
                  }}
                  onVersionCreate={(name, description) => {
                    const newVersion = currentTheme.version + 1
                    setCurrentTheme(prev => ({
                      ...prev,
                      version: newVersion,
                      name: `${prev.name} - ${name}`
                    }))
                    toast({
                      title: "Version Created",
                      description: `Version ${newVersion} created successfully`,
                    })
                  }}
                  onVersionRestore={(versionId) => {
                    toast({
                      title: "Version Restored",
                      description: "Theme has been restored to selected version",
                    })
                  }}
                />
              </TabsContent>

              <TabsContent value="deploy" className="space-y-4">
                <DeploymentSystem
                  themeId={currentTheme.id || ''}
                  themeName={currentTheme.name}
                  onDeploy={async (subaccountId) => {
                    await deployTheme()
                  }}
                  onRollback={async (deploymentId) => {
                    toast({
                      title: "Rollback Initiated",
                      description: "Theme rollback has been initiated",
                    })
                  }}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}