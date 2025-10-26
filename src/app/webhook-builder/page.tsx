'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Webhook, 
  Plus, 
  Play, 
  Pause,
  Settings,
  Trash2,
  Edit,
  Copy,
  TestTube
} from 'lucide-react'

export default function WebhookBuilderPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div className="glass border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-heading gradient-text">Webhook Builder</h1>
              <p className="text-muted-foreground">Create and manage webhooks for GoHighLevel integration</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="glass">
                <TestTube className="h-4 w-4 mr-2" />
                Test Webhooks
              </Button>
              <Button className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                New Webhook
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Webhook List */}
          <div className="lg:col-span-1">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Webhook className="mr-2 h-5 w-5" />
                  Webhooks
                </CardTitle>
                <CardDescription>
                  Manage your webhook endpoints
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full btn-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Webhook
                  </Button>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 glass rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Lead Created</p>
                        <p className="text-xs text-muted-foreground">Active</p>
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
                      <div>
                        <p className="text-sm font-medium">Form Submitted</p>
                        <p className="text-xs text-muted-foreground">Paused</p>
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

          {/* Webhook Editor */}
          <div className="lg:col-span-2">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Webhook Configuration</CardTitle>
                <CardDescription>
                  Set up your webhook endpoint and triggers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="webhook-name">Webhook Name</Label>
                    <Input
                      id="webhook-name"
                      placeholder="Lead Created Webhook"
                      className="glass mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="webhook-url">Endpoint URL</Label>
                    <Input
                      id="webhook-url"
                      placeholder="https://your-domain.com/webhook/lead-created"
                      className="glass mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="webhook-events">Trigger Events</Label>
                    <Select>
                      <SelectTrigger className="glass mt-2">
                        <SelectValue placeholder="Select events" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lead-created">Lead Created</SelectItem>
                        <SelectItem value="form-submitted">Form Submitted</SelectItem>
                        <SelectItem value="appointment-scheduled">Appointment Scheduled</SelectItem>
                        <SelectItem value="payment-received">Payment Received</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="webhook-secret">Secret Key</Label>
                    <Input
                      id="webhook-secret"
                      placeholder="Enter secret key for verification"
                      className="glass mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="webhook-headers">Custom Headers</Label>
                    <Textarea
                      id="webhook-headers"
                      placeholder='{"Authorization": "Bearer your-token", "Content-Type": "application/json"}'
                      className="glass mt-2"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="webhook-active" />
                    <Label htmlFor="webhook-active">Active</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Webhook Testing */}
            <Card className="glass-card mt-6">
              <CardHeader>
                <CardTitle>Test Webhook</CardTitle>
                <CardDescription>
                  Send a test payload to verify your webhook
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="test-payload">Test Payload</Label>
                    <Textarea
                      id="test-payload"
                      placeholder='{"event": "lead.created", "data": {"id": "123", "email": "test@example.com"}}'
                      className="glass mt-2"
                      rows={4}
                    />
                  </div>
                  
                  <div className="flex space-x-4">
                    <Button className="btn-primary">
                      <Play className="h-4 w-4 mr-2" />
                      Send Test
                    </Button>
                    <Button variant="outline" className="glass">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy URL
                    </Button>
                  </div>
                  
                  <div className="glass-card p-4">
                    <h4 className="font-medium mb-2">Last Test Result</h4>
                    <div className="text-sm text-muted-foreground">
                      <p>Status: 200 OK</p>
                      <p>Response Time: 245ms</p>
                      <p>Timestamp: 2024-01-15 10:30:45</p>
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
