'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowRight,
  ShieldCheck,
  FileSearch,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Languages,
  Mic,
} from 'lucide-react'
import VaidyaWordmark from '@/components/ui/VaidyaWordmark'
import type { Screen } from '@/types'
import { cn } from '@/lib/utils'

interface WelcomeProps {
  onNavigate?: (screen: Screen) => void
}

// ── Step definitions for Section 02 (Product In Motion) ──
interface MotionStep {
  id: string
  num: string
  title: string
  stageName: string
  description: string
  rawSpeech: string
  language: string
  extractedFacts: string[]
  ocrDetail: string
  triageSeverity: 'T1 CRITICAL' | 'T2 URGENT' | 'T3 ROUTINE'
  physicianSynthesis: string
}

const MOTION_STEPS: MotionStep[] = [
  {
    id: 'step-speech',
    num: '01',
    title: 'Patient Speaks',
    stageName: 'Ambient Voice Capture',
    description: 'Patient speaks naturally in Marathi at the waiting hall kiosk.',
    rawSpeech: '"माझ्या छातीत दोन तासांपासून तीव्र दुखत आहे आणि ते दुखणे डाव्या हाताकडे आणि जबड्याकडे पसरत आहे..."',
    language: 'Marathi (मराठी) · Bhashini ASR',
    extractedFacts: ['Retrosternal Chest Pain (Duration: 2h)', 'Radiation to Left Arm & Jaw', 'Associated Diaphoresis'],
    ocrDetail: 'Prior Discharge Summary: Metformin 500mg, Atorvastatin 20mg',
    triageSeverity: 'T1 CRITICAL',
    physicianSynthesis: 'Acute Coronary Syndrome (ACS) workup indicated. Immediate 12-lead ECG dispatched.',
  },
  {
    id: 'step-ocr',
    num: '02',
    title: 'Documents Scanned',
    stageName: 'Optical Clinical Provenance',
    description: 'Paper prescription and hospital discharge slip digitized with optical bounding boxes.',
    rawSpeech: '"मागील आठवड्यात डॉक्टरांनी दिलेली औषधांची चिठ्ठी इथे स्कॅन केली."',
    language: 'Hindi & Marathi Bilingual Optical OCR',
    extractedFacts: ['Known Type 2 Diabetes Mellitus (HbA1c 7.8%)', 'Hypertension stage 1', 'No documented penicillin allergy'],
    ocrDetail: 'Optical Bounding Box: Dr. R. Verma OPD Slip · 08-Sep-2026',
    triageSeverity: 'T2 URGENT',
    physicianSynthesis: 'Baseline metabolic risk factors validated with primary hospital records.',
  },
  {
    id: 'step-triage',
    num: '03',
    title: 'Triage Flags Triggered',
    stageName: 'Deterministic Safety Rule Engine',
    description: 'Protocol rules detect acute cardiac trajectory and alert nursing station in under 400ms.',
    rawSpeech: '"मला खूप घाम येत आहे आणि चक्कर येत आहे..."',
    language: 'Real-time Symptom Ingestion',
    extractedFacts: ['Severe Diaphoresis', 'Pre-syncopal Episode', 'Heart Rate 104 bpm · BP 150/95'],
    ocrDetail: 'Rule Trigger: #CARD-01 (Chest Pain + Radiation + Diaphoresis)',
    triageSeverity: 'T1 CRITICAL',
    physicianSynthesis: 'Emergency bypass triggered: Direct escalation to Priority Bay #01.',
  },
  {
    id: 'step-brief',
    num: '04',
    title: 'Physician Brief Assembled',
    stageName: 'Clinician-Ready 30-Second Summary',
    description: 'Physician enters the room with complete structured context, provenance, and timeline.',
    rawSpeech: 'Full multivariable dialogue synthesized into ICD-10 & SNOMED CT clinical brief.',
    language: 'Synthesized Clinical Standard (ABDM FHIR R4)',
    extractedFacts: ['Suspected Acute Inferior Wall STEMI', 'Risk: HTN + T2DM', 'Zero Black-box Hallucinations'],
    ocrDetail: '100% Provenance Linkage: Spoken audio clip + Scanned paper clip',
    triageSeverity: 'T1 CRITICAL',
    physicianSynthesis: 'Physician begins with informed differential, saving 8.5 minutes of repetitive questioning.',
  },
]

