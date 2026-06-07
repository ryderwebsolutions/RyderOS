'use client'

import { useTransition } from 'react'
import { toggleWebsiteChecklistItem } from '@/actions/websites'
import type { WebsiteChecklistItem } from '@/types/database'

interface Props {
  items: WebsiteChecklistItem[]
  websiteId: string
  category: string
  title: string
}

export function WebsiteChecklist({ items, websiteId, category, title }: Props) {
  const [isPending, startTransition] = useTransition()
  const filtered = items.filter((i) => i.category === category)
  const completed = filtered.filter((i) => i.completed).length

  function handleToggle(item: WebsiteChecklistItem) {
    startTransition(() => {
      toggleWebsiteChecklistItem(item.id, websiteId, !item.completed)
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <h3 className="text-sm font-medium">{title}</h3>
        <span className="text-xs text-muted-foreground">{completed}/{filtered.length}</span>
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${filtered.length ? (completed / filtered.length) * 100 : 0}%` }}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        {filtered.map((item) => (
          <label
            key={item.id}
            className={`flex items-center gap-3 rounded-lg border border-border p-2.5 cursor-pointer transition-colors ${isPending ? 'opacity-60' : 'hover:bg-muted/30'}`}
          >
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => handleToggle(item)}
              className="h-4 w-4 rounded accent-primary shrink-0"
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
