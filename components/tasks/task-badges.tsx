import { Badge } from '@/components/ui/badge'

const STATUS_STYLES: Record<string, string> = {
  open:        'bg-gray-100 text-gray-600 hover:bg-gray-100',
  in_progress: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
  done:        'bg-green-100 text-green-700 hover:bg-green-100',
}

const STATUS_LABELS: Record<string, string> = {
  open:        'Open',
  in_progress: 'In progress',
  done:        'Done',
}

const PRIORITY_STYLES: Record<string, string> = {
  low:    'bg-gray-100 text-gray-500 hover:bg-gray-100',
  medium: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
  high:   'bg-red-100 text-red-700 hover:bg-red-100',
}

export function TaskStatusBadge({ status }: { status: string }) {
  return (
    <Badge className={STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-500'}>
      {STATUS_LABELS[status] ?? status}
    </Badge>
  )
}

export function TaskPriorityBadge({ priority }: { priority: string }) {
  return (
    <Badge className={PRIORITY_STYLES[priority] ?? 'bg-gray-100 text-gray-500'}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  )
}
