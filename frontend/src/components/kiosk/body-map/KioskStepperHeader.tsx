'use client'

import React from 'react'
import { Check } from 'lucide-react'
import VaidyaWordmark from '@/components/ui/VaidyaWordmark'
import { useKioskStore } from '@/store/kiosk.store'
import type { SupportedKioskLanguage } from '@/lib/translations/kiosk-translations'

export type IntakeStageKey =
  | 'LOCATION'
  | 'SYMPTOMS'
  | 'DURATION'
  | 'SEVERITY'
  | 'LIFESTYLE'
  | 'REVIEW'

interface KioskStepperHeaderProps {
  currentStage: IntakeStageKey
  onSelectStage?: (stage: IntakeStageKey) => void
  completedStages?: IntakeStageKey[]
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

const STAGES_CONFIG: {
  key: IntakeStageKey
  stepNum: number
  labels: Record<SupportedKioskLanguage, string>
}[] = [
  {
    key: 'LOCATION',
    stepNum: 1,
    labels: {
      en: '1. Location',
      hi: '1. स्थान',
      mr: '1. जागा',
      gu: '1. સ્થાન',
      bn: '1. স্থান',
      ta: '1. இடம்',
    },
  },
  {
    key: 'SYMPTOMS',
    stepNum: 2,
    labels: {
      en: '2. Symptoms',
      hi: '2. लक्षण',
      mr: '2. लक्षणे',
      gu: '2. લક્ષણો',
      bn: '2. লক্ষণ',
      ta: '2. அறிகுறிகள்',
    },
  },
  {
    key: 'DURATION',
    stepNum: 3,
    labels: {
      en: '3. Duration',
      hi: '3. अवधि',
      mr: '3. कालावधी',
      gu: '3. સમયગાળો',
      bn: '3. সময়কাল',
      ta: '3. கால அளவு',
    },
  },
  {
    key: 'SEVERITY',
    stepNum: 4,
    labels: {
      en: '4. Severity',
      hi: '4. तीव्रता',
      mr: '4. तीव्रता',
      gu: '4. તીવ્રતા',
      bn: '4. তীব্রতা',
      ta: '4. தீவிரம்',
    },
  },
  {
    key: 'LIFESTYLE',
    stepNum: 5,
    labels: {
      en: '5. Lifestyle',
      hi: '5. जीवनशैली',
      mr: '5. जीवनशैली',
      gu: '5. જીવનશૈલી',
      bn: '5. জীবনযাত্রা',
      ta: '5. வாழ்க்கை முறை',
    },
  },
  {
    key: 'REVIEW',
    stepNum: 6,
    labels: {
      en: '6. Review',
      hi: '6. समीक्षा',
      mr: '6. आढावा',
      gu: '6. સમીક્ષા',
      bn: '6. পর্যালোচনা',
      ta: '6. மதிப்பாய்வு',
    },
  },
]

export function KioskStepperHeader({
  currentStage,
  onSelectStage,
  completedStages,
  className = '',
}: KioskStepperHeaderProps) {
  const { language, setLanguage, updateActivity } = useKioskStore()
  const activeLang = (language as SupportedKioskLanguage) || 'en'

  const currentStageIndex = STAGES_CONFIG.findIndex((s) => s.key === currentStage)

  const handleLanguageChange = (lang: SupportedKioskLanguage) => {
    updateActivity()
    setLanguage(lang)
  }

  return (
    <header
      className={`w-full bg-white/95 backdrop-blur-md border-b border-[#DFE8F1] shadow-2xs px-3 sm:px-6 py-2 flex items-center justify-between gap-3 select-none z-30 shrink-0 ${className}`}
      role="banner"
    >
      {/* Left: VAIDYA Brand + OPD Kiosk Pill */}
      <div className="flex items-center gap-2.5 shrink-0">
        <VaidyaWordmark size="md" showDescriptor={false} variant="default" />
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#2365B5] bg-[#EEF5FC] border border-[#CBD8E5] px-2.5 py-0.5 rounded-full hidden lg:inline-block">
          OPD INTAKE
        </span>
      </div>

      {/* Center: 6-Stage Guided Stepper Navigation */}
      <nav
        aria-label="Intake Progress Steps"
        className="flex items-center gap-0.5 sm:gap-1 bg-[#F1F4F9] p-1 rounded-full border border-[#DFE8F1] text-[11px] sm:text-[12px] font-bold overflow-x-auto max-w-full scrollbar-none"
      >
        {STAGES_CONFIG.map((stage, idx) => {
          const isActive = currentStage === stage.key
          const isCompleted =
            completedStages?.includes(stage.key) ||
            (currentStageIndex !== -1 && idx < currentStageIndex)
          const labelText = stage.labels[activeLang] || stage.labels.en

          return (
            <React.Fragment key={stage.key}>
              <button
                type="button"
                onClick={() => onSelectStage && onSelectStage(stage.key)}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all duration-150 cursor-pointer whitespace-nowrap flex items-center gap-1.5 text-[11.5px] sm:text-[12.5px] ${
                  isActive
                    ? 'text-white shadow-xs font-extrabold scale-[1.02]'
                    : isCompleted
                    ? 'text-[#2365B5] hover:bg-[#EEF5FC] font-bold'
                    : 'text-[#64748B] hover:text-[#17191F] hover:bg-white/60'
                }`}
                style={{
                  background: isActive
                    ? 'linear-gradient(135deg, #347FCE 0%, #2365B5 52%, #174A91 100%)'
                    : 'transparent',
                }}
                aria-label={labelText}
                aria-current={isActive ? 'step' : undefined}
              >
                {isCompleted && !isActive && (
                  <Check size={12} className="stroke-[3] text-[#2365B5] shrink-0" />
                )}
                <span>{labelText}</span>
              </button>
              {idx < STAGES_CONFIG.length - 1 && (
                <span className="text-[#CBD8E5] text-[10px] font-normal px-0.5 select-none" aria-hidden="true">
                  ›
                </span>
              )}
            </React.Fragment>
          )
        })}
      </nav>

      {/* Right: Language Selector Pill Buttons */}
      <div
        className="flex items-center gap-1 shrink-0 overflow-x-auto scrollbar-none"
        role="group"
        aria-label="Language selection"
      >
        {KIOSK_LANGUAGES.map((lang) => {
          const isActive = activeLang === lang.code

          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleLanguageChange(lang.code)}
              className={`px-2.5 py-1 rounded-full text-[11px] sm:text-[11.5px] font-extrabold transition-all duration-150 cursor-pointer min-w-[32px] text-center ${
                isActive
                  ? 'text-white shadow-xs'
                  : 'text-[#4B5565] hover:text-[#17191F] hover:bg-[#F1F4F9]'
              }`}
              style={{
                background: isActive
                  ? 'linear-gradient(135deg, #347FCE 0%, #2365B5 52%, #174A91 100%)'
                  : 'transparent',
              }}
              aria-label={`Switch language to ${lang.label}`}
              aria-pressed={isActive}
            >
              {lang.label}
            </button>
          )
        })}
      </div>
    </header>
  )
}
