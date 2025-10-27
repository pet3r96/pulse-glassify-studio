'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Eye, 
  Download, 
  Upload, 
  Trash2, 
  Edit, 
  Play,
  Copy,
  MoreVertical,
  Plus,
  Settings
} from 'lucide-react';
import Link from 'next/link';

interface Theme {
  id: string;
  name: string;
  description: string;
  visibility: 'private' | 'marketplace';
  created_at: string;
  updated_at: string;
  theme_versions: Array<{
    css_code: string;
    js_code: string;
    version_number: number;
    is_active: boolean;
  }>;
}

export function ThemeManager() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadThemes();
  }, []);

  const loadThemes = async () => {
    try {
      const response = await fetch('/api/themes/save');
      const data = await response.json();
      if (data.themes) {
        setThemes(data.themes);
      }
    } catch (error) {
      console.error('Error loading themes:', error);
    } finally {
      setLoading(false);
    }
  };

  const deployTheme = async (themeId: string) => {
    try {
      const response = await fetch('/api/themes/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeId }),
      });

      const data = await response.json();
      if (data.success) {
        // Show success message
        console.log('Theme deployed successfully');
      }
    } catch (error) {
      console.error('Error deploying theme:', error);
    }
  };

  const copyThemeCode = (theme: Theme) => {
    const activeVersion = theme.theme_versions.find(v => v.is_active);
    if (activeVersion) {
      navigator.clipboard.writeText(activeVersion.css_code);
    }
  };

  if (loading) {
    return (
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-white/20 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              <div className="h-20 bg-white/10 rounded"></div>
              <div className="h-20 bg-white/10 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              My Themes
            </CardTitle>
            <CardDescription>
              Manage your custom GoHighLevel themes
            </CardDescription>
          </div>
          <Link href="/theme-studio">
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Create Theme
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {themes.length === 0 ? (
          <div className="text-center py-8">
            <Palette className="h-12 w-12 text-white/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No themes yet</h3>
            <p className="text-white/70 mb-4">
              Create your first custom theme to get started
            </p>
            <Link href="/theme-studio">
              <Button className="bg-gradient-primary hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Theme
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {themes.map((theme) => {
              const activeVersion = theme.theme_versions.find(v => v.is_active);
              return (
                <div
                  key={theme.id}
                  className="p-4 rounded-lg glass border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-white">{theme.name}</h3>
                      <p className="text-sm text-white/70">{theme.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={theme.visibility === 'marketplace' ? 'border-green-500/30 text-green-400' : 'border-blue-500/30 text-blue-400'}
                      >
                        {theme.visibility === 'marketplace' ? 'Public' : 'Private'}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white/70 hover:text-white"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Link href={`/theme-studio?theme=${theme.id}`}>
                      <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      onClick={() => deployTheme(theme.id)}
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Deploy
                    </Button>
                    <Button
                      onClick={() => copyThemeCode(theme)}
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy CSS
                    </Button>
                  </div>
                  
                  <div className="mt-3 text-xs text-white/50">
                    Version {activeVersion?.version_number || 1} • 
                    Updated {new Date(theme.updated_at).toLocaleDateString()}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
