'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Menu, 
  Plus, 
  Settings, 
  Save,
  Eye,
  Trash2,
  Edit,
  Move
} from 'lucide-react'

export default function MenuBuilderPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div className="glass border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-heading gradient-text">Menu Builder</h1>
              <p className="text-muted-foreground">Customize your GoHighLevel navigation menu</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="glass">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button className="btn-primary">
                <Save className="h-4 w-4 mr-2" />
                Save Menu
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Menu Items */}
          <div className="lg:col-span-1">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Menu className="mr-2 h-5 w-5" />
                  Menu Items
                </CardTitle>
                <CardDescription>
                  Add and organize your menu items
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full btn-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Menu Item
                  </Button>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 glass rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Move className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Dashboard</span>
                      </div>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 glass rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Move className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Leads</span>
                      </div>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 glass rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Move className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Campaigns</span>
                      </div>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Menu Editor */}
          <div className="lg:col-span-2">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Menu Editor</CardTitle>
                <CardDescription>
                  Configure your selected menu item
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="menu-title">Menu Title</Label>
                      <Input
                        id="menu-title"
                        placeholder="Dashboard"
                        className="glass mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="menu-icon">Icon</Label>
                      <Input
                        id="menu-icon"
                        placeholder="home"
                        className="glass mt-2"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="menu-url">URL</Label>
                    <Input
                      id="menu-url"
                      placeholder="/dashboard"
                      className="glass mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="menu-description">Description</Label>
                    <Input
                      id="menu-description"
                      placeholder="Main dashboard view"
                      className="glass mt-2"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="menu-visible" />
                    <Label htmlFor="menu-visible">Visible in menu</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="menu-external" />
                    <Label htmlFor="menu-external">External link</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card className="glass-card mt-6">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  See how your menu will look
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="flex space-x-6">
                    <div className="flex items-center space-x-2 text-white">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span className="text-sm">Dashboard</span>
                    </div>
                    <div className="flex items-center space-x-2 text-white">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span className="text-sm">Leads</span>
                    </div>
                    <div className="flex items-center space-x-2 text-white">
                      <div className="w-4 h-4 bg-purple-500 rounded"></div>
                      <span className="text-sm">Campaigns</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
