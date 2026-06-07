import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { updateLead, moveLeadStage, markLeadLost, deleteLead } from '@/actions/leads'
import { LeadForm } from '@/components/leads/lead-form'
import { LeadStageBadge } from '@/components/leads/lead-stage-badge'

export const metadata = { title: 'Lead — RyderOS' }

interface Props {
  params: Promise<{ id: string }>
}

const PIPELINE_STAGES = ['new', 'contacted', 'qualified', 'quoted'] as const

export default async function LeadDetailPage({ params }: Props) {
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

  const [leadResult, contactsResult] = await Promise.all([
    supabase.from('leads').select('*').eq('id', id).eq('organization_id', member.organization_id).single(),
    supabase.from('contacts').select('id, first_name, last_name').eq('organization_id', member.organization_id).is('archived_at', null).order('first_name'),
  ])

  if (leadResult.error || !leadResult.data) notFound()

  const lead = leadResult.data
  const contacts = (contactsResult.data ?? []).map((c) => ({
    id: c.id,
    name: [c.first_name, c.last_name].filter(Boolean).join(' '),
  }))

  async function handleUpdate(formData: FormData) {
    'use server'
    await updateLead(id, formData)
  }

  async function handleDelete() {
    'use server'
    await deleteLead(id)
  }

  const isActive = lead.stage !== 'won' && lead.stage !== 'lost'

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <Link href="/leads" className="text-sm text-muted-foreground hover:text-foreground">
          ← Leads
        </Link>
        <div className="mt-2 flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-semibold">{lead.name}</h1>
          <LeadStageBadge stage={lead.stage} />
          {lead.value && (
            <span className="text-sm text-muted-foreground">£{Number(lead.value).toLocaleString()}</span>
          )}
        </div>
      </div>

      {/* Stage progress — only for active leads */}
      {isActive && (
        <div className="rounded-xl border border-border p-5 space-y-3">
          <h2 className="text-sm font-semibold">Stage</h2>
          <div className="flex items-center gap-1 flex-wrap">
            {PIPELINE_STAGES.map((stage, i) => {
              const isCurrentOrPast = PIPELINE_STAGES.indexOf(lead.stage as typeof PIPELINE_STAGES[number]) >= i
              return (
                <form key={stage} action={moveLeadStage.bind(null, id, stage)}>
                  <button
                    type="submit"
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      lead.stage === stage
                        ? 'bg-primary text-primary-foreground'
                        : isCurrentOrPast
                        ? 'bg-primary/20 text-primary hover:bg-primary/30'
                        : 'bg-muted text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    {stage.charAt(0).toUpperCase() + stage.slice(1)}
                  </button>
                </form>
              )
            })}
          </div>

          {/* Won / Lost actions */}
          <div className="flex items-center gap-3 pt-1">
            <form action={moveLeadStage.bind(null, id, 'won')}>
              <button type="submit" className="text-sm font-medium text-green-700 hover:underline">
                Mark as won
              </button>
            </form>
            <span className="text-muted-foreground">·</span>
            <form action={markLeadLost.bind(null, id, '')} className="flex items-center gap-2">
              <button type="submit" className="text-sm text-red-600 hover:underline">
                Mark as lost
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Reopen if closed */}
      {!isActive && (
        <div className="rounded-xl border border-border p-5">
          <p className="text-sm text-muted-foreground mb-3">
            {lead.stage === 'won' ? 'Won' : 'Lost'}{lead.lost_reason ? ` — ${lead.lost_reason}` : ''}
          </p>
          <form action={moveLeadStage.bind(null, id, 'new')}>
            <button type="submit" className="text-sm hover:underline">
              Reopen lead
            </button>
          </form>
        </div>
      )}

      {/* Edit form */}
      <div className="rounded-xl border border-border p-6">
        <h2 className="text-sm font-semibold mb-4">Details</h2>
        <LeadForm
          action={handleUpdate}
          lead={lead}
          contacts={contacts}
          submitLabel="Save changes"
        />
      </div>

      {/* Delete */}
      <div className="rounded-xl border border-destructive/20 p-5">
        <p className="text-sm font-medium text-destructive mb-3">Danger zone</p>
        <form action={handleDelete}>
          <button
            type="submit"
            className="text-sm text-destructive hover:underline"
            onClick={(e) => { if (!confirm('Delete this lead?')) e.preventDefault() }}
          >
            Delete lead
          </button>
        </form>
      </div>
    </div>
  )
}
