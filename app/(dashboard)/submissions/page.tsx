import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { SubmissionBadge } from '@/components/submissions/submission-badge'
import { SUBMISSION_STATUSES } from '@/types/database'

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const { data: member } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user!.id)
    .single()

  let query = supabase
    .from('form_submissions')
    .select('*')
    .eq('organization_id', member!.organization_id)
    .order('created_at', { ascending: false })

  if (status && SUBMISSION_STATUSES.includes(status as typeof SUBMISSION_STATUSES[number])) {
    query = query.eq('status', status)
  }

  const { data: submissions } = await query

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Enquiry Submissions</h1>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2">
        {(['', ...SUBMISSION_STATUSES] as const).map((s) => (
          <Link
            key={s}
            href={s ? `?status=${s}` : '/submissions'}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              (status ?? '') === s
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-accent'
            }`}
          >
            {s === '' ? 'All' : s}
          </Link>
        ))}
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Phone</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Received</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {!submissions?.length && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No submissions yet.
                </td>
              </tr>
            )}
            {submissions?.map((sub) => (
              <tr key={sub.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <Link href={`/submissions/${sub.id}`} className="font-medium hover:underline">
                    {sub.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{sub.email ?? '—'}</td>
                <td className="px-4 py-3 text-muted-foreground">{sub.phone ?? '—'}</td>
                <td className="px-4 py-3">
                  <SubmissionBadge status={sub.status} />
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {sub.created_at ? timeAgo(sub.created_at) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
