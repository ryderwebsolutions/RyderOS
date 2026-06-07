import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { updateWebsite } from '@/actions/websites'
import { WebsiteForm } from '@/components/websites/website-form'
import { WebsiteChecklist } from '@/components/websites/website-checklist'
import { RevisionTracker } from '@/components/websites/revision-tracker'
import { WebsiteStatusBadge } from '@/components/websites/website-status-badge'

export const metadata = { title: 'Website — RyderOS' }

interface Props {
  params: Promise<{ id: string }>
}

export default async function WebsiteDetailPage({ params }: Props) {
  const { id } = await params

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

  const [websiteResult, checklistResult, revisionsResult, clientsResult] = await Promise.all([
    supabase.from('websites').select('*').eq('id', id).eq('organization_id', member.organization_id).single(),
    supabase.from('website_checklist_items').select('*').eq('website_id', id).order('sort_order'),
    supabase.from('website_revisions').select('*').eq('website_id', id).order('created_at', { ascending: false }),
    supabase.from('clients').select('id, name').eq('organization_id', member.organization_id).order('name'),
  ])

  if (websiteResult.error || !websiteResult.data) notFound()

  const website = websiteResult.data
  const checklist = checklistResult.data ?? []
  const revisions = revisionsResult.data ?? []
  const clients = clientsResult.data ?? []

  async function handleUpdate(formData: FormData) {
    'use server'
    await updateWebsite(id, formData)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/websites" className="text-sm text-muted-foreground hover:text-foreground">
          ← Websites
        </Link>
        <div className="mt-2 flex items-center gap-3">
          <h1 className="text-2xl font-semibold">{website.name}</h1>
          <WebsiteStatusBadge status={website.status} />
        </div>
        {website.domain && (
          <a
            href={`https://${website.domain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:underline"
          >
            {website.domain} ↗
          </a>
        )}
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Edit form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-xl border border-border p-5">
            <h2 className="text-sm font-semibold mb-4">Details</h2>
            <WebsiteForm action={handleUpdate} website={website} clients={clients} submitLabel="Save changes" />
          </div>
        </div>

        {/* Middle: Checklists */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-xl border border-border p-5">
            <h2 className="text-sm font-semibold mb-4">Assets checklist</h2>
            {checklist.filter((i) => i.category === 'assets').length > 0 ? (
              <WebsiteChecklist items={checklist} websiteId={id} category="assets" title="Assets" />
            ) : (
              <p className="text-sm text-muted-foreground">No asset items.</p>
            )}
          </div>
          <div className="rounded-xl border border-border p-5">
            <h2 className="text-sm font-semibold mb-4">Launch checklist</h2>
            {checklist.filter((i) => i.category === 'launch').length > 0 ? (
              <WebsiteChecklist items={checklist} websiteId={id} category="launch" title="Launch" />
            ) : (
              <p className="text-sm text-muted-foreground">No launch items.</p>
            )}
          </div>
        </div>

        {/* Right: Revision tracker */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-border p-5">
            <h2 className="text-sm font-semibold mb-4">Revisions</h2>
            <RevisionTracker revisions={revisions} websiteId={id} />
          </div>
        </div>
      </div>
    </div>
  )
}
