'use client'

import React from 'react'
import { CategoryIcon } from './CategoryIcons'
import { SYMPTOM_CATEGORIES, type SymptomCategoryId } from './types'

interface SymptomCategoryGridProps {
  selectedCategories: SymptomCategoryId[]
  onToggleCategory: (categoryId: SymptomCategoryId) => void
  heading?: string
  subheading?: string
  className?: string
}

export function SymptomCategoryGrid({
  selectedCategories,
  onToggleCategory,
  heading = 'What is bothering you?',
  subheading = 'Choose an area or select it on the body.',
  className = '',
}: SymptomCategoryGridProps) {
  return (
    <div className={`space-y-2 shrink-0 ${className}`}>
      {/* Header */}
      <div>
        <h2 className="text-[15px] sm:text-[16px] font-extrabold text-[#17191F] tracking-tight leading-tight">
          {heading}
        </h2>
        <p className="text-[12px] sm:text-[12.5px] font-medium text-[#6F7480] leading-tight mt-0.5">
          {subheading}
        </p>
      </div>

      {/* 3x3 Grid */}
      <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
        {SYMPTOM_CATEGORIES.map((cat) => {
          const isSelected = selectedCategories.includes(cat.id)

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
              aria-label={`${cat.label}${isSelected ? ' (Selected)' : ''}`}
              aria-pressed={isSelected}
            >
              {/* Category Icon */}
              <div className="mb-1 flex items-center justify-center">
                <CategoryIcon id={cat.id} size={24} />
              </div>

              {/* Label */}
              <span
                className={`text-[11px] sm:text-[12px] font-extrabold leading-tight px-0.5 ${
                  isSelected ? 'text-[#174A91]' : 'text-[#17191F]'
                }`}
              >
                {cat.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
