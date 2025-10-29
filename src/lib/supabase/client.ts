import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  }
})

// Export createClient for use in components
export { createClient }

// Helper function to get current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

// Helper function to get user profile
export const getUserProfile = async (userId: string) => {
  const { data, error } = await (supabase as any)
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}

// Helper function to get user's agency
export const getUserAgency = async (userId: string) => {
  const { data: profile } = await getUserProfile(userId)
  if (!(profile as any)?.agency_id) return null
  
  const { data, error } = await (supabase as any)
    .from('agencies')
    .select('*')
    .eq('id', (profile as any).agency_id)
    .single()
  
  if (error) throw error
  return data
}

// Helper function to validate GHL API key
export const validateGHLApiKey = async (apiKey: string) => {
  try {
    const response = await fetch('https://api.msgsndr.com/api/v2/location/branding', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    })
    
    return {
      valid: response.ok,
      status: response.status,
      data: response.ok ? await response.json() : null
    }
  } catch (error) {
    return {
      valid: false,
      status: 0,
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Helper function to encrypt API key
export const encryptApiKey = async (apiKey: string) => {
  // In a real implementation, you would use proper encryption
  // For now, we'll use a simple base64 encoding
  return btoa(apiKey)
}

// Helper function to decrypt API key
export const decryptApiKey = async (encryptedKey: string) => {
  // In a real implementation, you would use proper decryption
  // For now, we'll use a simple base64 decoding
  return atob(encryptedKey)
}
