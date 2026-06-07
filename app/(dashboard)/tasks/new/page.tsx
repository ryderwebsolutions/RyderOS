import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createTask } from '@/actions/tasks'
import { TaskForm } from '@/components/tasks/task-form'

export const metadata = { title: 'New Task — RyderOS' }

export default async function NewTaskPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: member } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .limit(1)
    .single()

  if (!member) redirect('/login')

  const [clientsResult, contactsResult, websitesResult] = await Promise.all([
    supabase.from('clients').select('id, name').eq('organization_id', member.organization_id).order('name'),
    supabase.from('contacts').select('id, first_name, last_name').eq('organization_id', member.organization_id).is('archived_at', null).order('first_name'),
    supabase.from('websites').select('id, name').eq('organization_id', member.organization_id).order('name'),
  ])

  const contacts = (contactsResult.data ?? []).map((c) => ({
    id: c.id,
    name: [c.first_name, c.last_name].filter(Boolean).join(' '),
  }))

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link href="/tasks" className="text-sm text-muted-foreground hover:text-foreground">
          ← Tasks
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">Add task</h1>
      </div>

      <div className="rounded-xl border border-border p-6">
        <TaskForm
          action={createTask}
          clients={clientsResult.data ?? []}
          contacts={contacts}
          websites={websitesResult.data ?? []}
          submitLabel="Create task"
        />
      </div>
    </div>
  )
}
