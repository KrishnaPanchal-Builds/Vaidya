'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Stethoscope,
  Activity,
  Building2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'
import { useAuthStore, DEMO_USERS } from '@/store'
import VaidyaWordmark from '@/components/ui/VaidyaWordmark'
import { cn } from '@/lib/utils'

type RoleType = 'doctor' | 'nursing' | 'admin'

interface RoleConfig {
  id: RoleType
  label: string
  sublabel: string
  stationName: string
  badge: string
  icon: typeof Stethoscope
  color: string
  bgLight: string
  targetRoute: string
  demoUser: typeof DEMO_USERS.doctor
  sampleMetric: string
  visualHighlights: {
    title: string
    detail: string
    type: 'verified' | 'critical' | 'info'
  }[]
}

const ROLE_CONFIGS: Record<RoleType, RoleConfig> = {
  doctor: {
    id: 'doctor',
    label: 'Physician OPD',
    sublabel: 'Clinical Intelligence Briefs & Differential Diagnosis',
    stationName: 'Physician Station #04 · OPD Room 12',
    badge: 'Clinical Review Workspace',
    icon: Stethoscope,
    color: '#2D6CB5',
    bgLight: 'bg-pastel-blue/40',
    targetRoute: '/doctor/queue',
    demoUser: DEMO_USERS.doctor,
    sampleMetric: '6 Prepared Briefs Ready',
    visualHighlights: [
      { title: 'Optical Prescription OCR', detail: 'Tab. Metformin 500mg BD flagged with high confidence', type: 'verified' },
      { title: 'Symptom Trajectory', detail: 'Acute retrosternal radiation correlated to T1 triage flag', type: 'critical' },
      { title: 'ABDM FHIR R4 Bundle', detail: 'Historical lipid panels synced via Ayushman Bharat ID', type: 'info' },
    ],
  },
  nursing: {
    id: 'nursing',
    label: 'Nursing Triage',
    sublabel: 'Waiting Hall Queue, Acute Red Flags & Vitals',
    stationName: 'Triage Intake Station · Desk 01',
    badge: 'Operational Triage Desk',
    icon: Activity,
    color: '#DC6803',
    bgLight: 'bg-pastel-peach/40',
    targetRoute: '/nursing/dashboard',
    demoUser: DEMO_USERS.nursing,
    sampleMetric: '14 Active Queue · 2 Red Flags',
    visualHighlights: [
      { title: 'Priority T1 Cardiac Alert', detail: 'Priya Menon (52F) reporting radiating chest discomfort', type: 'critical' },
      { title: 'Vitals Stream Telemetry', detail: 'SpO2 94% · Pulse 104 bpm · BP 150/95 recorded at kiosk', type: 'info' },
      { title: 'Kiosk Routing Protocol', detail: 'Automatic escalation to emergency OPD bay in progress', type: 'verified' },
    ],
  },
  admin: {
    id: 'admin',
    label: 'Hospital Administrator',
    sublabel: 'ABDM Gateway, Station Fleet & Audit Telemetry',
    stationName: 'Hospital Infrastructure & Security Hub',
    badge: 'Hospital Operations Hub',
    icon: Building2,
    color: '#0E7060',
    bgLight: 'bg-pastel-mint/40',
    targetRoute: '/admin',
    demoUser: DEMO_USERS.admin,
    sampleMetric: '4 Kiosks Live · Zero Downtime',
    visualHighlights: [
      { title: 'Bhashini Indic Speech Node', detail: 'Marathi, Hindi & Tamil ASR models operating at 98.4% uptime', type: 'verified' },
      { title: 'ABDM Gateway Sync', detail: 'FHIR R4 consent artifacts cryptographic audit valid', type: 'verified' },
      { title: 'Data Privacy Boundary', detail: 'Ephemeral kiosk storage scrubbed upon token generation', type: 'info' },
    ],
  },
}

