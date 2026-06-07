'use client'

import Link from 'next/link'
import { useTransition } from 'react'
import { moveLeadStage } from '@/actions/leads'
import { LeadStageBadge } from '@/components/leads/lead-stage-badge'
import type { Lead } from '@/types/database'

const PIPELINE_STAGES = [
  { key: 'new',       label: 'New' },
  { key: 'contacted', label: 'Contacted' },
  { key: 'qualified', label: 'Qualified' },
  { key: 'quoted',    label: 'Quoted' },
]

const NEXT_STAGE: Record<string, string> = {
  new:       'contacted',
  contacted: 'qualified',
  qualified: 'quoted',
  quoted:    'won',
}

const PREV_STAGE: Record<string, string> = {
  contacted: 'new',
  qualified: 'contacted',
  quoted:    'qualified',
}

function daysAgo(dateStr: string) {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
  if (days === 0) return 'today'
  if (days === 1) return '1d'
  return `${days}d`
}

function LeadCard({ lead }: { lead: Lead }) {
  const [isPending, startTransition] = useTransition()

  const next = NEXT_STAGE[lead.stage]
  const prev = PREV_STAGE[lead.stage]

  function move(stage: string) {
    startTransition(() => moveLeadStage(lead.id, stage))
  }

  return (
    <div className={`rounded-lg border border-border bg-card p-3 space-y-2 transition-opacity ${isPending ? 'opacity-50' : ''}`}>
      <div className="flex items-start justify-between gap-1">
        <Link href={`/leads/${lead.id}`} className="text-sm font-medium hover:underline leading-snug">
          {lead.name}
        </Link>
        {lead.value && (
          <span className="text-xs text-muted-foreground shrink-0">£{Number(lead.value).toLocaleString()}</span>
        )}
      </div>
      {lead.source && (
        <p className="text-xs text-muted-foreground capitalize">{lead.source}</p>
      )}
      <p className="text-xs text-muted-foreground">{daysAgo(lead.created_at)}</p>
      <div className="flex items-center gap-1 pt-0.5">
        {prev && (
          <button
            onClick={() => move(prev)}
            disabled={isPending}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors px-1.5 py-0.5 rounded border border-border hover:bg-muted"
            title={`Move to ${prev}`}
          >
            ←
          </button>
        )}
        <div className="flex-1" />
        {next && (
          <button
            onClick={() => move(next)}
            disabled={isPending}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors px-1.5 py-0.5 rounded border border-border hover:bg-muted"
            title={next === 'won' ? 'Mark as won' : `Move to ${next}`}
          >
            {next === 'won' ? 'Won ✓' : '→'}
          </button>
        )}
      </div>
    </div>
  )
}

interface Props {
  leads: Lead[]
}

export function KanbanBoard({ leads }: Props) {
  const byStage = Object.fromEntries(
    PIPELINE_STAGES.map((s) => [s.key, leads.filter((l) => l.stage === s.key)])
  )

  const totalValue = leads
    .filter((l) => l.stage !== 'lost')
    .reduce((sum, l) => sum + (Number(l.value) || 0), 0)

  return (
    <div className="space-y-4">
      {totalValue > 0 && (
        <p className="text-sm text-muted-foreground">
          Pipeline value: <span className="font-medium text-foreground">£{totalValue.toLocaleString()}</span>
        </p>
      )}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {PIPELINE_STAGES.map((stage) => {
          const cards = byStage[stage.key] ?? []
          return (
            <div key={stage.key} className="space-y-2">
              <div className="flex items-center gap-2">
                <LeadStageBadge stage={stage.key} />
                <span className="text-xs text-muted-foreground">{cards.length}</span>
              </div>
              <div className="space-y-2 min-h-16">
                {cards.map((lead) => (
                  <LeadCard key={lead.id} lead={lead} />
                ))}
                {cards.length === 0 && (
                  <div className="rounded-lg border border-dashed border-border h-16" />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
