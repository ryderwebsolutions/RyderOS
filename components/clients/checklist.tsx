'use client'

import { useTransition } from 'react'
import { toggleChecklistItem } from '@/actions/clients'
import type { ClientChecklistItem } from '@/types/database'

export function Checklist({ items, clientId }: { items: ClientChecklistItem[]; clientId: string }) {
  const [isPending, startTransition] = useTransition()
  const completed = items.filter((i) => i.completed).length

  function handleToggle(item: ClientChecklistItem) {
    startTransition(() => {
      toggleChecklistItem(item.id, clientId, !item.completed)
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{completed}/{items.length} complete</p>
        <div className="h-1.5 flex-1 mx-4 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${items.length ? (completed / items.length) * 100 : 0}%` }}
          />
        </div>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <label
            key={item.id}
            className={`flex items-center gap-3 rounded-lg border border-border p-3 cursor-pointer transition-colors ${isPending ? 'opacity-60' : 'hover:bg-muted/30'}`}
          >
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => handleToggle(item)}
              className="h-4 w-4 rounded accent-primary"
              disabled={isPending}
            />
            <span className={`text-sm ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
              {item.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}
