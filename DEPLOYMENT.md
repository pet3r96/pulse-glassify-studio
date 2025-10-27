# PulseGen Studio - Deployment Guide

## 🚀 Production Deployment Checklist

### ✅ Pre-Deployment Requirements

**1. Environment Variables**
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-domain.com
```

**2. Database Setup**
- [ ] Run Supabase migrations
- [ ] Set up Row Level Security (RLS) policies
- [ ] Create initial super admin user
- [ ] Seed marketplace with default themes

**3. Stripe Configuration**
- [ ] Set up Stripe Connect for marketplace
- [ ] Configure webhook endpoints
- [ ] Test payment processing
- [ ] Set up subscription plans

### 🛠️ Deployment Steps

**1. Vercel Deployment**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

**2. Environment Variables Setup**
- Add all required environment variables in Vercel dashboard
- Ensure Stripe keys are production keys (not test keys)
- Set up Supabase production database

**3. Domain Configuration**
- Configure custom domain in Vercel
- Set up SSL certificates
- Update NEXT_PUBLIC_APP_URL

### 🔧 Post-Deployment Configuration

**1. Supabase Setup**
```sql
-- Create super admin user
INSERT INTO users (id, name, email, role, subscription_status, subscription_override)
VALUES ('admin-uuid', 'Super Admin', 'admin@pulsegenstudio.com', 'super_admin', 'active', true);

-- Set up RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace ENABLE ROW LEVEL SECURITY;
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;
```

**2. Stripe Webhook Configuration**
- Webhook URL: `https://your-domain.com/api/stripe/webhook`
- Events to listen for:
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`

**3. GHL Integration Setup**
- Provide injection script URL to users
- Document installation process
- Set up support for script updates

### 📊 Monitoring & Analytics

**1. Vercel Analytics**
- Enable Vercel Analytics for performance monitoring
- Set up error tracking

**2. Supabase Monitoring**
- Monitor database performance
- Set up alerts for errors
- Track user activity

**3. Stripe Dashboard**
- Monitor payment processing
- Track subscription metrics
- Set up revenue reporting

### 🔒 Security Checklist

- [ ] All API routes protected with authentication
- [ ] Admin routes restricted to super_admin role
- [ ] Stripe webhook signature verification
- [ ] GHL API keys encrypted in database
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Error handling prevents information leakage

### 🚨 Troubleshooting

**Common Issues:**
1. **Build Failures**: Check environment variables and dependencies
2. **Database Errors**: Verify Supabase connection and RLS policies
3. **Stripe Issues**: Confirm webhook configuration and API keys
4. **GHL Integration**: Test injection script and postMessage communication

**Support Contacts:**
- Technical Issues: Check logs in Vercel dashboard
- Database Issues: Supabase dashboard and logs
- Payment Issues: Stripe dashboard and webhook logs

### 📈 Launch Checklist

- [ ] All features tested in production
- [ ] Payment processing verified
- [ ] User registration flow working
- [ ] Theme Studio functional
- [ ] Marketplace operational
- [ ] Admin dashboard accessible
- [ ] GHL injection working
- [ ] Support documentation ready
- [ ] Monitoring and alerts configured

## 🎉 Ready for Launch!

PulseGen Studio is now ready for production deployment with:
- Complete three-tier architecture
- Full marketplace ecosystem
- Theme Studio with real-time preview
- GHL injection system
- Admin dashboard with full control
- Stripe billing integration
- Comprehensive security measures

**Deploy with confidence!** 🚀
