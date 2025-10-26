'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Search, 
  Filter, 
  Star, 
  Download, 
  Heart,
  Eye,
  ShoppingCart,
  TrendingUp,
  Clock,
  Upload,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Users,
  Award,
  CheckCircle,
  AlertCircle,
  Settings,
  Image as ImageIcon,
  FileText,
  Code,
  Palette
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'

interface MarketplaceItem {
  id: string
  name: string
  description: string
  type: 'theme' | 'component' | 'template'
  price_cents: number
  preview_url: string
  download_url: string
  is_approved: boolean
  download_count: number
  rating: number
  review_count: number
  created_at: string
  updated_at: string
  author: {
    id: string
    name: string
    avatar_url: string
  }
  tags: string[]
  category: string
  featured: boolean
}

interface UploadFormData {
  name: string
  description: string
  type: 'theme' | 'component' | 'template'
  price_cents: number
  category: string
  tags: string[]
  preview_image: File | null
  theme_files: File | null
}

export default function MarketplacePage() {
  const { toast } = useToast()
  const [items, setItems] = useState<MarketplaceItem[]>([])
  const [filteredItems, setFilteredItems] = useState<MarketplaceItem[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [priceRange, setPriceRange] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [uploadForm, setUploadForm] = useState<UploadFormData>({
    name: '',
    description: '',
    type: 'theme',
    price_cents: 0,
    category: '',
    tags: [],
    preview_image: null,
    theme_files: null
  })
  const [uploading, setUploading] = useState(false)
  const [cart, setCart] = useState<string[]>([])

  const categories = [
    { id: 'all', name: 'All Categories', count: 0 },
    { id: 'dashboard', name: 'Dashboards', count: 45 },
    { id: 'landing', name: 'Landing Pages', count: 32 },
    { id: 'forms', name: 'Forms', count: 28 },
    { id: 'components', name: 'Components', count: 51 },
    { id: 'templates', name: 'Templates', count: 23 }
  ]

  const types = [
    { id: 'all', name: 'All Types' },
    { id: 'theme', name: 'Themes' },
    { id: 'component', name: 'Components' },
    { id: 'template', name: 'Templates' }
  ]

  const priceRanges = [
    { id: 'all', name: 'All Prices' },
    { id: 'free', name: 'Free' },
    { id: '0-25', name: '$0 - $25' },
    { id: '25-50', name: '$25 - $50' },
    { id: '50-100', name: '$50 - $100' },
    { id: '100+', name: '$100+' }
  ]

  const sortOptions = [
    { id: 'newest', name: 'Newest' },
    { id: 'popular', name: 'Most Popular' },
    { id: 'rating', name: 'Highest Rated' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' }
  ]

  useEffect(() => {
    loadMarketplaceItems()
  }, [])

  useEffect(() => {
    filterItems()
  }, [items, searchQuery, selectedCategory, selectedType, priceRange, sortBy])

  const loadMarketplaceItems = async () => {
    setLoading(true)
    try {
      // Mock data - in real implementation, this would fetch from API
      const mockItems: MarketplaceItem[] = [
        {
          id: '1',
          name: 'Modern Dashboard Pro',
          description: 'Clean, professional dashboard theme with dark mode support and advanced customization options',
          type: 'theme',
          price_cents: 4900,
          preview_url: '/api/placeholder/300/200',
          download_url: '/downloads/modern-dashboard-pro.zip',
          is_approved: true,
          download_count: 1234,
          rating: 4.9,
          review_count: 89,
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-01-15T10:30:00Z',
          author: {
            id: '1',
            name: 'ThemeCraft Studio',
            avatar_url: '/api/placeholder/40/40'
          },
          tags: ['dashboard', 'dark-mode', 'professional', 'responsive'],
          category: 'dashboard',
          featured: true
        },
        {
          id: '2',
          name: 'Agency Brand Kit',
          description: 'Complete branding package with logos, colors, and templates for agencies',
          type: 'template',
          price_cents: 9900,
          preview_url: '/api/placeholder/300/200',
          download_url: '/downloads/agency-brand-kit.zip',
          is_approved: true,
          download_count: 856,
          rating: 4.8,
          review_count: 67,
          created_at: '2024-01-10T14:20:00Z',
          updated_at: '2024-01-10T14:20:00Z',
          author: {
            id: '2',
            name: 'BrandMaster',
            avatar_url: '/api/placeholder/40/40'
          },
          tags: ['branding', 'templates', 'complete', 'agency'],
          category: 'templates',
          featured: true
        },
        {
          id: '3',
          name: 'Mobile-First Theme',
          description: 'Optimized for mobile devices with responsive design and touch-friendly interface',
          type: 'theme',
          price_cents: 2900,
          preview_url: '/api/placeholder/300/200',
          download_url: '/downloads/mobile-first-theme.zip',
          is_approved: true,
          download_count: 2103,
          rating: 4.7,
          review_count: 156,
          created_at: '2024-01-05T09:15:00Z',
          updated_at: '2024-01-05T09:15:00Z',
          author: {
            id: '3',
            name: 'MobilePro',
            avatar_url: '/api/placeholder/40/40'
          },
          tags: ['mobile', 'responsive', 'modern', 'touch'],
          category: 'dashboard',
          featured: false
        },
        {
          id: '4',
          name: 'Contact Form Builder',
          description: 'Advanced contact form component with validation and styling options',
          type: 'component',
          price_cents: 1500,
          preview_url: '/api/placeholder/300/200',
          download_url: '/downloads/contact-form-builder.zip',
          is_approved: true,
          download_count: 3421,
          rating: 4.6,
          review_count: 234,
          created_at: '2024-01-01T12:00:00Z',
          updated_at: '2024-01-01T12:00:00Z',
          author: {
            id: '4',
            name: 'FormBuilder Inc',
            avatar_url: '/api/placeholder/40/40'
          },
          tags: ['form', 'validation', 'component', 'contact'],
          category: 'forms',
          featured: false
        }
      ]
      setItems(mockItems)
    } catch (error) {
      console.error('Error loading marketplace items:', error)
      toast({
        title: "Error",
        description: "Failed to load marketplace items",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterItems = () => {
    let filtered = [...items]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.type === selectedType)
    }

    // Price filter
    if (priceRange !== 'all') {
      filtered = filtered.filter(item => {
        const price = item.price_cents / 100
        switch (priceRange) {
          case 'free':
            return price === 0
          case '0-25':
            return price > 0 && price <= 25
          case '25-50':
            return price > 25 && price <= 50
          case '50-100':
            return price > 50 && price <= 100
          case '100+':
            return price > 100
          default:
            return true
        }
      })
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'popular':
          return b.download_count - a.download_count
        case 'rating':
          return b.rating - a.rating
        case 'price-low':
          return a.price_cents - b.price_cents
        case 'price-high':
          return b.price_cents - a.price_cents
        default:
          return 0
      }
    })

    setFilteredItems(filtered)
  }

  const handleUpload = async () => {
    if (!uploadForm.name || !uploadForm.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newItem: MarketplaceItem = {
        id: Date.now().toString(),
        name: uploadForm.name,
        description: uploadForm.description,
        type: uploadForm.type,
        price_cents: uploadForm.price_cents,
        preview_url: '/api/placeholder/300/200',
        download_url: '/downloads/' + uploadForm.name.toLowerCase().replace(/\s+/g, '-') + '.zip',
        is_approved: false,
        download_count: 0,
        rating: 0,
        review_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        author: {
          id: 'current-user',
          name: 'You',
          avatar_url: '/api/placeholder/40/40'
        },
        tags: uploadForm.tags,
        category: uploadForm.category,
        featured: false
      }

      setItems(prev => [newItem, ...prev])
      setShowUploadDialog(false)
      setUploadForm({
        name: '',
        description: '',
        type: 'theme',
        price_cents: 0,
        category: '',
        tags: [],
        preview_image: null,
        theme_files: null
      })
      
      toast({
        title: "Uploaded!",
        description: "Your item has been uploaded and is pending approval",
      })
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload item",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleAddToCart = (itemId: string) => {
    if (cart.includes(itemId)) {
      setCart(prev => prev.filter(id => id !== itemId))
      toast({
        title: "Removed from Cart",
        description: "Item removed from your cart",
      })
    } else {
      setCart(prev => [...prev, itemId])
      toast({
        title: "Added to Cart",
        description: "Item added to your cart",
      })
    }
  }

  const formatPrice = (cents: number) => {
    if (cents === 0) return 'Free'
    return `$${(cents / 100).toFixed(2)}`
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'theme':
        return <Palette className="h-4 w-4" />
      case 'component':
        return <Code className="h-4 w-4" />
      case 'template':
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'theme':
        return 'text-purple-400'
      case 'component':
        return 'text-blue-400'
      case 'template':
        return 'text-green-400'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div className="glass border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-heading gradient-text">Marketplace</h1>
              <p className="text-muted-foreground">Discover and download themes, components, and templates</p>
            </div>
            <div className="flex items-center gap-4">
              <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="glass">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl glass-card">
                  <DialogHeader>
                    <DialogTitle>Upload New Item</DialogTitle>
                    <DialogDescription>
                      Share your themes, components, or templates with the community
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="item-name">Item Name</Label>
                        <Input
                          id="item-name"
                          value={uploadForm.name}
                          onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter item name"
                          className="glass mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="item-type">Type</Label>
                        <Select
                          value={uploadForm.type}
                          onValueChange={(value) => setUploadForm(prev => ({ ...prev, type: value as any }))}
                        >
                          <SelectTrigger className="glass mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="theme">Theme</SelectItem>
                            <SelectItem value="component">Component</SelectItem>
                            <SelectItem value="template">Template</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="item-description">Description</Label>
                      <Textarea
                        id="item-description"
                        value={uploadForm.description}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe your item..."
                        className="glass mt-2"
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="item-price">Price (USD)</Label>
                        <Input
                          id="item-price"
                          type="number"
                          value={uploadForm.price_cents / 100}
                          onChange={(e) => setUploadForm(prev => ({ ...prev, price_cents: parseFloat(e.target.value) * 100 }))}
                          placeholder="0.00"
                          className="glass mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="item-category">Category</Label>
                        <Select
                          value={uploadForm.category}
                          onValueChange={(value) => setUploadForm(prev => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger className="glass mt-2">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.slice(1).map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowUploadDialog(false)}
                        className="glass"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="btn-primary"
                      >
                        {uploading ? 'Uploading...' : 'Upload Item'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button className="btn-primary">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart ({cart.length})
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <Label htmlFor="search">Search</Label>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search items..."
                      className="pl-10 glass"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <Label>Categories</Label>
                  <div className="space-y-2 mt-2">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                          selectedCategory === category.id ? 'bg-purple-500/20 text-purple-400' : 'hover:bg-white/5'
                        }`}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <span className="text-sm">{category.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {category.count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Types */}
                <div>
                  <Label>Type</Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="glass mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {types.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <Label>Price Range</Label>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger className="glass mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priceRanges.map((range) => (
                        <SelectItem key={range.id} value={range.id}>
                          {range.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort */}
                <div>
                  <Label>Sort By</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="glass mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">
                  {filteredItems.length} items found
                </h2>
                <p className="text-sm text-muted-foreground">
                  {selectedCategory !== 'all' && `in ${categories.find(c => c.id === selectedCategory)?.name}`}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="glass">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>

            {/* Items Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Card key={item.id} className="glass-card hover:glass-hover transition-all duration-300 group">
                  <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                        {getTypeIcon(item.type)}
                      </div>
                      <p className="text-sm text-muted-foreground">Preview</p>
                    </div>
                    
                    {/* Featured Badge */}
                    {item.featured && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-yellow-500/20 text-yellow-400">
                          <Award className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    )}
                    
                    {/* Type Badge */}
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="text-xs">
                        {item.type}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold group-hover:gradient-text transition-all line-clamp-1">
                        {item.name}
                      </h3>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{item.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{item.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                    
                    {/* Author */}
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-bold">
                          {item.author.name.charAt(0)}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">{item.author.name}</span>
                    </div>
                    
                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Download className="h-3 w-3 mr-1" />
                          {item.download_count}
                        </span>
                        <span className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {item.review_count}
                        </span>
                      </div>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-bold gradient-text">
                          {formatPrice(item.price_cents)}
                        </div>
                        {item.price_cents > 0 && (
                          <div className="text-xs text-muted-foreground">
                            One-time purchase
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="glass"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddToCart(item.id)}
                          className={`glass ${cart.includes(item.id) ? 'bg-purple-500/20 text-purple-400' : ''}`}
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="btn-primary"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          {item.price_cents === 0 ? 'Download' : 'Buy'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            {filteredItems.length > 0 && (
              <div className="text-center mt-8">
                <Button variant="outline" className="glass">
                  Load More Items
                </Button>
              </div>
            )}

            {/* Empty State */}
            {filteredItems.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No items found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or browse all items
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                    setSelectedType('all')
                    setPriceRange('all')
                  }}
                  className="btn-primary"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}