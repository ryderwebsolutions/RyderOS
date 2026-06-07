import { Badge } from '@/components/ui/badge'

const STATUS_STYLES: Record<string, string> = {
  not_started: 'bg-gray-100 text-gray-500 hover:bg-gray-100',
  in_progress: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
  review:      'bg-amber-100 text-amber-700 hover:bg-amber-100',
  live:        'bg-green-100 text-green-700 hover:bg-green-100',
  maintenance: 'bg-purple-100 text-purple-700 hover:bg-purple-100',
}

const STATUS_LABELS: Record<string, string> = {
  not_started: 'Not started',
  in_progress: 'In progress',
  review:      'In review',
  live:        'Live',
  maintenance: 'Maintenance',
}

const PRIORITY_STYLES: Record<string, string> = {
  low:    'bg-gray-100 text-gray-500 hover:bg-gray-100',
  medium: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
  high:   'bg-red-100 text-red-700 hover:bg-red-100',
}

export function WebsiteStatusBadge({ status }: { status: string }) {
  return (
    <Badge className={STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-500'}>
      {STATUS_LABELS[status] ?? status}
    </Badge>
  )
}

export function PriorityBadge({ priority }: { priority: string }) {
  return (
    <Badge className={PRIORITY_STYLES[priority] ?? 'bg-gray-100 text-gray-500'}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  )
}
