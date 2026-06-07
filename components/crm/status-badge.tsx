import { Badge } from '@/components/ui/badge'

const STATUS_STYLES: Record<string, string> = {
  lead:     'bg-blue-100 text-blue-700 hover:bg-blue-100',
  prospect: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
  client:   'bg-green-100 text-green-700 hover:bg-green-100',
  inactive: 'bg-gray-100 text-gray-500 hover:bg-gray-100',
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge className={STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-500'}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}
