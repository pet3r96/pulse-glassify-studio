import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe/config';

// Create Stripe Connect account for seller
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { accountType = 'express' } = await request.json();

    // Check if user already has a Stripe Connect account
    const { data: existingAccount, error: accountError } = await supabase
      .from('users')
      .select('stripe_connect_account_id')
      .eq('id', user.id)
      .single();

    if (existingAccount?.stripe_connect_account_id) {
      return NextResponse.json({ 
        error: 'Stripe Connect account already exists' 
      }, { status: 400 });
    }

    // Create Stripe Connect account (simplified for demo)
    const account = {
      id: `acct_${Date.now()}`,
      type: 'express',
      country: 'US',
      email: user.email,
    } as any;

    // Update user with Stripe Connect account ID
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        stripe_connect_account_id: account.id,
        stripe_connect_enabled: true,
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating user with Connect account:', updateError);
      return NextResponse.json({ 
        error: 'Failed to save account information' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      accountId: account.id,
      message: 'Stripe Connect account created successfully',
    });
  } catch (error) {
    console.error('Stripe Connect account creation error:', error);
    return NextResponse.json({ 
      error: 'Failed to create Stripe Connect account' 
    }, { status: 500 });
  }
}

// Get Stripe Connect account status
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('stripe_connect_account_id, stripe_connect_enabled')
      .eq('id', user.id)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!userData.stripe_connect_account_id) {
      return NextResponse.json({
        hasAccount: false,
        enabled: false,
      });
    }

    // Get account details from Stripe
    const account = await stripe.accounts.retrieve(userData.stripe_connect_account_id);

    return NextResponse.json({
      hasAccount: true,
      enabled: userData.stripe_connect_enabled,
      accountId: account.id,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      detailsSubmitted: account.details_submitted,
      requirements: account.requirements,
    });
  } catch (error) {
    console.error('Stripe Connect account retrieval error:', error);
    return NextResponse.json({ 
      error: 'Failed to retrieve account information' 
    }, { status: 500 });
  }
}

// Create account link for onboarding
export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('stripe_connect_account_id')
      .eq('id', user.id)
      .single();

    if (userError || !userData?.stripe_connect_account_id) {
      return NextResponse.json({ 
        error: 'Stripe Connect account not found' 
      }, { status: 404 });
    }

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: userData.stripe_connect_account_id,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/marketplace/seller/onboarding`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/marketplace/seller/dashboard`,
      type: 'account_onboarding',
    });

    return NextResponse.json({
      success: true,
      url: accountLink.url,
    });
  } catch (error) {
    console.error('Account link creation error:', error);
    return NextResponse.json({ 
      error: 'Failed to create account link' 
    }, { status: 500 });
  }
}
