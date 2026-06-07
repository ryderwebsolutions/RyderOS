'use client'

import { useTransition, useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { addRevision, updateRevisionStatus, deleteRevision } from '@/actions/websites'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { PriorityBadge } from '@/components/websites/website-status-badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { WebsiteRevision } from '@/types/database'

function AddButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? 'Adding…' : 'Add revision'}
    </Button>
  )
}

const STATUS_LABELS: Record<string, string> = {
  requested:   'Requested',
  in_progress: 'In progress',
  completed:   'Completed',
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export function RevisionTracker({ revisions, websiteId }: { revisions: WebsiteRevision[]; websiteId: string }) {
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  const open = revisions.filter((r) => r.status !== 'completed')
  const done = revisions.filter((r) => r.status === 'completed')

  async function handleAdd(formData: FormData) {
    await addRevision(websiteId, formData)
    formRef.current?.reset()
  }

  function handleStatus(revisionId: string, status: string) {
    startTransition(() => updateRevisionStatus(revisionId, websiteId, status))
  }

  function handleDelete(revisionId: string) {
    startTransition(() => deleteRevision(revisionId, websiteId))
  }

  return (
    <div className="space-y-4">
      {/* Add form */}
      <form ref={formRef} action={handleAdd} className="space-y-2">
        <Textarea name="description" placeholder="Describe the revision…" rows={2} required />
        <div className="flex items-center gap-2">
          <Select name="priority" defaultValue="medium">
            <SelectTrigger className="w-32 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {['low', 'medium', 'high'].map((p) => (
                <SelectItem key={p} value={p} className="text-xs">{p.charAt(0).toUpperCase() + p.slice(1)} priority</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <AddButton />
        </div>
      </form>

      {/* Open revisions */}
      {open.length > 0 && (
        <div className="space-y-2">
          {open.map((r) => (
            <div key={r.id} className={`rounded-lg border border-border p-3 space-y-2 ${isPending ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm">{r.description}</p>
                <button
                  onClick={() => handleDelete(r.id)}
                  className="text-xs text-muted-foreground hover:text-destructive shrink-0 transition-colors"
                  disabled={isPending}
                >
                  ✕
                </button>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <PriorityBadge priority={r.priority} />
                <span className="text-xs text-muted-foreground">{r.created_at ? timeAgo(r.created_at) : ''}</span>
                <Select
                  defaultValue={r.status}
                  onValueChange={(val) => val && handleStatus(r.id, val)}
                  disabled={isPending}
                >
                  <SelectTrigger className="h-6 w-32 text-xs ml-auto">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(STATUS_LABELS).map(([val, label]) => (
                      <SelectItem key={val} value={val} className="text-xs">{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Completed */}
      {done.length > 0 && (
        <details className="group">
          <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground select-none">
            {done.length} completed revision{done.length !== 1 ? 's' : ''}
          </summary>
          <div className="mt-2 space-y-1.5">
            {done.map((r) => (
              <div key={r.id} className="rounded-lg border border-border p-2.5 opacity-60">
                <p className="text-sm line-through text-muted-foreground">{r.description}</p>
              </div>
            ))}
          </div>
        </details>
      )}

      {revisions.length === 0 && (
        <p className="text-sm text-muted-foreground">No revisions yet.</p>
      )}
    </div>
  )
}
