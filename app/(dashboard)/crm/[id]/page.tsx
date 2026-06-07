import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { updateContact, deleteContact } from '@/actions/contacts'
import { ContactForm } from '@/components/crm/contact-form'
import { StatusBadge } from '@/components/crm/status-badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ContactPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: contact } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', id)
    .single()

  if (!contact) notFound()

  const updateWithId = updateContact.bind(null, id)
  const deleteWithId = deleteContact.bind(null, id)

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">
              {contact.first_name} {contact.last_name}
            </h1>
            <StatusBadge status={contact.status} />
          </div>
          {contact.company_name && (
            <p className="text-sm text-muted-foreground mt-1">{contact.company_name}</p>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <Link href="/crm">
            <Button variant="outline" size="sm">← Back</Button>
          </Link>
          <form action={deleteWithId}>
            <Button variant="destructive" size="sm" type="submit">Delete</Button>
          </form>
        </div>
      </div>

      <ContactForm action={updateWithId} contact={contact} submitLabel="Save changes" />
    </div>
  )
}
