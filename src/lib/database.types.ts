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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          headline: string
          phone: string
          location: string
          linkedin_url: string
          github_url: string
          portfolio_url: string
          ai_summary: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          headline?: string
          phone?: string
          location?: string
          linkedin_url?: string
          github_url?: string
          portfolio_url?: string
          ai_summary?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          headline?: string
          phone?: string
          location?: string
          linkedin_url?: string
          github_url?: string
          portfolio_url?: string
          ai_summary?: string
          created_at?: string
          updated_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          user_id: string
          type: 'education' | 'internship' | 'project' | 'course' | 'hackathon' | 'certification'
          title: string
          organization: string
          description: string
          start_date: string | null
          end_date: string | null
          location: string
          skills: string[]
          verification_status: 'verified' | 'pending' | 'unverified'
          verification_source: string
          external_id: string
          metadata: Json
          is_visible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'education' | 'internship' | 'project' | 'course' | 'hackathon' | 'certification'
          title: string
          organization: string
          description?: string
          start_date?: string | null
          end_date?: string | null
          location?: string
          skills?: string[]
          verification_status?: 'verified' | 'pending' | 'unverified'
          verification_source?: string
          external_id?: string
          metadata?: Json
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'education' | 'internship' | 'project' | 'course' | 'hackathon' | 'certification'
          title?: string
          organization?: string
          description?: string
          start_date?: string | null
          end_date?: string | null
          location?: string
          skills?: string[]
          verification_status?: 'verified' | 'pending' | 'unverified'
          verification_source?: string
          external_id?: string
          metadata?: Json
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      skills: {
        Row: {
          id: string
          user_id: string
          name: string
          category: 'technical' | 'soft' | 'language' | 'tool'
          proficiency: number
          endorsement_count: number
          source_achievements: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          category?: 'technical' | 'soft' | 'language' | 'tool'
          proficiency?: number
          endorsement_count?: number
          source_achievements?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          category?: 'technical' | 'soft' | 'language' | 'tool'
          proficiency?: number
          endorsement_count?: number
          source_achievements?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      integration_connections: {
        Row: {
          id: string
          user_id: string
          platform: string
          platform_user_id: string
          access_token: string
          refresh_token: string
          token_expires_at: string | null
          is_active: boolean
          last_sync_at: string | null
          sync_frequency: 'realtime' | 'daily' | 'weekly' | 'manual'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          platform: string
          platform_user_id?: string
          access_token?: string
          refresh_token?: string
          token_expires_at?: string | null
          is_active?: boolean
          last_sync_at?: string | null
          sync_frequency?: 'realtime' | 'daily' | 'weekly' | 'manual'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          platform?: string
          platform_user_id?: string
          access_token?: string
          refresh_token?: string
          token_expires_at?: string | null
          is_active?: boolean
          last_sync_at?: string | null
          sync_frequency?: 'realtime' | 'daily' | 'weekly' | 'manual'
          created_at?: string
          updated_at?: string
        }
      }
      resume_templates: {
        Row: {
          id: string
          user_id: string
          name: string
          layout: 'modern' | 'classic' | 'minimal' | 'technical'
          sections_order: string[]
          color_scheme: Json
          font_settings: Json
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          layout?: 'modern' | 'classic' | 'minimal' | 'technical'
          sections_order?: string[]
          color_scheme?: Json
          font_settings?: Json
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          layout?: 'modern' | 'classic' | 'minimal' | 'technical'
          sections_order?: string[]
          color_scheme?: Json
          font_settings?: Json
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      sync_logs: {
        Row: {
          id: string
          user_id: string
          platform: string
          sync_status: 'success' | 'partial' | 'failed'
          items_synced: number
          error_message: string
          sync_duration_ms: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          platform: string
          sync_status?: 'success' | 'partial' | 'failed'
          items_synced?: number
          error_message?: string
          sync_duration_ms?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          platform?: string
          sync_status?: 'success' | 'partial' | 'failed'
          items_synced?: number
          error_message?: string
          sync_duration_ms?: number
          created_at?: string
        }
      }
    }
  }
}
