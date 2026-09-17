'use client'

import { useRouter } from 'next/navigation'
import { CheckCircle2, ArrowRight, Users } from 'lucide-react'

export default function NursingConfirmPage() {
  const router = useRouter()

  return (
    <div className="p-6 md:p-12 max-w-2xl mx-auto flex flex-col items-center justify-center text-center space-y-6">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center shadow-md animate-scale-in"
        style={{
          background: 'var(--color-verified-subtle)',
          border: '2px solid var(--color-verified)',
          color: 'var(--color-verified)',
        }}
      >
        <CheckCircle2 size={40} />
      </div>

      <div className="space-y-2">
        <span
          className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full"
          style={{
            background: 'var(--color-brand-mist)',
            color: 'var(--color-brand)',
          }}
        >
          EHR Audit Logged
        </span>
        <h1 className="text-[26px] font-bold text-text-primary tracking-tight">
          Triage Assessment Recorded
        </h1>
        <p className="text-[13.5px] text-text-secondary max-w-md mx-auto leading-relaxed">
          Priya Menon (Token #23) has been escalated to Emergency Resuscitation. The attending physician on duty has been notified.
        </p>
      </div>

      <div
        className="w-full p-4 rounded-xl space-y-2 text-left text-[12.5px]"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
        }}
      >
        <div className="flex justify-between py-1 border-b border-border">
          <span className="text-text-secondary">Patient MRN:</span>
          <span className="font-mono font-semibold text-text-primary">VAID-892-441-A</span>
        </div>
        <div className="flex justify-between py-1 border-b border-border">
          <span className="text-text-secondary">Assigned Route:</span>
          <span className="font-semibold text-critical">Emergency Room / Resus 02</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-text-secondary">Timestamp:</span>
          <span className="font-mono text-text-muted">{new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full pt-2">
        <button
          onClick={() => router.push('/nursing/dashboard')}
          className="w-full sm:flex-1 h-11 rounded-lg text-white font-bold text-[13px] flex items-center justify-center gap-2 shadow-xs transition-all hover:opacity-90 active:scale-98"
          style={{ background: 'var(--color-brand)' }}
        >
          <Users size={15} />
          <span>Return to Triage Queue</span>
        </button>
        <button
          onClick={() => router.push('/doctor/queue')}
          className="w-full sm:flex-1 h-11 rounded-lg font-semibold text-[13px] border hover:bg-surface-subtle transition-colors flex items-center justify-center gap-2 text-text-secondary hover:text-text-primary"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <span>Open Physician OPD</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}
