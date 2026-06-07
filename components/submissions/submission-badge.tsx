import type { SubmissionStatus } from '@/types/database'

const styles: Record<SubmissionStatus, string> = {
  new: 'bg-blue-100 text-blue-800',
  reviewed: 'bg-gray-100 text-gray-700',
  converted: 'bg-green-100 text-green-800',
}

export function SubmissionBadge({ status }: { status: string }) {
  const s = status as SubmissionStatus
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${styles[s] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}
