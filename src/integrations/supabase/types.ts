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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      disaster_alerts: {
        Row: {
          created_at: string
          descricao: string
          estacao: string
          estado: string
          id: string
          nivel: string
        }
        Insert: {
          created_at?: string
          descricao: string
          estacao: string
          estado: string
          id?: string
          nivel: string
        }
        Update: {
          created_at?: string
          descricao?: string
          estacao?: string
          estado?: string
          id?: string
          nivel?: string
        }
        Relationships: []
      }
      extreme_events: {
        Row: {
          ano: number
          created_at: string
          estacao: string
          estado: string
          id: string
          mes: number
          tipo: string
          valor: string
        }
        Insert: {
          ano: number
          created_at?: string
          estacao: string
          estado: string
          id?: string
          mes: number
          tipo: string
          valor: string
        }
        Update: {
          ano?: number
          created_at?: string
          estacao?: string
          estado?: string
          id?: string
          mes?: number
          tipo?: string
          valor?: string
        }
        Relationships: []
      }
      upload_history: {
        Row: {
          created_at: string
          data: string
          id: string
          nome: string
          registros: number
          tamanho: string
        }
        Insert: {
          created_at?: string
          data: string
          id?: string
          nome: string
          registros?: number
          tamanho: string
        }
        Update: {
          created_at?: string
          data?: string
          id?: string
          nome?: string
          registros?: number
          tamanho?: string
        }
        Relationships: []
      }
      weather_records: {
        Row: {
          altitude: number
          ano: number
          created_at: string
          estacao: string
          estado: string
          id: string
          latitude: number
          longitude: number
          mes: number
          precipitacao: number
          pressao: number
          situacao: string
          temperatura_media: number
          umidade: number
          vento_maximo: number
          vento_medio: number
        }
        Insert: {
          altitude: number
          ano: number
          created_at?: string
          estacao: string
          estado: string
          id?: string
          latitude: number
          longitude: number
          mes: number
          precipitacao: number
          pressao: number
          situacao?: string
          temperatura_media: number
          umidade: number
          vento_maximo: number
          vento_medio: number
        }
        Update: {
          altitude?: number
          ano?: number
          created_at?: string
          estacao?: string
          estado?: string
          id?: string
          latitude?: number
          longitude?: number
          mes?: number
          precipitacao?: number
          pressao?: number
          situacao?: string
          temperatura_media?: number
          umidade?: number
          vento_maximo?: number
          vento_medio?: number
        }
        Relationships: []
      }
      weather_stations: {
        Row: {
          altitude: number
          created_at: string
          estado: string
          id: string
          latitude: number
          longitude: number
          nome: string
          situacao: string
        }
        Insert: {
          altitude: number
          created_at?: string
          estado: string
          id?: string
          latitude: number
          longitude: number
          nome: string
          situacao?: string
        }
        Update: {
          altitude?: number
          created_at?: string
          estado?: string
          id?: string
          latitude?: number
          longitude?: number
          nome?: string
          situacao?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
