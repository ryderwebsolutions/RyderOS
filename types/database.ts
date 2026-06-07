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
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          full_name?: string | null
          avatar_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      organization_members: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          role: 'owner' | 'admin' | 'member'
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          role?: 'owner' | 'admin' | 'member'
          created_at?: string
        }
        Update: {
          role?: 'owner' | 'admin' | 'member'
        }
        Relationships: []
      }
      contacts: {
        Row: {
          id: string
          organization_id: string
          client_id: string | null
          first_name: string
          last_name: string | null
          email: string | null
          phone: string | null
          company_name: string | null
          website_url: string | null
          source: string | null
          status: string
          notes: string | null
          archived_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          client_id?: string | null
          first_name: string
          last_name?: string | null
          email?: string | null
          phone?: string | null
          company_name?: string | null
          website_url?: string | null
          source?: string | null
          status?: string
          notes?: string | null
          archived_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          first_name?: string
          last_name?: string | null
          email?: string | null
          phone?: string | null
          company_name?: string | null
          website_url?: string | null
          source?: string | null
          status?: string
          notes?: string | null
          archived_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      contact_notes: {
        Row: {
          id: string
          organization_id: string
          contact_id: string
          author_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          contact_id: string
          author_id: string
          content: string
          created_at?: string
        }
        Update: {
          content?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          id: string
          organization_id: string
          name: string
          status: string
          service_type: string | null
          domain: string | null
          website_url: string | null
          google_business_profile_status: string
          payment_status: string
          retainer_status: string
          retainer_amount: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          status?: string
          service_type?: string | null
          domain?: string | null
          website_url?: string | null
          google_business_profile_status?: string
          payment_status?: string
          retainer_status?: string
          retainer_amount?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          status?: string
          service_type?: string | null
          domain?: string | null
          website_url?: string | null
          google_business_profile_status?: string
          payment_status?: string
          retainer_status?: string
          retainer_amount?: number | null
          notes?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      client_checklist_items: {
        Row: {
          id: string
          organization_id: string
          client_id: string
          label: string
          completed: boolean
          completed_at: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          client_id: string
          label: string
          completed?: boolean
          completed_at?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          label?: string
          completed?: boolean
          completed_at?: string | null
          sort_order?: number
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      member_role: 'owner' | 'admin' | 'member'
    }
  }
}

export type Contact = Database['public']['Tables']['contacts']['Row']
export type ContactInsert = Database['public']['Tables']['contacts']['Insert']
export type ContactUpdate = Database['public']['Tables']['contacts']['Update']

export type ContactNote = Database['public']['Tables']['contact_notes']['Row']

export type Client = Database['public']['Tables']['clients']['Row']
export type ClientInsert = Database['public']['Tables']['clients']['Insert']
export type ClientUpdate = Database['public']['Tables']['clients']['Update']

export type ClientChecklistItem = Database['public']['Tables']['client_checklist_items']['Row']

export const CONTACT_STATUSES = ['lead', 'prospect', 'client', 'inactive'] as const
export type ContactStatus = typeof CONTACT_STATUSES[number]

export const CONTACT_SOURCES = ['website', 'referral', 'social', 'cold outreach', 'other'] as const
export type ContactSource = typeof CONTACT_SOURCES[number]

export const CLIENT_STATUSES = ['active', 'inactive', 'paused'] as const
export const SERVICE_TYPES = ['Web Design', 'SEO', 'Social Media', 'Web Design + SEO', 'Full Service', 'Other'] as const
export const GBP_STATUSES = ['not_started', 'claimed', 'optimized'] as const
export const PAYMENT_STATUSES = ['current', 'overdue', 'paused', 'cancelled'] as const
export const RETAINER_STATUSES = ['active', 'inactive', 'paused'] as const

export const DEFAULT_ONBOARDING_CHECKLIST = [
  'Discovery call completed',
  'Contract signed',
  'Initial payment received',
  'Domain access granted',
  'Hosting setup complete',
  'Google account access granted',
  'Content & assets received',
  'Design approved',
  'Website launched',
  'Handover & training complete',
] as const