export default function StaffLoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()

  const [selectedRole, setSelectedRole] = useState<RoleType>('doctor')
  const [email, setEmail] = useState('dr.mehta@aiia.gov.in')
  const [password, setPassword] = useState('password123')
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)

  const currentRole = ROLE_CONFIGS[selectedRole]

  const handleRoleChange = (role: RoleType) => {
    setSelectedRole(role)
    if (role === 'doctor') {
      setEmail('dr.mehta@aiia.gov.in')
    } else if (role === 'nursing') {
      setEmail('nurse.sharma@aiia.gov.in')
    } else {
      setEmail('admin@aiia.gov.in')
    }
  }

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      login(currentRole.demoUser)
      router.push(currentRole.targetRoute)
    }, 450)
  }

  const handleQuickDemoEntry = (role: RoleType) => {
    setLoading(true)
    login(ROLE_CONFIGS[role].demoUser)
    router.push(ROLE_CONFIGS[role].targetRoute)
  }

  return (
    <div className="min-h-screen bg-canvas-atmospheric flex flex-col justify-between select-none antialiased">
      {/* Top Quiet Navigation Bar */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-border/80 bg-white/70 backdrop-blur-md sticky top-0 z-30">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[12.5px] font-bold text-text-secondary hover:text-ink transition-colors"
        >
          <ArrowLeft size={15} />
          <span>Return to Public Homepage</span>
        </Link>

        <div className="flex items-center gap-3">
          <VaidyaWordmark size="sm" showDescriptor={false} />
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider bg-surface-subtle text-ink border border-border">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            Clinical Gateway
          </span>
        </div>
      </header>

      {/* Main Asymmetric Clinical Login Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-10 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* ── Left Column: Clinical Intelligence Atmosphere & Telemetry (7 cols) ── */}
          <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 lg:p-10 rounded-2xl bg-white/80 border border-border-strong shadow-sm space-y-8 relative overflow-hidden">
            {/* Soft Ambient Duotone Wash */}
            <div
              className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl -z-10 opacity-30 transition-all duration-700"
              style={{ background: currentRole.color }}
            />

            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-border shadow-2xs text-[11.5px] font-bold text-text-secondary">
                <ShieldCheck size={14} className="text-verified" />
                <span>Ayushman Bharat Digital Mission (ABDM) Compliant</span>
              </div>

              <h1 className="text-[28px] sm:text-[34px] font-extrabold text-ink tracking-tight leading-tight">
                Clinical Intelligence Infrastructure for Outpatient Care
              </h1>

              <p className="text-[14.5px] text-text-secondary leading-relaxed max-w-xl">
                Pre-consultation language processing, optical document synthesis, and automated triage safety protocols for high-density hospital OPDs.
              </p>
            </div>

            {/* Live Visual Transformation Pipeline Preview for Selected Role */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[11.5px] font-bold text-text-muted uppercase tracking-wider">
                <span>{currentRole.label} Telemetry Matrix</span>
                <span className="font-mono text-brand">{currentRole.sampleMetric}</span>
              </div>

              {/* Dynamic Role Evidence Cards */}
              <div className="space-y-2.5">
                {currentRole.visualHighlights.map((item, idx) => (
                  <div
                    key={item.title + idx}
                    className="p-3.5 rounded-xl bg-white border border-border flex items-start gap-3 shadow-2xs transition-all hover:border-border-strong"
                  >
                    <div
                      className={cn(
                        'w-2 h-2 rounded-full mt-1.5 shrink-0',
                        item.type === 'critical'
                          ? 'bg-critical animate-pulse'
                          : item.type === 'verified'
                          ? 'bg-verified'
                          : 'bg-brand'
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[12.5px] font-bold text-ink truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-mono text-text-muted">
                          {item.type.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[12px] text-text-secondary mt-0.5 leading-snug">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Station Status Strip */}
            <div className="pt-4 border-t border-border/80 flex flex-wrap items-center justify-between gap-3 text-[11.5px] text-text-secondary">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-verified" />
                <span>Station: <strong>{currentRole.stationName}</strong></span>
              </div>
              <div className="font-mono text-[11px] text-text-muted">
                SHA-256 Encrypted Session
              </div>
            </div>
          </div>

          {/* ── Right Column: Authentication Panel (5 cols) ── */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-white border border-border-strong shadow-md space-y-6">
            <div className="space-y-5">
              {/* Role Selection Tabs (Non-pill segmented control) */}
              <div>
                <label className="text-[11.5px] font-bold text-text-secondary uppercase tracking-wider block mb-2">
                  Select Workstation Role
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-surface-subtle rounded-xl border border-border">
                  {(['doctor', 'nursing', 'admin'] as RoleType[]).map((r) => {
                    const cfg = ROLE_CONFIGS[r]
                    const Icon = cfg.icon
                    const isSelected = selectedRole === r
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => handleRoleChange(r)}
                        className={cn(
                          'py-2 px-2.5 rounded-lg text-[12px] font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer',
                          isSelected
                            ? 'bg-white text-ink shadow-xs border border-border'
                            : 'text-text-secondary hover:text-ink'
                        )}
                      >
                        <Icon size={14} style={{ color: isSelected ? cfg.color : undefined }} />
                        <span className="truncate">{cfg.label.split(' ')[0]}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Workstation Header */}
              <div className="p-3 rounded-xl bg-surface-subtle border border-border flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                    Authenticated Gateway
                  </span>
                  <span className="text-[13px] font-bold text-ink block">
                    {currentRole.label}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10.5px] font-bold font-mono bg-white border border-border text-text-secondary">
                  DEMO PASS
                </span>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[12px] font-bold text-ink block">
                    Staff Identification / Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-10 px-3 rounded-lg border border-border bg-white text-ink text-[13px] focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[12px] font-bold text-ink">
                      Station Password
                    </label>
                    <span className="text-[11px] text-text-muted">Demo: password123</span>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full h-10 px-3 rounded-lg border border-border bg-white text-ink text-[13px] focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all font-mono"
                  />
                </div>

                <div className="flex items-center justify-between text-[12px]">
                  <label className="flex items-center gap-2 text-text-secondary cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-border text-brand focus:ring-brand"
                    />
                    <span>Remember terminal</span>
                  </label>
                  <span className="text-brand font-medium">Session Active</span>
                </div>

                {/* Primary Sign In Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-xl text-white text-[13.5px] font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-[0.99] disabled:opacity-60"
                  style={{ background: currentRole.color }}
                >
                  {loading ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>Enter {currentRole.label}</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Quick 1-Click Evaluation Shortcuts for Hackathon Judges */}
            <div className="pt-4 border-t border-border space-y-2.5">
              <div className="flex items-center justify-between text-[10.5px] font-bold text-text-muted uppercase tracking-wider">
                <span>Instant Evaluator Entry</span>
                <span>1-Click</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickDemoEntry('doctor')}
                  className="p-2 rounded-lg border border-border bg-white hover:bg-pastel-blue/30 text-ink text-[11px] font-bold text-center transition-all cursor-pointer"
                >
                  Doctor OPD
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoEntry('nursing')}
                  className="p-2 rounded-lg border border-border bg-white hover:bg-pastel-peach/30 text-ink text-[11px] font-bold text-center transition-all cursor-pointer"
                >
                  Nurse Triage
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoEntry('admin')}
                  className="p-2 rounded-lg border border-border bg-white hover:bg-pastel-mint/30 text-ink text-[11px] font-bold text-center transition-all cursor-pointer"
                >
                  Admin Hub
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Structured Institutional Footer */}
      <footer className="w-full px-6 py-4 border-t border-border bg-white/70 backdrop-blur-md text-center text-[12px] text-text-muted">
        Vaidya Pre-Consultation Intelligence System · AIIA &amp; Ayushman Bharat OPD Infrastructure · All Patient Data Cryptographically Sandboxed
      </footer>
    </div>
  )
}
