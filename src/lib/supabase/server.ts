import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from './types'

export const createClient = () => {
  const cookieStore = cookies()

        return createServerClient<Database>(
          'https://bafqocuimkfjnuhvhsat.supabase.co',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhZnFvY3VpbWtmam51aHZoc2F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0NDQ2NTcsImV4cCI6MjA3NzAyMDY1N30.ary_R34tb_jAuM2QddZBpWZM7DktoISmDAtDDDSU0LM',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

// Helper function to get current user on server
export const getCurrentUser = async () => {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

// Helper function to get user profile on server
export const getUserProfile = async (userId: string) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}

// Helper function to get user's agency on server
export const getUserAgency = async (userId: string) => {
  const profile = await getUserProfile(userId)
  if (!profile?.agency_id) return null
  
  const supabase = createClient()
  const { data, error } = await supabase
    .from('agencies')
    .select('*')
    .eq('id', profile.agency_id)
    .single()
  
  if (error) throw error
  return data
}
