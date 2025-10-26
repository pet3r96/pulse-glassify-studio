export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      agencies: {
        Row: {
          active_theme_id: string | null
          api_key: string | null
          base_theme: string | null
          created_at: string | null
          domain: string | null
          embedded_mode_enabled: boolean | null
          embedded_token: string | null
          favicon_url: string | null
          ghl_api_key: string | null
          ghl_api_key_last_validated: string | null
          ghl_api_key_valid: boolean | null
          id: string
          logo_url: string | null
          name: string
          owner_id: string | null
          updated_at: string | null
        }
        Insert: {
          active_theme_id?: string | null
          api_key?: string | null
          base_theme?: string | null
          created_at?: string | null
          domain?: string | null
          embedded_mode_enabled?: boolean | null
          embedded_token?: string | null
          favicon_url?: string | null
          ghl_api_key?: string | null
          ghl_api_key_last_validated?: string | null
          ghl_api_key_valid?: boolean | null
          id?: string
          logo_url?: string | null
          name: string
          owner_id?: string | null
          updated_at?: string | null
        }
        Update: {
          active_theme_id?: string | null
          api_key?: string | null
          base_theme?: string | null
          created_at?: string | null
          domain?: string | null
          embedded_mode_enabled?: boolean | null
          embedded_token?: string | null
          favicon_url?: string | null
          ghl_api_key?: string | null
          ghl_api_key_last_validated?: string | null
          ghl_api_key_valid?: boolean | null
          id?: string
          logo_url?: string | null
          name?: string
          owner_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agencies_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      deployment_logs: {
        Row: {
          action: string
          created_at: string | null
          deployment_id: string
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          deployment_id: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          deployment_id?: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deployment_logs_deployment_id_fkey"
            columns: ["deployment_id"]
            isOneToOne: false
            referencedRelation: "theme_deployments"
            referencedColumns: ["id"]
          },
        ]
      }
      plugin_configs: {
        Row: {
          agency_id: string
          config: Json | null
          created_at: string | null
          enabled: boolean | null
          id: string
          plugin_name: string
          updated_at: string | null
        }
        Insert: {
          agency_id: string
          config?: Json | null
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          plugin_name: string
          updated_at?: string | null
        }
        Update: {
          agency_id?: string
          config?: Json | null
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          plugin_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plugin_configs_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          agency_id: string | null
          created_at: string | null
          full_name: string | null
          id: string
          onboarding_completed: boolean | null
          role: Database["public"]["Enums"]["user_role"]
          subaccount_id: string | null
          updated_at: string | null
        }
        Insert: {
          agency_id?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          onboarding_completed?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          subaccount_id?: string | null
          updated_at?: string | null
        }
        Update: {
          agency_id?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          onboarding_completed?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          subaccount_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      subaccount_themes: {
        Row: {
          created_at: string | null
          deployment_id: string | null
          id: string
          subaccount_id: string
          theme_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deployment_id?: string | null
          id?: string
          subaccount_id: string
          theme_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deployment_id?: string | null
          id?: string
          subaccount_id?: string
          theme_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subaccount_themes_deployment_id_fkey"
            columns: ["deployment_id"]
            isOneToOne: false
            referencedRelation: "theme_deployments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subaccount_themes_subaccount_id_fkey"
            columns: ["subaccount_id"]
            isOneToOne: true
            referencedRelation: "subaccounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subaccount_themes_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "themes"
            referencedColumns: ["id"]
          },
        ]
      }
      subaccounts: {
        Row: {
          agency_id: string | null
          api_key: string | null
          connected_at: string | null
          created_at: string | null
          ghl_location_id: string | null
          id: string
          name: string
        }
        Insert: {
          agency_id?: string | null
          api_key?: string | null
          connected_at?: string | null
          created_at?: string | null
          ghl_location_id?: string | null
          id?: string
          name: string
        }
        Update: {
          agency_id?: string | null
          api_key?: string | null
          connected_at?: string | null
          created_at?: string | null
          ghl_location_id?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "subaccounts_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      theme_deployments: {
        Row: {
          agency_id: string
          created_at: string | null
          deployed_at: string | null
          deployed_by: string | null
          deployment_code: string
          expires_at: string | null
          id: string
          license_token: string
          rollback_from_deployment_id: string | null
          scheduled_for: string | null
          status: string | null
          subaccount_id: string | null
          theme_id: string
          theme_version_id: string | null
          updated_at: string | null
        }
        Insert: {
          agency_id: string
          created_at?: string | null
          deployed_at?: string | null
          deployed_by?: string | null
          deployment_code: string
          expires_at?: string | null
          id?: string
          license_token: string
          rollback_from_deployment_id?: string | null
          scheduled_for?: string | null
          status?: string | null
          subaccount_id?: string | null
          theme_id: string
          theme_version_id?: string | null
          updated_at?: string | null
        }
        Update: {
          agency_id?: string
          created_at?: string | null
          deployed_at?: string | null
          deployed_by?: string | null
          deployment_code?: string
          expires_at?: string | null
          id?: string
          license_token?: string
          rollback_from_deployment_id?: string | null
          scheduled_for?: string | null
          status?: string | null
          subaccount_id?: string | null
          theme_id?: string
          theme_version_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "theme_deployments_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "theme_deployments_rollback_from_deployment_id_fkey"
            columns: ["rollback_from_deployment_id"]
            isOneToOne: false
            referencedRelation: "theme_deployments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "theme_deployments_subaccount_id_fkey"
            columns: ["subaccount_id"]
            isOneToOne: false
            referencedRelation: "subaccounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "theme_deployments_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "themes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "theme_deployments_theme_version_id_fkey"
            columns: ["theme_version_id"]
            isOneToOne: false
            referencedRelation: "theme_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      theme_versions: {
        Row: {
          colors: Json
          created_at: string | null
          created_by: string | null
          css: string | null
          fonts: Json | null
          id: string
          js: string | null
          theme_id: string
          version_number: number
        }
        Insert: {
          colors: Json
          created_at?: string | null
          created_by?: string | null
          css?: string | null
          fonts?: Json | null
          id?: string
          js?: string | null
          theme_id: string
          version_number: number
        }
        Update: {
          colors?: Json
          created_at?: string | null
          created_by?: string | null
          css?: string | null
          fonts?: Json | null
          id?: string
          js?: string | null
          theme_id?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "theme_versions_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "themes"
            referencedColumns: ["id"]
          },
        ]
      }
      themes: {
        Row: {
          agency_id: string | null
          animations: Json | null
          colors: Json | null
          created_at: string | null
          css: string | null
          fonts: Json | null
          id: string
          js: string | null
          layout: Json | null
          name: string
          updated_at: string | null
          visibility: string | null
        }
        Insert: {
          agency_id?: string | null
          animations?: Json | null
          colors?: Json | null
          created_at?: string | null
          css?: string | null
          fonts?: Json | null
          id?: string
          js?: string | null
          layout?: Json | null
          name: string
          updated_at?: string | null
          visibility?: string | null
        }
        Update: {
          agency_id?: string | null
          animations?: Json | null
          colors?: Json | null
          created_at?: string | null
          css?: string | null
          fonts?: Json | null
          id?: string
          js?: string | null
          layout?: Json | null
          name?: string
          updated_at?: string | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "themes_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_theme_snapshot: { Args: { theme_uuid: string }; Returns: string }
      get_active_deployment: {
        Args: { subaccount_uuid: string }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      process_scheduled_deployments: { Args: never; Returns: number }
      rollback_deployment: {
        Args: { deployment_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "agency" | "subaccount"
      user_role: "super_admin" | "agency" | "subaccount"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["agency", "subaccount"],
      user_role: ["super_admin", "agency", "subaccount"],
    },
  },
} as const
