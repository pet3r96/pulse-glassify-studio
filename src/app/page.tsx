import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Palette, Zap, Users, BarChart3 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="outline" className="mb-4">
              🚀 Now in Beta
            </Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Transform Your GoHighLevel Dashboard
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              The world's most powerful UI control system for GHL. Custom themes, 
              marketplace, and instant deployment for agencies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Building <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                View Marketplace
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Customize GHL
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From visual theme builders to marketplace integrations, 
              we've got everything agencies need.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Palette className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Theme Studio</CardTitle>
                <CardDescription>
                  Visual theme builder with live preview
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Instant Deployment</CardTitle>
                <CardDescription>
                  Deploy themes directly to GHL
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Team Collaboration</CardTitle>
                <CardDescription>
                  Work together on custom themes
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>
                  Track theme performance
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your GHL Experience?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of agencies already using PulseStudio to create 
            stunning, branded GHL dashboards.
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
            Get Started Free
          </Button>
        </div>
      </section>
    </div>
  )
}
