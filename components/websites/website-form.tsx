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
import {
  WEBSITE_STATUSES,
  HOSTING_PROVIDERS,
  EMAIL_PROVIDERS,
} from '@/types/database'
import type { Website } from '@/types/database'

const STATUS_LABELS: Record<string, string> = {
  not_started: 'Not started',
  in_progress: 'In progress',
  review:      'In review',
  live:        'Live',
  maintenance: 'Maintenance',
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving…' : label}
    </Button>
  )
}

interface Props {
  action: (formData: FormData) => Promise<void>
  website?: Website
  clients: { id: string; name: string }[]
  submitLabel?: string
}

export function WebsiteForm({ action, website, clients, submitLabel = 'Save website' }: Props) {
  return (
    <form action={action} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Project name *</Label>
          <Input id="name" name="name" defaultValue={website?.name} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="domain">Domain</Label>
          <Input id="domain" name="domain" placeholder="example.com" defaultValue={website?.domain ?? ''} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue={website?.status ?? 'not_started'}>
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {WEBSITE_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="client_id">Client</Label>
          <Select name="client_id" defaultValue={website?.client_id ?? 'none'}>
            <SelectTrigger id="client_id">
              <SelectValue placeholder="No client linked" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No client linked</SelectItem>
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="hosting_provider">Hosting provider</Label>
          <Select name="hosting_provider" defaultValue={website?.hosting_provider ?? 'none'}>
            <SelectTrigger id="hosting_provider">
              <SelectValue placeholder="Select hosting" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Not set</SelectItem>
              {HOSTING_PROVIDERS.map((h) => (
                <SelectItem key={h} value={h}>{h}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email_provider">Email provider</Label>
          <Select name="email_provider" defaultValue={website?.email_provider ?? 'none'}>
            <SelectTrigger id="email_provider">
              <SelectValue placeholder="Select email" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Not set</SelectItem>
              {EMAIL_PROVIDERS.map((e) => (
                <SelectItem key={e} value={e}>{e}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="launch_date">Launch date</Label>
        <Input id="launch_date" name="launch_date" type="date" defaultValue={website?.launch_date ?? ''} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" rows={3} defaultValue={website?.notes ?? ''} />
      </div>

      <SubmitButton label={submitLabel} />
    </form>
  )
}
