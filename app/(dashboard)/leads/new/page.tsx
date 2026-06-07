import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createLead } from '@/actions/leads'
import { LeadForm } from '@/components/leads/lead-form'

export const metadata = { title: 'New Lead — RyderOS' }

export default async function NewLeadPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: member } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .limit(1)
    .single()

  if (!member) redirect('/login')

  const { data: rawContacts } = await supabase
    .from('contacts')
    .select('id, first_name, last_name')
    .eq('organization_id', member.organization_id)
    .is('archived_at', null)
    .order('first_name')

  const contacts = (rawContacts ?? []).map((c) => ({
    id: c.id,
    name: [c.first_name, c.last_name].filter(Boolean).join(' '),
  }))

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link href="/leads" className="text-sm text-muted-foreground hover:text-foreground">
          ← Leads
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">Add lead</h1>
      </div>

      <div className="rounded-xl border border-border p-6">
        <LeadForm action={createLead} contacts={contacts} submitLabel="Create lead" />
      </div>
    </div>
  )
}
