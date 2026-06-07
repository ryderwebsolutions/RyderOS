import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createWebsite } from '@/actions/websites'
import { WebsiteForm } from '@/components/websites/website-form'

export const metadata = { title: 'New Website — RyderOS' }

export default async function NewWebsitePage() {
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

  const { data: rawClients } = await supabase
    .from('clients')
    .select('id, name')
    .eq('organization_id', member.organization_id)
    .eq('status', 'active')
    .order('name')

  const clients = rawClients ?? []

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div>
        <Link href="/websites" className="text-sm text-muted-foreground hover:text-foreground">
          ← Websites
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">Add website</h1>
      </div>
      <div className="rounded-xl border border-border p-6">
        <WebsiteForm action={createWebsite} clients={clients} submitLabel="Create website" />
      </div>
    </div>
  )
}
