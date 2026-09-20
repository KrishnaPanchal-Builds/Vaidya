'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Stethoscope,
  ChevronRight,
  Edit3,
  Search,
  ExternalLink,
  Printer,
  FileCheck2,
  RotateCcw,
  X,
  AlertTriangle,
  FileText,
  Mic,
  Activity,
  BookOpen,
  MapPin,
  CalendarDays,
  Layers,
  Play,
  Pause,
  Leaf,
  Eye,
} from 'lucide-react'
import { DocumentPreviewModal, type PreviewDocumentData } from '@/components/documents/DocumentPreviewModal'

import {
  DEMO_ENCOUNTERS,
  DEMO_PATIENTS,
  DEMO_CONFLICTS_ENC001,
  DEMO_TIMELINE_ENC001,
  DEMO_COMPLETENESS_ENC001,
  DEMO_RED_FLAG_ENC002,
  getDocumentsForEncounter,
  getFactsForEncounter,
} from '@/constants/demo-data'
import {
  Card,
  CardHeader,
  CardContent,
} from '@/components/ui/card'
import {
  ConflictCard,
  CompletenessGrid,
  RedFlagBanner,
  Timeline,
  SourceBadge,
  FactCard,
  SnapshotBlock,
  ClinicalSectionHeader,
  type ClinicalSourceType,
} from '@/components/clinical'
import { useUIStore } from '@/store'
import type { ClinicalConflict, ClinicalFact, Encounter, Patient, MedicalDocument } from '@/types'
import { cn } from '@/lib/utils'

