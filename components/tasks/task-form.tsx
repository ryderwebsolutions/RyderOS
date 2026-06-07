'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TASK_STATUSES, TASK_PRIORITIES } from '@/types/database'
import type { Task } from '@/types/database'

const STATUS_LABELS: Record<string, string> = {
  open:        'Open',
  in_progress: 'In progress',
  done:        'Done',
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving…' : label}
    </Button>
  )
}

interface LinkedRecord {
  id: string
  name: string
}

interface Props {
  action: (formData: FormData) => Promise<void>
  task?: Task
  clients?: LinkedRecord[]
  contacts?: LinkedRecord[]
  websites?: LinkedRecord[]
  submitLabel?: string
}

export function TaskForm({ action, task, clients = [], contacts = [], websites = [], submitLabel = 'Save task' }: Props) {
  return (
    <form action={action} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="title">Task *</Label>
        <Input id="title" name="title" placeholder="What needs doing?" defaultValue={task?.title} required />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Details</Label>
        <Textarea id="description" name="description" rows={3} defaultValue={task?.description ?? ''} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue={task?.status ?? 'open'}>
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TASK_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="priority">Priority</Label>
          <Select name="priority" defaultValue={task?.priority ?? 'medium'}>
            <SelectTrigger id="priority">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TASK_PRIORITIES.map((p) => (
                <SelectItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="due_date">Due date</Label>
          <Input id="due_date" name="due_date" type="date" defaultValue={task?.due_date ?? ''} />
        </div>
      </div>

      {/* Link to a record */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="linked_type">Link to</Label>
          <Select name="linked_type" defaultValue={task?.linked_type ?? 'none'}>
            <SelectTrigger id="linked_type">
              <SelectValue placeholder="No link" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No link</SelectItem>
              {clients.length > 0 && <SelectItem value="client">Client</SelectItem>}
              {contacts.length > 0 && <SelectItem value="contact">Contact</SelectItem>}
              {websites.length > 0 && <SelectItem value="website">Website</SelectItem>}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="linked_id">Record</Label>
          <Select name="linked_id" defaultValue={task?.linked_id ?? 'none'}>
            <SelectTrigger id="linked_id">
              <SelectValue placeholder="Select record" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name} (client)</SelectItem>
              ))}
              {contacts.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name} (contact)</SelectItem>
              ))}
              {websites.map((w) => (
                <SelectItem key={w.id} value={w.id}>{w.name} (website)</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <SubmitButton label={submitLabel} />
    </form>
  )
}
