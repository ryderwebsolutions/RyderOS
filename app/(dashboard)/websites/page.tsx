import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { buttonVariants } from '@/components/ui/button'
import { WebsiteStatusBadge } from '@/components/websites/website-status-badge'

export const metadata = { title: 'Websites — RyderOS' }

export default async function WebsitesPage() {
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

  const { data: websites } = await supabase
    .from('websites')
    .select('*')
    .eq('organization_id', member.organization_id)
    .order('created_at', { ascending: false })

  const { data: clients } = await supabase
    .from('clients')
    .select('id, name')
    .eq('organization_id', member.organization_id)
    .order('name')

  const clientMap = Object.fromEntries((clients ?? []).map((c) => [c.id, c.name]))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Websites</h1>
          <p className="text-sm text-muted-foreground">{websites?.length ?? 0} project{websites?.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/websites/new" className={buttonVariants()}>Add website</Link>
      </div>

      {(!websites || websites.length === 0) ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground text-sm">No websites yet.</p>
          <Link href="/websites/new" className={`mt-4 ${buttonVariants({ variant: 'outline' })}`}>Add your first website</Link>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Project</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Domain</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Client</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Launch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {websites.map((w) => (
                <tr key={w.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/websites/${w.id}`} className="font-medium hover:underline">
                      {w.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {w.domain ? (
                      <a href={`https://${w.domain}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {w.domain}
                      </a>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {w.client_id ? clientMap[w.client_id] ?? '—' : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <WebsiteStatusBadge status={w.status} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {w.launch_date ? new Date(w.launch_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
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
