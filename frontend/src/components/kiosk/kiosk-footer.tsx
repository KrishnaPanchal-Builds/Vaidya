'use client'
/**
 * KioskFooter — Bottom strip for the attract/idle screen.
 *
 * From Stitch kiosk_idle reference:
 * - Dark inverse-surface strip anchored to bottom
 * - Live digital clock (hours:minutes AM/PM)
 * - Current serving token number
 * - Hospital attribution
 *
 * Used ONLY on the attract/idle screen (K-01).
 * Not shown during active patient sessions.
 */

import { useEffect, useState } from 'react'

interface KioskFooterProps {
  currentToken?: number
}

function useKioskClock() {
  const [time, setTime] = useState<string>('--:-- --')
  const [date, setDate] = useState<string>('')

  useEffect(() => {
    function update() {
      const now = new Date()
      let hours = now.getHours()
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const ampm = hours >= 12 ? 'PM' : 'AM'
      hours = hours % 12 || 12
      setTime(`${hours}:${minutes} ${ampm}`)
      setDate(now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }))
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  return { time, date }
}

export function KioskFooter({ currentToken }: KioskFooterProps) {
  const { time, date } = useKioskClock()

  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--color-brand)] text-white rounded-t-2xl shadow-[0_-4px_24px_rgba(41,78,74,0.16)] border-t border-[var(--color-border-strong)]"
      role="contentinfo"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 sm:gap-4">
        {/* Clock */}
        <div className="flex flex-col leading-none">
          <time
            className="text-[20px] sm:text-[24px] font-bold font-mono tracking-wider text-white"
            aria-label={`Current time: ${time}`}
          >
            {time}
          </time>
          <span className="text-[12px] sm:text-[13px] text-white/75 mt-0.5 font-medium">
            {date}
          </span>
        </div>

        {/* Center: hospital info */}
        <div className="flex flex-col items-center text-center">
          <span className="text-[12px] sm:text-[13px] font-bold tracking-wider uppercase text-white/90">
            All India Institute of Ayurveda
          </span>
          <span className="text-[11px] font-semibold tracking-wider uppercase text-white/60">
            Ministry of Ayush · SIH26047
          </span>
        </div>

        {/* Serving token */}
        {currentToken !== undefined && (
          <div className="flex items-center gap-2 bg-white/15 px-3.5 py-1.5 sm:py-2 rounded-xl border border-white/20">
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-verified)] animate-pulse" aria-hidden="true" />
            <span className="text-[13.5px] sm:text-[15px] font-bold text-white">
              Serving Token #{currentToken}
            </span>
          </div>
        )}
      </div>
    </footer>
  )
}
