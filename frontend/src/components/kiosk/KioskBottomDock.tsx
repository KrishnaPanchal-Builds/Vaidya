'use client'

/**
 * KioskBottomDock — Unified Ergonomic Action Bar
 *
 * Integrated inline footer action bar for kiosk intake stages:
 * - Center: Prominent rounded-rectangle pill "Speak Answer" hero button
 *   with side-by-side mic icon and normal-case label matching the design system.
 * - Left: "Back" navigation and "Type instead" action button.
 * - Right: Balanced "Next / Continue" primary action button.
 *
 * Sits naturally in document flow without floating or overlapping answer cards.
 * Zero horizontal overflow / clipping across all screen sizes and label lengths.
 * Adheres strictly to the calm healthcare motion tokens (--ease-calm, 2.1s breathing pulse).
 */

import React from 'react'
import { motion } from 'framer-motion'
import { Mic, ArrowLeft, ArrowRight, Keyboard } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useKioskTranslation } from '@/lib/hooks/use-kiosk-translation'

interface KioskBottomDockProps {
  onSpeak: () => void
  isListening?: boolean
  onNext: () => void
  nextLabel?: string
  isNextDisabled?: boolean
  onBack?: () => void
  backLabel?: string
  onType?: () => void
  typeLabel?: string
  language?: string
  className?: string
}

export function KioskBottomDock({
  onSpeak,
  isListening = false,
  onNext,
  nextLabel = 'Next',
  isNextDisabled = false,
  onBack,
  backLabel = 'Back',
  onType,
  typeLabel,
  language: propLanguage,
  className,
}: KioskBottomDockProps) {
  const { language: contextLang, t } = useKioskTranslation()
  const activeLang = propLanguage || contextLang || 'en'

  const getSpeakLabel = () => {
    if (isListening) {
      switch (activeLang) {
        case 'hi':
          return 'सुन रहे हैं…'
        case 'mr':
          return 'ऐकत आहोत…'
        case 'gu':
          return 'સાંભળી રહ્યા છીએ…'
        case 'bn':
          return 'শুনছি…'
        case 'ta':
          return 'கேட்கிறோம்…'
        default:
          return 'Listening…'
      }
    }
    return t.intake?.speakAnswer || 'Speak Answer'
  }

  const getTypeLabel = () => {
    if (typeLabel) return typeLabel
    return t.intake?.typeInstead || 'Type instead'
  }

  return (
    <div
      className={cn(
        'w-full max-w-full bg-white/95 backdrop-blur-md border-t border-[#DFE8F1] px-3 sm:px-6 py-3 shrink-0 flex items-center justify-between gap-2 sm:gap-3 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] select-none z-20 rounded-t-2xl mt-auto overflow-hidden',
        className
      )}
    >
      {/* ── Left Controls: Back + Type Instead ── */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {onBack && (
          <button
            type="button"
            id="kiosk-footer-back-btn"
            onClick={onBack}
            className="inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 min-h-[44px] sm:min-h-[48px] rounded-xl border border-[#CBD8E5] bg-[#F8FAFC] text-[#4B5565] font-bold text-[13px] sm:text-[13.5px] hover:bg-[#EEF2F6] hover:text-[#17191F] transition-all active:scale-[0.97] cursor-pointer shadow-2xs whitespace-nowrap"
            aria-label={backLabel}
          >
            <ArrowLeft size={16} className="stroke-[2.5] shrink-0" />
            <span>{backLabel}</span>
          </button>
        )}

        {onType && (
          <button
            type="button"
            id="kiosk-footer-type-btn"
            onClick={onType}
            className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-2 sm:py-2.5 min-h-[44px] sm:min-h-[48px] rounded-xl border border-[#CBD8E5] bg-white text-[#2365B5] font-bold text-[12.5px] sm:text-[13px] hover:bg-[#F0F6FD] hover:border-[#2365B5] transition-all active:scale-[0.97] cursor-pointer shadow-2xs whitespace-nowrap"
            title={getTypeLabel()}
            aria-label={getTypeLabel()}
          >
            <Keyboard size={15} className="shrink-0" />
            <span className="hidden md:inline">{getTypeLabel()}</span>
            <span className="md:hidden">Type</span>
          </button>
        )}
      </div>

      {/* ── Center Hero Action: Prominent Rounded-Rectangle Pill Voice Button ── */}
      <div className="relative flex items-center justify-center shrink-0">
        {/* Calm Concentric Breathing Pulse Ring (1800-2400ms cycle) */}
        {isListening && (
          <motion.div
            initial={{ scale: 1.0, opacity: 0.35 }}
            animate={{ scale: 1.08, opacity: 0 }}
            transition={{
              duration: 2.1,
              repeat: Infinity,
              ease: [0.4, 0.0, 0.2, 1],
            }}
            className="absolute inset-0 -m-1 rounded-2xl bg-rose-500/30 pointer-events-none motion-reduce:hidden"
          />
        )}

        <motion.button
          type="button"
          id="kiosk-footer-speak-btn"
          onClick={onSpeak}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.1, ease: [0.4, 0.0, 0.2, 1] }}
          className={cn(
            'relative inline-flex items-center justify-center gap-1.5 sm:gap-2.5 px-4 sm:px-6 py-2.5 sm:py-3 min-h-[44px] sm:min-h-[50px] rounded-2xl font-extrabold text-[13.5px] sm:text-[15px] text-white shadow-md hover:shadow-lg transition-all cursor-pointer z-10 whitespace-nowrap',
            isListening
              ? 'bg-gradient-to-r from-rose-600 via-rose-500 to-red-500 ring-2 ring-rose-400/50 shadow-rose-200'
              : 'bg-gradient-to-r from-[#174A91] via-[#2365B5] to-[#347FCE] hover:from-[#133F7D] hover:via-[#1F5AA3] hover:to-[#2B6DB3] ring-1 ring-white/20'
          )}
          aria-label={getSpeakLabel()}
        >
          <Mic
            size={18}
            className={cn(
              'stroke-[2.5] shrink-0 transition-transform duration-200',
              isListening && 'scale-110'
            )}
          />
          <span className="tracking-normal whitespace-nowrap">
            {getSpeakLabel()}
          </span>
        </motion.button>
      </div>

      {/* ── Right Controls: Balanced Next / Continue CTA ── */}
      <div className="flex items-center justify-end shrink-0">
        <button
          type="button"
          id="kiosk-footer-next-btn"
          onClick={onNext}
          disabled={isNextDisabled}
          className={cn(
            'inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 min-h-[44px] sm:min-h-[48px] rounded-xl font-extrabold text-[13px] sm:text-[14px] transition-all shadow-xs active:scale-[0.97] cursor-pointer whitespace-nowrap',
            isNextDisabled
              ? 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed shadow-none'
              : 'bg-[#2365B5] text-white hover:bg-[#174A91] hover:shadow-md'
          )}
          aria-label={nextLabel}
        >
          <span>{nextLabel}</span>
          <ArrowRight size={16} className="stroke-[2.5] shrink-0" />
        </button>
      </div>
    </div>
  )
}
