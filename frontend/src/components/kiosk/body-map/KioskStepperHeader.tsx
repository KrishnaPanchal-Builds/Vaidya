'use client'

import React from 'react'
import VaidyaWordmark from '@/components/ui/VaidyaWordmark'
import { useKioskStore } from '@/store/kiosk.store'
import type { SupportedKioskLanguage } from '@/lib/translations/kiosk-translations'

export type IntakeStageKey = 'COMPLAINT' | 'DURATION' | 'QUALITY' | 'LIFESTYLE' | 'SUMMARY'

interface KioskStepperHeaderProps {
  currentStage: IntakeStageKey
  onSelectStage?: (stage: IntakeStageKey) => void
  className?: string
}

const KIOSK_LANGUAGES: { code: SupportedKioskLanguage; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'mr', label: 'मराठी' },
  { code: 'gu', label: 'ગુજરાતી' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'ta', label: 'தமிழ்' },
]

export function KioskStepperHeader({
  currentStage,
  onSelectStage,
  className = '',
}: KioskStepperHeaderProps) {
  const { language, setLanguage, updateActivity } = useKioskStore()
  const activeLang = (language as SupportedKioskLanguage) || 'en'

  const handleLanguageChange = (lang: SupportedKioskLanguage) => {
    updateActivity()
    setLanguage(lang)
  }

  return (
    <header
      className={`w-full bg-white/95 backdrop-blur-md border-b border-[#DFE8F1] shadow-2xs px-4 sm:px-6 py-2 flex items-center justify-between gap-3 select-none z-30 shrink-0 ${className}`}
    >
      {/* Left: VAIDYA Brand + OPD Kiosk Pill */}
      <div className="flex items-center gap-2 shrink-0">
        <VaidyaWordmark size="sm" showDescriptor={false} variant="default" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#2365B5] bg-[#EEF5FC] border border-[#CBD8E5] px-2 py-0.5 rounded-full hidden sm:inline-block">
          OPD KIOSK
        </span>
      </div>

      {/* Center: Stage Progress Navigation Stepper */}
      <div className="flex items-center gap-1 sm:gap-1.5 bg-[#F1F4F9] p-0.5 rounded-full border border-[#DFE8F1] text-[11.5px] sm:text-[12px] font-bold overflow-x-auto max-w-full">
        {/* Step 1: Complaint */}
        <button
          onClick={() => onSelectStage && onSelectStage('COMPLAINT')}
          className={`px-3 py-1 rounded-full transition-all duration-150 cursor-pointer ${
            currentStage === 'COMPLAINT'
              ? 'text-white shadow-xs'
              : 'text-[#4B5565] hover:text-[#17191F]'
          }`}
          style={{
            background:
              currentStage === 'COMPLAINT'
                ? 'linear-gradient(135deg, #347FCE 0%, #2365B5 52%, #174A91 100%)'
                : 'transparent',
          }}
        >
          1. Complaint
        </button>

        <span className="text-[#9AA8B7] text-[10px]">→</span>

        {/* Step 2: Duration */}
        <button
          onClick={() => onSelectStage && onSelectStage('DURATION')}
          className={`px-3 py-1 rounded-full transition-all duration-150 cursor-pointer flex items-center gap-1 ${
            currentStage === 'DURATION'
              ? 'text-white shadow-xs'
              : 'text-[#4B5565] hover:text-[#17191F]'
          }`}
          style={{
            background:
              currentStage === 'DURATION'
                ? 'linear-gradient(135deg, #347FCE 0%, #2365B5 52%, #174A91 100%)'
                : 'transparent',
          }}
        >
          <span>2. Duration</span>
          <span className="text-[10px]">⚗️</span>
        </button>

        <span className="text-[#9AA8B7] text-[10px]">→</span>

        {/* Step 3: Quality */}
        <button
          onClick={() => onSelectStage && onSelectStage('QUALITY')}
          className={`px-3 py-1 rounded-full transition-all duration-150 cursor-pointer ${
            currentStage === 'QUALITY'
              ? 'text-white shadow-xs'
              : 'text-[#4B5565] hover:text-[#17191F]'
          }`}
          style={{
            background:
              currentStage === 'QUALITY'
                ? 'linear-gradient(135deg, #347FCE 0%, #2365B5 52%, #174A91 100%)'
                : 'transparent',
          }}
        >
          3. Quality
        </button>

        <span className="text-[#9AA8B7] text-[10px]">→</span>

        {/* Step 4: Lifestyle */}
        <button
          onClick={() => onSelectStage && onSelectStage('LIFESTYLE')}
          className={`px-3 py-1 rounded-full transition-all duration-150 cursor-pointer ${
            currentStage === 'LIFESTYLE'
              ? 'text-white shadow-xs'
              : 'text-[#4B5565] hover:text-[#17191F]'
          }`}
          style={{
            background:
              currentStage === 'LIFESTYLE'
                ? 'linear-gradient(135deg, #347FCE 0%, #2365B5 52%, #174A91 100%)'
                : 'transparent',
          }}
        >
          4. Lifestyle
        </button>
      </div>

      {/* Right: Language Selector */}
      <div className="flex items-center gap-1 shrink-0 overflow-x-auto">
        {KIOSK_LANGUAGES.map((lang) => {
          const isActive = activeLang === lang.code

          return (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'text-white shadow-xs'
                  : 'text-[#4B5565] hover:text-[#17191F] hover:bg-[#F1F4F9]'
              }`}
              style={{
                background: isActive
                  ? 'linear-gradient(135deg, #347FCE 0%, #2365B5 52%, #174A91 100%)'
                  : 'transparent',
              }}
            >
              {lang.label}
            </button>
          )
        })}
      </div>
    </header>
  )
}

