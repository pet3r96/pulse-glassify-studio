'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Settings,
  Download,
  Calendar,
  Banknote,
  CreditCard,
  Shield
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface PayoutData {
  id: string
  amount: number
  currency: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  created_at: string
  processed_at?: string
  description: string
  method: 'bank' | 'card'
}

interface AccountStats {
  total_earnings: number
  pending_payouts: number
  completed_payouts: number
  monthly_earnings: number
  next_payout_date: string
  minimum_payout_threshold: number
}

interface ConnectAccount {
  id: string
  email: string
  country: string
  business_type: string
  charges_enabled: boolean
  payouts_enabled: boolean
  details_submitted: boolean
  created: number
}

export default function PayoutsPage() {
  const { toast } = useToast()
  const [payouts, setPayouts] = useState<PayoutData[]>([])
  const [stats, setStats] = useState<AccountStats>({
    total_earnings: 0,
    pending_payouts: 0,
    completed_payouts: 0,
    monthly_earnings: 0,
    next_payout_date: '',
    minimum_payout_threshold: 50
  })
  const [connectAccount, setConnectAccount] = useState<ConnectAccount | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadPayoutData()
  }, [])

  const loadPayoutData = async () => {
    setLoading(true)
    try {
      // Mock data - in real implementation, this would fetch from API
      const mockPayouts: PayoutData[] = [
        {
          id: '1',
          amount: 125.50,
          currency: 'USD',
          status: 'completed',
          created_at: '2024-01-15T10:30:00Z',
          processed_at: '2024-01-16T09:15:00Z',
          description: 'Theme sales - Modern Dashboard Pro',
          method: 'bank'
        },
        {
          id: '2',
          amount: 89.25,
          currency: 'USD',
          status: 'completed',
          created_at: '2024-01-10T14:20:00Z',
          processed_at: '2024-01-11T08:30:00Z',
          description: 'Component sales - Contact Form Builder',
          method: 'bank'
        },
        {
          id: '3',
          amount: 45.75,
          currency: 'USD',
          status: 'processing',
          created_at: '2024-01-20T16:45:00Z',
          description: 'Template sales - Agency Landing Page',
          method: 'bank'
        },
        {
          id: '4',
          amount: 67.00,
          currency: 'USD',
          status: 'pending',
          created_at: '2024-01-22T11:20:00Z',
          description: 'Theme sales - Dark Mode Dashboard',
          method: 'bank'
        }
      ]

      const mockStats: AccountStats = {
        total_earnings: 327.50,
        pending_payouts: 67.00,
        completed_payouts: 260.50,
        monthly_earnings: 327.50,
        next_payout_date: '2024-01-25T00:00:00Z',
        minimum_payout_threshold: 50
      }

      const mockConnectAccount: ConnectAccount = {
        id: 'acct_1234567890',
        email: 'author@example.com',
        country: 'US',
        business_type: 'individual',
        charges_enabled: true,
        payouts_enabled: true,
        details_submitted: true,
        created: 1640995200
      }

      setPayouts(mockPayouts)
      setStats(mockStats)
      setConnectAccount(mockConnectAccount)
    } catch (error) {
      console.error('Error loading payout data:', error)
      toast({
        title: "Error",
        description: "Failed to load payout data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleConnectAccount = async () => {
    try {
      // In real implementation, this would create a Connect account and redirect to Stripe
      toast({
        title: "Redirecting to Stripe",
        description: "You will be redirected to complete your account setup",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect account",
        variant: "destructive",
      })
    }
  }

  const handleRequestPayout = async () => {
    if (stats.pending_payouts < stats.minimum_payout_threshold) {
      toast({
        title: "Minimum Threshold Not Met",
        description: `You need at least $${stats.minimum_payout_threshold} to request a payout`,
        variant: "destructive",
      })
      return
    }

    try {
      // In real implementation, this would process the payout
      toast({
        title: "Payout Requested",
        description: "Your payout request has been submitted and will be processed within 1-2 business days",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to request payout",
        variant: "destructive",
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-400" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-400" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-400" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400'
      case 'processing':
        return 'bg-blue-500/20 text-blue-400'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'failed':
        return 'bg-red-500/20 text-red-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isAccountReady = connectAccount?.details_submitted && 
                        connectAccount?.charges_enabled && 
                        connectAccount?.payouts_enabled

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div className="glass border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-heading gradient-text">Payouts</h1>
              <p className="text-muted-foreground">Manage your earnings and payout settings</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="glass">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button
                onClick={handleRequestPayout}
                disabled={!isAccountReady || stats.pending_payouts < stats.minimum_payout_threshold}
                className="btn-primary"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Request Payout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Account Status */}
        {!isAccountReady && (
          <Card className="glass-card mb-8 border-yellow-500/20">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <AlertCircle className="h-6 w-6 text-yellow-400 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-2">
                    Account Setup Required
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    You need to complete your Stripe Connect account setup to receive payouts.
                  </p>
                  <Button onClick={handleConnectAccount} className="btn-primary">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Complete Setup
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">
                {formatCurrency(stats.total_earnings)}
              </div>
              <p className="text-xs text-muted-foreground">
                All time
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
              <Clock className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">
                {formatCurrency(stats.pending_payouts)}
              </div>
              <p className="text-xs text-muted-foreground">
                Available for payout
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">
                {formatCurrency(stats.monthly_earnings)}
              </div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Payout</CardTitle>
              <Calendar className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">
                {stats.next_payout_date ? formatDate(stats.next_payout_date) : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                Automatic payout
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Payout Threshold Progress */}
        <Card className="glass-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Banknote className="mr-2 h-5 w-5" />
              Payout Threshold
            </CardTitle>
            <CardDescription>
              You need ${stats.minimum_payout_threshold} to request a payout
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>Progress to minimum threshold</span>
                <span>{formatCurrency(stats.pending_payouts)} / {formatCurrency(stats.minimum_payout_threshold)}</span>
              </div>
              <Progress 
                value={(stats.pending_payouts / stats.minimum_payout_threshold) * 100} 
                className="h-2"
              />
              <div className="text-xs text-muted-foreground">
                {stats.pending_payouts >= stats.minimum_payout_threshold 
                  ? 'You can request a payout now!' 
                  : `You need ${formatCurrency(stats.minimum_payout_threshold - stats.pending_payouts)} more to reach the threshold`
                }
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payout History */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Payout History
            </CardTitle>
            <CardDescription>
              Track all your payouts and earnings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payouts.map((payout) => (
                <div key={payout.id} className="flex items-center justify-between p-4 glass rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(payout.status)}
                    <div>
                      <p className="font-medium">{payout.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(payout.created_at)}
                        {payout.processed_at && (
                          <span> • Processed: {formatDate(payout.processed_at)}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(payout.amount, payout.currency)}</p>
                      <Badge className={getStatusColor(payout.status)}>
                        {payout.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      {payout.method === 'bank' ? (
                        <Banknote className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                      )}
                      <Button size="sm" variant="ghost" className="glass">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        {connectAccount && (
          <Card className="glass-card mt-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Stripe Connect Account
              </CardTitle>
              <CardDescription>
                Your connected payment account details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Account Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span>{connectAccount.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Country:</span>
                      <span>{connectAccount.country}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Business Type:</span>
                      <span className="capitalize">{connectAccount.business_type}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Account Status</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Details Submitted:</span>
                      <Badge className={connectAccount.details_submitted ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                        {connectAccount.details_submitted ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Charges Enabled:</span>
                      <Badge className={connectAccount.charges_enabled ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                        {connectAccount.charges_enabled ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payouts Enabled:</span>
                      <Badge className={connectAccount.payouts_enabled ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                        {connectAccount.payouts_enabled ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

