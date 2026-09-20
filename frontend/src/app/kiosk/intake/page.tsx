'use client'

/**
 * K-05 — Guided Multilingual Patient Clinical Intake
 *
 * Route: /kiosk/intake
 * Features:
 * 1. Location (2.5D Body Map + Category Grid + Bounded Chip Drawer)
 * 2. Symptoms (Contextual symptom clarification based on body regions)
 * 3. Duration (Standardized duration & onset options)
 * 4. Severity (1-10 Visual Severity Scale & Tier Descriptors)
 * 5. Lifestyle (AYUSH Ahara & Vihara Lifestyle Triggers - optional & non-judgmental)
 * 6. Review (Structured clinical review with per-section editing & disclaimer)
 * - Multimodal Voice Assistant with 6 states and transcription verification
 * - Full multilingual support (EN, HI, MR, GU, BN, TA) with zero state loss on toggle
 */

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield,
  HelpCircle,
  ArrowRight,
  Volume2,
  CheckCircle2,
  Edit3,
  Check,
  AlertCircle,
  Keyboard,
} from 'lucide-react'
import { useKioskStore } from '@/store/kiosk.store'
import { useKioskTranslation } from '@/lib/hooks/use-kiosk-translation'
import { getLocalizedBodyRegionLabel } from '@/lib/translations/body-regions-translations'
import { KioskButton } from '@/components/kiosk/kiosk-button'
import { KioskBottomDock } from '@/components/kiosk/KioskBottomDock'
import {
  InteractiveBodyMap,
  SymptomCategoryGrid,
  SelectedAreasPanel,
  KioskStepperHeader,
  VoiceIntakeModal,
  SeverityScaleSelector,
  BODY_REGIONS,
  SYMPTOM_CATEGORIES,
  type BodyRegionId,
  type SymptomCategoryId,
  type SelectedItem,
  type IntakeStageKey,
} from '@/components/kiosk/body-map'
import {
  getContextualQuestionsForSelections,
  getLocalizedQuestion,
  getLocalizedOption,
  DURATION_OPTIONS,
  LIFESTYLE_OPTIONS,
  type ContextualQuestion,
} from '@/lib/kiosk-intake-questions'

