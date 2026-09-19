'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, X, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react'
import type { SelectedItem } from './types'

interface SelectedAreasPanelProps {
  selectedItems: SelectedItem[]
  onRemoveItem: (id: string) => void
  onClearAll: () => void
  onContinue: () => void
  isLoading?: boolean
  emptyText?: string
  helperText?: string
  className?: string
}

export function SelectedAreasPanel({
  selectedItems,
  onRemoveItem,
  onClearAll,
  onContinue,
  isLoading = false,
  emptyText = 'Your selected areas appear here',
  helperText = 'You can select more than one area.',
  className = '',
}: SelectedAreasPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const hasSelections = selectedItems.length > 0
  const maxCollapsedChips = 3
  const isOverflowing = selectedItems.length > maxCollapsedChips

  const displayedChips =
    isOverflowing && !isExpanded
      ? selectedItems.slice(0, maxCollapsedChips)
      : selectedItems

  return (
    <div className={`space-y-2 pt-0.5 shrink-0 ${className}`}>
      {/* ── Header: Title, Count Badge & Clear All ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-[13.5px] sm:text-[14.5px] font-extrabold text-[#17191F]">
            Selected Areas
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
            aria-label="Clear all selections"
          >
            <Trash2 size={12} />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* ── Selected Chips Bounded Box ── */}
      <div
        className={`rounded-2xl bg-[#F8FAFC] border border-[#DFE8F1] p-2 flex flex-wrap items-center gap-2 transition-all duration-150 ${
          isExpanded
            ? 'max-h-[76px] overflow-y-auto'
            : 'min-h-[40px] max-h-[50px] overflow-hidden'
        }`}
      >
        <AnimatePresence>
          {displayedChips.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.1 }}
              className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full bg-white border border-[#DFE8F1] shadow-2xs text-[11.5px] sm:text-[12px] font-extrabold text-[#17191F]"
            >
              {/* Coral indicator dot */}
              <span className="w-2 h-2 rounded-full bg-[#EF4444] shrink-0" />
              <span className="whitespace-nowrap">{item.label}</span>
              <button
                type="button"
                onClick={() => onRemoveItem(item.id)}
                className="w-4 h-4 rounded-full flex items-center justify-center text-[#6F7480] hover:text-[#EF4444] hover:bg-[#FEE2E2] transition-colors cursor-pointer ml-0.5"
                aria-label={`Remove ${item.label}`}
              >
                <X size={10} className="stroke-[2.5]" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* "+N more" / "Show less" toggle badge */}
        {isOverflowing && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E2E8F0] hover:bg-[#CBD5E1] text-[#334155] text-[11px] font-extrabold transition-colors cursor-pointer"
            aria-label={isExpanded ? 'Show fewer chips' : `Show ${selectedItems.length - maxCollapsedChips} more items`}
          >
            {isExpanded ? (
              <>
                <span>Less</span>
                <ChevronUp size={10} className="stroke-[2.5]" />
              </>
            ) : (
              <>
                <span>+{selectedItems.length - maxCollapsedChips} more</span>
                <ChevronDown size={10} className="stroke-[2.5]" />
              </>
            )}
          </button>
        )}

        {!hasSelections && (
          <p className="text-[11.5px] text-[#6F7480] italic px-1 font-medium">
            {emptyText}
          </p>
        )}
      </div>

      {/* ── Continue Button (Always Visible) ── */}
      <div className="space-y-1 pt-0.5">
        <button
          type="button"
          onClick={onContinue}
          disabled={!hasSelections || isLoading}
          className={`w-full h-11 sm:h-12 rounded-xl text-white text-[14.5px] sm:text-[15.5px] font-extrabold flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer shadow-md active:scale-98 ${
            !hasSelections
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:shadow-lg'
          }`}
          style={{
            background: 'linear-gradient(135deg, #347FCE 0%, #2365B5 52%, #174A91 100%)',
            boxShadow: hasSelections
              ? '0 4px 16px rgba(35, 101, 181, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.25)'
              : undefined,
          }}
          aria-label="Continue to symptom details"
        >
          <span>Continue</span>
          <ArrowRight size={17} className="stroke-[2.5]" />
        </button>

        <p className="text-center text-[10.5px] text-[#6F7480] font-medium leading-none">
          {helperText}
        </p>
      </div>
    </div>
  )
}
