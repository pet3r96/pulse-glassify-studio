import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Palette, Type, Layout, Code, Eye } from "lucide-react"

export default function ThemeBuilder() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Theme Builder</h1>
          <p className="text-gray-600">Create and customize your GHL dashboard theme</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Controls Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="mr-2 h-5 w-5" />
                  Theme Controls
                </CardTitle>
                <CardDescription>
                  Customize colors, fonts, and layout
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="colors" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="colors">Colors</TabsTrigger>
                    <TabsTrigger value="typography">Typography</TabsTrigger>
                    <TabsTrigger value="layout">Layout</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="colors" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="primary-color">Primary Color</Label>
                      <Input type="color" id="primary-color" defaultValue="#3b82f6" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secondary-color">Secondary Color</Label>
                      <Input type="color" id="secondary-color" defaultValue="#64748b" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accent-color">Accent Color</Label>
                      <Input type="color" id="accent-color" defaultValue="#f59e0b" />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="typography" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="font-family">Font Family</Label>
                      <Input id="font-family" defaultValue="Inter" />
                    </div>
                    <div className="space-y-2">
                      <Label>Font Size</Label>
                      <Slider defaultValue={[16]} max={24} min={12} step={1} />
                    </div>
                    <div className="space-y-2">
                      <Label>Line Height</Label>
                      <Slider defaultValue={[1.5]} max={2} min={1} step={0.1} />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="layout" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Sidebar Width</Label>
                      <Slider defaultValue={[250]} max={400} min={200} step={10} />
                    </div>
                    <div className="space-y-2">
                      <Label>Header Height</Label>
                      <Slider defaultValue={[64]} max={100} min={48} step={4} />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="compact-mode" />
                      <Label htmlFor="compact-mode">Compact Mode</Label>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="mr-2 h-5 w-5" />
                  Custom Code
                </CardTitle>
                <CardDescription>
                  Add custom CSS and JavaScript
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="custom-css">Custom CSS</Label>
                  <textarea
                    id="custom-css"
                    className="w-full h-32 p-2 border rounded-md"
                    placeholder="/* Add your custom CSS here */"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="custom-js">Custom JavaScript</Label>
                  <textarea
                    id="custom-js"
                    className="w-full h-32 p-2 border rounded-md"
                    placeholder="// Add your custom JavaScript here"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Eye className="mr-2 h-5 w-5" />
                    Live Preview
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Desktop
                    </Button>
                    <Button variant="outline" size="sm">
                      Tablet
                    </Button>
                    <Button variant="outline" size="sm">
                      Mobile
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  See how your theme looks in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 bg-white">
                  <div className="bg-gray-50 rounded-lg p-4 min-h-[600px]">
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold">Dashboard Preview</h2>
                        <div className="flex space-x-2">
                          <Button size="sm">Save</Button>
                          <Button size="sm" variant="outline">Cancel</Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h3 className="font-medium text-blue-900">Total Leads</h3>
                          <p className="text-2xl font-bold text-blue-600">1,234</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h3 className="font-medium text-green-900">Conversions</h3>
                          <p className="text-2xl font-bold text-green-600">89</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h3 className="font-medium text-purple-900">Revenue</h3>
                          <p className="text-2xl font-bold text-purple-600">$12,345</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 flex justify-end space-x-4">
              <Button variant="outline">Save Draft</Button>
              <Button>Deploy Theme</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