export default function KioskIntakePage() {
  const router = useRouter()
  const { language, t } = useKioskTranslation()
  const { patientData, advanceStep, setIntakeAnswer, updateActivity } = useKioskStore()

  // ── 1. Progressive Stage State ──
  const [currentStage, setCurrentStage] = useState<IntakeStageKey>('LOCATION')
  const [completedStages, setCompletedStages] = useState<IntakeStageKey[]>([])

  // ── 2. Stage 1: Selected Body Regions & Categories ──
  const [selectedRegionIds, setSelectedRegionIds] = useState<BodyRegionId[]>(['chest'])

  // Derived selected items list for SelectedAreasPanel & summary with dynamic localization
  const selectedItems: SelectedItem[] = selectedRegionIds.map((id) => ({
    id,
    label: getLocalizedBodyRegionLabel(id, language),
    categoryId: BODY_REGIONS[id]?.categoryId,
  }))

  // Derived active categories list for SymptomCategoryGrid
  const activeCategoryIds: SymptomCategoryId[] = SYMPTOM_CATEGORIES.filter((cat) =>
    selectedRegionIds.some((rId) => BODY_REGIONS[rId]?.categoryId === cat.id)
  ).map((cat) => cat.id)

  // ── 3. Stage 2: Contextual Symptom Clarification ──
  const applicableQuestions = getContextualQuestionsForSelections(
    selectedRegionIds,
    activeCategoryIds
  )
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)
  const currentQuestion: ContextualQuestion =
    applicableQuestions[activeQuestionIndex] || applicableQuestions[0]

  // Map of questionId -> selectedOptionIds[]
  const [symptomAnswers, setSymptomAnswers] = useState<Record<string, string[]>>({
    q_chest_breathing: ['chest_pain', 'breathing_difficulty'],
  })
  const [customSymptomNotes, setCustomSymptomNotes] = useState<Record<string, string>>({})
  const [symptomError, setSymptomError] = useState<string | null>(null)

  // ── 4. Stage 3: Duration ──
  const [selectedDuration, setSelectedDuration] = useState<string>('2_3_days')
  const [customDurationText, setCustomDurationText] = useState<string>('')

  // ── 5. Stage 4: Severity (1 to 10) ──
  const [severityRating, setSeverityRating] = useState<number>(6)

  // ── 6. Stage 5: AYUSH Lifestyle / Triggers ──
  const [selectedLifestyleTrigger, setSelectedLifestyleTrigger] = useState<string>('food_meals')

  // ── 7. Voice & Typing Modal State ──
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false)
  const [voiceModalMode, setVoiceModalMode] = useState<'VOICE' | 'TYPING'>('VOICE')
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false)

  // Register kiosk step
  useEffect(() => {
    advanceStep('INTAKE')
  }, [advanceStep])

  // ── STAGE 1 HANDLERS: Body Map & Category Selection ──
  const handleToggleRegion = useCallback(
    (regionId: BodyRegionId) => {
      updateActivity()
      setSelectedRegionIds((prev) => {
        const exists = prev.includes(regionId)
        if (exists) {
          return prev.filter((id) => id !== regionId)
        } else {
          return [...prev, regionId]
        }
      })
    },
    [updateActivity]
  )

  const handleToggleCategory = useCallback(
    (catId: SymptomCategoryId) => {
      updateActivity()
      const cat = SYMPTOM_CATEGORIES.find((c) => c.id === catId)
      if (!cat) return

      setSelectedRegionIds((prev) => {
        const hasActive = prev.some((rId) => BODY_REGIONS[rId]?.categoryId === catId)
        if (hasActive) {
          return prev.filter((rId) => BODY_REGIONS[rId]?.categoryId !== catId)
        } else {
          return [...prev, cat.primaryRegionId]
        }
      })
    },
    [updateActivity]
  )

  const handleRemoveSelectedItem = useCallback(
    (itemId: string) => {
      updateActivity()
      setSelectedRegionIds((prev) => prev.filter((id) => id !== (itemId as BodyRegionId)))
    },
    [updateActivity]
  )

  const handleClearAll = useCallback(() => {
    updateActivity()
    setSelectedRegionIds([])
  }, [updateActivity])

  const handleResetView = useCallback(() => {
    updateActivity()
    setSelectedRegionIds(['chest'])
  }, [updateActivity])

  const handleContinueFromLocation = useCallback(() => {
    updateActivity()
    if (selectedRegionIds.length === 0) return
    const complaintSummary = selectedItems.map((i) => i.label).join(', ')
    setIntakeAnswer('chief_complaint', complaintSummary)
    setCompletedStages((prev) => (prev.includes('LOCATION') ? prev : [...prev, 'LOCATION']))
    setCurrentStage('SYMPTOMS')
  }, [selectedItems, selectedRegionIds.length, setIntakeAnswer, updateActivity])

  // ── STAGE 2 HANDLERS: Contextual Symptom Clarification ──
  const handleToggleSymptomOption = (questionId: string, optionId: string) => {
    updateActivity()
    setSymptomError(null)
    setSymptomAnswers((prev) => {
      const current = prev[questionId] || []
      const isNotSure = optionId.startsWith('not_sure')

      if (currentQuestion.answerType === 'single_choice') {
        return { ...prev, [questionId]: [optionId] }
      }

      // If user selects "Not sure", clear others; if selects another, remove "Not sure"
      if (isNotSure) {
        return { ...prev, [questionId]: [optionId] }
      }

      const filtered = current.filter((id) => !id.startsWith('not_sure'))
      const exists = filtered.includes(optionId)
      const next = exists ? filtered.filter((id) => id !== optionId) : [...filtered, optionId]
      return { ...prev, [questionId]: next }
    })
  }

  const handleContinueFromSymptoms = () => {
    updateActivity()
    const currentAnswers = symptomAnswers[currentQuestion.id] || []
    const hasCustom = Boolean(customSymptomNotes[currentQuestion.id]?.trim())

    if (currentQuestion.required && currentAnswers.length === 0 && !hasCustom) {
      setSymptomError(
        language === 'hi'
          ? 'कृपया कम से कम एक लक्षण चुनें या अपनी परेशानी बताएं।'
          : language === 'mr'
          ? 'कृपया किमान एक लक्षण निवडा किंवा आपला त्रास सांगा.'
          : language === 'gu'
          ? 'કૃપા કરીને ઓછામાં ઓછું એક લક્ષણ પસંદ કરો અથવા તમારી તકલીફ જણાવો.'
          : language === 'bn'
          ? 'অনুগ্রহ করে অন্তত একটি লক্ষণ বেছে নিন বা আপনার সমস্যা লিখুন।'
          : language === 'ta'
          ? 'தயவுசெய்து குறைந்தது ஒரு அறிகுறியைத் தேர்ந்தெடுக்கவும்.'
          : 'Please select at least one symptom or describe what you feel.'
      )
      return
    }

    if (activeQuestionIndex < applicableQuestions.length - 1) {
      setActiveQuestionIndex((prev) => prev + 1)
    } else {
      // Record answer in store
      const allSelectedLabels = Object.entries(symptomAnswers)
        .flatMap(([qId, optIds]) => {
          const q = applicableQuestions.find((item) => item.id === qId)
          if (!q) return []
          return optIds.map((optId) => q.options.find((o) => o.id === optId)?.label || optId)
        })
        .join(', ')

      setIntakeAnswer('symptom_details', allSelectedLabels)
      setCompletedStages((prev) => (prev.includes('SYMPTOMS') ? prev : [...prev, 'SYMPTOMS']))
      setCurrentStage('DURATION')
    }
  }

  // ── STAGE 3 HANDLERS: Duration ──
  const handleSelectDuration = (durId: string) => {
    updateActivity()
    if (durId === 'custom_other_duration') {
      setVoiceModalMode('TYPING')
      setIsVoiceModalOpen(true)
      return
    }
    setSelectedDuration(durId)
    setIntakeAnswer('duration', durId)
  }

  const handleContinueFromDuration = () => {
    updateActivity()
    setIntakeAnswer('duration', customDurationText || selectedDuration)
    setCompletedStages((prev) => (prev.includes('DURATION') ? prev : [...prev, 'DURATION']))
    setCurrentStage('SEVERITY')
  }

  // ── STAGE 4 HANDLERS: Severity ──
  const handleContinueFromSeverity = () => {
    updateActivity()
    setIntakeAnswer('severity_rating', `${severityRating}/10`)
    setCompletedStages((prev) => (prev.includes('SEVERITY') ? prev : [...prev, 'SEVERITY']))
    setCurrentStage('LIFESTYLE')
  }

  // ── STAGE 5 HANDLERS: AYUSH Lifestyle ──
  const handleSelectLifestyle = (lifeId: string) => {
    updateActivity()
    setSelectedLifestyleTrigger(lifeId)
    setIntakeAnswer('lifestyle_trigger', lifeId)
  }

  const handleContinueFromLifestyle = () => {
    updateActivity()
    setIntakeAnswer('lifestyle_trigger', selectedLifestyleTrigger)
    setCompletedStages((prev) => (prev.includes('LIFESTYLE') ? prev : [...prev, 'LIFESTYLE']))
    setCurrentStage('REVIEW')
  }

  // ── STAGE 6 HANDLERS: Review & Final Navigation ──
  const handleProceedToDocuments = () => {
    updateActivity()
    advanceStep('DOCUMENTS')
    router.push('/kiosk/documents')
  }

  // ── VOICE & TYPING CONFIRMATION HANDLER ──
  const handleConfirmVoiceTranscript = (
    answerText: string,
    source: 'VOICE' | 'TYPED' = 'VOICE',
    mappedOptionId?: string
  ) => {
    updateActivity()
    if (currentStage === 'LOCATION') {
      setIntakeAnswer('chief_complaint_spoken', answerText, source)
      const lower = answerText.toLowerCase()
      if (lower.includes('chest') || lower.includes('chhati') || lower.includes('chati') || lower.includes('छाती') || lower.includes('हृदय') || lower.includes('heart')) {
        setSelectedRegionIds((prev) => (prev.includes('chest') ? prev : [...prev, 'chest']))
      } else if (lower.includes('head') || lower.includes('sar') || lower.includes('sir') || lower.includes('डोके') || lower.includes('सिर') || lower.includes('matha')) {
        setSelectedRegionIds((prev) => (prev.includes('head') ? prev : [...prev, 'head']))
      } else if (lower.includes('stomach') || lower.includes('pet') || lower.includes('belly') || lower.includes('पोट') || lower.includes('पेट')) {
        setSelectedRegionIds((prev) => (prev.includes('stomach') ? prev : [...prev, 'stomach']))
      } else if (lower.includes('throat') || lower.includes('gala') || lower.includes('ghasa') || lower.includes('घसा') || lower.includes('गला') || lower.includes('neck')) {
        setSelectedRegionIds((prev) => (prev.includes('neck') ? prev : [...prev, 'neck']))
      } else if (lower.includes('back') || lower.includes('peeth') || lower.includes('path') || lower.includes('पाठी') || lower.includes('पीठ')) {
        setSelectedRegionIds((prev) => (prev.includes('upper_back') ? prev : [...prev, 'upper_back']))
      }
    } else if (currentStage === 'SYMPTOMS') {
      if (mappedOptionId) {
        handleToggleSymptomOption(currentQuestion.id, mappedOptionId)
      } else {
        setCustomSymptomNotes((prev) => ({
          ...prev,
          [currentQuestion.id]: answerText,
        }))
        setIntakeAnswer(`symptom_custom_${currentQuestion.id}`, answerText, source)
      }
    } else if (currentStage === 'DURATION') {
      setCustomDurationText(answerText)
      setSelectedDuration('custom_other_duration')
      setIntakeAnswer('duration', answerText, source)
    } else if (currentStage === 'LIFESTYLE') {
      setSelectedLifestyleTrigger(answerText)
      setIntakeAnswer('lifestyle_trigger', answerText, source)
    }
  }

  // ── AUDIO TTS GUIDANCE ──
  const handleHearQuestion = () => {
    updateActivity()
    setIsSpeakingQuestion(true)
    setTimeout(() => {
      setIsSpeakingQuestion(false)
    }, 2400)
  }

  // Localized question strings
  const localizedQ = getLocalizedQuestion(currentQuestion, language)

  // Resolve active duration display text
  const currentDurationObj = DURATION_OPTIONS.find((d) => d.id === selectedDuration)
  const resolvedDurationText =
    customDurationText ||
    (currentDurationObj ? currentDurationObj.title[language] || currentDurationObj.title.en : '2–3 days')

  // Resolve active lifestyle display text
  const currentLifestyleObj = LIFESTYLE_OPTIONS.find((l) => l.id === selectedLifestyleTrigger)
  const resolvedLifestyleText = currentLifestyleObj
    ? currentLifestyleObj.title[language] || currentLifestyleObj.title.en
    : 'No Specific Pattern'

  return (
    <div className="h-full max-h-full flex flex-col bg-[#F7F9FC] text-[#17191F] antialiased overflow-hidden select-none">
      {/* ── 1. Top Persistent Stepper Header ── */}
      <KioskStepperHeader
        currentStage={currentStage}
        completedStages={completedStages}
        onSelectStage={(stage) => {
          updateActivity()
          setCurrentStage(stage)
        }}
      />

      {/* ── 2. Main Intake Canvas Container ── */}
      <main className="flex-1 min-h-0 max-w-7xl w-full mx-auto px-3 sm:px-5 lg:px-6 py-2 flex flex-col justify-between overflow-hidden">
        <AnimatePresence mode="wait">
          {/* ══════════════════════════════════════════════════════════════════════
              STAGE 1: WHERE IS THE PROBLEM? (Body Map + Category Grid)
          ══════════════════════════════════════════════════════════════════════ */}
          {currentStage === 'LOCATION' && (
            <motion.div
              key="stage-location"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="flex-1 min-h-0 flex flex-col justify-between gap-1 overflow-hidden"
            >
              {/* Page Title & Clinical Subtitle */}
              <div className="text-center space-y-0.5 shrink-0">
                <h1 className="text-[21px] sm:text-[25px] lg:text-[27px] font-extrabold text-[#17191F] tracking-tight leading-tight">
                  {language === 'hi'
                    ? 'तकलीफ कहाँ है?'
                    : language === 'mr'
                    ? 'त्रास कुठे होत आहे?'
                    : language === 'gu'
                    ? 'તકલીફ ક્યાં છે?'
                    : language === 'bn'
                    ? 'কোথায় সমস্যা হচ্ছে?'
                    : language === 'ta'
                    ? 'பிரச்சனை எங்கே உள்ளது?'
                    : 'Where is the problem?'}
                </h1>
                <p className="text-[12.5px] sm:text-[13.5px] font-medium text-[#6F7480] max-w-2xl mx-auto">
                  {language === 'hi'
                    ? 'जिस अंग में परेशानी है उसे चुनें। आप एक से अधिक अंग चुन सकते हैं।'
                    : language === 'mr'
                    ? 'त्रास असलेला भाग निवडा. तुम्ही एकापेक्षा जास्त भाग निवडू शकता.'
                    : language === 'gu'
                    ? 'તકલીફવાળો ભાગ પસંદ કરો. તમે એક કરતાં વધુ ભાગ પસંદ કરી શકો છો.'
                    : language === 'bn'
                    ? 'সমস্যাযুক্ত অংশটি নির্বাচন করুন। আপনি একাধিক অংশ নির্বাচন করতে পারেন।'
                    : language === 'ta'
                    ? 'பாதிக்கப்பட்ட உடல் பகுதியைத் தேர்ந்தெடுக்கவும். ஒன்றுக்கும் மேற்பட்ட பகுதிகளைத் தேர்ந்தெடுக்கலாம்.'
                    : 'Select the body area that concerns you. You can select more than one area.'}
                </p>
              </div>

              {/* Two-Column Responsive Split Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-3 flex-1 min-h-0 items-stretch overflow-hidden">
                {/* ── LEFT: 2.5D Body Canvas with Leader Lines & Clean Callout Labels ── */}
                <div className="lg:col-span-7 h-full min-h-0 flex flex-col">
                  <InteractiveBodyMap
                    selectedRegions={selectedRegionIds}
                    onToggleRegion={handleToggleRegion}
                    onResetView={handleResetView}
                    language={language}
                  />
                </div>

                {/* ── RIGHT: 9-Category Grid & Bounded Selected Areas ── */}
                <div className="lg:col-span-5 h-full min-h-0 flex flex-col">
                  <div
                    className="bg-white rounded-3xl border border-[#DFE8F1] shadow-card p-2.5 sm:p-3 flex flex-col justify-between h-full min-h-0 gap-1.5 overflow-hidden"
                    style={{
                      boxShadow:
                        '0 4px 20px rgba(35, 75, 115, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    {/* Top: 9 Category Cards */}
                    <SymptomCategoryGrid
                      selectedCategories={activeCategoryIds}
                      onToggleCategory={handleToggleCategory}
                      language={language}
                      heading={
                        language === 'hi'
                          ? 'आपको क्या परेशानी है?'
                          : language === 'mr'
                          ? 'आपल्याला काय त्रास होत आहे?'
                          : language === 'gu'
                          ? 'તમને શું તકલીફ છે?'
                          : language === 'bn'
                          ? 'আপনার কী সমস্যা হচ্ছে?'
                          : language === 'ta'
                          ? 'உங்களுக்கு என்ன பிரச்சனை?'
                          : 'What is bothering you?'
                      }
                      subheading={
                        language === 'hi'
                          ? 'कोई श्रेणी चुनें या शरीर पर स्पर्श करें।'
                          : language === 'mr'
                          ? 'एक भाग निवडा किंवा शरीरावर स्पर्श करा.'
                          : language === 'gu'
                          ? 'એક વિભાગ પસંદ કરો અથવા શરીર પર સ્પર્શ કરો.'
                          : language === 'bn'
                          ? 'একটি বিভাগ বেছে নিন বা শরীরে স্পর্শ করুন।'
                          : language === 'ta'
                          ? 'ஒரு பகுதியைத் தேர்ந்தெடுக்கவும் அல்லது உடலில் தொடவும்.'
                          : 'Choose an area or select it on the body.'
                      }
                    />

                    {/* Bottom: Bounded Selected Areas Drawer with '+N more' badge & Continue */}
                    <SelectedAreasPanel
                      selectedItems={selectedItems}
                      onRemoveItem={handleRemoveSelectedItem}
                      onClearAll={handleClearAll}
                      onContinue={undefined}
                      emptyText={
                        language === 'hi'
                          ? 'आपके चुने हुए अंग यहाँ दिखेंगे'
                          : language === 'mr'
                          ? 'तुमचे निवडलेले भाग येथे दिसतील'
                          : language === 'gu'
                          ? 'તમારા પસંદ કરેલા ભાગો અહીં દેખાશે'
                          : language === 'bn'
                          ? 'আপনার নির্বাচিত অংশগুলি এখানে প্রদর্শিত হবে'
                          : language === 'ta'
                          ? 'தேர்ந்தெடுக்கப்பட்ட பகுதிகள் இங்கே தோன்றும்'
                          : 'Your selected areas appear here'
                      }
                      helperText={
                        language === 'hi'
                          ? 'आप एक से अधिक अंग चुन सकते हैं।'
                          : language === 'mr'
                          ? 'तुम्ही एकापेक्षा जास्त भाग निवडू शकता.'
                          : language === 'gu'
                          ? 'તમે એક કરતાં વધુ ભાગ પસંદ કરી શકો છો.'
                          : language === 'bn'
                          ? 'আপনি একাধিক অংশ নির্বাচন করতে পারেন।'
                          : language === 'ta'
                          ? 'ஒன்றுக்கும் மேற்பட்ட பகுதிகளைத் தேர்ந்தெடுக்கலாம்.'
                          : 'You can select more than one area.'
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Fixed Ergonomic Action Dock */}
              <KioskBottomDock
                onSpeak={() => {
                  setVoiceModalMode('VOICE')
                  setIsVoiceModalOpen(true)
                }}
                onType={() => {
                  setVoiceModalMode('TYPING')
                  setIsVoiceModalOpen(true)
                }}
                onNext={handleContinueFromLocation}
                isNextDisabled={selectedRegionIds.length === 0}
                nextLabel={
                  language === 'hi'
                    ? 'आगे: लक्षण →'
                    : language === 'mr'
                    ? 'पुढे: लक्षणे →'
                    : 'Next: Symptoms'
                }
                onBack={() => router.push('/kiosk')}
                backLabel={language === 'hi' ? 'भाषा' : 'Language'}
                language={language}
              />
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════
              STAGE 2: WHAT ARE YOU EXPERIENCING? (Contextual Symptom Clarification)
          ══════════════════════════════════════════════════════════════════════ */}
          {currentStage === 'SYMPTOMS' && (
            <motion.div
              key="stage-symptoms"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.18 }}
              className="max-w-3xl mx-auto w-full my-auto space-y-3.5 overflow-y-auto max-h-full py-1"
            >
              {/* Question Header & Speech Audio Guide */}
              <div className="text-center space-y-1">
                <div className="flex justify-center items-center gap-2">
                  <h1 className="text-[22px] sm:text-[27px] font-extrabold text-[#17191F] leading-tight">
                    {localizedQ.title}
                  </h1>
                  <button
                    onClick={handleHearQuestion}
                    className="p-2 rounded-full bg-[#EEF5FC] text-[#2365B5] hover:bg-[#D3E2F0] transition-colors cursor-pointer shrink-0"
                    aria-label="Listen to question guidance"
                  >
                    <Volume2 size={19} />
                  </button>
                </div>
                <p className="text-[13.5px] sm:text-[14.5px] text-[#6F7480]">{localizedQ.subtitle}</p>
                {isSpeakingQuestion && (
                  <span className="inline-block text-[11.5px] font-bold text-[#2365B5] bg-[#EEF5FC] px-3.5 py-1 rounded-full motion-safe:animate-pulse">
                    Playing audio guidance...
                  </span>
                )}
              </div>

              {/* Context Badge & Multi-select indicator */}
              <div className="bg-[#EEF5FC] p-3 sm:p-3.5 rounded-2xl border border-[#CBD8E5] flex items-center justify-between gap-2 shadow-2xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11.5px] sm:text-[12px] font-extrabold uppercase tracking-wider text-[#2365B5] bg-white px-2.5 py-1 rounded-lg border border-[#CBD8E5]">
                    {selectedItems.map((i) => i.label).join(', ') || 'Selected Area'}
                  </span>

                  {/* Multi-select hint if applicable */}
                  {currentQuestion.answerType === 'multiple_choice' && (
                    <span className="text-[12px] sm:text-[12.5px] font-bold text-[#079455] bg-[#EBFDF5] border border-[#A6F4C5] px-2.5 py-1 rounded-lg">
                      {language === 'hi'
                        ? 'एक से अधिक विकल्प चुन सकते हैं'
                        : language === 'mr'
                        ? 'एकापेक्षा जास्त पर्याय निवडू शकता'
                        : language === 'gu'
                        ? 'એક કરતાં વધુ પસંદ કરી શકો છો'
                        : language === 'bn'
                        ? 'একাধিক বিকল্প বেছে নিতে পারেন'
                        : language === 'ta'
                        ? 'ஒன்றுக்கும் மேற்பட்டவற்றைத் தேர்ந்தெடுக்கலாம்'
                        : 'You can choose more than one'}
                    </span>
                  )}

                  {applicableQuestions.length > 1 && (
                    <span className="text-[12px] text-[#4B5565] font-semibold hidden sm:inline">
                      (Question {activeQuestionIndex + 1} of {applicableQuestions.length})
                    </span>
                  )}
                </div>
              </div>

              {/* Validation Warning */}
              {symptomError && (
                <div className="bg-[#FEF3F2] border border-[#FECDCA] p-3 rounded-xl flex items-center gap-2 text-[#D92D20] text-[13px] font-bold">
                  <AlertCircle size={16} />
                  <span>{symptomError}</span>
                </div>
              )}

              {/* Large Touch-Friendly Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentQuestion.options.map((option) => {
                  const locOpt = getLocalizedOption(option, language)
                  const isSelected = (symptomAnswers[currentQuestion.id] || []).includes(option.id)

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleToggleSymptomOption(currentQuestion.id, option.id)}
                      className={`p-4 rounded-2xl border text-left transition-all duration-150 active:scale-98 flex items-start justify-between gap-2.5 min-h-[78px] sm:min-h-[84px] cursor-pointer ${
                        isSelected
                          ? 'bg-[#F0F6FD] border-[#2365B5] shadow-xs ring-1 ring-[#2365B5]/30'
                          : 'bg-white border-[#DFE8F1] hover:border-[#CBD8E5] hover:bg-[#F8FAFC] shadow-2xs'
                      }`}
                      aria-label={`${locOpt.label}${isSelected ? ' (Selected)' : ''}`}
                      aria-pressed={isSelected}
                    >
                      <div className="space-y-0.5">
                        <span
                          className={`text-[15px] sm:text-[15.5px] font-extrabold block leading-tight ${
                            isSelected ? 'text-[#174A91]' : 'text-[#17191F]'
                          }`}
                        >
                          {locOpt.label}
                        </span>
                        {locOpt.description && (
                          <span className="text-[12.5px] sm:text-[13px] text-[#6F7480] block leading-tight">
                            {locOpt.description}
                          </span>
                        )}
                      </div>

                      {/* Checkbox indicator */}
                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border transition-colors mt-0.5 ${
                          isSelected
                            ? 'bg-[#2365B5] border-[#2365B5] text-white'
                            : 'bg-white border-[#CBD8E5]'
                        }`}
                      >
                        {isSelected && <Check size={12} className="stroke-[3]" />}
                      </div>
                    </button>
                  )
                })}

                {/* Explicit Other / Type your answer option */}
                <button
                  type="button"
                  onClick={() => {
                    setVoiceModalMode('TYPING')
                    setIsVoiceModalOpen(true)
                  }}
                  className="p-4 rounded-2xl border-2 border-dashed border-[#2365B5]/50 bg-[#F0F6FD]/60 hover:bg-[#EEF5FC] text-left transition-all duration-150 active:scale-98 flex items-center justify-between gap-2.5 min-h-[78px] sm:min-h-[84px] cursor-pointer shadow-2xs"
                  aria-label="Other, type your answer"
                >
                  <div className="space-y-0.5">
                    <span className="text-[15px] sm:text-[15.5px] font-extrabold text-[#2365B5] flex items-center gap-2 leading-tight">
                      <Keyboard size={16} />
                      {language === 'hi'
                        ? 'अन्य / लिखकर बताएं'
                        : language === 'mr'
                        ? 'इतर / टाईप करा'
                        : language === 'gu'
                        ? 'અન્ય / લખીને જણાવો'
                        : language === 'bn'
                        ? 'অন্যান্য / লিখে জানান'
                        : language === 'ta'
                        ? 'மற்றவை / தட்டச்சு செய்யவும்'
                        : 'Other / Type your answer'}
                    </span>
                    <span className="text-[12px] sm:text-[12.5px] text-[#6F7480] block leading-tight">
                      {language === 'hi'
                        ? 'यदि आपका लक्षण सूची में नहीं है'
                        : language === 'mr'
                        ? 'तुमचे लक्षण यादीत नसल्यास'
                        : 'If your symptom is not listed'}
                    </span>
                  </div>
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border border-[#2365B5] bg-white text-[#2365B5] font-extrabold text-[14px]">
                    +
                  </div>
                </button>
              </div>

              {/* Custom Note Display if recorded via voice or typing */}
              {customSymptomNotes[currentQuestion.id] && (
                <div className="bg-[#F8FAFC] p-3.5 rounded-2xl border border-[#DFE8F1] text-[13px] space-y-1">
                  <span className="text-[11px] font-extrabold uppercase text-[#2365B5]">
                    Patient-Reported Voice / Typed Note:
                  </span>
                  <p className="font-bold text-[#17191F]">
                    &quot;{customSymptomNotes[currentQuestion.id]}&quot;
                  </p>
                </div>
              )}

              {/* Fixed Ergonomic Action Dock */}
              <KioskBottomDock
                onSpeak={() => {
                  setVoiceModalMode('VOICE')
                  setIsVoiceModalOpen(true)
                }}
                onType={() => {
                  setVoiceModalMode('TYPING')
                  setIsVoiceModalOpen(true)
                }}
                onNext={handleContinueFromSymptoms}
                nextLabel={
                  activeQuestionIndex < applicableQuestions.length - 1
                    ? (language === 'hi' ? 'अगला प्रश्न →' : 'Next Question →')
                    : (language === 'hi' ? 'आगे: अवधि →' : 'Next: Duration →')
                }
                onBack={() => {
                  updateActivity()
                  if (activeQuestionIndex > 0) {
                    setActiveQuestionIndex((prev) => prev - 1)
                  } else {
                    setCurrentStage('LOCATION')
                  }
                }}
                backLabel={language === 'hi' ? 'पीछे' : 'Back'}
                language={language}
              />
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════
              STAGE 3: HOW LONG HAS IT BEEN HAPPENING? (Duration & Onset)
          ══════════════════════════════════════════════════════════════════════ */}
          {currentStage === 'DURATION' && (
            <motion.div
              key="stage-duration"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.18 }}
              className="max-w-2xl mx-auto w-full my-auto space-y-3.5 overflow-y-auto max-h-full py-1"
            >
              <div className="text-center space-y-1">
                <div className="flex justify-center items-center gap-2">
                  <h1 className="text-[22px] sm:text-[27px] font-extrabold text-[#17191F] leading-tight">
                    {language === 'hi'
                      ? 'यह समस्या कब से हो रही है?'
                      : language === 'mr'
                      ? 'हा त्रास कधीपासून होत आहे?'
                      : language === 'gu'
                      ? 'આ તકલીફ ક્યારથી છે?'
                      : language === 'bn'
                      ? 'এই সমস্যা কতদিন ধরে হচ্ছে?'
                      : language === 'ta'
                      ? 'இந்த பிரச்சனை எவ்வளவு காலமாக உள்ளது?'
                      : 'How long have you had this issue?'}
                  </h1>
                  <button
                    onClick={handleHearQuestion}
                    className="p-2 rounded-full bg-[#EEF5FC] text-[#2365B5] hover:bg-[#D3E2F0] shrink-0"
                    aria-label="Listen to question guidance"
                  >
                    <Volume2 size={19} />
                  </button>
                </div>
                <p className="text-[13.5px] sm:text-[14.5px] text-[#6F7480]">
                  {language === 'hi'
                    ? 'लक्षण शुरू होने का सही समय चुनें।'
                    : language === 'mr'
                    ? 'त्रास सुरू झाल्याचा अंदाजे कालावधी निवडा.'
                    : language === 'gu'
                    ? 'તકલીફ શરૂ થયાનો અંદાજિત સમય પસંદ કરો.'
                    : language === 'bn'
                    ? 'লক্ষণ শুরুর আনুমানিক সময় নির্বাচন করুন।'
                    : language === 'ta'
                    ? 'அறிகுறிகள் தொடங்கிய கால அளவைத் தேர்ந்தெடுக்கவும்.'
                    : 'Select the duration that best describes when your symptoms started.'}
                </p>
              </div>

              {/* Symptom Context Badge */}
              <div className="bg-[#EEF5FC] p-3 sm:p-3.5 rounded-2xl border border-[#CBD8E5] flex items-center justify-between gap-2 shadow-2xs">
                <span className="text-[13px] text-[#4B5565]">
                  Regarding:{' '}
                  <strong className="text-[#2365B5] font-extrabold">
                    {selectedItems.map((i) => i.label).join(', ') || 'Chest'}
                  </strong>
                </span>
                <span className="text-[12px] font-bold text-[#6F7480]">
                  {language === 'hi' ? 'समय अवधि चुनें' : 'Select onset time'}
                </span>
              </div>

              {/* Standardized Duration Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DURATION_OPTIONS.map((opt) => {
                  const isSelected = selectedDuration === opt.id
                  const title = opt.title[language] || opt.title.en
                  const desc = opt.desc[language] || opt.desc.en

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectDuration(opt.id)}
                      className={`p-4 rounded-2xl border flex items-center justify-between text-left transition-all active:scale-98 min-h-[78px] sm:min-h-[84px] cursor-pointer ${
                        isSelected
                          ? 'bg-[#F0F6FD] border-[#2365B5] shadow-xs ring-1 ring-[#2365B5]/30'
                          : 'bg-white border-[#DFE8F1] hover:border-[#CBD8E5] hover:bg-[#F8FAFC] shadow-2xs'
                      }`}
                      aria-label={`${title}: ${desc}`}
                      aria-pressed={isSelected}
                    >
                      <div className="space-y-0.5">
                        <span
                          className={`text-[15px] sm:text-[15.5px] font-extrabold block ${
                            isSelected ? 'text-[#174A91]' : 'text-[#17191F]'
                          }`}
                        >
                          {title}
                        </span>
                        <span className="text-[12.5px] sm:text-[13px] text-[#6F7480] block">{desc}</span>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                          isSelected
                            ? 'bg-[#2365B5] border-[#2365B5] text-white'
                            : 'bg-white border-[#CBD8E5]'
                        }`}
                      >
                        {isSelected && <Check size={12} className="stroke-[3]" />}
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Fixed Ergonomic Action Dock */}
              <KioskBottomDock
                onSpeak={() => {
                  setVoiceModalMode('VOICE')
                  setIsVoiceModalOpen(true)
                }}
                onType={() => {
                  setVoiceModalMode('TYPING')
                  setIsVoiceModalOpen(true)
                }}
                onNext={handleContinueFromDuration}
                nextLabel={language === 'hi' ? 'आगे: गंभीरता →' : 'Next: Severity →'}
                onBack={() => setCurrentStage('SYMPTOMS')}
                backLabel={language === 'hi' ? 'पीछे' : 'Back to Symptoms'}
                language={language}
              />
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════
              STAGE 4: HOW SEVERE IS IT? (Severity Scale 1 to 10)
          ══════════════════════════════════════════════════════════════════════ */}
          {currentStage === 'SEVERITY' && (
            <motion.div
              key="stage-severity"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.18 }}
              className="max-w-2xl mx-auto w-full my-auto space-y-3.5 overflow-y-auto max-h-full py-1"
            >
              <div className="text-center space-y-1">
                <div className="flex justify-center items-center gap-2">
                  <h1 className="text-[22px] sm:text-[27px] font-extrabold text-[#17191F] leading-tight">
                    {language === 'hi'
                      ? 'तकलीफ या दर्द कितना तेज है?'
                      : language === 'mr'
                      ? 'त्रास किंवा वेदना किती तीव्र आहे?'
                      : language === 'gu'
                      ? 'દુખાવો કે તકલીફ કેટલી ગંભીર છે?'
                      : language === 'bn'
                      ? 'ব্যথা বা অস্বস্তি কতটা তীব্র?'
                      : language === 'ta'
                      ? 'வலி அல்லது அசௌகரியம் எவ்வளவு தீவிரமானது?'
                      : 'How severe is your pain or discomfort?'}
                  </h1>
                  <button
                    onClick={handleHearQuestion}
                    className="p-2 rounded-full bg-[#EEF5FC] text-[#2365B5] hover:bg-[#D3E2F0] shrink-0"
                    aria-label="Listen to question guidance"
                  >
                    <Volume2 size={19} />
                  </button>
                </div>
                <p className="text-[13.5px] sm:text-[14.5px] text-[#6F7480]">
                  {language === 'hi'
                    ? '1 (हल्का) से 10 (गंभीर) के पैमाने पर अपनी परेशानी बताएं।'
                    : language === 'mr'
                    ? '१ (हलका) ते १० (तीव्र) प्रमाणात तीव्रता निवडा.'
                    : language === 'gu'
                    ? '1 (હળવો) થી 10 (ગંભીર) સ્કેલ પર પસંદ કરો.'
                    : language === 'bn'
                    ? '১ (হালকা) থেকে ১০ (তীব্র) স্কেলে আপনার অস্বস্তি জানান।'
                    : language === 'ta'
                    ? '1 (லேசானது) முதல் 10 (கடுமையானது) அளவுகோலில் தேர்ந்தெடுக்கவும்.'
                    : 'Rate the intensity on a scale from 1 (mild) to 10 (severe).'}
                </p>
              </div>

              {/* 1-10 Visual Severity Scale Component */}
              <SeverityScaleSelector
                value={severityRating}
                onChange={setSeverityRating}
                language={language}
              />

              {/* Fixed Ergonomic Action Dock */}
              <KioskBottomDock
                onSpeak={() => {
                  setVoiceModalMode('VOICE')
                  setIsVoiceModalOpen(true)
                }}
                onNext={handleContinueFromSeverity}
                nextLabel={language === 'hi' ? 'आगे: जीवनशैली →' : 'Next: Lifestyle →'}
                onBack={() => setCurrentStage('DURATION')}
                backLabel={language === 'hi' ? 'पीछे' : 'Back to Duration'}
                language={language}
              />
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════
              STAGE 5: ADDITIONAL RELEVANT QUESTIONS (AYUSH Ahara & Vihara Lifestyle)
          ══════════════════════════════════════════════════════════════════════ */}
          {currentStage === 'LIFESTYLE' && (
            <motion.div
              key="stage-lifestyle"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.18 }}
              className="max-w-3xl mx-auto w-full my-auto space-y-3.5 overflow-y-auto max-h-full py-1"
            >
              <div className="text-center space-y-1">
                <div className="flex justify-center items-center gap-2">
                  <h1 className="text-[22px] sm:text-[27px] font-extrabold text-[#17191F] leading-tight">
                    {language === 'hi'
                      ? 'कोई खान-पान या जीवनशैली का कारण?'
                      : language === 'mr'
                      ? 'काही आहार किंवा जीवनशैलीचे कारण?'
                      : language === 'gu'
                      ? 'કોઈ આહાર કે જીવનશૈલી સંબંધિત કારણ?'
                      : language === 'bn'
                      ? 'কোনো খাদ্যাভ্যাস বা জীবনযাত্রার প্রভাব?'
                      : language === 'ta'
                      ? 'உணவு அல்லது வாழ்க்கை முறை காரணங்கள் ஏதேனும் உள்ளதா?'
                      : 'Any lifestyle or dietary trigger?'}
                  </h1>
                  <button
                    onClick={handleHearQuestion}
                    className="p-2 rounded-full bg-[#EBFDF5] text-[#079455] hover:bg-[#D1FADF] shrink-0"
                    aria-label="Listen to question guidance"
                  >
                    <Volume2 size={19} />
                  </button>
                </div>
                <p className="text-[13.5px] sm:text-[14.5px] text-[#6F7480]">
                  {language === 'hi'
                    ? 'वैकल्पिक प्रश्न: यदि किसी आदत या दिनचर्या से संबंध लगता है तो चुनें।'
                    : language === 'mr'
                    ? 'ऐच्छिक प्रश्न: दैनंदिन सवयी किंवा आहाराशी संबंध असल्यास निवडा.'
                    : language === 'gu'
                    ? 'વૈકલ્પિક પ્રશ્ન: જો કોઈ આહાર કે આદત સાથે સંબંધ હોય તો પસંદ કરો.'
                    : language === 'bn'
                    ? 'ঐচ্ছিক প্রশ্ন: খাদ্যাভ্যাস বা রুটিনের প্রভাব থাকলে নির্বাচন করুন।'
                    : language === 'ta'
                    ? 'விருப்பத்திற்குரிய கேள்வி: வாழ்க்கை முறை தொடர்புகள் இருந்தால் தேர்ந்தெடுக்கவும்.'
                    : 'Optional: Choose if your symptoms seem related to food, rest, or activity.'}
                </p>
              </div>

              {/* Standardized Lifestyle Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {LIFESTYLE_OPTIONS.map((opt) => {
                  const isSelected = selectedLifestyleTrigger === opt.id
                  const title = opt.title[language] || opt.title.en
                  const desc = opt.desc[language] || opt.desc.en

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectLifestyle(opt.id)}
                      className={`p-4 rounded-2xl border text-left transition-all active:scale-98 cursor-pointer flex items-start justify-between min-h-[78px] sm:min-h-[84px] ${
                        isSelected
                          ? 'bg-[#EBFDF5] border-[#079455] shadow-xs ring-1 ring-[#079455]/30'
                          : 'bg-white border-[#DFE8F1] hover:border-[#CBD8E5] hover:bg-[#F8FAFC] shadow-2xs'
                      }`}
                      aria-label={`${title}: ${desc}`}
                      aria-pressed={isSelected}
                    >
                      <div className="space-y-0.5">
                        <span
                          className={`text-[15px] sm:text-[15.5px] font-extrabold block ${
                            isSelected ? 'text-[#079455]' : 'text-[#17191F]'
                          }`}
                        >
                          {title}
                        </span>
                        <span className="text-[12.5px] sm:text-[13px] text-[#6F7480] block">{desc}</span>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                          isSelected
                            ? 'bg-[#079455] border-[#079455] text-white'
                            : 'bg-white border-[#CBD8E5]'
                        }`}
                      >
                        {isSelected && <Check size={12} className="stroke-[3]" />}
                      </div>
                    </button>
                  )
                })}

                {/* Explicit Other / Type lifestyle habit */}
                <button
                  type="button"
                  onClick={() => {
                    setVoiceModalMode('TYPING')
                    setIsVoiceModalOpen(true)
                  }}
                  className="p-4 rounded-2xl border-2 border-dashed border-[#079455]/50 bg-[#EBFDF5]/60 hover:bg-[#EBFDF5] text-left transition-all active:scale-98 cursor-pointer flex items-start justify-between min-h-[78px] sm:min-h-[84px] shadow-2xs"
                  aria-label="Other habit or trigger"
                >
                  <div className="space-y-0.5">
                    <span className="text-[15px] sm:text-[15.5px] font-extrabold text-[#079455] flex items-center gap-2">
                      <Keyboard size={16} />
                      {language === 'hi'
                        ? 'अन्य / लिखकर बताएं'
                        : language === 'mr'
                        ? 'इतर / टाईप करा'
                        : language === 'gu'
                        ? 'અન્ય / લખીને જણાવો'
                        : language === 'bn'
                        ? 'অন্যান্য / লিখে জানান'
                        : language === 'ta'
                        ? 'மற்றவை / தட்டச்சு செய்யவும்'
                        : 'Other / Type custom habit'}
                    </span>
                    <span className="text-[12.5px] sm:text-[13px] text-[#6F7480] block">
                      {language === 'hi'
                        ? 'कोई अन्य खान-पान या दिनचर्या का कारण'
                        : 'Any other dietary or daily routine factor'}
                    </span>
                  </div>
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border border-[#079455] bg-white text-[#079455] font-extrabold text-[14px]">
                    +
                  </div>
                </button>
              </div>

              {/* Fixed Ergonomic Action Dock */}
              <KioskBottomDock
                onSpeak={() => {
                  setVoiceModalMode('VOICE')
                  setIsVoiceModalOpen(true)
                }}
                onType={() => {
                  setVoiceModalMode('TYPING')
                  setIsVoiceModalOpen(true)
                }}
                onNext={handleContinueFromLifestyle}
                nextLabel={language === 'hi' ? 'समीक्षा करें →' : 'Review Answers →'}
                onBack={() => setCurrentStage('SEVERITY')}
                backLabel={language === 'hi' ? 'पीछे' : 'Back to Severity'}
                language={language}
              />
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════
              STAGE 6: REVIEW AND CONFIRMATION
          ══════════════════════════════════════════════════════════════════════ */}
          {currentStage === 'REVIEW' && (
            <motion.div
              key="stage-review"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="max-w-2xl mx-auto w-full my-auto space-y-3.5 text-center overflow-y-auto max-h-full py-1"
            >
              <div className="w-13 h-13 rounded-2xl bg-[#EEF5FC] text-[#2365B5] flex items-center justify-center mx-auto shadow-sm border border-[#CBD8E5]">
                <CheckCircle2 size={26} />
              </div>

              <div className="space-y-0.5">
                <h1 className="text-[24px] sm:text-[28px] font-extrabold text-[#17191F] tracking-tight">
                  {language === 'hi'
                    ? 'अपनी जानकारी की समीक्षा करें'
                    : language === 'mr'
                    ? 'आपल्या माहितीचा आढावा घ्या'
                    : language === 'gu'
                    ? 'તમારી વિગતો ચકાસો'
                    : language === 'bn'
                    ? 'আপনার তথ্য পর্যালোচনা করুন'
                    : language === 'ta'
                    ? 'உங்கள் தகவலை மதிப்பாய்வு செய்யவும்'
                    : 'Review your intake assessment'}
                </h1>
                <p className="text-[13.5px] sm:text-[14.5px] text-[#6F7480]">
                  Please verify your responses before proceeding to document scanning.
                </p>
              </div>

              {/* Structured Summary Card with Per-Section Edit Affordances */}
              <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#DFE8F1] shadow-card text-left space-y-3 text-[13.5px]">
                {/* Patient Header */}
                <div className="flex justify-between items-center pb-2.5 border-b border-[#DFE8F1]">
                  <span className="font-bold text-[#6F7480] text-[13.5px]">Patient:</span>
                  <span className="font-extrabold text-[#17191F] text-[15px] sm:text-[16px]">
                    {patientData?.name ?? 'Dhananjay Patil'} ({patientData?.age ?? 67} yrs)
                  </span>
                </div>

                {/* 1. Problem Location */}
                <div className="flex justify-between items-start pt-1">
                  <div className="space-y-0.5">
                    <span className="text-[11.5px] sm:text-[12px] font-bold text-[#6F7480] uppercase block">
                      📍 Selected Body Areas:
                    </span>
                    <span className="font-extrabold text-[#17191F] text-[14.5px] sm:text-[15.5px]">
                      {selectedItems.map((i) => i.label).join(', ') || 'Chest'}
                    </span>
                  </div>
                  <button
                    onClick={() => setCurrentStage('LOCATION')}
                    className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[#2365B5] hover:text-[#174A91] px-2 py-1 rounded-lg hover:bg-[#EEF5FC] transition-colors cursor-pointer"
                  >
                    <Edit3 size={13} />
                    <span>Edit</span>
                  </button>
                </div>

                {/* 2. Specific Symptoms */}
                <div className="flex justify-between items-start pt-1.5 border-t border-[#F1F4F9]">
                  <div className="space-y-0.5">
                    <span className="text-[11.5px] sm:text-[12px] font-bold text-[#6F7480] uppercase block">
                      🩺 Reported Symptoms:
                    </span>
                    <span className="font-bold text-[#17191F] text-[14px] sm:text-[15px]">
                      {Object.values(symptomAnswers).flat().join(', ') || 'Pain / Discomfort'}
                    </span>
                  </div>
                  <button
                    onClick={() => setCurrentStage('SYMPTOMS')}
                    className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[#2365B5] hover:text-[#174A91] px-2 py-1 rounded-lg hover:bg-[#EEF5FC] transition-colors cursor-pointer"
                  >
                    <Edit3 size={13} />
                    <span>Edit</span>
                  </button>
                </div>

                {/* 3. Duration */}
                <div className="flex justify-between items-start pt-1.5 border-t border-[#F1F4F9]">
                  <div className="space-y-0.5">
                    <span className="text-[11.5px] sm:text-[12px] font-bold text-[#6F7480] uppercase block">
                      ⏱️ Duration:
                    </span>
                    <span className="font-bold text-[#17191F] text-[14px] sm:text-[15px]">
                      {resolvedDurationText}
                    </span>
                  </div>
                  <button
                    onClick={() => setCurrentStage('DURATION')}
                    className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[#2365B5] hover:text-[#174A91] px-2 py-1 rounded-lg hover:bg-[#EEF5FC] transition-colors cursor-pointer"
                  >
                    <Edit3 size={13} />
                    <span>Edit</span>
                  </button>
                </div>

                {/* 4. Severity */}
                <div className="flex justify-between items-start pt-1.5 border-t border-[#F1F4F9]">
                  <div className="space-y-0.5">
                    <span className="text-[11.5px] sm:text-[12px] font-bold text-[#6F7480] uppercase block">
                      ⚡ Severity Rating:
                    </span>
                    <span className="font-extrabold text-[#17191F] text-[14.5px] sm:text-[15.5px]">
                      {severityRating} / 10 ({severityRating <= 3 ? 'Mild' : severityRating <= 6 ? 'Moderate' : 'Severe'})
                    </span>
                  </div>
                  <button
                    onClick={() => setCurrentStage('SEVERITY')}
                    className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[#2365B5] hover:text-[#174A91] px-2 py-1 rounded-lg hover:bg-[#EEF5FC] transition-colors cursor-pointer"
                  >
                    <Edit3 size={13} />
                    <span>Edit</span>
                  </button>
                </div>

                {/* 5. Lifestyle Factor */}
                <div className="flex justify-between items-start pt-1.5 border-t border-[#F1F4F9]">
                  <div className="space-y-0.5">
                    <span className="text-[11.5px] sm:text-[12px] font-bold text-[#6F7480] uppercase block">
                      🌿 Lifestyle &amp; Daily Routine:
                    </span>
                    <span className="font-bold text-[#079455] text-[14px] sm:text-[15px]">
                      {resolvedLifestyleText}
                    </span>
                  </div>
                  <button
                    onClick={() => setCurrentStage('LIFESTYLE')}
                    className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[#2365B5] hover:text-[#174A91] px-2 py-1 rounded-lg hover:bg-[#EEF5FC] transition-colors cursor-pointer"
                  >
                    <Edit3 size={13} />
                    <span>Edit</span>
                  </button>
                </div>

                {/* 6. Voice Transcriptions if any */}
                {Object.keys(customSymptomNotes).length > 0 && (
                  <div className="flex justify-between items-start pt-1.5 border-t border-[#F1F4F9]">
                    <div className="space-y-0.5">
                      <span className="text-[11.5px] sm:text-[12px] font-bold text-[#2365B5] uppercase block">
                        🎙️ Patient-Reported Voice Transcription:
                      </span>
                      <span className="font-semibold text-[#17191F] text-[13.5px] italic">
                        &quot;{Object.values(customSymptomNotes).join('; ')}&quot;
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Calm Patient Disclaimer Banner */}
              <div className="bg-[#EEF5FC] border border-[#CBD8E5] rounded-2xl p-3 text-center">
                <p className="text-[12.5px] sm:text-[13px] text-[#4B5565] font-medium leading-relaxed">
                  {language === 'hi'
                    ? 'आपकी जानकारी देखभाल टीम को आपकी स्थिति समझने में मदद करेगी। यह कोई अंतिम निदान नहीं है।'
                    : language === 'mr'
                    ? 'तुमची माहिती डॉक्टरांना तुमचा त्रास समजून घेण्यास मदत करेल. हे वैद्यकीय निदान नाही.'
                    : language === 'gu'
                    ? 'તમારી વિગતો ડૉક્ટરને તમારી તકલીફ સમજવામાં મદદ કરશે. આ અંતિમ નિદાન નથી.'
                    : language === 'bn'
                    ? 'আপনার প্রতিক্রিয়া চিকিৎসক দলকে সাহায্য করবে। এটি কোনো চূড়ান্ত রোগনির্ণয় নয়।'
                    : language === 'ta'
                    ? 'உங்கள் பதில்கள் மருத்துவக் குழுவிற்கு உதவும். இது இறுதி நோய் கண்டறிதல் அல்ல.'
                    : 'Your responses will help the care team understand your concerns. They are not a diagnosis.'}
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-2.5 pt-1">
                <KioskButton
                  variant="primary"
                  size="fullLg"
                  onClick={handleProceedToDocuments}
                >
                  <span>Proceed to Document Scanning</span>
                  <ArrowRight size={18} className="stroke-[2.5]" />
                </KioskButton>

                <button
                  type="button"
                  onClick={() => setCurrentStage('LOCATION')}
                  className="text-[13px] font-bold text-[#6F7480] hover:text-[#17191F] py-1.5 transition-colors cursor-pointer"
                >
                  Edit All Answers
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── 3. Bottom Security & Assistance Footer ── */}
        <footer className="w-full shrink-0 flex items-center justify-between text-[11.5px] sm:text-[12px] text-[#6F7480] pt-1.5 select-none border-t border-[#DFE8F1]/60">
          <div className="flex items-center gap-1.5">
            <Shield size={13} className="text-[#2365B5]" />
            <span>Your information is encrypted, secure, and private</span>
          </div>

          <div className="flex items-center gap-1.5">
            <HelpCircle size={13} className="text-[#6F7480]" />
            <span>Need help? Ask hospital staff</span>
          </div>
        </footer>
      </main>

      {/* ── 4. Multimodal Voice & Typing Assistant Modal Dialog ── */}
      <VoiceIntakeModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onConfirmAnswer={handleConfirmVoiceTranscript}
        questionTitle={localizedQ.title}
        language={language}
        initialMode={voiceModalMode}
      />
    </div>
  )
}
