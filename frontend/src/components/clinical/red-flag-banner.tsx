import { AlertTriangle } from 'lucide-react'
import { RedFlagAlert } from '@/types'
import { formatTime } from '@/lib/utils'

interface RedFlagBannerProps {
  alert: RedFlagAlert
  triageStatus?: 'pending' | 'acknowledged'
  onViewRecord?: () => void
}

export function RedFlagBanner({ alert, triageStatus = 'pending', onViewRecord }: RedFlagBannerProps) {
  return (
    <div className="border border-[var(--color-warning)]/30 border-l-4 border-l-[var(--color-warning)] rounded-2xl bg-[var(--color-warning-subtle)] px-5 py-4.5 mb-6 shadow-xs">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle size={18} className="text-[var(--color-warning)] shrink-0" />
        <span className="text-[15px] font-bold text-[var(--color-warning-text)]">Physician Attention Required</span>
        <span className="ml-auto font-mono text-[11px] text-[var(--color-text-muted)] font-semibold">Alert #{alert.id.slice(-4)}</span>
      </div>
      <div className="mb-3 pl-6">
        <p className="text-[11px] uppercase tracking-wider font-bold text-[var(--color-text-muted)] mb-1">Patient stated:</p>
        <div className="bg-white rounded-xl px-4 py-3 border border-[#DFE8F1] shadow-2xs">
          <p className="text-[14px] italic text-text-primary font-medium">&quot;{alert.triggerText}&quot;</p>
          {alert.triggerTextTranslated && (
            <p className="text-[13px] text-text-secondary mt-1">({alert.triggerTextTranslated})</p>
          )}
        </div>
      </div>
      <div className="pl-6 flex items-center gap-2 flex-wrap">
        <span className="text-[11.5px] font-semibold bg-white border border-[#DFE8F1] rounded-lg px-2.5 py-1 text-text-secondary">Rule: {alert.ruleName}</span>
        <span className="text-[11.5px] font-semibold bg-white border border-[#DFE8F1] rounded-lg px-2.5 py-1 text-text-secondary">Triggered {formatTime(alert.alertedAt)}</span>
        {triageStatus === 'acknowledged' ? (
          <span className="text-[12.5px] font-bold text-[var(--color-verified-text)] flex items-center gap-1 bg-white border border-verified/30 rounded-lg px-2.5 py-1">✓ Triage acknowledged</span>
        ) : (
          <span className="flex items-center gap-1.5 text-[12.5px] font-bold text-[var(--color-warning-text)] bg-white border border-warning/30 rounded-lg px-2.5 py-1">
            <span className="w-2 h-2 rounded-full bg-[var(--color-warning)] animate-pulse" />
            Awaiting triage acknowledgment
          </span>
        )}
        {onViewRecord && (
          <button onClick={onViewRecord} className="ml-auto text-[13px] font-bold text-brand hover:underline">
            View triage record →
          </button>
        )}
      </div>
    </div>
  )
}
