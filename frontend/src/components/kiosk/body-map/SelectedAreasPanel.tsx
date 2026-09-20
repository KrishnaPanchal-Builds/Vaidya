'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, X, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react'
import type { SelectedItem } from './types'
import {
  getLocalizedBodyRegionLabel,
  getLocalizedBodyDiagramUI,
} from '@/lib/translations/body-regions-translations'
import { useKioskTranslation } from '@/lib/hooks/use-kiosk-translation'
import type { SupportedKioskLanguage } from '@/lib/translations/kiosk-translations'

interface SelectedAreasPanelProps {
  selectedItems: SelectedItem[]
  onRemoveItem: (id: string) => void
  onClearAll: () => void
  onContinue: () => void
  isLoading?: boolean
  emptyText?: string
  helperText?: string
  language?: SupportedKioskLanguage
  className?: string
}

export function SelectedAreasPanel({
  selectedItems,
  onRemoveItem,
  onClearAll,
  onContinue,
  emptyText,
  helperText,
  language: propLanguage,
  className = '',
}: SelectedAreasPanelProps) {
  const { language: contextLanguage } = useKioskTranslation()
  const language = propLanguage || contextLanguage || 'en'
  const ui = getLocalizedBodyDiagramUI(language)

  const [isExpanded, setIsExpanded] = useState(false)
  const hasSelections = selectedItems.length > 0
  const maxCollapsedChips = 3
  const isOverflowing = selectedItems.length > maxCollapsedChips

  const displayedChips =
    isOverflowing && !isExpanded
      ? selectedItems.slice(0, maxCollapsedChips)
      : selectedItems

  const resolvedEmptyText = emptyText || ui.emptySelectionText
  const resolvedHelperText = helperText || ui.helperText

  return (
    <div className={`space-y-2 pt-0.5 shrink-0 ${className}`}>
      {/* ── Header: Title, Count Badge & Clear All ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-[13.5px] sm:text-[14.5px] font-extrabold text-[#17191F]">
            {ui.selectedAreasTitle}
          </h3>
          <span className="px-2 py-0.5 rounded-full bg-[#EEF5FC] text-[#2365B5] text-[11px] font-bold border border-[#CBD8E5]">
            {selectedItems.length}
          </span>
        </div>

        {hasSelections && (
          <button
            type="button"
            onClick={onClearAll}
            className="flex items-center gap-1 text-[12px] font-bold text-[#6F7480] hover:text-[#D92D20] transition-colors cursor-pointer"
            aria-label={ui.clearAll}
          >
            <Trash2 size={12} />
            <span>{ui.clearAll}</span>
          </button>
        )}
      </div>

      {/* ── Selected Chips Bounded Box ── */}
      <div
        className={`rounded-2xl bg-[#F8FAFC] border border-[#DFE8F1] p-2 flex flex-wrap items-center gap-2 transition-all duration-150 ${
          isExpanded
            ? 'max-h-[86px] overflow-y-auto'
            : 'min-h-[40px] max-h-[50px] overflow-hidden'
        }`}
      >
        <AnimatePresence>
          {displayedChips.map((item) => {
            const localizedLabel = getLocalizedBodyRegionLabel(item.id, language)

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.1 }}
                className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full bg-white border border-[#DFE8F1] shadow-2xs text-[11px] sm:text-[12px] font-extrabold text-[#17191F] max-w-[220px]"
              >
                {/* Coral indicator dot */}
                <span className="w-2 h-2 rounded-full bg-[#EF4444] shrink-0" />
                <span className="truncate" title={localizedLabel}>
                  {localizedLabel}
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id)}
                  className="w-4 h-4 rounded-full flex items-center justify-center text-[#6F7480] hover:text-[#EF4444] hover:bg-[#FEE2E2] transition-colors cursor-pointer ml-0.5 shrink-0"
                  aria-label={`Remove ${localizedLabel}`}
                >
                  <X size={10} className="stroke-[2.5]" />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* "+N more" / "Show less" toggle badge */}
        {isOverflowing && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EEF5FC] text-[#2365B5] text-[11px] font-bold border border-[#CBD8E5] hover:bg-[#D3E2F0] transition-colors cursor-pointer"
          >
            <span>
              {isExpanded
                ? ui.showLess
                : ui.showMore(selectedItems.length - maxCollapsedChips)}
            </span>
            {isExpanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          </button>
        )}

        {!hasSelections && (
          <p className="text-[12px] text-[#6F7480] italic px-1">
            {resolvedEmptyText}
          </p>
        )}
      </div>

      {/* Helper instruction string */}
      {hasSelections && (
        <p className="text-[10.5px] text-[#6F7480] px-1 font-medium">
          {resolvedHelperText}
        </p>
      )}

      {/* Continue Action Button */}
      {onContinue && (
        <button
          type="button"
          onClick={onContinue}
          disabled={!hasSelections}
          className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#2365B5] to-[#174A91] text-white text-[12.5px] font-extrabold flex items-center justify-center gap-2 shadow-xs hover:shadow-md transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <span>{ui.continueBtn || 'Continue'}</span>
          <ArrowRight size={15} />
        </button>
      )}
    </div>
  )
}
