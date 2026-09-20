'use client'

import React, { useState } from 'react'
import { AlertTriangle, Clock, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react'
import { RedFlagAlert } from '@/types'
import { formatTime } from '@/lib/utils'

interface RedFlagBannerProps {
  alert: RedFlagAlert
  triageStatus?: 'pending' | 'acknowledged'
  onViewRecord?: () => void
}

export function RedFlagBanner({ alert, triageStatus = 'pending', onViewRecord }: RedFlagBannerProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="border border-[#FECDCA] border-l-4 border-l-[#D92D20] rounded-2xl bg-[#FEF3F2] shadow-sm transition-all overflow-hidden">
      {/* ── Compact 44px Sticky Header Row ── */}
      <div className="min-h-[44px] px-3.5 sm:px-4 py-2 flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {/* Pulsing Alert Badge */}
          <div className="relative flex items-center justify-center shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D92D20] animate-ping absolute opacity-75" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#D92D20]" />
          </div>

          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[12px] sm:text-[12.5px] font-extrabold text-[#D92D20] uppercase tracking-wider shrink-0 flex items-center gap-1">
              <AlertTriangle size={14} className="text-[#D92D20]" />
              Immediate Priority:
            </span>

            <p className="text-[13px] font-bold text-[#17191F] truncate min-w-0">
              <span className="text-[#D92D20]">{alert.ruleName}</span>
              {alert.triggerText && (
                <span className="text-[#6F7480] font-normal italic ml-2 hidden md:inline">
                  — &ldquo;{alert.triggerText.slice(0, 55)}...&rdquo;
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Right Actions: Protocol Pill & Expand Toggle */}
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-white border border-[#FECDCA] text-[#D92D20] hidden sm:inline-block">
            {alert.ruleId}
          </span>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[#FECDCA] text-[#D92D20] hover:bg-[#FEE4E2] text-[11.5px] font-extrabold transition-colors cursor-pointer"
            aria-expanded={isExpanded}
          >
            <span>{isExpanded ? 'Hide Details' : 'Review Protocol'}</span>
            {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>
      </div>

      {/* ── Collapsible Full Clinical Detail Drawer ── */}
      {isExpanded && (
        <div className="px-4 pb-3.5 pt-2 border-t border-[#FECDCA]/60 space-y-2.5 text-[12.5px]">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#6F7480] block mb-1">
              Patient Stated During Voice Triage:
            </span>
            <div className="bg-white rounded-xl p-3 border border-[#FECDCA] shadow-2xs">
              <p className="text-[13.5px] italic text-[#17191F] font-bold">
                &ldquo;{alert.triggerText}&rdquo;
              </p>
              {alert.triggerTextTranslated && (
                <p className="text-[12px] text-[#4B5565] mt-1 font-medium">
                  Translated English: {alert.triggerTextTranslated}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-[11px] font-bold bg-white border border-[#DFE8F1] rounded-lg px-2.5 py-1 text-[#4B5565]">
              Protocol: {alert.ruleName}
            </span>
            <span className="text-[11px] font-bold bg-white border border-[#DFE8F1] rounded-lg px-2.5 py-1 text-[#4B5565] flex items-center gap-1">
              <Clock size={12} /> Triggered {formatTime(alert.alertedAt)}
            </span>
            {triageStatus === 'acknowledged' ? (
              <span className="text-[11px] font-bold text-[#079455] flex items-center gap-1 bg-white border border-[#A6F4C5] rounded-lg px-2.5 py-1">
                ✓ Triage acknowledged
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#D92D20] bg-white border border-[#FECDCA] rounded-lg px-2.5 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D92D20]" />
                Awaiting physician evaluation
              </span>
            )}
            {onViewRecord && (
              <button
                type="button"
                onClick={onViewRecord}
                className="ml-auto text-[12px] font-bold text-[#2365B5] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Triage Log</span>
                <ArrowRight size={12} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
