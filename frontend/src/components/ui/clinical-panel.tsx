import { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * ClinicalPanel — The fundamental content grouping unit for clinical interfaces.
 *
 * Design principles:
 * - Flat surface with a subtle border (no dramatic elevation/shadow on canvas)
 * - Clear semantic header with optional section label and action
 * - Consistent padding rhythm based on 4px grid
 * - Never nest more than 1 level deep
 */

interface ClinicalPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  /** Optional left-aligned section label */
  label?: string
  /** Optional right-aligned action element */
  action?: ReactNode
  /** Elevates the panel with focused priority */
  elevated?: boolean
  /** Embedded recessed styling for nested sub-panels */
  embedded?: boolean
  /** Removes padding from content area (for full-bleed tables etc.) */
  flush?: boolean
}

export function ClinicalPanel({
  children,
  label,
  action,
  elevated = false,
  embedded = false,
  flush = false,
  className,
  ...props
}: ClinicalPanelProps) {
  return (
    <div
      className={cn(
        'rounded-2xl overflow-hidden transition-all',
        embedded
          ? 'surface-embedded'
          : elevated
          ? 'surface-focused'
          : 'surface-clinical-card',
        className
      )}
      {...props}
    >
      {(label || action) && (
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#DFE8F1]">
          {label && (
            <h3 className="text-[13.5px] font-bold text-text-primary tracking-tight">
              {label}
            </h3>
          )}
          {!label && <div />}
          {action && (
            <div className="flex items-center gap-2">
              {action}
            </div>
          )}
        </div>
      )}
      <div className={cn(!flush && 'px-5 py-4')}>
        {children}
      </div>
    </div>
  )
}

/**
 * ClinicalSection — Groups multiple ClinicalPanels under a page section heading.
 */
interface ClinicalSectionProps extends HTMLAttributes<HTMLDivElement> {
  heading?: string
  description?: string
  children: ReactNode
}

export function ClinicalSection({
  heading,
  description,
  children,
  className,
  ...props
}: ClinicalSectionProps) {
  return (
    <section className={cn('space-y-4', className)} {...props}>
      {(heading || description) && (
        <div className="space-y-0.5">
          {heading && (
            <h2 className="text-[15px] font-semibold text-text-primary">{heading}</h2>
          )}
          {description && (
            <p className="text-[13px] text-text-secondary">{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  )
}

/**
 * ClinicalRow — A labeled key-value pair within a ClinicalPanel.
 *
 * Used for structured data display (demographics, vitals, medications).
 */
interface ClinicalRowProps {
  label: string
  /** The clinical value — can be a string or a ReactNode for rich values */
  value?: ReactNode
  /** Supplemental detail line below the value */
  detail?: string
  /** Right-aligned — typically a ProvenanceChip */
  badge?: ReactNode
}

export function ClinicalRow({ label, value, detail, badge }: ClinicalRowProps) {
  return (
    <div className="grid grid-cols-[160px_1fr] gap-4 py-2 border-b border-border last:border-0 items-start">
      <dt
        className="text-[11px] font-semibold uppercase tracking-[0.04em] text-text-muted pt-0.5 shrink-0"
      >
        {label}
      </dt>
      <dd className="flex items-start justify-between gap-3 min-w-0">
        <div className="min-w-0">
          <span
            className="text-[14px] font-medium text-text-primary block"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {value ?? <span className="text-text-disabled italic text-[13px] font-sans">Not recorded</span>}
          </span>
          {detail && (
            <span className="text-[12px] text-text-muted mt-0.5 block">{detail}</span>
          )}
        </div>
        {badge && <div className="shrink-0 mt-0.5">{badge}</div>}
      </dd>
    </div>
  )
}

/**
 * ClinicalEmptyState — Shown inside a ClinicalPanel when there's no data.
 */
interface ClinicalEmptyStateProps {
  message: string
  description?: string
  icon?: ReactNode
}

export function ClinicalEmptyState({ message, description, icon }: ClinicalEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-6 text-center gap-2">
      {icon && (
        <div className="w-10 h-10 rounded-full bg-surface-subtle flex items-center justify-center text-text-muted mb-2">
          {icon}
        </div>
      )}
      <p className="text-[14px] font-medium text-text-secondary">{message}</p>
      {description && (
        <p className="text-[12px] text-text-muted max-w-[260px]">{description}</p>
      )}
    </div>
  )
}
