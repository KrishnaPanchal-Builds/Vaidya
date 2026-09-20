'use client'

/**
 * KioskBottomDock — Fixed Ergonomic Action Bar
 *
 * Placed at the bottom-center of kiosk questionnaire screens:
 * - Center: Prominent, circular, pulsing "Speak Answer" hero button.
 * - Left: Clean, accessible "Back" navigation.
 * - Right: Standard, balanced "Next" action button.
 *
 * Ensures elderly, short, or wheelchair patients reaching for the lower half
 * of a mounted kiosk tablet immediately focus on voice input.
 */

import React from 'react'
import { motion } from 'framer-motion'
import { Mic, ArrowLeft, ArrowRight, Keyboard } from 'lucide-react'
import { cn } from '@/lib/utils'

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
  language = 'en',
  className,
}: KioskBottomDockProps) {
  const getSpeakLabel = () => {
    switch (language) {
      case 'mr':
        return 'बोला'
      case 'hi':
        return 'बोलें'
      case 'gu':
        return 'બોલો'
      case 'bn':
        return 'বলুন'
      case 'ta':
        return 'பேசவும்'
      default:
        return 'Speak Answer'
    }
  }

  return (
    <div
      className={cn(
        'w-full bg-white/95 backdrop-blur-md border-t border-[#DFE8F1] px-4 sm:px-6 py-3 shrink-0 flex items-center justify-between shadow-[0_-6px_24px_rgba(0,0,0,0.05)] select-none z-30',
        className
      )}
    >
      {/* ── Left Controls: Back + Optional Type ── */}
      <div className="flex items-center gap-2 min-w-[120px]">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 rounded-xl border border-[#CBD8E5] bg-[#F8FAFC] text-[#4B5565] font-bold text-[13.5px] hover:bg-[#EEF2F6] hover:text-[#17191F] transition-all active:scale-95 cursor-pointer shadow-2xs"
            aria-label={backLabel}
          >
            <ArrowLeft size={16} className="stroke-[2.5]" />
            <span className="hidden sm:inline">{backLabel}</span>
          </button>
        )}

        {onType && (
          <button
            type="button"
            onClick={onType}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-[#CBD8E5] bg-white text-[#2365B5] font-bold text-[12.5px] sm:text-[13px] hover:bg-[#F0F6FD] hover:border-[#2365B5] transition-all active:scale-95 cursor-pointer shadow-2xs"
            title="Type your answer"
          >
            <Keyboard size={15} />
            <span className="hidden md:inline">{typeLabel || 'Type'}</span>
          </button>
        )}
      </div>

      {/* ── Center Hero Action: Pulsing Floating Microphone Dock ── */}
      <div className="relative flex flex-col items-center justify-center -my-2">
        {/* Soft Animated Outer Pulse Ring */}
        <div
          className={cn(
            'absolute inset-0 m-auto w-16 h-16 rounded-full pointer-events-none transition-all duration-300',
            isListening
              ? 'bg-rose-500/25 animate-ping'
              : 'bg-[#2365B5]/20 animate-pulse'
          )}
        />

        <motion.button
          type="button"
          onClick={onSpeak}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'relative w-[62px] h-[62px] sm:w-[68px] sm:h-[68px] rounded-full flex flex-col items-center justify-center text-white shadow-lg cursor-pointer z-10 transition-colors',
            isListening
              ? 'bg-gradient-to-tr from-rose-600 to-red-500 ring-4 ring-rose-300'
              : 'bg-gradient-to-tr from-[#174A91] via-[#2365B5] to-[#3B82F6] ring-4 ring-[#2365B5]/30'
          )}
          aria-label={getSpeakLabel()}
        >
          <Mic size={26} className="stroke-[2.5]" />
          <span className="text-[9.5px] font-extrabold tracking-wider uppercase leading-none mt-0.5">
            {isListening ? 'Listening' : getSpeakLabel()}
          </span>
        </motion.button>
      </div>

      {/* ── Right Controls: Balanced Standard Next CTA ── */}
      <div className="flex items-center justify-end min-w-[120px]">
        <button
          type="button"
          onClick={onNext}
          disabled={isNextDisabled}
          className={cn(
            'inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-[14px] sm:text-[14.5px] transition-all shadow-sm active:scale-95 cursor-pointer',
            isNextDisabled
              ? 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed shadow-none'
              : 'bg-[#2365B5] text-white hover:bg-[#174A91] hover:shadow-md'
          )}
          aria-label={nextLabel}
        >
          <span>{nextLabel}</span>
          <ArrowRight size={17} className="stroke-[2.5]" />
        </button>
      </div>
    </div>
  )
}
