'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Users, 
  Store, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  Settings,
  BarChart3,
  Activity,
  CreditCard,
  Globe,
  Database,
  Zap,
  ArrowLeft,
  Plus,
  RefreshCw,
  MoreHorizontal
} from 'lucide-react';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'agency' | 'subaccount';
  agency_id?: string;
  subaccount_id?: string;
  subscription_status: string;
  created_at: string;
  last_login: string;
  stripe_customer_id?: string;
}

interface Theme {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  owner_name: string;
  visibility: string;
  status: 'pending' | 'approved' | 'rejected';
  downloads: number;
  rating: number;
  created_at: string;
}

interface MarketplaceStats {
  totalThemes: number;
  totalUsers: number;
  totalRevenue: number;
  pendingApprovals: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
}

const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'John Agency Owner',
    email: 'john@agency.com',
    role: 'agency',
    subscription_status: 'active',
    created_at: '2024-01-15',
    last_login: '2024-01-22',
    stripe_customer_id: 'cus_123'
  },
  {
    id: '2',
    name: 'Sarah Subaccount',
    email: 'sarah@subaccount.com',
    role: 'subaccount',
    agency_id: '1',
    subscription_status: 'trialing',
    created_at: '2024-01-18',
    last_login: '2024-01-21'
  },
  {
    id: '3',
    name: 'Mike Designer',
    email: 'mike@designer.com',
    role: 'agency',
    subscription_status: 'canceled',
    created_at: '2024-01-10',
    last_login: '2024-01-20'
  }
];

const MOCK_THEMES: Theme[] = [
  {
    id: '1',
    name: 'Dark Glass Pro',
    description: 'Premium dark theme with glass effects',
    owner_id: '1',
    owner_name: 'John Agency Owner',
    visibility: 'marketplace',
    status: 'pending',
    downloads: 0,
    rating: 0,
    created_at: '2024-01-20'
  },
  {
    id: '2',
    name: 'Agency Blue',
    description: 'Professional blue theme for agencies',
    owner_id: '3',
    owner_name: 'Mike Designer',
    visibility: 'marketplace',
    status: 'approved',
    downloads: 892,
    rating: 4.6,
    created_at: '2024-01-18'
  }
];

