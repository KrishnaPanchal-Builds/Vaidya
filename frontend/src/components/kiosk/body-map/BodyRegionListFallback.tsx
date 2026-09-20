'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Check, Plus } from 'lucide-react'
import {
  BODY_REGIONS,
  SYMPTOM_CATEGORIES,
  type BodyRegionId,
} from './types'
import {
  getLocalizedBodyRegionLabel,
  getLocalizedBodyDiagramUI,
} from '@/lib/translations/body-regions-translations'
import type { SupportedKioskLanguage } from '@/lib/translations/kiosk-translations'

interface BodyRegionListFallbackProps {
  selectedRegions: BodyRegionId[]
  onToggleRegion: (regionId: BodyRegionId) => void
  language: SupportedKioskLanguage
  className?: string
}

export function BodyRegionListFallback({
  selectedRegions,
  onToggleRegion,
  language,
  className = '',
}: BodyRegionListFallbackProps) {
  const ui = getLocalizedBodyDiagramUI(language)

  // Group body regions by symptom category
  const regionsByCategory = SYMPTOM_CATEGORIES.map((cat) => {
    const matchingRegions = Object.values(BODY_REGIONS).filter(
      (r) => r.categoryId === cat.id
    )
    return {
      category: cat,
      regions: matchingRegions,
    }
  }).filter((group) => group.regions.length > 0)

  return (
    <div
      className={`w-full h-full min-h-0 bg-white rounded-3xl border border-[#DFE8F1] shadow-card flex flex-col p-3 sm:p-4 overflow-hidden select-none ${className}`}
    >
      {/* Header */}
      <div className="shrink-0 mb-2 pb-2 border-b border-[#DFE8F1] flex items-center justify-between">
        <div>
          <h3 className="text-[13.5px] sm:text-[14.5px] font-extrabold text-[#17191F]">
            {ui.listViewTitle}
          </h3>
          <p className="text-[11px] font-medium text-[#6F7480]">
            {ui.listViewSubtitle}
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-[#EEF5FC] text-[#2365B5] text-[11px] font-extrabold border border-[#CBD8E5]">
          {selectedRegions.length} selected
        </span>
      </div>

      {/* Categorized Scrollable List */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-3">
        {regionsByCategory.map((group) => (
          <div key={group.category.id} className="space-y-1.5">
            <div className="flex items-center gap-1.5 px-1">
              <span className="w-2 h-2 rounded-full bg-[#2365B5]" />
              <h4 className="text-[12px] font-extrabold text-[#2A3B4E] uppercase tracking-wider">
                {group.category.label}
              </h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {group.regions.map((region) => {
                const isSelected = selectedRegions.includes(region.id)
                const localizedLabel = getLocalizedBodyRegionLabel(region.id, language)

                return (
                  <motion.button
                    key={region.id}
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onToggleRegion(region.id)}
                    className={`min-h-[48px] px-3 py-2 rounded-xl text-[12px] sm:text-[12.5px] font-bold text-left transition-all duration-150 cursor-pointer flex items-center justify-between gap-1.5 border focus:outline-none ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#2365B5] to-[#174A91] text-white border-[#174A91] shadow-xs'
                        : 'bg-[#F8FAFC] text-[#17191F] border-[#DFE8F1] hover:bg-[#F0F6FD] hover:border-[#2365B5]'
                    }`}
                    aria-label={`Select ${localizedLabel}`}
                    aria-pressed={isSelected}
                  >
                    <span className="break-words leading-tight">{localizedLabel}</span>
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-white text-[#2365B5]'
                          : 'bg-white/80 text-[#94A3B8] border border-[#CBD8E5]'
                      }`}
                    >
                      {isSelected ? <Check size={12} className="stroke-[3]" /> : <Plus size={12} />}
                    </span>
                  </motion.button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
