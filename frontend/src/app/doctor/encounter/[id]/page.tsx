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
} from 'lucide-react'
import {
  DEMO_ENCOUNTERS,
  DEMO_PATIENTS,
  DEMO_FACTS_ENC001,
  DEMO_CONFLICTS_ENC001,
  DEMO_DOCUMENTS_ENC001,
  DEMO_TIMELINE_ENC001,
  DEMO_COMPLETENESS_ENC001,
  DEMO_RED_FLAG_ENC002,
} from '@/constants/demo-data'
import {
  ConflictCard,
  CompletenessGrid,
  ProvenanceChip,
  RedFlagBanner,
  Timeline,
} from '@/components/clinical'
import { useUIStore } from '@/store'
import type { ClinicalConflict, ClinicalFact, Encounter, Patient } from '@/types'
import { cn } from '@/lib/utils'
import { SlidingSegmentedTabs, type TabOption } from '@/components/ui/SlidingSegmentedTabs'

const DOCTOR_EVIDENCE_TABS: TabOption<'NARRATIVE' | 'DOCUMENTS' | 'TIMELINE' | 'COMPLETENESS'>[] = [
  { id: 'NARRATIVE', label: 'Evidence Narrative & Facts', icon: FileText },
  { id: 'DOCUMENTS', label: 'Scanned Documents (2)', icon: BookOpen },
  { id: 'TIMELINE', label: 'Longitudinal Timeline', icon: Clock },
  { id: 'COMPLETENESS', label: 'Intake Completeness', icon: CheckSquare },
]

