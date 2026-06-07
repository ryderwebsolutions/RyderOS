import { Badge } from '@/components/ui/badge'

const STAGE_STYLES: Record<string, string> = {
  new:       'bg-gray-100 text-gray-600 hover:bg-gray-100',
  contacted: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
  qualified: 'bg-purple-100 text-purple-700 hover:bg-purple-100',
  quoted:    'bg-amber-100 text-amber-700 hover:bg-amber-100',
  won:       'bg-green-100 text-green-700 hover:bg-green-100',
  lost:      'bg-red-100 text-red-600 hover:bg-red-100',
}

const STAGE_LABELS: Record<string, string> = {
  new:       'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  quoted:    'Quoted',
  won:       'Won',
  lost:      'Lost',
}

export function LeadStageBadge({ stage }: { stage: string }) {
  return (
    <Badge className={STAGE_STYLES[stage] ?? 'bg-gray-100 text-gray-500'}>
      {STAGE_LABELS[stage] ?? stage}
    </Badge>
  )
}
