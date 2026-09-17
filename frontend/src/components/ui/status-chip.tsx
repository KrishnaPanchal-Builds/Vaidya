import { HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * StatusChip — Consistent status indicator for queue items, patient states, etc.
 *
 * Design principle: Status must always be communicated via both color AND text.
 * Never rely on color alone to convey state.
 */
const statusChipVariants = cva(
  'inline-flex items-center gap-1.5 text-[11px] font-semibold rounded px-2 py-0.5 select-none tracking-wide',
  {
    variants: {
      status: {
        // ─── Queue / Workflow states ───────────────────────────────────
        waiting:      'bg-warning-subtle  text-warning-text  border border-warning/20',
        'in-progress':'bg-info-subtle     text-info-text     border border-info/20',
        completed:    'bg-verified-subtle text-verified-text border border-verified/20',
        cancelled:    'bg-surface-dim     text-text-muted    border border-border',

        // ─── Clinical states ────────────────────────────────────────────
        active:       'bg-verified-subtle text-verified-text border border-verified/20',
        inactive:     'bg-surface-dim     text-text-muted    border border-border',
        pending:      'bg-warning-subtle  text-warning-text  border border-warning/20',
        critical:     'bg-critical-subtle text-critical-text border border-critical/20',
        flagged:      'bg-warning-subtle  text-warning-text  border border-warning/20',

        // ─── System / Integration ───────────────────────────────────────
        healthy:      'bg-verified-subtle text-verified-text border border-verified/20',
        degraded:     'bg-warning-subtle  text-warning-text  border border-warning/20',
        down:         'bg-critical-subtle text-critical-text border border-critical/20',
        unknown:      'bg-surface-dim     text-text-muted    border border-border',
      },
    },
    defaultVariants: { status: 'unknown' },
  }
)

/** Dot indicator maps to status color */
const DOT_COLORS: Record<string, string> = {
  waiting:      'var(--color-warning)',
  'in-progress':'var(--color-info)',
  completed:    'var(--color-verified)',
  cancelled:    'var(--color-text-disabled)',
  active:       'var(--color-verified)',
  inactive:     'var(--color-text-disabled)',
  pending:      'var(--color-warning)',
  critical:     'var(--color-critical)',
  flagged:      'var(--color-warning)',
  healthy:      'var(--color-verified)',
  degraded:     'var(--color-warning)',
  down:         'var(--color-critical)',
  unknown:      'var(--color-text-disabled)',
}

/** Which states should have a pulsing dot (live urgency) */
const PULSE_STATES = new Set(['critical', 'flagged', 'down', 'waiting'])

interface StatusChipProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'>,
    VariantProps<typeof statusChipVariants> {
  /** Display label for the chip */
  label: string
  /** Show an animated dot indicator (auto-enabled for urgent states) */
  pulse?: boolean
}

export function StatusChip({ label, status, pulse, className, ...props }: StatusChipProps) {
  const dotColor = DOT_COLORS[status ?? 'unknown']
  const shouldPulse = pulse ?? (status ? PULSE_STATES.has(status) : false)

  return (
    <span className={cn(statusChipVariants({ status }), className)} {...props}>
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full shrink-0',
          shouldPulse && 'animate-clinical-pulse'
        )}
        style={{ background: dotColor }}
        aria-hidden="true"
      />
      {label}
    </span>
  )
}
