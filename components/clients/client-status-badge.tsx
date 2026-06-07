import { Badge } from '@/components/ui/badge'

const STATUS_STYLES: Record<string, string> = {
  active:   'bg-green-100 text-green-700 hover:bg-green-100',
  inactive: 'bg-gray-100 text-gray-500 hover:bg-gray-100',
  paused:   'bg-amber-100 text-amber-700 hover:bg-amber-100',
}

const PAYMENT_STYLES: Record<string, string> = {
  current:   'bg-green-100 text-green-700 hover:bg-green-100',
  overdue:   'bg-red-100 text-red-700 hover:bg-red-100',
  paused:    'bg-amber-100 text-amber-700 hover:bg-amber-100',
  cancelled: 'bg-gray-100 text-gray-500 hover:bg-gray-100',
}

export function ClientStatusBadge({ status }: { status: string }) {
  return (
    <Badge className={STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-500'}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

export function PaymentStatusBadge({ status }: { status: string }) {
  return (
    <Badge className={PAYMENT_STYLES[status] ?? 'bg-gray-100 text-gray-500'}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}
