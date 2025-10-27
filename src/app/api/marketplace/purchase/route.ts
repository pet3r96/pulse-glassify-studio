import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe/config';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { themeId } = await request.json();

    if (!themeId) {
      return NextResponse.json({ error: 'Theme ID is required' }, { status: 400 });
    }

    // Get the theme from marketplace
    const { data: theme, error: themeError } = await supabase
      .from('marketplace')
      .select(`
        *,
        themes!inner(
          id,
          name,
          description,
          owner_id,
          metadata
        )
      `)
      .eq('theme_id', themeId)
      .eq('approved', true)
      .single();

    if (themeError || !theme) {
      return NextResponse.json({ error: 'Theme not found or not available' }, { status: 404 });
    }

    // Check if user already owns this theme
    const { data: existingLicense, error: licenseError } = await supabase
      .from('licenses')
      .select('id')
      .eq('theme_id', themeId)
      .eq('installed_on_subaccount_id', user.id)
      .single();

    if (existingLicense) {
      return NextResponse.json({ error: 'You already own this theme' }, { status: 400 });
    }

    // Get user data with Stripe customer ID
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (userError) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get or create Stripe customer
    let customerId = userData.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.user_metadata?.name || user.email,
        metadata: {
          userId: user.id,
          source: 'marketplace_purchase',
        },
      });
      customerId = customer.id;

      // Update user with Stripe customer ID
      await supabase
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: theme.themes.name,
              description: theme.themes.description,
              metadata: {
                themeId: themeId,
                themeName: theme.themes.name,
              },
            },
            unit_amount: Math.round(theme.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/marketplace/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/marketplace`,
      metadata: {
        themeId: themeId,
        buyerId: user.id,
        sellerId: theme.themes.owner_id,
        marketplaceId: theme.id,
      },
    });

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('Marketplace purchase error:', error);
    return NextResponse.json({ 
      error: 'Failed to create checkout session' 
    }, { status: 500 });
  }
}

// Handle successful payment webhook
export async function PUT(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
    }

    const supabase = createClient();
    const { themeId, buyerId, sellerId, marketplaceId } = session.metadata as any;

    // Create license for the buyer
    const { data: license, error: licenseError } = await supabase
      .from('licenses')
      .insert({
        theme_id: themeId,
        installed_on_subaccount_id: buyerId,
        active: true,
        purchased_at: new Date().toISOString(),
        stripe_payment_intent_id: session.payment_intent,
      })
      .select()
      .single();

    if (licenseError) {
      console.error('Error creating license:', licenseError);
      return NextResponse.json({ error: 'Failed to create license' }, { status: 500 });
    }

    // Update marketplace download count (simplified for demo)
    console.log('Purchase completed - would increment downloads for marketplace:', marketplaceId);

    // Calculate commission (10% to PulseGen Studio, 90% to seller)
    const totalAmount = (session.amount_total || 0) / 100; // Convert from cents
    const commission = totalAmount * 0.1;
    const sellerAmount = totalAmount * 0.9;

    // In a real implementation, you would:
    // 1. Create a transfer to the seller's Stripe Connect account
    // 2. Record the transaction in your database
    // 3. Update seller's earnings

    console.log('Purchase completed:', {
      themeId,
      buyerId,
      sellerId,
      totalAmount,
      commission,
      sellerAmount,
      licenseId: license.id,
    });

    return NextResponse.json({
      success: true,
      license: license,
      message: 'Purchase completed successfully',
    });
  } catch (error) {
    console.error('Purchase completion error:', error);
    return NextResponse.json({ 
      error: 'Failed to complete purchase' 
    }, { status: 500 });
  }
}