const MOCK_STATS: MarketplaceStats = {
  totalThemes: 156,
  totalUsers: 1247,
  totalRevenue: 45678.90,
  pendingApprovals: 12,
  activeSubscriptions: 892,
  monthlyRevenue: 12345.67
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [themes, setThemes] = useState<Theme[]>(MOCK_THEMES);
  const [stats, setStats] = useState<MarketplaceStats>(MOCK_STATS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'themes' | 'billing' | 'analytics'>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [billingEvents, setBillingEvents] = useState<any[]>([]);

  useEffect(() => {
    // In a real app, this would check if user is super_admin
    // For now, we'll assume they are
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      if (selectedTab !== 'billing') return;
      try {
        const res = await fetch('/api/admin/billing/events');
        const json = await res.json();
        if (json?.events) setBillingEvents(json.events);
      } catch (e) {}
    };
    fetchEvents();
  }, [selectedTab]);

  const handleApproveTheme = async (themeId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/themes/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeId, action: 'approve' }),
      });

      if (response.ok) {
        setThemes(themes.map(theme => 
          theme.id === themeId 
            ? { ...theme, status: 'approved' as const }
            : theme
        ));
        setStats({ ...stats, pendingApprovals: stats.pendingApprovals - 1 });
      }
    } catch (error) {
      console.error('Error approving theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectTheme = async (themeId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/themes/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeId, action: 'reject' }),
      });

      if (response.ok) {
        setThemes(themes.map(theme => 
          theme.id === themeId 
            ? { ...theme, status: 'rejected' as const }
            : theme
        ));
        setStats({ ...stats, pendingApprovals: stats.pendingApprovals - 1 });
      }
    } catch (error) {
      console.error('Error rejecting theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverrideSubscription = async (userId: string, status: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/users/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status }),
      });

      if (response.ok) {
        setUsers(users.map(user => 
          user.id === userId 
            ? { ...user, subscription_status: status }
            : user
        ));
      }
    } catch (error) {
      console.error('Error overriding subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'agency':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'subaccount':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'trialing':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'canceled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredThemes = themes.filter(theme =>
    theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    theme.owner_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div className="border-b border-white/10 glass">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-heading gradient-text flex items-center gap-2">
                  <Shield className="h-6 w-6" />
                  Super Admin Dashboard
                </h1>
                <p className="text-muted-foreground">Platform administration and oversight</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                <Shield className="h-3 w-3 mr-1" />
                Super Admin
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 glass rounded-lg p-1 mb-6 w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'themes', label: 'Themes', icon: Store },
            { id: 'billing', label: 'Billing', icon: CreditCard },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
          ].map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              variant={selectedTab === tab.id ? 'default' : 'ghost'}
              size="sm"
              className="flex items-center gap-2"
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="glass-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/70">Total Users</p>
                      <p className="text-2xl font-bold gradient-text">{stats.totalUsers.toLocaleString()}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500/50" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/70">Total Revenue</p>
                      <p className="text-2xl font-bold gradient-text">${stats.totalRevenue.toLocaleString()}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-500/50" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/70">Active Subscriptions</p>
                      <p className="text-2xl font-bold gradient-text">{stats.activeSubscriptions}</p>
                    </div>
                    <CreditCard className="h-8 w-8 text-purple-500/50" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/70">Pending Approvals</p>
                      <p className="text-2xl font-bold gradient-text">{stats.pendingApprovals}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-yellow-500/50" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Common administrative tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    onClick={() => setSelectedTab('themes')}
                    variant="outline"
                    className="h-20 flex-col gap-2 border-white/20 text-white hover:bg-white/10"
                  >
                    <Store className="h-6 w-6" />
                    <span>Review Themes</span>
                    <Badge className="bg-yellow-500/20 text-yellow-400">
                      {stats.pendingApprovals} pending
                    </Badge>
                  </Button>

                  <Button
                    onClick={() => setSelectedTab('users')}
                    variant="outline"
                    className="h-20 flex-col gap-2 border-white/20 text-white hover:bg-white/10"
                  >
                    <Users className="h-6 w-6" />
                    <span>Manage Users</span>
                    <Badge className="bg-blue-500/20 text-blue-400">
                      {stats.totalUsers} total
                    </Badge>
                  </Button>

                  <Button
                    onClick={() => setSelectedTab('billing')}
                    variant="outline"
                    className="h-20 flex-col gap-2 border-white/20 text-white hover:bg-white/10"
                  >
                    <CreditCard className="h-6 w-6" />
                    <span>Billing Override</span>
                    <Badge className="bg-green-500/20 text-green-400">
                      ${stats.monthlyRevenue.toLocaleString()}
                    </Badge>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { action: 'New theme submitted', user: 'John Agency Owner', time: '2 hours ago', type: 'theme' },
                    { action: 'Subscription canceled', user: 'Mike Designer', time: '4 hours ago', type: 'billing' },
                    { action: 'User registered', user: 'Sarah Subaccount', time: '6 hours ago', type: 'user' },
                    { action: 'Theme approved', user: 'Admin', time: '8 hours ago', type: 'theme' },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg glass">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === 'theme' ? 'bg-blue-500/20' :
                        activity.type === 'billing' ? 'bg-green-500/20' :
                        'bg-purple-500/20'
                      }`}>
                        {activity.type === 'theme' ? <Store className="h-4 w-4 text-blue-400" /> :
                         activity.type === 'billing' ? <CreditCard className="h-4 w-4 text-green-400" /> :
                         <Users className="h-4 w-4 text-purple-400" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{activity.action}</p>
                        <p className="text-white/70 text-sm">{activity.user}</p>
                      </div>
                      <span className="text-white/50 text-sm">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {selectedTab === 'users' && (
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
                <CardDescription>
                  Manage users, roles, and subscription overrides
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 glass"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="p-4 rounded-lg glass border border-white/10 hover:border-white/20 transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {user.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium text-white">{user.name}</h4>
                            <p className="text-sm text-white/70">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getRoleColor(user.role)} border`}>
                            {user.role.replace('_', ' ')}
                          </Badge>
                          <Badge className={`${getStatusColor(user.subscription_status)} border`}>
                            {user.subscription_status}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                        <div className="text-white/70">
                          <span className="font-medium">Created:</span> {new Date(user.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-white/70">
                          <span className="font-medium">Last Login:</span> {new Date(user.last_login).toLocaleDateString()}
                        </div>
                        <div className="text-white/70">
                          <span className="font-medium">Customer ID:</span> {user.stripe_customer_id ? 'Connected' : 'Not Set'}
                        </div>
                        <div className="text-white/70">
                          <span className="font-medium">Agency:</span> {user.agency_id || 'N/A'}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleOverrideSubscription(user.id, 'active')}
                          variant="outline"
                          size="sm"
                          className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Activate
                        </Button>
                        <Button
                          onClick={() => handleOverrideSubscription(user.id, 'canceled')}
                          variant="outline"
                          size="sm"
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Themes Tab */}
        {selectedTab === 'themes' && (
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Theme Approval
                </CardTitle>
                <CardDescription>
                  Review and approve marketplace themes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                    <Input
                      placeholder="Search themes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 glass"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredThemes.map((theme) => (
                    <div key={theme.id} className="p-4 rounded-lg glass border border-white/10 hover:border-white/20 transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <Store className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-white">{theme.name}</h4>
                            <p className="text-sm text-white/70">{theme.description}</p>
                            <p className="text-xs text-white/50">by {theme.owner_name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${
                            theme.status === 'approved' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                            theme.status === 'rejected' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                            'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                          } border`}>
                            {theme.status}
                          </Badge>
                          <Badge variant="outline" className="glass">
                            {theme.downloads} downloads
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                        <div className="text-white/70">
                          <span className="font-medium">Created:</span> {new Date(theme.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-white/70">
                          <span className="font-medium">Owner:</span> {theme.owner_name}
                        </div>
                        <div className="text-white/70">
                          <span className="font-medium">Visibility:</span> {theme.visibility}
                        </div>
                        <div className="text-white/70">
                          <span className="font-medium">Rating:</span> {theme.rating || 'N/A'}
                        </div>
                      </div>

                      {theme.status === 'pending' && (
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleApproveTheme(theme.id)}
                            disabled={isLoading}
                            className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleRejectTheme(theme.id)}
                            disabled={isLoading}
                            className="bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Billing Tab */}
        {selectedTab === 'billing' && (
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Billing Management
                </CardTitle>
                <CardDescription>
                  Subscription overrides and billing controls
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-white mb-3">Revenue Overview</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-white/70">
                        <span>Total Revenue:</span>
                        <span className="text-white">${stats.totalRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-white/70">
                        <span>Monthly Revenue:</span>
                        <span className="text-white">${stats.monthlyRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-white/70">
                        <span>Active Subscriptions:</span>
                        <span className="text-white">{stats.activeSubscriptions}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-white mb-3">Quick Actions</h4>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full border-white/20 text-white hover:bg-white/10"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export Revenue Report
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-white/20 text-white hover:bg-white/10"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Sync Stripe Data
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <h4 className="font-medium text-white mb-3">Recent Billing Events</h4>
                  <div className="space-y-2">
                    {billingEvents.map((e, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg glass border border-white/10">
                        <div className="text-white/80 text-sm">{e.event}</div>
                        <div className="text-white/60 text-sm">{new Date(e.recorded_at).toLocaleString()}</div>
                      </div>
                    ))}
                    {billingEvents.length === 0 && (
                      <div className="text-white/60 text-sm">No events</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Analytics Tab */}
        {selectedTab === 'analytics' && (
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Platform Analytics
                </CardTitle>
                <CardDescription>
                  Platform usage and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-white/30 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">Analytics Dashboard</h3>
                  <p className="text-white/70 mb-4">
                    Advanced analytics and reporting features coming soon
                  </p>
                  <Button
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}