import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
})

export interface ConnectAccount {
  id: string
  email: string
  country: string
  business_type: string
  charges_enabled: boolean
  payouts_enabled: boolean
  details_submitted: boolean
  created: number
}

export interface PayoutData {
  amount: number
  currency: string
  destination: string
  description: string
}

// Create a Connect account for a new author
export async function createConnectAccount(email: string, country: string = 'US') {
  try {
    const account = await stripe.accounts.create({
      type: 'express',
      country,
      email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    })

    return {
      success: true,
      accountId: account.id,
      account
    }
  } catch (error: any) {
    console.error('Error creating Connect account:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Create account link for onboarding
export async function createAccountLink(accountId: string, refreshUrl: string, returnUrl: string) {
  try {
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: 'account_onboarding',
    })

    return {
      success: true,
      url: accountLink.url
    }
  } catch (error: any) {
    console.error('Error creating account link:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Get account details
export async function getAccountDetails(accountId: string) {
  try {
    const account = await stripe.accounts.retrieve(accountId)
    
    return {
      success: true,
      account: {
        id: account.id,
        email: account.email,
        country: account.country,
        business_type: account.business_type,
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
        details_submitted: account.details_submitted,
        created: account.created
      }
    }
  } catch (error: any) {
    console.error('Error retrieving account:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Create a payment intent for marketplace purchase
export async function createPaymentIntent(
  amount: number,
  currency: string = 'usd',
  applicationFeeAmount: number,
  transferData: { destination: string }
) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      application_fee_amount: applicationFeeAmount,
      transfer_data: transferData,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    }
  } catch (error: any) {
    console.error('Error creating payment intent:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Process a payout to a Connect account
export async function processPayout(payoutData: PayoutData) {
  try {
    const transfer = await stripe.transfers.create({
      amount: Math.round(payoutData.amount * 100), // Convert to cents
      currency: payoutData.currency,
      destination: payoutData.destination,
      description: payoutData.description,
    })

    return {
      success: true,
      transferId: transfer.id,
      transfer
    }
  } catch (error: any) {
    console.error('Error processing payout:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Get payout history for an account
export async function getPayoutHistory(accountId: string, limit: number = 10) {
  try {
    const transfers = await stripe.transfers.list({
      destination: accountId,
      limit,
    })

    return {
      success: true,
      payouts: transfers.data.map(transfer => ({
        id: transfer.id,
        amount: transfer.amount / 100, // Convert from cents
        currency: transfer.currency,
        description: transfer.description,
        created: transfer.created,
        status: transfer.reversed ? 'reversed' : 'completed'
      }))
    }
  } catch (error: any) {
    console.error('Error getting payout history:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Calculate platform fee (typically 10-30% of the sale)
export function calculatePlatformFee(amount: number, feePercentage: number = 0.15) {
  return Math.round(amount * feePercentage * 100) / 100 // Round to 2 decimal places
}

// Calculate author payout (amount minus platform fee)
export function calculateAuthorPayout(amount: number, feePercentage: number = 0.15) {
  const platformFee = calculatePlatformFee(amount, feePercentage)
  return amount - platformFee
}

// Validate Connect account status
export function validateAccountStatus(account: ConnectAccount) {
  const issues: string[] = []
  
  if (!account.details_submitted) {
    issues.push('Account details not submitted')
  }
  
  if (!account.charges_enabled) {
    issues.push('Charges not enabled')
  }
  
  if (!account.payouts_enabled) {
    issues.push('Payouts not enabled')
  }
  
  return {
    isValid: issues.length === 0,
    issues
  }
}
