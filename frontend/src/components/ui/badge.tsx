import { HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Badge — Consistent status and provenance indicator.
 *
 * Design principle: Every badge must have text content.
 * Never communicate status by color alone.
 */
const badgeVariants = cva(
  'inline-flex items-center gap-1 text-[11px] font-semibold px-1.5 py-0.5 rounded-xs select-none tracking-wide',
  {
    variants: {
      variant: {
        // Neutral / default
        default:
          'bg-surface-subtle text-text-secondary border border-border',
        // Brand — information
        accent:
          'bg-accent-subtle text-accent border border-brand/20',
        // Success / verified
        verified:
          'bg-verified-subtle text-verified-text border border-verified/20',
        // Warning
        warning:
          'bg-warning-subtle text-warning-text border border-warning/20',
        // Emergency / critical
        critical:
          'bg-critical-subtle text-critical-text border border-critical/20',
        // AYUSH Ayurvedic
        ayush:
          'bg-ayush-subtle text-ayush-text border border-ayush/20',
        // Information
        info:
          'bg-info-subtle text-info-text border border-info/20',

        // ─── Clinical Provenance Tiers ─────────────────────────────
        // Tier 1 — Physician confirmed
        tier1: 'bg-verified-subtle text-verified-text border border-verified/20',
        // Tier 2 — OCR extracted (good confidence)
        tier2: 'bg-info-subtle text-info-text border border-info/20',
        // Tier 3 — Patient interview / voice intake
        tier3: 'bg-surface-subtle text-text-secondary border border-border',
        // Tier 4 — OCR extracted (low confidence / warn)
        tier4: 'bg-warning-subtle text-warning-text border border-warning/20',
        // Tier 5 — AI estimated / unverified
        tier5: 'bg-highlight-subtle text-highlight border border-highlight/20',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}
