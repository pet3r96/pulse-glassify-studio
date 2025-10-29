'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Palette, ArrowRight, CheckCircle } from 'lucide-react'

export default function ThemeStudioAccess() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setIsLoggedIn(true)
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }
  }, [])

  if (!isLoggedIn) return null

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <Card className="glass-card max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Palette className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-3xl font-heading gradient-text">
                Welcome back, {user?.profile?.full_name || user?.email}!
              </CardTitle>
            </div>
            <CardDescription className="text-lg">
              Ready to continue building your custom GoHighLevel theme?
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="glass p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Theme Studio</h3>
                <p className="text-muted-foreground mb-4">
                  Visual theme builder with live preview across all GHL interfaces
                </p>
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Available</span>
                </div>
              </div>
              <div className="glass p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Subscription Status</h3>
                <p className="text-muted-foreground mb-4">
                  {user?.subscription_status?.status === 'active' ? 'Active' : 'Inactive'}
                </p>
                <div className={`flex items-center gap-2 ${user?.subscription_status?.status === 'active' ? 'text-green-400' : 'text-yellow-400'}`}>
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">
                    {user?.subscription_status?.status === 'active' ? 'Full Access' : 'Limited Access'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="btn-primary hover-glow text-lg px-8 py-6"
                onClick={() => {
                  // For now, show an alert since theme-studio page doesn't work
                  alert('Theme Studio access would be available here. The page routing needs to be fixed.')
                }}
              >
                <Palette className="h-5 w-5 mr-2" />
                Open Theme Studio
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6 glass"
                onClick={() => {
                  localStorage.removeItem('user')
                  window.location.reload()
                }}
              >
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
