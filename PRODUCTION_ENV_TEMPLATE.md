# PulseGen Studio - Production Environment Variables

# ===========================================
# SUPABASE CONFIGURATION
# ===========================================
# Get these from your Supabase project settings
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# ===========================================
# STRIPE CONFIGURATION
# ===========================================
# Get these from your Stripe dashboard (use LIVE keys for production)
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_your-stripe-webhook-secret

# ===========================================
# APPLICATION CONFIGURATION
# ===========================================
# Your production domain
NEXT_PUBLIC_APP_URL=https://pulsegenstudio.com
NEXTAUTH_URL=https://pulsegenstudio.com
NEXTAUTH_SECRET=your-nextauth-secret-key

# ===========================================
# OPTIONAL CONFIGURATION
# ===========================================
# Analytics (optional)
NEXT_PUBLIC_GA_ID=your-google-analytics-id

# Email service (optional)
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password

# ===========================================
# DEPLOYMENT NOTES
# ===========================================
# 1. Replace all placeholder values with actual production values
# 2. Ensure Stripe keys are LIVE keys (not test keys)
# 3. Set up Supabase production database
# 4. Configure custom domain in Vercel
# 5. Set up Stripe webhook endpoints
# 6. Test all functionality before going live
