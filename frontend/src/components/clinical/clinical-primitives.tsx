'use client'

import React, { useState } from 'react'
import {
  ChevronDown,
  ChevronUp,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ══════════════════════════════════════════════════════════════════════
   SOURCE BADGE — Distinguish clinical provenance types with restraint
   Strictly capped to Phase 1 palette; explicit AI labeling
══════════════════════════════════════════════════════════════════════ */

export type ClinicalSourceType =
  | 'patient'
  | 'voice'
  | 'ocr'
  | 'ai'
  | 'clinician'
  | 'abdm'
  | 'unverified'

const SOURCE_CONFIG: Record<
  ClinicalSourceType,
  { label: string; textClass: string; bgClass: string; borderClass: string }
> = {
  patient: {
    label: 'Patient reported',
    textClass: 'text-[var(--color-brand)]',
    bgClass: 'bg-[var(--color-brand-mist)]',
    borderClass: 'border-[var(--color-border)]',
  },
  voice: {
    label: 'Voice intake',
    textClass: 'text-[var(--color-brand)]',
    bgClass: 'bg-[var(--color-brand-mist)]',
    borderClass: 'border-[var(--color-border)]',
  },
  ocr: {
    label: 'OCR extracted',
    textClass: 'text-[var(--color-verified-text)]',
    bgClass: 'bg-[var(--color-verified-subtle)]',
    borderClass: 'border-[var(--color-verified-subtle)]',
  },
  ai: {
    label: 'AI Summarized · Unconfirmed',
    textClass: 'text-[var(--color-text-secondary)]',
    bgClass: 'bg-[var(--color-surface-subtle)]',
    borderClass: 'border-[var(--color-border)]',
  },
  clinician: {
    label: 'Clinician confirmed',
    textClass: 'text-[var(--color-verified-text)]',
    bgClass: 'bg-[var(--color-verified-subtle)]',
    borderClass: 'border-[var(--color-verified-subtle)]',
  },
  abdm: {
    label: 'ABDM record',
    textClass: 'text-[var(--color-brand)]',
    bgClass: 'bg-[var(--color-brand-mist)]',
    borderClass: 'border-[var(--color-border)]',
  },
  unverified: {
    label: 'Needs verification',
    textClass: 'text-[var(--color-warning-text)]',
    bgClass: 'bg-[var(--color-warning-subtle)]',
    borderClass: 'border-[var(--color-warning-subtle)]',
  },
}

export function SourceBadge({
  type,
  className,
}: {
  type: ClinicalSourceType
  className?: string
}) {
  const conf = SOURCE_CONFIG[type] || SOURCE_CONFIG.patient
  return (
    <span
      className={cn(
        'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border select-none shrink-0',
        conf.textClass,
        conf.bgClass,
        conf.borderClass,
        className
      )}
    >
      {conf.label}
    </span>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   FACT CARD — Fixed 4-zone structure: Category / Primary / Detail / Source
   Pure white container, ink-on-white hierarchy, zero muddy grey fills
══════════════════════════════════════════════════════════════════════ */

export interface FactCardProps {
  category: string
  primary: React.ReactNode
  detail?: string
  sourceType: ClinicalSourceType
  sourceName?: string
  factId?: string
  onClick?: () => void
  className?: string
}

export function FactCard({
  category,
  primary,
  detail,
  sourceType,
  sourceName,
  factId,
  onClick,
  className,
}: FactCardProps) {
  const [expanded, setExpanded] = useState(false)
  const isLongDetail = detail && detail.length > 70

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 flex flex-col justify-between gap-2.5 transition-all text-left min-w-0 shadow-xs',
        onClick ? 'cursor-pointer hover:border-[var(--color-brand)] hover:shadow-sm' : '',
        className
      )}
    >
      {/* Zone 1: Category + Source Badge */}
      <div className="flex items-center justify-between gap-2 min-w-0">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] truncate">
          {category}
        </span>
        <SourceBadge type={sourceType} />
      </div>

      {/* Zone 2: Primary Finding (dominant) */}
      <div className="text-[13.5px] font-semibold text-[var(--color-text-primary)] leading-snug min-w-0">
        {primary}
      </div>

      {/* Zone 3: Supporting Detail (line clamped if long) */}
      {detail && (
        <div className="min-w-0">
          <p
            className={cn(
              'text-[12.5px] text-[var(--color-text-secondary)] leading-relaxed',
              !expanded && isLongDetail && 'line-clamp-2'
            )}
          >
            {detail}
          </p>
          {isLongDetail && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setExpanded(!expanded)
              }}
              className="mt-1 text-[11px] font-semibold text-[var(--color-brand)] flex items-center gap-0.5 hover:underline"
            >
              {expanded ? (
                <>
                  <span>Show less</span> <ChevronUp size={12} />
                </>
              ) : (
                <>
                  <span>Read more</span> <ChevronDown size={12} />
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Zone 4: Source Attribution + Inspect Link */}
      {(sourceName || factId) && (
        <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)] text-[11px] text-[var(--color-text-muted)] min-w-0">
          <span className="truncate pr-2">{sourceName || 'VAIDYA Multi-Modal Extraction'}</span>
          {onClick && (
            <span className="font-bold text-[var(--color-brand)] shrink-0 flex items-center gap-0.5">
              Inspect →
            </span>
          )}
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   STANDALONE SNAPSHOT BLOCK — Single-purpose compact units
   Pure white / light inset surface, capped density
══════════════════════════════════════════════════════════════════════ */

export interface SnapshotBlockProps {
  label: string
  value: React.ReactNode
  icon?: LucideIcon
  accent?: 'critical' | 'verified' | 'warning' | 'brand' | 'neutral'
  className?: string
}

export function SnapshotBlock({
  label,
  value,
  icon: Icon,
  accent = 'neutral',
  className,
}: SnapshotBlockProps) {
  const accentClasses = {
    neutral: 'text-[var(--color-text-primary)]',
    brand: 'text-[var(--color-brand)]',
    critical: 'text-[var(--color-critical)]',
    verified: 'text-[var(--color-verified-text)]',
    warning: 'text-[var(--color-warning-text)]',
  }[accent]

  return (
    <div
      className={cn(
        'p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col justify-between gap-1 min-w-0 shadow-2xs',
        accent === 'critical' && 'border-l-4 border-l-[var(--color-critical)]',
        accent === 'verified' && 'border-l-4 border-l-[var(--color-verified)]',
        className
      )}
    >
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] min-w-0">
        {Icon && <Icon size={12} className="shrink-0 opacity-75" />}
        <span className="truncate">{label}</span>
      </div>
      <div className={cn('text-[13px] font-semibold leading-snug min-w-0', accentClasses)}>
        {value}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   CLINICAL SECTION HEADER
══════════════════════════════════════════════════════════════════════ */

export function ClinicalSectionHeader({
  icon: Icon,
  title,
  subtitle,
  badge,
  className,
}: {
  icon?: LucideIcon
  title: string
  subtitle?: string
  badge?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--color-border)]',
        className
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {Icon && (
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-[var(--color-brand-mist)] text-[var(--color-brand)] border border-[var(--color-border)]">
            <Icon size={15} />
          </div>
        )}
        <div className="min-w-0">
          <h2 className="text-[15px] font-bold text-[var(--color-text-primary)] truncate">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[11.5px] text-[var(--color-text-muted)] truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {badge && <div className="shrink-0">{badge}</div>}
    </div>
  )
}

