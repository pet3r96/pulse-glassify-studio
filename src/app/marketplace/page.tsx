'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
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
  Upload
} from 'lucide-react'

export default function MarketplacePage() {
  const featuredItems = [
    {
      id: 1,
      title: "Modern Dashboard Pro",
      description: "Clean, professional dashboard theme with dark mode support",
      price: 49,
      rating: 4.9,
      downloads: 1234,
      image: "/api/placeholder/300/200",
      tags: ["Dashboard", "Dark Mode", "Professional"],
      author: "ThemeCraft Studio"
    },
    {
      id: 2,
      title: "Agency Brand Kit",
      description: "Complete branding package with logos, colors, and templates",
      price: 99,
      rating: 4.8,
      downloads: 856,
      image: "/api/placeholder/300/200",
      tags: ["Branding", "Templates", "Complete"],
      author: "BrandMaster"
    },
    {
      id: 3,
      title: "Mobile-First Theme",
      description: "Optimized for mobile devices with responsive design",
      price: 29,
      rating: 4.7,
      downloads: 2103,
      image: "/api/placeholder/300/200",
      tags: ["Mobile", "Responsive", "Modern"],
      author: "MobilePro"
    }
  ]

  const categories = [
    { name: "All", count: 156 },
    { name: "Dashboards", count: 45 },
    { name: "Landing Pages", count: 32 },
    { name: "Forms", count: 28 },
    { name: "Components", count: 51 }
  ]

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
              <Button variant="outline" className="glass">
                <Upload className="h-4 w-4 mr-2" />
                Upload Item
              </Button>
              <Button className="btn-primary">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart (3)
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded hover:bg-white/5 cursor-pointer">
                      <span className="text-sm">{category.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card mt-6">
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Price Range</label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="free" />
                        <label htmlFor="free" className="text-sm">Free</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="paid" />
                        <label htmlFor="paid" className="text-sm">Paid</label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Rating</label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="5star" />
                        <label htmlFor="5star" className="text-sm flex items-center">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                          5 Stars
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="4star" />
                        <label htmlFor="4star" className="text-sm flex items-center">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                          4+ Stars
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search themes, components, and templates..."
                  className="pl-10 glass"
                />
              </div>
              <Button variant="outline" className="glass">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Featured Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-heading gradient-text mb-6">Featured Items</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredItems.map((item) => (
                  <Card key={item.id} className="glass-card hover:glass-hover transition-all duration-300 group">
                    <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-t-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <span className="text-white font-bold text-xl">T</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Preview</p>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold group-hover:gradient-text transition-all">
                          {item.title}
                        </h3>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{item.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-bold gradient-text">${item.price}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.downloads} downloads
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="glass">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" className="btn-primary">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Trending Section */}
            <div>
              <h2 className="text-2xl font-heading gradient-text mb-6">Trending This Week</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <Card key={item} className="glass-card hover:glass-hover transition-all duration-300 group">
                    <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-t-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        <p className="text-sm text-muted-foreground">Trending</p>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold group-hover:gradient-text transition-all">
                          Trending Theme {item}
                        </h3>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="h-4 w-4 text-green-400" />
                          <span className="text-sm font-medium">#{item}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Popular theme with modern design and great performance
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-bold gradient-text">$29</p>
                          <p className="text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 inline mr-1" />
                            2 days ago
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="glass">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button size="sm" className="btn-primary">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
