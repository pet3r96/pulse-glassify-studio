#!/bin/bash

# PulseGen Studio - Quick Deployment Script
echo "🚀 PulseGen Studio - Production Deployment"
echo "=========================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "❌ Not logged in to Vercel. Please run: vercel login"
    exit 1
fi

echo "✅ Vercel CLI ready"

# Deploy to production
echo "🚀 Deploying to production..."
vercel --prod --yes

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Set environment variables in Vercel dashboard"
    echo "2. Configure Stripe webhooks"
    echo "3. Set up Supabase production database"
    echo "4. Test all functionality"
    echo ""
    echo "🔗 Check your deployment at: https://your-project.vercel.app"
else
    echo "❌ Deployment failed. Check the error messages above."
    exit 1
fi
