import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { SubmissionBadge } from '@/components/submissions/submission-badge'
import { markReviewed, convertToLead, deleteSubmission } from '@/actions/submissions'

export default async function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: sub } = await supabase
    .from('form_submissions')
    .select('*')
    .eq('id', id)
    .single()

  if (!sub) notFound()

  const submitted = sub.created_at
    ? new Date(sub.created_at).toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' })
    : '—'

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/submissions" className="text-sm text-muted-foreground hover:underline">
          ← Submissions
        </Link>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{sub.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">{submitted}</p>
        </div>
        <SubmissionBadge status={sub.status} />
      </div>

      <div className="rounded-lg border border-border p-4 space-y-3 text-sm">
        <Row label="Email" value={sub.email} />
        <Row label="Phone" value={sub.phone} />
        <Row label="Source URL" value={sub.source_url} />
        {sub.message && (
          <div>
            <span className="font-medium text-muted-foreground">Message</span>
            <p className="mt-1 whitespace-pre-wrap">{sub.message}</p>
          </div>
        )}
        {sub.converted_to_lead_id && (
          <div>
            <span className="font-medium text-muted-foreground">Converted lead</span>
            <Link
              href={`/leads/${sub.converted_to_lead_id}`}
              className="ml-2 text-primary hover:underline"
            >
              View lead →
            </Link>
          </div>
        )}
      </div>

      {sub.status !== 'converted' && (
        <div className="flex flex-wrap gap-3">
          {sub.status === 'new' && (
            <form action={markReviewed.bind(null, id)}>
              <button
                type="submit"
                className="px-4 py-2 rounded-md border border-border text-sm font-medium hover:bg-muted transition-colors"
              >
                Mark as reviewed
              </button>
            </form>
          )}
          <form action={convertToLead.bind(null, id)}>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Convert to lead
            </button>
          </form>
        </div>
      )}

      <div className="border-t border-border pt-4">
        <form
          action={async () => {
            'use server'
            await deleteSubmission(id)
          }}
        >
          <button
            type="submit"
            className="px-3 py-1.5 rounded-md border border-red-200 text-red-600 text-sm hover:bg-red-50 transition-colors"
          >
            Delete submission
          </button>
        </form>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null
  return (
    <div className="flex gap-4">
      <span className="font-medium text-muted-foreground w-24 shrink-0">{label}</span>
      <span>{value}</span>
    </div>
  )
}
