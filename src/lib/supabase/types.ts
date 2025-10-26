export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      agencies: {
        Row: {
          id: string
          name: string
          owner_id: string
          ghl_api_key_encrypted: string | null
          ghl_api_key_valid: boolean
          ghl_api_key_last_validated: string | null
          logo_url: string | null
          favicon_url: string | null
          base_theme: string
          embedded_mode_enabled: boolean
          embedded_token: string | null
          subscription_id: string | null
          subscription_status: 'active' | 'trial' | 'past_due' | 'canceled' | 'unpaid'
          trial_ends_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          owner_id: string
          ghl_api_key_encrypted?: string | null
          ghl_api_key_valid?: boolean
          ghl_api_key_last_validated?: string | null
          logo_url?: string | null
          favicon_url?: string | null
          base_theme?: string
          embedded_mode_enabled?: boolean
          embedded_token?: string | null
          subscription_id?: string | null
          subscription_status?: 'active' | 'trial' | 'past_due' | 'canceled' | 'unpaid'
          trial_ends_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          owner_id?: string
          ghl_api_key_encrypted?: string | null
          ghl_api_key_valid?: boolean
          ghl_api_key_last_validated?: string | null
          logo_url?: string | null
          favicon_url?: string | null
          base_theme?: string
          embedded_mode_enabled?: boolean
          embedded_token?: string | null
          subscription_id?: string | null
          subscription_status?: 'active' | 'trial' | 'past_due' | 'canceled' | 'unpaid'
          trial_ends_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          role: 'super_admin' | 'agency' | 'subaccount'
          agency_id: string | null
          onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'super_admin' | 'agency' | 'subaccount'
          agency_id?: string | null
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'super_admin' | 'agency' | 'subaccount'
          agency_id?: string | null
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      subaccounts: {
        Row: {
          id: string
          agency_id: string
          name: string
          ghl_location_id: string | null
          ghl_api_key_encrypted: string | null
          ghl_api_key_valid: boolean
          theme_id: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          agency_id: string
          name: string
          ghl_location_id?: string | null
          ghl_api_key_encrypted?: string | null
          ghl_api_key_valid?: boolean
          theme_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          agency_id?: string
          name?: string
          ghl_location_id?: string | null
          ghl_api_key_encrypted?: string | null
          ghl_api_key_valid?: boolean
          theme_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      themes: {
        Row: {
          id: string
          agency_id: string
          name: string
          description: string | null
          css_content: string | null
          js_content: string | null
          status: 'draft' | 'published' | 'archived'
          is_public: boolean
          version: number
          parent_theme_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          agency_id: string
          name: string
          description?: string | null
          css_content?: string | null
          js_content?: string | null
          status?: 'draft' | 'published' | 'archived'
          is_public?: boolean
          version?: number
          parent_theme_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          agency_id?: string
          name?: string
          description?: string | null
          css_content?: string | null
          js_content?: string | null
          status?: 'draft' | 'published' | 'archived'
          is_public?: boolean
          version?: number
          parent_theme_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      theme_deployments: {
        Row: {
          id: string
          theme_id: string
          agency_id: string
          subaccount_id: string | null
          deployed_at: string
          rollback_available_until: string
          deployment_data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          theme_id: string
          agency_id: string
          subaccount_id?: string | null
          deployed_at?: string
          rollback_available_until?: string
          deployment_data?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          theme_id?: string
          agency_id?: string
          subaccount_id?: string | null
          deployed_at?: string
          rollback_available_until?: string
          deployment_data?: Json | null
          created_at?: string
        }
      }
      marketplace_items: {
        Row: {
          id: string
          agency_id: string
          name: string
          description: string | null
          type: string
          price_cents: number
          preview_url: string | null
          download_url: string | null
          is_approved: boolean
          download_count: number
          rating: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          agency_id: string
          name: string
          description?: string | null
          type: string
          price_cents?: number
          preview_url?: string | null
          download_url?: string | null
          is_approved?: boolean
          download_count?: number
          rating?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          agency_id?: string
          name?: string
          description?: string | null
          type?: string
          price_cents?: number
          preview_url?: string | null
          download_url?: string | null
          is_approved?: boolean
          download_count?: number
          rating?: number
          created_at?: string
          updated_at?: string
        }
      }
      support_tickets: {
        Row: {
          id: string
          agency_id: string
          subaccount_id: string | null
          title: string
          description: string | null
          status: 'open' | 'in_progress' | 'resolved' | 'closed'
          priority: string
          assigned_to: string | null
          created_by: string
          resolved_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          agency_id: string
          subaccount_id?: string | null
          title: string
          description?: string | null
          status?: 'open' | 'in_progress' | 'resolved' | 'closed'
          priority?: string
          assigned_to?: string | null
          created_by: string
          resolved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          agency_id?: string
          subaccount_id?: string | null
          title?: string
          description?: string | null
          status?: 'open' | 'in_progress' | 'resolved' | 'closed'
          priority?: string
          assigned_to?: string | null
          created_by?: string
          resolved_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          agency_id: string
          subaccount_id: string | null
          title: string
          description: string | null
          status: 'todo' | 'in_progress' | 'completed' | 'cancelled'
          priority: string
          assigned_to: string | null
          created_by: string
          due_date: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          agency_id: string
          subaccount_id?: string | null
          title: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'completed' | 'cancelled'
          priority?: string
          assigned_to?: string | null
          created_by: string
          due_date?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          agency_id?: string
          subaccount_id?: string | null
          title?: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'completed' | 'cancelled'
          priority?: string
          assigned_to?: string | null
          created_by?: string
          due_date?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      webhooks: {
        Row: {
          id: string
          agency_id: string
          name: string
          url: string
          events: string[]
          is_active: boolean
          secret_key: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          agency_id: string
          name: string
          url: string
          events: string[]
          is_active?: boolean
          secret_key?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          agency_id?: string
          name?: string
          url?: string
          events?: string[]
          is_active?: boolean
          secret_key?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      analytics: {
        Row: {
          id: string
          agency_id: string
          subaccount_id: string | null
          event_type: string
          event_data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          agency_id: string
          subaccount_id?: string | null
          event_type: string
          event_data?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          agency_id?: string
          subaccount_id?: string | null
          event_type?: string
          event_data?: Json | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'super_admin' | 'agency' | 'subaccount'
      subscription_status: 'active' | 'trial' | 'past_due' | 'canceled' | 'unpaid'
      theme_status: 'draft' | 'published' | 'archived'
      ticket_status: 'open' | 'in_progress' | 'resolved' | 'closed'
      task_status: 'todo' | 'in_progress' | 'completed' | 'cancelled'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never