export default function DoctorEncounterPage() {
  const params = useParams()
  const router = useRouter()
  const encounterId = (params?.id as string) || 'enc-001'
  const { openEvidenceDrawer, addToast } = useUIStore()

  const [encounter, setEncounter] = useState<Encounter | null>(null)
  const [patient, setPatient] = useState<Patient | null>(null)
  const [, setFacts] = useState<ClinicalFact[]>([])
  const [conflicts, setConflicts] = useState<ClinicalConflict[]>([])
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

    if (encounterId === 'enc-001' || !params?.id) {
      setFacts(DEMO_FACTS_ENC001)
      setConflicts(DEMO_CONFLICTS_ENC001)
    } else {
      setFacts([])
      setConflicts([])
    }
  }, [encounterId, params?.id])

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
    addToast({
      type: 'info',
      title: 'Demo State Reset',
      body: 'Encounter reset to initial state ready for presentation.',
    })
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto" style={{ background: 'var(--color-canvas)' }}>
      {/* ── 1. PATIENT CLINICAL CONTEXT BANNER ────────────────────────── */}
      <header
        className="px-4 lg:px-8 py-3.5 sticky top-0 z-20 shadow-xs border-b"
        style={{
          background: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Left: Navigation & Core Identity */}
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => router.push('/doctor/queue')}
              className="p-2 rounded-xl border text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-all"
              style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
              title="Return to OPD Queue"
            >
              <ArrowLeft size={16} />
            </button>

            {/* Token Badge */}
            <div
              className="w-11 h-11 rounded-xl flex flex-col items-center justify-center shrink-0 border"
              style={{
                background: 'var(--color-brand-mist)',
                borderColor: 'var(--color-border-strong)',
                color: 'var(--color-brand)',
              }}
            >
              <span className="text-[8px] font-bold uppercase tracking-wider">TOKEN</span>
              <span className="text-[15px] font-extrabold font-mono leading-none">{encounter?.tokenNumber || 'A-028'}</span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-[18px] font-extrabold text-text-primary tracking-tight">
                  {patient?.name || 'Dhananjay Patil'}
                </h1>
                <span className="text-[12px] font-semibold text-text-secondary px-2 py-0.5 rounded bg-surface-subtle border border-border">
                  {patient?.age || 67}Y • {patient?.gender === 'FEMALE' ? 'Female' : 'Male'}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-verified-subtle text-verified-text border border-verified/20 flex items-center gap-1">
                  <ShieldCheck size={11} /> ABHA: 12-3456-7890-1234
                </span>
              </div>
              <p className="text-[11.5px] text-text-muted mt-0.5 flex items-center gap-2 flex-wrap">
                <span>Intake Language: <strong className="text-text-secondary font-medium">Marathi (मराठी)</strong></span>
                <span>•</span>
                <span>Attending: <strong className="text-text-secondary font-medium">Dr. Sunita Rao, MD</strong></span>
                <span>•</span>
                <span>Station: <strong className="text-text-secondary font-mono">OPD 04</strong></span>
              </p>
            </div>
          </div>

          {/* Right: Vitals Ribbon & Primary Action Controls */}
          <div className="flex items-center gap-3.5 flex-wrap self-end lg:self-center">
            {/* Quick Vitals Strip */}
            <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl border bg-surface-subtle font-mono text-[12px]">
              <div className="flex items-center gap-1">
                <HeartPulse size={13} className="text-critical" />
                <span className="font-bold text-text-primary">88 bpm</span>
              </div>
              <span className="text-border">|</span>
              <div className="flex items-center gap-1">
                <Activity size={13} className="text-brand" />
                <span className="font-bold text-text-primary">128/82</span>
              </div>
              <span className="text-border">|</span>
              <div className="flex items-center gap-1">
                <Thermometer size={13} className="text-warning" />
                <span className="font-bold text-text-primary">98.6°F</span>
              </div>
              <span className="text-border">|</span>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-text-muted">SpO2</span>
                <span className="font-bold text-verified">98%</span>
              </div>
            </div>

            {consultationStatus === 'READY' && (
              <button
                onClick={handleStartConsultation}
                className="px-4 py-2 rounded-xl text-white text-[13px] font-bold transition-all shadow-xs flex items-center gap-1.5 hover:opacity-90 active:scale-95"
                style={{ background: 'var(--color-brand)' }}
              >
                <Stethoscope size={14} />
                <span>Start Consultation</span>
              </button>
            )}

            {consultationStatus === 'IN_PROGRESS' && (
              <button
                onClick={handleCompleteEncounter}
                className="px-4 py-2 rounded-xl text-white text-[13px] font-bold transition-all shadow-xs flex items-center gap-1.5 hover:opacity-90 active:scale-95"
                style={{ background: 'var(--color-verified)' }}
              >
                <CheckCircle2 size={14} />
                <span>Finalize &amp; Prescribe</span>
              </button>
            )}

            {consultationStatus === 'COMPLETED' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPrescriptionModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl text-white text-[12px] font-bold transition-all shadow-xs flex items-center gap-1.5 hover:opacity-90 active:scale-95"
                  style={{ background: 'var(--color-brand)' }}
                >
                  <Printer size={13} />
                  <span>Print Prescription</span>
                </button>
                <button
                  onClick={handleResetDemo}
                  className="p-2 rounded-xl border text-text-muted hover:text-text-primary transition-colors"
                  style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
                  title="Reset Demo State"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── 2. MAIN CLINICAL EVIDENCE WORKSPACE ───────────────────────── */}
      <main className="max-w-7xl mx-auto p-4 lg:p-8 w-full flex-1 space-y-6">
        {/* COMPLETED SUCCESS STATE BANNER */}
        {consultationStatus === 'COMPLETED' && (
          <section
            className="rounded-2xl p-5 sm:p-6 shadow-xs space-y-4 border-2 animate-fade-in"
            style={{
              background: 'var(--color-surface)',
              borderColor: 'var(--color-verified)',
            }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-verified-subtle text-verified flex items-center justify-center shrink-0">
                  <FileCheck2 size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[17px] font-extrabold text-text-primary">
                      Consultation Finalized &amp; FHIR R4 Bundle Generated
                    </h2>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-verified-subtle text-verified-text border border-verified/30">
                      ABDM Synced
                    </span>
                  </div>
                  <p className="text-[12px] text-text-muted mt-0.5">
                    Prescription signed by Dr. Sunita Rao • Synced to ABHA Address: <strong className="font-mono text-text-secondary">dpatil@abdm</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  onClick={() => setPrescriptionModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl text-white text-[12.5px] font-bold transition-all shadow-xs flex items-center gap-1.5"
                  style={{ background: 'var(--color-brand)' }}
                >
                  <Printer size={13} />
                  <span>View Prescription</span>
                </button>
                <button
                  onClick={() => router.push('/patient/dashboard')}
                  className="px-3.5 py-2 rounded-xl border text-[12.5px] font-bold transition-all flex items-center gap-1.5 bg-verified-subtle text-verified-text border-verified/30"
                >
                  <Heart size={13} />
                  <span>Patient Portal View →</span>
                </button>
                <button
                  onClick={() => router.push('/doctor/queue')}
                  className="px-3.5 py-2 rounded-xl border text-text-secondary hover:text-text-primary text-[12.5px] font-semibold transition-colors"
                  style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
                >
                  Next Patient
                </button>
              </div>
            </div>

            {/* Prescribed Drugs Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[12.5px]">
              <div className="p-3.5 rounded-xl border bg-surface-subtle space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                  Active Prescriptions (2)
                </span>
                <p className="font-bold text-text-primary">1. Tab. Pantoprazole 40mg (OD × 14d)</p>
                <p className="font-bold text-text-primary">2. Syrup Sucralfate 10ml (TDS × 7d)</p>
              </div>
              <div className="p-3.5 rounded-xl border bg-surface-subtle space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                  ABDM Integration Status
                </span>
                <p className="font-bold text-verified flex items-center gap-1">
                  <CheckCircle2 size={13} /> FHIR DiagnosticReport Published
                </p>
                <p className="text-[11.5px] text-text-muted">HIP ID: IN-MH-PUN-0042</p>
              </div>
              <div className="p-3.5 rounded-xl border bg-surface-subtle space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                  Follow-up &amp; AYUSH Advice
                </span>
                <p className="font-bold text-text-primary">Review in 2 weeks</p>
                <p className="text-[11.5px] text-brand font-medium">Ayush Pitta-pacifying Ahara advised</p>
              </div>
            </div>
          </section>
        )}

        {/* CLINICAL CONCERN / RED FLAG BANNER */}
        {encounterId === 'enc-002' ? (
          <RedFlagBanner alert={DEMO_RED_FLAG_ENC002} />
        ) : (
          <div
            className="border rounded-xl px-4 py-2.5 flex items-center justify-between shadow-xs bg-verified-subtle border-verified/30 text-verified-text"
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck size={16} className="text-verified shrink-0" />
              <p className="text-[12.5px] font-medium">
                <strong className="font-bold">No acute red flags detected</strong> during multilingual voice triage or document OCR ingestion.
              </p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white text-verified-text border border-verified/30">
              Triage Clear
            </span>
          </div>
        )}

        {/* WORKSPACE NAVIGATION TABS (Layer 1: Floating Frosted Rail) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 pb-1">
          <SlidingSegmentedTabs
            options={DOCTOR_EVIDENCE_TABS}
            selectedId={activeTab}
            onChange={(newTab) => setActiveTab(newTab)}
            variant="default"
            layoutId="doctor-evidence-mode-pill"
            ariaLabel="Select Evidence Section"
          />

          <button
            onClick={() => openEvidenceDrawer('fact-001')}
            className="text-[12.5px] font-bold text-[#2365B5] hover:text-[#174A91] hover:underline flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-lg bg-white border border-[#DFE8F1] shadow-2xs transition-all"
          >
            <Search size={13} />
            <span>Open Provenance Drawer</span>
          </button>
        </div>

        {/* ── 3. TAB A: CLINICAL EVIDENCE NARRATIVE & AYUSH WORKSPACE ─── */}
        {activeTab === 'NARRATIVE' && (
          <div className="space-y-6">
            {/* Structured Provenance Fact Grid (Layer 2: Clinical Content Surface) */}
            <section
              className="rounded-2xl p-5 sm:p-6 border shadow-xs space-y-4"
              style={{
                background: 'var(--clinical-surface)',
                borderColor: 'var(--clinical-card-border)',
                boxShadow: '0 2px 8px rgba(41, 87, 135, 0.04)',
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-brand-mist text-brand flex items-center justify-center">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h2 className="text-[16px] font-extrabold text-text-primary tracking-tight">
                      Synthesized Pre-Consultation Evidence
                    </h2>
                    <p className="text-[11.5px] text-text-muted">
                      Source-attributed clinical entities extracted across Marathi Voice Intake, ABDM EHR history, and 3 scanned physical prescriptions.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10.5px] font-mono px-2 py-0.5 rounded bg-surface-subtle text-text-secondary border border-border">
                    4 Facts Verified
                  </span>
                </div>
              </div>

              {/* Grid of Evidence Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* Fact 1: Chief Complaint */}
                <div
                  className="p-4 rounded-xl border bg-surface-subtle space-y-2 cursor-pointer hover:border-brand/40 transition-colors"
                  onClick={() => openEvidenceDrawer('fact-001')}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-text-muted">
                      Chief Complaint
                    </span>
                    <ProvenanceChip tier={3} sourceType="INTERVIEW" confidence={0.94} />
                  </div>
                  <p className="text-[15px] font-bold text-text-primary">
                    Epigastric burning pain &amp; post-prandial indigestion
                  </p>
                  <div className="text-[11.5px] text-text-muted flex items-center justify-between pt-1 border-t border-border/60">
                    <span className="flex items-center gap-1">
                      <Mic size={11} className="text-brand" /> Bhashini Marathi ASR
                    </span>
                    <span className="text-brand font-semibold text-[11px]">Inspect Source →</span>
                  </div>
                </div>

                {/* Fact 2: Duration */}
                <div
                  className="p-4 rounded-xl border bg-surface-subtle space-y-2 cursor-pointer hover:border-brand/40 transition-colors"
                  onClick={() => openEvidenceDrawer('fact-002')}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-text-muted">
                      Symptom Duration &amp; Progression
                    </span>
                    <ProvenanceChip tier={3} sourceType="INTERVIEW" confidence={0.91} />
                  </div>
                  <p className="text-[15px] font-bold text-text-primary">
                    3 months duration (gradually worsening over past 2 weeks)
                  </p>
                  <div className="text-[11.5px] text-text-muted flex items-center justify-between pt-1 border-t border-border/60">
                    <span className="flex items-center gap-1">
                      <Clock size={11} className="text-text-muted" /> Patient Voice &amp; Touch Intake
                    </span>
                    <span className="text-brand font-semibold text-[11px]">Inspect Source →</span>
                  </div>
                </div>

                {/* Fact 3: Aggravating Factors */}
                <div
                  className="p-4 rounded-xl border bg-surface-subtle space-y-2 cursor-pointer hover:border-brand/40 transition-colors"
                  onClick={() => openEvidenceDrawer('fact-003')}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-text-muted">
                      Aggravation &amp; Relieving Factors
                    </span>
                    <ProvenanceChip tier={2} sourceType="DOCUMENT_EXTRACT" confidence={0.88} />
                  </div>
                  <p className="text-[15px] font-bold text-text-primary">
                    Aggravated by empty stomach and spicy foods; partial relief with antacids
                  </p>
                  <div className="text-[11.5px] text-text-muted flex items-center justify-between pt-1 border-t border-border/60">
                    <span className="flex items-center gap-1">
                      <FileText size={11} className="text-verified" /> OCR Scan (Previous Rx 2024)
                    </span>
                    <span className="text-brand font-semibold text-[11px]">Inspect Source →</span>
                  </div>
                </div>

                {/* Fact 4: AYUSH Ahara/Vihara Correlation */}
                <div
                  className="p-4 rounded-xl border bg-surface-subtle space-y-2 cursor-pointer hover:border-brand/40 transition-colors"
                  onClick={() => openEvidenceDrawer('fact-004')}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand">
                      AYUSH Ahara &amp; Vihara Lifestyle Correlation
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-mist text-brand">
                      NAMASTE Portal Synced
                    </span>
                  </div>
                  <p className="text-[15px] font-bold text-text-primary">
                    Pitta-dominant Agnimandya: Irregular meal timings, high Ushna/Tikshna Ahara intake
                  </p>
                  <div className="text-[11.5px] text-text-muted flex items-center justify-between pt-1 border-t border-border/60">
                    <span className="flex items-center gap-1">
                      <Sparkles size={11} className="text-brand" /> AYUSH Intake Domain
                    </span>
                    <span className="text-brand font-semibold text-[11px]">Inspect Protocol →</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Clinical Discrepancy & Conflict Cards if present */}
            {conflicts.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-[14px] font-extrabold uppercase tracking-wider text-critical flex items-center gap-1.5">
                    <AlertTriangle size={15} /> Clinical Discrepancy Detected (1)
                  </h3>
                  <span className="text-[11px] text-text-muted">Physician verification requested</span>
                </div>
                {conflicts.map((conflict) => (
                  <ConflictCard
                    key={conflict.id}
                    conflict={conflict}
                    onResolve={handleResolveConflict}
                  />
                ))}
              </section>
            )}

            {/* Differential Diagnoses & Clinical Evidence Citations */}
            <section
              className="rounded-2xl p-5 sm:p-6 border shadow-xs space-y-4"
              style={{
                background: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <h3 className="text-[15px] font-extrabold text-text-primary flex items-center gap-2">
                  <Stethoscope size={16} className="text-brand" />
                  <span>Differential Diagnoses &amp; Guideline Correlation</span>
                </h3>
                <span className="text-[11px] font-mono text-text-muted">ICD-11 &amp; SNOMED CT</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[12.5px]">
                <div className="p-3.5 rounded-xl border bg-brand-mist/20 border-brand/30 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-text-primary">1. Functional Dyspepsia</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-brand text-white">88% Match</span>
                  </div>
                  <p className="text-[11.5px] text-text-secondary">ICD-11: MD90.0 • Rome IV Diagnostic Criteria satisfied.</p>
                </div>

                <div className="p-3.5 rounded-xl border bg-surface-subtle space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-text-primary">2. Peptic Ulcer Disease</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-surface-subtle text-text-secondary border border-border">42% Match</span>
                  </div>
                  <p className="text-[11.5px] text-text-secondary">ICD-11: DA40 • No melena, hematemesis, or alarm symptoms.</p>
                </div>

                <div className="p-3.5 rounded-xl border bg-surface-subtle space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-text-primary">3. Gastroesophageal Reflux</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-surface-subtle text-text-secondary border border-border">35% Match</span>
                  </div>
                  <p className="text-[11.5px] text-text-secondary">ICD-11: DA22 • Retrosternal burning without dysphagia.</p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ── 4. TAB B: SCANNED DOCUMENTS INSPECTOR ────────────────────── */}
        {activeTab === 'DOCUMENTS' && (
          <section
            className="rounded-2xl p-5 sm:p-6 border shadow-xs space-y-4"
            style={{
              background: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="text-[16px] font-extrabold text-text-primary">
                  Physical Medical Documents ({DEMO_DOCUMENTS_ENC001.length})
                </h3>
                <p className="text-[12px] text-text-muted">
                  Digitized at kiosk OCR station with bounding box entity extraction.
                </p>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-verified-subtle text-verified-text border border-verified/30">
                100% Extraction Verified
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {DEMO_DOCUMENTS_ENC001.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => openEvidenceDrawer('fact-002')}
                  className="p-4 rounded-xl border bg-surface-subtle hover:border-brand transition-all cursor-pointer group flex flex-col justify-between gap-3 shadow-xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-mist text-brand">
                        {doc.documentType.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10.5px] font-mono font-bold text-verified">
                        {Math.round((doc.ocrConfidence || 0.95) * 100)}% OCR
                      </span>
                    </div>
                    <h4 className="text-[14px] font-bold text-text-primary group-hover:text-brand transition-colors">
                      {doc.originalFilename}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-text-muted pt-2 border-t border-border">
                    <span>{doc.extractedFactsCount || 4} entities extracted</span>
                    <span className="text-brand font-bold flex items-center gap-1 group-hover:underline">
                      <span>Inspect Bounding Box</span>
                      <ExternalLink size={11} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 5. TAB C: TIMELINE ───────────────────────────────────────── */}
        {activeTab === 'TIMELINE' && (
          <section
            className="rounded-2xl p-5 sm:p-6 border shadow-xs space-y-4"
            style={{
              background: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div>
              <h3 className="text-[16px] font-extrabold text-text-primary">
                Longitudinal Patient Health Timeline
              </h3>
              <p className="text-[12px] text-text-muted">
                Historical records merged with today&apos;s digital intake stream.
              </p>
            </div>
            <Timeline events={DEMO_TIMELINE_ENC001} />
          </section>
        )}

        {/* ── 6. TAB D: COMPLETENESS GRID ─────────────────────────────── */}
        {activeTab === 'COMPLETENESS' && (
          <section
            className="rounded-2xl p-5 sm:p-6 border shadow-xs space-y-4"
            style={{
              background: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div>
              <h3 className="text-[16px] font-extrabold text-text-primary">
                11-Domain Clinical Intake Completeness Matrix
              </h3>
              <p className="text-[12px] text-text-muted">
                Standardized clinical readiness check before issuing prescription.
              </p>
            </div>
            <CompletenessGrid entries={DEMO_COMPLETENESS_ENC001} />
          </section>
        )}

        {/* ── 7. PHYSICIAN DECISION CONSOLE (ALWAYS VISIBLE AT BOTTOM) ─── */}
        <section
          className="rounded-2xl p-5 sm:p-6 border-2 shadow-sm space-y-4"
          style={{
            background: 'var(--color-surface)',
            borderColor: 'var(--color-border-strong)',
          }}
        >
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-mist text-brand flex items-center justify-center">
                <Edit3 size={16} />
              </div>
              <div>
                <h3 className="text-[15px] font-extrabold text-text-primary">
                  Physician Examination &amp; Final Rx Orders
                </h3>
                <p className="text-[11.5px] text-text-muted">
                  Enter physical findings, confirm verification, and emit digital FHIR prescription.
                </p>
              </div>
            </div>
            <span className="text-[10.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-mist text-brand border border-border-strong">
              Physician Station #04
            </span>
          </div>

          {/* Physical Examination Textarea */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider block mb-1.5 text-text-secondary">
              Physical Examination &amp; Clinical Decision Notes
            </label>
            <textarea
              value={physicianNotes}
              onChange={(e) => setPhysicianNotes(e.target.value)}
              placeholder="Enter abdomen palpation findings, differential assessment, or patient counselling instructions..."
              className="w-full h-24 text-[13px] p-3 rounded-xl border focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand resize-none transition-all"
              style={{
                background: 'var(--color-surface-subtle)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
            />
          </div>

          {/* Action Bar */}
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
                'w-full sm:w-auto px-4 py-2 rounded-xl border text-[12.5px] font-bold transition-all flex items-center justify-center gap-2 active:scale-98'
              )}
              style={{
                background: isIntakeVerified ? 'var(--color-verified-subtle)' : 'var(--color-surface-subtle)',
                borderColor: isIntakeVerified ? 'var(--color-verified-subtle)' : 'var(--color-border)',
                color: isIntakeVerified ? 'var(--color-verified-text)' : 'var(--color-text-primary)',
              }}
            >
              <CheckCircle2 size={15} className={isIntakeVerified ? 'text-verified' : 'text-text-muted'} />
              <span>{isIntakeVerified ? 'Intake Verified by Physician ✓' : 'Mark Intake Verified'}</span>
            </button>

            <button
              onClick={handleCompleteEncounter}
              className="w-full sm:w-auto px-5 py-2 rounded-xl text-white text-[13px] font-bold transition-all shadow-xs flex items-center justify-center gap-2 active:scale-98 hover:opacity-90"
              style={{ background: 'var(--color-brand)' }}
            >
              <span>Finalize Consultation &amp; Sync to ABDM</span>
              <ChevronRight size={15} />
            </button>
          </div>
        </section>
      </main>

      {/* ── 8. PRESCRIPTION PRINT & EHR VIEW MODAL ───────────────────── */}
      {prescriptionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="w-full max-w-2xl rounded-2xl p-6 sm:p-8 border shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            style={{
              background: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl text-white flex items-center justify-center font-bold text-[18px]"
                  style={{ background: 'var(--color-brand)' }}
                >
                  V
                </div>
                <div>
                  <h3 className="text-[17px] font-extrabold text-text-primary">
                    Hospital OPD Electronic Prescription
                  </h3>
                  <p className="text-[11.5px] text-text-muted">
                    Dept. of Internal Medicine • Room 104 • ABHA Health Locker Integration
                  </p>
                </div>
              </div>

              <button
                onClick={() => setPrescriptionModalOpen(false)}
                className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-subtle"
              >
                <X size={17} />
              </button>
            </div>

            {/* Patient & Physician Grid */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl border bg-surface-subtle text-[12.5px]">
              <div>
                <p className="text-text-muted text-[10.5px] font-bold uppercase">Patient</p>
                <p className="font-bold text-text-primary">{patient?.name || 'Dhananjay Patil'}</p>
                <p className="text-text-secondary">{patient?.age || 67}Y • Token {encounter?.tokenNumber || 'A-028'}</p>
                <p className="font-mono text-brand text-[11px]">ABHA: 12-3456-7890-1234</p>
              </div>

              <div className="text-right">
                <p className="text-text-muted text-[10.5px] font-bold uppercase">Prescriber</p>
                <p className="font-bold text-text-primary">Dr. Sunita Rao, MD</p>
                <p className="text-text-secondary">Reg. No: MMC-2012-48291</p>
                <p className="text-verified text-[11px] font-bold">Date: Today</p>
              </div>
            </div>

            {/* Rx Medications */}
            <div className="space-y-2.5">
              <h4 className="text-[13.5px] font-extrabold text-text-primary flex items-center gap-1.5">
                <span className="font-serif italic text-brand text-[17px]">℞</span>
                <span>Prescribed Medications (2)</span>
              </h4>

              <div className="space-y-2">
                <div className="p-3 rounded-xl border bg-surface flex items-center justify-between text-[12.5px]">
                  <div>
                    <p className="font-bold text-text-primary">1. Tab. Pantoprazole 40 mg</p>
                    <p className="text-[11.5px] text-text-secondary">1 Tab • Once daily before breakfast (OD) • 14 days</p>
                  </div>
                  <span className="text-[10.5px] font-bold px-2 py-0.5 rounded bg-brand-mist text-brand">
                    Oral
                  </span>
                </div>

                <div className="p-3 rounded-xl border bg-surface flex items-center justify-between text-[12.5px]">
                  <div>
                    <p className="font-bold text-text-primary">2. Syrup Sucralfate 10 ml</p>
                    <p className="text-[11.5px] text-text-secondary">2 tsp • Three times daily after meals (TDS) • 7 days</p>
                  </div>
                  <span className="text-[10.5px] font-bold px-2 py-0.5 rounded bg-brand-mist text-brand">
                    Oral
                  </span>
                </div>
              </div>
            </div>

            {/* Diagnosis & Lifestyle */}
            <div className="p-3.5 rounded-xl border bg-surface-subtle space-y-1 text-[12.5px]">
              <p className="text-[10.5px] font-bold uppercase tracking-wider text-text-muted">Clinical Diagnosis</p>
              <p className="font-bold text-text-primary">Chronic Acid Peptic Disease / Dyspepsia (Physician Verified)</p>
              <p className="text-[11.5px] text-text-secondary">Advice: Avoid oily, excessively spicy foods. Elevate head of bed. Follow up in 2 weeks.</p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-text-muted flex items-center gap-1">
                <ShieldCheck size={13} className="text-verified" />
                <span>Digitally signed via ABDM Bridge</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl text-white text-[12.5px] font-bold transition-all flex items-center gap-1.5 shadow-xs"
                  style={{ background: 'var(--color-brand)' }}
                >
                  <Printer size={13} />
                  <span>Print Prescription</span>
                </button>
                <button
                  onClick={() => setPrescriptionModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-text-secondary hover:text-text-primary text-[12.5px] font-semibold"
                  style={{ borderColor: 'var(--color-border)' }}
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