// ── Journey Nodes for Section 03 ──
const JOURNEY_NODES = [
  { step: 'ARRIVE', title: 'Waiting Hall Arrival', sub: 'Patient walks to multilingual kiosk terminal without queue delay' },
  { step: 'SPEAK', title: 'Natural Speech', sub: 'Comfortable conversation in 6 regional languages via Bhashini' },
  { step: 'CAPTURE', title: 'Paper Scanning', sub: 'Camera scans past prescriptions, lab slips, and discharge notes' },
  { step: 'UNDERSTAND', title: 'Entity Extraction', sub: 'Medical facts normalized into clinical concepts' },
  { step: 'TRIAGE', title: 'Emergency Flagging', sub: 'Nursing desk receives instant red-flag alerts for critical cases' },
  { step: 'CONSULT', title: 'Physician Brief', sub: 'Doctor reviews evidence brief before calling the patient in' },
]

export default function Welcome({ onNavigate }: WelcomeProps) {
  const router = useRouter()
  const [activeMotionStep, setActiveMotionStep] = useState<number>(0)
  const [selectedProductView, setSelectedProductView] = useState<'kiosk' | 'nursing' | 'physician'>('physician')

  const handleStartIntake = () => {
    if (onNavigate) {
      onNavigate('patient-intake')
    } else {
      router.push('/kiosk')
    }
  }

  const handleStaffLogin = () => {
    router.push('/auth/login')
  }

  const currentStep = MOTION_STEPS[activeMotionStep]

  return (
    <div className="min-h-screen bg-canvas-atmospheric text-ink selection:bg-pastel-blue selection:text-ink antialiased">
      
      {/* ── Top Header Navigation ──────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <VaidyaWordmark size="md" showDescriptor={true} variant="default" />
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6 text-[13px] font-semibold text-text-secondary">
            <a href="#how-it-works" className="hover:text-ink transition-colors">
              How It Works
            </a>
            <a href="#journey" className="hover:text-ink transition-colors">
              Patient Journey
            </a>
            <a href="#product" className="hover:text-ink transition-colors">
              Product Workspaces
            </a>
            <a href="#evidence" className="hover:text-ink transition-colors">
              Clinical Evidence
            </a>
            <a href="#ecosystem" className="hover:text-ink transition-colors">
              ABDM &amp; Ecosystem
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleStaffLogin}
              className="px-3.5 py-1.5 rounded-lg border border-border bg-white text-ink text-[12.5px] font-bold hover:bg-surface-subtle transition-all cursor-pointer shadow-2xs"
            >
              Staff Workspace
            </button>
            <button
              onClick={handleStartIntake}
              className="px-4 py-1.5 rounded-lg bg-brand text-white text-[12.5px] font-bold hover:bg-brand-dim transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span>Begin Intake</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 01 — OPENING (Hero with Signature Clinical Visual)
      ════════════════════════════════════════════════════════════════ */}
      <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Narrative Column (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-border shadow-2xs text-[12px] font-bold text-text-secondary">
                <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                <span>MULTILINGUAL PRE-CONSULTATION INTELLIGENCE</span>
              </div>

              <h1 className="text-[36px] sm:text-[46px] lg:text-[52px] font-extrabold text-ink tracking-tight leading-[1.12]">
                Every consultation starts before the doctor enters the room.
              </h1>

              <p className="text-[16px] sm:text-[17px] text-text-secondary leading-relaxed max-w-xl">
                VAIDYA captures the patient&apos;s story, documents, and vital signals before the consultation — so clinicians begin with context, not repetition.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  onClick={handleStartIntake}
                  className="h-12 px-6 rounded-xl bg-brand text-white text-[14px] font-bold flex items-center gap-2 hover:bg-brand-dim transition-all shadow-sm cursor-pointer active:scale-98"
                >
                  <span>Begin Patient Intake</span>
                  <ArrowRight size={16} />
                </button>

                <a
                  href="#how-it-works"
                  className="h-12 px-5 rounded-xl border border-border bg-white text-ink text-[13.5px] font-bold flex items-center justify-center gap-2 hover:bg-surface-subtle transition-colors shadow-2xs"
                >
                  <span>See How VAIDYA Works</span>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-border/80 flex flex-wrap items-center gap-y-2 gap-x-6 text-[12px] text-text-secondary">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={15} className="text-verified" />
                  <span>ABDM FHIR R4 Ready</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Languages size={15} className="text-brand" />
                  <span>6 Indic Languages</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-verified" />
                  <span>Zero Black-Box Hallucinations</span>
                </div>
              </div>
            </div>

            {/* Right Signature Clinical Scene Visual (6 cols) */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl bg-white/95 border border-border-strong shadow-md p-5 sm:p-6 space-y-4">
                
                {/* Visual Header */}
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-verified animate-pulse" />
                    <span className="text-[11.5px] font-bold text-ink uppercase tracking-wider">
                      Live Pre-Consultation Synthesis
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-text-muted">
                    Station #04 · Triage T1
                  </span>
                </div>

                {/* Ambient Speech Waveform Fragment */}
                <div className="p-3.5 rounded-xl bg-pastel-blue/30 border border-pastel-blue flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-brand text-white flex items-center justify-center shrink-0">
                      <Mic size={15} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand block">
                        Patient Spoken Dialogue (Marathi)
                      </span>
                      <p className="text-[12.5px] font-medium text-ink italic truncate">
                        &quot;छातीत तीव्र दुखत आहे आणि ते दुखणे डाव्या हाताकडे जात आहे...&quot;
                      </p>
                    </div>
                  </div>
                  <div className="flex items-end gap-1 h-5 shrink-0 px-2">
                    <span className="w-1 bg-brand h-2 animate-pulse rounded-full" />
                    <span className="w-1 bg-brand h-5 animate-pulse rounded-full" />
                    <span className="w-1 bg-brand h-3 animate-pulse rounded-full" />
                    <span className="w-1 bg-brand h-4 animate-pulse rounded-full" />
                  </div>
                </div>

                {/* Optical Evidence Document Crop Fragment */}
                <div className="p-3.5 rounded-xl bg-pastel-lavender/30 border border-pastel-lavender flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#5925DC] text-white flex items-center justify-center shrink-0">
                      <FileSearch size={15} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#5925DC] block">
                        Optical OCR Extraction · Verified Prescription
                      </span>
                      <p className="text-[12px] font-mono text-ink truncate">
                        Tab. Metformin 500mg BD · Dr. R. Verma OPD
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-verified text-white shrink-0">
                    98.4% Match
                  </span>
                </div>

                {/* Physician Brief Ready Panel */}
                <div className="p-4 rounded-xl bg-surface-subtle border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                      Physician Differential Brief
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-critical text-white">
                      T1 High Priority
                    </span>
                  </div>
                  <h4 className="text-[14px] font-bold text-ink">
                    Priya Menon, 52F · Suspected Acute Coronary Syndrome
                  </h4>
                  <p className="text-[12px] text-text-secondary leading-snug">
                    Spoken chest discomfort radiating to left arm + scanned history of T2DM. 12-lead ECG and emergency bed allocated.
                  </p>
                </div>

                {/* Doctor Decision Bar */}
                <div className="pt-2 flex items-center justify-between text-[11.5px] text-text-secondary">
                  <span>Clinician: <strong>Dr. Sunita Rao, MD</strong></span>
                  <span className="text-brand font-bold">Ready for Consultation →</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 02 — PRODUCT IN MOTION (Interactive Journey Canvas)
      ════════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-20 border-t border-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="max-w-3xl space-y-3">
            <span className="text-[11.5px] font-bold uppercase tracking-wider text-brand">
              02 · Product In Motion
            </span>
            <h2 className="text-[28px] sm:text-[36px] font-extrabold text-ink tracking-tight">
              Watch how raw patient dialogue transforms into clinical intelligence.
            </h2>
            <p className="text-[15px] text-text-secondary leading-relaxed">
              Step through the pre-consultation sequence. Each stage occurs automatically while the patient is in the waiting area.
            </p>
          </div>

          {/* Step Selector Navigation (Non-pill underline/border tabs) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 border-b border-border pb-4">
            {MOTION_STEPS.map((st, idx) => (
              <button
                key={st.id}
                onClick={() => setActiveMotionStep(idx)}
                className={cn(
                  'text-left p-3.5 rounded-xl border transition-all cursor-pointer relative',
                  activeMotionStep === idx
                    ? 'bg-pastel-blue/30 border-brand text-ink shadow-2xs'
                    : 'bg-white border-border text-text-secondary hover:border-border-strong hover:text-ink'
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-mono font-bold text-brand">{st.num}</span>
                  {activeMotionStep === idx && (
                    <span className="w-2 h-2 rounded-full bg-brand" />
                  )}
                </div>
                <h3 className="text-[13.5px] font-bold text-ink">{st.title}</h3>
                <p className="text-[11.5px] text-text-secondary truncate mt-0.5">{st.stageName}</p>
              </button>
            ))}
          </div>

          {/* Interactive Demonstration Surface */}
          <div className="rounded-2xl border border-border-strong bg-canvas p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-xs">
            
            {/* Left Context & Inputs (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              <div>
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-brand font-mono">
                  STAGE {currentStep.num} · {currentStep.stageName.toUpperCase()}
                </span>
                <h3 className="text-[22px] font-bold text-ink mt-1">
                  {currentStep.title}
                </h3>
                <p className="text-[13.5px] text-text-secondary mt-1 leading-relaxed">
                  {currentStep.description}
                </p>
              </div>

              {/* Patient Input Voice Card */}
              <div className="p-4 rounded-xl bg-white border border-border space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-text-muted">
                  <span>SPOKEN PATIENT INPUT</span>
                  <span className="font-mono text-brand">{currentStep.language}</span>
                </div>
                <p className="text-[13px] font-medium text-ink italic leading-relaxed">
                  {currentStep.rawSpeech}
                </p>
              </div>

              {/* Provenance Metadata */}
              <div className="flex items-center gap-3 text-[12px] text-text-secondary pt-1">
                <ShieldCheck size={15} className="text-verified shrink-0" />
                <span>Cryptographic provenance attached to hospital EHR</span>
              </div>
            </div>

            {/* Right Output Transformation Card (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-5 rounded-xl bg-white border border-border-strong shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <span className="text-[12px] font-bold text-ink uppercase tracking-wider">
                    Structured Extraction Matrix
                  </span>
                  <span
                    className={cn(
                      'px-2.5 py-0.5 rounded text-[10.5px] font-bold text-white',
                      currentStep.triageSeverity === 'T1 CRITICAL' ? 'bg-critical' : 'bg-warning'
                    )}
                  >
                    {currentStep.triageSeverity}
                  </span>
                </div>

                {/* Extracted Facts */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                    Normalized Clinical Entities
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentStep.extractedFacts.map((fact, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-lg bg-surface-subtle border border-border text-[12px] font-medium text-ink flex items-center gap-2"
                      >
                        <Check size={13} className="text-verified shrink-0" />
                        <span className="truncate">{fact}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Optical OCR Detail */}
                <div className="p-3 rounded-lg bg-pastel-mint/30 border border-pastel-mint">
                  <span className="text-[10.5px] font-bold text-verified-text uppercase tracking-wider block">
                    Optical Document Scan Provenance
                  </span>
                  <p className="text-[12px] text-ink font-mono mt-0.5">
                    {currentStep.ocrDetail}
                  </p>
                </div>

                {/* Physician Output Result */}
                <div className="p-3.5 rounded-lg bg-surface-subtle border border-border">
                  <span className="text-[10.5px] font-bold text-text-muted uppercase tracking-wider block">
                    Clinician Synthesis
                  </span>
                  <p className="text-[12.5px] font-bold text-ink mt-0.5">
                    {currentStep.physicianSynthesis}
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 03 — THE PATIENT JOURNEY (Horizontal Editorial Flow)
      ════════════════════════════════════════════════════════════════ */}
      <section id="journey" className="py-20 border-t border-border bg-canvas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="max-w-2xl space-y-3">
            <span className="text-[11.5px] font-bold uppercase tracking-wider text-brand">
              03 · The Patient Journey
            </span>
            <h2 className="text-[28px] sm:text-[36px] font-extrabold text-ink tracking-tight">
              A smooth 6-stage outpatient journey from entry to consultation.
            </h2>
          </div>

          {/* Non-card curved horizontal timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 relative">
            {JOURNEY_NODES.map((node, i) => (
              <div key={node.step} className="space-y-3 relative">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-white border border-border-strong text-ink text-[11px] font-bold flex items-center justify-center shadow-2xs font-mono">
                    0{i + 1}
                  </span>
                  <span className="text-[11.5px] font-bold uppercase tracking-wider text-brand">
                    {node.step}
                  </span>
                </div>
                <h4 className="text-[14.5px] font-bold text-ink">
                  {node.title}
                </h4>
                <p className="text-[12.5px] text-text-secondary leading-snug">
                  {node.sub}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 04 — SHOW THE ACTUAL PRODUCT (Cropped Perspectives)
      ════════════════════════════════════════════════════════════════ */}
      <section id="product" className="py-20 border-t border-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <span className="text-[11.5px] font-bold uppercase tracking-wider text-brand">
                04 · Purpose-Built Interfaces
              </span>
              <h2 className="text-[28px] sm:text-[36px] font-extrabold text-ink tracking-tight">
                Designed for clinical speed, operational clarity, and patient ease.
              </h2>
            </div>

            {/* View Selector (Non-pill segmented control) */}
            <div className="inline-flex p-1 bg-surface-subtle rounded-xl border border-border">
              <button
                onClick={() => setSelectedProductView('physician')}
                className={cn(
                  'px-4 py-2 rounded-lg text-[12.5px] font-bold transition-all cursor-pointer',
                  selectedProductView === 'physician'
                    ? 'bg-white text-ink shadow-2xs'
                    : 'text-text-secondary hover:text-ink'
                )}
              >
                Physician OPD Brief
              </button>
              <button
                onClick={() => setSelectedProductView('nursing')}
                className={cn(
                  'px-4 py-2 rounded-lg text-[12.5px] font-bold transition-all cursor-pointer',
                  selectedProductView === 'nursing'
                    ? 'bg-white text-ink shadow-2xs'
                    : 'text-text-secondary hover:text-ink'
                )}
              >
                Nursing Triage Desk
              </button>
              <button
                onClick={() => setSelectedProductView('kiosk')}
                className={cn(
                  'px-4 py-2 rounded-lg text-[12.5px] font-bold transition-all cursor-pointer',
                  selectedProductView === 'kiosk'
                    ? 'bg-white text-ink shadow-2xs'
                    : 'text-text-secondary hover:text-ink'
                )}
              >
                Patient Touch &amp; Voice Kiosk
              </button>
            </div>
          </div>

          {/* Product View Display */}
          <div className="rounded-2xl border border-border-strong bg-canvas p-6 sm:p-8 shadow-xs">
            {selectedProductView === 'physician' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand block">
                      Physician OPD Workspace · Room 12
                    </span>
                    <h3 className="text-[20px] font-bold text-ink">
                      Synthesized Pre-Consultation Evidence Review
                    </h3>
                  </div>
                  <button
                    onClick={handleStaffLogin}
                    className="px-3.5 py-1.5 rounded-lg bg-brand text-white text-[12px] font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <span>Open Doctor Queue</span>
                    <ArrowUpRight size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-white border border-border space-y-2">
                    <span className="text-[10.5px] font-bold text-text-muted uppercase tracking-wider">Chief Complaint</span>
                    <p className="text-[13px] font-bold text-ink">Retrosternal chest pressure with arm radiation (2h onset)</p>
                    <span className="text-[11px] text-critical font-bold">T1 Critical Alert Acknowledged</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-border space-y-2">
                    <span className="text-[10.5px] font-bold text-text-muted uppercase tracking-wider">OCR Verified History</span>
                    <p className="text-[13px] font-bold text-ink">T2DM (Metformin 500mg BD), HTN stage 1</p>
                    <span className="text-[11px] text-verified font-bold">Scanned Paper Slip Match 98%</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-border space-y-2">
                    <span className="text-[10.5px] font-bold text-text-muted uppercase tracking-wider">Differential Focus</span>
                    <p className="text-[13px] font-bold text-ink">Acute Coronary Syndrome vs. Angina Pectoris</p>
                    <span className="text-[11px] text-brand font-bold">12-Lead ECG Ordered</span>
                  </div>
                </div>
              </div>
            )}

            {selectedProductView === 'nursing' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-warning block">
                      Nursing Triage Operations · Intake Desk 01
                    </span>
                    <h3 className="text-[20px] font-bold text-ink">
                      Emergency Alert Stream &amp; Queue Management
                    </h3>
                  </div>
                  <button
                    onClick={handleStaffLogin}
                    className="px-3.5 py-1.5 rounded-lg bg-warning text-white text-[12px] font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <span>Open Triage Station</span>
                    <ArrowUpRight size={14} />
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-white border border-critical/40 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-critical text-white">T1 CRITICAL</span>
                      <span className="text-[14px] font-bold text-ink">Priya Menon, 52F (Token #28)</span>
                    </div>
                    <p className="text-[12.5px] text-text-secondary">
                      Severe chest pain radiating to left arm · SpO2 94% · Pulse 104 bpm · Diaphoretic
                    </p>
                  </div>
                  <span className="px-3 py-1.5 rounded-lg bg-pastel-peach text-ink font-bold text-[12px] border border-border shrink-0">
                    Escalated to Bay 01
                  </span>
                </div>
              </div>
            )}

            {selectedProductView === 'kiosk' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-verified block">
                      Outpatient Kiosk Station #01
                    </span>
                    <h3 className="text-[20px] font-bold text-ink">
                      Patient Self-Intake in 6 Regional Indic Languages
                    </h3>
                  </div>
                  <button
                    onClick={handleStartIntake}
                    className="px-3.5 py-1.5 rounded-lg bg-verified text-white text-[12px] font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <span>Launch Live Kiosk</span>
                    <ArrowUpRight size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-center">
                  {['English', 'हिन्दी', 'मराठी', 'ગુજરાતી', 'বাংলা', 'தமிழ்'].map((l) => (
                    <div key={l} className="p-3 rounded-xl bg-white border border-border text-[13px] font-bold text-ink shadow-2xs">
                      {l}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 05 — CLINICAL EVIDENCE TRANSFORMATION DIAGRAM
      ════════════════════════════════════════════════════════════════ */}
      <section id="evidence" className="py-20 border-t border-border bg-canvas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="max-w-2xl space-y-3">
            <span className="text-[11.5px] font-bold uppercase tracking-wider text-brand">
              05 · Clinical Evidence
            </span>
            <h2 className="text-[28px] sm:text-[36px] font-extrabold text-ink tracking-tight">
              From messy spoken words to structured medical intelligence.
            </h2>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
              
              <div className="p-4 rounded-xl bg-surface-subtle border border-border space-y-1">
                <span className="text-[10px] font-bold text-text-muted uppercase">1. Patient Speech</span>
                <p className="text-[12.5px] font-medium text-ink italic">&quot;Pain goes to my left arm and jaw...&quot;</p>
              </div>

              <div className="text-center font-mono text-text-muted font-bold text-[14px]">→</div>

              <div className="p-4 rounded-xl bg-surface-subtle border border-border space-y-1">
                <span className="text-[10px] font-bold text-text-muted uppercase">2. Entity Extraction</span>
                <p className="text-[12.5px] font-bold text-brand">Retrosternal Chest Pain with Radiation</p>
              </div>

              <div className="text-center font-mono text-text-muted font-bold text-[14px]">→</div>

              <div className="p-4 rounded-xl bg-surface-subtle border border-border space-y-1">
                <span className="text-[10px] font-bold text-text-muted uppercase">3. Triage &amp; Evidence</span>
                <p className="text-[12.5px] font-bold text-critical">T1 Critical Escalation + Physician Brief</p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 06 — HUMAN + AI BOUNDARY
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-20 border-t border-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="max-w-2xl space-y-3">
            <span className="text-[11.5px] font-bold uppercase tracking-wider text-brand">
              06 · Clinical Safety
            </span>
            <h2 className="text-[28px] sm:text-[36px] font-extrabold text-ink tracking-tight">
              Strict Human-in-the-Loop Clinical Boundaries.
            </h2>
            <p className="text-[15px] text-text-secondary leading-relaxed">
              VAIDYA assists with intake and organization. All medical diagnoses and prescriptions remain solely in physician control.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl bg-surface-subtle border border-border space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-brand" />
                <h3 className="text-[16px] font-bold text-ink">What AI Does</h3>
              </div>
              <ul className="space-y-2.5 text-[13px] text-text-secondary">
                <li className="flex items-center gap-2"><Check size={14} className="text-brand shrink-0" /> Captures multilingual audio in 6 regional languages</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-brand shrink-0" /> Digitizes past prescriptions and lab reports via OCR</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-brand shrink-0" /> Normalizes symptoms into clinical entity concepts</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-brand shrink-0" /> Triggers deterministic red-flag triage rules</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-surface-subtle border border-border space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-verified" />
                <h3 className="text-[16px] font-bold text-ink">What Clinicians Do</h3>
              </div>
              <ul className="space-y-2.5 text-[13px] text-text-secondary">
                <li className="flex items-center gap-2"><Check size={14} className="text-verified shrink-0" /> Interprets findings and cross-examines patient</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-verified shrink-0" /> Confirms or rejects AI pre-consultation findings</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-verified shrink-0" /> Makes absolute diagnostic and treatment decisions</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-verified shrink-0" /> Signs and cryptographically authorizes prescriptions</li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 07 — ECOSYSTEM ARCHITECTURE MAP
      ════════════════════════════════════════════════════════════════ */}
      <section id="ecosystem" className="py-20 border-t border-border bg-canvas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="max-w-2xl space-y-3">
            <span className="text-[11.5px] font-bold uppercase tracking-wider text-brand">
              07 · Ecosystem Architecture
            </span>
            <h2 className="text-[28px] sm:text-[36px] font-extrabold text-ink tracking-tight">
              Standard-compliant digital healthcare infrastructure.
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-white border border-border space-y-2 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand block">ABDM &amp; FHIR R4</span>
              <h4 className="text-[14px] font-bold text-ink">Ayushman Bharat Ready</h4>
              <p className="text-[12px] text-text-secondary leading-snug">Standardized health record exchange protocols.</p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-border space-y-2 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand block">Bhashini ASR</span>
              <h4 className="text-[14px] font-bold text-ink">Indic Speech Engine</h4>
              <p className="text-[12px] text-text-secondary leading-snug">Real-time dialect speech recognition for OPDs.</p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-border space-y-2 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand block">Vision OCR</span>
              <h4 className="text-[14px] font-bold text-ink">Optical Provenance</h4>
              <p className="text-[12px] text-text-secondary leading-snug">Direct crop bounding boxes with 100% trace.</p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-border space-y-2 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand block">AYUSH Module</span>
              <h4 className="text-[14px] font-bold text-ink">Integrative Care</h4>
              <p className="text-[12px] text-text-secondary leading-snug">Prakriti assessment and NAMASTE ontology.</p>
            </div>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 08 — FINAL CTA & FOOTER
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-24 border-t border-border bg-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-[32px] sm:text-[42px] font-extrabold text-ink tracking-tight">
            Give clinicians the story before the consultation.
          </h2>
          <p className="text-[16px] text-text-secondary max-w-xl mx-auto">
            Experience the automated pre-consultation intelligence platform for high-density outpatient departments.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={handleStartIntake}
              className="h-12 px-7 rounded-xl bg-brand text-white text-[14px] font-bold flex items-center gap-2 hover:bg-brand-dim transition-all shadow-sm cursor-pointer active:scale-98"
            >
              <span>Begin Patient Intake</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={handleStaffLogin}
              className="h-12 px-6 rounded-xl border border-border bg-white text-ink text-[13.5px] font-bold flex items-center gap-2 hover:bg-surface-subtle transition-colors shadow-2xs cursor-pointer"
            >
              <span>Staff Workspace</span>
            </button>
          </div>
        </div>
      </section>

      {/* Institutional Footer */}
      <footer className="border-t border-border bg-canvas py-8 text-center text-[12px] text-text-muted">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <VaidyaWordmark size="sm" showDescriptor={false} />
            <span>· Clinical Intelligence Platform</span>
          </div>
          <div>
            All Patient Intake Data Encrypted · Smart India Hackathon 2026
          </div>
        </div>
      </footer>

    </div>
  )
}
