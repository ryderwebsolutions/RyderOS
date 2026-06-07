import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { updateClientAction } from '@/actions/clients'
import { ClientForm } from '@/components/clients/client-form'
import { ClientStatusBadge, PaymentStatusBadge } from '@/components/clients/client-status-badge'
import { Checklist } from '@/components/clients/checklist'
import { Button } from '@/components/ui/button'

interface Props {
  params: Promise<{ id: string }>
}

const GBP_LABELS: Record<string, string> = {
  not_started: 'Not started',
  claimed: 'Claimed',
  optimized: 'Optimized',
}

export default async function ClientPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: client }, { data: checklist }, { data: contacts }] = await Promise.all([
    supabase.from('clients').select('*').eq('id', id).single(),
    supabase.from('client_checklist_items').select('*').eq('client_id', id).order('sort_order'),
    supabase.from('contacts').select('id, first_name, last_name, email, status').eq('client_id', id),
  ])

  if (!client) notFound()

  const updateWithId = updateClientAction.bind(null, id)

  return (
    <div className="p-6 space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-semibold tracking-tight">{client.name}</h1>
            <ClientStatusBadge status={client.status} />
            <PaymentStatusBadge status={client.payment_status} />
          </div>
          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground flex-wrap">
            {client.service_type && <span>{client.service_type}</span>}
            {client.domain && <span>{client.domain}</span>}
            {client.retainer_amount && <span>€{client.retainer_amount}/mo</span>}
            {client.google_business_profile_status && (
              <span>GBP: {GBP_LABELS[client.google_business_profile_status]}</span>
            )}
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Link href="/clients">
            <Button variant="outline" size="sm">← Back</Button>
          </Link>
          {client.website_url && (
            <a href={client.website_url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">Visit site ↗</Button>
            </a>
          )}
        </div>
      </div>

      {/* Three section layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Edit form (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Details</h2>
          <ClientForm action={updateWithId} client={client} submitLabel="Save changes" />
        </div>

        {/* Right: Checklist + Contacts */}
        <div className="space-y-8">
          {/* Onboarding checklist */}
          <div className="space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Onboarding</h2>
            {checklist && checklist.length > 0 ? (
              <Checklist items={checklist} clientId={id} />
            ) : (
              <p className="text-sm text-muted-foreground">No checklist items.</p>
            )}
          </div>

          {/* Linked contacts */}
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Contacts</h2>
            {!contacts?.length ? (
              <p className="text-sm text-muted-foreground">No contacts linked.</p>
            ) : (
              <div className="space-y-2">
                {contacts.map((c) => (
                  <Link
                    key={c.id}
                    href={`/crm/${c.id}`}
                    className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium">{c.first_name} {c.last_name}</p>
                      {c.email && <p className="text-xs text-muted-foreground">{c.email}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
