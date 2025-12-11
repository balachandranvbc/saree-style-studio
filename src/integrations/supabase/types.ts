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
      draping_styles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          instructions: string | null
          is_active: boolean | null
          name: string
          preview_image_url: string | null
          region: string | null
          style: Database["public"]["Enums"]["draping_style"]
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          instructions?: string | null
          is_active?: boolean | null
          name: string
          preview_image_url?: string | null
          region?: string | null
          style: Database["public"]["Enums"]["draping_style"]
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          instructions?: string | null
          is_active?: boolean | null
          name?: string
          preview_image_url?: string | null
          region?: string | null
          style?: Database["public"]["Enums"]["draping_style"]
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          body_measurements: Json | null
          created_at: string
          display_name: string | null
          id: string
          preferred_draping_style:
            | Database["public"]["Enums"]["draping_style"]
            | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          body_measurements?: Json | null
          created_at?: string
          display_name?: string | null
          id?: string
          preferred_draping_style?:
            | Database["public"]["Enums"]["draping_style"]
            | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          body_measurements?: Json | null
          created_at?: string
          display_name?: string | null
          id?: string
          preferred_draping_style?:
            | Database["public"]["Enums"]["draping_style"]
            | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sarees: {
        Row: {
          border_style: string | null
          color: string
          created_at: string
          description: string | null
          fabric: Database["public"]["Enums"]["fabric_type"]
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          pattern: string | null
          price: number | null
          secondary_color: string | null
          texture_url: string | null
          updated_at: string
        }
        Insert: {
          border_style?: string | null
          color: string
          created_at?: string
          description?: string | null
          fabric?: Database["public"]["Enums"]["fabric_type"]
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          pattern?: string | null
          price?: number | null
          secondary_color?: string | null
          texture_url?: string | null
          updated_at?: string
        }
        Update: {
          border_style?: string | null
          color?: string
          created_at?: string
          description?: string | null
          fabric?: Database["public"]["Enums"]["fabric_type"]
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          pattern?: string | null
          price?: number | null
          secondary_color?: string | null
          texture_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      tryon_sessions: {
        Row: {
          body_analysis: Json | null
          border_style: string | null
          created_at: string
          draping_style: Database["public"]["Enums"]["draping_style"]
          error_message: string | null
          fabric: Database["public"]["Enums"]["fabric_type"] | null
          id: string
          original_image_url: string
          pallu_length: string | null
          pleat_style: string | null
          pose_data: Json | null
          processed_image_url: string | null
          processing_completed_at: string | null
          processing_started_at: string | null
          result_image_url: string | null
          saree_color: string | null
          saree_id: string | null
          session_token: string
          status: Database["public"]["Enums"]["processing_status"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          body_analysis?: Json | null
          border_style?: string | null
          created_at?: string
          draping_style?: Database["public"]["Enums"]["draping_style"]
          error_message?: string | null
          fabric?: Database["public"]["Enums"]["fabric_type"] | null
          id?: string
          original_image_url: string
          pallu_length?: string | null
          pleat_style?: string | null
          pose_data?: Json | null
          processed_image_url?: string | null
          processing_completed_at?: string | null
          processing_started_at?: string | null
          result_image_url?: string | null
          saree_color?: string | null
          saree_id?: string | null
          session_token?: string
          status?: Database["public"]["Enums"]["processing_status"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          body_analysis?: Json | null
          border_style?: string | null
          created_at?: string
          draping_style?: Database["public"]["Enums"]["draping_style"]
          error_message?: string | null
          fabric?: Database["public"]["Enums"]["fabric_type"] | null
          id?: string
          original_image_url?: string
          pallu_length?: string | null
          pleat_style?: string | null
          pose_data?: Json | null
          processed_image_url?: string | null
          processing_completed_at?: string | null
          processing_started_at?: string | null
          result_image_url?: string | null
          saree_color?: string | null
          saree_id?: string | null
          session_token?: string
          status?: Database["public"]["Enums"]["processing_status"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tryon_sessions_saree_id_fkey"
            columns: ["saree_id"]
            isOneToOne: false
            referencedRelation: "sarees"
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
      draping_style:
        | "bengali"
        | "gujarati"
        | "tamil_nadu"
        | "kerala"
        | "modern_lehenga"
        | "nivi"
        | "maharashtrian"
      fabric_type:
        | "silk"
        | "cotton"
        | "organza"
        | "georgette"
        | "chiffon"
        | "banarasi"
        | "kanjivaram"
        | "chanderi"
      processing_status:
        | "pending"
        | "analyzing"
        | "generating_avatar"
        | "draping"
        | "rendering"
        | "completed"
        | "failed"
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
      draping_style: [
        "bengali",
        "gujarati",
        "tamil_nadu",
        "kerala",
        "modern_lehenga",
        "nivi",
        "maharashtrian",
      ],
      fabric_type: [
        "silk",
        "cotton",
        "organza",
        "georgette",
        "chiffon",
        "banarasi",
        "kanjivaram",
        "chanderi",
      ],
      processing_status: [
        "pending",
        "analyzing",
        "generating_avatar",
        "draping",
        "rendering",
        "completed",
        "failed",
      ],
    },
  },
} as const
