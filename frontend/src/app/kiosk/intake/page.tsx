'use client'

/**
 * K-05 — Patient Clinical Intake with Interactive 2.5D Body Symptom Selection
 *
 * Route: /kiosk/intake
 * Features:
 * - 2.5D Medical Mannequin Body Map with Front/Back/Side view switching & 360 rotation
 * - 9-Category Medical Symptom Grid with custom vector icons
 * - Synchronized body hotspot & category selections with removable chips
 * - 4-Stage Progressive Clinical Intake: Complaint -> Duration -> Quality -> Lifestyle -> Summary
 * - Multimodal voice synthesis & speech input fallback
 */

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, HelpCircle, ArrowRight, Volume2, Mic, CheckCircle2 } from 'lucide-react'
import { useKioskStore } from '@/store/kiosk.store'
import { useKioskTranslation } from '@/lib/hooks/use-kiosk-translation'
import { KioskButton } from '@/components/kiosk/kiosk-button'
import {
  InteractiveBodyMap,
  SymptomCategoryGrid,
  SelectedAreasPanel,
  KioskStepperHeader,
  SYMPTOM_CATEGORIES,
  type BodyHotspot,
  type BodyRegionId,
  type SymptomCategoryId,
  type SelectedItem,
  type IntakeStageKey,
} from '@/components/kiosk/body-map'

type IntakeStage =
  | 'CHIEF_COMPLAINT'
  | 'DURATION'
  | 'CHARACTER'
  | 'AYUSH_LIFESTYLE'
  | 'SUMMARY'

type VoiceModalState = 'IDLE' | 'LISTENING' | 'PROCESSING' | 'CONFIRMING'

