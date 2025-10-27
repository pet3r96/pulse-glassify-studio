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

    // Hash password
    const password_hash = await hashPassword(formData.password);
    
    // Encrypt API key
    const api_key_encrypted = await encryptApiKey(formData.ghl_api_key);

    // Create agency or subaccount first
    let agency_id: string | undefined;
    let subaccount_id: string | undefined;

    if (formData.role === 'agency') {
      const { data: agency, error: agencyError } = await supabase
        .from('agencies')
        .insert({
          name: formData.agency_name!,
          api_key_encrypted,
        })
        .select()
        .single();

      if (agencyError) throw agencyError;
      agency_id = agency.id;
    } else if (formData.role === 'subaccount') {
      // For subaccounts, we need to find the parent agency
      // This would typically be done through an invitation system
      // For now, we'll create a placeholder
      const { data: subaccount, error: subaccountError } = await supabase
        .from('subaccounts')
        .insert({
          agency_id: 'placeholder', // This should be set properly
          ghl_location_id: 'placeholder',
          name: formData.subaccount_name!,
          api_key_encrypted,
        })
        .select()
        .single();

      if (subaccountError) throw subaccountError;
      subaccount_id = subaccount.id;
    }

    // Create user
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        name: formData.name,
        email: formData.email,
        password_hash,
        role: formData.role,
        agency_id,
        subaccount_id,
      })
      .select()
      .single();

    if (userError) throw userError;

    // Create subscription status record
    const { error: subscriptionError } = await supabase
      .from('subscription_status')
      .insert({
        user_id: user.id,
        status: 'incomplete',
      });

    if (subscriptionError) throw subscriptionError;

    return { data: user };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const login = async (formData: LoginFormData) => {
  try {
    // Get user with password hash
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', formData.email)
      .single();

    if (userError || !user) {
      return { error: 'Invalid credentials' };
    }

    // Verify password
    const isValid = await verifyPassword(formData.password, user.password_hash);
    if (!isValid) {
      return { error: 'Invalid credentials' };
    }

    // Get subscription status
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscription_status')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (subscriptionError) {
      console.error('Subscription status error:', subscriptionError);
    }

    // Remove password hash from response
    const { password_hash, ...userWithoutPassword } = user;

    return { 
      data: { 
        ...userWithoutPassword, 
        subscription_status: subscription 
      } 
    };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const getUserById = async (userId: string) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select(`
        *,
        agency:agencies(*),
        subaccount:subaccounts(*),
        subscription_status:subscription_status(*)
      `)
      .eq('id', userId)
      .single();

    if (error) throw error;

    // Remove password hash
    const { password_hash, ...userWithoutPassword } = user;
    return { data: userWithoutPassword };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const updateUser = async (userId: string, updates: Partial<User>) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    // Remove password hash
    const { password_hash, ...userWithoutPassword } = data;
    return { data: userWithoutPassword };
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
