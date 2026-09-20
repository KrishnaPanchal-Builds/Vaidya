'use client'
/**
 * K-06 — High-Precision Medical Documents Intake & Scanner
 *
 * Route: /kiosk/documents
 *
 * Features:
 * - Tactile, modern medical scanner interface with alignment guides & category pills.
 * - Dynamic optical HUD viewfinder with animated laser scanline.
 * - Real-time progress stages (Deskewing -> OCR -> Clinical Entity Extraction).
 * - Multi-document review tray with extraction metrics and clarity confidence scores.
 * - Full multilingual support (EN, HI, MR, GU, BN, TA) with zero state drift.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Camera,
  FileText,
  ScanLine,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Shield,
  Sparkles,
  RefreshCw,
  Plus,
  Pill,
  Activity,
  FileCheck,
  Check,
  Eye,
} from 'lucide-react'
import { useKioskStore } from '@/store/kiosk.store'
import { useKioskTranslation } from '@/lib/hooks/use-kiosk-translation'
import type { KioskDocument } from '@/types/kiosk'
import { DocumentPreviewModal } from '@/components/documents/DocumentPreviewModal'

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
  const { language } = useKioskTranslation()
  const {
    patientData,
    documents,
    advanceStep,
    addDocument,
    removeDocument,
    resetSession,
    updateActivity,
  } = useKioskStore()

  const [stage, setStage] = useState<DocWorkflowStage>('ENTRY')
  const [selectedType, setSelectedType] = useState<DocType>('PRESCRIPTION')
  const [simulateQualityIssue, setSimulateQualityIssue] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [processingStageText, setProcessingStageText] = useState('Initializing optical camera...')
  const [currentScanningDoc, setCurrentScanningDoc] = useState<KioskDocument | null>(null)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [previewDoc, setPreviewDoc] = useState<KioskDocument | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    }, 2800)
  }, [updateActivity])

  // ── Document Capture & Processing Simulation ────────────────────────────────
  const handleCaptureDocument = useCallback(
    (customFileName?: string) => {
      updateActivity()
      setStage('PROCESSING')
      setProcessingProgress(25)
      setProcessingStageText(
        language === 'hi'
          ? 'दस्तावेज़ स्कैन और सीधा किया जा रहा है...'
          : language === 'mr'
          ? 'कागदपत्र स्कॅन करून सरळ केले जात आहे...'
          : 'Deskewing & Optical Character Recognition (OCR)...'
      )

      const docName =
        customFileName ||
        (selectedType === 'PRESCRIPTION'
          ? `Prescription_${new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}.jpg`
          : selectedType === 'LAB_REPORT'
          ? `Lab_Report_BloodTest.jpg`
          : `Discharge_Summary.pdf`)

      const newDoc: KioskDocument = {
        id: `doc-${Date.now()}`,
        name: docName,
        type: selectedType,
        extractedEntitiesCount:
          selectedType === 'PRESCRIPTION' ? 4 : selectedType === 'LAB_REPORT' ? 6 : 3,
        confidenceScore: simulateQualityIssue ? 62 : 96,
        status: simulateQualityIssue ? 'REVIEW_REQUIRED' : 'COMPLETE',
        capturedAt: 'Just now',
      }
      setCurrentScanningDoc(newDoc)

      setTimeout(() => {
        setProcessingProgress(65)
        setProcessingStageText(
          language === 'hi'
            ? 'दवाइयों और जांच रिपोर्ट का विश्लेषण हो रहा है...'
            : language === 'mr'
            ? 'औषधे व तपासणी नोंदींचे विश्लेषण सुरू आहे...'
            : 'Extracting Clinical Entities (NAMASTE / RxNorm)...'
        )

        setTimeout(() => {
          setProcessingProgress(100)
          setProcessingStageText(
            language === 'hi'
              ? 'सत्यापन संपन्न! सुरक्षित किया जा रहा है...'
              : language === 'mr'
              ? 'पडताळणी पूर्ण! सुरक्षित साठवत आहे...'
              : 'Synthesizing Cross-Document Red Flags...'
          )

          setTimeout(() => {
            if (simulateQualityIssue) {
              setStage('QUALITY_WARNING')
            } else {
              addDocument(newDoc)
              setStage('REVIEW')
            }
          }, 600)
        }, 800)
      }, 800)
    },
    [addDocument, language, selectedType, simulateQualityIssue, updateActivity]
  )

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleCaptureDocument(file.name)
    }
  }

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
    <div className="h-full min-h-screen flex flex-col bg-[#F7F9FC] text-[#17191F] antialiased select-none overflow-x-hidden">
      {/* ── Top Persistent Header ── */}
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-[#DFE8F1] px-4 sm:px-6 py-3 flex items-center justify-between shadow-2xs z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#EEF5FC] text-[#2365B5] flex items-center justify-center font-extrabold text-[15px] border border-[#CBD8E5]">
            <FileText size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[14px] sm:text-[15px] font-extrabold text-[#17191F]">
                {language === 'hi'
                  ? 'चिकित्सा दस्तावेज़ स्कैनर'
                  : language === 'mr'
                  ? 'वैद्यकीय कागदपत्र स्कॅनर'
                  : 'Medical Document Scanner'}
              </span>
              <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-[#EBFDF5] text-[#079455] border border-[#A6F4C5] hidden sm:inline-block">
                ABDM Linked
              </span>
            </div>
            <p className="text-[11.5px] text-[#6F7480]">
              Patient:{' '}
              <strong className="text-[#17191F]">
                {patientData?.name ?? 'Dhananjay Patil'} ({patientData?.age ?? 67} yrs)
              </strong>
            </p>
          </div>
        </div>

        {/* Listen Audio Button */}
        <button
          onClick={handlePlayAudioGuidance}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EEF5FC] text-[#2365B5] hover:bg-[#D3E2F0] text-[12px] font-bold border border-[#CBD8E5] transition-colors cursor-pointer"
        >
          <Volume2 size={15} />
          <span className="hidden sm:inline">
            {isPlayingAudio
              ? 'Playing Guidance...'
              : language === 'hi'
              ? 'निर्देश सुनें'
              : language === 'mr'
              ? 'सूचना ऐका'
              : 'Audio Guide'}
          </span>
        </button>
      </header>

      {/* ── Main Work Area ── */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {/* ════════════════════════════════════════════════════════════════════
              STAGE 1: ENTRY SCREEN (Tactile Medical Scanner vs Skip Choice)
          ════════════════════════════════════════════════════════════════════ */}
          {stage === 'ENTRY' && (
            <motion.div
              key="doc-entry"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-5 text-center my-auto"
            >
              {/* Heading */}
              <div className="space-y-1">
                <span className="text-[12px] sm:text-[13px] font-extrabold text-[#2365B5] tracking-wider uppercase bg-[#EEF5FC] px-3 py-1 rounded-full border border-[#CBD8E5] inline-block">
                  {language === 'hi'
                    ? 'चरण २: दस्तावेज़ अपलोड'
                    : language === 'mr'
                    ? 'टप्पा २: कागदपत्रे जोडा'
                    : 'Step 2: Paper Documents'}
                </span>
                <h1 className="text-[26px] sm:text-[32px] font-extrabold text-[#17191F] tracking-tight leading-tight mt-1">
                  {language === 'hi'
                    ? 'क्या आपके पास पुरानी पर्चियां या रिपोर्ट हैं?'
                    : language === 'mr'
                    ? 'तुमच्याकडे जुन्या औषधांच्या चिठ्ठ्या किंवा रिपोर्ट्स आहेत का?'
                    : 'Do you have previous prescriptions or reports?'}
                </h1>
                <p className="text-[13.5px] sm:text-[15px] text-[#6F7480] max-w-xl mx-auto">
                  {language === 'hi'
                    ? 'पुरानी पर्ची या जांच रिपोर्ट स्कैन करने से डॉक्टर आपकी बीमारी को तेजी से और सटीक समझ सकेंगे।'
                    : language === 'mr'
                    ? 'मागील कागदपत्रे स्कॅन केल्यास डॉक्टरांना अचूक व जलद निदान करण्यात मदत होईल.'
                    : 'Scanning your previous records helps the physician verify current medications and lab trends instantly.'}
                </p>
              </div>

              {/* Two Prominent Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                {/* ── CARD 1: Scan Medical Documents (Hero Option) ── */}
                <div
                  onClick={() => {
                    updateActivity()
                    setStage('SCANNER')
                  }}
                  className="relative p-5 sm:p-6 bg-white rounded-3xl border-2 border-[#2365B5] shadow-lg hover:shadow-xl transition-all duration-200 flex flex-col justify-between gap-4 cursor-pointer group active:scale-[0.99] overflow-hidden"
                >
                  {/* Subtle Background Scanner Viewfinder Watermark */}
                  <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none text-[#2365B5]">
                    <ScanLine size={160} />
                  </div>

                  <div className="space-y-3 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#2365B5] to-[#174A91] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                        <Camera size={26} />
                      </div>
                      <span className="text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-[#EBFDF5] text-[#079455] border border-[#A6F4C5] flex items-center gap-1">
                        <Sparkles size={11} />
                        Auto-OCR
                      </span>
                    </div>

                    <div>
                      <h2 className="text-[19px] sm:text-[21px] font-extrabold text-[#17191F] group-hover:text-[#2365B5] transition-colors">
                        {language === 'hi'
                          ? 'दस्तावेज़ स्कैन करें'
                          : language === 'mr'
                          ? 'कागदपत्रे स्कॅन करा'
                          : 'I have paper documents to scan'}
                      </h2>
                      <p className="text-[13px] sm:text-[13.5px] text-[#4B5565] mt-1 leading-relaxed">
                        {language === 'hi'
                          ? 'पर्ची, खून जांच की रिपोर्ट या डिस्चार्ज समरी को स्कैनर ग्लास पर सीधा रखें।'
                          : language === 'mr'
                          ? 'औषधांची चिठ्ठी, रक्त तपासणी किंवा डिस्चार्ज रिपोर्ट स्कॅनरवर ठेवा.'
                          : 'Place prescriptions, blood tests, or discharge summaries flat under the kiosk camera.'}
                      </p>
                    </div>

                    {/* Document Category Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg bg-[#F0F6FD] text-[#2365B5] border border-[#CBD8E5]">
                        <Pill size={11} />
                        Prescriptions
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg bg-[#F0F6FD] text-[#2365B5] border border-[#CBD8E5]">
                        <Activity size={11} />
                        Lab Reports
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg bg-[#F0F6FD] text-[#2365B5] border border-[#CBD8E5]">
                        <FileCheck size={11} />
                        Discharge Notes
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#2365B5] to-[#174A91] text-white font-extrabold text-[14px] flex items-center justify-center gap-2 shadow-xs group-hover:shadow-md transition-all cursor-pointer relative z-10"
                  >
                    <span>
                      {language === 'hi'
                        ? 'स्कैनर चालू करें'
                        : language === 'mr'
                        ? 'स्कॅनर सुरू करा'
                        : 'Open Scanner'}
                    </span>
                    <ArrowRight size={16} />
                  </button>
                </div>

                {/* ── CARD 2: No Paper Documents (Skip Directly) ── */}
                <div
                  onClick={() => {
                    updateActivity()
                    setStage('PHASE_5_HANDOFF')
                  }}
                  className="relative p-5 sm:p-6 bg-white rounded-3xl border border-[#DFE8F1] hover:border-[#2365B5] shadow-card hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-4 cursor-pointer group active:scale-[0.99]"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-13 h-13 rounded-2xl bg-[#F8FAFC] text-[#4B5565] flex items-center justify-center border border-[#DFE8F1] group-hover:border-[#2365B5] group-hover:text-[#2365B5] transition-colors">
                        <CheckCircle2 size={26} />
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#F8FAFC] text-[#6F7480] border border-[#DFE8F1]">
                        Digital Records
                      </span>
                    </div>

                    <div>
                      <h2 className="text-[19px] sm:text-[21px] font-extrabold text-[#17191F] group-hover:text-[#2365B5] transition-colors">
                        {language === 'hi'
                          ? 'कोई दस्तावेज़ नहीं है'
                          : language === 'mr'
                          ? 'सध्या कागदपत्रे नाहीत'
                          : 'No documents today'}
                      </h2>
                      <p className="text-[13px] sm:text-[13.5px] text-[#4B5565] mt-1 leading-relaxed">
                        {language === 'hi'
                          ? 'चिंता न करें! आपकी आवाज और स्क्रीन से दी गई पूरी जानकारी सुरक्षित है। डिजिटल स्वास्थ्य रिकॉर्ड खुद जुड़ जाएंगे।'
                          : language === 'mr'
                          ? 'काळजी नको! तुमची लक्षणे सुरक्षित आहेत. डिजिटल आरोग्य नोंदी आपोआप जोडल्या जातील.'
                          : 'Your spoken intake answers are fully recorded. If you have an ABHA ID, past hospital records link automatically.'}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#DFE8F1] text-[12px] text-[#4B5565] flex items-center gap-2">
                      <Shield size={14} className="text-[#079455] shrink-0" />
                      <span>Zero paper required for doctor consultation</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="w-full py-3 px-4 rounded-xl bg-[#F8FAFC] border border-[#CBD8E5] text-[#17191F] group-hover:bg-[#EEF5FC] group-hover:text-[#2365B5] group-hover:border-[#2365B5] font-extrabold text-[14px] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>
                      {language === 'hi'
                        ? 'सीधे डॉक्टर के पास जाएं'
                        : language === 'mr'
                        ? 'थेट डॉक्टरांकडे जा'
                        : 'Proceed to Doctor'}
                    </span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              {/* Back CTA */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => router.push('/kiosk/intake')}
                  className="inline-flex items-center gap-1.5 text-[14px] font-bold text-[#6F7480] hover:text-[#17191F] py-2 px-4 rounded-xl hover:bg-[#EEF2F6] transition-colors cursor-pointer"
                >
                  <ArrowLeft size={16} />
                  <span>
                    {language === 'hi' ? 'पीछे (लक्षण समीक्षा)' : 'Back to Intake Review'}
                  </span>
                </button>
              </div>
            </motion.div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              STAGE 2: SCANNER VIEWPORT (Tactile Camera Viewfinder HUD)
          ════════════════════════════════════════════════════════════════════ */}
          {stage === 'SCANNER' && (
            <motion.div
              key="doc-scanner"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4 max-w-2xl mx-auto w-full"
            >
              {/* Header with Type Selector */}
              <div className="flex flex-col gap-2 text-center">
                <h1 className="text-[24px] sm:text-[28px] font-extrabold text-[#17191F]">
                  {language === 'hi'
                    ? 'दस्तावेज़ को फ्रेम के बीच में रखें'
                    : language === 'mr'
                    ? 'कागदपत्र फ्रेमच्या मधोमध ठेवा'
                    : 'Position Document Inside Frame'}
                </h1>

                {/* Category Pills */}
                <div className="flex justify-center gap-2 overflow-x-auto py-1">
                  {(
                    [
                      { id: 'PRESCRIPTION', label: 'Prescription (पर्ची)' },
                      { id: 'LAB_REPORT', label: 'Lab Report (जांच)' },
                      { id: 'DISCHARGE_SUMMARY', label: 'Discharge Note' },
                      { id: 'OTHER', label: 'Other Document' },
                    ] as const
                  ).map((tType) => (
                    <button
                      key={tType.id}
                      type="button"
                      onClick={() => {
                        setSelectedType(tType.id)
                        updateActivity()
                      }}
                      className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-extrabold transition-all cursor-pointer ${
                        selectedType === tType.id
                          ? 'bg-[#2365B5] text-white shadow-xs'
                          : 'bg-white border border-[#CBD8E5] text-[#4B5565] hover:bg-[#F0F6FD]'
                      }`}
                    >
                      {tType.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optical Scanner Viewport with Laser Beam */}
              <div className="relative w-full h-[320px] sm:h-[360px] bg-[#0E1520] rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center border-4 border-[#2365B5]/40">
                {/* Optical Brackets [ ] */}
                <div className="absolute inset-5 border-2 border-white/10 rounded-2xl pointer-events-none flex flex-col justify-between p-2">
                  <div className="flex justify-between">
                    <div className="w-8 h-8 border-t-4 border-l-4 border-[#38BDF8] -mt-1 -ml-1 rounded-tl-lg" />
                    <div className="w-8 h-8 border-t-4 border-r-4 border-[#38BDF8] -mt-1 -mr-1 rounded-tr-lg" />
                  </div>
                  <div className="flex justify-between">
                    <div className="w-8 h-8 border-b-4 border-l-4 border-[#38BDF8] -mb-1 -ml-1 rounded-bl-lg" />
                    <div className="w-8 h-8 border-b-4 border-r-4 border-[#38BDF8] -mb-1 -mr-1 rounded-br-lg" />
                  </div>
                </div>

                {/* Animated Glowing Laser Beam */}
                <motion.div
                  className="absolute left-6 right-6 h-[2.5px] bg-gradient-to-r from-transparent via-[#38BDF8] to-transparent shadow-[0_0_16px_#38BDF8]"
                  animate={{
                    top: ['12%', '88%', '12%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />

                {/* Center Document Alignment Silhouette */}
                <div className="text-white/40 flex flex-col items-center gap-2 pointer-events-none select-none">
                  <ScanLine size={48} className="text-[#38BDF8]/60" />
                  <span className="text-[12px] font-mono tracking-widest uppercase text-white/80 font-bold bg-white/10 px-3 py-1 rounded-full border border-white/10">
                    Ready to Scan • Keep Steady
                  </span>
                </div>
              </div>

              {/* Guidance Chips */}
              <div className="flex justify-center gap-2 text-[12px] flex-wrap">
                <span className="bg-white text-[#4B5565] px-3 py-1 rounded-full font-bold border border-[#DFE8F1] shadow-2xs">
                  ✓ Place flat on glass
                </span>
                <span className="bg-white text-[#4B5565] px-3 py-1 rounded-full font-bold border border-[#DFE8F1] shadow-2xs">
                  ✓ Ensure good lighting
                </span>
                <span className="bg-white text-[#4B5565] px-3 py-1 rounded-full font-bold border border-[#DFE8F1] shadow-2xs">
                  ✓ All 4 corners visible
                </span>
              </div>

              {/* Shutter Capture Button & File Upload Fallback */}
              <div className="flex flex-col items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => handleCaptureDocument()}
                  className="w-20 h-20 rounded-full bg-white border-4 border-[#2365B5] p-1.5 shadow-xl hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                  aria-label="Capture photo of document"
                >
                  <div className="w-full h-full rounded-full bg-[#2365B5] flex items-center justify-center text-white">
                    <Camera size={30} />
                  </div>
                </button>
                <span className="text-[13.5px] font-extrabold text-[#2365B5]">
                  Tap Shutter to Scan
                </span>

                {/* File Upload Fallback Trigger */}
                <div className="flex items-center gap-3 pt-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#6F7480] hover:text-[#2365B5] px-3 py-1.5 rounded-lg border border-[#DFE8F1] bg-white hover:bg-[#EEF5FC] transition-colors cursor-pointer"
                  >
                    <Upload size={13} />
                    <span>Upload Image / PDF</span>
                  </button>

                  {/* Blur Simulation Toggle for testing */}
                  <label className="flex items-center gap-1.5 text-[11.5px] text-[#6F7480] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={simulateQualityIssue}
                      onChange={(e) => setSimulateQualityIssue(e.target.checked)}
                      className="rounded text-[#2365B5]"
                    />
                    <span>Simulate blur / warning</span>
                  </label>
                </div>
              </div>

              {/* Cancel Button */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setStage(documents.length > 0 ? 'REVIEW' : 'ENTRY')}
                  className="text-[14px] font-bold text-[#6F7480] hover:text-[#17191F] py-2 px-3 cursor-pointer"
                >
                  ← Cancel
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
              className="flex flex-col items-center justify-center gap-6 py-12 text-center my-auto max-w-md mx-auto"
            >
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-[#EEF5FC]" />
                <div className="absolute inset-0 rounded-full border-4 border-[#2365B5] border-t-transparent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-[#2365B5] font-extrabold text-[15px]">
                  {processingProgress}%
                </div>
              </div>

              <div className="space-y-2 w-full">
                <h2 className="text-[22px] sm:text-[24px] font-extrabold text-[#17191F]">
                  Processing Document...
                </h2>
                <p className="text-[14px] text-[#2365B5] font-bold min-h-[24px]">
                  {processingStageText}
                </p>

                <div className="w-full h-2.5 bg-[#EEF5FC] rounded-full overflow-hidden mt-3 border border-[#CBD8E5]">
                  <div
                    className="h-full bg-gradient-to-r from-[#347FCE] to-[#2365B5] transition-all duration-500 rounded-full"
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
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-5 text-center my-auto max-w-md mx-auto"
            >
              <div className="w-16 h-16 rounded-full bg-[#FEF3F2] text-[#D92D20] flex items-center justify-center mx-auto border border-[#FECDCA]">
                <AlertTriangle size={32} />
              </div>

              <div className="space-y-1">
                <h1 className="text-[24px] sm:text-[26px] font-extrabold text-[#17191F]">
                  Document Appears Blurry
                </h1>
                <p className="text-[13.5px] sm:text-[14px] text-[#6F7480]">
                  Certain text or medicine names could not be identified clearly. Re-scanning will help your doctor avoid missing details.
                </p>
              </div>

              <div className="flex flex-col gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleRescan}
                  className="w-full py-3 px-4 rounded-xl bg-[#2365B5] text-white font-extrabold text-[14.5px] flex items-center justify-center gap-2 shadow-xs hover:bg-[#174A91] transition-colors cursor-pointer"
                >
                  <RefreshCw size={16} />
                  <span>Scan Again with Better Light</span>
                </button>

                <button
                  type="button"
                  onClick={handleContinueAnyway}
                  className="w-full py-3 px-4 rounded-xl bg-white border border-[#CBD8E5] text-[#4B5565] font-bold text-[14px] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                >
                  Continue with this Scan
                </button>
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
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-5 max-w-2xl mx-auto w-full my-auto"
            >
              <div className="text-center space-y-1">
                <h1 className="text-[26px] sm:text-[30px] font-extrabold text-[#17191F]">
                  Attached Medical Documents
                </h1>
                <p className="text-[13.5px] sm:text-[14px] text-[#6F7480]">
                  {documents.length} document{documents.length > 1 ? 's' : ''} successfully attached &amp; analyzed
                </p>
              </div>

              {/* Document List Stack */}
              <div className="flex flex-col gap-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-[#DFE8F1] hover:border-[#2365B5]/60 hover:shadow-md transition-all flex items-center justify-between gap-3.5 group"
                  >
                    <div
                      className="flex items-center gap-3.5 min-w-0 flex-1 cursor-pointer"
                      onClick={() => {
                        updateActivity()
                        setPreviewDoc(doc)
                      }}
                      title="Tap to view scanned document preview"
                    >
                      <div className="w-12 h-12 rounded-xl bg-[#EEF5FC] text-[#2365B5] flex items-center justify-center shrink-0 border border-[#CBD8E5] group-hover:scale-105 group-hover:bg-[#2365B5] group-hover:text-white transition-all shadow-2xs">
                        <FileText size={22} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-[15px] font-extrabold text-[#17191F] group-hover:text-[#2365B5] transition-colors truncate">
                            {doc.name}
                          </h3>
                          <span
                            className={`text-[10.5px] font-extrabold px-2 py-0.5 rounded-full uppercase border ${
                              doc.status === 'COMPLETE'
                                ? 'bg-[#EBFDF5] text-[#079455] border-[#A6F4C5]'
                                : 'bg-[#FEF3F2] text-[#D92D20] border-[#FECDCA]'
                            }`}
                          >
                            {doc.status}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2365B5] bg-[#EEF5FC] px-2 py-0.5 rounded-full border border-[#CBD8E5]">
                            <Eye size={11} />
                            <span>Preview</span>
                          </span>
                        </div>
                        <p className="text-[12.5px] text-[#6F7480] mt-0.5">
                          {doc.extractedEntitiesCount} clinical items extracted • {doc.confidenceScore}% clarity • Tap to view scan
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeDocument(doc.id)}
                      className="p-2 text-[#6F7480] hover:text-[#D92D20] rounded-lg hover:bg-[#FEF3F2] transition-colors shrink-0 cursor-pointer"
                      aria-label={`Remove ${doc.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                {/* Add Another Document Button */}
                <button
                  type="button"
                  onClick={() => {
                    updateActivity()
                    setStage('SCANNER')
                  }}
                  className="w-full py-4 border-2 border-dashed border-[#2365B5]/40 hover:border-[#2365B5] bg-[#F0F6FD]/50 hover:bg-[#F0F6FD] rounded-2xl flex items-center justify-center gap-2 text-[14px] font-extrabold text-[#2365B5] transition-all cursor-pointer shadow-2xs"
                >
                  <Plus size={18} />
                  <span>+ Scan Another Document</span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => router.push('/kiosk/review')}
                  className="w-full py-3.5 px-6 rounded-2xl text-white text-[15px] font-extrabold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #347FCE 0%, #2365B5 52%, #174A91 100%)',
                  }}
                >
                  <span>Continue to Final Review</span>
                  <ArrowRight size={17} />
                </button>

                <button
                  type="button"
                  onClick={() => router.push('/kiosk/intake')}
                  className="text-[13px] font-bold text-[#6F7480] hover:text-[#17191F] py-2 cursor-pointer"
                >
                  ← Back to Intake
                </button>
              </div>
            </motion.div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              STAGE 6: READY FOR REVIEW / NO DOCS HANDOFF
          ════════════════════════════════════════════════════════════════════ */}
          {stage === 'PHASE_5_HANDOFF' && (
            <motion.div
              key="doc-phase5-handoff"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-6 text-center my-auto max-w-md mx-auto"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#EBFDF5] text-[#079455] flex items-center justify-center mx-auto shadow-sm border border-[#A6F4C5]">
                <Check size={32} className="stroke-[3]" />
              </div>

              <div className="space-y-1">
                <span className="text-[11.5px] font-extrabold text-[#079455] tracking-wider uppercase bg-[#EBFDF5] px-3 py-1 rounded-full border border-[#A6F4C5] inline-block">
                  Intake Complete
                </span>
                <h1 className="text-[26px] sm:text-[30px] font-extrabold text-[#17191F]">
                  Ready for Consultation
                </h1>
                <p className="text-[13.5px] sm:text-[14.5px] text-[#6F7480]">
                  Your verbal history and symptoms are compiled. The doctor will see a compressed glanceable briefing immediately.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    advanceStep('REVIEW')
                    router.push('/kiosk/review')
                  }}
                  className="w-full py-3.5 px-6 rounded-2xl text-white text-[15px] font-extrabold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #347FCE 0%, #2365B5 52%, #174A91 100%)',
                  }}
                >
                  <span>Proceed to Final Review</span>
                  <ArrowRight size={17} />
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStage(documents.length > 0 ? 'REVIEW' : 'ENTRY')}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-white border border-[#CBD8E5] text-[#4B5565] font-bold text-[13px] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                  >
                    ← Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      resetSession()
                      router.replace('/kiosk')
                    }}
                    className="flex-1 py-2.5 px-3 rounded-xl text-[#D92D20] font-bold text-[13px] hover:bg-[#FEF3F2] transition-colors cursor-pointer"
                  >
                    Start Over
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Scanned Document Preview Modal */}
      <DocumentPreviewModal
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        document={
          previewDoc
            ? {
                name: previewDoc.name,
                type: previewDoc.type,
                ocrConfidence: previewDoc.confidenceScore,
                extractedEntitiesCount: previewDoc.extractedEntitiesCount,
                patientName: patientData?.name || 'Dhananjay Patil',
                tokenNumber: 'A-028',
              }
            : null
        }
      />
    </div>
  )
}
