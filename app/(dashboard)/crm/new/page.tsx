import { createContact } from '@/actions/contacts'
import { ContactForm } from '@/components/crm/contact-form'

export default function NewContactPage() {
  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">New contact</h1>
        <p className="text-sm text-muted-foreground mt-1">Add a new contact to your CRM.</p>
      </div>
      <ContactForm action={createContact} submitLabel="Create contact" />
    </div>
  )
}