export default function KioskIntakePage() {
  const router = useRouter()
  const { t } = useKioskTranslation()
  const { language, patientData, advanceStep, setIntakeAnswer, updateActivity } = useKioskStore()

  const [stage, setStage] = useState<IntakeStage>('CHIEF_COMPLAINT')
  const [voiceModal, setVoiceModal] = useState<VoiceModalState>('IDLE')
  const [activeVoiceQuestion, setActiveVoiceQuestion] = useState<string>('')
  const [recognizedText, setRecognizedText] = useState<{ native: string; english: string }>({ native: '', english: '' })
  const [matchedOption, setMatchedOption] = useState<string>('')
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false)

  // ── Body & Category Selections State ──
  const [selectedRegions, setSelectedRegions] = useState<BodyRegionId[]>(['chest'])
  const [selectedCategories, setSelectedCategories] = useState<SymptomCategoryId[]>(['chest_breathing'])
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([
    { id: 'chest', label: 'Chest' },
  ])

  // ── Subsequent Stages Answers State ──
  const [selectedDuration, setSelectedDuration] = useState<string>(t.intake.durWeeks)
  const [selectedCharacter, setSelectedCharacter] = useState<string>(t.intake.qualBurning)
  const [selectedLifestyle, setSelectedLifestyle] = useState<string>(t.intake.lifeSpicy)

  useEffect(() => {
    advanceStep('INTAKE')
  }, [advanceStep])

  // ── Body Hotspot Toggle Handler ──
  const handleToggleHotspot = useCallback((hotspot: BodyHotspot) => {
    updateActivity()
    setSelectedRegions((prev) => {
      const exists = prev.includes(hotspot.id)
      let next: BodyRegionId[]
      if (exists) {
        next = prev.filter((id) => id !== hotspot.id)
      } else {
        next = [...prev, hotspot.id]
      }
      return next
    })

    // Also link category
    setSelectedCategories((prev) => {
      if (prev.includes(hotspot.categoryId)) {
        return prev
      }
      return [...prev, hotspot.categoryId]
    })

    // Update selected items list
    setSelectedItems((prev) => {
      const exists = prev.some((item) => item.id === hotspot.id)
      if (exists) {
        return prev.filter((item) => item.id !== hotspot.id)
      } else {
        return [...prev, { id: hotspot.id, label: hotspot.label }]
      }
    })
  }, [updateActivity])

  // ── Category Card Toggle Handler ──
  const handleToggleCategory = useCallback((catId: SymptomCategoryId) => {
    updateActivity()
    const cat = SYMPTOM_CATEGORIES.find((c) => c.id === catId)
    if (!cat) return

    setSelectedCategories((prev) => {
      const exists = prev.includes(catId)
      if (exists) {
        return prev.filter((id) => id !== catId)
      } else {
        return [...prev, catId]
      }
    })

    // Also activate primary region on body
    setSelectedRegions((prev) => {
      if (prev.includes(cat.primaryRegionId)) {
        return prev.filter((id) => id !== cat.primaryRegionId)
      }
      return [...prev, cat.primaryRegionId]
    })

    // Update selected items list
    setSelectedItems((prev) => {
      const exists = prev.some((item) => item.id === cat.primaryRegionId || item.id === cat.id)
      if (exists) {
        return prev.filter((item) => item.id !== cat.primaryRegionId && item.id !== cat.id)
      } else {
        return [...prev, { id: cat.primaryRegionId, label: cat.label.split('/')[0].trim() }]
      }
    })
  }, [updateActivity])

  // ── Remove Single Selected Item ──
  const handleRemoveSelectedItem = useCallback((itemId: string) => {
    updateActivity()
    setSelectedItems((prev) => prev.filter((item) => item.id !== itemId))
    setSelectedRegions((prev) => prev.filter((id) => id !== itemId))
    
    // Check if category needs to be unselected
    const cat = SYMPTOM_CATEGORIES.find((c) => c.primaryRegionId === itemId || c.id === itemId)
    if (cat) {
      setSelectedCategories((prev) => prev.filter((cId) => cId !== cat.id))
    }
  }, [updateActivity])

  // ── Clear All Selections ──
  const handleClearAll = useCallback(() => {
    updateActivity()
    setSelectedItems([])
    setSelectedRegions([])
    setSelectedCategories([])
  }, [updateActivity])

  // ── Continue to Duration Stage ──
  const handleContinueFromComplaint = useCallback(() => {
    updateActivity()
    const complaintSummary = selectedItems.map((i) => i.label).join(', ') || 'General Discomfort'
    setIntakeAnswer('chief_complaint', complaintSummary)
    setStage('DURATION')
  }, [selectedItems, setIntakeAnswer, updateActivity])

  // ── Map stage to Stepper key ──
  const getStepperStage = (): IntakeStageKey => {
    switch (stage) {
      case 'CHIEF_COMPLAINT':
        return 'COMPLAINT'
      case 'DURATION':
        return 'DURATION'
      case 'CHARACTER':
        return 'QUALITY'
      case 'AYUSH_LIFESTYLE':
        return 'LIFESTYLE'
      case 'SUMMARY':
      default:
        return 'SUMMARY'
    }
  }

  // ── Header Stepper Navigation ──
  const handleStepperSelect = (stepperKey: IntakeStageKey) => {
    updateActivity()
    if (stepperKey === 'COMPLAINT') setStage('CHIEF_COMPLAINT')
    else if (stepperKey === 'DURATION') setStage('DURATION')
    else if (stepperKey === 'QUALITY') setStage('CHARACTER')
    else if (stepperKey === 'LIFESTYLE') setStage('AYUSH_LIFESTYLE')
    else if (stepperKey === 'SUMMARY') setStage('SUMMARY')
  }

  // ── TTS Question Audio Playback ──
  const handleHearQuestion = useCallback(() => {
    updateActivity()
    setIsSpeakingQuestion(true)
    setTimeout(() => {
      setIsSpeakingQuestion(false)
    }, 2200)
  }, [updateActivity])

  // ── Voice Input Simulation ──
  const handleStartVoice = useCallback(
    (questionKey: string, sampleNative: string, sampleEnglish: string, targetOption: string) => {
      updateActivity()
      setActiveVoiceQuestion(questionKey)
      setVoiceModal('LISTENING')
      setRecognizedText({ native: sampleNative, english: sampleEnglish })
      setMatchedOption(targetOption)

      setTimeout(() => {
        setVoiceModal('PROCESSING')
        setTimeout(() => {
          setVoiceModal('CONFIRMING')
        }, 800)
      }, 2000)
    },
    [updateActivity]
  )

  const handleConfirmVoiceAnswer = useCallback(() => {
    updateActivity()
    if (activeVoiceQuestion === 'CHIEF_COMPLAINT') {
      setSelectedItems([{ id: 'voice_complaint', label: matchedOption }])
      setIntakeAnswer('chief_complaint', matchedOption)
      setVoiceModal('IDLE')
      setStage('DURATION')
    } else if (activeVoiceQuestion === 'DURATION') {
      setSelectedDuration(matchedOption)
      setIntakeAnswer('duration', matchedOption)
      setVoiceModal('IDLE')
      setStage('CHARACTER')
    } else if (activeVoiceQuestion === 'CHARACTER') {
      setSelectedCharacter(matchedOption)
      setIntakeAnswer('character', matchedOption)
      setVoiceModal('IDLE')
      setStage('AYUSH_LIFESTYLE')
    } else if (activeVoiceQuestion === 'AYUSH_LIFESTYLE') {
      setSelectedLifestyle(matchedOption)
      setIntakeAnswer('lifestyle_ahara', matchedOption)
      setVoiceModal('IDLE')
      setStage('SUMMARY')
    }
  }, [activeVoiceQuestion, matchedOption, setIntakeAnswer, updateActivity])

  return (
    <div className="h-full max-h-full flex flex-col bg-[#F7F9FC] text-[#17191F] antialiased overflow-hidden select-none">
      {/* ── 1. Top Persistent Stepper Header ── */}
      <KioskStepperHeader
        currentStage={getStepperStage()}
        onSelectStage={handleStepperSelect}
      />

      {/* ── 2. Main Intake Canvas Container ── */}
      <main className="flex-1 min-h-0 max-w-7xl w-full mx-auto px-3 sm:px-5 lg:px-6 py-1.5 sm:py-2 flex flex-col justify-between overflow-hidden">
        <AnimatePresence mode="wait">
          {/* ══════════════════════════════════════════════════════════════════════
              STAGE 1: 2.5D INTERACTIVE HUMAN BODY SYMPTOM SELECTION
          ══════════════════════════════════════════════════════════════════════ */}
          {stage === 'CHIEF_COMPLAINT' && (
            <motion.div
              key="stage-body-map"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 min-h-0 flex flex-col justify-between gap-1.5 overflow-hidden"
            >
              {/* Page Title & Subtext */}
              <div className="text-center space-y-0.5 shrink-0">
                <h1 className="text-[20px] sm:text-[24px] lg:text-[26px] font-extrabold text-[#17191F] tracking-tight leading-tight">
                  Where is the problem?
                </h1>
                <p className="text-[12px] sm:text-[13px] font-medium text-[#6F7480] max-w-2xl mx-auto">
                  Touch the body part where you feel pain, discomfort, or have a health concern.
                </p>
              </div>

              {/* Two-Column Responsive Split Workspace */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 min-h-0 items-stretch overflow-hidden">
                {/* ── LEFT PANEL: 2.5D Interactive Body Canvas (Cols: 7/12) ── */}
                <div className="lg:col-span-7 h-full min-h-0 flex flex-col">
                  <InteractiveBodyMap
                    selectedRegions={selectedRegions}
                    selectedCategories={selectedCategories}
                    onToggleHotspot={handleToggleHotspot}
                    onResetView={() => {
                      setSelectedRegions(['chest'])
                      setSelectedCategories(['chest_breathing'])
                      setSelectedItems([{ id: 'chest', label: 'Chest' }])
                    }}
                  />
                </div>

                {/* ── RIGHT PANEL: Symptom Categories & Selected Areas (Cols: 5/12) ── */}
                <div className="lg:col-span-5 h-full min-h-0 flex flex-col">
                  <div
                    className="bg-white rounded-3xl border border-[#DFE8F1] shadow-card p-3 sm:p-3.5 flex flex-col justify-between h-full min-h-0 gap-2 overflow-hidden"
                    style={{
                      boxShadow: '0 4px 20px rgba(35, 75, 115, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    {/* Top: 9 Category Cards */}
                    <SymptomCategoryGrid
                      selectedCategories={selectedCategories}
                      onToggleCategory={handleToggleCategory}
                    />

                    {/* Bottom: Selected Areas & Continue Action */}
                    <SelectedAreasPanel
                      selectedItems={selectedItems}
                      onRemoveItem={handleRemoveSelectedItem}
                      onClearAll={handleClearAll}
                      onContinue={handleContinueFromComplaint}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════
              STAGE 2: DURATION & ONSET
          ══════════════════════════════════════════════════════════════════════ */}
          {stage === 'DURATION' && (
            <motion.div
              key="stage-duration"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="max-w-2xl mx-auto w-full my-auto space-y-6"
            >
              <div className="text-center space-y-1.5">
                <div className="flex justify-center items-center gap-2">
                  <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#17191F] leading-tight">
                    How long have you had this issue?
                  </h1>
                  <button
                    onClick={handleHearQuestion}
                    className="p-2 rounded-full bg-[#EEF5FC] text-[#2365B5] hover:bg-[#D3E2F0] transition-colors"
                    aria-label="Hear question audio"
                  >
                    <Volume2 size={18} />
                  </button>
                </div>
                <p className="text-[14px] text-[#6F7480]">
                  Select the duration that best describes when your symptoms started.
                </p>
                {isSpeakingQuestion && (
                  <span className="inline-block text-[11px] font-bold text-[#2365B5] bg-[#EEF5FC] px-3 py-0.5 rounded-full animate-pulse">
                    Playing audio guidance...
                  </span>
                )}
              </div>

              {/* Symptom Context Badge */}
              <div className="bg-[#EEF5FC] p-3.5 rounded-2xl border border-[#CBD8E5] flex items-center justify-between">
                <span className="text-[13.5px] text-[#4B5565]">
                  Regarding: <strong className="text-[#2365B5]">{selectedItems.map((i) => i.label).join(', ') || 'Chest'}</strong>
                </span>
                <button
                  onClick={() => {
                    handleStartVoice(
                      'DURATION',
                      'जवळपास १ ते २ आठवड्यांपासून आहे.',
                      'It has been about 1 to 2 weeks.',
                      t.intake.durWeeks
                    )
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2365B5] text-white rounded-xl text-[12px] font-bold shadow-xs hover:bg-[#174A91] transition-colors"
                >
                  <Mic size={14} />
                  <span>Speak Answer</span>
                </button>
              </div>

              {/* Touch Options */}
              <div className="grid grid-cols-1 gap-3">
                {[
                  { label: 'Less than 24 hours (Just started today)', value: t.intake.durAcute },
                  { label: '1 to 2 weeks (Recent discomfort)', value: t.intake.durWeeks },
                  { label: 'More than 1 month (Ongoing / Chronic)', value: t.intake.durChronic },
                  { label: 'Comes and goes intermittently', value: t.intake.durIntermittent },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      updateActivity()
                      setSelectedDuration(opt.value)
                      setIntakeAnswer('duration', opt.value)
                      setStage('CHARACTER')
                    }}
                    className="p-4 bg-white rounded-2xl border border-[#DFE8F1] shadow-2xs hover:border-[#2365B5] hover:bg-[#F0F6FD] flex items-center justify-between text-left transition-all active:scale-98 group cursor-pointer"
                  >
                    <span className="text-[15px] font-bold text-[#17191F] group-hover:text-[#174A91]">
                      {opt.label}
                    </span>
                    <ArrowRight size={18} className="text-[#9AA8B7] group-hover:text-[#2365B5] transition-colors" />
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setStage('CHIEF_COMPLAINT')}
                  className="text-[13.5px] font-bold text-[#6F7480] hover:text-[#17191F] py-2 px-3 rounded-lg"
                >
                  ← Back to Body Map
                </button>
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════
              STAGE 3: QUALITY & SENSATION
          ══════════════════════════════════════════════════════════════════════ */}
          {stage === 'CHARACTER' && (
            <motion.div
              key="stage-quality"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="max-w-2xl mx-auto w-full my-auto space-y-6"
            >
              <div className="text-center space-y-1.5">
                <div className="flex justify-center items-center gap-2">
                  <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#17191F] leading-tight">
                    What does the sensation feel like?
                  </h1>
                  <button
                    onClick={handleHearQuestion}
                    className="p-2 rounded-full bg-[#EEF5FC] text-[#2365B5] hover:bg-[#D3E2F0]"
                  >
                    <Volume2 size={18} />
                  </button>
                </div>
                <p className="text-[14px] text-[#6F7480]">
                  Choose the description that most closely matches your pain or discomfort.
                </p>
              </div>

              {/* Touch Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { title: 'Burning or Acidity', desc: 'Hot, reflux, or burning feeling', value: t.intake.qualBurning },
                  { title: 'Dull Ache / Heaviness', desc: 'Continuous mild pressure or weight', value: t.intake.qualDull },
                  { title: 'Sharp / Stabbing', desc: 'Sudden, piercing, or pinching pain', value: t.intake.qualSharp },
                  { title: 'Cramping / Spasm', desc: 'Tightening or twisting sensation', value: t.intake.qualCramp },
                  { title: 'Stiffness / Throbbing', desc: 'Pulsing or restricted movement', value: 'Stiffness / Throbbing' },
                  { title: 'Not Sure / General', desc: 'Difficult to specify precisely', value: t.intake.qualNotSure },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      updateActivity()
                      setSelectedCharacter(opt.value)
                      setIntakeAnswer('character', opt.value)
                      setStage('AYUSH_LIFESTYLE')
                    }}
                    className="p-4 bg-white rounded-2xl border border-[#DFE8F1] shadow-2xs hover:border-[#2365B5] hover:bg-[#F0F6FD] flex flex-col justify-between text-left transition-all active:scale-98 group cursor-pointer min-h-[90px]"
                  >
                    <div>
                      <span className="text-[14.5px] font-extrabold text-[#17191F] group-hover:text-[#174A91] block">
                        {opt.title}
                      </span>
                      <span className="text-[12px] text-[#6F7480] mt-0.5 block">
                        {opt.desc}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setStage('DURATION')}
                  className="text-[13.5px] font-bold text-[#6F7480] hover:text-[#17191F] py-2 px-3 rounded-lg"
                >
                  ← Back to Duration
                </button>
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════
              STAGE 4: AYUSH & LIFESTYLE CORRELATION
          ══════════════════════════════════════════════════════════════════════ */}
          {stage === 'AYUSH_LIFESTYLE' && (
            <motion.div
              key="stage-lifestyle"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="max-w-2xl mx-auto w-full my-auto space-y-6"
            >
              <div className="text-center space-y-1.5">
                <div className="flex justify-center items-center gap-2">
                  <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#17191F] leading-tight">
                    Any lifestyle or dietary trigger?
                  </h1>
                  <button
                    onClick={handleHearQuestion}
                    className="p-2 rounded-full bg-[#EBFDF5] text-[#079455] hover:bg-[#D1FADF]"
                  >
                    <Volume2 size={18} />
                  </button>
                </div>
                <p className="text-[14px] text-[#6F7480]">
                  AYUSH Ahara &amp; Vihara clinical assessment for holistic care.
                </p>
              </div>

              {/* Touch Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { title: 'Spicy or Fried Food', desc: 'Worse after oily/spicy meals', value: t.intake.lifeSpicy },
                  { title: 'Fasting or Delayed Meals', desc: 'Worse on empty stomach', value: t.intake.lifeFasting },
                  { title: 'Stress or Lack of Sleep', desc: 'Fatigue, disturbed routine', value: t.intake.lifeStress },
                  { title: 'No Specific Pattern', desc: 'Occurs regardless of food or rest', value: t.intake.lifeNoPattern },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      updateActivity()
                      setSelectedLifestyle(opt.value)
                      setIntakeAnswer('lifestyle_ahara', opt.value)
                      setStage('SUMMARY')
                    }}
                    className="p-4 bg-white rounded-2xl border border-[#DFE8F1] shadow-2xs hover:border-[#079455] hover:bg-[#EBFDF5] flex flex-col justify-between text-left transition-all active:scale-98 group cursor-pointer min-h-[90px]"
                  >
                    <div>
                      <span className="text-[14.5px] font-extrabold text-[#17191F] group-hover:text-[#079455] block">
                        {opt.title}
                      </span>
                      <span className="text-[12px] text-[#6F7480] mt-0.5 block">
                        {opt.desc}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setStage('CHARACTER')}
                  className="text-[13.5px] font-bold text-[#6F7480] hover:text-[#17191F] py-2 px-3 rounded-lg"
                >
                  ← Back to Quality
                </button>
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════
              STAGE 5: INTAKE SUMMARY & PROCEED TO DOCUMENTS
          ══════════════════════════════════════════════════════════════════════ */}
          {stage === 'SUMMARY' && (
            <motion.div
              key="stage-summary"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="max-w-xl mx-auto w-full my-auto space-y-5 text-center"
            >
              <div className="w-16 h-16 rounded-3xl bg-[#EEF5FC] text-[#2365B5] flex items-center justify-center mx-auto shadow-sm border border-[#CBD8E5]">
                <CheckCircle2 size={32} />
              </div>

              <div className="space-y-1">
                <h1 className="text-[28px] font-extrabold text-[#17191F] tracking-tight">
                  Intake Assessment Complete
                </h1>
                <p className="text-[14px] text-[#6F7480]">
                  Your symptom profile is recorded and ready for the attending physician.
                </p>
              </div>

              {/* Summary Card */}
              <div className="bg-white rounded-3xl p-5 border border-[#DFE8F1] shadow-card text-left space-y-3 text-[13.5px]">
                <div className="flex justify-between items-center pb-2.5 border-b border-[#DFE8F1]">
                  <span className="font-bold text-[#6F7480]">Patient:</span>
                  <span className="font-extrabold text-[#17191F]">
                    {patientData?.name ?? 'Dhananjay Patil'} ({patientData?.age ?? 67} yrs)
                  </span>
                </div>

                <div className="flex justify-between items-start">
                  <span className="text-[#6F7480]">Symptoms &amp; Regions:</span>
                  <span className="font-extrabold text-[#17191F] text-right">
                    {selectedItems.map((i) => i.label).join(', ') || 'Chest'}
                  </span>
                </div>

                <div className="flex justify-between items-start">
                  <span className="text-[#6F7480]">Duration:</span>
                  <span className="font-bold text-[#17191F] text-right">{selectedDuration}</span>
                </div>

                <div className="flex justify-between items-start">
                  <span className="text-[#6F7480]">Quality:</span>
                  <span className="font-bold text-[#17191F] text-right">{selectedCharacter}</span>
                </div>

                <div className="flex justify-between items-start">
                  <span className="text-[#6F7480]">Lifestyle Factor:</span>
                  <span className="font-bold text-[#079455] text-right">{selectedLifestyle}</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-2.5 pt-2">
                <KioskButton
                  variant="primary"
                  size="fullLg"
                  onClick={() => {
                    advanceStep('DOCUMENTS')
                    router.push('/kiosk/documents')
                  }}
                >
                  <span>Proceed to Document Scanning</span>
                  <ArrowRight size={18} className="stroke-[2.5]" />
                </KioskButton>

                <KioskButton
                  variant="secondary"
                  size="md"
                  onClick={() => setStage('CHIEF_COMPLAINT')}
                >
                  Edit Symptom Locations
                </KioskButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── 3. Bottom Security & Assistance Footer ── */}
        <footer className="w-full shrink-0 flex items-center justify-between text-[11.5px] text-[#6F7480] pt-1.5 select-none border-t border-[#DFE8F1]/60">
          <div className="flex items-center gap-1.5">
            <Shield size={13} className="text-[#2365B5]" />
            <span>Your information is secure and private</span>
          </div>

          <div className="flex items-center gap-1.5">
            <HelpCircle size={13} className="text-[#6F7480]" />
            <span>Need help? Ask hospital staff</span>
          </div>
        </footer>
      </main>

      {/* ── 4. Multimodal Voice Recognition Modal Dialog ── */}
      <AnimatePresence>
        {voiceModal !== 'IDLE' && (
          <div className="fixed inset-0 z-50 bg-[#0c1829]/60 backdrop-blur-xs flex items-center justify-center p-5">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col items-center gap-5 text-center border border-[#CBD8E5]"
            >
              {voiceModal === 'LISTENING' && (
                <>
                  <div className="w-20 h-20 rounded-full bg-[#EEF5FC] text-[#2365B5] flex items-center justify-center">
                    <div className="flex items-center gap-1.5 h-10">
                      {[40, 70, 100, 60, 90, 45, 80, 50].map((h, i) => (
                        <div
                          key={i}
                          className="w-1.5 bg-[#2365B5] rounded-full motion-safe:animate-pulse"
                          style={{ height: `${h}%`, animationDelay: `${i * 120}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-[20px] font-extrabold text-[#17191F]">Listening in {language?.toUpperCase() || 'MR'}...</h2>
                    <p className="text-[13px] text-[#6F7480] mt-1">Please speak clearly towards the microphone.</p>
                  </div>
                </>
              )}

              {voiceModal === 'PROCESSING' && (
                <div className="py-6 flex flex-col items-center gap-3">
                  <div className="w-10 h-10 rounded-full border-4 border-[#2365B5] border-t-transparent animate-spin" />
                  <h2 className="text-[18px] font-bold text-[#17191F]">Transcribing speech...</h2>
                </div>
              )}

              {voiceModal === 'CONFIRMING' && (
                <div className="w-full flex flex-col gap-4">
                  <span className="text-[11px] font-bold text-[#2365B5] uppercase tracking-wider">
                    Speech Recognized (Bhashini AI)
                  </span>
                  <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#DFE8F1] text-left">
                    <p className="text-[15px] font-bold text-[#17191F] italic">
                      &quot;{recognizedText.native}&quot;
                    </p>
                    <div className="w-8 h-px bg-[#DFE8F1] my-2" />
                    <p className="text-[12.5px] text-[#6F7480]">
                      &quot;{recognizedText.english}&quot;
                    </p>
                  </div>
                  <div className="bg-[#EBFDF5] p-3 rounded-xl border border-[#A6F4C5] text-left text-[13px] text-[#079455]">
                    <span>Mapped to: <strong>{matchedOption}</strong></span>
                  </div>

                  <div className="flex flex-col gap-2 w-full pt-1">
                    <KioskButton
                      variant="primary"
                      size="full"
                      onClick={handleConfirmVoiceAnswer}
                    >
                      Confirm &amp; Proceed
                    </KioskButton>
                    <KioskButton
                      variant="ghost"
                      size="full"
                      onClick={() => setVoiceModal('IDLE')}
                    >
                      Cancel
                    </KioskButton>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
