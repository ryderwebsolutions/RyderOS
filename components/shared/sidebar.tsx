'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: '⬛' },
  { label: 'CRM', href: '/crm', icon: '👥' },
  { label: 'Leads', href: '/leads', icon: '⚡' },
  { label: 'Tasks', href: '/tasks', icon: '✓' },
  { label: 'Settings', href: '/settings', icon: '⚙' },
]

export default function Sidebar({ user }: { user: User }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="w-60 flex flex-col border-r border-border bg-card shrink-0">
      <div className="px-4 py-5 border-b border-border">
        <span className="font-semibold text-base tracking-tight">RyderOS</span>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <span className="w-4 text-center text-xs">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-4 py-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">
              {user.user_metadata?.full_name ?? user.email}
            </p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="ml-2 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            Sign out
          </button>
        </div>
      </div>
    </aside>
  )
}
