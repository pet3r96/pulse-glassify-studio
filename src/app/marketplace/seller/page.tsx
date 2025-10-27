'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Store, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Download, 
  DollarSign,
  TrendingUp,
  Users,
  Star,
  Settings,
  ArrowLeft,
  Upload,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

interface SellerTheme {
  id: string;
  name: string;
  description: string;
  price: number;
  thumbnail: string;
  rating: number;
  downloads: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  earnings: number;
}

const MOCK_SELLER_THEMES: SellerTheme[] = [
  {
    id: '1',
    name: 'Dark Glass Pro',
    description: 'A premium dark theme with glass morphism effects and smooth animations',
    price: 29.99,
    thumbnail: '/api/placeholder/400/300',
    rating: 4.8,
    downloads: 1247,
    status: 'approved',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    earnings: 3592.30
  },
  {
    id: '2',
    name: 'Agency Blue',
    description: 'Professional blue theme perfect for marketing agencies and consultants',
    price: 19.99,
    thumbnail: '/api/placeholder/400/300',
    rating: 4.6,
    downloads: 892,
    status: 'approved',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18',
    earnings: 1601.20
  },
  {
    id: '3',
    name: 'Neon Cyber',
    description: 'Futuristic neon theme with cyberpunk aesthetics and glowing effects',
    price: 39.99,
    thumbnail: '/api/placeholder/400/300',
    rating: 4.9,
    downloads: 2156,
    status: 'pending',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-22',
    earnings: 0
  }
];

