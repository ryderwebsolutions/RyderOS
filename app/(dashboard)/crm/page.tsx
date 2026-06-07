import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StatusBadge } from '@/components/crm/status-badge'

interface Props {
  searchParams: Promise<{ search?: string; status?: string }>
}

export default async function CRMPage({ searchParams }: Props) {
  const { search, status } = await searchParams
  const supabase = await createClient()

  const { data: member } = await supabase
    .from('organization_members')
    .select('organization_id')
    .limit(1)
    .single()

  let query = supabase
    .from('contacts')
    .select('*')
    .eq('organization_id', member?.organization_id ?? '')
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)
  if (search) {
    query = query.or(
      `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,company_name.ilike.%${search}%`
    )
  }

  const { data: contacts } = await query

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Contacts</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {contacts?.length ?? 0} contact{contacts?.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/crm/new">
          <Button>Add contact</Button>
        </Link>
      </div>

      <div className="flex gap-3 flex-wrap">
        <form method="GET" className="flex gap-2 flex-1 min-w-0">
          <Input
            name="search"
            placeholder="Search name, email, company…"
            defaultValue={search ?? ''}
            className="max-w-sm"
          />
          {status && <input type="hidden" name="status" value={status} />}
          <Button type="submit" variant="outline">Search</Button>
          {(search || status) && (
            <Link href="/crm">
              <Button type="button" variant="ghost">Clear</Button>
            </Link>
          )}
        </form>

        <div className="flex gap-2">
          {['lead', 'prospect', 'client', 'inactive'].map((s) => (
            <Link key={s} href={status === s ? '/crm' : `/crm?status=${s}${search ? `&search=${search}` : ''}`}>
              <Button
                variant={status === s ? 'default' : 'outline'}
                size="sm"
                className="capitalize"
              >
                {s}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {!contacts?.length ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg font-medium">No contacts yet</p>
          <p className="text-sm mt-1">Add your first contact to get started.</p>
          <Link href="/crm/new" className="mt-4 inline-block">
            <Button>Add contact</Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Company</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Phone</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr
                  key={contact.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link href={`/crm/${contact.id}`} className="font-medium hover:underline">
                      {contact.first_name} {contact.last_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                    {contact.company_name ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                    {contact.email ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                    {contact.phone ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={contact.status} />
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
