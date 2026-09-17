'use client'

import { ReactNode, useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Users,
  AlertTriangle,
  FolderOpen,
  LogOut,
  Menu,
  X,
  Clock,
  Activity,
  Stethoscope,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react'
import { useAuthStore } from '@/store'
import { ToastContainer } from '@/components/ui'
import { EvidenceDrawer } from '@/components/clinical'
import { cn } from '@/lib/utils'
import VaidyaWordmark from '@/components/ui/VaidyaWordmark'

interface NavItem {
  href: string
  label: string
  icon: typeof Users
  badge?: number
  badgeVariant?: 'critical' | 'warning' | 'info'
  isActive: (pathname: string) => boolean
}

const DOCTOR_NAV: NavItem[] = [
  {
    href: '/doctor/queue',
    label: 'Consultation Queue',
    icon: Users,
    badge: 6,
    badgeVariant: 'info',
    isActive: (pathname: string) => pathname === '/doctor/queue',
  },
  {
    href: '/doctor/encounter/enc-002',
    label: 'Active Patient Brief',
    icon: Stethoscope,
    badge: 1,
    badgeVariant: 'critical',
    isActive: (pathname: string) => pathname.startsWith('/doctor/encounter'),
  },
]

const NURSING_NAV: NavItem[] = [
  {
    href: '/nursing/dashboard',
    label: 'Triage Queue Matrix',
    icon: Users,
    badge: 14,
    badgeVariant: 'info',
    isActive: (pathname: string) => pathname === '/nursing/dashboard' || pathname === '/nursing',
  },
  {
    href: '/nursing/alerts/enc-002',
    label: 'Critical T1 Escalations',
    icon: AlertTriangle,
    badge: 2,
    badgeVariant: 'critical',
    isActive: (pathname: string) => pathname.startsWith('/nursing/alerts'),
  },
  {
    href: '/nursing/history',
    label: 'Resolved Encounters',
    icon: FolderOpen,
    isActive: (pathname: string) => pathname.startsWith('/nursing/history'),
  },
]

export function ClinicalShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuthStore()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState<string>('')

  const isDoctor = pathname.startsWith('/doctor') || user?.role === 'doctor'

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      )
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [])

  const navItems = isDoctor ? DOCTOR_NAV : NURSING_NAV
  const roleTitle = isDoctor ? 'Consulting Physician' : 'Senior Triage Officer'
  const stationTitle = isDoctor ? 'Physician Station #04' : 'Triage Intake Station'
  const departmentName = isDoctor ? 'General Medicine OPD' : 'Emergency & Triage Desk'

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden bg-canvas text-ink">
      {/* ── Left Clinical Navigation Rail (Simplified Quiet Instrument Design) ──── */}
      <aside
        className={cn(
          'flex flex-col transition-all duration-200 z-40 shrink-0 h-full',
          'fixed inset-y-0 left-0 md:relative md:translate-x-0',
          'w-[250px] bg-white border-r border-border shadow-xs',
          sidebarOpen ? 'translate-x-0 shadow-lg' : '-translate-x-full md:translate-x-0'
        )}
        aria-label="Clinical Navigation Workspace"
      >
        {/* Top Institutional Identity */}
        <div className="p-4 border-b border-border bg-white">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <VaidyaWordmark size="sm" showDescriptor={false} variant="default" />
            </Link>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-pastel-mint text-verified-text border border-verified/20">
              <span className="w-1.5 h-1.5 rounded-full bg-verified animate-pulse" />
              Live OPD
            </span>
          </div>

          {/* Clinical Workstation Role Header */}
          <div className="mt-3.5 p-3 bg-surface-subtle/80 rounded-xl border border-border">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white font-bold text-[12px] shadow-xs"
                style={{
                  background: isDoctor
                    ? 'linear-gradient(135deg, #2D6CB5 0%, #175CD3 100%)'
                    : 'linear-gradient(135deg, #DC6803 0%, #B54708 100%)',
                }}
              >
                {isDoctor ? <Stethoscope size={16} /> : <Activity size={16} />}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[12.5px] font-bold text-ink block truncate leading-tight">
                  {stationTitle}
                </span>
                <span className="text-[11px] text-text-secondary block truncate font-medium">
                  {departmentName}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quiet Instrument Navigation Items — Exact 1-Item Active Logic */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto" role="navigation">
          <div className="px-3 pb-1 text-[10.5px] font-bold uppercase tracking-wider text-text-muted">
            {isDoctor ? 'Clinical Consultation' : 'Triage Operations'}
          </div>

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = item.isActive(pathname)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12.5px] transition-all group',
                    active
                      ? 'bg-pastel-blue/60 text-brand font-bold shadow-2xs'
                      : 'text-text-secondary hover:bg-surface-subtle hover:text-ink font-medium'
                  )}
                >
                  {/* Left Active Indicator Line */}
                  {active && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-brand rounded-r-sm" />
                  )}
                  <Icon
                    size={15}
                    className={cn(
                      'shrink-0 transition-colors',
                      active ? 'text-brand' : 'text-text-muted group-hover:text-brand'
                    )}
                  />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={cn(
                        'text-[10px] font-bold rounded-md h-4.5 min-w-[18px] px-1.5 flex items-center justify-center shrink-0',
                        item.badgeVariant === 'critical'
                          ? 'bg-critical text-white'
                          : item.badgeVariant === 'warning'
                          ? 'bg-warning text-white'
                          : 'bg-surface-subtle text-text-secondary border border-border'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Quick Hardware Kiosk Launch Link */}
          <div className="pt-4 mt-4 border-t border-border/70">
            <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-text-muted">
              Outpatient Terminals
            </div>
            <Link
              href="/kiosk"
              target="_blank"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] text-text-secondary hover:bg-surface-subtle hover:text-brand transition-colors group"
            >
              <ExternalLink size={13} className="text-text-muted group-hover:text-brand" />
              <span className="flex-1 truncate">Patient Intake Kiosk</span>
              <span className="text-[10px] font-mono bg-surface-subtle px-1.5 py-0.5 rounded border border-border font-bold">
                Launch
              </span>
            </Link>
          </div>
        </nav>

        {/* Footer: Clinician Profile & Controlled Sign Out */}
        <div className="p-3.5 border-t border-border bg-surface-subtle/40 space-y-2">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-border shadow-2xs">
            <div
              className="w-7 h-7 rounded-lg text-white flex items-center justify-center text-[11px] font-bold shrink-0 shadow-xs"
              style={{
                background: isDoctor ? 'var(--color-brand)' : 'var(--color-warning)',
              }}
            >
              {isDoctor ? 'DR' : 'RN'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-bold truncate text-ink leading-tight">
                {user?.name || (isDoctor ? 'Dr. Sunita Rao, MD' : 'Sister Anita Sharma')}
              </p>
              <p className="text-[10.5px] truncate text-text-muted">
                {roleTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] px-1 pt-1">
            <Link
              href="/"
              className="text-text-secondary hover:text-brand font-medium transition-colors"
            >
              ← Public Home
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-1 text-critical hover:underline font-bold transition-colors cursor-pointer"
            >
              <LogOut size={12} /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden backdrop-blur-xs"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Main Clinical Viewport ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Context Top Header Bar */}
        <header className="h-13 flex items-center justify-between px-4 md:px-6 shrink-0 bg-white border-b border-border shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-1.5 rounded-lg text-text-secondary hover:bg-surface-subtle transition-colors"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'}
            >
              {sidebarOpen ? <X size={17} /> : <Menu size={17} />}
            </button>

            {/* Breadcrumb Hierarchy */}
            <div className="flex items-center gap-1.5 text-[12.5px]">
              <span className="font-bold text-ink">
                {pathname.startsWith('/nursing')
                  ? 'Nursing Triage Desk'
                  : pathname.startsWith('/doctor')
                  ? 'Physician OPD'
                  : 'Hospital Portal'}
              </span>
              <ChevronRight size={13} className="text-text-muted" />
              <span className="text-text-secondary font-medium">
                {pathname.includes('encounter')
                  ? 'Active Patient Encounter Brief'
                  : pathname.includes('alerts')
                  ? 'Emergency Triage Escalations'
                  : pathname.includes('history')
                  ? 'Resolved Encounters'
                  : 'Outpatient Queue Matrix'}
              </span>
            </div>
          </div>

          {/* Live System Telemetry */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pastel-mint/60 border border-pastel-mint text-[11px] font-bold text-verified-text">
              <ShieldCheck size={12} className="text-verified" />
              <span>ABDM FHIR R4 Ready</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-0.8 rounded-full bg-surface-subtle border border-border text-[11.5px] font-mono font-bold text-ink">
              <Clock size={12} className="text-brand" />
              <span>{currentTime || '10:45:00 AM'}</span>
            </div>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto bg-canvas page-enter">
          {children}
        </main>
      </div>

      <EvidenceDrawer />
      <ToastContainer />
    </div>
  )
}
