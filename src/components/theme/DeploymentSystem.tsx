'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  RotateCcw,
  Eye,
  Download,
  Settings,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Deployment {
  id: string
  theme_id: string
  theme_name: string
  deployed_at: string
  status: 'pending' | 'deploying' | 'success' | 'failed'
  progress: number
  rollback_available_until: string
  deployment_logs: string[]
  subaccount_id?: string
  subaccount_name?: string
}

interface DeploymentSystemProps {
  themeId: string
  themeName: string
  onDeploy: (subaccountId?: string) => Promise<void>
  onRollback: (deploymentId: string) => Promise<void>
}

export function DeploymentSystem({
  themeId,
  themeName,
  onDeploy,
  onRollback
}: DeploymentSystemProps) {
  const { toast } = useToast()
  const [deployments, setDeployments] = useState<Deployment[]>([])
  const [isDeploying, setIsDeploying] = useState(false)
  const [selectedSubaccount, setSelectedSubaccount] = useState<string>('')
  const [subaccounts, setSubaccounts] = useState([
    { id: '1', name: 'Main Account' },
    { id: '2', name: 'Client A - Demo' },
    { id: '3', name: 'Client B - Production' }
  ])

  useEffect(() => {
    loadDeployments()
  }, [themeId])

  const loadDeployments = async () => {
    try {
      // Mock data - in real implementation, this would fetch from API
      const mockDeployments: Deployment[] = [
        {
          id: '1',
          theme_id: themeId,
          theme_name: themeName,
          deployed_at: '2024-01-15T10:30:00Z',
          status: 'success',
          progress: 100,
          rollback_available_until: '2024-01-17T10:30:00Z',
          deployment_logs: [
            'Starting deployment...',
            'Validating theme files...',
            'Uploading to GoHighLevel...',
            'Applying theme to dashboard...',
            'Deployment completed successfully!'
          ],
          subaccount_id: '1',
          subaccount_name: 'Main Account'
        },
        {
          id: '2',
          theme_id: themeId,
          theme_name: themeName,
          deployed_at: '2024-01-10T14:20:00Z',
          status: 'success',
          progress: 100,
          rollback_available_until: '2024-01-12T14:20:00Z',
          deployment_logs: [
            'Starting deployment...',
            'Validating theme files...',
            'Uploading to GoHighLevel...',
            'Deployment completed successfully!'
          ],
          subaccount_id: '2',
          subaccount_name: 'Client A - Demo'
        }
      ]
      setDeployments(mockDeployments)
    } catch (error) {
      console.error('Error loading deployments:', error)
    }
  }

  const handleDeploy = async () => {
    setIsDeploying(true)
    const deploymentId = Date.now().toString()
    
    try {
      // Simulate deployment process
      const newDeployment: Deployment = {
        id: deploymentId,
        theme_id: themeId,
        theme_name: themeName,
        deployed_at: new Date().toISOString(),
        status: 'deploying',
        progress: 0,
        rollback_available_until: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        deployment_logs: ['Starting deployment...'],
        subaccount_id: selectedSubaccount || undefined,
        subaccount_name: subaccounts.find(s => s.id === selectedSubaccount)?.name
      }

      setDeployments(prev => [newDeployment, ...prev])

      // Simulate deployment progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200))
        setDeployments(prev => prev.map(d => 
          d.id === deploymentId 
            ? { 
                ...d, 
                progress: i,
                deployment_logs: [
                  ...d.deployment_logs,
                  i === 20 ? 'Validating theme files...' : '',
                  i === 40 ? 'Uploading to GoHighLevel...' : '',
                  i === 60 ? 'Applying theme to dashboard...' : '',
                  i === 80 ? 'Finalizing deployment...' : ''
                ].filter(Boolean)
              }
            : d
        ))
      }

      // Mark as successful
      setDeployments(prev => prev.map(d => 
        d.id === deploymentId 
          ? { 
              ...d, 
              status: 'success' as const,
              progress: 100,
              deployment_logs: [...d.deployment_logs, 'Deployment completed successfully!']
            }
          : d
      ))

      await onDeploy(selectedSubaccount || undefined)
      
      toast({
        title: "Deployed!",
        description: "Theme deployed successfully to GoHighLevel",
      })
    } catch (error) {
      setDeployments(prev => prev.map(d => 
        d.id === deploymentId 
          ? { 
              ...d, 
              status: 'failed' as const,
              deployment_logs: [...d.deployment_logs, 'Deployment failed!']
            }
          : d
      ))
      
      toast({
        title: "Deployment Failed",
        description: "Failed to deploy theme to GoHighLevel",
        variant: "destructive",
      })
    } finally {
      setIsDeploying(false)
    }
  }

  const handleRollback = async (deploymentId: string) => {
    try {
      await onRollback(deploymentId)
      
      setDeployments(prev => prev.map(d => 
        d.id === deploymentId 
          ? { ...d, status: 'success' as const }
          : d
      ))
      
      toast({
        title: "Rolled Back!",
        description: "Theme has been rolled back to previous version",
      })
    } catch (error) {
      toast({
        title: "Rollback Failed",
        description: "Failed to rollback theme",
        variant: "destructive",
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-400" />
      case 'deploying':
        return <RefreshCw className="h-5 w-5 text-blue-400 animate-spin" />
      default:
        return <Clock className="h-5 w-5 text-yellow-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500/20 text-green-400'
      case 'failed':
        return 'bg-red-500/20 text-red-400'
      case 'deploying':
        return 'bg-blue-500/20 text-blue-400'
      default:
        return 'bg-yellow-500/20 text-yellow-400'
    }
  }

  const isRollbackAvailable = (deployment: Deployment) => {
    return deployment.status === 'success' && 
           new Date(deployment.rollback_available_until) > new Date()
  }

  return (
    <div className="space-y-6">
      {/* Deployment Controls */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="mr-2 h-5 w-5" />
            Deploy Theme
          </CardTitle>
          <CardDescription>
            Deploy your theme to GoHighLevel subaccounts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Target Subaccount</label>
            <select
              value={selectedSubaccount}
              onChange={(e) => setSelectedSubaccount(e.target.value)}
              className="w-full p-3 glass rounded-md border border-white/10 bg-transparent text-foreground"
            >
              <option value="">All Subaccounts</option>
              {subaccounts.map((subaccount) => (
                <option key={subaccount.id} value={subaccount.id}>
                  {subaccount.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleDeploy}
              disabled={isDeploying}
              className="btn-primary"
            >
              {isDeploying ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Deploying...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Deploy Now
                </>
              )}
            </Button>
            
            <Button variant="outline" className="glass">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Deployment History */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Deployment History
          </CardTitle>
          <CardDescription>
            Recent deployments and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deployments.map((deployment) => (
              <div key={deployment.id} className="p-4 glass rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(deployment.status)}
                    <div>
                      <h4 className="font-semibold">{deployment.theme_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {deployment.subaccount_name && `${deployment.subaccount_name} • `}
                        {new Date(deployment.deployed_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(deployment.status)}>
                      {deployment.status}
                    </Badge>
                    {isRollbackAvailable(deployment) && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRollback(deployment.id)}
                        className="glass"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Rollback
                      </Button>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                {deployment.status === 'deploying' && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Deployment Progress</span>
                      <span>{deployment.progress}%</span>
                    </div>
                    <Progress value={deployment.progress} className="h-2" />
                  </div>
                )}

                {/* Deployment Logs */}
                <div className="space-y-1">
                  {deployment.deployment_logs.map((log, index) => (
                    <div key={index} className="text-xs text-muted-foreground font-mono">
                      {log}
                    </div>
                  ))}
                </div>

                {/* Rollback Availability */}
                {deployment.status === 'success' && (
                  <div className="mt-3 text-xs text-muted-foreground">
                    Rollback available until: {new Date(deployment.rollback_available_until).toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Deployment Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold gradient-text">
              {deployments.length}
            </div>
            <div className="text-sm text-muted-foreground">Total Deployments</div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold gradient-text">
              {deployments.filter(d => d.status === 'success').length}
            </div>
            <div className="text-sm text-muted-foreground">Successful</div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold gradient-text">
              {deployments.filter(d => isRollbackAvailable(d)).length}
            </div>
            <div className="text-sm text-muted-foreground">Rollback Available</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
