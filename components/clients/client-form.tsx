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
  CLIENT_STATUSES,
  SERVICE_TYPES,
  GBP_STATUSES,
  PAYMENT_STATUSES,
  RETAINER_STATUSES,
  type Client,
} from '@/types/database'

const GBP_LABELS: Record<string, string> = {
  not_started: 'Not started',
  claimed: 'Claimed',
  optimized: 'Optimized',
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving…' : label}
    </Button>
  )
}

interface ClientFormProps {
  action: (formData: FormData) => Promise<void>
  client?: Client
  submitLabel: string
}

export function ClientForm({ action, client, submitLabel }: ClientFormProps) {
  return (
    <form action={action} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="name">Business name <span className="text-destructive">*</span></Label>
        <Input id="name" name="name" defaultValue={client?.name} required />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue={client?.status ?? 'active'}>
            <SelectTrigger id="status"><SelectValue /></SelectTrigger>
            <SelectContent>
              {CLIENT_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="service_type">Service type</Label>
          <Select name="service_type" defaultValue={client?.service_type ?? ''}>
            <SelectTrigger id="service_type"><SelectValue placeholder="Select service" /></SelectTrigger>
            <SelectContent>
              {SERVICE_TYPES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="domain">Domain</Label>
          <Input id="domain" name="domain" placeholder="example.com" defaultValue={client?.domain ?? ''} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="website_url">Website URL</Label>
          <Input id="website_url" name="website_url" type="url" placeholder="https://" defaultValue={client?.website_url ?? ''} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="google_business_profile_status">Google Business Profile</Label>
          <Select name="google_business_profile_status" defaultValue={client?.google_business_profile_status ?? 'not_started'}>
            <SelectTrigger id="google_business_profile_status"><SelectValue /></SelectTrigger>
            <SelectContent>
              {GBP_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{GBP_LABELS[s]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="payment_status">Payment status</Label>
          <Select name="payment_status" defaultValue={client?.payment_status ?? 'current'}>
            <SelectTrigger id="payment_status"><SelectValue /></SelectTrigger>
            <SelectContent>
              {PAYMENT_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="retainer_status">Retainer status</Label>
          <Select name="retainer_status" defaultValue={client?.retainer_status ?? 'active'}>
            <SelectTrigger id="retainer_status"><SelectValue /></SelectTrigger>
            <SelectContent>
              {RETAINER_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="retainer_amount">Monthly retainer (€)</Label>
        <Input id="retainer_amount" name="retainer_amount" type="number" step="0.01" min="0" placeholder="0.00" defaultValue={client?.retainer_amount ?? ''} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" rows={3} defaultValue={client?.notes ?? ''} placeholder="Internal notes about this client…" />
      </div>

      <div className="flex gap-3">
        <SubmitButton label={submitLabel} />
        <Button type="button" variant="outline" onClick={() => history.back()}>Cancel</Button>
      </div>
    </form>
  )
}
