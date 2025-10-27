import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { user_id, stripe_customer_id, status } = await request.json()

    if (!user_id || !stripe_customer_id || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Update subscription status
    const { data, error } = await supabase
      .from('subscription_status')
      .upsert({
        user_id,
        stripe_customer_id,
        status,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      subscription_status: data,
    })
  } catch (error: any) {
    console.error('Subscription update error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