export default function DoctorEncounterPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const encounterId = (params?.id as string) || 'enc-001'
  const { openEvidenceDrawer, addToast } = useUIStore()

  useEffect(() => {
    const inspectTarget = searchParams.get('inspect')
    if (inspectTarget) {
      openEvidenceDrawer(inspectTarget)
    }
  }, [searchParams, openEvidenceDrawer])

  const initialEnc = DEMO_ENCOUNTERS.find((e) => e.id === encounterId) || DEMO_ENCOUNTERS[0]
  const initialPat = initialEnc.patient || DEMO_PATIENTS.find((p) => p.id === initialEnc.patientId) || DEMO_PATIENTS[0]

  const [encounter, setEncounter] = useState<Encounter>(initialEnc)
  const [patient, setPatient] = useState<Patient>(initialPat)
  const [facts, setFacts] = useState<ClinicalFact[]>(() => getFactsForEncounter(encounterId))
  const [conflicts, setConflicts] = useState<ClinicalConflict[]>(() => (encounterId === 'enc-001' ? DEMO_CONFLICTS_ENC001 : []))
  const [documents, setDocuments] = useState<MedicalDocument[]>(() => getDocumentsForEncounter(encounterId))
  const [consultationStatus, setConsultationStatus] = useState<'READY' | 'IN_PROGRESS' | 'COMPLETED'>('READY')
  const [physicianNotes, setPhysicianNotes] = useState(
    'Abdomen soft, non-tender on general palpation. Mild epigastric tenderness elicited. Diagnosis: Chronic Acid Peptic Disease / Dyspepsia with functional heartburn. Advised dietary modifications (avoid spicy/fried foods, elevate head of bed) and prescribed Tab. Pantoprazole 40mg.'
  )
  const [isIntakeVerified, setIsIntakeVerified] = useState(false)
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false)

  // Responsive Mobile View Toggle (<lg screens)
  const [mobileView, setMobileView] = useState<'CLINICAL' | 'EVIDENCE'>('CLINICAL')

  // Right Column Evidence Tabs
  const [evidenceSubTab, setEvidenceSubTab] = useState<'DOCUMENTS' | 'VOICE' | 'TIMELINE' | 'COMPLETENESS'>('DOCUMENTS')
  const [isPlayingVoice, setIsPlayingVoice] = useState(false)
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState<PreviewDocumentData | null>(null)

  useEffect(() => {
    const foundEnc = DEMO_ENCOUNTERS.find((e) => e.id === encounterId) || DEMO_ENCOUNTERS[0]
    setEncounter(foundEnc)
    const foundPat = foundEnc.patient || DEMO_PATIENTS.find((p) => p.id === foundEnc.patientId) || DEMO_PATIENTS[0]
    setPatient(foundPat)
    setFacts(getFactsForEncounter(encounterId))
    setDocuments(getDocumentsForEncounter(encounterId))
    setConflicts(encounterId === 'enc-001' ? DEMO_CONFLICTS_ENC001 : [])
  }, [encounterId])

  const avgOcr = documents.length > 0
    ? Math.round((documents.reduce((acc, d) => acc + (d.ocrConfidence ?? 0.85), 0) / documents.length) * 100)
    : 0

  const handleResolveConflict = async (
    resolution: 'RESOLVED_A' | 'RESOLVED_B' | 'RESOLVED_UNCERTAIN',
    note?: string
  ) => {
    await new Promise((r) => setTimeout(r, 300))
    addToast({
      type: 'success',
      title: 'Clinical Discrepancy Resolved',
      body: `Decision: ${resolution}${note ? ` • Note: "${note}"` : ''}`,
    })
  }

  const handleStartConsultation = () => {
    setConsultationStatus('IN_PROGRESS')
    addToast({
      type: 'info',
      title: 'Consultation In Progress',
      body: `Reviewing ${patient?.name} (Token ${encounter?.tokenNumber}).`,
    })
  }

  const handleCompleteEncounter = () => {
    setConsultationStatus('COMPLETED')
    setIsIntakeVerified(true)
    addToast({
      type: 'success',
      title: 'Consultation Finalized & EHR Synced',
      body: `Prescription issued for ${patient?.name}. Records bundled into FHIR R4 DiagnosticReport and synced to ABDM Health Locker.`,
    })
  }

  const handleResetDemo = () => {
    setConsultationStatus('READY')
    setIsIntakeVerified(false)
    addToast({ type: 'info', title: 'Demo State Reset', body: 'Encounter reset to initial state.' })
  }

  const toggleVoicePlayback = () => {
    if (!isPlayingVoice) {
      setIsPlayingVoice(true)
      setTimeout(() => {
        setIsPlayingVoice(false)
      }, 4000)
    } else {
      setIsPlayingVoice(false)
    }
  }

  const ENCOUNTER_PROFILES: Record<string, {
    complaint: string
    durationSeverity: string
    bodyArea: string
    intakeSource: string
    lifestyleTrigger?: string
    spokenAudioQuote?: string
    spokenAudioLang?: string
    isUrgent?: boolean
  }> = {
    'enc-001': {
      complaint: 'Epigastric burning pain & post-prandial indigestion',
      durationSeverity: '3 months (Gradual) • 5/10 Moderate',
      bodyArea: 'Epigastric / Upper GI',
      intakeSource: 'Voice (मराठी) + OCR',
      lifestyleTrigger: 'Oily & spicy Ahara, irregular meal timing (Vihara)',
      spokenAudioQuote: 'मला दोन-तीन दिवसांपासून छातीत जळजळ आणि पोटात दुखत आहे. जेवल्यानंतर जास्त त्रास होतो.',
      spokenAudioLang: 'Marathi (मराठी)',
    },
    'enc-002': {
      complaint: 'Acute chest discomfort, breathlessness radiating to left arm',
      durationSeverity: '2 hrs (Acute) • 8/10 Severe',
      bodyArea: 'Chest, Left Arm & Jaw',
      intakeSource: 'Voice (Hindi) + ECG OCR',
      lifestyleTrigger: 'Sudden onset during physical exertion',
      spokenAudioQuote: 'मुझे सीने में बहुत तेज दर्द और भारीपन लग रहा है, बायां हाथ भी सुन्न हो रहा है।',
      spokenAudioLang: 'Hindi (हिंदी)',
      isUrgent: true,
    },
    'enc-003': {
      complaint: 'Bilateral knee pain, generalized weakness, joint stiffness',
      durationSeverity: '6 months (Chronic) • 6/10 Moderate',
      bodyArea: 'Bilateral Lower Limbs (Knees)',
      intakeSource: 'Voice (हिंदी) + X-Ray OCR',
      lifestyleTrigger: 'Prolonged standing, aggravated by cold weather',
      spokenAudioQuote: 'दोनही गुडघ्यांमध्ये खूप कळ येते, जिने चढताना आणि खाली उतरताना जास्त त्रास होतो.',
      spokenAudioLang: 'Marathi (मराठी)',
    },
    'enc-004': {
      complaint: 'Chronic indigestion, acid reflux, Ahara dietary irregularity',
      durationSeverity: '1 year (Chronic) • 4/10 Mild-Mod',
      bodyArea: 'Abdomen / Upper GI',
      intakeSource: 'Voice (हिंदी) + USG OCR',
      lifestyleTrigger: 'Frequent spicy snacks, late dinner schedule',
      spokenAudioQuote: 'काहीही खाल्लं की छातीत आणि घशात पित्ताची जळजळ होते.',
      spokenAudioLang: 'Marathi (मराठी)',
    },
    'enc-005': {
      complaint: 'Second trimester routine antenatal checkup (24 weeks)',
      durationSeverity: '24 wks Antenatal • Normal',
      bodyArea: 'Obstetric / Pelvic',
      intakeSource: 'Voice (اردو) + Lab OCR',
      lifestyleTrigger: 'Routine gestational diet & rest routine',
      spokenAudioQuote: 'طبیعت ٹھیک ہے، معمول کے ٹیسٹ اور چیک اپ کے لیے آئی ہوں۔',
      spokenAudioLang: 'Urdu (اردو)',
    },
  }

  const profile = ENCOUNTER_PROFILES[encounterId] || ENCOUNTER_PROFILES['enc-001']
  const isUrgent = profile.isUrgent ?? false

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#F7F9FC] text-[#17191F] antialiased">
      {/* ════════════════════════════════════════════════════════════════
          1. CLEAN HEADER (Vitals Strip Removed, Zero Visual Noise)
      ════════════════════════════════════════════════════════════════ */}
      {/* Top Breadcrumb & Patient Header Ribbon */}
      <header className="border-b border-[#DFE8F1] bg-white px-3 sm:px-6 py-3 shadow-2xs">
        <div className="w-full max-w-[1920px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1 sm:px-4 lg:px-6">
          {/* Left: Back + Token + Patient Identity + ABHA */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => router.push('/doctor/queue')}
              className="p-2 rounded-xl border border-[#CBD8E5] bg-white text-[#4B5565] hover:bg-[#EEF2F6] transition-all shrink-0 cursor-pointer shadow-2xs"
              title="Return to OPD Queue"
            >
              <ArrowLeft size={16} />
            </button>

            {/* Token Badge */}
            <div
              className={cn(
                'w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 border select-none',
                isUrgent
                  ? 'bg-[#FEF3F2] border-[#FECDCA] text-[#D92D20]'
                  : 'bg-[#EEF5FC] border-[#CBD8E5] text-[#2365B5]'
              )}
            >
              <span className="text-[7.5px] font-extrabold uppercase tracking-wider">TOKEN</span>
              <span className="text-[14px] font-extrabold font-mono leading-none">{encounter?.tokenNumber || 'A-028'}</span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap min-w-0">
                <h1 className="text-[17px] sm:text-[18px] font-extrabold tracking-tight text-[#17191F] truncate">
                  {patient?.name || 'Dhananjay Patil'}
                </h1>
                <span className="text-[11.5px] font-semibold px-2 py-0.5 rounded-lg border border-[#DFE8F1] bg-[#F8FAFC] text-[#4B5565] shrink-0">
                  {patient?.age || 67}Y • {patient?.gender === 'FEMALE' || patient?.sex === 'F' ? 'Female' : 'Male'}
                </span>
                {isUrgent ? (
                  <span className="text-[10.5px] font-extrabold px-2 py-0.5 rounded-lg border border-[#FECDCA] bg-[#FEF3F2] text-[#D92D20] flex items-center gap-1 shrink-0 uppercase tracking-wider">
                    <AlertTriangle size={11} /> Urgent Priority
                  </span>
                ) : (
                  <span className="text-[10.5px] font-extrabold px-2 py-0.5 rounded-lg border border-[#A6F4C5] bg-[#EBFDF5] text-[#079455] flex items-center gap-1 shrink-0 uppercase tracking-wider">
                    <ShieldCheck size={11} /> ABHA Linked
                  </span>
                )}
              </div>
              <p className="text-[11px] mt-0.5 flex items-center gap-2 flex-wrap text-[#6F7480] truncate">
                <span>ABHA: <strong className="font-mono text-[#17191F]">{patient?.abhaNumber || '12-3456-7890-1234'}</strong></span>
                <span>•</span>
                <span>Language: <strong className="font-semibold text-[#17191F]">{patient?.preferredLanguage === 'mr' ? 'Marathi (मराठी)' : patient?.preferredLanguage === 'hi' ? 'Hindi (हिंदी)' : 'English'}</strong></span>
                <span>•</span>
                <span>Attending: Dr. Sunita Rao, MD</span>
                <span>•</span>
                <span>{documents.length} doc(s) ({avgOcr}% OCR clarity)</span>
              </p>
            </div>
          </div>

          {/* Right: Consultation Action CTAs (Vitals removed cleanly) */}
          <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
            {consultationStatus === 'READY' && (
              <button
                onClick={handleStartConsultation}
                className="px-4 py-2 rounded-xl text-white text-[13px] font-extrabold transition-all shadow-xs flex items-center gap-1.5 hover:opacity-95 active:scale-95 bg-[#2365B5] cursor-pointer"
              >
                <Stethoscope size={14} />
                <span>Start Consultation</span>
              </button>
            )}
            {consultationStatus === 'IN_PROGRESS' && (
              <button
                onClick={handleCompleteEncounter}
                className="px-4 py-2 rounded-xl text-white text-[13px] font-extrabold transition-all shadow-xs flex items-center gap-1.5 hover:opacity-95 active:scale-95 bg-[#079455] cursor-pointer"
              >
                <CheckCircle2 size={14} />
                <span>Finalize &amp; Prescribe</span>
              </button>
            )}
            {consultationStatus === 'COMPLETED' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPrescriptionModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl text-white text-[12.5px] font-bold transition-all shadow-xs flex items-center gap-1.5 hover:opacity-95 active:scale-95 bg-[#2365B5] cursor-pointer"
                >
                  <Printer size={13} />
                  <span>Print Rx</span>
                </button>
                <button
                  onClick={handleResetDemo}
                  className="p-2 rounded-xl border border-[#CBD8E5] bg-white text-[#6F7480] hover:bg-[#EEF2F6] transition-colors cursor-pointer shadow-2xs"
                  title="Reset Demo State"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Main Content Area ── */}
      <main className="w-full max-w-[1920px] mx-auto p-3 sm:p-5 lg:p-6 xl:p-8 w-full flex-1 space-y-4 sm:space-y-5 min-w-0">
        {/* Finalized Banner if completed */}
        {consultationStatus === 'COMPLETED' && (
          <Card level={2} variant="verified" className="p-4 sm:p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-[#DFE8F1]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EBFDF5] text-[#079455] flex items-center justify-center shrink-0 border border-[#A6F4C5]">
                  <FileCheck2 size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-[16px] font-extrabold text-[#17191F]">
                      Consultation Finalized &amp; FHIR R4 Bundle Generated
                    </h2>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-[#EBFDF5] text-[#079455] border border-[#A6F4C5]">
                      ABDM Synced
                    </span>
                  </div>
                  <p className="text-[12px] mt-0.5 text-[#6F7480]">
                    Prescription signed by Dr. Sunita Rao • ABHA: <strong className="font-mono text-[#17191F]">dpatil@abdm</strong>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  onClick={() => setPrescriptionModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl text-white text-[12.5px] font-bold shadow-2xs flex items-center gap-1.5 bg-[#2365B5] cursor-pointer"
                >
                  <Printer size={13} />
                  <span>View Prescription</span>
                </button>
                <button
                  onClick={() => router.push('/doctor/queue')}
                  className="px-3.5 py-2 rounded-xl border border-[#CBD8E5] text-[12.5px] font-bold text-[#4B5565] bg-white hover:bg-[#EEF2F6] transition-colors cursor-pointer"
                >
                  Next Patient →
                </button>
              </div>
            </div>
          </Card>
        )}

        {/* ── Sleek 44px Red Flag Banner / Triage Clear Status ── */}
        {isUrgent ? (
          <RedFlagBanner alert={DEMO_RED_FLAG_ENC002} />
        ) : (
          <div className="rounded-xl px-4 py-2.5 flex items-center justify-between border border-[#A6F4C5] bg-[#EBFDF5] shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <ShieldCheck size={16} className="text-[#079455] shrink-0" />
              <p className="text-[12.5px] font-semibold text-[#079455] truncate">
                <strong className="font-extrabold">Triage Status Clear:</strong> No acute cardiac or red-flag emergency symptoms reported during multilingual kiosk intake.
              </p>
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border border-[#A6F4C5] bg-white text-[#079455] shrink-0">
              Triage Clear
            </span>
          </div>
        )}

        {/* ── Responsive Mobile/Tablet View Toggle (<lg screens) ── */}
        <div className="lg:hidden flex rounded-2xl bg-white p-1 border border-[#DFE8F1] shadow-2xs">
          <button
            type="button"
            onClick={() => setMobileView('CLINICAL')}
            className={cn(
              'flex-1 py-2 text-[12.5px] font-extrabold rounded-xl transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer',
              mobileView === 'CLINICAL'
                ? 'bg-[#2365B5] text-white shadow-xs'
                : 'text-[#6F7480] hover:text-[#17191F]'
            )}
          >
            <FileText size={14} />
            <span>AI Clinical Brief</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileView('EVIDENCE')}
            className={cn(
              'flex-1 py-2 text-[12.5px] font-extrabold rounded-xl transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer',
              mobileView === 'EVIDENCE'
                ? 'bg-[#2365B5] text-white shadow-xs'
                : 'text-[#6F7480] hover:text-[#17191F]'
            )}
          >
            <BookOpen size={14} />
            <span>Source Proof &amp; Docs ({documents.length})</span>
          </button>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            RESPONSIVE 2-COLUMN COCKPIT (60% Left Briefing, 40% Right Proof)
        ════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 xl:gap-7 items-start">
          {/* ════════════════════════════════════════════════════════════
              LEFT COLUMN: 60% — AI CLINICAL SUMMARY & SOCRATES BRIEF
          ════════════════════════════════════════════════════════════ */}
          <div className={cn('lg:col-span-7 xl:col-span-7 2xl:col-span-8 space-y-4 sm:space-y-5', mobileView !== 'CLINICAL' && 'hidden lg:block')}>
            {/* 1. Clinical Snapshot Card */}
            <Card level={2} className="overflow-hidden">
              <CardHeader className="bg-white">
                <div className="flex items-center gap-2">
                  <span className="text-[11.5px] font-extrabold uppercase tracking-wider text-[#2365B5]">
                    15-Second Clinical Glance
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-lg border border-[#CBD8E5] bg-[#EEF5FC] text-[#2365B5]">
                    SOCRATES Synthesized
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 p-4">
                {/* Chief Complaint */}
                <div className="p-3.5 rounded-2xl border border-[#DFE8F1] bg-[#F8FAFC] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="min-w-0">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6F7480] block mb-0.5">
                      Chief Complaint
                    </span>
                    <p className="text-[15px] font-extrabold text-[#17191F] leading-snug">
                      {profile.complaint}
                    </p>
                  </div>
                  <SourceBadge type={isUrgent ? 'voice' : 'patient'} className="self-start sm:self-center" />
                </div>

                {/* 3 Standalone Compact Units */}
                <div className="grid grid-cols-1 sm:grid-cols-3 2xl:grid-cols-4 gap-2.5 sm:gap-3">
                  <SnapshotBlock
                    label="Duration · Severity"
                    value={profile.durationSeverity}
                    accent={isUrgent ? 'critical' : 'neutral'}
                    icon={Activity}
                  />
                  <SnapshotBlock
                    label="Body Location"
                    value={profile.bodyArea}
                    icon={MapPin}
                  />
                  <SnapshotBlock
                    label="Intake Channel"
                    value={profile.intakeSource}
                    icon={Mic}
                  />
                </div>

                {/* AYUSH Ahara / Vihara Lifestyle Trigger Banner if present */}
                {profile.lifestyleTrigger && (
                  <div className="p-2.5 rounded-xl bg-[#EBFDF5] border border-[#A6F4C5] text-[12px] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Leaf size={14} className="text-[#079455] shrink-0" />
                      <span className="text-[#079455] font-extrabold">AYUSH Trigger:</span>
                      <span className="text-[#17191F] font-bold">{profile.lifestyleTrigger}</span>
                    </div>
                    <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 bg-white rounded text-[#079455] border border-[#A6F4C5]">
                      Ahara/Vihara
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 2. Structured Clinical Findings (Clean FactCards with Raw OCR Collapsed) */}
            <Card level={2} className="p-4 sm:p-5 space-y-3.5">
              <ClinicalSectionHeader
                icon={Sparkles}
                title="Verified Clinical Extractions"
                subtitle="Double-coded with ICD-11 &amp; NAMASTE Ayush identifiers. Raw OCR tucked behind inspect triggers."
                badge={
                  <span className="text-[10.5px] font-mono font-bold px-2 py-0.5 rounded-lg border border-[#DFE8F1] bg-[#F8FAFC] text-[#4B5565]">
                    {facts.length} Findings
                  </span>
                }
              />

              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-3 sm:gap-3.5">
                {facts.map((fact) => {
                  let srcType: 'patient' | 'voice' | 'ocr' | 'unverified' | 'ai' = 'patient'
                  if (fact.sourceType === 'DOCUMENT_EXTRACT') {
                    srcType = fact.degradationTier === 3 || fact.confidenceTier === 3 ? 'unverified' : 'ocr'
                  } else if (fact.sourceType === 'INTERVIEW') {
                    srcType = 'voice'
                  }

                  return (
                    <FactCard
                      key={fact.id}
                      category={`${fact.domain} • ${fact.fieldName.replace(/_/g, ' ')}`}
                      primary={fact.rawValue}
                      detail={fact.groundTruthSnippet || fact.extractedSnippet || fact.sourceText || `Confidence: ${Math.round((fact.ocrConfidence || fact.confidence || 0.9) * 100)}%`}
                      sourceType={srcType}
                      sourceName={fact.sourceId}
                      factId={fact.id}
                      onClick={() => openEvidenceDrawer(fact.id)}
                    />
                  )
                })}
              </div>
            </Card>

            {/* 3. Clinical Conflicts if any */}
            {conflicts.length > 0 && (
              <section className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-[12.5px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 text-[#B54708]">
                    <AlertTriangle size={14} /> Intake Discrepancy Flagged ({conflicts.length})
                  </h3>
                  <span className="text-[11px] text-[#6F7480]">Physician resolution required</span>
                </div>
                {conflicts.map((conflict) => (
                  <ConflictCard key={conflict.id} conflict={conflict} onResolve={handleResolveConflict} />
                ))}
              </section>
            )}

            {/* 4. Supporting Clinical History (Collapsible Accordion) */}
            <details className="group border border-[#DFE8F1] rounded-2xl bg-white shadow-2xs overflow-hidden">
              <summary className="p-3.5 sm:p-4 flex items-center justify-between cursor-pointer select-none hover:bg-[#F8FAFC] transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-[#EEF5FC] text-[#2365B5] border border-[#CBD8E5]">
                    <CalendarDays size={14} />
                  </div>
                  <div>
                    <h3 className="text-[13.5px] font-extrabold text-[#17191F]">
                      Supporting Baseline Medical History
                    </h3>
                    <p className="text-[11px] text-[#6F7480]">
                      Prior illnesses, active prescriptions, allergies, and surgical notes.
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-extrabold text-[#2365B5] group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>

              <div className="p-4 pt-0 border-t border-[#DFE8F1] divide-y divide-[#F1F4F9]">
                {[
                  {
                    category: 'Past Medical History',
                    primary: 'Hypertension (controlled, 5 years)',
                    detail: 'No diabetes mellitus diagnosed. No abdominal surgical history.',
                    type: 'patient' as ClinicalSourceType,
                  },
                  {
                    category: 'Current Medications',
                    primary: 'Tab. Amlodipine 5mg (OD) · Antacid syrup (PRN)',
                    detail: 'Amlodipine taken regularly for 3 years. Intermittent antacids.',
                    type: 'ocr' as ClinicalSourceType,
                  },
                  {
                    category: 'Allergy Status',
                    primary: 'No known drug allergies reported at kiosk',
                    detail: 'Historical sensitivity to Penicillin noted in 2021 hospital record.',
                    type: 'unverified' as ClinicalSourceType,
                  },
                  {
                    category: 'Family History',
                    primary: 'Father: Peptic ulcer disease · Mother: Hypertension',
                    detail: 'Familial predisposition to acid peptic disorder and hypertension.',
                    type: 'voice' as ClinicalSourceType,
                  },
                ].map((row) => (
                  <div key={row.category} className="py-2.5 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3 min-w-0">
                    <span className="shrink-0 text-[10px] font-extrabold uppercase tracking-wider w-full sm:w-[150px] text-[#6F7480] pt-0.5">
                      {row.category}
                    </span>
                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 min-w-0">
                      <div className="min-w-0 flex-1">
                        <p className="text-[12.5px] font-bold text-[#17191F]">
                          {row.primary}
                        </p>
                        <p className="text-[11px] text-[#4B5565] mt-0.5">
                          {row.detail}
                        </p>
                      </div>
                      <SourceBadge type={row.type} />
                    </div>
                  </div>
                ))}
              </div>
            </details>

            {/* 5. Differential Diagnoses & AI Guidance (Collapsible Accordion) */}
            <details className="group border border-[#DFE8F1] rounded-2xl bg-white shadow-2xs overflow-hidden">
              <summary className="p-3.5 sm:p-4 flex items-center justify-between cursor-pointer select-none hover:bg-[#F8FAFC] transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-[#EEF5FC] text-[#2365B5] border border-[#CBD8E5]">
                    <Layers size={14} />
                  </div>
                  <div>
                    <h3 className="text-[13.5px] font-extrabold text-[#17191F]">
                      Differential Diagnoses &amp; Guideline Suggestions
                    </h3>
                    <p className="text-[11px] text-[#6F7480]">
                      ICD-11 &amp; Rome IV clinical guidelines correlation.
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-extrabold text-[#2365B5] group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>

              <div className="p-4 pt-0 border-t border-[#DFE8F1]">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[12px] mt-3">
                  <div className="p-3 rounded-xl border border-[#DFE8F1] bg-[#F8FAFC] space-y-1.5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-extrabold text-[#17191F]">1. Functional Dyspepsia</span>
                        <span className="text-[9.5px] font-extrabold px-1.5 py-0.5 rounded text-white bg-[#2365B5]">88%</span>
                      </div>
                      <p className="text-[11px] text-[#4B5565] mt-1">ICD-11: MD90.0 · Rome IV postprandial distress.</p>
                    </div>
                    <SourceBadge type="ai" />
                  </div>

                  <div className="p-3 rounded-xl border border-[#DFE8F1] bg-[#F8FAFC] space-y-1.5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-extrabold text-[#17191F]">2. Peptic Ulcer</span>
                        <span className="text-[9.5px] font-extrabold px-1.5 py-0.5 rounded border border-[#DFE8F1] bg-white text-[#4B5565]">42%</span>
                      </div>
                      <p className="text-[11px] text-[#4B5565] mt-1">ICD-11: DA40 · Epigastric burning without alarm signs.</p>
                    </div>
                    <SourceBadge type="ai" />
                  </div>

                  <div className="p-3 rounded-xl border border-[#DFE8F1] bg-[#F8FAFC] space-y-1.5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-extrabold text-[#17191F]">3. GERD</span>
                        <span className="text-[9.5px] font-extrabold px-1.5 py-0.5 rounded border border-[#DFE8F1] bg-white text-[#4B5565]">35%</span>
                      </div>
                      <p className="text-[11px] text-[#4B5565] mt-1">ICD-11: DA22 · Retrosternal burning.</p>
                    </div>
                    <SourceBadge type="ai" />
                  </div>
                </div>
              </div>
            </details>

            {/* 6. Physician Decision Console & Rx Order Box */}
            <Card level={2} className="p-4 sm:p-5 space-y-3.5 border-2 border-[#CBD8E5] shadow-xs">
              <ClinicalSectionHeader
                icon={Edit3}
                title="Physician Clinical Orders &amp; Prescription"
                subtitle="Document examination notes, confirm intake validation, and finalize prescription."
                badge={
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-lg border border-[#CBD8E5] bg-[#EEF5FC] text-[#2365B5]">
                    OPD Station #04
                  </span>
                }
              />

              <div>
                <label className="text-[11px] font-extrabold uppercase tracking-wider block mb-1.5 text-[#4B5565]">
                  Physician Examination Findings &amp; Clinical Notes
                </label>
                <textarea
                  value={physicianNotes}
                  onChange={(e) => setPhysicianNotes(e.target.value)}
                  placeholder="Enter palpation findings, differential assessment, or patient counselling instructions..."
                  className="w-full h-24 text-[13px] p-3 rounded-xl border border-[#CBD8E5] bg-white text-[#17191F] focus:outline-none focus:ring-2 focus:ring-[#2365B5] resize-none transition-all placeholder:text-[#6F7480]"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsIntakeVerified(true)
                    addToast({
                      type: 'success',
                      title: 'Intake Verified by Physician',
                      body: 'All clinical facts and ASR extractions marked as verified by Dr. Sunita Rao.',
                    })
                  }}
                  className={cn(
                    'w-full sm:w-auto px-4 py-2.5 rounded-xl border text-[12.5px] font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs',
                    isIntakeVerified
                      ? 'bg-[#EBFDF5] border-[#A6F4C5] text-[#079455]'
                      : 'bg-white border-[#CBD8E5] text-[#17191F] hover:bg-[#EEF2F6]'
                  )}
                >
                  <CheckCircle2 size={15} className={isIntakeVerified ? 'text-[#079455]' : 'text-[#6F7480]'} />
                  <span>{isIntakeVerified ? 'Intake Verified ✓' : 'Mark Intake Verified'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCompleteEncounter}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-white text-[13px] font-extrabold transition-all shadow-xs flex items-center justify-center gap-2 hover:opacity-95 bg-[#2365B5] cursor-pointer"
                >
                  <span>Finalize Consultation &amp; Sync to ABDM</span>
                  <ChevronRight size={15} />
                </button>
              </div>
            </Card>
          </div>

          {/* ════════════════════════════════════════════════════════════
              RIGHT COLUMN: 40% — EVIDENCE & PROVENANCE COCKPIT (Sticky)
          ════════════════════════════════════════════════════════════ */}
          <div className={cn('lg:col-span-5 xl:col-span-5 2xl:col-span-4 space-y-4 lg:sticky lg:top-18', mobileView !== 'EVIDENCE' && 'hidden lg:block')}>
            <Card level={2} className="overflow-hidden border border-[#DFE8F1] shadow-card">
              {/* Evidence Provenance Header with Subtabs */}
              <div className="p-3.5 bg-white border-b border-[#DFE8F1] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-extrabold uppercase tracking-wider text-[#2365B5] flex items-center gap-1.5">
                    <Search size={14} />
                    Source Evidence &amp; Proof
                  </span>
                  <button
                    onClick={() => openEvidenceDrawer(facts[0]?.id || documents[0]?.id || 'doc-001')}
                    className="text-[11.5px] font-extrabold text-[#2365B5] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Full Inspector</span>
                    <ExternalLink size={11} />
                  </button>
                </div>

                {/* Sub-tab pills */}
                <div className="grid grid-cols-4 gap-1 p-1 bg-[#F1F4F9] rounded-xl text-[11px] font-extrabold">
                  <button
                    type="button"
                    onClick={() => setEvidenceSubTab('DOCUMENTS')}
                    className={cn(
                      'py-1.5 rounded-lg text-center transition-all cursor-pointer truncate',
                      evidenceSubTab === 'DOCUMENTS'
                        ? 'bg-white text-[#2365B5] shadow-xs'
                        : 'text-[#6F7480] hover:text-[#17191F]'
                    )}
                  >
                    Docs ({documents.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setEvidenceSubTab('VOICE')}
                    className={cn(
                      'py-1.5 rounded-lg text-center transition-all cursor-pointer truncate',
                      evidenceSubTab === 'VOICE'
                        ? 'bg-white text-[#2365B5] shadow-xs'
                        : 'text-[#6F7480] hover:text-[#17191F]'
                    )}
                  >
                    Audio
                  </button>
                  <button
                    type="button"
                    onClick={() => setEvidenceSubTab('TIMELINE')}
                    className={cn(
                      'py-1.5 rounded-lg text-center transition-all cursor-pointer truncate',
                      evidenceSubTab === 'TIMELINE'
                        ? 'bg-white text-[#2365B5] shadow-xs'
                        : 'text-[#6F7480] hover:text-[#17191F]'
                    )}
                  >
                    Timeline
                  </button>
                  <button
                    type="button"
                    onClick={() => setEvidenceSubTab('COMPLETENESS')}
                    className={cn(
                      'py-1.5 rounded-lg text-center transition-all cursor-pointer truncate',
                      evidenceSubTab === 'COMPLETENESS'
                        ? 'bg-white text-[#2365B5] shadow-xs'
                        : 'text-[#6F7480] hover:text-[#17191F]'
                    )}
                  >
                    Audit
                  </button>
                </div>
              </div>

              {/* Subtab 1: Scanned Documents */}
              {evidenceSubTab === 'DOCUMENTS' && (
                <div className="p-4 space-y-3 max-h-[620px] overflow-y-auto">
                  {documents.map((doc) => {
                    const isDocTier3 = doc.degradationTier === 3
                    return (
                      <div
                        key={doc.id}
                        className={cn(
                          'p-3.5 rounded-2xl border bg-white shadow-2xs hover:shadow-md hover:border-[#2365B5]/60 transition-all flex flex-col justify-between gap-2.5 text-left group',
                          isDocTier3 ? 'border-[#FECDCA] border-l-4 border-l-[#D92D20]' : 'border-[#DFE8F1]'
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#EEF5FC] text-[#2365B5] border border-[#CBD8E5] truncate">
                            {doc.documentType.replace(/_/g, ' ')}
                          </span>
                          <span className="text-[11px] font-mono font-extrabold text-[#079455]">
                            {Math.round((doc.ocrConfidence || 0.95) * 100)}% OCR
                          </span>
                        </div>

                        <div
                          className="cursor-pointer"
                          onClick={() =>
                            setSelectedPreviewDoc({
                              id: doc.id,
                              name: doc.originalFilename,
                              type: doc.documentType,
                              ocrConfidence: doc.ocrConfidence,
                              patientName: patient?.name,
                              tokenNumber: encounter?.tokenNumber,
                            })
                          }
                          title="Tap to preview high-resolution scanned document"
                        >
                          <h4 className="text-[13.5px] font-extrabold text-[#17191F] group-hover:text-[#2365B5] transition-colors truncate" title={doc.originalFilename}>
                            {doc.originalFilename}
                          </h4>
                          <p className="text-[11px] text-[#6F7480] mt-0.5 flex items-center gap-1.5 flex-wrap">
                            <span>{doc.pageCount} page(s)</span>
                            <span>•</span>
                            <span>{isDocTier3 ? '⚠️ Faded cursive prescription' : 'High quality scan'}</span>
                            <span>•</span>
                            <span className="text-[#2365B5] font-bold inline-flex items-center gap-0.5">
                              <Eye size={11} /> Tap to preview
                            </span>
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-[#6F7480] pt-2 border-t border-[#DFE8F1] gap-2 flex-wrap">
                          <span className="font-semibold">{doc.extractedFactsCount || 3} facts verified</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedPreviewDoc({
                                  id: doc.id,
                                  name: doc.originalFilename,
                                  type: doc.documentType,
                                  ocrConfidence: doc.ocrConfidence,
                                  patientName: patient?.name,
                                  tokenNumber: encounter?.tokenNumber,
                                })
                              }
                              className="font-extrabold text-[#2365B5] hover:text-[#174A91] flex items-center gap-1 bg-[#EEF5FC] hover:bg-[#D3E2F0] px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                            >
                              <Eye size={12} />
                              <span>Preview</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => openEvidenceDrawer(doc.id)}
                              className="font-extrabold text-[#4B5565] hover:text-[#17191F] flex items-center gap-1 bg-white hover:bg-[#F8FAFC] border border-[#CBD8E5] px-2 py-1 rounded-lg transition-colors cursor-pointer"
                            >
                              <span>Inspect Box 🔍</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  {documents.length === 0 && (
                    <div className="p-8 text-center text-[#6F7480] text-[13px]">
                      No paper documents attached for this encounter.
                    </div>
                  )}
                </div>
              )}

              {/* Subtab 2: Spoken Voice Audio Player */}
              {evidenceSubTab === 'VOICE' && (
                <div className="p-4 space-y-3.5">
                  <div className="bg-[#EEF5FC] border border-[#CBD8E5] rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mic size={16} className="text-[#2365B5]" />
                        <span className="text-[12px] font-extrabold text-[#2365B5] uppercase tracking-wider">
                          Vernacular Audio Intake
                        </span>
                      </div>
                      <span className="text-[10.5px] font-bold px-2 py-0.5 rounded bg-white text-[#2365B5] border border-[#CBD8E5]">
                        {profile.spokenAudioLang || 'Marathi'}
                      </span>
                    </div>

                    {/* Simulated Waveform / Audio Player Control */}
                    <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-[#CBD8E5]">
                      <button
                        type="button"
                        onClick={toggleVoicePlayback}
                        className="w-10 h-10 rounded-full bg-[#2365B5] text-white flex items-center justify-center shadow-xs hover:bg-[#174A91] transition-transform active:scale-95 cursor-pointer shrink-0"
                        aria-label={isPlayingVoice ? 'Pause audio' : 'Play audio recording'}
                      >
                        {isPlayingVoice ? <Pause size={17} /> : <Play size={17} className="ml-0.5" />}
                      </button>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-mono text-[#6F7480]">
                          <span>{isPlayingVoice ? '00:03' : '00:00'}</span>
                          <span>00:18</span>
                        </div>
                        {/* Animated waveform bars */}
                        <div className="flex items-center gap-0.5 h-6">
                          {[40, 80, 55, 95, 30, 70, 85, 45, 100, 60, 35, 75, 90, 50, 65, 80, 40, 60].map((val, idx) => (
                            <span
                              key={idx}
                              className={cn(
                                'flex-1 rounded-full transition-all',
                                isPlayingVoice ? 'bg-[#2365B5] motion-safe:animate-pulse' : 'bg-[#CBD8E5]'
                              )}
                              style={{ height: `${val}%` }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Verbatim Vernacular Quote */}
                    <div className="bg-white p-3 rounded-xl border border-[#CBD8E5] space-y-1 text-[12.5px]">
                      <span className="text-[10px] font-extrabold uppercase text-[#6F7480]">
                        Verbatim ASR Transcript (Bhashini AI):
                      </span>
                      <p className="font-bold text-[#17191F] italic leading-relaxed">
                        &ldquo;{profile.spokenAudioQuote}&rdquo;
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#4B5565] pt-0.5">
                      <span className="flex items-center gap-1 font-bold text-[#079455]">
                        <CheckCircle2 size={12} /> 94% Bhashini ASR Confidence
                      </span>
                      <span className="font-mono">Audio ID: aud-028</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Subtab 3: Longitudinal Timeline */}
              {evidenceSubTab === 'TIMELINE' && (
                <div className="p-4 max-h-[620px] overflow-y-auto">
                  <Timeline events={DEMO_TIMELINE_ENC001} />
                </div>
              )}

              {/* Subtab 4: Clinical Completeness Matrix */}
              {evidenceSubTab === 'COMPLETENESS' && (
                <div className="p-4 max-h-[620px] overflow-y-auto">
                  <CompletenessGrid entries={DEMO_COMPLETENESS_ENC001} />
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>

      {/* ══════════════════════════════════════════════════════════════
          PRESCRIPTION MODAL
      ══════════════════════════════════════════════════════════════ */}
      {prescriptionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-[#DFE8F1] bg-white shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#DFE8F1]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl text-white flex items-center justify-center font-extrabold text-[18px] bg-[#2365B5]">
                  V
                </div>
                <div>
                  <h3 className="text-[17px] font-extrabold text-[#17191F]">
                    Hospital OPD Electronic Prescription
                  </h3>
                  <p className="text-[11.5px] text-[#6F7480]">
                    Dept. of Internal Medicine • Room 104 • ABHA Health Locker
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPrescriptionModalOpen(false)}
                className="p-1.5 rounded-lg text-[#6F7480] hover:bg-[#EEF2F6] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl border border-[#DFE8F1] bg-[#F8FAFC] text-[12.5px]">
              <div>
                <p className="text-[10px] font-extrabold uppercase text-[#6F7480]">Patient</p>
                <p className="font-extrabold text-[#17191F] text-[14px]">{patient?.name || 'Dhananjay Patil'}</p>
                <p className="text-[#4B5565]">{patient?.age || 67}Y • Token {encounter?.tokenNumber || 'A-028'}</p>
                <p className="font-mono text-[11px] text-[#2365B5]">ABHA: 12-3456-7890-1234</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-extrabold uppercase text-[#6F7480]">Prescriber</p>
                <p className="font-extrabold text-[#17191F] text-[14px]">Dr. Sunita Rao, MD</p>
                <p className="text-[#4B5565]">Reg. No: MMC-2012-48291</p>
                <p className="text-[11px] font-bold text-[#079455]">Date: Today</p>
              </div>
            </div>

            <div className="space-y-2.5">
              <h4 className="text-[13.5px] font-extrabold flex items-center gap-1.5 text-[#17191F]">
                <span className="font-serif italic text-[17px] text-[#2365B5]">℞</span>
                Prescribed Medications (2)
              </h4>
              <div className="space-y-2">
                {[
                  { name: '1. Tab. Pantoprazole 40 mg', detail: '1 Tab • Once daily before breakfast (OD) • 14 days' },
                  { name: '2. Syrup Sucralfate 10 ml', detail: '2 tsp • Three times daily after meals (TDS) • 7 days' },
                ].map((med) => (
                  <div
                    key={med.name}
                    className="p-3 rounded-xl border border-[#DFE8F1] bg-white flex items-center justify-between text-[12.5px]"
                  >
                    <div>
                      <p className="font-extrabold text-[#17191F]">{med.name}</p>
                      <p className="text-[11.5px] text-[#6F7480]">{med.detail}</p>
                    </div>
                    <span className="text-[10.5px] font-extrabold px-2 py-0.5 rounded bg-[#EEF5FC] text-[#2365B5]">Oral</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl border border-[#DFE8F1] bg-[#F8FAFC] space-y-1 text-[12.5px]">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#6F7480]">Clinical Diagnosis</p>
              <p className="font-extrabold text-[#17191F]">Chronic Acid Peptic Disease / Dyspepsia (Physician Verified)</p>
              <p className="text-[11.5px] text-[#4B5565]">Advice: Avoid oily, excessively spicy foods. Elevate head of bed. Follow up in 2 weeks.</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] flex items-center gap-1 text-[#6F7480]">
                <ShieldCheck size={14} className="text-[#079455]" />
                Digitally signed via ABDM Bridge
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl text-white text-[12.5px] font-extrabold flex items-center gap-1.5 shadow-xs bg-[#2365B5] cursor-pointer"
                >
                  <Printer size={13} />
                  <span>Print</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPrescriptionModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#CBD8E5] text-[12.5px] font-bold text-[#4B5565] hover:bg-[#EEF2F6] cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scanned Document Interactive Preview Modal */}
      <DocumentPreviewModal
        isOpen={!!selectedPreviewDoc}
        onClose={() => setSelectedPreviewDoc(null)}
        document={selectedPreviewDoc}
      />
    </div>
  )
}
