'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Code, 
  Zap, 
  Globe, 
  Copy, 
  Download, 
  Play, 
  Square,
  Settings,
  ArrowLeft,
  Monitor,
  Smartphone,
  Tablet,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { communicationManager } from '@/lib/injection/communication-manager';

export default function InjectionPage() {
  const router = useRouter();
  const [connections, setConnections] = useState(communicationManager.getConnections());
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);
  const [testTheme, setTestTheme] = useState({
    name: 'Test Theme',
    css: `/* PulseGen Studio Test Theme */
body {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  font-family: 'Inter', sans-serif;
}

.sidebar {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
}

.nav-item {
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  padding: 12px 16px;
  border-radius: 8px;
  margin: 4px 0;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  transform: translateX(4px);
}

.btn-primary {
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  border: none;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(6, 182, 212, 0.3);
}`,
    js: `// PulseGen Studio Test Theme JavaScript
console.log('PulseGen Studio Test Theme Loaded');

document.addEventListener('DOMContentLoaded', function() {
  // Add smooth animations
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.style.transform = 'translateX(4px)';
    });
    
    item.addEventListener('mouseleave', function() {
      this.style.transform = 'translateX(0)';
    });
  });
  
  // Add loading animation
  const buttons = document.querySelectorAll('.btn-primary');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
  
  console.log('Test theme animations initialized');
});`
  });
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState<any>(null);

  useEffect(() => {
    // Update connections periodically
    const interval = setInterval(() => {
      setConnections(communicationManager.getConnections());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const deployTestTheme = async () => {
    if (!selectedConnection) return;

    setIsDeploying(true);
    try {
      const success = await communicationManager.sendThemeUpdate(selectedConnection, testTheme);
      
      if (success) {
        setDeploymentResult({
          status: 'success',
          message: 'Test theme deployed successfully',
          timestamp: new Date().toISOString(),
        });
      } else {
        throw new Error('Failed to deploy theme');
      }
    } catch (error) {
      setDeploymentResult({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const removeTheme = async () => {
    if (!selectedConnection) return;

    setIsDeploying(true);
    try {
      const success = await communicationManager.removeTheme(selectedConnection);
      
      if (success) {
        setDeploymentResult({
          status: 'success',
          message: 'Theme removed successfully',
          timestamp: new Date().toISOString(),
        });
      } else {
        throw new Error('Failed to remove theme');
      }
    } catch (error) {
      setDeploymentResult({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const generateInjectionScript = () => {
    return `// PulseGen Studio Injection Script
// Generated: ${new Date().toISOString()}

(function() {
  'use strict';
  
  // Configuration
  const config = {
    version: '1.0.0',
    debug: true,
    theme: ${JSON.stringify(testTheme, null, 2)}
  };
  
  // Remove existing theme
  function removeExistingTheme() {
    const existingStyle = document.getElementById('pulsegen-theme');
    if (existingStyle) existingStyle.remove();
    
    const existingScript = document.getElementById('pulsegen-script');
    if (existingScript) existingScript.remove();
  }
  
  // Inject CSS
  function injectCSS() {
    const style = document.createElement('style');
    style.id = 'pulsegen-theme';
    style.textContent = config.theme.css;
    document.head.appendChild(style);
  }
  
  // Inject JavaScript
  function injectJS() {
    if (config.theme.js) {
      const script = document.createElement('script');
      script.id = 'pulsegen-script';
      script.textContent = config.theme.js;
      document.head.appendChild(script);
    }
  }
  
  // Initialize
  function init() {
    removeExistingTheme();
    injectCSS();
    injectJS();
    console.log('PulseGen Studio theme applied:', config.theme.name);
  }
  
  // Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();`;
  };

  const copyInjectionScript = () => {
    navigator.clipboard.writeText(generateInjectionScript());
  };

  const downloadInjectionScript = () => {
    const blob = new Blob([generateInjectionScript()], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pulsegen-injection-script.js';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div className="border-b border-white/10 glass">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-heading gradient-text">Injection System</h1>
                <p className="text-muted-foreground">Advanced theme injection and communication tools</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Panel - Connections & Controls */}
          <div className="space-y-6">
            {/* Connection Status */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  GHL Connections
                </CardTitle>
                <CardDescription>
                  Manage your GoHighLevel connections
                </CardDescription>
              </CardHeader>
              <CardContent>
                {connections.length === 0 ? (
                  <div className="text-center py-8">
                    <Globe className="h-12 w-12 text-white/30 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No Connections</h3>
                    <p className="text-white/70 mb-4">
                      Connect to your GoHighLevel accounts to use the injection system
                    </p>
                    <Link href="/dashboard">
                      <Button className="bg-gradient-primary hover:opacity-90">
                        Go to Connection Manager
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {connections.map((connection) => (
                      <div
                        key={connection.id}
                        className={`p-3 rounded-lg glass border cursor-pointer transition-all ${
                          selectedConnection === connection.id 
                            ? 'border-blue-500/50 bg-blue-500/5' 
                            : 'border-white/10 hover:border-white/20'
                        }`}
                        onClick={() => setSelectedConnection(
                          selectedConnection === connection.id ? null : connection.id
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {connection.status === 'connected' ? (
                              <CheckCircle className="h-4 w-4 text-green-400" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-red-400" />
                            )}
                            <div>
                              <h4 className="font-medium text-white">
                                {new URL(connection.url).hostname}
                              </h4>
                              <p className="text-sm text-white/70">{connection.url}</p>
                            </div>
                          </div>
                          <Badge className={
                            connection.status === 'connected' 
                              ? 'bg-green-500/20 text-green-400 border-green-500/30'
                              : 'bg-red-500/20 text-red-400 border-red-500/30'
                          }>
                            {connection.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Test Theme Controls */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Test Theme Controls
                </CardTitle>
                <CardDescription>
                  Deploy and test themes on connected GHL accounts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="test-theme-name">Theme Name</Label>
                  <Input
                    id="test-theme-name"
                    value={testTheme.name}
                    onChange={(e) => setTestTheme({ ...testTheme, name: e.target.value })}
                    className="glass"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={deployTestTheme}
                    disabled={!selectedConnection || isDeploying}
                    className="bg-gradient-primary hover:opacity-90 flex-1"
                  >
                    {isDeploying ? (
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Play className="h-4 w-4 mr-2" />
                    )}
                    Deploy Test Theme
                  </Button>
                  
                  <Button
                    onClick={removeTheme}
                    disabled={!selectedConnection || isDeploying}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Square className="h-4 w-4 mr-2" />
                    Remove Theme
                  </Button>
                </div>

                {deploymentResult && (
                  <div className={`p-3 rounded-lg border ${
                    deploymentResult.status === 'success' 
                      ? 'bg-green-500/10 border-green-500/20' 
                      : 'bg-red-500/10 border-red-500/20'
                  }`}>
                    <div className="flex items-center gap-2">
                      {deploymentResult.status === 'success' ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-400" />
                      )}
                      <span className={`text-sm ${
                        deploymentResult.status === 'success' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {deploymentResult.message}
                      </span>
                    </div>
                    <p className="text-xs text-white/50 mt-1">
                      {new Date(deploymentResult.timestamp).toLocaleString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Code Editor & Script Generator */}
          <div className="space-y-6">
            {/* Theme Code Editor */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Theme Code Editor
                </CardTitle>
                <CardDescription>
                  Edit your test theme CSS and JavaScript
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="css" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 glass">
                    <TabsTrigger value="css">CSS</TabsTrigger>
                    <TabsTrigger value="js">JavaScript</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="css" className="mt-4">
                    <Textarea
                      value={testTheme.css}
                      onChange={(e) => setTestTheme({ ...testTheme, css: e.target.value })}
                      className="glass font-mono text-sm h-64 resize-none"
                      placeholder="Enter your CSS code here..."
                    />
                  </TabsContent>
                  
                  <TabsContent value="js" className="mt-4">
                    <Textarea
                      value={testTheme.js}
                      onChange={(e) => setTestTheme({ ...testTheme, js: e.target.value })}
                      className="glass font-mono text-sm h-64 resize-none"
                      placeholder="Enter your JavaScript code here..."
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Injection Script Generator */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Injection Script Generator
                </CardTitle>
                <CardDescription>
                  Generate standalone injection scripts for manual deployment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={generateInjectionScript()}
                  readOnly
                  className="glass font-mono text-sm h-48 resize-none"
                />
                
                <div className="flex items-center gap-2">
                  <Button
                    onClick={copyInjectionScript}
                    variant="outline"
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Script
                  </Button>
                  <Button
                    onClick={downloadInjectionScript}
                    variant="outline"
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-center gap-2 text-blue-400 text-sm mb-2">
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-medium">Usage Instructions:</span>
                  </div>
                  <ol className="text-sm text-blue-300 space-y-1">
                    <li>1. Copy the generated script</li>
                    <li>2. Go to GoHighLevel Settings → Custom Code</li>
                    <li>3. Paste the script in the Footer Code section</li>
                    <li>4. Save and refresh your dashboard</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
