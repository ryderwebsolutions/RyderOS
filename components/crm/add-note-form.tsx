'use client'

import { useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? 'Adding…' : 'Add note'}
    </Button>
  )
}

export function AddNoteForm({ action }: { action: (formData: FormData) => Promise<void> }) {
  const ref = useRef<HTMLFormElement>(null)

  async function handleAction(formData: FormData) {
    await action(formData)
    ref.current?.reset()
  }

  return (
    <form ref={ref} action={handleAction} className="space-y-2">
      <Textarea
        name="content"
        placeholder="Add a note…"
        rows={3}
        required
      />
      <SubmitButton />
    </form>
  )
}
