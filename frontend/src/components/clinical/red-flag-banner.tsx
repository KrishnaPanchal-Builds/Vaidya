import { AlertTriangle, Clock } from 'lucide-react'
import { RedFlagAlert } from '@/types'
import { formatTime } from '@/lib/utils'

interface RedFlagBannerProps {
  alert: RedFlagAlert
  triageStatus?: 'pending' | 'acknowledged'
  onViewRecord?: () => void
}

export function RedFlagBanner({ alert, triageStatus = 'pending', onViewRecord }: RedFlagBannerProps) {
  return (
    <div className="border border-[var(--color-critical)]/30 border-l-4 border-l-[var(--color-critical)] rounded-2xl bg-[var(--color-critical-subtle)] p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <AlertTriangle size={18} className="text-[var(--color-critical)] shrink-0" />
          <span className="text-[14px] sm:text-[15px] font-bold text-[var(--color-critical)] uppercase tracking-wide">
            Immediate Clinical Priority · Red Flag
          </span>
        </div>
        <span className="font-mono text-[11px] text-[var(--color-text-muted)] font-semibold shrink-0">
          Alert #{alert.id.slice(-4)}
        </span>
      </div>

      <div className="mb-3">
        <p className="text-[10.5px] uppercase tracking-wider font-bold text-[var(--color-text-muted)] mb-1">
          Patient stated during intake:
        </p>
        <div className="bg-white rounded-xl px-3.5 py-2.5 border border-[var(--color-border)] shadow-2xs">
          <p className="text-[13.5px] italic text-[var(--color-text-primary)] font-semibold">
            &quot;{alert.triggerText}&quot;
          </p>
          {alert.triggerTextTranslated && (
            <p className="text-[12px] text-[var(--color-text-secondary)] mt-0.5">
              ({alert.triggerTextTranslated})
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] font-semibold bg-white border border-[var(--color-border)] rounded-lg px-2.5 py-1 text-[var(--color-text-secondary)]">
          Protocol: {alert.ruleName}
        </span>
        <span className="text-[11px] font-semibold bg-white border border-[var(--color-border)] rounded-lg px-2.5 py-1 text-[var(--color-text-secondary)] flex items-center gap-1">
          <Clock size={11} /> Triggered {formatTime(alert.alertedAt)}
        </span>
        {triageStatus === 'acknowledged' ? (
          <span className="text-[11px] font-bold text-[var(--color-verified-text)] flex items-center gap-1 bg-white border border-emerald-200/60 rounded-lg px-2.5 py-1">
            ✓ Triage acknowledged
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--color-critical)] bg-white border border-[var(--color-critical)]/30 rounded-lg px-2.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-critical)]" />
            Awaiting physician review
          </span>
        )}
        {onViewRecord && (
          <button onClick={onViewRecord} className="ml-auto text-[12px] font-bold text-[var(--color-brand)] hover:underline">
            View triage record →
          </button>
        )}
      </div>
    </div>
  )
}


