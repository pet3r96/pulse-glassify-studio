'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Rocket, 
  Copy, 
  Download, 
  CheckCircle, 
  XCircle, 
  Clock,
  Globe,
  Code,
  Zap,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { communicationManager } from '@/lib/injection/communication-manager';

interface Deployment {
  id: string;
  themeId: string;
  themeName: string;
  connectionId: string;
  method: 'injection' | 'webhook' | 'manual';
  status: 'deployed' | 'failed' | 'pending';
  deployedAt: string;
  result?: any;
}

export function DeploymentDashboard() {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [selectedDeployment, setSelectedDeployment] = useState<Deployment | null>(null);
  const [connections, setConnections] = useState(communicationManager.getConnections());

  useEffect(() => {
    // Load deployments from localStorage (in a real app, this would be from API)
    const savedDeployments = localStorage.getItem('pulsegen-deployments');
    if (savedDeployments) {
      setDeployments(JSON.parse(savedDeployments));
    }

    // Update connections periodically
    const interval = setInterval(() => {
      setConnections(communicationManager.getConnections());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const deployTheme = async (themeId: string, connectionId: string, method: 'injection' | 'manual') => {
    setIsDeploying(true);
    
    try {
      const response = await fetch('/api/injection/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          themeId,
          connectionId,
          deploymentType: method,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        const deployment: Deployment = {
          id: `deploy_${Date.now()}`,
          themeId,
          themeName: data.theme.name,
          connectionId,
          method,
          status: 'deployed',
          deployedAt: new Date().toISOString(),
          result: data.deployment,
        };

        const newDeployments = [deployment, ...deployments];
        setDeployments(newDeployments);
        localStorage.setItem('pulsegen-deployments', JSON.stringify(newDeployments));
        setSelectedDeployment(deployment);
      } else {
        throw new Error(data.error || 'Deployment failed');
      }
    } catch (error) {
      console.error('Deployment error:', error);
      
      const failedDeployment: Deployment = {
        id: `deploy_${Date.now()}`,
        themeId,
        themeName: 'Unknown Theme',
        connectionId,
        method,
        status: 'failed',
        deployedAt: new Date().toISOString(),
      };

      const newDeployments = [failedDeployment, ...deployments];
      setDeployments(newDeployments);
      localStorage.setItem('pulsegen-deployments', JSON.stringify(newDeployments));
    } finally {
      setIsDeploying(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'deployed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'injection':
        return <Zap className="h-4 w-4" />;
      case 'webhook':
        return <Globe className="h-4 w-4" />;
      case 'manual':
        return <Code className="h-4 w-4" />;
      default:
        return <Rocket className="h-4 w-4" />;
    }
  };

  const copyDeploymentScript = (deployment: Deployment) => {
    if (deployment.result?.script) {
      navigator.clipboard.writeText(deployment.result.script);
    }
  };

  const downloadDeploymentScript = (deployment: Deployment) => {
    if (deployment.result?.script) {
      const blob = new Blob([deployment.result.script], { type: 'application/javascript' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${deployment.themeName.replace(/\s+/g, '-').toLowerCase()}-deployment.js`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      {/* Deployment Controls */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            Theme Deployment
          </CardTitle>
          <CardDescription>
            Deploy your themes to connected GoHighLevel accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {connections.length === 0 ? (
            <div className="text-center py-8">
              <Globe className="h-12 w-12 text-white/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No GHL Connections</h3>
              <p className="text-white/70 mb-4">
                Connect to your GoHighLevel accounts first to deploy themes
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4">
                {connections.map((connection) => (
                  <div
                    key={connection.id}
                    className="p-4 rounded-lg glass border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-blue-400" />
                        <div>
                          <h4 className="font-medium text-white">
                            {new URL(connection.url).hostname}
                          </h4>
                          <p className="text-sm text-white/70">{connection.url}</p>
                        </div>
                      </div>
                      <Badge className={connection.status === 'connected' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}>
                        {connection.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => deployTheme('test-theme-id', connection.id, 'injection')}
                        disabled={connection.status !== 'connected' || isDeploying}
                        size="sm"
                        className="bg-gradient-primary hover:opacity-90"
                      >
                        {isDeploying ? (
                          <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Zap className="h-4 w-4 mr-2" />
                        )}
                        Deploy via Injection
                      </Button>
                      
                      <Button
                        onClick={() => deployTheme('test-theme-id', connection.id, 'manual')}
                        disabled={isDeploying}
                        variant="outline"
                        size="sm"
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <Code className="h-4 w-4 mr-2" />
                        Generate Manual Script
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Deployment History */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Deployment History
          </CardTitle>
          <CardDescription>
            Track your theme deployments and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {deployments.length === 0 ? (
            <div className="text-center py-8">
              <Rocket className="h-12 w-12 text-white/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No Deployments Yet</h3>
              <p className="text-white/70">
                Deploy your first theme to see deployment history
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {deployments.map((deployment) => (
                <div
                  key={deployment.id}
                  className={`p-4 rounded-lg glass border transition-all cursor-pointer ${
                    selectedDeployment?.id === deployment.id 
                      ? 'border-blue-500/50 bg-blue-500/5' 
                      : 'border-white/10 hover:border-white/20'
                  }`}
                  onClick={() => setSelectedDeployment(
                    selectedDeployment?.id === deployment.id ? null : deployment
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(deployment.status)}
                      <div>
                        <h4 className="font-medium text-white">{deployment.themeName}</h4>
                        <p className="text-sm text-white/70">
                          {new Date(deployment.deployedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {getMethodIcon(deployment.method)}
                        <span className="text-sm text-white/70 capitalize">
                          {deployment.method}
                        </span>
                      </div>
                      <Badge className={`${getStatusColor(deployment.status)} border`}>
                        {deployment.status}
                      </Badge>
                    </div>
                  </div>

                  {selectedDeployment?.id === deployment.id && (
                    <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
                      {deployment.result?.script && (
                        <div>
                          <h5 className="text-sm font-medium text-white mb-2">Deployment Script:</h5>
                          <Textarea
                            value={deployment.result.script}
                            readOnly
                            className="glass font-mono text-sm h-32 resize-none"
                          />
                          <div className="flex items-center gap-2 mt-2">
                            <Button
                              onClick={() => copyDeploymentScript(deployment)}
                              variant="outline"
                              size="sm"
                              className="border-white/20 text-white hover:bg-white/10"
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Copy Script
                            </Button>
                            <Button
                              onClick={() => downloadDeploymentScript(deployment)}
                              variant="outline"
                              size="sm"
                              className="border-white/20 text-white hover:bg-white/10"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      )}

                      {deployment.result?.instructions && (
                        <div>
                          <h5 className="text-sm font-medium text-white mb-2">Instructions:</h5>
                          <ol className="text-sm text-white/70 space-y-1">
                            {deployment.result.instructions.map((instruction: string, index: number) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-blue-400 font-bold">{index + 1}.</span>
                                <span>{instruction}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}

                      <div className="text-xs text-white/50">
                        Deployment ID: {deployment.id}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
