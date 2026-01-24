// Tipos do banco de dados MandaBem
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          cpf: string
          name: string
          created_at: string
        }
        Insert: {
          id: string
          email: string
          cpf: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          cpf?: string
          name?: string
          created_at?: string
        }
      }
      locations: {
        Row: {
          id: string
          name: string
          address: string
          city: string
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          city: string
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          city?: string
          active?: boolean
          created_at?: string
        }
      }
      challenges: {
        Row: {
          id: string
          location_id: string | null
          title: string
          description: string
          theme: string
          prize: number
          rules: Json
          starts_at: string
          ends_at: string
          status: 'draft' | 'active' | 'evaluating' | 'finished'
          created_at: string
        }
        Insert: {
          id?: string
          location_id?: string | null
          title: string
          description: string
          theme: string
          prize: number
          rules: Json
          starts_at: string
          ends_at: string
          status?: 'draft' | 'active' | 'evaluating' | 'finished'
          created_at?: string
        }
        Update: {
          id?: string
          location_id?: string | null
          title?: string
          description?: string
          theme?: string
          prize?: number
          rules?: Json
          starts_at?: string
          ends_at?: string
          status?: 'draft' | 'active' | 'evaluating' | 'finished'
          created_at?: string
        }
      }
      submissions: {
        Row: {
          id: string
          challenge_id: string
          user_id: string
          content_type: 'photo' | 'text'
          content_url: string | null
          content_text: string | null
          payment_amount: number
          attempt_number: number
          score_final: number | null
          status: 'pending_payment' | 'paid' | 'evaluating' | 'evaluated'
          payment_id: string | null
          created_at: string
          evaluated_at: string | null
        }
        Insert: {
          id?: string
          challenge_id: string
          user_id: string
          content_type: 'photo' | 'text'
          content_url?: string | null
          content_text?: string | null
          payment_amount: number
          attempt_number?: number
          score_final?: number | null
          status?: 'pending_payment' | 'paid' | 'evaluating' | 'evaluated'
          payment_id?: string | null
          created_at?: string
          evaluated_at?: string | null
        }
        Update: {
          id?: string
          challenge_id?: string
          user_id?: string
          content_type?: 'photo' | 'text'
          content_url?: string | null
          content_text?: string | null
          payment_amount?: number
          attempt_number?: number
          score_final?: number | null
          status?: 'pending_payment' | 'paid' | 'evaluating' | 'evaluated'
          payment_id?: string | null
          created_at?: string
          evaluated_at?: string | null
        }
      }
      judges: {
        Row: {
          id: string
          user_id: string
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          active?: boolean
          created_at?: string
        }
      }
      evaluations: {
        Row: {
          id: string
          submission_id: string
          judge_id: string
          strategy: number
          engagement: number
          adequacy: number
          execution: number
          creativity: number
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          submission_id: string
          judge_id: string
          strategy: number
          engagement: number
          adequacy: number
          execution: number
          creativity: number
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          submission_id?: string
          judge_id?: string
          strategy?: number
          engagement?: number
          adequacy?: number
          execution?: number
          creativity?: number
          notes?: string | null
          created_at?: string
        }
      }
    }
  }
}
