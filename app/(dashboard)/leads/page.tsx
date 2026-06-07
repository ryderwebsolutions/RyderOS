import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { buttonVariants } from '@/components/ui/button'
import { KanbanBoard } from '@/components/leads/kanban-board'
import { LeadStageBadge } from '@/components/leads/lead-stage-badge'

export const metadata = { title: 'Leads — RyderOS' }

export default async function LeadsPage() {
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

  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .eq('organization_id', member.organization_id)
    .order('created_at', { ascending: false })

  const active = (leads ?? []).filter((l) => l.stage !== 'won' && l.stage !== 'lost')
  const won = (leads ?? []).filter((l) => l.stage === 'won')
  const lost = (leads ?? []).filter((l) => l.stage === 'lost')

  const wonValue = won.reduce((sum, l) => sum + (Number(l.value) || 0), 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Leads</h1>
          <p className="text-sm text-muted-foreground">
            {active.length} active · {won.length} won{wonValue > 0 ? ` (£${wonValue.toLocaleString()})` : ''} · {lost.length} lost
          </p>
        </div>
        <Link href="/leads/new" className={buttonVariants()}>Add lead</Link>
      </div>

      {/* Kanban board */}
      {active.length === 0 && won.length === 0 && lost.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground text-sm">No leads yet.</p>
          <Link href="/leads/new" className={`mt-4 inline-flex ${buttonVariants({ variant: 'outline' })}`}>
            Add your first lead
          </Link>
        </div>
      ) : (
        <>
          <KanbanBoard leads={active} />

          {/* Won / Lost rows */}
          {(won.length > 0 || lost.length > 0) && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Closed</h2>
              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-border">
                    {[...won, ...lost].map((lead) => (
                      <tr key={lead.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3">
                          <Link href={`/leads/${lead.id}`} className="font-medium hover:underline">
                            {lead.name}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <LeadStageBadge stage={lead.stage} />
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {lead.value ? `£${Number(lead.value).toLocaleString()}` : '—'}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">
                          {lead.lost_reason ?? ''}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">
                          {(lead.won_at ?? lead.lost_at)
                            ? new Date(lead.won_at ?? lead.lost_at ?? '').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                            : ''}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
