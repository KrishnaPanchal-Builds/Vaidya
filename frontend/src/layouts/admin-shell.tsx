'use client'
import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart2, FileText, Activity, ScrollText, GitBranch, Users, Home, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store'
import { ToastContainer } from '@/components/ui'
import { cn } from '@/lib/utils'
import VaidyaWordmark from '@/components/ui/VaidyaWordmark'

const ADMIN_NAV = [
  { href: '/admin', label: 'Overview', icon: Home, exact: true },
  { href: '/admin/analytics/intake', label: 'Intake Analytics', icon: BarChart2 },
  { href: '/admin/analytics/documents', label: 'Document Analytics', icon: FileText },
  { href: '/admin/integrations', label: 'Integration Health', icon: Activity },
  { href: '/admin/audit', label: 'Audit Log', icon: ScrollText },
  { href: '/admin/config/pathways', label: 'Clinical Pathways', icon: GitBranch },
  { href: '/admin/users', label: 'Users & Roles', icon: Users },
]

export function AdminShell({ children }: { children: ReactNode }) {
  const { logout } = useAuthStore()
  const pathname = usePathname()

  return (
    <div className="h-screen flex overflow-hidden" style={{ background: 'var(--color-canvas)' }}>

      {/* ── Sidebar ────────────────────────────────────────────────── */}
      <aside
        className="w-[220px] flex flex-col shrink-0"
        style={{
          background: 'var(--color-brand)',
          borderRight: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        {/* Wordmark */}
        <div className="px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <VaidyaWordmark size="sm" showDescriptor={false} variant="on-dark" />
          <div
            className="mt-2 text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: 'rgba(228,240,236,0.45)' }}
          >
            Administration
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {ADMIN_NAV.map(item => {
            const Icon = item.icon
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 mx-2 px-3 h-9 rounded text-[13.5px] transition-all duration-fast font-medium',
                )}
                style={{
                  background: active ? 'rgba(228,240,236,0.16)' : 'transparent',
                  color: active ? '#E4F0EC' : 'rgba(228,240,236,0.65)',
                  fontWeight: active ? 600 : 500,
                }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.background = 'rgba(228,240,236,0.08)'
                    e.currentTarget.style.color = '#E4F0EC'
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'rgba(228,240,236,0.65)'
                  }
                }}
              >
                <Icon size={15} strokeWidth={1.75} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer actions */}
        <div className="px-4 py-4 space-y-1" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Link
            href="/"
            className="flex items-center gap-2 text-[12px] font-medium transition-colors px-1 py-0.5 rounded block"
            style={{ color: 'rgba(228,240,236,0.5)' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#E4F0EC' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(228,240,236,0.5)' }}
          >
            ← Return to Homepage
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-[12px] font-medium transition-colors px-1 py-0.5 rounded w-full text-left"
            style={{ color: 'rgba(197,138,74,0.75)' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-highlight)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(197,138,74,0.75)' }}
          >
            <LogOut size={12} /> Logout
          </button>
        </div>
      </aside>

      {/* ── Main Content ───────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header
          className="h-[52px] flex items-center px-6"
          style={{
            background: 'var(--color-surface)',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <span
            className="text-[12px] font-medium ml-auto"
            style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}
          >
            {new Date().toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </header>
        <main className="flex-1 overflow-y-auto" style={{ background: 'var(--color-canvas)' }}>
          {children}
        </main>
      </div>
      <ToastContainer />
    </div>
  )
}
