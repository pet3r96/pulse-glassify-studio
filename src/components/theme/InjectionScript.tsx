'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Code, 
  Copy, 
  Download, 
  Eye, 
  Zap, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Settings
} from 'lucide-react';

interface InjectionScriptProps {
  themeId?: string;
  css?: string;
  js?: string;
  themeName?: string;
}

export function InjectionScript({ themeId, css, js, themeName }: InjectionScriptProps) {
  const [script, setScript] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);
  const [customizations, setCustomizations] = useState({
    autoLoad: true,
    debugMode: false,
    version: '1.0.0',
    namespace: 'pulsegen',
  });

  useEffect(() => {
    if (css && js) {
      generateScript();
    }
  }, [css, js, customizations]);

  const generateScript = () => {
    const injectionScript = `
// PulseGen Studio Theme Injection Script
// Theme: ${themeName || 'Custom Theme'}
// Generated: ${new Date().toISOString()}
// Version: ${customizations.version}

(function() {
  'use strict';
  
  // Configuration
  const config = {
    themeId: '${themeId || 'custom'}',
    version: '${customizations.version}',
    namespace: '${customizations.namespace}',
    debug: ${customizations.debugMode},
    autoLoad: ${customizations.autoLoad}
  };
  
  // Debug logging
  function log(message, data) {
    if (config.debug) {
      console.log('[PulseGen Studio]', message, data);
    }
  }
  
  // Remove existing PulseGen theme
  function removeExistingTheme() {
    const existingStyle = document.getElementById(config.namespace + '-theme');
    if (existingStyle) {
      existingStyle.remove();
      log('Removed existing theme');
    }
    
    const existingScript = document.getElementById(config.namespace + '-script');
    if (existingScript) {
      existingScript.remove();
      log('Removed existing script');
    }
  }
  
  // Inject CSS
  function injectCSS() {
    const style = document.createElement('style');
    style.id = config.namespace + '-theme';
    style.setAttribute('data-theme-id', config.themeId);
    style.setAttribute('data-version', config.version);
    style.textContent = \`${css?.replace(/`/g, '\\`') || ''}\`;
    document.head.appendChild(style);
    log('CSS injected successfully');
  }
  
  // Inject JavaScript
  function injectJS() {
    if ('${js || ''}') {
      const script = document.createElement('script');
      script.id = config.namespace + '-script';
      script.setAttribute('data-theme-id', config.themeId);
      script.setAttribute('data-version', config.version);
      script.textContent = \`${js?.replace(/`/g, '\\`') || ''}\`;
      document.head.appendChild(script);
      log('JavaScript injected successfully');
    }
  }
  
  // Initialize theme
  function initTheme() {
    log('Initializing theme', config);
    
    // Remove existing theme
    removeExistingTheme();
    
    // Inject new theme
    injectCSS();
    injectJS();
    
    // Dispatch custom event
    const event = new CustomEvent('pulsegen-theme-loaded', {
      detail: {
        themeId: config.themeId,
        version: config.version,
        timestamp: new Date().toISOString()
      }
    });
    document.dispatchEvent(event);
    
    log('Theme initialization complete');
  }
  
  // Auto-load if enabled
  if (config.autoLoad) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initTheme);
    } else {
      initTheme();
    }
  }
  
  // Expose API for manual control
  window.PulseGenStudio = {
    loadTheme: initTheme,
    removeTheme: removeExistingTheme,
    config: config,
    version: '${customizations.version}'
  };
  
  log('PulseGen Studio injection script loaded');
})();
`;
    
    setScript(injectionScript);
    setIsGenerated(true);
  };

  const copyScript = () => {
    navigator.clipboard.writeText(script);
  };

  const downloadScript = () => {
    const blob = new Blob([script], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${themeName?.replace(/\s+/g, '-').toLowerCase() || 'pulsegen'}-injection.js`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyMinifiedScript = () => {
    const minified = script
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
      .replace(/\/\/.*$/gm, '') // Remove line comments
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\s*{\s*/g, '{') // Remove spaces around braces
      .replace(/\s*}\s*/g, '}') // Remove spaces around braces
      .replace(/\s*;\s*/g, ';') // Remove spaces around semicolons
      .trim();
    
    navigator.clipboard.writeText(minified);
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          Injection Script Generator
        </CardTitle>
        <CardDescription>
          Generate the JavaScript code to inject your theme into GoHighLevel
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Customization Options */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Script Configuration</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="version">Version</Label>
              <Input
                id="version"
                value={customizations.version}
                onChange={(e) => setCustomizations({ ...customizations, version: e.target.value })}
                className="glass"
              />
            </div>
            <div>
              <Label htmlFor="namespace">Namespace</Label>
              <Input
                id="namespace"
                value={customizations.namespace}
                onChange={(e) => setCustomizations({ ...customizations, namespace: e.target.value })}
                className="glass"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={customizations.autoLoad}
                onChange={(e) => setCustomizations({ ...customizations, autoLoad: e.target.checked })}
                className="rounded"
              />
              <span className="text-white/80">Auto-load on page load</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={customizations.debugMode}
                onChange={(e) => setCustomizations({ ...customizations, debugMode: e.target.checked })}
                className="rounded"
              />
              <span className="text-white/80">Debug mode</span>
            </label>
          </div>
        </div>

        {/* Generated Script */}
        {isGenerated && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">Generated Script</h3>
              <div className="flex items-center gap-2">
                <Button
                  onClick={copyScript}
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Full
                </Button>
                <Button
                  onClick={copyMinifiedScript}
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Copy Minified
                </Button>
                <Button
                  onClick={downloadScript}
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
            
            <Textarea
              value={script}
              readOnly
              className="glass font-mono text-sm h-64 resize-none"
            />
            
            <div className="flex items-center gap-2 text-sm text-white/70">
              <CheckCircle className="h-4 w-4 text-green-400" />
              Script generated successfully
              <Badge variant="outline" className="ml-2">
                {script.length} characters
              </Badge>
            </div>
          </div>
        )}

        {/* Usage Instructions */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Usage Instructions</h3>
          <div className="space-y-3 text-sm text-white/70">
            <div className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">1.</span>
              <span>Copy the generated script to your clipboard</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">2.</span>
              <span>In GoHighLevel, go to Settings → Custom Code → Footer Code</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">3.</span>
              <span>Paste the script and save</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">4.</span>
              <span>Your theme will be automatically applied to all pages</span>
            </div>
          </div>
          
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-center gap-2 text-blue-400 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Important:</span>
            </div>
            <p className="text-blue-300 text-sm mt-1">
              Make sure to test your theme in a staging environment before deploying to production.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
