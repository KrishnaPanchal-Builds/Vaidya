'use client'

import { useState } from 'react'
import { TimelineEvent } from '@/types'
import { formatIndianDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'


interface TimelineProps {
  events: TimelineEvent[]
  onEventClick?: (event: TimelineEvent) => void
}

export function Timeline({ events, onEventClick }: TimelineProps) {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({})

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const sorted = [...events].sort((a, b) => {
    if (!a.eventDate) return 1
    if (!b.eventDate) return -1
    return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
  })

  return (
    <div className="space-y-3">
      {sorted.map((event, index) => {
        const isLatest = index === 0
        const isConflict = Boolean(event.isConflict)
        const isExpanded = expandedIds[event.id]
        const formattedDate = event.eventDate
          ? `${event.datePrecision === 'EXACT' ? '' : '~'}${formatIndianDate(event.eventDate)}`
          : 'Historical'

        return (
          <div
            key={event.id}
            className="flex items-start gap-3 sm:gap-4 group"
            onClick={() => onEventClick?.(event)}
          >
            {/* Fixed Date Column */}
            <div className="w-24 sm:w-28 shrink-0 text-right pt-2.5 font-mono text-[11px] sm:text-[12px] select-none">
              <span
                className={cn(
                  'font-semibold',
                  isConflict
                    ? 'text-[var(--color-critical)] font-bold'
                    : isLatest
                    ? 'text-[var(--color-brand)] font-bold'
                    : 'text-[var(--color-text-muted)]'
                )}
              >
                {formattedDate}
              </span>
            </div>

            {/* Vertical Connector Node */}
            <div className="relative flex flex-col items-center self-stretch pt-3 shrink-0">
              <div
                className={cn(
                  'w-2.5 h-2.5 rounded-full border-2 transition-transform',
                  isConflict
                    ? 'bg-[var(--color-critical)] border-[var(--color-critical)]'
                    : isLatest
                    ? 'bg-[var(--color-brand)] border-[var(--color-brand)]'
                    : 'bg-white border-[var(--color-border)]'
                )}
              />
              {index < sorted.length - 1 && (
                <div className="w-px flex-1 bg-[var(--color-border)] my-1 min-h-[24px]" />
              )}
            </div>

            {/* Event Content Card (Level 2) */}
            <div
              className={cn(
                'flex-1 rounded-xl border p-3 sm:p-3.5 transition-all text-left min-w-0 shadow-2xs',
                onEventClick ? 'cursor-pointer hover:border-[var(--color-brand)]' : '',
                isConflict
                  ? 'bg-white border-[var(--color-border)] border-l-4 border-l-[var(--color-critical)]'
                  : isLatest
                  ? 'bg-white border-[var(--color-border)] border-l-4 border-l-[var(--color-brand)]'
                  : 'bg-[var(--color-surface)] border-[var(--color-border)]'
              )}
            >
              <div className="flex items-start justify-between gap-2 min-w-0">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4
                      className={cn(
                        'leading-snug truncate',
                        isConflict
                          ? 'text-[13.5px] font-bold text-[var(--color-critical)]'
                          : isLatest
                          ? 'text-[13.5px] font-bold text-[var(--color-text-primary)]'
                          : 'text-[13px] font-medium text-[var(--color-text-secondary)]'
                      )}
                    >
                      {event.title}
                    </h4>
                    {isConflict && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[var(--color-critical-subtle)] text-[var(--color-critical)] border border-[var(--color-critical-subtle)]">
                        <AlertTriangle size={10} /> Discrepancy
                      </span>
                    )}
                  </div>

                  {event.detail && (
                    <p
                      className={cn(
                        'mt-0.5 leading-normal',
                        isLatest || isConflict
                          ? 'text-[12px] text-[var(--color-text-secondary)]'
                          : 'text-[12px] text-[var(--color-text-muted)]',
                        !isExpanded && 'line-clamp-1'
                      )}
                    >
                      {event.detail}
                    </p>
                  )}
                </div>

                {event.detail && event.detail.length > 50 && (
                  <button
                    type="button"
                    onClick={(e) => toggleExpand(event.id, e)}
                    className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] p-0.5 shrink-0"
                    title={isExpanded ? 'Collapse' : 'Expand details'}
                  >
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

