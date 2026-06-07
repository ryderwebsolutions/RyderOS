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
import { CONTACT_SOURCES } from '@/types/database'
import type { Lead } from '@/types/database'

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving…' : label}
    </Button>
  )
}

interface Contact {
  id: string
  name: string
}

interface Props {
  action: (formData: FormData) => Promise<void>
  lead?: Lead
  contacts?: Contact[]
  submitLabel?: string
}

export function LeadForm({ action, lead, contacts = [], submitLabel = 'Save lead' }: Props) {
  return (
    <form action={action} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Business / contact name *</Label>
          <Input id="name" name="name" defaultValue={lead?.name} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="value">Potential value (£)</Label>
          <Input id="value" name="value" type="number" min="0" step="0.01" placeholder="0.00" defaultValue={lead?.value ?? ''} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" defaultValue={lead?.email ?? ''} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" defaultValue={lead?.phone ?? ''} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="source">Source</Label>
          <Select name="source" defaultValue={lead?.source ?? 'none'}>
            <SelectTrigger id="source">
              <SelectValue placeholder="How did they find you?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Not set</SelectItem>
              {CONTACT_SOURCES.map((s) => (
                <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {contacts.length > 0 && (
          <div className="space-y-1.5">
            <Label htmlFor="contact_id">Link to contact</Label>
            <Select name="contact_id" defaultValue={lead?.contact_id ?? 'none'}>
              <SelectTrigger id="contact_id">
                <SelectValue placeholder="No contact linked" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No contact linked</SelectItem>
                {contacts.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" rows={3} defaultValue={lead?.notes ?? ''} />
      </div>

      <SubmitButton label={submitLabel} />
    </form>
  )
}
