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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          apt: string | null
          comuna: string
          created_at: string
          full_name: string
          id: string
          is_default: boolean | null
          number: string | null
          phone: string | null
          postal_code: string | null
          region: string
          street: string
          updated_at: string
          user_id: string
        }
        Insert: {
          apt?: string | null
          comuna: string
          created_at?: string
          full_name: string
          id?: string
          is_default?: boolean | null
          number?: string | null
          phone?: string | null
          postal_code?: string | null
          region: string
          street: string
          updated_at?: string
          user_id: string
        }
        Update: {
          apt?: string | null
          comuna?: string
          created_at?: string
          full_name?: string
          id?: string
          is_default?: boolean | null
          number?: string | null
          phone?: string | null
          postal_code?: string | null
          region?: string
          street?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          metadata: Json | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          metadata?: Json | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          metadata?: Json | null
        }
        Relationships: []
      }
      brands: {
        Row: {
          created_at: string
          id: string
          min_price_clp: number | null
          name: string
          required_evidence_photos: number
          risk_level: Database["public"]["Enums"]["brand_risk"]
          slug: string
          updated_at: string
          whitelisted: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          min_price_clp?: number | null
          name: string
          required_evidence_photos?: number
          risk_level?: Database["public"]["Enums"]["brand_risk"]
          slug: string
          updated_at?: string
          whitelisted?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          min_price_clp?: number | null
          name?: string
          required_evidence_photos?: number
          risk_level?: Database["public"]["Enums"]["brand_risk"]
          slug?: string
          updated_at?: string
          whitelisted?: boolean
        }
        Relationships: []
      }
      carrier_accounts: {
        Row: {
          active: boolean
          carrier: Database["public"]["Enums"]["carrier_type"]
          config: Json
          created_at: string
          env: string
          id: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          carrier: Database["public"]["Enums"]["carrier_type"]
          config?: Json
          created_at?: string
          env?: string
          id?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          carrier?: Database["public"]["Enums"]["carrier_type"]
          config?: Json
          created_at?: string
          env?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      carrier_rates_cache: {
        Row: {
          cache_key: string
          carrier: Database["public"]["Enums"]["carrier_type"]
          created_at: string
          expires_at: string
          id: string
          quote: Json
        }
        Insert: {
          cache_key: string
          carrier: Database["public"]["Enums"]["carrier_type"]
          created_at?: string
          expires_at: string
          id?: string
          quote: Json
        }
        Update: {
          cache_key?: string
          carrier?: Database["public"]["Enums"]["carrier_type"]
          created_at?: string
          expires_at?: string
          id?: string
          quote?: Json
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
          parent_id: string | null
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          parent_id?: string | null
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          parent_id?: string | null
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      disputes: {
        Row: {
          created_at: string
          description: string | null
          id: string
          opened_by: string
          order_id: string
          reason: Database["public"]["Enums"]["dispute_reason"]
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: Database["public"]["Enums"]["dispute_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          opened_by: string
          order_id: string
          reason: Database["public"]["Enums"]["dispute_reason"]
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["dispute_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          opened_by?: string
          order_id?: string
          reason?: Database["public"]["Enums"]["dispute_reason"]
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["dispute_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "disputes_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_photos: {
        Row: {
          created_at: string
          id: string
          listing_id: string
          position: number
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          listing_id: string
          position?: number
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          listing_id?: string
          position?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_photos_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          brand_id: string | null
          category_id: string | null
          condition: Database["public"]["Enums"]["listing_condition"]
          created_at: string
          description: string | null
          favorite_count: number
          flagged_reason: string | null
          id: string
          price_clp: number
          seller_id: string
          size: string | null
          status: Database["public"]["Enums"]["listing_status"]
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          brand_id?: string | null
          category_id?: string | null
          condition?: Database["public"]["Enums"]["listing_condition"]
          created_at?: string
          description?: string | null
          favorite_count?: number
          flagged_reason?: string | null
          id?: string
          price_clp: number
          seller_id: string
          size?: string | null
          status?: Database["public"]["Enums"]["listing_status"]
          title: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          brand_id?: string | null
          category_id?: string | null
          condition?: Database["public"]["Enums"]["listing_condition"]
          created_at?: string
          description?: string | null
          favorite_count?: number
          flagged_reason?: string | null
          id?: string
          price_clp?: number
          seller_id?: string
          size?: string | null
          status?: Database["public"]["Enums"]["listing_status"]
          title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "listings_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          attachment_url: string | null
          body: string
          created_at: string
          dispute_id: string | null
          id: string
          order_id: string | null
          sender_id: string
        }
        Insert: {
          attachment_url?: string | null
          body: string
          created_at?: string
          dispute_id?: string | null
          id?: string
          order_id?: string | null
          sender_id: string
        }
        Update: {
          attachment_url?: string | null
          body?: string
          created_at?: string
          dispute_id?: string | null
          id?: string
          order_id?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_dispute_id_fkey"
            columns: ["dispute_id"]
            isOneToOne: false
            referencedRelation: "disputes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          link: string | null
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      order_events: {
        Row: {
          created_at: string
          created_by: string | null
          event: string
          id: string
          metadata: Json | null
          order_id: string
          status: Database["public"]["Enums"]["order_status"] | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          event: string
          id?: string
          metadata?: Json | null
          order_id: string
          status?: Database["public"]["Enums"]["order_status"] | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          event?: string
          id?: string
          metadata?: Json | null
          order_id?: string
          status?: Database["public"]["Enums"]["order_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "order_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount_clp: number
          authorized_at: string | null
          buyer_id: string
          captured_at: string | null
          created_at: string
          delivered_at: string | null
          dispute_deadline: string | null
          fee_clp: number
          id: string
          listing_id: string
          payment_intent_id: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          refunded_at: string | null
          seller_id: string
          shipping_address_id: string | null
          shipping_clp: number
          status: Database["public"]["Enums"]["order_status"]
          total_clp: number
          updated_at: string
        }
        Insert: {
          amount_clp: number
          authorized_at?: string | null
          buyer_id: string
          captured_at?: string | null
          created_at?: string
          delivered_at?: string | null
          dispute_deadline?: string | null
          fee_clp?: number
          id?: string
          listing_id: string
          payment_intent_id?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          refunded_at?: string | null
          seller_id: string
          shipping_address_id?: string | null
          shipping_clp?: number
          status?: Database["public"]["Enums"]["order_status"]
          total_clp: number
          updated_at?: string
        }
        Update: {
          amount_clp?: number
          authorized_at?: string | null
          buyer_id?: string
          captured_at?: string | null
          created_at?: string
          delivered_at?: string | null
          dispute_deadline?: string | null
          fee_clp?: number
          id?: string
          listing_id?: string
          payment_intent_id?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          refunded_at?: string | null
          seller_id?: string
          shipping_address_id?: string | null
          shipping_clp?: number
          status?: Database["public"]["Enums"]["order_status"]
          total_clp?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_shipping_address_id_fkey"
            columns: ["shipping_address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
        ]
      }
      payout_requests: {
        Row: {
          amount_clp: number
          bank_info: Json | null
          created_at: string
          id: string
          processed_at: string | null
          seller_id: string
          status: string
          updated_at: string
        }
        Insert: {
          amount_clp: number
          bank_info?: Json | null
          created_at?: string
          id?: string
          processed_at?: string | null
          seller_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          amount_clp?: number
          bank_info?: Json | null
          created_at?: string
          id?: string
          processed_at?: string | null
          seller_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      payouts_ledger: {
        Row: {
          amount_clp: number
          created_at: string
          description: string | null
          id: string
          order_id: string | null
          seller_id: string
          type: string
        }
        Insert: {
          amount_clp: number
          created_at?: string
          description?: string | null
          id?: string
          order_id?: string | null
          seller_id: string
          type: string
        }
        Update: {
          amount_clp?: number
          created_at?: string
          description?: string | null
          id?: string
          order_id?: string | null
          seller_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "payouts_ledger_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          banned: boolean | null
          created_at: string
          display_name: string | null
          id: string
          phone: string | null
          rating_avg: number | null
          rating_count: number | null
          stripe_customer_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          banned?: boolean | null
          created_at?: string
          display_name?: string | null
          id?: string
          phone?: string | null
          rating_avg?: number | null
          rating_count?: number | null
          stripe_customer_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          banned?: boolean | null
          created_at?: string
          display_name?: string | null
          id?: string
          phone?: string | null
          rating_avg?: number | null
          rating_count?: number | null
          stripe_customer_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      shipments: {
        Row: {
          carrier: Database["public"]["Enums"]["carrier_type"]
          cost_clp: number | null
          created_at: string
          direction: Database["public"]["Enums"]["shipment_direction"]
          id: string
          label_url: string | null
          metadata: Json | null
          order_id: string
          status: Database["public"]["Enums"]["shipment_status"]
          tracking_number: string | null
          updated_at: string
        }
        Insert: {
          carrier: Database["public"]["Enums"]["carrier_type"]
          cost_clp?: number | null
          created_at?: string
          direction: Database["public"]["Enums"]["shipment_direction"]
          id?: string
          label_url?: string | null
          metadata?: Json | null
          order_id: string
          status?: Database["public"]["Enums"]["shipment_status"]
          tracking_number?: string | null
          updated_at?: string
        }
        Update: {
          carrier?: Database["public"]["Enums"]["carrier_type"]
          cost_clp?: number | null
          created_at?: string
          direction?: Database["public"]["Enums"]["shipment_direction"]
          id?: string
          label_url?: string | null
          metadata?: Json | null
          order_id?: string
          status?: Database["public"]["Enums"]["shipment_status"]
          tracking_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shipments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      strikes: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          reason: string
          seller_id: string
          severity: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          reason: string
          seller_id: string
          severity?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          reason?: string
          seller_id?: string
          severity?: number
        }
        Relationships: []
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
      verification_photos: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          report_id: string
          url: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          report_id: string
          url: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          report_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "verification_photos_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "verification_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_reports: {
        Row: {
          condition_grade:
            | Database["public"]["Enums"]["listing_condition"]
            | null
          created_at: string
          id: string
          inspector_id: string | null
          mismatch_flags: string[] | null
          notes: string | null
          order_id: string
          updated_at: string
          verdict: Database["public"]["Enums"]["verification_verdict"]
        }
        Insert: {
          condition_grade?:
            | Database["public"]["Enums"]["listing_condition"]
            | null
          created_at?: string
          id?: string
          inspector_id?: string | null
          mismatch_flags?: string[] | null
          notes?: string | null
          order_id: string
          updated_at?: string
          verdict: Database["public"]["Enums"]["verification_verdict"]
        }
        Update: {
          condition_grade?:
            | Database["public"]["Enums"]["listing_condition"]
            | null
          created_at?: string
          id?: string
          inspector_id?: string | null
          mismatch_flags?: string[] | null
          notes?: string | null
          order_id?: string
          updated_at?: string
          verdict?: Database["public"]["Enums"]["verification_verdict"]
        }
        Relationships: [
          {
            foreignKeyName: "verification_reports_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_support_or_admin: { Args: { _user_id: string }; Returns: boolean }
      is_warehouse_or_admin: { Args: { _user_id: string }; Returns: boolean }
      is_warehouse_status: {
        Args: { _s: Database["public"]["Enums"]["order_status"] }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "buyer" | "seller" | "warehouse" | "admin" | "support"
      brand_risk: "low" | "medium" | "high"
      carrier_type: "chilexpress" | "correoschile" | "starken"
      dispute_reason:
        | "not_as_described"
        | "suspected_fake"
        | "damaged_in_transit"
        | "other"
      dispute_status:
        | "open"
        | "under_review"
        | "resolved_refund"
        | "resolved_denied"
        | "cancelled"
      listing_condition:
        | "new_with_tags"
        | "like_new"
        | "very_good"
        | "good"
        | "fair"
      listing_status:
        | "draft"
        | "published"
        | "flagged_for_review"
        | "sold"
        | "removed"
      order_status:
        | "pending_payment"
        | "payment_authorized"
        | "awaiting_seller_shipment"
        | "in_transit_to_warehouse"
        | "received_at_warehouse"
        | "in_verification"
        | "buyer_decision_required"
        | "verification_approved"
        | "verification_rejected"
        | "awaiting_outbound_shipment"
        | "in_transit_to_buyer"
        | "delivered"
        | "completed"
        | "disputed"
        | "refunded"
        | "cancelled"
      payment_status:
        | "none"
        | "authorized"
        | "captured"
        | "refunded"
        | "cancelled"
        | "failed"
      shipment_direction: "inbound" | "outbound"
      shipment_status:
        | "label_created"
        | "in_transit"
        | "delivered"
        | "failed"
        | "cancelled"
      verification_verdict: "pass" | "fail" | "uncertain"
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
      app_role: ["buyer", "seller", "warehouse", "admin", "support"],
      brand_risk: ["low", "medium", "high"],
      carrier_type: ["chilexpress", "correoschile", "starken"],
      dispute_reason: [
        "not_as_described",
        "suspected_fake",
        "damaged_in_transit",
        "other",
      ],
      dispute_status: [
        "open",
        "under_review",
        "resolved_refund",
        "resolved_denied",
        "cancelled",
      ],
      listing_condition: [
        "new_with_tags",
        "like_new",
        "very_good",
        "good",
        "fair",
      ],
      listing_status: [
        "draft",
        "published",
        "flagged_for_review",
        "sold",
        "removed",
      ],
      order_status: [
        "pending_payment",
        "payment_authorized",
        "awaiting_seller_shipment",
        "in_transit_to_warehouse",
        "received_at_warehouse",
        "in_verification",
        "buyer_decision_required",
        "verification_approved",
        "verification_rejected",
        "awaiting_outbound_shipment",
        "in_transit_to_buyer",
        "delivered",
        "completed",
        "disputed",
        "refunded",
        "cancelled",
      ],
      payment_status: [
        "none",
        "authorized",
        "captured",
        "refunded",
        "cancelled",
        "failed",
      ],
      shipment_direction: ["inbound", "outbound"],
      shipment_status: [
        "label_created",
        "in_transit",
        "delivered",
        "failed",
        "cancelled",
      ],
      verification_verdict: ["pass", "fail", "uncertain"],
    },
  },
} as const
