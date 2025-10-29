import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { User, UserRole, SignupFormData, LoginFormData } from '@/lib/supabase/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Encryption utilities for GHL API keys
export const encryptApiKey = async (apiKey: string): Promise<string> => {
  // In production, use proper encryption like crypto.createCipher
  // For now, we'll use a simple base64 encoding (NOT SECURE FOR PRODUCTION)
  return Buffer.from(apiKey).toString('base64');
};

export const decryptApiKey = async (encryptedApiKey: string): Promise<string> => {
  return Buffer.from(encryptedApiKey, 'base64').toString('utf-8');
};

// Password utilities
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 12);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

// GHL API validation
export const validateGHLAPIKey = async (apiKey: string): Promise<{ valid: boolean; user?: any; error?: string }> => {
  try {
    const response = await fetch('https://services.leadconnectorhq.com/users/', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return { valid: false, error: 'Invalid API key' };
    }

    const data = await response.json();
    return { valid: true, user: data };
  } catch (error) {
    return { valid: false, error: 'Failed to validate API key' };
  }
};

// Authentication functions
export const signup = async (formData: SignupFormData) => {
  try {
    // Validate GHL API key first
    const ghlValidation = await validateGHLAPIKey(formData.ghl_api_key);
    if (!ghlValidation.valid) {
      return { error: ghlValidation.error || 'Invalid GHL API key' };
    }

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('User creation failed');

    // Encrypt API key
    const api_key_encrypted = await encryptApiKey(formData.ghl_api_key);

    // Create profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        full_name: formData.name,
        role: formData.role,
      })
      .select()
      .single();

    if (profileError) throw profileError;

    // Create agency or subaccount
    let agency_id: string | undefined;

    if (formData.role === 'agency') {
      const { data: agency, error: agencyError } = await supabase
        .from('agencies')
        .insert({
          name: formData.agency_name!,
          owner_id: authData.user.id,
          ghl_api_key_encrypted: api_key_encrypted,
        })
        .select()
        .single();

      if (agencyError) throw agencyError;
      agency_id = agency.id;

      // Update profile with agency_id
      await supabase
        .from('profiles')
        .update({ agency_id })
        .eq('id', authData.user.id);
    }

    // Create subscription status record
    const { error: subscriptionError } = await supabase
      .from('subscription_status')
      .insert({
        user_id: authData.user.id,
        status: 'incomplete',
      });

    if (subscriptionError) throw subscriptionError;

    return { data: { ...authData.user, profile } };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const login = async (formData: LoginFormData) => {
  try {
    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Login failed');

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) throw profileError;

    // Get subscription status
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscription_status')
      .select('*')
      .eq('user_id', authData.user.id)
      .single();

    if (subscriptionError) {
      console.error('Subscription status error:', subscriptionError);
    }

    return { 
      data: { 
        ...authData.user, 
        profile,
        subscription_status: subscription 
      } 
    };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const getUserById = async (userId: string) => {
  try {
    // Get user from Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;

    // Get profile with related data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        *,
        agency:agencies(*),
        subscription_status:subscription_status(*)
      `)
      .eq('id', userId)
      .single();

    if (profileError) throw profileError;

    return { data: { ...authUser.user, profile } };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const updateUser = async (userId: string, updates: Partial<any>) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    return { data };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Role-based access control
export const hasPermission = (userRole: UserRole, requiredRole: UserRole): boolean => {
  const roleHierarchy = {
    'super_admin': 3,
    'agency': 2,
    'subaccount': 1,
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

export const isSuperAdmin = (userRole: UserRole): boolean => {
  return userRole === 'super_admin';
};

export const isAgency = (userRole: UserRole): boolean => {
  return userRole === 'agency';
};

export const isSubaccount = (userRole: UserRole): boolean => {
  return userRole === 'subaccount';
};
