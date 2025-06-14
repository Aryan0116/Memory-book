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
      answers: {
        Row: {
          answer_number: number | null
          answer_text: string | null
          created_at: string
          file_url: string | null
          id: string
          question_id: string
          response_id: string
        }
        Insert: {
          answer_number?: number | null
          answer_text?: string | null
          created_at?: string
          file_url?: string | null
          id?: string
          question_id: string
          response_id: string
        }
        Update: {
          answer_number?: number | null
          answer_text?: string | null
          created_at?: string
          file_url?: string | null
          id?: string
          question_id?: string
          response_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answers_response_id_fkey"
            columns: ["response_id"]
            isOneToOne: false
            referencedRelation: "responses"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          created_at: string
          id: string
          options: string[] | null
          position: number
          question: string
          required: boolean
          slam_book_id: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          options?: string[] | null
          position: number
          question: string
          required?: boolean
          slam_book_id: string
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          options?: string[] | null
          position?: number
          question?: string
          required?: boolean
          slam_book_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_slam_book_id_fkey"
            columns: ["slam_book_id"]
            isOneToOne: false
            referencedRelation: "slam_books"
            referencedColumns: ["id"]
          },
        ]
      }
      responses: {
        Row: {
          created_at: string
          id: string
          respondent_name: string | null
          slam_book_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          respondent_name?: string | null
          slam_book_id: string
        }
        Update: {
          created_at?: string
          id?: string
          respondent_name?: string | null
          slam_book_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "responses_slam_book_id_fkey"
            columns: ["slam_book_id"]
            isOneToOne: false
            referencedRelation: "slam_books"
            referencedColumns: ["id"]
          },
        ]
      }
      slam_books: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          password: string | null
          slug: string
          theme: string
          title: string
          updated_at: string
          user_id: string | null
          view_count: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          password?: string | null
          slug: string
          theme?: string
          title: string
          updated_at?: string
          user_id?: string | null
          view_count?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          password?: string | null
          slug?: string
          theme?: string
          title?: string
          updated_at?: string
          user_id?: string | null
          view_count?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_unique_slug: {
        Args: Record<PropertyKey, never> | { title: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
