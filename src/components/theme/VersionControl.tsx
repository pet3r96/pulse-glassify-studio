'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  GitBranch, 
  GitCommit, 
  GitMerge, 
  RotateCcw, 
  Plus,
  CheckCircle,
  AlertCircle,
  Clock,
  Eye,
  Download,
  Trash2,
  Copy
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ThemeVersion {
  id: string
  version: number
  name: string
  description: string
  css_content: string
  js_content: string
  created_at: string
  created_by: string
  is_current: boolean
  deployment_status: 'not_deployed' | 'deployed' | 'failed'
}

interface VersionControlProps {
  themeId: string
  currentVersion: number
  onVersionSelect: (version: ThemeVersion) => void
  onVersionCreate: (name: string, description: string) => void
  onVersionRestore: (versionId: string) => void
}

export function VersionControl({
  themeId,
  currentVersion,
  onVersionSelect,
  onVersionCreate,
  onVersionRestore
}: VersionControlProps) {
  const { toast } = useToast()
  const [versions, setVersions] = useState<ThemeVersion[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newVersionName, setNewVersionName] = useState('')
  const [newVersionDescription, setNewVersionDescription] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadVersions()
  }, [themeId])

  const loadVersions = async () => {
    try {
      // Mock data - in real implementation, this would fetch from API
      const mockVersions: ThemeVersion[] = [
        {
          id: '1',
          version: 3,
          name: 'v3.0 - Dark Mode Update',
          description: 'Added dark mode support and improved mobile responsiveness',
          css_content: '/* Dark mode styles */',
          js_content: '// Dark mode functionality',
          created_at: '2024-01-15T10:30:00Z',
          created_by: 'John Doe',
          is_current: true,
          deployment_status: 'deployed'
        },
        {
          id: '2',
          version: 2,
          name: 'v2.1 - Bug Fixes',
          description: 'Fixed navigation issues and improved performance',
          css_content: '/* Bug fixes */',
          js_content: '// Performance improvements',
          created_at: '2024-01-10T14:20:00Z',
          created_by: 'Jane Smith',
          is_current: false,
          deployment_status: 'deployed'
        },
        {
          id: '3',
          version: 1,
          name: 'v1.0 - Initial Release',
          description: 'Initial theme with basic styling and functionality',
          css_content: '/* Initial styles */',
          js_content: '// Basic functionality',
          created_at: '2024-01-01T09:00:00Z',
          created_by: 'John Doe',
          is_current: false,
          deployment_status: 'not_deployed'
        }
      ]
      setVersions(mockVersions)
    } catch (error) {
      console.error('Error loading versions:', error)
    }
  }

  const handleCreateVersion = async () => {
    if (!newVersionName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a version name",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const newVersion: ThemeVersion = {
        id: Date.now().toString(),
        version: currentVersion + 1,
        name: newVersionName,
        description: newVersionDescription,
        css_content: '',
        js_content: '',
        created_at: new Date().toISOString(),
        created_by: 'Current User',
        is_current: false,
        deployment_status: 'not_deployed'
      }

      setVersions(prev => [newVersion, ...prev])
      onVersionCreate(newVersionName, newVersionDescription)
      
      setNewVersionName('')
      setNewVersionDescription('')
      setShowCreateForm(false)
      
      toast({
        title: "Success!",
        description: "New version created successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create version",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRestoreVersion = async (versionId: string) => {
    const version = versions.find(v => v.id === versionId)
    if (!version) return

    try {
      onVersionRestore(versionId)
      
      // Update current version
      setVersions(prev => prev.map(v => ({
        ...v,
        is_current: v.id === versionId
      })))
      
      toast({
        title: "Restored!",
        description: `Version ${version.version} has been restored`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to restore version",
        variant: "destructive",
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'deployed':
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-400" />
      default:
        return <Clock className="h-4 w-4 text-yellow-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed':
        return 'bg-green-500/20 text-green-400'
      case 'failed':
        return 'bg-red-500/20 text-red-400'
      default:
        return 'bg-yellow-500/20 text-yellow-400'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center">
            <GitBranch className="mr-2 h-5 w-5" />
            Version Control
          </h3>
          <p className="text-sm text-muted-foreground">
            Manage theme versions and rollback changes
          </p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Version
        </Button>
      </div>

      {/* Create Version Form */}
      {showCreateForm && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Create New Version</CardTitle>
            <CardDescription>
              Create a new version of your theme
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="version-name">Version Name</Label>
              <Input
                id="version-name"
                value={newVersionName}
                onChange={(e) => setNewVersionName(e.target.value)}
                placeholder="e.g., v3.1 - Mobile Improvements"
                className="glass mt-2"
              />
            </div>
            <div>
              <Label htmlFor="version-description">Description</Label>
              <Textarea
                id="version-description"
                value={newVersionDescription}
                onChange={(e) => setNewVersionDescription(e.target.value)}
                placeholder="Describe the changes in this version..."
                className="glass mt-2"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowCreateForm(false)}
                className="glass"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateVersion}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Creating...' : 'Create Version'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Versions List */}
      <div className="space-y-3">
        {versions.map((version) => (
          <Card
            key={version.id}
            className={`glass-card transition-all ${
              version.is_current ? 'ring-2 ring-purple-500' : ''
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold">{version.name}</h4>
                    {version.is_current && (
                      <Badge className="bg-purple-500/20 text-purple-400">
                        Current
                      </Badge>
                    )}
                    <Badge className={getStatusColor(version.deployment_status)}>
                      {version.deployment_status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {version.description}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>Version {version.version}</span>
                    <span>•</span>
                    <span>Created by {version.created_by}</span>
                    <span>•</span>
                    <span>{new Date(version.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onVersionSelect(version)}
                    className="glass"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {!version.is_current && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRestoreVersion(version.id)}
                      className="glass"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigator.clipboard.writeText(version.css_content)}
                    className="glass"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Version Statistics */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base">Version Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold gradient-text">
                {versions.length}
              </div>
              <div className="text-xs text-muted-foreground">Total Versions</div>
            </div>
            <div>
              <div className="text-2xl font-bold gradient-text">
                {versions.filter(v => v.deployment_status === 'deployed').length}
              </div>
              <div className="text-xs text-muted-foreground">Deployed</div>
            </div>
            <div>
              <div className="text-2xl font-bold gradient-text">
                {currentVersion}
              </div>
              <div className="text-xs text-muted-foreground">Current Version</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
