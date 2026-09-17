import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * LoadingSpinner — Minimal, single-purpose arc spinner.
 * Use within containers; not as a full-page overlay.
 */
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const dim = { sm: 16, md: 22, lg: 32 }[size]
  return (
    <svg
      width={dim}
      height={dim}
      viewBox="0 0 24 24"
      fill="none"
      className={cn('processing-arc shrink-0', className)}
      aria-hidden="true"
      role="presentation"
    >
      <circle
        cx="12" cy="12" r="10"
        stroke="var(--color-brand)"
        strokeWidth="2"
        strokeDasharray="40"
        strokeDashoffset="15"
        strokeLinecap="round"
        opacity="0.25"
      />
      <circle
        cx="12" cy="12" r="10"
        stroke="var(--color-brand)"
        strokeWidth="2"
        strokeDasharray="10"
        strokeDashoffset="0"
        strokeLinecap="round"
      />
    </svg>
  )
}

/**
 * SkeletonLine — Animated placeholder line for text content.
 */
interface SkeletonLineProps {
  width?: string
  height?: string
  className?: string
}

export function SkeletonLine({ width = '100%', height = '14px', className }: SkeletonLineProps) {
  return (
    <div
      className={cn('rounded bg-surface-dim animate-pulse', className)}
      style={{ width, height }}
      aria-hidden="true"
    />
  )
}

/**
 * SkeletonRow — One placeholder record row for clinical lists.
 */
export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-5 py-3.5 border-b border-border last:border-0">
      <div className="w-8 h-8 rounded-full bg-surface-dim animate-pulse shrink-0" aria-hidden="true" />
      <div className="flex-1 space-y-1.5">
        <SkeletonLine width="55%" height="13px" />
        <SkeletonLine width="35%" height="11px" />
      </div>
      <SkeletonLine width="60px" height="20px" className="rounded" />
    </div>
  )
}

/**
 * LoadingPanel — Spinner centered inside a panel container.
 */
interface LoadingPanelProps {
  message?: string
  className?: string
}

export function LoadingPanel({ message = 'Loading…', className }: LoadingPanelProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center gap-3 py-12', className)}
      role="status"
      aria-label={message}
    >
      <LoadingSpinner size="lg" />
      <p className="text-[13px] text-text-muted font-medium">{message}</p>
    </div>
  )
}

/**
 * ErrorPanel — Shown when a fetch or operation fails.
 */
interface ErrorPanelProps {
  title?: string
  message?: string
  action?: ReactNode
  className?: string
}

export function ErrorPanel({
  title = 'Something went wrong',
  message = 'Unable to load this section. Please try again.',
  action,
  className,
}: ErrorPanelProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-12 px-6 text-center',
        className
      )}
      role="alert"
    >
      {/* Error icon */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
        style={{ background: 'var(--color-critical-subtle)' }}
        aria-hidden="true"
      >
        <svg
          width="18" height="18" viewBox="0 0 24 24"
          fill="none" stroke="var(--color-critical)"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <div className="space-y-0.5">
        <p className="text-[14px] font-semibold text-text-primary">{title}</p>
        <p className="text-[12px] text-text-secondary max-w-[260px]">{message}</p>
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  )
}
