'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  AlertTriangle,
  HeartPulse,
  Mic,
  CheckCircle2,
  Thermometer,
  Activity,
  ArrowLeft,
} from 'lucide-react'
import { useUIStore } from '@/store'
import { cn } from '@/lib/utils'

export default function NursingAlertPage() {
  const router = useRouter()
  const { addToast } = useUIStore()
  const [selectedAction, setSelectedAction] = useState<'escalate' | 'monitor' | 'opd'>('escalate')
  const [notes, setNotes] = useState('')

  const handleConfirmAssessment = () => {
    addToast({
      type: 'success',
      title: 'Triage Decision Confirmed',
      body: `Priority set to ${selectedAction.toUpperCase()} for Priya Menon (Token #23).`,
    })
    router.push('/nursing/alerts/enc-002/confirm')
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* ── Breadcrumb & Title ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/nursing/dashboard"
              className="text-[12px] font-medium text-text-secondary hover:text-text-primary flex items-center gap-1"
            >
              <ArrowLeft size={13} /> Back to Triage Queue
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-[22px] font-bold text-text-primary tracking-tight">
              Triage Alert Assessment
            </h1>
            <span
              className="text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1"
              style={{
                background: 'var(--color-critical-subtle)',
                color: 'var(--color-critical-text)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-critical animate-pulse" />
              Critical T1 Alert
            </span>
          </div>
        </div>

        {/* Patient Token Pill */}
        <div
          className="p-3 rounded-xl flex items-center gap-3 shrink-0"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[13px]"
            style={{
              background: 'var(--color-critical)',
              color: '#FFFFFF',
            }}
          >
            PM
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[14px] text-text-primary">Priya Menon</span>
              <span className="text-[12px] text-text-secondary">42F</span>
              <span className="font-mono font-bold text-[11px] px-1.5 py-0.2 rounded bg-surface-subtle border border-border">
                Token #23
              </span>
            </div>
            <p className="text-[11.5px] text-text-muted">MRN: VAID-892-441-A • Arrived: 10:35 AM</p>
          </div>
        </div>
      </div>

      {/* ── Main 2-Column Grid ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Alert Details & Verbatim Evidence */}
        <div className="lg:col-span-8 space-y-5">
          {/* Critical Banner */}
          <div
            className="p-5 rounded-2xl border-2 space-y-2"
            style={{
              background: 'var(--color-critical-subtle)',
              borderColor: 'var(--color-critical)',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} className="text-critical" />
                <h2 className="text-[16px] font-bold text-critical">
                  Cardiac Concern Detected (Rule: CARDIAC_001)
                </h2>
              </div>
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white"
                style={{ background: 'var(--color-critical)' }}
              >
                High Priority
              </span>
            </div>
            <p className="text-[13px] text-text-primary leading-relaxed">
              System flagged potential acute coronary syndrome based on NLP symptomatic extraction from patient voice intake. Immediate physician review recommended.
            </p>
          </div>

          {/* Voice Intake Transcript */}
          <div
            className="p-5 rounded-2xl space-y-3"
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11.5px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                <Mic size={14} className="text-brand" /> Source: Patient Voice Intake (Hindi)
              </span>
              <span className="text-[11px] font-medium text-text-muted">Confidence: 98%</span>
            </div>

            <blockquote
              className="p-3.5 rounded-xl text-[14px] italic text-text-primary border-l-4"
              style={{
                background: 'var(--color-surface-subtle)',
                borderColor: 'var(--color-brand)',
              }}
            >
              &quot;Mujhe seene mein bahut dard hai, aur yeh dard mere baayein haath tak jaa raha hai. Saans lene mein bhi dikkat ho rahi hai...&quot;
            </blockquote>

            <div
              className="p-3 rounded-lg text-[13px] text-text-secondary"
              style={{ background: 'var(--color-surface-subtle)' }}
            >
              <span className="font-semibold text-text-primary">English Translation: </span>
              &quot;I have severe pain in my chest, and this pain is radiating to my left arm. I am also having difficulty breathing...&quot;
            </div>
          </div>

          {/* Clinical Facts & Vitals */}
          <div
            className="p-5 rounded-2xl space-y-4"
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
            }}
          >
            <h3 className="text-[14px] font-bold text-text-primary">
              Extracted Clinical Entities &amp; Vitals
            </h3>

            <div className="flex flex-wrap gap-2">
              <span
                className="px-2.5 py-1 rounded-full text-[11.5px] font-bold flex items-center gap-1.5"
                style={{
                  background: 'var(--color-critical-subtle)',
                  color: 'var(--color-critical-text)',
                  border: '1px solid var(--color-critical-subtle)',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-critical" />
                T1: Chest Pain
              </span>
              <span
                className="px-2.5 py-1 rounded-full text-[11.5px] font-bold flex items-center gap-1.5"
                style={{
                  background: 'var(--color-critical-subtle)',
                  color: 'var(--color-critical-text)',
                  border: '1px solid var(--color-critical-subtle)',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-critical" />
                T1: Left Arm Radiation
              </span>
              <span
                className="px-2.5 py-1 rounded-full text-[11.5px] font-bold flex items-center gap-1.5"
                style={{
                  background: 'var(--color-warning-subtle)',
                  color: 'var(--color-warning-text)',
                  border: '1px solid var(--color-warning-subtle)',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                T2: Dyspnea
              </span>
            </div>

            <div className="divide-y divide-border pt-2">
              <div className="py-2.5 flex items-center justify-between text-[13px]">
                <span className="text-text-secondary flex items-center gap-2">
                  <Activity size={15} className="text-critical" /> Blood Pressure
                </span>
                <span className="font-mono font-bold text-critical">155/95 mmHg (Elevated)</span>
              </div>
              <div className="py-2.5 flex items-center justify-between text-[13px]">
                <span className="text-text-secondary flex items-center gap-2">
                  <HeartPulse size={15} className="text-critical" /> Heart Rate
                </span>
                <span className="font-mono font-bold text-critical">104 bpm (Tachycardia)</span>
              </div>
              <div className="py-2.5 flex items-center justify-between text-[13px]">
                <span className="text-text-secondary flex items-center gap-2">
                  <Thermometer size={15} className="text-text-muted" /> Temperature
                </span>
                <span className="font-mono font-medium text-text-primary">99.2°F</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Triage Assessment Pathway */}
        <div className="lg:col-span-4 space-y-4">
          <div
            className="p-5 rounded-2xl space-y-4 shadow-sm sticky top-4"
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div>
              <h3 className="text-[16px] font-bold text-text-primary">
                Triage Action Pathway
              </h3>
              <p className="text-[12px] text-text-secondary mt-0.5">
                Select clinical routing for Token #23 based on alert evaluation.
              </p>
            </div>

            <div className="space-y-2.5">
              {/* Option 1 */}
              <label
                onClick={() => setSelectedAction('escalate')}
                className={cn(
                  'p-3.5 rounded-xl border-2 cursor-pointer flex items-start gap-3 transition-all',
                  selectedAction === 'escalate'
                    ? 'border-critical bg-critical-subtle/30 shadow-xs'
                    : 'border-border hover:bg-surface-subtle'
                )}
              >
                <input
                  type="radio"
                  name="triage_action"
                  checked={selectedAction === 'escalate'}
                  onChange={() => setSelectedAction('escalate')}
                  className="mt-0.5 accent-red-600"
                />
                <div>
                  <p className="text-[13.5px] font-bold text-text-primary">
                    Immediate Escalation (ER / Resus)
                  </p>
                  <p className="text-[11.5px] text-text-secondary mt-0.5">
                    Route directly to emergency resuscitation. Bypass routine OPD.
                  </p>
                </div>
              </label>

              {/* Option 2 */}
              <label
                onClick={() => setSelectedAction('monitor')}
                className={cn(
                  'p-3.5 rounded-xl border-2 cursor-pointer flex items-start gap-3 transition-all',
                  selectedAction === 'monitor'
                    ? 'border-warning bg-warning-subtle/30 shadow-xs'
                    : 'border-border hover:bg-surface-subtle'
                )}
              >
                <input
                  type="radio"
                  name="triage_action"
                  checked={selectedAction === 'monitor'}
                  onChange={() => setSelectedAction('monitor')}
                  className="mt-0.5 accent-amber-600"
                />
                <div>
                  <p className="text-[13.5px] font-bold text-text-primary">
                    Urgent Monitoring Bed
                  </p>
                  <p className="text-[11.5px] text-text-secondary mt-0.5">
                    Admit to observation bed for 12-lead ECG and repeat vitals.
                  </p>
                </div>
              </label>

              {/* Option 3 */}
              <label
                onClick={() => setSelectedAction('opd')}
                className={cn(
                  'p-3.5 rounded-xl border-2 cursor-pointer flex items-start gap-3 transition-all',
                  selectedAction === 'opd'
                    ? 'border-brand bg-brand-mist/30 shadow-xs'
                    : 'border-border hover:bg-surface-subtle'
                )}
              >
                <input
                  type="radio"
                  name="triage_action"
                  checked={selectedAction === 'opd'}
                  onChange={() => setSelectedAction('opd')}
                  className="mt-0.5 accent-teal-800"
                />
                <div>
                  <p className="text-[13.5px] font-bold text-text-primary">
                    Standard OPD Queue
                  </p>
                  <p className="text-[11.5px] text-text-secondary mt-0.5">
                    Symptoms deemed non-acute; proceed with general consultation.
                  </p>
                </div>
              </label>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="text-[11.5px] font-bold uppercase tracking-wider text-text-muted">
                Triage Clinical Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Document nurse assessment or transfer rationale..."
                rows={3}
                className="w-full p-3 rounded-lg text-[12.5px] resize-none focus:outline-none focus:ring-2 focus:ring-brand"
                style={{
                  background: 'var(--color-surface-subtle)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                }}
              />
            </div>

            <button
              onClick={handleConfirmAssessment}
              className="w-full h-11 rounded-lg text-white font-bold text-[13.5px] flex items-center justify-center gap-2 shadow-xs transition-all hover:opacity-90 active:scale-98"
              style={{
                background: selectedAction === 'escalate' ? 'var(--color-critical)' : 'var(--color-brand)',
              }}
            >
              <CheckCircle2 size={16} />
              <span>Confirm Triage Assessment</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
