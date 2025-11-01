"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Shield, Bell, Palette, ExternalLink } from "lucide-react"
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'

export default function Settings() {
  const [loadingPortal, setLoadingPortal] = useState(false)
  const handleManageBilling = async () => {
    try {
      setLoadingPortal(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const res = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      })
      const { url } = await res.json()
      if (url) window.location.href = url
    } finally {
      setLoadingPortal(false)
    }
  }
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        <div className="max-w-4xl">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="themes">Themes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-6 mt-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-card-foreground">
                    <User className="mr-2 h-5 w-5" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Doe" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="john@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" defaultValue="Acme Agency" />
                  </div>
                  <Button variant="gradient">Save Changes</Button>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-card-foreground">
                    <Shield className="mr-2 h-5 w-5" />
                    Billing
                  </CardTitle>
                  <CardDescription>
                    Manage payment methods and invoices
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={handleManageBilling} disabled={loadingPortal} variant="gradient">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {loadingPortal ? 'Opening...' : 'Open Billing Portal'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-6 mt-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-card-foreground">
                    <Shield className="mr-2 h-5 w-5" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your account security
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                  <Button variant="gradient">Update Password</Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-6 mt-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-card-foreground">
                    <Bell className="mr-2 h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Choose what notifications you want to receive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive updates via email</p>
                    </div>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="theme-updates">Theme Updates</Label>
                      <p className="text-sm text-muted-foreground">Get notified when themes are updated</p>
                    </div>
                    <Switch id="theme-updates" defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="deployment-alerts">Deployment Alerts</Label>
                      <p className="text-sm text-muted-foreground">Alert when deployments complete</p>
                    </div>
                    <Switch id="deployment-alerts" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="themes" className="space-y-6 mt-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-card-foreground">
                    <Palette className="mr-2 h-5 w-5" />
                    Theme Preferences
                  </CardTitle>
                  <CardDescription>
                    Customize your default theme settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="default-theme">Default Theme</Label>
                    <Input id="default-theme" defaultValue="Modern Dashboard" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color-scheme">Color Scheme</Label>
                    <Input id="color-scheme" defaultValue="Blue" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-deploy">Auto Deploy</Label>
                      <p className="text-sm text-muted-foreground">Automatically deploy theme changes</p>
                    </div>
                    <Switch id="auto-deploy" />
                  </div>
                  <Button variant="gradient">Save Preferences</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
