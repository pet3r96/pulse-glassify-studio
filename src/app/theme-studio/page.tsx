'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { getUserSubscriptionStatus, evaluateAccess } from '@/lib/subscription/utils';
import { useSubscriptionStatus } from '@/hooks/use-subscription-status';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Palette, 
  Save, 
  Eye, 
  Download, 
  Upload, 
  Undo,
  Redo,
  Settings,
  Code,
  Monitor,
  Smartphone,
  Tablet,
  Play,
  Square,
  Copy,
  Trash2,
  Plus,
  ArrowLeft,
  Zap,
  Layers,
  Type,
  Image,
  Layout
} from 'lucide-react';
import Link from 'next/link';
import { UpgradeModal } from '@/components/ui/upgrade-modal';
import { SeatLimitModal } from '@/components/ui/seat-limit-modal';

interface ThemeConfig {
  id?: string;
  name: string;
  description: string;
  css: string;
  js: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  fonts: {
    primary: string;
    secondary: string;
    sizes: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
  };
  layout: {
    sidebar: 'left' | 'right' | 'top' | 'bottom';
    header: 'fixed' | 'static';
    navigation: 'accordion' | 'list' | 'tabs';
  };
  animations: {
    enabled: boolean;
    duration: string;
    easing: string;
  };
}

const DEFAULT_THEME: ThemeConfig = {
  name: 'New Theme',
  description: 'A custom theme for your GoHighLevel dashboard',
  css: `/* PulseGen Studio Theme */
:root {
  --primary-color: #6366f1;
  --secondary-color: #8b5cf6;
  --accent-color: #06b6d4;
  --background-color: #0f172a;
  --surface-color: rgba(255, 255, 255, 0.05);
  --text-color: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
}

body {
  background: var(--background-color);
  color: var(--text-color);
  font-family: 'Inter', sans-serif;
}

.sidebar {
  background: var(--surface-color);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-item {
  color: var(--text-secondary);
  transition: all 0.3s ease;
}

.nav-item:hover {
  color: var(--primary-color);
  background: rgba(99, 102, 241, 0.1);
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border: none;
  color: white;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
}`,
  js: `// PulseGen Studio Theme JavaScript
console.log('PulseGen Studio Theme Loaded');

// Add smooth animations
document.addEventListener('DOMContentLoaded', function() {
  // Add hover effects to buttons
  const buttons = document.querySelectorAll('.btn-primary');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
  
  // Add loading animation
  const loadingElements = document.querySelectorAll('.loading');
  loadingElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
      element.style.opacity = '1';
    }, 100);
  });
});`,
  colors: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#06b6d4',
    background: '#0f172a',
    surface: 'rgba(255, 255, 255, 0.05)',
    text: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
  },
  fonts: {
    primary: 'Inter',
    secondary: 'Poppins',
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
    },
  },
  layout: {
    sidebar: 'left',
    header: 'fixed',
    navigation: 'accordion',
  },
  animations: {
    enabled: true,
    duration: '0.3s',
    easing: 'ease',
  },
};

