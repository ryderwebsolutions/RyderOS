import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { updateContact, archiveContact, restoreContact, addContactNote, deleteContactNote } from '@/actions/contacts'
import { ContactForm } from '@/components/crm/contact-form'
import { StatusBadge } from '@/components/crm/status-badge'
import { AddNoteForm } from '@/components/crm/add-note-form'
import { Button } from '@/components/ui/button'

interface Props {
  params: Promise<{ id: string }>
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function ContactPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: contact }, { data: notes }, { data: { user } }] = await Promise.all([
    supabase.from('contacts').select('*').eq('id', id).single(),
    supabase.from('contact_notes').select('*').eq('contact_id', id).order('created_at', { ascending: false }),
    supabase.auth.getUser(),
  ])

  if (!contact) notFound()

  const updateWithId = updateContact.bind(null, id)
  const addNoteWithId = addContactNote.bind(null, id)
  const isArchived = !!contact.archived_at

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-semibold tracking-tight">
              {contact.first_name} {contact.last_name}
            </h1>
            <StatusBadge status={contact.status} />
            {isArchived && (
              <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">Archived</span>
            )}
          </div>
          {contact.company_name && (
            <p className="text-sm text-muted-foreground mt-1">{contact.company_name}</p>
          )}
        </div>
        <div className="flex gap-2 shrink-0 flex-wrap justify-end">
          <Link href="/crm">
            <Button variant="outline" size="sm">← Back</Button>
          </Link>
          {isArchived ? (
            <form action={restoreContact.bind(null, id)}>
              <Button variant="outline" size="sm" type="submit">Restore</Button>
            </form>
          ) : (
            <form action={archiveContact.bind(null, id)}>
              <Button variant="outline" size="sm" type="submit">Archive</Button>
            </form>
          )}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Edit form */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Details</h2>
          <ContactForm action={updateWithId} contact={contact} submitLabel="Save changes" />
        </div>

        {/* Right: Notes */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Activity & Notes</h2>

          <AddNoteForm action={addNoteWithId} />

          <div className="space-y-3 mt-4">
            {!notes?.length ? (
              <p className="text-sm text-muted-foreground">No notes yet.</p>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{timeAgo(note.created_at)}</span>
                    {note.author_id === user?.id && (
                      <form action={deleteContactNote.bind(null, note.id, id)}>
                        <button type="submit" className="text-xs text-muted-foreground hover:text-destructive transition-colors">
                          Delete
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