export default function SellerDashboardPage() {
  const router = useRouter();
  const [themes, setThemes] = useState<SellerTheme[]>(MOCK_SELLER_THEMES);
  const [connectAccount, setConnectAccount] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTheme, setNewTheme] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'Business',
    tags: '',
  });

  useEffect(() => {
    loadConnectAccount();
  }, []);

  const loadConnectAccount = async () => {
    try {
      const response = await fetch('/api/marketplace/connect');
      const data = await response.json();
      setConnectAccount(data);
    } catch (error) {
      console.error('Error loading Connect account:', error);
    }
  };

  const createConnectAccount = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/marketplace/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountType: 'express' }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Start onboarding process
        const linkResponse = await fetch('/api/marketplace/connect', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
        });

        const linkData = await linkResponse.json();
        
        if (linkData.success) {
          window.location.href = linkData.url;
        }
      }
    } catch (error) {
      console.error('Error creating Connect account:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTheme = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/marketplace/themes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTheme,
          tags: newTheme.tags.split(',').map(tag => tag.trim()),
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setThemes([data.theme, ...themes]);
        setShowCreateForm(false);
        setNewTheme({
          name: '',
          description: '',
          price: 0,
          category: 'Business',
          tags: '',
        });
      }
    } catch (error) {
      console.error('Error creating theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-400" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'draft':
        return <Edit className="h-4 w-4 text-gray-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'draft':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const totalEarnings = themes.reduce((sum, theme) => sum + theme.earnings, 0);
  const totalDownloads = themes.reduce((sum, theme) => sum + theme.downloads, 0);
  const averageRating = themes.reduce((sum, theme) => sum + theme.rating, 0) / themes.length;

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div className="border-b border-white/10 glass">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/marketplace">
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Marketplace
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-heading gradient-text">Seller Dashboard</h1>
                <p className="text-muted-foreground">Manage your themes and earnings</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-primary hover:opacity-90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Theme
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stripe Connect Status */}
        {!connectAccount?.hasAccount && (
          <Card className="glass-card mb-6 border-yellow-500/20 bg-yellow-500/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Setup Payment Processing</h3>
                  <p className="text-white/70">
                    Connect your Stripe account to start selling themes and receiving payments
                  </p>
                </div>
                <Button
                  onClick={createConnectAccount}
                  disabled={isLoading}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Setup Stripe Connect
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Total Earnings</p>
                  <p className="text-2xl font-bold gradient-text">${totalEarnings.toFixed(2)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Total Downloads</p>
                  <p className="text-2xl font-bold gradient-text">{totalDownloads.toLocaleString()}</p>
                </div>
                <Download className="h-8 w-8 text-blue-500/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Average Rating</p>
                  <p className="text-2xl font-bold gradient-text">{averageRating.toFixed(1)}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Active Themes</p>
                  <p className="text-2xl font-bold gradient-text">
                    {themes.filter(t => t.status === 'approved').length}
                  </p>
                </div>
                <Store className="h-8 w-8 text-purple-500/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Theme Form */}
        {showCreateForm && (
          <Card className="glass-card mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New Theme
              </CardTitle>
              <CardDescription>
                Add a new theme to the marketplace
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="theme-name">Theme Name</Label>
                  <Input
                    id="theme-name"
                    value={newTheme.name}
                    onChange={(e) => setNewTheme({ ...newTheme, name: e.target.value })}
                    className="glass"
                    placeholder="Enter theme name"
                  />
                </div>
                <div>
                  <Label htmlFor="theme-price">Price ($)</Label>
                  <Input
                    id="theme-price"
                    type="number"
                    value={newTheme.price}
                    onChange={(e) => setNewTheme({ ...newTheme, price: parseFloat(e.target.value) })}
                    className="glass"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="theme-description">Description</Label>
                <Textarea
                  id="theme-description"
                  value={newTheme.description}
                  onChange={(e) => setNewTheme({ ...newTheme, description: e.target.value })}
                  className="glass"
                  placeholder="Describe your theme..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="theme-category">Category</Label>
                  <select
                    id="theme-category"
                    value={newTheme.category}
                    onChange={(e) => setNewTheme({ ...newTheme, category: e.target.value })}
                    className="w-full p-2 rounded-lg glass border border-white/20 bg-transparent text-white"
                  >
                    <option value="Business">Business</option>
                    <option value="Agency">Agency</option>
                    <option value="Creative">Creative</option>
                    <option value="Minimal">Minimal</option>
                    <option value="Dark">Dark</option>
                    <option value="Light">Light</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="theme-tags">Tags (comma-separated)</Label>
                  <Input
                    id="theme-tags"
                    value={newTheme.tags}
                    onChange={(e) => setNewTheme({ ...newTheme, tags: e.target.value })}
                    className="glass"
                    placeholder="dark, modern, professional"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={handleCreateTheme}
                  disabled={isLoading || !newTheme.name || !newTheme.description}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Create Theme
                </Button>
                <Button
                  onClick={() => setShowCreateForm(false)}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Themes List */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              My Themes
            </CardTitle>
            <CardDescription>
              Manage your marketplace themes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {themes.length === 0 ? (
              <div className="text-center py-8">
                <Store className="h-12 w-12 text-white/30 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No themes yet</h3>
                <p className="text-white/70 mb-4">
                  Create your first theme to start selling
                </p>
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Theme
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {themes.map((theme) => (
                  <div
                    key={theme.id}
                    className="p-4 rounded-lg glass border border-white/10 hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <Store className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{theme.name}</h4>
                          <p className="text-sm text-white/70">{theme.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getStatusColor(theme.status)} border`}>
                          {getStatusIcon(theme.status)}
                          <span className="ml-1 capitalize">{theme.status}</span>
                        </Badge>
                        <Badge variant="outline" className="glass">
                          ${theme.price}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                      <div className="flex items-center gap-2 text-white/70">
                        <Download className="h-4 w-4" />
                        <span>{theme.downloads.toLocaleString()} downloads</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/70">
                        <Star className="h-4 w-4" />
                        <span>{theme.rating} rating</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/70">
                        <DollarSign className="h-4 w-4" />
                        <span>${theme.earnings.toFixed(2)} earned</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/70">
                        <TrendingUp className="h-4 w-4" />
                        <span>Updated {new Date(theme.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
