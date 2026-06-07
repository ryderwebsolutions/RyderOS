import { createClientAction } from '@/actions/clients'
import { ClientForm } from '@/components/clients/client-form'

export default function NewClientPage() {
  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">New client</h1>
        <p className="text-sm text-muted-foreground mt-1">Add a new client to RyderOS.</p>
      </div>
      <ClientForm action={createClientAction} submitLabel="Create client" />
    </div>
  )
}
