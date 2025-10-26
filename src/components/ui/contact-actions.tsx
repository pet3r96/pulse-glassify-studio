'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  Video, 
  Calendar,
  User,
  Clock,
  Star,
  Flag,
  MoreHorizontal,
  Send,
  Copy,
  CheckCircle,
  AlertCircle,
  Zap,
  Target,
  FileText,
  Settings
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Contact {
  id: string
  name: string
  email: string
  phone?: string
  avatar_url?: string
  company?: string
  status: 'active' | 'inactive' | 'lead' | 'customer'
  last_contacted?: string
  tags: string[]
  notes?: string
  ghl_contact_id?: string
}

interface ContactAction {
  id: string
  type: 'call' | 'email' | 'sms' | 'meeting' | 'task' | 'note' | 'tag' | 'workflow'
  label: string
  description: string
  icon: React.ComponentType<any>
  color: string
  requires_input?: boolean
  ghl_integration?: boolean
}

interface ContactActionsProps {
  contact: Contact
  onActionComplete?: (action: ContactAction, data?: any) => void
  className?: string
}

export function ContactActions({ contact, onActionComplete, className }: ContactActionsProps) {
  const { toast } = useToast()
  const [showActionDialog, setShowActionDialog] = useState(false)
  const [selectedAction, setSelectedAction] = useState<ContactAction | null>(null)
  const [actionData, setActionData] = useState<any>({})
  const [loading, setLoading] = useState(false)

  const contactActions: ContactAction[] = [
    {
      id: 'call',
      type: 'call',
      label: 'Call',
      description: 'Make a phone call',
      icon: Phone,
      color: 'text-green-400',
      ghl_integration: true
    },
    {
      id: 'email',
      type: 'email',
      label: 'Send Email',
      description: 'Send an email message',
      icon: Mail,
      color: 'text-blue-400',
      requires_input: true,
      ghl_integration: true
    },
    {
      id: 'sms',
      type: 'sms',
      label: 'Send SMS',
      description: 'Send a text message',
      icon: MessageSquare,
      color: 'text-purple-400',
      requires_input: true,
      ghl_integration: true
    },
    {
      id: 'meeting',
      type: 'meeting',
      label: 'Schedule Meeting',
      description: 'Book a meeting or call',
      icon: Calendar,
      color: 'text-orange-400',
      requires_input: true,
      ghl_integration: true
    },
    {
      id: 'task',
      type: 'task',
      label: 'Create Task',
      description: 'Add a follow-up task',
      icon: Target,
      color: 'text-yellow-400',
      requires_input: true
    },
    {
      id: 'note',
      type: 'note',
      label: 'Add Note',
      description: 'Add a contact note',
      icon: FileText,
      color: 'text-gray-400',
      requires_input: true,
      ghl_integration: true
    },
    {
      id: 'tag',
      type: 'tag',
      label: 'Add Tag',
      description: 'Tag the contact',
      icon: Flag,
      color: 'text-pink-400',
      requires_input: true,
      ghl_integration: true
    },
    {
      id: 'workflow',
      type: 'workflow',
      label: 'Trigger Workflow',
      description: 'Start an automation workflow',
      icon: Zap,
      color: 'text-cyan-400',
      requires_input: true,
      ghl_integration: true
    }
  ]

  const handleActionClick = (action: ContactAction) => {
    setSelectedAction(action)
    setActionData({})
    setShowActionDialog(true)
  }

  const handleActionSubmit = async () => {
    if (!selectedAction) return

    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In real implementation, this would:
      // 1. Send data to GoHighLevel API
      // 2. Create task/note in Supabase
      // 3. Trigger workflow automation
      
      toast({
        title: "Action Completed",
        description: `${selectedAction.label} action completed for ${contact.name}`,
      })
      
      onActionComplete?.(selectedAction, actionData)
      setShowActionDialog(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete action",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400'
      case 'inactive':
        return 'bg-gray-500/20 text-gray-400'
      case 'lead':
        return 'bg-blue-500/20 text-blue-400'
      case 'customer':
        return 'bg-purple-500/20 text-purple-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  const renderActionDialog = () => {
    if (!selectedAction) return null

    return (
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent className="glass-card max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <selectedAction.icon className={`h-5 w-5 ${selectedAction.color}`} />
              <span>{selectedAction.label}</span>
            </DialogTitle>
            <DialogDescription>
              {selectedAction.description} for {contact.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedAction.type === 'email' && (
              <>
                <div>
                  <Label htmlFor="email-subject">Subject</Label>
                  <Input
                    id="email-subject"
                    value={actionData.subject || ''}
                    onChange={(e) => setActionData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Email subject"
                    className="glass mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="email-body">Message</Label>
                  <Textarea
                    id="email-body"
                    value={actionData.body || ''}
                    onChange={(e) => setActionData(prev => ({ ...prev, body: e.target.value }))}
                    placeholder="Email message"
                    className="glass mt-2"
                    rows={4}
                  />
                </div>
              </>
            )}

            {selectedAction.type === 'sms' && (
              <div>
                <Label htmlFor="sms-message">Message</Label>
                <Textarea
                  id="sms-message"
                  value={actionData.message || ''}
                  onChange={(e) => setActionData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="SMS message"
                  className="glass mt-2"
                  rows={3}
                />
              </div>
            )}

            {selectedAction.type === 'meeting' && (
              <>
                <div>
                  <Label htmlFor="meeting-title">Meeting Title</Label>
                  <Input
                    id="meeting-title"
                    value={actionData.title || ''}
                    onChange={(e) => setActionData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Meeting title"
                    className="glass mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="meeting-duration">Duration</Label>
                  <Select
                    value={actionData.duration || '30'}
                    onValueChange={(value) => setActionData(prev => ({ ...prev, duration: value }))}
                  >
                    <SelectTrigger className="glass mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {selectedAction.type === 'task' && (
              <>
                <div>
                  <Label htmlFor="task-title">Task Title</Label>
                  <Input
                    id="task-title"
                    value={actionData.title || ''}
                    onChange={(e) => setActionData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Task title"
                    className="glass mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="task-description">Description</Label>
                  <Textarea
                    id="task-description"
                    value={actionData.description || ''}
                    onChange={(e) => setActionData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Task description"
                    className="glass mt-2"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="task-priority">Priority</Label>
                  <Select
                    value={actionData.priority || 'medium'}
                    onValueChange={(value) => setActionData(prev => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger className="glass mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {selectedAction.type === 'note' && (
              <div>
                <Label htmlFor="note-content">Note</Label>
                <Textarea
                  id="note-content"
                  value={actionData.content || ''}
                  onChange={(e) => setActionData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Add a note about this contact"
                  className="glass mt-2"
                  rows={4}
                />
              </div>
            )}

            {selectedAction.type === 'tag' && (
              <div>
                <Label htmlFor="tag-name">Tag Name</Label>
                <Input
                  id="tag-name"
                  value={actionData.tag || ''}
                  onChange={(e) => setActionData(prev => ({ ...prev, tag: e.target.value }))}
                  placeholder="Enter tag name"
                  className="glass mt-2"
                />
              </div>
            )}

            {selectedAction.type === 'workflow' && (
              <div>
                <Label htmlFor="workflow-select">Select Workflow</Label>
                <Select
                  value={actionData.workflow || ''}
                  onValueChange={(value) => setActionData(prev => ({ ...prev, workflow: value }))}
                >
                  <SelectTrigger className="glass mt-2">
                    <SelectValue placeholder="Choose a workflow" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="welcome-sequence">Welcome Sequence</SelectItem>
                    <SelectItem value="follow-up">Follow-up Sequence</SelectItem>
                    <SelectItem value="nurture">Nurture Campaign</SelectItem>
                    <SelectItem value="onboarding">Onboarding Process</SelectItem>
                    <SelectItem value="renewal">Renewal Reminder</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowActionDialog(false)}
                className="glass"
              >
                Cancel
              </Button>
              <Button
                onClick={handleActionSubmit}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Processing...' : 'Execute'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className={className}>
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-sm text-white font-bold">
                  {contact.name.charAt(0)}
                </span>
              </div>
              <div>
                <CardTitle className="text-lg">{contact.name}</CardTitle>
                <CardDescription className="flex items-center space-x-2">
                  <span>{contact.email}</span>
                  <Badge className={getStatusColor(contact.status)}>
                    {contact.status}
                  </Badge>
                </CardDescription>
              </div>
            </div>
            <Button size="sm" variant="ghost" className="glass">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {contactActions.map((action) => (
              <Button
                key={action.id}
                variant="ghost"
                size="sm"
                onClick={() => handleActionClick(action)}
                className="glass hover:glass-hover flex flex-col items-center space-y-1 h-auto py-3"
              >
                <action.icon className={`h-5 w-5 ${action.color}`} />
                <span className="text-xs">{action.label}</span>
                {action.ghl_integration && (
                  <Badge variant="secondary" className="text-xs">
                    GHL
                  </Badge>
                )}
              </Button>
            ))}
          </div>
          
          {contact.tags.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex flex-wrap gap-1">
                {contact.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {renderActionDialog()}
    </div>
  )
}
