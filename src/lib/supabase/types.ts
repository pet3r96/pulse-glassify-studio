export type UserRole = 'super_admin' | 'agency' | 'subaccount';

// Database type for Supabase
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>;
      };
      agencies: {
        Row: Agency;
        Insert: Omit<Agency, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Agency, 'id' | 'created_at' | 'updated_at'>>;
      };
      subaccounts: {
        Row: Subaccount;
        Insert: Omit<Subaccount, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Subaccount, 'id' | 'created_at' | 'updated_at'>>;
      };
      themes: {
        Row: Theme;
        Insert: Omit<Theme, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Theme, 'id' | 'created_at' | 'updated_at'>>;
      };
      theme_versions: {
        Row: ThemeVersion;
        Insert: Omit<ThemeVersion, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ThemeVersion, 'id' | 'created_at' | 'updated_at'>>;
      };
      marketplace: {
        Row: Marketplace;
        Insert: Omit<Marketplace, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Marketplace, 'id' | 'created_at' | 'updated_at'>>;
      };
      licenses: {
        Row: License;
        Insert: Omit<License, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<License, 'id' | 'created_at' | 'updated_at'>>;
      };
      project_manager: {
        Row: ProjectManager;
        Insert: Omit<ProjectManager, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ProjectManager, 'id' | 'created_at' | 'updated_at'>>;
      };
      tenant_config: {
        Row: TenantConfig;
        Insert: Omit<TenantConfig, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<TenantConfig, 'id' | 'created_at' | 'updated_at'>>;
      };
      subscription_status: {
        Row: SubscriptionStatus;
        Insert: Omit<SubscriptionStatus, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SubscriptionStatus, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}
export type SubscriptionStatus = 'active' | 'trialing' | 'canceled' | 'past_due' | 'incomplete';
export type ThemeVisibility = 'private' | 'marketplace';
export type TaskStatus = 'open' | 'in_progress' | 'completed' | 'cancelled';

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  agency_id?: string;
  subaccount_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Agency {
  id: string;
  name: string;
  domain?: string;
  api_key_encrypted: string;
  override_billing: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subaccount {
  id: string;
  agency_id: string;
  ghl_location_id: string;
  name: string;
  api_key_encrypted: string;
  connected_at: string;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionStatusRecord {
  id: string;
  user_id: string;
  status: SubscriptionStatus;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  stripe_price_id?: string;
  current_period_start?: string;
  current_period_end?: string;
  created_at: string;
  updated_at: string;
}

export interface Theme {
  id: string;
  name: string;
  owner_id: string;
  agency_id?: string;
  thumbnail_url?: string;
  is_active: boolean;
  visibility: ThemeVisibility;
  marketplace_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ThemeVersion {
  id: string;
  theme_id: string;
  css_code: string;
  js_code?: string;
  version_number: number;
  is_current: boolean;
  created_at: string;
}

export interface Marketplace {
  id: string;
  theme_id: string;
  price: number;
  is_listed: boolean;
  stripe_connect_account_id?: string;
  downloads: number;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface License {
  id: string;
  theme_id: string;
  installed_on_subaccount_id: string;
  active: boolean;
  installed_at: string;
  expires_at?: string;
}

export interface ProjectManager {
  id: string;
  agency_id: string;
  tasks: any[]; // JSONB array
  created_at: string;
  updated_at: string;
}

export interface TenantConfig {
  id: string;
  owner_type: 'agency' | 'subaccount';
  owner_id: string;
  navigation_config: Record<string, any>;
  ui_flags: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Extended types with relationships
export interface UserWithRelations extends User {
  agency?: Agency;
  subaccount?: Subaccount;
  subscription_status?: SubscriptionStatusRecord;
}

export interface ThemeWithRelations extends Theme {
  owner?: User;
  agency?: Agency;
  marketplace?: Marketplace;
  versions?: ThemeVersion[];
  current_version?: ThemeVersion;
}

export interface AgencyWithRelations extends Agency {
  users?: User[];
  subaccounts?: Subaccount[];
  themes?: Theme[];
}

export interface SubaccountWithRelations extends Subaccount {
  agency?: Agency;
  users?: User[];
  licenses?: License[];
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Form types
export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  agency_name?: string;
  subaccount_name?: string;
  ghl_api_key: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ThemeFormData {
  name: string;
  css_code: string;
  js_code?: string;
  visibility: ThemeVisibility;
  thumbnail_url?: string;
}

export interface MarketplaceFormData {
  theme_id: string;
  price: number;
  stripe_connect_account_id?: string;
}

// Stripe types
export interface StripeCustomer {
  id: string;
  email: string;
  name?: string;
}

export interface StripeSubscription {
  id: string;
  customer_id: string;
  status: string;
  current_period_start: number;
  current_period_end: number;
  price_id: string;
}

// GHL API types
export interface GHLUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface GHLValidationResponse {
  valid: boolean;
  user?: GHLUser;
  error?: string;
}