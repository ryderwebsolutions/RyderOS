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
      websites: {
        Row: {
          id: string
          organization_id: string
          client_id: string | null
          name: string
          domain: string | null
          hosting_provider: string | null
          email_provider: string | null
          status: string
          launch_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          client_id?: string | null
          name: string
          domain?: string | null
          hosting_provider?: string | null
          email_provider?: string | null
          status?: string
          launch_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          name?: string
          domain?: string | null
          hosting_provider?: string | null
          email_provider?: string | null
          status?: string
          launch_date?: string | null
          notes?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      website_checklist_items: {
        Row: {
          id: string
          organization_id: string
          website_id: string
          category: string
          label: string
          completed: boolean
          completed_at: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          website_id: string
          category?: string
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
      website_revisions: {
        Row: {
          id: string
          organization_id: string
          website_id: string
          description: string
          status: string
          priority: string
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          organization_id: string
          website_id: string
          description: string
          status?: string
          priority?: string
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          description?: string
          status?: string
          priority?: string
          completed_at?: string | null
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

export type Website = Database['public']['Tables']['websites']['Row']
export type WebsiteInsert = Database['public']['Tables']['websites']['Insert']
export type WebsiteUpdate = Database['public']['Tables']['websites']['Update']
export type WebsiteChecklistItem = Database['public']['Tables']['website_checklist_items']['Row']
export type WebsiteRevision = Database['public']['Tables']['website_revisions']['Row']

export const WEBSITE_STATUSES = ['not_started', 'in_progress', 'review', 'live', 'maintenance'] as const
export type WebsiteStatus = typeof WEBSITE_STATUSES[number]

export const HOSTING_PROVIDERS = ['SiteGround', 'Cloudflare Pages', 'Vercel', 'WP Engine', 'Kinsta', 'GoDaddy', 'Other'] as const
export const EMAIL_PROVIDERS = ['Google Workspace', 'Microsoft 365', 'Zoho Mail', 'GoDaddy Email', 'Other'] as const
export const REVISION_STATUSES = ['requested', 'in_progress', 'completed'] as const
export const REVISION_PRIORITIES = ['low', 'medium', 'high'] as const

export const DEFAULT_LAUNCH_CHECKLIST = [
  'Domain purchased & registered',
  'Domain pointed to hosting',
  'Hosting account configured',
  'SSL certificate active',
  'DNS records correct',
  'Business email setup complete',
  'Website design completed',
  'All content added',
  'Contact form tested & working',
  'Google Analytics connected',
  'Google Search Console verified',
  'Google Business Profile linked',
  'Client review & approval received',
  'Website launched',
] as const

export const DEFAULT_ASSET_CHECKLIST = [
  'Logo files received (PNG + SVG)',
  'Brand colours & fonts provided',
  'Business description written',
  'Photos & images received',
  'Service/product descriptions provided',
  'Testimonials received',
  'Social media links provided',
  'Google account access granted',
  'Domain/hosting login details shared',
] as const

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
