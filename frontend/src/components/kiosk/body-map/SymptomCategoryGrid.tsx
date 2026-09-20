'use client'

import React from 'react'
import { CategoryIcon } from './CategoryIcons'
import { SYMPTOM_CATEGORIES, type SymptomCategoryId } from './types'
import { getLocalizedSymptomCategory } from '@/lib/translations/body-regions-translations'
import { useKioskTranslation } from '@/lib/hooks/use-kiosk-translation'
import type { SupportedKioskLanguage } from '@/lib/translations/kiosk-translations'

interface SymptomCategoryGridProps {
  selectedCategories: SymptomCategoryId[]
  onToggleCategory: (categoryId: SymptomCategoryId) => void
  heading?: string
  subheading?: string
  language?: SupportedKioskLanguage
  className?: string
}

export function SymptomCategoryGrid({
  selectedCategories,
  onToggleCategory,
  heading,
  subheading,
  language: propLanguage,
  className = '',
}: SymptomCategoryGridProps) {
  const { language: contextLanguage, t } = useKioskTranslation()
  const language = propLanguage || contextLanguage || 'en'

  const resolvedHeading = heading || t.intake.complaintTitle || 'What is bothering you?'
  const resolvedSubheading = subheading || t.intake.complaintSub || 'Choose an area or select it on the body.'

  return (
    <div className={`space-y-2 shrink-0 ${className}`}>
      {/* Header */}
      <div>
        <h2 className="text-[15px] sm:text-[16px] font-extrabold text-[#17191F] tracking-tight leading-tight">
          {resolvedHeading}
        </h2>
        <p className="text-[12px] sm:text-[12.5px] font-medium text-[#6F7480] leading-tight mt-0.5">
          {resolvedSubheading}
        </p>
      </div>

      {/* 3x3 Grid */}
      <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
        {SYMPTOM_CATEGORIES.map((cat) => {
          const isSelected = selectedCategories.includes(cat.id)
          const localized = getLocalizedSymptomCategory(cat.id, language)

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onToggleCategory(cat.id)}
              className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-2xl border transition-all duration-150 cursor-pointer min-h-[66px] sm:min-h-[72px] text-center active:scale-97 ${
                isSelected
                  ? 'bg-[#F0F6FD] border-[#2365B5] shadow-xs ring-2 ring-[#2365B5]/40'
                  : 'bg-white border-[#DFE8F1] hover:border-[#B8D1EC] hover:bg-[#F8FAFC] shadow-2xs'
              }`}
              aria-label={`${localized.label}${isSelected ? ' (Selected)' : ''}`}
              aria-pressed={isSelected}
            >
              {/* Category Icon */}
              <div className="mb-1 flex items-center justify-center">
                <CategoryIcon id={cat.id} size={24} />
              </div>

              {/* Label */}
              <span
                className={`text-[10.5px] sm:text-[11.5px] font-extrabold leading-tight px-0.5 ${
                  isSelected ? 'text-[#174A91]' : 'text-[#17191F]'
                }`}
              >
                {localized.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
