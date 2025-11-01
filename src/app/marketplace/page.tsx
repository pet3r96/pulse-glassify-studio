'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { evaluateAccess, getUserSubscriptionStatus } from '@/lib/subscription/utils';
import { useSubscriptionStatus } from '@/hooks/use-subscription-status';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Store, 
  Search, 
  Filter, 
  Star, 
  Download, 
  Eye, 
  Heart,
  ShoppingCart,
  CreditCard,
  ArrowLeft,
  Grid,
  List,
  SortAsc,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Crown,
  ArrowRight
} from 'lucide-react';
import { RenewLicenseModal } from '@/components/ui/renew-license-modal';
import Link from 'next/link';

interface MarketplaceTheme {
  id: string;
  name: string;
  description: string;
  price: number;
  thumbnail: string;
  rating: number;
  downloads: number;
  author: {
    name: string;
    avatar: string;
  };
  tags: string[];
  category: string;
  createdAt: string;
  updatedAt: string;
  isPurchased?: boolean;
  isOwned?: boolean;
}

const MOCK_THEMES: MarketplaceTheme[] = [
  {
    id: '1',
    name: 'Dark Glass Pro',
    description: 'A premium dark theme with glass morphism effects and smooth animations',
    price: 29.99,
    thumbnail: '/api/placeholder/400/300',
    rating: 4.8,
    downloads: 1247,
    author: {
      name: 'ThemeCraft Studio',
      avatar: '/api/placeholder/40/40'
    },
    tags: ['dark', 'glass', 'premium', 'modern'],
    category: 'Business',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: '2',
    name: 'Agency Blue',
    description: 'Professional blue theme perfect for marketing agencies and consultants',
    price: 19.99,
    thumbnail: '/api/placeholder/400/300',
    rating: 4.6,
    downloads: 892,
    author: {
      name: 'DesignPro',
      avatar: '/api/placeholder/40/40'
    },
    tags: ['blue', 'agency', 'professional', 'clean'],
    category: 'Agency',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18'
  },
  {
    id: '3',
    name: 'Neon Cyber',
    description: 'Futuristic neon theme with cyberpunk aesthetics and glowing effects',
    price: 39.99,
    thumbnail: '/api/placeholder/400/300',
    rating: 4.9,
    downloads: 2156,
    author: {
      name: 'CyberThemes',
      avatar: '/api/placeholder/40/40'
    },
    tags: ['neon', 'cyberpunk', 'futuristic', 'glow'],
    category: 'Creative',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-22'
  },
  {
    id: '4',
    name: 'Minimal White',
    description: 'Clean and minimal white theme for a professional, distraction-free experience',
    price: 14.99,
    thumbnail: '/api/placeholder/400/300',
    rating: 4.4,
    downloads: 634,
    author: {
      name: 'MinimalDesign',
      avatar: '/api/placeholder/40/40'
    },
    tags: ['minimal', 'white', 'clean', 'simple'],
    category: 'Minimal',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-19'
  },
  {
    id: '5',
    name: 'Gradient Dreams',
    description: 'Beautiful gradient theme with dreamy colors and smooth transitions',
    price: 24.99,
    thumbnail: '/api/placeholder/400/300',
    rating: 4.7,
    downloads: 1456,
    author: {
      name: 'GradientStudio',
      avatar: '/api/placeholder/40/40'
    },
    tags: ['gradient', 'colorful', 'dreamy', 'smooth'],
    category: 'Creative',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-21'
  },
  {
    id: '6',
    name: 'Corporate Dark',
    description: 'Professional dark theme designed for corporate environments',
    price: 34.99,
    thumbnail: '/api/placeholder/400/300',
    rating: 4.5,
    downloads: 978,
    author: {
      name: 'CorporateDesign',
      avatar: '/api/placeholder/40/40'
    },
    tags: ['corporate', 'dark', 'professional', 'business'],
    category: 'Business',
    createdAt: '2024-01-03',
    updatedAt: '2024-01-17'
  }
];

const CATEGORIES = ['All', 'Business', 'Agency', 'Creative', 'Minimal', 'Dark', 'Light'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' }
];

