# 🚀 PulseGen Studio - Deployment Instructions

## Quick Deploy to Vercel

### Step 1: Login to Vercel
```bash
vercel login
```
Follow the prompts to authenticate with your Vercel account.

### Step 2: Deploy to Production
```bash
vercel --prod --yes
```

### Step 3: Set Environment Variables
After deployment, go to your Vercel dashboard and add these environment variables:

**Required Variables:**
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret
```

### Step 4: Configure Custom Domain (Optional)
1. Go to Vercel Dashboard → Project Settings → Domains
2. Add your custom domain
3. Update `NEXT_PUBLIC_APP_URL` and `NEXTAUTH_URL` with your domain

### Step 5: Set Up Stripe Webhooks
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-domain.com/api/stripe/webhook`
3. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

### Step 6: Set Up Supabase Production Database
1. Create a new Supabase project for production
2. Run the migrations from `supabase/migrations/`
3. Set up Row Level Security policies
4. Create initial super admin user

## 🎉 Deployment Complete!

Your PulseGen Studio platform is now live with:
- ✅ Complete three-tier architecture
- ✅ Theme Studio with real-time preview
- ✅ Marketplace with Stripe Connect
- ✅ GHL injection system
- ✅ Admin dashboard
- ✅ Subscription management
- ✅ Production-ready security

## 📊 Post-Deployment Checklist

- [ ] Test user registration and login
- [ ] Verify theme creation and preview
- [ ] Test marketplace purchases
- [ ] Confirm GHL injection script works
- [ ] Check admin dashboard access
- [ ] Verify Stripe webhook processing
- [ ] Test subscription management
- [ ] Monitor error logs

## 🔗 Your Live Platform

Once deployed, your platform will be available at:
- **Production URL**: `https://your-domain.vercel.app`
- **Admin Dashboard**: `https://your-domain.vercel.app/admin`
- **Theme Studio**: `https://your-domain.vercel.app/theme-studio`
- **Marketplace**: `https://your-domain.vercel.app/marketplace`

## 🆘 Support

If you encounter any issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test Stripe webhook configuration
4. Confirm Supabase database connection

**PulseGen Studio is ready for production! 🚀**
