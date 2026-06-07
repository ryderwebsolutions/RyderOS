import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { buttonVariants } from '@/components/ui/button'
import { TaskStatusBadge, TaskPriorityBadge } from '@/components/tasks/task-badges'
import { setTaskStatus } from '@/actions/tasks'

export const metadata = { title: 'Tasks — RyderOS' }

const STATUS_FILTERS = [
  { label: 'All', value: '' },
  { label: 'Open', value: 'open' },
  { label: 'In progress', value: 'in_progress' },
  { label: 'Done', value: 'done' },
]

function isDue(due_date: string | null) {
  if (!due_date) return false
  return new Date(due_date) < new Date()
}

function formatDate(due_date: string | null) {
  if (!due_date) return null
  return new Date(due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

interface Props {
  searchParams: Promise<{ status?: string }>
}

export default async function TasksPage({ searchParams }: Props) {
  const { status } = await searchParams

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

  let query = supabase
    .from('tasks')
    .select('*')
    .eq('organization_id', member.organization_id)
    .order('due_date', { ascending: true, nullsFirst: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data: tasks } = await query

  const open = tasks?.filter((t) => t.status !== 'done').length ?? 0
  const overdue = tasks?.filter((t) => t.status !== 'done' && isDue(t.due_date)).length ?? 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Tasks</h1>
          <p className="text-sm text-muted-foreground">
            {open} open{overdue > 0 ? ` · ${overdue} overdue` : ''}
          </p>
        </div>
        <Link href="/tasks/new" className={buttonVariants()}>Add task</Link>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_FILTERS.map((f) => {
          const href = f.value ? `/tasks?status=${f.value}` : '/tasks'
          const active = (status ?? '') === f.value
          return (
            <Link
              key={f.value}
              href={href}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              {f.label}
            </Link>
          )
        })}
      </div>

      {/* Task list */}
      {(!tasks || tasks.length === 0) ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground text-sm">No tasks yet.</p>
          <Link href="/tasks/new" className={`mt-4 inline-flex ${buttonVariants({ variant: 'outline' })}`}>
            Add your first task
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => {
            const overdueDue = task.status !== 'done' && isDue(task.due_date)
            return (
              <div
                key={task.id}
                className={`flex items-start gap-4 rounded-xl border p-4 transition-colors ${
                  task.status === 'done'
                    ? 'border-border opacity-60'
                    : overdueDue
                    ? 'border-red-200 bg-red-50/30 dark:border-red-900/40 dark:bg-red-950/10'
                    : 'border-border hover:bg-muted/20'
                }`}
              >
                {/* Quick-done checkbox */}
                <form action={setTaskStatus.bind(null, task.id, task.status === 'done' ? 'open' : 'done')}>
                  <button
                    type="submit"
                    className={`mt-0.5 h-4 w-4 rounded border-2 shrink-0 transition-colors ${
                      task.status === 'done'
                        ? 'border-green-500 bg-green-500'
                        : 'border-border hover:border-primary'
                    }`}
                    title={task.status === 'done' ? 'Mark open' : 'Mark done'}
                  />
                </form>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start gap-2 justify-between">
                    <Link
                      href={`/tasks/${task.id}`}
                      className={`font-medium text-sm leading-snug hover:underline ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}
                    >
                      {task.title}
                    </Link>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <TaskPriorityBadge priority={task.priority} />
                      <TaskStatusBadge status={task.status} />
                    </div>
                  </div>
                  {task.description && (
                    <p className="text-xs text-muted-foreground line-clamp-1">{task.description}</p>
                  )}
                  {task.due_date && (
                    <p className={`text-xs ${overdueDue ? 'text-red-600 font-medium' : 'text-muted-foreground'}`}>
                      {overdueDue ? 'Overdue · ' : 'Due '}
                      {formatDate(task.due_date)}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