export default function MarketplacePage() {
  const router = useRouter();
  const [themes, setThemes] = useState<MarketplaceTheme[]>(MOCK_THEMES);
  const [filteredThemes, setFilteredThemes] = useState<MarketplaceTheme[]>(MOCK_THEMES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(false);
  const { accessState, locked, banner } = useSubscriptionStatus();
  const [renewOpen, setRenewOpen] = useState(false);
  const [renewReason, setRenewReason] = useState<'expired'|'limit'|'invalid'|undefined>(undefined);

  useEffect(() => {
    filterAndSortThemes();
  }, [searchQuery, selectedCategory, sortBy, themes]);

  const filterAndSortThemes = () => {
    let filtered = [...themes];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(theme =>
        theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        theme.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        theme.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(theme => theme.category === selectedCategory);
    }

    // Sort themes
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => b.downloads - a.downloads);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
    }

    setFilteredThemes(filtered);
  };

  const handlePurchase = async (themeId: string) => {
    setIsLoading(true);
    try {
      // In a real implementation, this would create a Stripe checkout session
      const response = await fetch('/api/marketplace/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeId }),
      });

      const data = await response.json();
      
      if (data.success && data.checkoutUrl) {
        // Redirect to Stripe checkout
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error(data.error || 'Purchase failed');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      // Show error message
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = (themeId: string) => {
    // Open theme preview modal or navigate to preview page
    router.push(`/marketplace/preview/${themeId}`);
  };

  const handleApply = async (themeId: string) => {
    try {
      const res = await fetch(`/api/marketplace/license/check?themeId=${encodeURIComponent(themeId)}`);
      const json = await res.json();
      if (!json.owned) {
        setRenewReason(json.reason || 'invalid');
        setRenewOpen(true);
        return;
      }
      const useRes = await fetch('/api/marketplace/license/use', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ themeId })
      });
      if (useRes.status !== 200) {
        const err = await useRes.json();
        setRenewReason((err?.error as any) || 'invalid');
        setRenewOpen(true);
        return;
      }
      // proceed to apply theme (placeholder)
      console.log('Theme applied');
    } catch (e) {
      setRenewReason('invalid');
      setRenewOpen(true);
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-400'
        }`}
      />
    ));
  };

  const renderThemeCard = (theme: MarketplaceTheme) => (
    <Card key={theme.id} className="group hover:-translate-y-1 transition-all cursor-pointer">
      <div className="relative">
        <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-t-lg overflow-hidden">
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary-accent rounded-lg mx-auto mb-2 flex items-center justify-center shadow-sm">
                <Store className="h-8 w-8 text-white" />
              </div>
              <p className="text-muted-foreground text-sm">{theme.name}</p>
            </div>
          </div>
        </div>
        
        {/* Price Badge */}
        <div className="absolute top-3 right-3">
          <Badge className="bg-success/20 text-success border-success/30">
            ${theme.price}
          </Badge>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="outline" className="bg-card/80 backdrop-blur-sm">
            {theme.category}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="space-y-3">
          <div>
            <h3 className="h3 font-semibold text-card-foreground mb-2">
              {theme.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {theme.description}
            </p>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              {renderStars(theme.rating)}
              <span className="text-muted-foreground ml-1">({theme.rating})</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Download className="h-3 w-3" />
              <span>{theme.downloads.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-6 h-6 bg-gradient-primary-accent rounded-full flex items-center justify-center shadow-sm">
              <span className="text-xs text-white font-medium">
                {theme.author.name.charAt(0)}
              </span>
            </div>
            <span>{theme.author.name}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {theme.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs bg-muted/50">
                {tag}
              </Badge>
            ))}
            {theme.tags.length > 3 && (
              <Badge variant="outline" className="text-xs bg-muted/50">
                +{theme.tags.length - 3}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button
              onClick={() => handlePreview(theme.id)}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={locked ? () => router.push('/subscribe') : () => handleApply(theme.id)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    disabled={locked}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {locked ? 'Upgrade to Unlock' : 'Apply'}
                  </Button>
                </TooltipTrigger>
                {locked && (
                  <TooltipContent>
                    <p>Upgrade to restore Marketplace access</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
            
            {theme.isOwned ? (
              <Button
                disabled
                size="sm"
                className="flex-1 bg-green-500/20 text-green-400 border-green-500/30"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Owned
              </Button>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
              <Button
                      onClick={locked ? () => router.push('/subscribe') : () => handlePurchase(theme.id)}
                disabled={isLoading || locked}
                size="sm"
                      variant="gradient"
                      className="flex-1"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                      {locked ? 'Upgrade to Unlock' : 'Buy'}
              </Button>
                  </TooltipTrigger>
                  {locked && (
                    <TooltipContent>
                      <p>Upgrade to restore Marketplace access</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="h1 text-2xl md:text-3xl bg-gradient-primary-accent bg-clip-text text-transparent">Theme Marketplace</h1>
                <p className="text-muted-foreground mt-1">Discover and purchase premium GoHighLevel themes</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-card border-border">
                <TrendingUp className="h-3 w-3 mr-1" />
                {themes.length} Themes
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-gutter-lg">
        {banner && (
          <div className="rounded-xl p-6 mb-gutter bg-card border border-border shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-foreground">{banner}</div>
              <Link href="/subscribe?locked=true">
                <Button variant="gradient" size="sm">
                  Manage Billing
                </Button>
              </Link>
            </div>
          </div>
        )}
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-gutter-lg">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground metadata mb-1">Total Themes</p>
                  <p className="text-2xl font-bold bg-gradient-primary-accent bg-clip-text text-transparent">{themes.length}</p>
                </div>
                <Store className="h-8 w-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground metadata mb-1">Total Downloads</p>
                  <p className="text-2xl font-bold bg-gradient-primary-accent bg-clip-text text-transparent">
                    {themes.reduce((sum, theme) => sum + theme.downloads, 0).toLocaleString()}
                  </p>
                </div>
                <Download className="h-8 w-8 text-success/50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground metadata mb-1">Avg Rating</p>
                  <p className="text-2xl font-bold bg-gradient-primary-accent bg-clip-text text-transparent">
                    {(themes.reduce((sum, theme) => sum + theme.rating, 0) / themes.length).toFixed(1)}
                  </p>
                </div>
                <Star className="h-8 w-8 text-warning/50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground metadata mb-1">Creators</p>
                  <p className="text-2xl font-bold bg-gradient-primary-accent bg-clip-text text-transparent">
                    {new Set(themes.map(theme => theme.author.name)).size}
                  </p>
                </div>
                <Users className="h-8 w-8 text-accent/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upgrade Banner */}
        <Card className="mb-gutter-lg bg-gradient-primary-accent/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-primary-accent rounded-full shadow-sm">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="h3 text-lg mb-1">
                    Unlock Marketplace Selling
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Upgrade to Agency Pro to sell your themes and earn revenue
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/subscribe">
                  <Button variant="gradient">
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade Now
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters and Search - Left-aligned filters as per design */}
        <div className="grid lg:grid-cols-4 gap-gutter mb-gutter-lg">
          {/* Left Sidebar - Filters */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="h3 text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Category Filter */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                  >
                    {CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                  >
                    {SORT_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Content - Search and Grid */}
          <div className="lg:col-span-3">
            {/* Search */}
            <Card className="mb-gutter">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search themes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* View Mode Toggle */}
            <div className="flex items-center justify-between mb-gutter">
              <p className="text-muted-foreground text-sm">
                Showing {filteredThemes.length} of {themes.length} themes
              </p>
              <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
                <Button
                  onClick={() => setViewMode('grid')}
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => setViewMode('list')}
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Theme Grid - Dense card grid */}
        <div className={`grid gap-gutter ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {filteredThemes.map(renderThemeCard)}
        </div>

        {/* No Results */}
        {filteredThemes.length === 0 && (
          <Card className="glass-card">
            <CardContent className="p-12 text-center">
              <Store className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-card-foreground mb-2">No themes found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or browse all themes
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
    <RenewLicenseModal open={renewOpen} onOpenChange={setRenewOpen} reason={renewReason} />
    </>
  );
}