'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
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
  Heart,
  X,
  AlertTriangle,
  FileText,
  Mic,
  Activity,
  HeartPulse,
  Thermometer,
  Clock,
  CheckSquare,
  BookOpen,
  MapPin,
  CalendarDays,
  Layers,
  TrendingUp,
} from 'lucide-react'

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
import { SlidingSegmentedTabs, type TabOption } from '@/components/ui/SlidingSegmentedTabs'

export default function DoctorEncounterPage() {
  const params = useParams()
  const router = useRouter()
  const encounterId = (params?.id as string) || 'enc-001'
  const { openEvidenceDrawer, addToast } = useUIStore()

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
  const [activeTab, setActiveTab] = useState<'NARRATIVE' | 'DOCUMENTS' | 'TIMELINE' | 'COMPLETENESS'>('NARRATIVE')

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

  const doctorEvidenceTabs: TabOption<'NARRATIVE' | 'DOCUMENTS' | 'TIMELINE' | 'COMPLETENESS'>[] = [
    { id: 'NARRATIVE', label: 'Evidence & Facts', icon: FileText },
    { id: 'DOCUMENTS', label: `Documents (${documents.length})`, icon: BookOpen },
    { id: 'TIMELINE', label: 'Timeline', icon: Clock },
    { id: 'COMPLETENESS', label: 'Completeness', icon: CheckSquare },
  ]

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

  const ENCOUNTER_PROFILES: Record<string, {
    complaint: string
    durationSeverity: string
    bodyArea: string
    intakeSource: string
    pulse: string
    bp: string
    temp: string
    spo2: string
    isUrgent?: boolean
  }> = {
    'enc-001': {
      complaint: 'Epigastric burning pain & post-prandial indigestion',
      durationSeverity: '3 months (Gradual) • 5/10 Moderate',
      bodyArea: 'Epigastric / Upper GI',
      intakeSource: 'Voice (मराठी) + OCR',
      pulse: '88 bpm',
      bp: '128/82',
      temp: '98.6°F',
      spo2: '98%',
    },
    'enc-002': {
      complaint: 'Acute chest discomfort, breathlessness radiating to left arm',
      durationSeverity: '2 hrs (Acute) • 8/10 Severe',
      bodyArea: 'Chest, Left Arm & Jaw',
      intakeSource: 'Voice (Hindi) + ECG OCR',
      pulse: '112 bpm',
      bp: '146/94',
      temp: '98.6°F',
      spo2: '93%',
      isUrgent: true,
    },
    'enc-003': {
      complaint: 'Bilateral knee pain, generalized weakness, joint stiffness',
      durationSeverity: '6 months (Chronic) • 6/10 Moderate',
      bodyArea: 'Bilateral Lower Limbs (Knees)',
      intakeSource: 'Voice (हिंदी) + X-Ray OCR',
      pulse: '76 bpm',
      bp: '134/86',
      temp: '98.4°F',
      spo2: '97%',
    },
    'enc-004': {
      complaint: 'Chronic indigestion, acid reflux, Ahara dietary irregularity',
      durationSeverity: '1 year (Chronic) • 4/10 Mild-Mod',
      bodyArea: 'Abdomen / Upper GI',
      intakeSource: 'Voice (हिंदी) + USG OCR',
      pulse: '82 bpm',
      bp: '122/78',
      temp: '98.6°F',
      spo2: '99%',
    },
    'enc-005': {
      complaint: 'Second trimester routine antenatal checkup (24 weeks)',
      durationSeverity: '24 wks Antenatal • Normal',
      bodyArea: 'Obstetric / Pelvic',
      intakeSource: 'Voice (اردو) + Lab OCR',
      pulse: '80 bpm',
      bp: '118/74',
      temp: '98.6°F',
      spo2: '99%',
    },
  }

  const profile = ENCOUNTER_PROFILES[encounterId] || ENCOUNTER_PROFILES['enc-001']
  const isUrgent = profile.isUrgent ?? false

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto" style={{ background: 'var(--color-canvas)' }}>

      {/* ════════════════════════════════════════════════════════════════
          1. TARGET READING ORDER #1: PATIENT IDENTITY + CONSULTATION STATUS
      ════════════════════════════════════════════════════════════════ */}
      <header
        className="px-4 lg:px-8 py-3 sticky top-0 z-20 shadow-2xs border-b border-[var(--color-border)] bg-[var(--color-surface)]"
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-3 min-w-0">
          {/* Left: Back + Token + Patient Identity + ABHA */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => router.push('/doctor/queue')}
              className="p-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)] transition-all shrink-0"
              title="Return to OPD Queue"
            >
              <ArrowLeft size={16} />
            </button>

            {/* Token Badge */}
            <div
              className={cn(
                'w-10 h-10 rounded-lg flex flex-col items-center justify-center shrink-0 border select-none',
                isUrgent
                  ? 'bg-[var(--color-critical-subtle)] border-[var(--color-critical)]/40 text-[var(--color-critical)]'
                  : 'bg-[var(--color-brand-mist)] border-[var(--color-border)] text-[var(--color-brand)]'
              )}
            >
              <span className="text-[7.5px] font-bold uppercase tracking-wider">TOKEN</span>
              <span className="text-[14px] font-bold font-mono leading-none">{encounter?.tokenNumber || 'A-028'}</span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap min-w-0">
                <h1 className="text-[17px] sm:text-[18px] font-bold tracking-tight text-[var(--color-text-primary)] truncate">
                  {patient?.name || 'Dhananjay Patil'}
                </h1>
                <span className="text-[11.5px] font-medium px-2 py-0.5 rounded border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)] shrink-0">
                  {patient?.age || 67}Y • {patient?.gender === 'FEMALE' || patient?.sex === 'F' ? 'Female' : 'Male'}
                </span>
                {isUrgent ? (
                  <span className="text-[10.5px] font-bold px-2 py-0.5 rounded border border-[var(--color-critical)]/40 bg-[var(--color-critical-subtle)] text-[var(--color-critical)] flex items-center gap-1 shrink-0 uppercase tracking-wider">
                    <AlertTriangle size={11} /> Urgent Priority
                  </span>
                ) : (
                  <span className="text-[10.5px] font-bold px-2 py-0.5 rounded border border-emerald-200/60 bg-[var(--color-verified-subtle)] text-[var(--color-verified-text)] flex items-center gap-1 shrink-0 uppercase tracking-wider">
                    <ShieldCheck size={11} /> ABHA Linked
                  </span>
                )}
              </div>
              <p className="text-[11px] mt-0.5 flex items-center gap-2 flex-wrap text-[var(--color-text-muted)] truncate">
                <span>ABHA: <strong className="font-mono text-[var(--color-text-secondary)]">{patient?.abhaNumber || '12-3456-7890-1234'}</strong></span>
                <span>•</span>
                <span>Intake: <strong className="font-medium text-[var(--color-text-secondary)]">{patient?.preferredLanguage === 'mr' ? 'Marathi (मराठी)' : patient?.preferredLanguage === 'hi' ? 'Hindi (हिंदी)' : patient?.preferredLanguage === 'ur' ? 'Urdu (اردو)' : 'English'}</strong></span>
                <span>•</span>
                <span>Attending: Dr. Sunita Rao, MD</span>
                <span>•</span>
                <span>{documents.length} doc(s) (avg {avgOcr}% OCR)</span>
              </p>
            </div>
          </div>

          {/* Right: Vitals strip + Action CTA */}
          <div className="flex items-center gap-3 flex-wrap self-end lg:self-center shrink-0">
            <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] font-mono text-[12px]">
              <div className="flex items-center gap-1">
                <HeartPulse size={13} className="text-[var(--color-critical)]" />
                <span className="font-bold text-[var(--color-text-primary)]">{isUrgent ? '112 bpm' : '88 bpm'}</span>
              </div>
              <span className="text-[var(--color-border)]">|</span>
              <div className="flex items-center gap-1">
                <Activity size={13} className="text-[var(--color-brand)]" />
                <span className="font-bold text-[var(--color-text-primary)]">{isUrgent ? '146/94' : '128/82'}</span>
              </div>
              <span className="text-[var(--color-border)]">|</span>
              <div className="flex items-center gap-1">
                <Thermometer size={13} className="text-[var(--color-warning)]" />
                <span className="font-bold text-[var(--color-text-primary)]">98.6°F</span>
              </div>
              <span className="text-[var(--color-border)]">|</span>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-[var(--color-text-muted)]">SpO2</span>
                <span className={cn('font-bold', isUrgent ? 'text-[var(--color-critical)]' : 'text-[var(--color-verified-text)]')}>
                  {isUrgent ? '93%' : '98%'}
                </span>
              </div>
            </div>

            {consultationStatus === 'READY' && (
              <button
                onClick={handleStartConsultation}
                className="px-4 py-2 rounded-xl text-white text-[12.5px] font-bold transition-all shadow-2xs flex items-center gap-1.5 hover:opacity-90 active:scale-95 bg-[var(--color-brand)]"
              >
                <Stethoscope size={14} />
                <span>Start Consultation</span>
              </button>
            )}
            {consultationStatus === 'IN_PROGRESS' && (
              <button
                onClick={handleCompleteEncounter}
                className="px-4 py-2 rounded-xl text-white text-[12.5px] font-bold transition-all shadow-2xs flex items-center gap-1.5 hover:opacity-90 active:scale-95 bg-[var(--color-verified)]"
              >
                <CheckCircle2 size={14} />
                <span>Finalize &amp; Prescribe</span>
              </button>
            )}
            {consultationStatus === 'COMPLETED' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPrescriptionModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl text-white text-[12px] font-bold transition-all shadow-2xs flex items-center gap-1.5 hover:opacity-90 active:scale-95 bg-[var(--color-brand)]"
                >
                  <Printer size={13} />
                  <span>Print Rx</span>
                </button>
                <button
                  onClick={handleResetDemo}
                  className="p-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)] transition-colors"
                  title="Reset Demo State"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 lg:p-8 w-full flex-1 space-y-4 min-w-0">

        {/* ════════════════════════════════════════════════════════════════
            COMPLETED STATE BANNER (When consultation finalized)
        ════════════════════════════════════════════════════════════════ */}
        {consultationStatus === 'COMPLETED' && (
          <Card level={2} variant="verified" className="p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-verified-subtle)] text-[var(--color-verified-text)] flex items-center justify-center shrink-0">
                  <FileCheck2 size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-[16px] sm:text-[17px] font-bold text-[var(--color-text-primary)]">
                      Consultation Finalized &amp; FHIR R4 Bundle Generated
                    </h2>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--color-verified-subtle)] text-[var(--color-verified-text)] border border-emerald-200/60">
                      ABDM Synced
                    </span>
                  </div>
                  <p className="text-[12px] mt-0.5 text-[var(--color-text-muted)]">
                    Prescription signed by Dr. Sunita Rao • ABHA: <strong className="font-mono text-[var(--color-text-secondary)]">dpatil@abdm</strong>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  onClick={() => setPrescriptionModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl text-white text-[12.5px] font-bold shadow-2xs flex items-center gap-1.5 bg-[var(--color-brand)]"
                >
                  <Printer size={13} /><span>View Prescription</span>
                </button>
                <button
                  onClick={() => router.push('/patient/dashboard')}
                  className="px-3.5 py-2 rounded-xl border border-emerald-200/60 text-[12.5px] font-bold flex items-center gap-1.5 bg-[var(--color-verified-subtle)] text-[var(--color-verified-text)]"
                >
                  <Heart size={13} /><span>Patient Portal →</span>
                </button>
                <button
                  onClick={() => router.push('/doctor/queue')}
                  className="px-3.5 py-2 rounded-xl border border-[var(--color-border)] text-[12.5px] font-semibold text-[var(--color-text-secondary)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-subtle)] transition-colors"
                >
                  Next Patient
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[12.5px]">
              <div className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Active Prescriptions (2)</span>
                <p className="font-bold text-[var(--color-text-primary)]">1. Tab. Pantoprazole 40mg (OD × 14d)</p>
                <p className="font-bold text-[var(--color-text-primary)]">2. Syrup Sucralfate 10ml (TDS × 7d)</p>
              </div>
              <div className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">ABDM Integration</span>
                <p className="font-bold text-[var(--color-verified-text)] flex items-center gap-1"><CheckCircle2 size={13} /> FHIR DiagnosticReport Published</p>
                <p className="text-[11.5px] text-[var(--color-text-muted)]">HIP ID: IN-MH-PUN-0042</p>
              </div>
              <div className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Follow-up &amp; AYUSH</span>
                <p className="font-bold text-[var(--color-text-primary)]">Review in 2 weeks</p>
                <p className="text-[11.5px] font-medium text-[var(--color-brand)]">Pitta-pacifying Ahara advised</p>
              </div>
            </div>
          </Card>
        )}

        {/* ════════════════════════════════════════════════════════════════
            2. TARGET READING ORDER #2: IMMEDIATE CLINICAL PRIORITY / RED FLAGS
            (Literal first thing rendered after identity, full width, unmissable)
        ════════════════════════════════════════════════════════════════ */}
        {isUrgent ? (
          <RedFlagBanner alert={DEMO_RED_FLAG_ENC002} />
        ) : (
          <div className="rounded-xl px-4 py-2.5 flex items-center justify-between border border-emerald-200/60 bg-[var(--color-verified-subtle)] shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <ShieldCheck size={16} className="text-[var(--color-verified-text)] shrink-0" />
              <p className="text-[12.5px] font-medium text-[var(--color-verified-text)] truncate">
                <strong className="font-bold">Triage Status Clear:</strong> No acute red flags detected during multilingual voice triage or OCR ingestion.
              </p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-emerald-200/60 bg-white text-[var(--color-verified-text)] shrink-0">
              Triage Clear
            </span>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            3. TARGET READING ORDER #3: CHIEF COMPLAINT & 4-BLOCK SNAPSHOT
            (Exactly 4 surviving blocks: Chief complaint, Duration+Severity,
             Body area, Intake source)
        ════════════════════════════════════════════════════════════════ */}
        <Card level={2} variant={isUrgent ? 'critical' : 'default'} className="overflow-hidden">
          <CardHeader className={isUrgent ? 'bg-[var(--color-critical-subtle)] border-[var(--color-critical)]/30' : undefined}>
            <div className="flex items-center gap-2 min-w-0">
              <span className={cn('text-[11px] font-bold uppercase tracking-wider truncate', isUrgent ? 'text-[var(--color-critical)]' : 'text-[var(--color-text-muted)]')}>
                Clinical Snapshot
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {consultationStatus === 'IN_PROGRESS' && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-[var(--color-border)] bg-[var(--color-brand-mist)] text-[var(--color-brand)] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  In Consultation
                </span>
              )}
              {consultationStatus === 'READY' && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-[var(--color-border)] bg-[var(--color-brand-mist)] text-[var(--color-brand)]">
                  Ready for Review
                </span>
              )}
              {consultationStatus === 'COMPLETED' && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-emerald-200/60 bg-[var(--color-verified-subtle)] text-[var(--color-verified-text)] flex items-center gap-1">
                  <CheckCircle2 size={11} /> Finalized
                </span>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-3.5">
            {/* Block 1: Chief complaint (primary, full-width) */}
            <div
              className={cn(
                'p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0',
                isUrgent
                  ? 'bg-[var(--color-critical-subtle)] border-[var(--color-critical)]/40 border-l-4 border-l-[var(--color-critical)]'
                  : 'bg-[var(--color-surface)] border-[var(--color-border)]'
              )}
            >
              <div className="min-w-0">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] block mb-0.5">
                  Chief Complaint
                </span>
                <p className="text-[15.5px] font-bold text-[var(--color-text-primary)] leading-snug">
                  {profile.complaint}
                </p>
              </div>
              <SourceBadge type={isUrgent ? 'voice' : 'patient'} className="self-start sm:self-center" />
            </div>

            {/* Blocks 2, 3, 4: Standalone Compact Units Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Block 2: Duration + Severity (paired) */}
              <SnapshotBlock
                label="Duration · Severity"
                value={profile.durationSeverity}
                accent={isUrgent ? 'critical' : 'neutral'}
                icon={Activity}
              />
              {/* Block 3: Body Area */}
              <SnapshotBlock
                label="Body Area"
                value={profile.bodyArea}
                icon={MapPin}
              />
              {/* Block 4: Intake Source */}
              <SnapshotBlock
                label="Intake Source"
                value={profile.intakeSource}
                icon={Mic}
              />
            </div>
          </CardContent>
        </Card>

        {/* ════════════════════════════════════════════════════════════════
            4. TARGET READING ORDER #4, 5, 6, 7: PROGRESSIVE DISCLOSURE TABS
            (Evidence & Facts, Documents, Timeline, Completeness)
        ════════════════════════════════════════════════════════════════ */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0 pt-1">
          <SlidingSegmentedTabs
            options={doctorEvidenceTabs}
            selectedId={activeTab}
            onChange={(newTab) => setActiveTab(newTab)}
            variant="default"
            layoutId="doctor-evidence-mode-pill"
            ariaLabel="Select Evidence Section"
          />
          <button
            onClick={() => openEvidenceDrawer(facts[0]?.id || documents[0]?.id || 'doc-001')}
            className="text-[12px] font-bold flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-lg border border-[var(--color-border)] shadow-2xs transition-all hover:bg-[var(--color-surface-subtle)] text-[var(--color-brand)] bg-[var(--color-surface)]"
          >
            <Search size={13} />
            <span>Open Provenance Drawer</span>
          </button>
        </div>

        {/* ── TAB 1: EVIDENCE & FACTS (Collapsible Sections) ─────────────── */}
        {activeTab === 'NARRATIVE' && (
          <div className="space-y-4">
            {/* Level 2 Card: Fixed-Structure Fact Cards */}
            <Card level={2} className="p-5 space-y-4">
              <ClinicalSectionHeader
                icon={Sparkles}
                title="Structured Clinical Findings &amp; Evidence"
                subtitle="Extracted entities with fixed structure: Category · Primary Finding · Supporting Detail · Source Badge."
                badge={
                  <span className="text-[10.5px] font-mono px-2 py-0.5 rounded border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)]">
                    {facts.length} Facts Extracted
                  </span>
                }
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {facts.map((fact) => {
                  let srcType: ClinicalSourceType = 'patient'
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

            {/* Clinical Conflicts / Discrepancies (Progressive Disclosure) */}
            {conflicts.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-[13px] font-bold uppercase tracking-wider flex items-center gap-1.5 text-[var(--color-warning-text)]">
                    <AlertTriangle size={14} /> Clinical Discrepancy Detected ({conflicts.length})
                  </h3>
                  <span className="text-[11px] text-[var(--color-text-muted)]">Physician verification requested</span>
                </div>
                {conflicts.map((conflict) => (
                  <ConflictCard key={conflict.id} conflict={conflict} onResolve={handleResolveConflict} />
                ))}
              </section>
            )}

            {/* Level 2 Card: Supporting Clinical History (Collapsed by Default) */}
            <details className="group border border-[var(--color-border)] rounded-2xl bg-[var(--color-surface)] shadow-2xs overflow-hidden">
              <summary className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none hover:bg-[var(--color-surface-subtle)] transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-[var(--color-brand-mist)] text-[var(--color-brand)] border border-[var(--color-border)]">
                    <CalendarDays size={15} />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-[var(--color-text-primary)]">
                      Supporting Clinical History &amp; Baseline Context
                    </h3>
                    <p className="text-[11.5px] text-[var(--color-text-muted)]">
                      Past medical history, active medications, allergies, and social background.
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-[var(--color-brand)] group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>

              <div className="p-5 pt-0 border-t border-[var(--color-border)] divide-y divide-[var(--color-border)]">
                {[
                  {
                    category: 'Past Medical History',
                    primary: 'Hypertension (controlled, 5 years)',
                    detail: 'No diabetes mellitus diagnosed. No previous abdominal surgical history.',
                    type: 'patient' as ClinicalSourceType,
                  },
                  {
                    category: 'Current Medications',
                    primary: 'Tab. Amlodipine 5mg (OD) · Antacid syrup (PRN)',
                    detail: 'Amlodipine taken regularly for 3 years. Antacid taken intermittently without prescription.',
                    type: 'ocr' as ClinicalSourceType,
                  },
                  {
                    category: 'Allergy & Adverse Reactions',
                    primary: 'No known drug allergies reported at intake',
                    detail: 'Discrepancy noted with historical record (Penicillin sensitivity documented in 2021).',
                    type: 'unverified' as ClinicalSourceType,
                  },
                  {
                    category: 'Family History',
                    primary: 'Father: Peptic ulcer disease · Mother: Hypertension',
                    detail: 'Strong familial predisposition to acid peptic disorder and essential hypertension.',
                    type: 'voice' as ClinicalSourceType,
                  },
                  {
                    category: 'Social & Lifestyle',
                    primary: 'Non-smoker · Occasional alcohol · Sedentary office work',
                    detail: 'Irregular meal timings due to commute; high tea and fried snack consumption.',
                    type: 'ai' as ClinicalSourceType,
                  },
                  {
                    category: 'ABDM / FHIR Status',
                    primary: 'Patient record linked · Consent granted',
                    detail: 'HIP ID: IN-MH-PUN-0042 · ABHA Health Locker connection verified.',
                    type: 'abdm' as ClinicalSourceType,
                  },
                ].map((row) => (
                  <div key={row.category} className="py-3 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 min-w-0">
                    <span className="shrink-0 text-[10.5px] font-bold uppercase tracking-wider w-full sm:w-[170px] text-[var(--color-text-muted)] pt-0.5">
                      {row.category}
                    </span>
                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 min-w-0">
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-semibold text-[var(--color-text-primary)] leading-snug">
                          {row.primary}
                        </p>
                        <p className="text-[11.5px] text-[var(--color-text-secondary)] mt-0.5">
                          {row.detail}
                        </p>
                      </div>
                      <SourceBadge type={row.type} />
                    </div>
                  </div>
                ))}
              </div>
            </details>

            {/* Differential Diagnoses & AI Guidance (Collapsed by Default) */}
            <details className="group border border-[var(--color-border)] rounded-2xl bg-[var(--color-surface)] shadow-2xs overflow-hidden">
              <summary className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none hover:bg-[var(--color-surface-subtle)] transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-[var(--color-brand-mist)] text-[var(--color-brand)] border border-[var(--color-border)]">
                    <Layers size={15} />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-[var(--color-text-primary)]">
                      Differential Diagnoses &amp; Guideline Correlation
                    </h3>
                    <p className="text-[11.5px] text-[var(--color-text-muted)]">
                      AI-generated guidance suggestions · Requires physician clinical confirmation.
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-[var(--color-brand)] group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>

              <div className="p-5 pt-0 border-t border-[var(--color-border)]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[12.5px] mt-4">
                  <div className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-[var(--color-text-primary)]">1. Functional Dyspepsia</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white bg-[var(--color-brand)]">88% Match</span>
                      </div>
                      <p className="text-[11.5px] text-[var(--color-text-secondary)] mt-1">ICD-11: MD90.0 · Rome IV criteria satisfied with postprandial distress.</p>
                    </div>
                    <SourceBadge type="ai" />
                  </div>

                  <div className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-[var(--color-text-primary)]">2. Peptic Ulcer Disease</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border border-[var(--color-border)] bg-white text-[var(--color-text-secondary)]">42% Match</span>
                      </div>
                      <p className="text-[11.5px] text-[var(--color-text-secondary)] mt-1">ICD-11: DA40 · Epigastric burning without melena or alarm signs.</p>
                    </div>
                    <SourceBadge type="ai" />
                  </div>

                  <div className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-[var(--color-text-primary)]">3. Gastroesophageal Reflux</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border border-[var(--color-border)] bg-white text-[var(--color-text-secondary)]">35% Match</span>
                      </div>
                      <p className="text-[11.5px] text-[var(--color-text-secondary)] mt-1">ICD-11: DA22 · Retrosternal burning sensation without dysphagia.</p>
                    </div>
                    <SourceBadge type="ai" />
                  </div>
                </div>
              </div>
            </details>
          </div>
        )}

        {/* ── TAB 2: DOCUMENTS (Equal-Height Grid with Fixed Zones) ───── */}
        {activeTab === 'DOCUMENTS' && (
          <Card level={2} className="p-5 space-y-4">
            <ClinicalSectionHeader
              icon={BookOpen}
              title={`Digitized Clinical Documents (${documents.length})`}
              subtitle="Scanned at kiosk OCR station with bounding box entity extraction and degradation tier ratings."
              badge={
                documents.some((d) => d.degradationTier === 3) ? (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[var(--color-warning-subtle)] text-[var(--color-warning-text)] border border-[var(--color-warning-subtle)] flex items-center gap-1">
                    <AlertTriangle size={12} /> Verification Required (Tier 3)
                  </span>
                ) : (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[var(--color-verified-subtle)] text-[var(--color-verified-text)] border border-emerald-200/60">
                    Extraction Complete
                  </span>
                )
              }
            />

            {/* Equal-Height Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
              {documents.map((doc) => {
                const isDocTier3 = doc.degradationTier === 3
                return (
                  <div
                    key={doc.id}
                    onClick={() => openEvidenceDrawer(doc.id)}
                    className={cn(
                      'p-4 rounded-xl border bg-[var(--color-surface)] hover:border-[var(--color-brand)] hover:shadow-2xs transition-all cursor-pointer group flex flex-col justify-between gap-3 text-left min-w-0 h-full',
                      isDocTier3 ? 'border-[var(--color-warning)]/40 border-l-4 border-l-[var(--color-warning)]' : 'border-[var(--color-border)]'
                    )}
                  >
                    {/* Zone 1: Document Type + Tier + OCR Confidence */}
                    <div className="flex items-center justify-between gap-2 min-w-0">
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--color-brand-mist)] text-[var(--color-brand)] border border-[var(--color-border)] truncate">
                        {doc.documentType.replace(/_/g, ' ')}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={cn(
                            'text-[9.5px] font-bold px-1.5 py-0.2 rounded border',
                            isDocTier3
                              ? 'bg-[var(--color-warning-subtle)] text-[var(--color-warning-text)] border-[var(--color-warning-subtle)]'
                              : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)] border-[var(--color-border)]'
                          )}
                        >
                          Tier {doc.degradationTier || 1}
                        </span>
                        <span
                          className={cn(
                            'text-[11px] font-mono font-bold',
                            isDocTier3 ? 'text-[var(--color-warning-text)]' : 'text-[var(--color-verified-text)]'
                          )}
                        >
                          {Math.round((doc.ocrConfidence || 0.95) * 100)}% OCR
                        </span>
                      </div>
                    </div>

                    {/* Zone 2: File Name & Quality */}
                    <div className="min-w-0 my-1">
                      <h4
                        className="text-[13.5px] font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-brand)] transition-colors truncate"
                        title={doc.originalFilename}
                      >
                        {doc.originalFilename}
                      </h4>
                      <p className="text-[11.5px] text-[var(--color-text-muted)] mt-0.5">
                        {doc.pageCount} page(s) • {isDocTier3 ? '⚠️ Faded / Cursive Script' : 'Clean Electronic Scan'}
                      </p>
                    </div>

                    {/* Zone 3: Extracted Entity Count + Verification Status */}
                    <div className="flex items-center justify-between text-[11px] text-[var(--color-text-muted)] pt-2 border-t border-[var(--color-border)] min-w-0">
                      <span className="truncate">
                        {doc.extractedFactsCount || 3} entities extracted
                      </span>
                      <span className="font-bold flex items-center gap-1 text-[var(--color-brand)] group-hover:underline shrink-0">
                        <span>Inspect</span>
                        <ExternalLink size={11} />
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        )}

        {/* ── TAB 3: TIMELINE (Refined Chronological Flow) ────────────── */}
        {activeTab === 'TIMELINE' && (
          <Card level={2} className="p-5 space-y-4">
            <ClinicalSectionHeader
              icon={TrendingUp}
              title="Longitudinal Health Timeline"
              subtitle="Prior health events and medical milestones arranged chronologically."
            />
            <Timeline events={DEMO_TIMELINE_ENC001} />
          </Card>
        )}

        {/* ── TAB 4: COMPLETENESS ─────────────────────────────────────── */}
        {activeTab === 'COMPLETENESS' && (
          <Card level={2} className="p-5 space-y-4">
            <ClinicalSectionHeader
              icon={CheckSquare}
              title="11-Domain Clinical Intake Completeness Matrix"
              subtitle="Standardized clinical readiness check before issuing final prescription."
            />
            <CompletenessGrid entries={DEMO_COMPLETENESS_ENC001} />
          </Card>
        )}

        {/* ════════════════════════════════════════════════════════════════
            8. TARGET READING ORDER #8: EXAMINATION & CLINICAL ACTIONS
            (Physician Decision Console — always visible at bottom)
        ════════════════════════════════════════════════════════════════ */}
        <Card level={2} className="p-5 space-y-4 border-2 border-[var(--color-border)] shadow-2xs">
          <ClinicalSectionHeader
            icon={Edit3}
            title="Physician Examination &amp; Clinical Rx Orders"
            subtitle="Document physical exam findings, confirm intake validation, and emit digital FHIR prescription."
            badge={
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-[var(--color-border)] bg-[var(--color-brand-mist)] text-[var(--color-brand)]">
                OPD Station #04
              </span>
            }
          />

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider block mb-1.5 text-[var(--color-text-secondary)]">
              Physical Examination Findings &amp; Decision Notes
            </label>
            <textarea
              value={physicianNotes}
              onChange={(e) => setPhysicianNotes(e.target.value)}
              placeholder="Enter palpation findings, differential assessment, or patient counselling instructions..."
              className="w-full h-24 text-[13px] p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] resize-none transition-all placeholder:text-[var(--color-text-muted)]"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <button
              onClick={() => {
                setIsIntakeVerified(true)
                addToast({
                  type: 'success',
                  title: 'Intake Verified by Physician',
                  body: 'All clinical facts and ASR extractions marked as verified by Dr. Sunita Rao.',
                })
              }}
              className={cn(
                'w-full sm:w-auto px-4 py-2 rounded-xl border text-[12px] font-bold transition-all flex items-center justify-center gap-2 active:scale-[0.98]',
                isIntakeVerified
                  ? 'bg-[var(--color-verified-subtle)] border-emerald-200/60 text-[var(--color-verified-text)]'
                  : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-subtle)]'
              )}
            >
              <CheckCircle2 size={14} className={isIntakeVerified ? 'text-[var(--color-verified-text)]' : 'text-[var(--color-text-muted)]'} />
              <span>{isIntakeVerified ? 'Intake Verified ✓' : 'Mark Intake Verified'}</span>
            </button>

            <button
              onClick={handleCompleteEncounter}
              className="w-full sm:w-auto px-5 py-2 rounded-xl text-white text-[12.5px] font-bold transition-all shadow-2xs flex items-center justify-center gap-2 active:scale-[0.98] hover:opacity-90 bg-[var(--color-brand)]"
            >
              <span>Finalize Consultation &amp; Sync to ABDM</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </Card>
      </main>

      {/* ══════════════════════════════════════════════════════════════
          PRESCRIPTION MODAL
      ══════════════════════════════════════════════════════════════ */}
      {prescriptionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-2xl p-6 sm:p-8 border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl text-white flex items-center justify-center font-bold text-[18px] bg-[var(--color-brand)]">
                  V
                </div>
                <div>
                  <h3 className="text-[17px] font-extrabold text-[var(--color-text-primary)]">
                    Hospital OPD Electronic Prescription
                  </h3>
                  <p className="text-[11.5px] text-[var(--color-text-muted)]">
                    Dept. of Internal Medicine • Room 104 • ABHA Health Locker
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPrescriptionModalOpen(false)}
                className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)]"
              >
                <X size={17} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[12.5px]">
              <div>
                <p className="text-[10.5px] font-bold uppercase text-[var(--color-text-muted)]">Patient</p>
                <p className="font-bold text-[var(--color-text-primary)]">{patient?.name || 'Dhananjay Patil'}</p>
                <p className="text-[var(--color-text-secondary)]">{patient?.age || 67}Y • Token {encounter?.tokenNumber || 'A-028'}</p>
                <p className="font-mono text-[11px] text-[var(--color-brand)]">ABHA: 12-3456-7890-1234</p>
              </div>
              <div className="text-right">
                <p className="text-[10.5px] font-bold uppercase text-[var(--color-text-muted)]">Prescriber</p>
                <p className="font-bold text-[var(--color-text-primary)]">Dr. Sunita Rao, MD</p>
                <p className="text-[var(--color-text-secondary)]">Reg. No: MMC-2012-48291</p>
                <p className="text-[11px] font-bold text-[var(--color-verified-text)]">Date: Today</p>
              </div>
            </div>

            <div className="space-y-2.5">
              <h4 className="text-[13.5px] font-extrabold flex items-center gap-1.5 text-[var(--color-text-primary)]">
                <span className="font-serif italic text-[17px] text-[var(--color-brand)]">℞</span>
                Prescribed Medications (2)
              </h4>
              <div className="space-y-2">
                {[
                  { name: '1. Tab. Pantoprazole 40 mg', detail: '1 Tab • Once daily before breakfast (OD) • 14 days' },
                  { name: '2. Syrup Sucralfate 10 ml', detail: '2 tsp • Three times daily after meals (TDS) • 7 days' },
                ].map((med) => (
                  <div
                    key={med.name}
                    className="p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-between text-[12.5px]"
                  >
                    <div>
                      <p className="font-bold text-[var(--color-text-primary)]">{med.name}</p>
                      <p className="text-[11.5px] text-[var(--color-text-secondary)]">{med.detail}</p>
                    </div>
                    <span className="text-[10.5px] font-bold px-2 py-0.5 rounded bg-[var(--color-brand-mist)] text-[var(--color-brand)]">Oral</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] space-y-1 text-[12.5px]">
              <p className="text-[10.5px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Clinical Diagnosis</p>
              <p className="font-bold text-[var(--color-text-primary)]">Chronic Acid Peptic Disease / Dyspepsia (Physician Verified)</p>
              <p className="text-[11.5px] text-[var(--color-text-secondary)]">Advice: Avoid oily, excessively spicy foods. Elevate head of bed. Follow up in 2 weeks.</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] flex items-center gap-1 text-[var(--color-text-muted)]">
                <ShieldCheck size={13} className="text-[var(--color-verified-text)]" />
                Digitally signed via ABDM Bridge
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl text-white text-[12.5px] font-bold flex items-center gap-1.5 shadow-xs bg-[var(--color-brand)]"
                >
                  <Printer size={13} /><span>Print</span>
                </button>
                <button
                  onClick={() => setPrescriptionModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--color-border)] text-[12.5px] font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

