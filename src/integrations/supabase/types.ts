export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_settings: {
        Row: {
          created_at: string | null
          id: string
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value?: Json
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      crm_integrations: {
        Row: {
          api_key: string | null
          config: Json | null
          created_at: string | null
          crm_type: Database["public"]["Enums"]["crm_type"]
          id: string
          last_sync_at: string | null
          name: string
          oauth_data: Json | null
          status: string | null
          updated_at: string | null
          webhook_url: string | null
        }
        Insert: {
          api_key?: string | null
          config?: Json | null
          created_at?: string | null
          crm_type: Database["public"]["Enums"]["crm_type"]
          id?: string
          last_sync_at?: string | null
          name: string
          oauth_data?: Json | null
          status?: string | null
          updated_at?: string | null
          webhook_url?: string | null
        }
        Update: {
          api_key?: string | null
          config?: Json | null
          created_at?: string | null
          crm_type?: Database["public"]["Enums"]["crm_type"]
          id?: string
          last_sync_at?: string | null
          name?: string
          oauth_data?: Json | null
          status?: string | null
          updated_at?: string | null
          webhook_url?: string | null
        }
        Relationships: []
      }
      data_sources: {
        Row: {
          created_at: string | null
          id: string
          last_sync: string | null
          name: string
          status: string | null
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_sync?: string | null
          name: string
          status?: string | null
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_sync?: string | null
          name?: string
          status?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ecommerce_data: {
        Row: {
          average_order_value: number | null
          cart_abandonment_rate: number | null
          conversion_rate: number | null
          created_at: string | null
          customer_acquisition_cost: number | null
          date: string | null
          id: string
          mobile_usage_percentage: number | null
          peak_hours: Json | null
          return_rate: number | null
          user_id: string | null
        }
        Insert: {
          average_order_value?: number | null
          cart_abandonment_rate?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          customer_acquisition_cost?: number | null
          date?: string | null
          id?: string
          mobile_usage_percentage?: number | null
          peak_hours?: Json | null
          return_rate?: number | null
          user_id?: string | null
        }
        Update: {
          average_order_value?: number | null
          cart_abandonment_rate?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          customer_acquisition_cost?: number | null
          date?: string | null
          id?: string
          mobile_usage_percentage?: number | null
          peak_hours?: Json | null
          return_rate?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      exports: {
        Row: {
          created_at: string | null
          download_url: string | null
          format: string
          id: string
          resource_id: string
          resource_type: string
          status: string | null
          team_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          download_url?: string | null
          format: string
          id?: string
          resource_id: string
          resource_type: string
          status?: string | null
          team_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          download_url?: string | null
          format?: string
          id?: string
          resource_id?: string
          resource_type?: string
          status?: string | null
          team_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exports_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      file_storage: {
        Row: {
          created_at: string | null
          file_name: string
          file_path: string
          folder_path: string | null
          id: string
          is_folder: boolean | null
          mime_type: string | null
          size: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_path: string
          folder_path?: string | null
          id?: string
          is_folder?: boolean | null
          mime_type?: string | null
          size?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_path?: string
          folder_path?: string | null
          id?: string
          is_folder?: boolean | null
          mime_type?: string | null
          size?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      finance_data: {
        Row: {
          asset_turnover: number | null
          cash_flow_ratio: number | null
          created_at: string | null
          date: string | null
          debt_to_equity: number | null
          expenses: number | null
          id: string
          operating_margin: number | null
          profit: number | null
          return_on_investment: number | null
          revenue: number | null
          risks: Json | null
          user_id: string | null
        }
        Insert: {
          asset_turnover?: number | null
          cash_flow_ratio?: number | null
          created_at?: string | null
          date?: string | null
          debt_to_equity?: number | null
          expenses?: number | null
          id?: string
          operating_margin?: number | null
          profit?: number | null
          return_on_investment?: number | null
          revenue?: number | null
          risks?: Json | null
          user_id?: string | null
        }
        Update: {
          asset_turnover?: number | null
          cash_flow_ratio?: number | null
          created_at?: string | null
          date?: string | null
          debt_to_equity?: number | null
          expenses?: number | null
          id?: string
          operating_margin?: number | null
          profit?: number | null
          return_on_investment?: number | null
          revenue?: number | null
          risks?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      logistics_data: {
        Row: {
          average_transit_time: number | null
          created_at: string | null
          date: string | null
          fuel_efficiency: number | null
          id: string
          on_time_delivery_rate: number | null
          return_processing_time: number | null
          route_data: Json | null
          user_id: string | null
          warehouse_utilization: number | null
          weather_affected_routes: Json | null
        }
        Insert: {
          average_transit_time?: number | null
          created_at?: string | null
          date?: string | null
          fuel_efficiency?: number | null
          id?: string
          on_time_delivery_rate?: number | null
          return_processing_time?: number | null
          route_data?: Json | null
          user_id?: string | null
          warehouse_utilization?: number | null
          weather_affected_routes?: Json | null
        }
        Update: {
          average_transit_time?: number | null
          created_at?: string | null
          date?: string | null
          fuel_efficiency?: number | null
          id?: string
          on_time_delivery_rate?: number | null
          return_processing_time?: number | null
          route_data?: Json | null
          user_id?: string | null
          warehouse_utilization?: number | null
          weather_affected_routes?: Json | null
        }
        Relationships: []
      }
      "lovable Auth": {
        Row: {
          created_at: string
          full_name: string | null
          id: string | null
          "id(uuid)": number
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id?: string | null
          "id(uuid)"?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string | null
          "id(uuid)"?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          business_type: string | null
          created_at: string | null
          currency: string
          id: string
          metadata: Json | null
          payment_type: Database["public"]["Enums"]["payment_type"]
          plan_id: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          subscription_status: string | null
          transaction_ref: string
          trial_end_date: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          business_type?: string | null
          created_at?: string | null
          currency?: string
          id?: string
          metadata?: Json | null
          payment_type: Database["public"]["Enums"]["payment_type"]
          plan_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          subscription_status?: string | null
          transaction_ref: string
          trial_end_date?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          business_type?: string | null
          created_at?: string | null
          currency?: string
          id?: string
          metadata?: Json | null
          payment_type?: Database["public"]["Enums"]["payment_type"]
          plan_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          subscription_status?: string | null
          transaction_ref?: string
          trial_end_date?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      predictive_models: {
        Row: {
          created_at: string | null
          data_source: string | null
          id: string
          industry: string | null
          model_type: string
          name: string
          status: string | null
          target_variable: string | null
          training_progress: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          data_source?: string | null
          id?: string
          industry?: string | null
          model_type: string
          name: string
          status?: string | null
          target_variable?: string | null
          training_progress?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          data_source?: string | null
          id?: string
          industry?: string | null
          model_type?: string
          name?: string
          status?: string | null
          target_variable?: string | null
          training_progress?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          business_size: string
          company_name: string
          created_at: string
          employee_count: number
          id: string
          updated_at: string
        }
        Insert: {
          business_size: string
          company_name: string
          created_at?: string
          employee_count: number
          id: string
          updated_at?: string
        }
        Update: {
          business_size?: string
          company_name?: string
          created_at?: string
          employee_count?: number
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      realestate_data: {
        Row: {
          created_at: string | null
          date: string | null
          id: string
          investment_potential_score: number | null
          lead_conversion_rate: number | null
          lead_scoring_data: Json | null
          market_demand_index: number | null
          market_trends: Json | null
          property_types_performance: Json | null
          property_valuation: number | null
          security_compliance_metrics: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          id?: string
          investment_potential_score?: number | null
          lead_conversion_rate?: number | null
          lead_scoring_data?: Json | null
          market_demand_index?: number | null
          market_trends?: Json | null
          property_types_performance?: Json | null
          property_valuation?: number | null
          security_compliance_metrics?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string | null
          id?: string
          investment_potential_score?: number | null
          lead_conversion_rate?: number | null
          lead_scoring_data?: Json | null
          market_demand_index?: number | null
          market_trends?: Json | null
          property_types_performance?: Json | null
          property_valuation?: number | null
          security_compliance_metrics?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      setup_fees: {
        Row: {
          amount: number
          business_type: string
          created_at: string | null
          payment_link: string
        }
        Insert: {
          amount: number
          business_type: string
          created_at?: string | null
          payment_link: string
        }
        Update: {
          amount?: number
          business_type?: string
          created_at?: string | null
          payment_link?: string
        }
        Relationships: []
      }
      shared_resources: {
        Row: {
          created_at: string | null
          id: string
          resource_id: string
          resource_type: string
          team_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          resource_id: string
          resource_type: string
          team_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          resource_id?: string
          resource_type?: string
          team_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shared_resources_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          created_at: string | null
          description: string | null
          features: Json | null
          id: string
          name: string
          price: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id: string
          name: string
          price: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          name?: string
          price?: number
        }
        Relationships: []
      }
      team_members: {
        Row: {
          created_at: string | null
          id: string
          role: string
          team_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: string
          team_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          team_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tech_data: {
        Row: {
          active_users: number | null
          churn_rate: number | null
          created_at: string | null
          date: string | null
          feature_adoption_rate: number | null
          growth_rate: number | null
          id: string
          retention_rate: number | null
          security_metrics: Json | null
          user_behavior_patterns: Json | null
          user_engagement_rate: number | null
          user_id: string | null
        }
        Insert: {
          active_users?: number | null
          churn_rate?: number | null
          created_at?: string | null
          date?: string | null
          feature_adoption_rate?: number | null
          growth_rate?: number | null
          id?: string
          retention_rate?: number | null
          security_metrics?: Json | null
          user_behavior_patterns?: Json | null
          user_engagement_rate?: number | null
          user_id?: string | null
        }
        Update: {
          active_users?: number | null
          churn_rate?: number | null
          created_at?: string | null
          date?: string | null
          feature_adoption_rate?: number | null
          growth_rate?: number | null
          id?: string
          retention_rate?: number | null
          security_metrics?: Json | null
          user_behavior_patterns?: Json | null
          user_engagement_rate?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_setup_progress: {
        Row: {
          completed_steps: string[] | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_steps?: string[] | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_steps?: string[] | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      workflows: {
        Row: {
          config: Json
          created_at: string | null
          created_by: string | null
          id: string
          name: string
          schedule: string | null
          status: string | null
          team_id: string | null
          updated_at: string | null
        }
        Insert: {
          config?: Json
          created_at?: string | null
          created_by?: string | null
          id?: string
          name: string
          schedule?: string | null
          status?: string | null
          team_id?: string | null
          updated_at?: string | null
        }
        Update: {
          config?: Json
          created_at?: string | null
          created_by?: string | null
          id?: string
          name?: string
          schedule?: string | null
          status?: string | null
          team_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflows_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      crm_type: "hubspot" | "zoho" | "salesforce" | "custom"
      payment_status: "pending" | "successful" | "failed" | "cancelled"
      payment_type: "one_time" | "subscription"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
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
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
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
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
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
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
