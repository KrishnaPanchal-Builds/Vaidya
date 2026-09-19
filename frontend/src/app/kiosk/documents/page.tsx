'use client'
/**
 * K-06 — Medical Documents Workflow (Phase 4 + Multilingual)
 *
 * Route: /kiosk/documents
 *
 * Multilingual Architecture:
 * - Powered by useKioskTranslation() for complete EN, HI, MR translations.
 */

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useKioskStore } from '@/store/kiosk.store'
import { useKioskTranslation } from '@/lib/hooks/use-kiosk-translation'
import { KioskButton } from '@/components/kiosk/kiosk-button'
import type { KioskDocument } from '@/types/kiosk'

type DocWorkflowStage =
  | 'ENTRY'
  | 'SCANNER'
  | 'PROCESSING'
  | 'QUALITY_WARNING'
  | 'REVIEW'
  | 'PHASE_5_HANDOFF'

type DocType = 'PRESCRIPTION' | 'LAB_REPORT' | 'DISCHARGE_SUMMARY' | 'OTHER'

export default function KioskDocumentsPage() {
  const router = useRouter()
  const { t } = useKioskTranslation()
  const { language, patientData, documents, advanceStep, addDocument, removeDocument, resetSession, updateActivity } =
    useKioskStore()

  const [stage, setStage] = useState<DocWorkflowStage>('ENTRY')
  const [selectedType, setSelectedType] = useState<DocType>('PRESCRIPTION')
  const [simulateQualityIssue, setSimulateQualityIssue] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [processingStageText, setProcessingStageText] = useState(t.documents.procStep1)
  const [currentScanningDoc, setCurrentScanningDoc] = useState<KioskDocument | null>(null)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)

  useEffect(() => {
    advanceStep('DOCUMENTS')
  }, [advanceStep])

  // If session already has captured documents, default to REVIEW
  useEffect(() => {
    if (documents.length > 0 && stage === 'ENTRY') {
      setStage('REVIEW')
    }
  }, [documents.length, stage])

  // ── Audio Guidance Simulation ───────────────────────────────────────────────

  const handlePlayAudioGuidance = useCallback(() => {
    updateActivity()
    setIsPlayingAudio(true)
    setTimeout(() => {
      setIsPlayingAudio(false)
    }, 2500)
  }, [updateActivity])

  // ── Document Capture & Processing Simulation ────────────────────────────────

  const handleCaptureDocument = useCallback(() => {
    updateActivity()
    setStage('PROCESSING')
    setProcessingProgress(20)
    setProcessingStageText(t.documents.procStep1)

    const newDoc: KioskDocument = {
      id: `doc-${Date.now()}`,
      name:
        selectedType === 'PRESCRIPTION'
          ? `Prescription_${new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}.jpg`
          : selectedType === 'LAB_REPORT'
          ? `Lab_Report_BloodTest.jpg`
          : `Discharge_Summary.pdf`,
      type: selectedType,
      extractedEntitiesCount: selectedType === 'PRESCRIPTION' ? 4 : selectedType === 'LAB_REPORT' ? 6 : 2,
      confidenceScore: simulateQualityIssue ? 62 : 95,
      status: simulateQualityIssue ? 'REVIEW_REQUIRED' : 'COMPLETE',
      capturedAt: 'Today',
    }
    setCurrentScanningDoc(newDoc)

    setTimeout(() => {
      setProcessingProgress(60)
      setProcessingStageText(t.documents.procStep2)

      setTimeout(() => {
        setProcessingProgress(100)
        setProcessingStageText(t.documents.procStep3)

        setTimeout(() => {
          if (simulateQualityIssue) {
            setStage('QUALITY_WARNING')
          } else {
            addDocument(newDoc)
            setStage('REVIEW')
          }
        }, 700)
      }, 900)
    }, 900)
  }, [addDocument, selectedType, simulateQualityIssue, t.documents.procStep1, t.documents.procStep2, t.documents.procStep3, updateActivity])

  // ── Quality Warning Actions ─────────────────────────────────────────────────

  const handleContinueAnyway = useCallback(() => {
    if (currentScanningDoc) {
      addDocument({ ...currentScanningDoc, status: 'REVIEW_REQUIRED' })
    }
    setStage('REVIEW')
  }, [addDocument, currentScanningDoc])

  const handleRescan = useCallback(() => {
    setSimulateQualityIssue(false)
    setStage('SCANNER')
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-canvas)] text-[var(--color-text-primary)]">
      {/* Spacer for fixed header */}
      <div className="h-14 shrink-0" />

      {/* Main Container */}
      <div className="flex-1 w-full max-w-2xl sm:max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col justify-center">
        {/* Patient Context Badge */}
        {patientData && stage !== 'PHASE_5_HANDOFF' && (
          <div className="flex items-center justify-between bg-[var(--color-surface)] px-4 py-2.5 rounded-2xl border border-[var(--color-border)] shadow-sm mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[var(--color-sage-soft)] text-[var(--color-brand)] flex items-center justify-center font-bold text-[13px]">
                {patientData.name.charAt(0)}
              </div>
              <span className="text-[14px] font-bold text-[var(--color-text-primary)]">
                {patientData.name} ({patientData.age} yrs)
              </span>
            </div>
            <span className="text-[12px] font-extrabold text-[var(--color-brand)] bg-[var(--color-sage-soft)] px-2.5 py-1 rounded-md">
              {t.documents.title}
            </span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* ════════════════════════════════════════════════════════════════════
              STAGE 1: ENTRY SCREEN
          ════════════════════════════════════════════════════════════════════ */}
          {stage === 'ENTRY' && (
            <motion.div
              key="doc-entry"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-5 text-center"
            >
              <div className="space-y-1">
                <span className="text-[13px] sm:text-[14px] font-extrabold text-[var(--color-brand)] tracking-wider uppercase">
                  Vaidya Documents
                </span>
                <h1 className="text-[28px] sm:text-[34px] font-extrabold text-[var(--color-text-primary)] leading-tight">
                  {t.documents.title}
                </h1>
                <p className="text-[15px] sm:text-[16px] text-[var(--color-text-secondary)] max-w-xl mx-auto mt-1">
                  {t.documents.titleSub}
                </p>
              </div>

              {/* Audio Instructions Affordance */}
              <button
                onClick={handlePlayAudioGuidance}
                className="bg-[var(--color-surface)] rounded-2xl p-4 shadow-sm border border-[var(--color-border)] flex items-center justify-between hover:border-[var(--color-brand)]/40 transition-all text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-sage-soft)] text-[var(--color-brand)] flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[14px] font-bold text-[var(--color-text-primary)] block">
                      {isPlayingAudio ? '🔊' : '▶'} {t.intake.hearQuestion}
                    </span>
                    <span className="text-[12px] text-[var(--color-text-muted)]">
                      {language === 'mr'
                        ? 'मराठीत ऑडिओ सूचना'
                        : language === 'hi'
                        ? 'हिंदी में ऑडियो निर्देश'
                        : language === 'gu'
                        ? 'ગુજરાતીમાં ઑડિયો સૂચના'
                        : language === 'bn'
                        ? 'বাংলায় অডিও নির্দেশিকা'
                        : language === 'ta'
                        ? 'தமிழில் ஆடியோ வழிகாட்டல்'
                        : 'Audio guidance in English'}
                    </span>
                  </div>
                </div>
                <span className="text-[13px] font-bold text-[var(--color-brand)]">
                  {isPlayingAudio ? '🔊' : '▶'}
                </span>
              </button>

              {/* Two Primary Choices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                {/* Choice 1: Scan New Documents */}
                <button
                  onClick={() => {
                    setStage('SCANNER')
                    updateActivity()
                  }}
                  className="p-5 sm:p-6 bg-[var(--color-surface)] rounded-3xl border-2 border-[var(--color-brand)] hover:border-[var(--color-brand-hover)] shadow-sm hover:shadow-md transition-all flex flex-col gap-3.5 group active:scale-98 cursor-pointer"
                >
                  <div className="w-13 h-13 rounded-2xl bg-[var(--color-sage-soft)] text-[var(--color-brand)] flex items-center justify-center group-hover:bg-[var(--color-brand)] group-hover:text-white transition-colors">
                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 7V4h3M20 7V4h-3M4 17v3h3M20 17v3h-3" />
                      <rect x="7" y="7" width="10" height="10" rx="1.5" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-[18px] sm:text-[19px] font-bold text-[var(--color-text-primary)]">
                        {t.documents.haveDocs}
                      </h2>
                    </div>
                    <p className="text-[14px] text-[var(--color-text-secondary)] mt-1 leading-relaxed">
                      {t.documents.haveDocsDesc}
                    </p>
                  </div>
                </button>

                {/* Choice 2: No New Documents */}
                <button
                  onClick={() => {
                    setStage('PHASE_5_HANDOFF')
                    updateActivity()
                  }}
                  className="p-5 sm:p-6 bg-[var(--color-surface)] rounded-3xl border-2 border-[var(--color-border)] hover:border-[var(--color-brand)] shadow-sm hover:shadow-md transition-all flex flex-col gap-3.5 group active:scale-98 cursor-pointer"
                >
                  <div className="w-13 h-13 rounded-2xl bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)] flex items-center justify-center group-hover:bg-[var(--color-brand)] group-hover:text-white transition-colors">
                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-[18px] sm:text-[19px] font-bold text-[var(--color-text-primary)]">
                      {t.documents.noDocs}
                    </h2>
                    <p className="text-[14px] text-[var(--color-text-secondary)] mt-1 leading-relaxed">
                      {t.documents.noDocsDesc}
                    </p>
                  </div>
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => router.push('/kiosk/intake')}
                  className="text-[14px] sm:text-[15px] font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] py-2.5 px-4 cursor-pointer"
                >
                  ← {t.common.back}
                </button>
              </div>
            </motion.div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              STAGE 2: SCANNER VIEWPORT
          ════════════════════════════════════════════════════════════════════ */}
          {stage === 'SCANNER' && (
            <motion.div
              key="doc-scanner"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
              {/* Header with Type Selector */}
              <div className="flex flex-col gap-2 text-center">
                <h1 className="text-[26px] sm:text-[30px] font-extrabold text-[var(--color-text-primary)]">
                  {t.documents.scannerTitle}
                </h1>
                {/* Document Type Filter Chips */}
                <div className="flex justify-center gap-2 overflow-x-auto py-1">
                  {(['PRESCRIPTION', 'LAB_REPORT', 'DISCHARGE_SUMMARY', 'OTHER'] as const).map((tType) => (
                    <button
                      key={tType}
                      onClick={() => {
                        setSelectedType(tType)
                        updateActivity()
                      }}
                      className={[
                        'px-4 py-2 rounded-full text-[13px] sm:text-[13.5px] font-bold transition-all cursor-pointer',
                        selectedType === tType
                          ? 'bg-[var(--color-brand)] text-white shadow-sm'
                          : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)] hover:bg-[var(--color-sage-soft)]',
                      ].join(' ')}
                    >
                      {tType === 'PRESCRIPTION'
                        ? t.documents.filterPrescription
                        : tType === 'LAB_REPORT'
                        ? t.documents.filterLabReport
                        : tType === 'DISCHARGE_SUMMARY'
                        ? t.documents.filterDischarge
                        : t.documents.filterOther}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optical Scanner Viewport */}
              <div className="relative w-full h-[320px] sm:h-[360px] bg-[#1d2623] rounded-3xl overflow-hidden shadow-xl flex items-center justify-center border-4 border-[var(--color-border)]">
                <div className="absolute inset-5 border-2 border-white/20 rounded-2xl pointer-events-none flex flex-col justify-between p-2">
                  <div className="flex justify-between">
                    <div className="w-8 h-8 border-t-4 border-l-4 border-white -mt-1 -ml-1 rounded-tl-lg" />
                    <div className="w-8 h-8 border-t-4 border-r-4 border-white -mt-1 -mr-1 rounded-tr-lg" />
                  </div>
                  <div className="flex justify-between">
                    <div className="w-8 h-8 border-b-4 border-l-4 border-white -mb-1 -ml-1 rounded-bl-lg" />
                    <div className="w-8 h-8 border-b-4 border-r-4 border-white -mb-1 -mr-1 rounded-br-lg" />
                  </div>
                </div>

                {/* Animated Scanline */}
                <div
                  className="absolute left-5 right-5 h-[3px] bg-[var(--color-verified)] shadow-[0_0_15px_var(--color-verified)] motion-safe:animate-bounce"
                  style={{ animationDuration: '2s' }}
                />

                {/* Center document preview guide */}
                <div className="text-white/40 flex flex-col items-center gap-2 pointer-events-none">
                  <svg viewBox="0 0 24 24" className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="4" y="3" width="16" height="18" rx="2" />
                    <line x1="8" y1="8" x2="16" y2="8" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                    <line x1="8" y1="16" x2="12" y2="16" />
                  </svg>
                  <span className="text-[13px] font-mono tracking-wider uppercase text-white/70">
                    {t.documents.alignGuide}
                  </span>
                </div>
              </div>

              {/* Guidance Chips */}
              <div className="flex justify-center gap-2 text-[13px] flex-wrap">
                <span className="bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)] px-3.5 py-1.5 rounded-full font-medium border border-[var(--color-border)]">
                  ✓ {t.documents.placeFlat}
                </span>
                <span className="bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)] px-3.5 py-1.5 rounded-full font-medium border border-[var(--color-border)]">
                  ✓ {t.documents.goodLight}
                </span>
                <span className="bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)] px-3.5 py-1.5 rounded-full font-medium border border-[var(--color-border)]">
                  ✓ {t.documents.fullPage}
                </span>
              </div>

              {/* Shutter Capture & Testing Trigger */}
              <div className="flex flex-col items-center gap-3 pt-1">
                <button
                  onClick={handleCaptureDocument}
                  className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-white border-4 border-[var(--color-brand)] p-1.5 shadow-xl hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                  aria-label={t.documents.tapToCapture}
                >
                  <div className="w-full h-full rounded-full bg-[var(--color-brand)] flex items-center justify-center text-white">
                    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19 4h-3.5L14 2H10L8.5 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                    </svg>
                  </div>
                </button>
                <span className="text-[14px] font-bold text-[var(--color-brand)]">
                  {t.documents.tapToCapture}
                </span>

                {/* Simulation toggle */}
                <label className="flex items-center gap-2 text-[12.5px] text-[var(--color-text-muted)] cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={simulateQualityIssue}
                    onChange={(e) => setSimulateQualityIssue(e.target.checked)}
                    className="rounded border-[var(--color-border)] text-[var(--color-brand)]"
                  />
                  <span>{t.documents.simBlurToggle}</span>
                </label>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setStage(documents.length > 0 ? 'REVIEW' : 'ENTRY')}
                  className="text-[14px] sm:text-[15px] font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] py-2 px-3.5 cursor-pointer"
                >
                  ← {t.common.cancel}
                </button>
              </div>
            </motion.div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              STAGE 3: PROCESSING SCREEN
          ════════════════════════════════════════════════════════════════════ */}
          {stage === 'PROCESSING' && (
            <motion.div
              key="doc-processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center gap-6 py-12 text-center"
            >
              <div className="relative w-22 h-22">
                <div className="absolute inset-0 rounded-full border-4 border-[var(--color-surface-subtle)]" />
                <div className="absolute inset-0 rounded-full border-4 border-[var(--color-brand)] border-t-transparent animate-spin" />
              </div>

              <div className="space-y-2 w-full max-w-[420px]">
                <h2 className="text-[24px] font-bold text-[var(--color-text-primary)]">
                  {t.documents.processingTitle}
                </h2>
                <p className="text-[15px] text-[var(--color-brand)] font-semibold">
                  {processingStageText}
                </p>

                <div className="w-full h-2.5 bg-[var(--color-surface-subtle)] rounded-full overflow-hidden mt-3">
                  <div
                    className="h-full bg-[var(--color-brand)] transition-all duration-500 rounded-full"
                    style={{ width: `${processingProgress}%` }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              STAGE 4: QUALITY WARNING SCREEN
          ════════════════════════════════════════════════════════════════════ */}
          {stage === 'QUALITY_WARNING' && (
            <motion.div
              key="doc-quality-warning"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-5 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-[var(--color-warning-bg)] text-[var(--color-warning)] flex items-center justify-center mx-auto shadow-sm border border-[var(--color-warning)]/20">
                <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>

              <div className="space-y-1">
                <h1 className="text-[26px] sm:text-[30px] font-extrabold text-[var(--color-text-primary)]">
                  {t.documents.qualityWarningTitle}
                </h1>
                <p className="text-[14px] sm:text-[15px] text-[var(--color-text-secondary)] mt-1 max-w-[440px] mx-auto">
                  {t.documents.qualityWarningDesc}
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <KioskButton
                  variant="primary"
                  size="fullLg"
                  onClick={handleRescan}
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 7V4h3M20 7V4h-3M4 17v3h3M20 17v3h-3" />
                  </svg>
                  {t.documents.scanAgain}
                </KioskButton>

                <KioskButton
                  variant="secondary"
                  size="full"
                  onClick={handleContinueAnyway}
                >
                  {t.documents.continueAnyway}
                </KioskButton>

                <p className="text-[12.5px] text-[var(--color-text-muted)] pt-1">
                  {t.common.staffHelp}
                </p>
              </div>
            </motion.div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              STAGE 5: REVIEW / MULTI-DOC LIST
          ════════════════════════════════════════════════════════════════════ */}
          {stage === 'REVIEW' && (
            <motion.div
              key="doc-review"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-5"
            >
              <div className="text-center space-y-1">
                <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[var(--color-text-primary)]">
                  {t.documents.yourDocsTitle}
                </h1>
                <p className="text-[14.5px] sm:text-[15.5px] text-[var(--color-text-secondary)]">
                  {documents.length} {t.documents.docCountLabel}
                </p>
              </div>

              {/* Document List Stack */}
              <div className="flex flex-col gap-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-[var(--color-surface)] rounded-2xl p-4 sm:p-5 border border-[var(--color-border)] shadow-sm flex items-center justify-between gap-3.5"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-[var(--color-sage-soft)] text-[var(--color-brand)] flex items-center justify-center shrink-0">
                        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-[15px] sm:text-[16px] font-bold text-[var(--color-text-primary)] truncate">
                            {doc.name}
                          </h3>
                          <span
                            className={[
                              'text-[10.5px] sm:text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border',
                              doc.status === 'COMPLETE'
                                ? 'bg-[var(--color-verified-bg)] text-[var(--color-verified)] border-[var(--color-sage-border)]'
                                : 'bg-[var(--color-warning-bg)] text-[var(--color-warning)] border-[var(--color-warning)]/30',
                            ].join(' ')}
                          >
                            {doc.status}
                          </span>
                        </div>
                        <p className="text-[13px] text-[var(--color-text-secondary)] mt-0.5">
                          {doc.extractedEntitiesCount} entities extracted • {doc.confidenceScore}% clarity
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => removeDocument(doc.id)}
                      className="p-2.5 text-[var(--color-text-muted)] hover:text-[var(--color-critical)] rounded-lg hover:bg-[var(--color-critical-bg)] transition-colors shrink-0 cursor-pointer"
                      aria-label={`Remove ${doc.name}`}
                    >
                      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                ))}

                {/* Add Another Document Button */}
                <button
                  onClick={() => {
                    setStage('SCANNER')
                    updateActivity()
                  }}
                  className="w-full py-4 border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-brand)] bg-[var(--color-surface)]/50 hover:bg-[var(--color-surface-subtle)] rounded-2xl flex items-center justify-center gap-2 text-[14.5px] sm:text-[15.5px] font-bold text-[var(--color-brand)] transition-all cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  {t.documents.scanAnother}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5 pt-2">
                <KioskButton
                  variant="primary"
                  size="fullLg"
                  onClick={() => router.push('/kiosk/review')}
                >
                  {t.documents.continueToReview}
                </KioskButton>

                <KioskButton
                  variant="ghost"
                  size="full"
                  onClick={() => router.push('/kiosk/intake')}
                >
                  ← {t.common.back}
                </KioskButton>
              </div>
            </motion.div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              STAGE 6: READY FOR REVIEW
          ════════════════════════════════════════════════════════════════════ */}
          {stage === 'PHASE_5_HANDOFF' && (
            <motion.div
              key="doc-phase5-handoff"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-6 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-[var(--color-brand)] text-white flex items-center justify-center mx-auto shadow-md">
                <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </div>

              <div className="space-y-1">
                <span className="text-[13px] sm:text-[14px] font-extrabold text-[var(--color-brand)] tracking-wider uppercase">
                  {t.documents.readyReviewTitle}
                </span>
                <h1 className="text-[28px] sm:text-[34px] font-extrabold text-[var(--color-text-primary)]">
                  {t.documents.readyReviewTitle}
                </h1>
                <p className="text-[14.5px] sm:text-[15.5px] text-[var(--color-text-secondary)] max-w-xl mx-auto">
                  {t.documents.readyReviewDesc}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-2">
                <KioskButton
                  variant="primary"
                  size="fullLg"
                  onClick={() => {
                    advanceStep('REVIEW')
                    router.push('/kiosk/review')
                  }}
                >
                  {t.documents.continueToReview}
                </KioskButton>

                <div className="flex gap-2.5">
                  <KioskButton
                    variant="secondary"
                    size="md"
                    className="flex-1"
                    onClick={() => setStage(documents.length > 0 ? 'REVIEW' : 'ENTRY')}
                  >
                    ← {t.common.edit}
                  </KioskButton>
                  <KioskButton
                    variant="ghost"
                    size="md"
                    className="flex-1"
                    onClick={() => {
                      resetSession()
                      router.replace('/kiosk')
                    }}
                  >
                    {t.common.startOver}
                  </KioskButton>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
