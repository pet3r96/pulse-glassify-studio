'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  Link, 
  Play, 
  Square, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ExternalLink,
  Copy,
  Settings,
  Zap,
  Monitor
} from 'lucide-react';
import { communicationManager, GHLConnection } from '@/lib/injection/communication-manager';

export function GHLConnectionManager() {
  const [connections, setConnections] = useState<GHLConnection[]>([]);
  const [ghlUrl, setGhlUrl] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);

  useEffect(() => {
    // Load connections on mount
    setConnections(communicationManager.getConnections());
    
    // Set up periodic updates
    const interval = setInterval(() => {
      setConnections(communicationManager.getConnections());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const connectToGHL = async () => {
    if (!ghlUrl.trim()) return;

    setIsConnecting(true);
    try {
      const connection = await communicationManager.connectToGHL(ghlUrl);
      setConnections(communicationManager.getConnections());
      setSelectedConnection(connection.id);
      setGhlUrl('');
    } catch (error) {
      console.error('Failed to connect to GHL:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectFromGHL = (connectionId: string) => {
    communicationManager.disconnectFromGHL(connectionId);
    setConnections(communicationManager.getConnections());
    if (selectedConnection === connectionId) {
      setSelectedConnection(null);
    }
  };

  const sendThemeUpdate = async (connectionId: string, theme: any) => {
    try {
      const success = await communicationManager.sendThemeUpdate(connectionId, theme);
      if (success) {
        setConnections(communicationManager.getConnections());
      }
    } catch (error) {
      console.error('Failed to send theme update:', error);
    }
  };

  const removeTheme = async (connectionId: string) => {
    try {
      const success = await communicationManager.removeTheme(connectionId);
      if (success) {
        setConnections(communicationManager.getConnections());
      }
    } catch (error) {
      console.error('Failed to remove theme:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'connecting':
        return <RefreshCw className="h-4 w-4 text-yellow-400 animate-spin" />;
      case 'disconnected':
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'connecting':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'disconnected':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const copyConnectionScript = () => {
    const script = `
// PulseGen Studio Connection Script
// Add this to your GoHighLevel Custom Code section

(function() {
  'use strict';
  
  // Load PulseGen Studio injection script
  const script = document.createElement('script');
  script.src = '${window.location.origin}/api/injection/script';
  script.async = true;
  script.onload = function() {
    console.log('PulseGen Studio connected successfully');
  };
  document.head.appendChild(script);
})();
`;
    
    navigator.clipboard.writeText(script);
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          GHL Connection Manager
        </CardTitle>
        <CardDescription>
          Connect to your GoHighLevel accounts and manage theme deployments
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Connection Form */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="ghl-url">GoHighLevel URL</Label>
            <div className="flex gap-2">
              <Input
                id="ghl-url"
                value={ghlUrl}
                onChange={(e) => setGhlUrl(e.target.value)}
                placeholder="https://your-account.gohighlevel.com"
                className="glass flex-1"
              />
              <Button
                onClick={connectToGHL}
                disabled={!ghlUrl.trim() || isConnecting}
                className="bg-gradient-primary hover:opacity-90"
              >
                {isConnecting ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Link className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-center gap-2 text-blue-400 text-sm mb-2">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Setup Instructions:</span>
            </div>
            <ol className="text-sm text-blue-300 space-y-1">
              <li>1. Go to your GoHighLevel Settings → Custom Code</li>
              <li>2. Add the connection script to the Footer Code section</li>
              <li>3. Save and refresh your GHL dashboard</li>
              <li>4. Connect using the URL above</li>
            </ol>
            <Button
              onClick={copyConnectionScript}
              variant="outline"
              size="sm"
              className="mt-2 border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Connection Script
            </Button>
          </div>
        </div>

        {/* Active Connections */}
        {connections.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Active Connections</h3>
            <div className="space-y-3">
              {connections.map((connection) => (
                <div
                  key={connection.id}
                  className={`p-4 rounded-lg glass border transition-all ${
                    selectedConnection === connection.id 
                      ? 'border-blue-500/50 bg-blue-500/5' 
                      : 'border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(connection.status)}
                      <div>
                        <h4 className="font-medium text-white">
                          {new URL(connection.url).hostname}
                        </h4>
                        <p className="text-sm text-white/70">
                          {connection.url}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getStatusColor(connection.status)} border`}>
                        {connection.status}
                      </Badge>
                      <Button
                        onClick={() => setSelectedConnection(
                          selectedConnection === connection.id ? null : connection.id
                        )}
                        variant="outline"
                        size="sm"
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {selectedConnection === connection.id && (
                    <div className="space-y-3 pt-3 border-t border-white/10">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/70">Last seen:</span>
                        <span className="text-white">
                          {new Date(connection.lastSeen).toLocaleTimeString()}
                        </span>
                      </div>
                      
                      {connection.theme && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/70">Active theme:</span>
                          <Badge variant="outline" className="border-green-500/30 text-green-400">
                            {connection.theme.name || 'Custom Theme'}
                          </Badge>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => sendThemeUpdate(connection.id, {
                            name: 'Test Theme',
                            css: 'body { background: linear-gradient(135deg, #6366f1, #8b5cf6); }',
                            js: 'console.log("Theme applied");'
                          })}
                          disabled={connection.status !== 'connected'}
                          size="sm"
                          className="bg-gradient-primary hover:opacity-90"
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          Send Test Theme
                        </Button>
                        
                        {connection.theme && (
                          <Button
                            onClick={() => removeTheme(connection.id)}
                            disabled={connection.status !== 'connected'}
                            variant="outline"
                            size="sm"
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            <Square className="h-4 w-4 mr-2" />
                            Remove Theme
                          </Button>
                        )}
                        
                        <Button
                          onClick={() => disconnectFromGHL(connection.id)}
                          variant="outline"
                          size="sm"
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Disconnect
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Connections State */}
        {connections.length === 0 && (
          <div className="text-center py-8">
            <Monitor className="h-12 w-12 text-white/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No GHL Connections</h3>
            <p className="text-white/70 mb-4">
              Connect to your GoHighLevel accounts to start managing themes
            </p>
            <Button
              onClick={copyConnectionScript}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Copy className="h-4 w-4 mr-2" />
              Get Connection Script
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
