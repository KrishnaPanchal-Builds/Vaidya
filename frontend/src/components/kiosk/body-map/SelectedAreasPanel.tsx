'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, X, ArrowRight } from 'lucide-react'

export interface SelectedItem {
  id: string
  label: string
}

interface SelectedAreasPanelProps {
  selectedItems: SelectedItem[]
  onRemoveItem: (id: string) => void
  onClearAll: () => void
  onContinue: () => void
  isLoading?: boolean
  className?: string
}

export function SelectedAreasPanel({
  selectedItems,
  onRemoveItem,
  onClearAll,
  onContinue,
  isLoading = false,
  className = '',
}: SelectedAreasPanelProps) {
  const hasSelections = selectedItems.length > 0

  return (
    <div className={`space-y-2.5 pt-1 shrink-0 ${className}`}>
      {/* Selected Areas Header & Clear All */}
      <div className="flex items-center justify-between">
        <h3 className="text-[13.5px] font-extrabold text-[#17191F]">
          Selected Areas ({selectedItems.length})
        </h3>

        {hasSelections && (
          <button
            onClick={onClearAll}
            className="flex items-center gap-1 text-[11.5px] font-bold text-[#2365B5] hover:text-[#174A91] transition-colors cursor-pointer"
            aria-label="Clear all selections"
          >
            <Trash2 size={12} />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Selected Chips Container */}
      <div className="min-h-[38px] max-h-[58px] overflow-y-auto p-1.5 rounded-xl bg-[#F8FAFC] border border-[#DFE8F1] flex flex-wrap items-center gap-1.5">
        <AnimatePresence>
          {selectedItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.12 }}
              className="inline-flex items-center gap-1.5 pl-2 pr-1.5 py-0.5 rounded-full bg-white border border-[#DFE8F1] shadow-2xs text-[11.5px] font-bold text-[#17191F]"
            >
              {/* Red / Coral Dot Marker */}
              <span className="w-2 h-2 rounded-full bg-[#EF4444] shrink-0" />
              <span>{item.label}</span>
              <button
                onClick={() => onRemoveItem(item.id)}
                className="w-4 h-4 rounded-full flex items-center justify-center text-[#6F7480] hover:text-[#17191F] hover:bg-[#F1F4F9] transition-colors cursor-pointer"
                aria-label={`Remove ${item.label}`}
              >
                <X size={10} className="stroke-[2.5]" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {!hasSelections && (
          <p className="text-[11px] text-[#6F7480] italic px-1">
            Touch a body part or choose a category above
          </p>
        )}
      </div>

      {/* Big Tactile Blue Continue Button */}
      <div className="space-y-1 pt-0.5">
        <button
          onClick={onContinue}
          disabled={!hasSelections || isLoading}
          className={`w-full h-11 sm:h-12 rounded-xl text-white text-[14.5px] font-extrabold flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer shadow-md active:scale-98 ${
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
          aria-label="Continue to symptom duration"
        >
          <span>Continue</span>
          <ArrowRight size={16} className="stroke-[2.5]" />
        </button>

        <p className="text-center text-[10.5px] text-[#6F7480] font-medium">
          You can select multiple areas
        </p>
      </div>
    </div>
  )
}

