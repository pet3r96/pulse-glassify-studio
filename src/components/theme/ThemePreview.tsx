'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  Play, 
  Square, 
  RefreshCw,
  Copy,
  Download,
  Eye,
  Zap
} from 'lucide-react';

interface ThemePreviewProps {
  css: string;
  js: string;
  themeName: string;
}

export function ThemePreview({ css, js, themeName }: ThemePreviewProps) {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isPlaying, setIsPlaying] = useState(false);
  const previewRef = useRef<HTMLIFrameElement>(null);

  const generatePreviewHTML = () => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GHL Preview - ${themeName}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Inter', sans-serif; 
            background: #0f172a; 
            color: #ffffff; 
            overflow-x: hidden;
        }
        
        .ghl-container {
            display: flex;
            min-height: 100vh;
        }
        
        .sidebar {
            width: 250px;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            border-right: 1px solid rgba(255, 255, 255, 0.1);
            padding: 20px;
        }
        
        .main-content {
            flex: 1;
            padding: 20px;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        }
        
        .nav-item {
            padding: 12px 16px;
            margin: 4px 0;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            color: rgba(255, 255, 255, 0.7);
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .nav-item:hover {
            background: rgba(99, 102, 241, 0.1);
            color: #6366f1;
            transform: translateX(4px);
        }
        
        .nav-item.active {
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: white;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            border: none;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
        }
        
        .card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 24px;
            margin: 16px 0;
            transition: all 0.3s ease;
        }
        
        .card:hover {
            border-color: rgba(99, 102, 241, 0.3);
            transform: translateY(-2px);
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            margin: 20px 0;
        }
        
        .stat-card {
            background: rgba(255, 255, 255, 0.05);
            padding: 20px;
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .stat-number {
            font-size: 2rem;
            font-weight: 700;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .header {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding: 16px 20px;
            display: flex;
            align-items: center;
            justify-content: between;
        }
        
        .logo {
            font-size: 1.5rem;
            font-weight: 700;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        @media (max-width: 768px) {
            .sidebar { width: 100%; height: auto; }
            .ghl-container { flex-direction: column; }
            .stats-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">GoHighLevel</div>
    </div>
    
    <div class="ghl-container">
        <div class="sidebar">
            <div class="nav-item active">
                <span>📊</span> Dashboard
            </div>
            <div class="nav-item">
                <span>👥</span> Contacts
            </div>
            <div class="nav-item">
                <span>📅</span> Calendar
            </div>
            <div class="nav-item">
                <span>💰</span> Opportunities
            </div>
            <div class="nav-item">
                <span>📈</span> Analytics
            </div>
            <div class="nav-item">
                <span>⚙️</span> Settings
            </div>
        </div>
        
        <div class="main-content">
            <h1 style="margin-bottom: 20px; font-size: 2rem; font-weight: 700;">
                Welcome to Your Dashboard
            </h1>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number">1,247</div>
                    <div style="color: rgba(255,255,255,0.7);">Total Contacts</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">89</div>
                    <div style="color: rgba(255,255,255,0.7);">Active Campaigns</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">$12.5K</div>
                    <div style="color: rgba(255,255,255,0.7);">Revenue This Month</div>
                </div>
            </div>
            
            <div class="card">
                <h3 style="margin-bottom: 16px; font-size: 1.25rem;">Recent Activity</h3>
                <p style="color: rgba(255,255,255,0.7); margin-bottom: 16px;">
                    Your recent activities and updates will appear here. This preview shows how your custom theme will look in GoHighLevel.
                </p>
                <button class="btn-primary">
                    <span>🚀</span> Get Started
                </button>
            </div>
            
            <div class="card">
                <h3 style="margin-bottom: 16px; font-size: 1.25rem;">Quick Actions</h3>
                <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                    <button class="btn-primary" style="padding: 8px 16px; font-size: 0.875rem;">
                        Add Contact
                    </button>
                    <button class="btn-primary" style="padding: 8px 16px; font-size: 0.875rem;">
                        Create Campaign
                    </button>
                    <button class="btn-primary" style="padding: 8px 16px; font-size: 0.875rem;">
                        Schedule Meeting
                    </button>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
  };

  const refreshPreview = () => {
    if (previewRef.current) {
      previewRef.current.src = '';
      setTimeout(() => {
        if (previewRef.current) {
          previewRef.current.setAttribute('srcdoc', generatePreviewHTML());
        }
      }, 100);
    }
  };

  const copyDeploymentCode = () => {
    const deploymentCode = `
// PulseGen Studio Theme Deployment
(function() {
  'use strict';
  
  // Remove existing theme
  const existingStyle = document.getElementById('pulsegen-theme');
  if (existingStyle) existingStyle.remove();
  
  const existingScript = document.getElementById('pulsegen-script');
  if (existingScript) existingScript.remove();
  
  // Inject CSS
  const style = document.createElement('style');
  style.id = 'pulsegen-theme';
  style.textContent = \`${css.replace(/`/g, '\\`')}\`;
  document.head.appendChild(style);
  
  // Inject JavaScript
  if ('${js}') {
    const script = document.createElement('script');
    script.id = 'pulsegen-script';
    script.textContent = \`${js.replace(/`/g, '\\`')}\`;
    document.head.appendChild(script);
  }
  
  console.log('PulseGen Studio theme deployed: ${themeName}');
})();
`;
    
    navigator.clipboard.writeText(deploymentCode);
  };

  const downloadTheme = () => {
    const themeData = {
      name: themeName,
      css,
      js,
      generated: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(themeData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${themeName.replace(/\s+/g, '-').toLowerCase()}-theme.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Theme Preview
            </CardTitle>
            <CardDescription>
              See how your theme will look in GoHighLevel
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 glass rounded-lg p-1">
              <Button
                onClick={() => setPreviewMode('desktop')}
                variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                className="h-8 w-8 p-0"
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => setPreviewMode('tablet')}
                variant={previewMode === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                className="h-8 w-8 p-0"
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => setPreviewMode('mobile')}
                variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                className="h-8 w-8 p-0"
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>
            <Button
              onClick={refreshPreview}
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          className={`border border-white/20 rounded-lg overflow-hidden ${
            previewMode === 'desktop' ? 'w-full' :
            previewMode === 'tablet' ? 'w-full max-w-md mx-auto' :
            'w-full max-w-sm mx-auto'
          }`}
        >
          <iframe
            ref={previewRef}
            srcDoc={generatePreviewHTML()}
            className="w-full h-96 border-0"
            title="Theme Preview"
          />
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="glass">
              <Zap className="h-3 w-3 mr-1" />
              Live Preview
            </Badge>
            <Badge variant="outline" className="glass">
              {previewMode === 'desktop' ? 'Desktop' : previewMode === 'tablet' ? 'Tablet' : 'Mobile'}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={copyDeploymentCode}
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Code
            </Button>
            <Button
              onClick={downloadTheme}
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
