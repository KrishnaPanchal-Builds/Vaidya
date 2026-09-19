'use client'
/**
 * KioskButton — Touch-optimized button for the kiosk surface.
 *
 * Designed for large-finger, standing-distance interaction on a hospital touchscreen.
 * Minimum touch target: 64px height (WCAG 2.5.5 AAA = 44px; we exceed this deliberately).
 *
 * Reuses the existing design token system. Does NOT duplicate the app-wide Button component.
 * The kiosk variant is intentionally larger, bolder, and has stronger visual weight.
 */

import { forwardRef, ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const kioskButtonVariants = cva(
  [
    // Base — always applied
    'relative inline-flex items-center justify-center gap-3',
    'font-semibold tracking-tight select-none',
    'transition-all duration-[150ms] ease-out',
    // Touch feedback
    'active:scale-[0.97]',
    // Focus — visible for keyboard users
    'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-border-focus)]/40 focus-visible:ring-offset-2',
    // Disabled
    'disabled:opacity-40 disabled:pointer-events-none',
  ].join(' '),
  {
    variants: {
      variant: {
        primary: [
          'bg-[var(--color-brand)] text-white',
          'hover:bg-[var(--color-brand-dim)]',
          'shadow-[0_2px_12px_rgba(41,78,74,0.22)]',
        ].join(' '),
        secondary: [
          'bg-white border-2 border-[var(--color-brand)] text-[var(--color-brand)]',
          'hover:bg-[var(--color-brand-mist-subtle)]',
        ].join(' '),
        ghost: [
          'bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)] border border-[var(--color-border)]',
          'hover:bg-[var(--color-brand-mist)] hover:text-[var(--color-text-primary)]',
        ].join(' '),
        danger: [
          'bg-white border-2 border-[var(--color-critical)] text-[var(--color-critical)]',
          'hover:bg-[var(--color-critical-subtle)]',
        ].join(' '),
      },
      size: {
        /** Standard kiosk action — min 56-64px touch target */
        md: 'h-14 sm:h-16 px-6 sm:px-8 text-[16px] sm:text-[17px] rounded-xl sm:rounded-2xl',
        /** Large kiosk action — primary screen CTAs */
        lg: 'h-16 sm:h-[72px] px-8 sm:px-10 text-[18px] sm:text-[20px] rounded-2xl',
        /** Full-width kiosk action */
        full: 'h-14 sm:h-16 w-full px-6 sm:px-8 text-[16px] sm:text-[17px] rounded-xl sm:rounded-2xl',
        /** Full-width large — primary screen-level CTAs */
        fullLg: 'h-16 sm:h-[72px] w-full px-8 sm:px-10 text-[18px] sm:text-[20px] rounded-2xl',
      },
    },
    defaultVariants: { variant: 'primary', size: 'lg' },
  }
)

interface KioskButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof kioskButtonVariants> {
  isLoading?: boolean
}

export const KioskButton = forwardRef<HTMLButtonElement, KioskButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(kioskButtonVariants({ variant, size }), className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="h-5 w-5 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeDasharray="40"
            strokeDashoffset="15"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        children
      )}
    </button>
  )
)
KioskButton.displayName = 'KioskButton'
