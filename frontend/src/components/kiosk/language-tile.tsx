'use client'
/**
 * LanguageTile — Large touch-friendly language selection tile for K-02.
 *
 * Phase 8: Recreates the dark graduated deep teal active state with mint highlight.
 * - White resting surface with subtle shadow
 * - Native script name prominent (large, bold text)
 * - English name below (small, muted)
 * - Selected: deep teal active gradient, pale mint text, top highlight
 * - Entrance: staggered slideFadeUp animation (motion-safe)
 * - Min height: 92px for comfortable touch targets
 */

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import type { KioskLanguageOption } from '@/types/kiosk'

interface LanguageTileProps {
  lang: KioskLanguageOption
  isSelected: boolean
  onSelect: (code: KioskLanguageOption['code']) => void
  animationDelay?: number
}

export const LanguageTile = forwardRef<HTMLButtonElement, LanguageTileProps>(
  function LanguageTile({ lang, isSelected, onSelect, animationDelay = 0 }, ref) {
  return (
    <button
      ref={ref}
      onClick={() => onSelect(lang.code)}
      role="radio"
      aria-checked={isSelected}
      aria-label={`${lang.native} — ${lang.english}${isSelected ? ' (selected)' : ''}`}
      dir={lang.dir ?? 'ltr'}
      data-lang={lang.code}
      style={{
        animationDelay: `${animationDelay}ms`,
        background: isSelected ? 'linear-gradient(135deg, #347FCE 0%, #2365B5 52%, #174A91 100%)' : undefined,
        boxShadow: isSelected
          ? '0 6px 20px rgba(35, 101, 181, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.25)'
          : undefined,
      }}
      className={cn(
        // Base layout
        'relative flex flex-col items-center justify-center gap-1.5 cursor-pointer',
        'min-h-[96px] sm:min-h-[104px] px-3.5 sm:px-5 py-4 sm:py-5 rounded-2xl',
        // Transition
        'transition-all duration-150 ease-out',
        'active:scale-[0.97]',
        // Focus
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2365B5]/30 focus-visible:ring-offset-2',
        // Entrance animation
        'motion-safe:animate-[kiosk-slide-fade-up_0.35s_ease-out]',
        // Idle state
        !isSelected && [
          'bg-white border border-[#DFE8F1] shadow-xs',
          'hover:bg-[#F3F8FD] hover:border-[#2365B5]/40 hover:shadow-sm',
        ],
        // Selected state
        isSelected && [
          'text-white border-transparent ring-2 ring-[#2365B5] ring-offset-2',
        ]
      )}
    >
      {/* Native script name */}
      <span
        className={cn(
          'text-[24px] sm:text-[28px] font-extrabold leading-tight tracking-tight text-center',
          isSelected ? 'text-white' : 'text-[#17191F]'
        )}
      >
        {lang.native}
      </span>

      {/* English name */}
      <span
        className={cn(
          'text-[14px] sm:text-[15.5px] font-bold tracking-wider uppercase text-center',
          isSelected ? 'text-[#E3EDF8]' : 'text-[#4B5565]'
        )}
      >
        {lang.english}
      </span>

      {/* Selected checkmark */}
      {isSelected && (
        <span
          className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center"
          aria-hidden="true"
        >
          <svg viewBox="0 0 12 12" className="w-3 h-3 text-[#DDEFE8]" fill="none">
            <path
              d="M2 6l3 3 5-5"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
    </button>
  )
})
LanguageTile.displayName = 'LanguageTile'
