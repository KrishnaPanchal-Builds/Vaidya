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
  const { setLanguage, updateActivity, isMuted, toggleMute } = useKioskStore()
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 sm:h-15 flex items-center justify-between gap-3">
        {/* Left: wordmark + station badge */}
        <div className="flex items-center gap-2.5 shrink-0">
          <VaidyaWordmark size="md" showDescriptor={false} variant="default" />
          <span className="text-[11px] font-bold text-[var(--color-brand)] tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[var(--color-brand-mist)] border border-[var(--color-border-strong)] hidden sm:inline-block">
            OPD Kiosk
          </span>
        </div>

        {/* Right: Dynamic in-session Sliding Language Switcher & Audio Controls */}
        <div className="shrink-0 flex items-center gap-2 sm:gap-3 overflow-x-auto">
          {/* Mute / Unmute Audio Toggle */}
          <button
            type="button"
            onClick={() => {
              updateActivity()
              toggleMute()
            }}
            className={cn(
              'flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-bold text-[13px] sm:text-[14px]',
              isMuted
                ? 'bg-amber-50 border-amber-300 text-amber-700'
                : 'bg-[#EEF5FC] border-[#CBD8E5] text-[#2365B5] hover:bg-[#D9E9F8]'
            )}
            title={isMuted ? 'Unmute Audio (आवाज सुरू करा)' : 'Mute Audio (आवाज बंद करा)'}
            aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? (
              <>
                <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
                <span className="hidden md:inline">Muted</span>
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
                <span className="hidden md:inline">Voice ON</span>
              </>
            )}
          </button>

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

          <div className="hidden lg:flex items-center gap-1.5 text-[var(--color-text-muted)] pl-2 border-l border-[var(--color-border)]">
            <svg viewBox="0 0 16 16" className="w-4 h-4 text-[var(--color-brand)]" fill="none" aria-hidden="true">
              <rect x="2" y="7" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="text-[13px] font-bold tracking-wide uppercase text-[var(--color-text-secondary)]">ABDM Secure</span>
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
