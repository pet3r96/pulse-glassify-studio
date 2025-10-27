import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
})

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      )
    }

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        source: 'pulsegen_studio',
      },
    })

    return NextResponse.json({
      customer_id: customer.id,
      email: customer.email,
    })
  } catch (error: any) {
    console.error('Stripe customer creation error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
