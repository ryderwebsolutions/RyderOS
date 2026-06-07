import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { updateTask, deleteTask } from '@/actions/tasks'
import { TaskForm } from '@/components/tasks/task-form'
import { TaskStatusBadge, TaskPriorityBadge } from '@/components/tasks/task-badges'

export const metadata = { title: 'Task — RyderOS' }

interface Props {
  params: Promise<{ id: string }>
}

export default async function TaskDetailPage({ params }: Props) {
  const { id } = await params

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

  const [taskResult, clientsResult, contactsResult, websitesResult] = await Promise.all([
    supabase.from('tasks').select('*').eq('id', id).eq('organization_id', member.organization_id).single(),
    supabase.from('clients').select('id, name').eq('organization_id', member.organization_id).order('name'),
    supabase.from('contacts').select('id, first_name, last_name').eq('organization_id', member.organization_id).is('archived_at', null).order('first_name'),
    supabase.from('websites').select('id, name').eq('organization_id', member.organization_id).order('name'),
  ])

  if (taskResult.error || !taskResult.data) notFound()

  const task = taskResult.data
  const contacts = (contactsResult.data ?? []).map((c) => ({
    id: c.id,
    name: [c.first_name, c.last_name].filter(Boolean).join(' '),
  }))

  async function handleUpdate(formData: FormData) {
    'use server'
    await updateTask(id, formData)
  }

  async function handleDelete() {
    'use server'
    await deleteTask(id)
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <Link href="/tasks" className="text-sm text-muted-foreground hover:text-foreground">
          ← Tasks
        </Link>
        <div className="mt-2 flex items-center gap-3">
          <h1 className="text-2xl font-semibold">{task.title}</h1>
          <TaskStatusBadge status={task.status} />
          <TaskPriorityBadge priority={task.priority} />
        </div>
      </div>

      {/* Edit form */}
      <div className="rounded-xl border border-border p-6">
        <TaskForm
          action={handleUpdate}
          task={task}
          clients={clientsResult.data ?? []}
          contacts={contacts}
          websites={websitesResult.data ?? []}
          submitLabel="Save changes"
        />
      </div>

      {/* Delete */}
      <div className="rounded-xl border border-destructive/20 p-5">
        <p className="text-sm font-medium text-destructive mb-3">Danger zone</p>
        <form action={handleDelete}>
          <button
            type="submit"
            className="text-sm text-destructive hover:underline"
            onClick={(e) => { if (!confirm('Delete this task?')) e.preventDefault() }}
          >
            Delete task
          </button>
        </form>
      </div>
    </div>
  )
}
