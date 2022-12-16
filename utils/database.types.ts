export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          user_id: string | null
          created_at: string | null
          video_key: string | null
          srt_key: string | null
          config: Json | null
          transcription_id: string | null
          transcription: Json | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          created_at?: string | null
          video_key?: string | null
          srt_key?: string | null
          config?: Json | null
          transcription_id?: string | null
          transcription?: Json | null
        }
        Update: {
          id?: string
          user_id?: string | null
          created_at?: string | null
          video_key?: string | null
          srt_key?: string | null
          config?: Json | null
          transcription_id?: string | null
          transcription?: Json | null
        }
      }
      users: {
        Row: {
          id: string
          updated_at: string | null
          username: string | null
          full_name: string | null
          avatar_url: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
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
      [_ in never]: never
    }
  }
}
