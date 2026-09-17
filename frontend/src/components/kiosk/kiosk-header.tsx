'use client'
/**
 * KioskHeader — Persistent top header bar for the kiosk shell.
 *
 * Shows:
 * - Hospital identity (logo mark + name + department)
 * - Step progress indicator (thin bar, only when in active session)
 * - Dynamic language switcher toggle with SlidingSegmentedTabs
 *
 * Does NOT show patient name or any PHI.
 * Height: 56px — consistent across all kiosk screens.
 */

import { cn } from '@/lib/utils'
import { useKioskStore } from '@/store/kiosk.store'
import type { KioskStep } from '@/types/kiosk'
import VaidyaWordmark from '@/components/ui/VaidyaWordmark'
import { SlidingSegmentedTabs, type TabOption } from '@/components/ui/SlidingSegmentedTabs'
import type { SupportedKioskLanguage } from '@/lib/translations/kiosk-translations'

interface KioskHeaderProps {
  step: KioskStep
  language: string | null
  progressPercent?: number
  className?: string
}

// Steps that show the progress bar and language indicator
const ACTIVE_STEPS: KioskStep[] = [
  'LANGUAGE', 'IDENTIFY', 'CONFIRM', 'REGISTER',
  'CONSENT', 'INTAKE', 'DOCUMENTS', 'REVIEW',
]

// Map steps to progress percent for the header bar
const STEP_PROGRESS: Partial<Record<KioskStep, number>> = {
  LANGUAGE: 5,
  IDENTIFY: 20,
  CONFIRM: 30,
  REGISTER: 30,
  CONSENT: 40,
  INTAKE: 65,
  DOCUMENTS: 80,
  REVIEW: 92,
  COMPLETE: 100,
}

const HEADER_LANG_OPTIONS: TabOption<SupportedKioskLanguage>[] = [
  { id: 'en', label: 'EN', nativeLabel: 'EN' },
  { id: 'hi', label: 'HI', nativeLabel: 'हिंदी' },
  { id: 'mr', label: 'MR', nativeLabel: 'मराठी' },
  { id: 'gu', label: 'GU', nativeLabel: 'ગુજરાતી' },
  { id: 'bn', label: 'BN', nativeLabel: 'বাংলা' },
  { id: 'ta', label: 'TA', nativeLabel: 'தமிழ்' },
]

export function KioskHeader({ step, language, progressPercent, className }: KioskHeaderProps) {
  const { setLanguage, updateActivity } = useKioskStore()
  const isActive = ACTIVE_STEPS.includes(step)
  const progress = progressPercent ?? STEP_PROGRESS[step] ?? 0

  const activeLang: SupportedKioskLanguage = (language as SupportedKioskLanguage) ?? 'en'

  const handleLangChange = (newLang: SupportedKioskLanguage) => {
    updateActivity()
    setLanguage(newLang)
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'bg-white/95 backdrop-blur-xl border-b border-[var(--color-border)]',
        'shadow-[0_1px_8px_rgba(41,78,74,0.06)]',
        className
      )}
      role="banner"
    >
      <div className="max-w-[720px] mx-auto px-4 sm:px-5 h-14 flex items-center justify-between gap-3">
        {/* Left: wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <VaidyaWordmark size="sm" showDescriptor={false} variant="default" />
          <span className="text-[10px] font-semibold text-[var(--color-text-secondary)] tracking-wider uppercase px-2 py-0.5 rounded bg-[var(--color-brand-mist)] border border-[var(--color-border-strong)] hidden xs:inline-block">
            OPD Kiosk
          </span>
        </div>

        {/* Right: Dynamic in-session Sliding Language Switcher */}
        <div className="shrink-0 flex items-center gap-2 overflow-x-auto">
          {isActive && (
            <div className="flex items-center">
              <SlidingSegmentedTabs
                options={HEADER_LANG_OPTIONS}
                selectedId={activeLang}
                onChange={handleLangChange}
                variant="compact"
                layoutId="kiosk-header-lang-pill"
                ariaLabel="Switch Interface Language"
              />
            </div>
          )}

          <div className="hidden sm:flex items-center gap-1.5 text-[var(--color-text-muted)] pl-1">
            <svg viewBox="0 0 16 16" className="w-3 h-3 text-[var(--color-brand)]" fill="none" aria-hidden="true">
              <rect x="2" y="7" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="text-[10px] font-semibold tracking-wide uppercase text-[var(--color-text-secondary)]">Secure</span>
          </div>
        </div>
      </div>

      {/* Progress bar — only in active session steps */}
      {isActive && (
        <div
          className="h-[3px] bg-[var(--color-border)]"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Session progress"
        >
          <div
            className="h-full bg-[var(--color-brand)] transition-all duration-500 ease-out rounded-r-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </header>
  )
}
