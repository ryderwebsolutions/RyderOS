import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { ClientStatusBadge, PaymentStatusBadge } from '@/components/clients/client-status-badge'

export default async function ClientsPage() {
  const supabase = await createClient()

  const { data: member } = await supabase
    .from('organization_members')
    .select('organization_id')
    .limit(1)
    .single()

  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .eq('organization_id', member?.organization_id ?? '')
    .order('name')

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Clients</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {clients?.length ?? 0} client{clients?.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/clients/new">
          <Button>Add client</Button>
        </Link>
      </div>

      {!clients?.length ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg font-medium">No clients yet</p>
          <p className="text-sm mt-1">Add your first client to get started.</p>
          <Link href="/clients/new" className="mt-4 inline-block">
            <Button>Add client</Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Client</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Service</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Retainer</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Payment</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/clients/${client.id}`} className="font-medium hover:underline">
                      {client.name}
                    </Link>
                    {client.domain && (
                      <p className="text-xs text-muted-foreground">{client.domain}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                    {client.service_type ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                    {client.retainer_amount ? `€${client.retainer_amount}/mo` : '—'}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <PaymentStatusBadge status={client.payment_status} />
                  </td>
                  <td className="px-4 py-3">
                    <ClientStatusBadge status={client.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