export default function ThemeStudioPage() {
  const router = useRouter();
  const [theme, setTheme] = useState<ThemeConfig>(DEFAULT_THEME);
  const [activeTab, setActiveTab] = useState('colors');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [history, setHistory] = useState<ThemeConfig[]>([DEFAULT_THEME]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const previewRef = useRef<HTMLIFrameElement>(null);
  const { accessState, locked, banner } = useSubscriptionStatus();
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [seatLimitOpen, setSeatLimitOpen] = useState(false);
  const [allowedSeats, setAllowedSeats] = useState<number>(0);
  const [currentSeats, setCurrentSeats] = useState<number>(0);
  const [loadingPortal, setLoadingPortal] = useState(false);

  useEffect(() => {
    loadCurrentTheme();
    (async () => {
      try {
        const res = await fetch('/api/subscription/status');
        const json = await res.json();
        if (json?.allowedSeats !== undefined) setAllowedSeats(json.allowedSeats);
        const seatRes = await fetch('/api/agency/seats');
        const seatJson = await seatRes.json();
        if (seatJson?.currentSubaccounts !== undefined) setCurrentSeats(seatJson.currentSubaccounts);
      } catch (_) {}
    })();
  }, []);

  const loadCurrentTheme = async () => {
    try {
      // In a real app, this would fetch from API
      const savedTheme = localStorage.getItem('currentTheme');
      if (savedTheme) {
        const parsedTheme = JSON.parse(savedTheme);
        setTheme(parsedTheme);
        setHistory([parsedTheme]);
        setHistoryIndex(0);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const updateTheme = (updates: Partial<ThemeConfig>) => {
    const newTheme = { ...theme, ...updates };
    setTheme(newTheme);
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newTheme);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    // Update preview
    updatePreview(newTheme);
  };

  const updatePreview = (themeConfig: ThemeConfig) => {
    if (previewRef.current) {
      const iframe = previewRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (doc) {
        // Update CSS
        let styleElement = doc.getElementById('pulsegen-theme-css');
        if (!styleElement) {
          styleElement = doc.createElement('style');
          styleElement.id = 'pulsegen-theme-css';
          doc.head.appendChild(styleElement);
        }
        styleElement.textContent = themeConfig.css;
        
        // Update JavaScript
        let scriptElement = doc.getElementById('pulsegen-theme-js');
        if (!scriptElement) {
          scriptElement = doc.createElement('script');
          scriptElement.id = 'pulsegen-theme-js';
          doc.head.appendChild(scriptElement);
        }
        scriptElement.textContent = themeConfig.js;
        
        // Trigger re-render
        doc.body.style.display = 'none';
        doc.body.offsetHeight; // Trigger reflow
        doc.body.style.display = '';
      }
    }
  };

  const saveTheme = async () => {
    try {
      // Save to localStorage for now
      localStorage.setItem('currentTheme', JSON.stringify(theme));
      
      // In a real app, this would save to Supabase
      const response = await fetch('/api/themes/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(theme),
      });
      
      if (response.ok) {
        // Show success message
        console.log('Theme saved successfully');
      }
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setTheme(history[newIndex]);
      updatePreview(history[newIndex]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setTheme(history[newIndex]);
      updatePreview(history[newIndex]);
    }
  };

  const exportTheme = () => {
    const dataStr = JSON.stringify(theme, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${theme.name.replace(/\s+/g, '-').toLowerCase()}-theme.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedTheme = JSON.parse(e.target?.result as string);
          setTheme(importedTheme);
          setHistory([importedTheme]);
          setHistoryIndex(0);
          updatePreview(importedTheme);
        } catch (error) {
          console.error('Error importing theme:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const generatePreviewHTML = () => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GHL Preview - ${theme.name}</title>
    <style>
        body { margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
        .ghl-preview { height: 100vh; display: flex; }
        .sidebar { width: 250px; background: var(--surface-color, rgba(255,255,255,0.05)); padding: 20px; }
        .main-content { flex: 1; padding: 20px; }
        .nav-item { padding: 10px; margin: 5px 0; border-radius: 8px; cursor: pointer; }
        .nav-item:hover { background: rgba(99, 102, 241, 0.1); }
        .btn-primary { background: linear-gradient(135deg, var(--primary-color, #6366f1), var(--secondary-color, #8b5cf6)); color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; }
        .card { background: var(--surface-color, rgba(255,255,255,0.05)); padding: 20px; border-radius: 12px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="ghl-preview">
        <div class="sidebar">
            <h3>Navigation</h3>
            <div class="nav-item">Dashboard</div>
            <div class="nav-item">Contacts</div>
            <div class="nav-item">Calendar</div>
            <div class="nav-item">Opportunities</div>
            <div class="nav-item">Settings</div>
        </div>
        <div class="main-content">
            <h1>GoHighLevel Dashboard</h1>
            <div class="card">
                <h3>Welcome to your customized dashboard</h3>
                <p>This is how your theme will look in GoHighLevel</p>
                <button class="btn-primary">Get Started</button>
            </div>
            <div class="card">
                <h3>Recent Activity</h3>
                <p>Your recent activities will appear here</p>
            </div>
        </div>
    </div>
</body>
</html>`;
  };

  return (
    <>
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
                <h1 className="text-2xl font-heading gradient-text">Theme Studio</h1>
                <p className="text-muted-foreground">Customize your GoHighLevel theme with real-time preview</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
                <Button
                onClick={undo}
                disabled={historyIndex === 0 || locked}
                  variant="outline"
                  size="sm"
                className="border-white/20 text-white hover:bg-white/10"
                >
                <Undo className="h-4 w-4" />
                </Button>
              <Button
                onClick={redo}
                disabled={historyIndex === history.length - 1 || locked}
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Redo className="h-4 w-4" />
              </Button>
              <Button
                onClick={locked ? () => router.push('/subscribe') : saveTheme}
                className="bg-gradient-primary hover:opacity-90"
                disabled={locked || (allowedSeats !== Number.MAX_SAFE_INTEGER && currentSeats > allowedSeats)}
              >
                <Save className="h-4 w-4 mr-2" />
                {locked ? 'Upgrade to Unlock' : 'Save Theme'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {banner && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-amber-800">
            {banner}
            <Button
              onClick={async () => {
                try {
                  setLoadingPortal(true);
                  const { data: { user } } = await supabase.auth.getUser();
                  if (!user) return;
                  const res = await fetch('/api/stripe/create-portal-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.id }),
                  });
                  const { url } = await res.json();
                  if (url) window.location.href = url;
                } catch (error) {
                  console.error('Error opening billing portal:', error);
                } finally {
                  setLoadingPortal(false);
                }
              }}
              variant="outline"
              size="sm"
              className="ml-3"
              disabled={loadingPortal}
            >
              {loadingPortal ? 'Opening...' : 'Manage Billing'}
            </Button>
          </div>
        )}
        {(allowedSeats !== Number.MAX_SAFE_INTEGER && currentSeats > allowedSeats) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-800">
            Seat limit reached. Add more seats or upgrade your plan to continue publishing.
            <Button
              onClick={() => setUpgradeOpen(true)}
              variant="outline"
              size="sm"
              className="ml-3"
            >
              Upgrade
            </Button>
          </div>
        )}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Theme Configuration Panel */}
          <div className="lg:col-span-1 space-y-6 relative">
            {/* Theme Info */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Theme Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="theme-name">Theme Name</Label>
                    <Input
                      id="theme-name"
                    value={theme.name}
                    onChange={(e) => updateTheme({ name: e.target.value })}
                    className="glass"
                    disabled={locked}
                    />
                  </div>
                  <div>
                    <Label htmlFor="theme-description">Description</Label>
                    <Textarea
                      id="theme-description"
                    value={theme.description}
                    onChange={(e) => updateTheme({ description: e.target.value })}
                    className="glass"
                      rows={3}
                    disabled={locked}
                    />
                  </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => document.getElementById('import-theme')?.click()}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                  <Button
                    onClick={exportTheme}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <input
                    id="import-theme"
                    type="file"
                    accept=".json"
                    onChange={importTheme}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Theme Customization Tabs */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Customization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4 glass">
                    <TabsTrigger value="colors" className="text-xs">
                      <Palette className="h-3 w-3 mr-1" />
                      Colors
                    </TabsTrigger>
                    <TabsTrigger value="fonts" className="text-xs">
                      <Type className="h-3 w-3 mr-1" />
                      Fonts
                    </TabsTrigger>
                    <TabsTrigger value="layout" className="text-xs">
                      <Layout className="h-3 w-3 mr-1" />
                      Layout
                    </TabsTrigger>
                    <TabsTrigger value="code" className="text-xs">
                      <Code className="h-3 w-3 mr-1" />
                      Code
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="colors" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="primary-color">Primary</Label>
                        <div className="flex gap-2">
                          <Input
                            id="primary-color"
                            type="color"
                            value={theme.colors.primary}
                            onChange={(e) => updateTheme({ 
                              colors: { ...theme.colors, primary: e.target.value }
                            })}
                            className="w-12 h-10 p-1"
                            disabled={locked}
                          />
                          <Input
                            value={theme.colors.primary}
                            onChange={(e) => updateTheme({ 
                              colors: { ...theme.colors, primary: e.target.value }
                            })}
                            className="flex-1 glass"
                            disabled={locked}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="secondary-color">Secondary</Label>
                        <div className="flex gap-2">
                          <Input
                            id="secondary-color"
                            type="color"
                            value={theme.colors.secondary}
                            onChange={(e) => updateTheme({ 
                              colors: { ...theme.colors, secondary: e.target.value }
                            })}
                            className="w-12 h-10 p-1"
                            disabled={locked}
                          />
                          <Input
                            value={theme.colors.secondary}
                            onChange={(e) => updateTheme({ 
                              colors: { ...theme.colors, secondary: e.target.value }
                            })}
                            className="flex-1 glass"
                            disabled={locked}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="accent-color">Accent</Label>
                        <div className="flex gap-2">
                          <Input
                            id="accent-color"
                            type="color"
                            value={theme.colors.accent}
                            onChange={(e) => updateTheme({ 
                              colors: { ...theme.colors, accent: e.target.value }
                            })}
                            className="w-12 h-10 p-1"
                            disabled={locked}
                          />
                          <Input
                            value={theme.colors.accent}
                            onChange={(e) => updateTheme({ 
                              colors: { ...theme.colors, accent: e.target.value }
                            })}
                            className="flex-1 glass"
                            disabled={locked}
                          />
                        </div>
                      </div>
                        <div>
                        <Label htmlFor="background-color">Background</Label>
                        <div className="flex gap-2">
                          <Input
                            id="background-color"
                            type="color"
                            value={theme.colors.background}
                            onChange={(e) => updateTheme({ 
                              colors: { ...theme.colors, background: e.target.value }
                            })}
                            className="w-12 h-10 p-1"
                            disabled={locked}
                          />
                          <Input
                            value={theme.colors.background}
                            onChange={(e) => updateTheme({ 
                              colors: { ...theme.colors, background: e.target.value }
                            })}
                            className="flex-1 glass"
                            disabled={locked}
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="fonts" className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="primary-font">Primary Font</Label>
                      <Input
                        id="primary-font"
                        value={theme.fonts.primary}
                        onChange={(e) => updateTheme({ 
                          fonts: { ...theme.fonts, primary: e.target.value }
                        })}
                        className="glass"
                        disabled={locked}
                      />
                    </div>
                    <div>
                      <Label htmlFor="secondary-font">Secondary Font</Label>
                      <Input
                        id="secondary-font"
                        value={theme.fonts.secondary}
                        onChange={(e) => updateTheme({ 
                          fonts: { ...theme.fonts, secondary: e.target.value }
                        })}
                        className="glass"
                        disabled={locked}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="layout" className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="sidebar-position">Sidebar Position</Label>
                      <select
                        id="sidebar-position"
                        value={theme.layout.sidebar}
                        onChange={(e) => updateTheme({ 
                          layout: { ...theme.layout, sidebar: e.target.value as any }
                        })}
                        className="w-full p-2 rounded-lg glass border border-white/20 bg-transparent text-white"
                        disabled={locked}
                      >
                        <option value="left">Left</option>
                        <option value="right">Right</option>
                        <option value="top">Top</option>
                        <option value="bottom">Bottom</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="header-type">Header Type</Label>
                      <select
                        id="header-type"
                        value={theme.layout.header}
                        onChange={(e) => updateTheme({ 
                          layout: { ...theme.layout, header: e.target.value as any }
                        })}
                        className="w-full p-2 rounded-lg glass border border-white/20 bg-transparent text-white"
                        disabled={locked}
                      >
                        <option value="fixed">Fixed</option>
                        <option value="static">Static</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="navigation-type">Navigation Type</Label>
                      <select
                        id="navigation-type"
                        value={theme.layout.navigation}
                        onChange={(e) => updateTheme({ 
                          layout: { ...theme.layout, navigation: e.target.value as any }
                        })}
                        className="w-full p-2 rounded-lg glass border border-white/20 bg-transparent text-white"
                        disabled={locked}
                      >
                        <option value="accordion">Accordion</option>
                        <option value="list">List</option>
                        <option value="tabs">Tabs</option>
                      </select>
                    </div>
                  </TabsContent>

                  <TabsContent value="code" className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="css-code">CSS Code</Label>
                      <Textarea
                        id="css-code"
                        value={theme.css}
                        onChange={(e) => updateTheme({ css: e.target.value })}
                        className="glass font-mono text-sm"
                        rows={8}
                        disabled={locked}
                      />
                    </div>
                    <div>
                      <Label htmlFor="js-code">JavaScript Code</Label>
                      <Textarea
                        id="js-code"
                        value={theme.js}
                        onChange={(e) => updateTheme({ js: e.target.value })}
                        className="glass font-mono text-sm"
                        rows={6}
                        disabled={locked}
                      />
                </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            {locked && (
              <div className="absolute inset-0 backdrop-blur-md bg-black/40 z-10 rounded-lg pointer-events-none animate-in fade-in duration-300" />
            )}
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2 relative">
                <Card className="glass-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Live Preview
                  </CardTitle>
                      <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 glass rounded-lg p-1">
                          <Button
                        onClick={() => setPreviewMode('desktop')}
                        variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                            size="sm"
                        className="h-8 w-8 p-0"
                        disabled={locked}
                          >
                            <Monitor className="h-4 w-4" />
                          </Button>
                          <Button
                        onClick={() => setPreviewMode('tablet')}
                        variant={previewMode === 'tablet' ? 'default' : 'ghost'}
                            size="sm"
                        className="h-8 w-8 p-0"
                        disabled={locked}
                          >
                            <Tablet className="h-4 w-4" />
                          </Button>
                          <Button
                        onClick={() => setPreviewMode('mobile')}
                        variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                            size="sm"
                        className="h-8 w-8 p-0"
                        disabled={locked}
                          >
                            <Smartphone className="h-4 w-4" />
                          </Button>
                        </div>
                    <Button
                      onClick={() => setIsPreviewPlaying(!isPreviewPlaying)}
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10"
                      disabled={locked}
                    >
                      {isPreviewPlaying ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                      </div>
                    </div>
                    <CardDescription>
                  See how your theme will look in GoHighLevel
                    </CardDescription>
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
                      Live Updates
                    </Badge>
                    <Badge variant="outline" className="glass">
                      <Layers className="h-3 w-3 mr-1" />
                      {previewMode === 'desktop' ? 'Desktop' : previewMode === 'tablet' ? 'Tablet' : 'Mobile'}
                    </Badge>
                  </div>
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(theme.css);
                    }}
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/10"
                    disabled={locked}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    {locked ? 'Upgrade to Unlock' : 'Copy CSS'}
                  </Button>
                    </div>
                  </CardContent>
                </Card>
                {locked && (
                  <div className="absolute inset-0 backdrop-blur-md bg-black/40 z-10 rounded-lg pointer-events-none animate-in fade-in duration-300" />
                )}
          </div>
        </div>
      </div>
    </div>
    <UpgradeModal open={upgradeOpen} onOpenChange={setUpgradeOpen} title="Upgrade Required" message="Your current plan's seat limit has been reached. Add Extra Subaccount Seat or upgrade to continue." cta="View Plans" />
    </>
  );
}