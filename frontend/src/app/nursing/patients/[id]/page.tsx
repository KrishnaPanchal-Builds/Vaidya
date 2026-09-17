'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  CheckCircle2,
  Stethoscope,
  ShieldAlert,
  AlertTriangle,
} from 'lucide-react'
import { useUIStore } from '@/store'

export default function NursingPatientDetailPage() {
  const router = useRouter()
  const { addToast } = useUIStore()
  const [priority, setPriority] = useState<'STANDARD' | 'URGENT' | 'HIGH_PRIORITY'>('STANDARD')

  const handleUpdatePriority = () => {
    addToast({
      type: 'success',
      title: 'Triage Priority Updated',
      body: `Priority set to ${priority} for Dhananjay Patil.`,
    })
  }

  const handleTransferToPhysician = () => {
    addToast({
      type: 'success',
      title: 'Ready for Physician',
      body: 'Patient transferred to Active OPD Consultation queue.',
    })
    router.push('/doctor/encounter/enc-001')
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* ── Top Header Bar ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/nursing/dashboard"
            className="text-[12px] font-medium text-text-secondary hover:text-text-primary flex items-center gap-1 mb-1"
          >
            <ArrowLeft size={13} /> Back to Triage Queue
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-[22px] font-bold text-text-primary tracking-tight">
              Nursing Case Assessment
            </h1>
            <span
              className="text-[11px] font-bold px-2 py-0.5 rounded-full"
              style={{
                background: 'var(--color-verified-subtle)',
                color: 'var(--color-verified-text)',
              }}
            >
              Intake Complete
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTransferToPhysician}
            className="h-9 px-4 rounded-lg text-white font-bold text-[13px] flex items-center gap-1.5 shadow-xs transition-all hover:opacity-90 active:scale-98"
            style={{ background: 'var(--color-brand)' }}
          >
            <CheckCircle2 size={14} />
            <span>Mark Ready for Physician</span>
          </button>
        </div>
      </div>

      {/* ── Patient Identity Card ───────────────────────────────────── */}
      <div
        className="p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
        }}
      >
        <div className="flex items-center gap-3.5">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-[16px] shrink-0"
            style={{
              background: 'var(--color-brand)',
              color: '#FFFFFF',
            }}
          >
            DP
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-[18px] font-bold text-text-primary">Dhananjay Patil</h2>
              <span className="text-[12px] text-text-secondary font-medium">67 YRS • MALE</span>
              <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-surface-subtle border border-border">
                Token #31
              </span>
            </div>
            <p className="text-[12px] text-text-muted mt-0.5">
              MRN: 849-221 • ABHA: 12-3456-7890-1234 • Arrival: 09:15 AM (Wait: 1h 27m)
            </p>
          </div>
        </div>

        {/* Priority Selector */}
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-semibold text-text-secondary">Triage Level:</span>
          <select
            value={priority}
            onChange={(e) => {
              setPriority(e.target.value as 'STANDARD' | 'URGENT' | 'HIGH_PRIORITY')
              handleUpdatePriority()
            }}
            className="h-8 text-[12px] font-semibold rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-brand"
            style={{
              background: 'var(--color-surface-subtle)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
          >
            <option value="STANDARD">Routine Priority</option>
            <option value="URGENT">Urgent Care</option>
            <option value="HIGH_PRIORITY">High Priority OPD</option>
          </select>
        </div>
      </div>

      {/* ── Known Allergy Banner ────────────────────────────────────── */}
      <div
        className="p-4 rounded-xl flex items-center justify-between gap-3"
        style={{
          background: 'var(--color-critical-subtle)',
          border: '1px solid var(--color-critical)',
        }}
      >
        <div className="flex items-center gap-3">
          <ShieldAlert size={20} className="text-critical shrink-0" />
          <div>
            <p className="text-[13px] font-bold text-critical">
              Flagged Conflict: Penicillin Allergy Discrepancy
            </p>
            <p className="text-[12px] text-text-primary">
              Patient reported no allergies during voice intake, but 2022 AIIMS discharge document lists Penicillin allergy.
            </p>
          </div>
        </div>
        <span
          className="text-[11px] font-bold px-2 py-0.5 rounded uppercase shrink-0"
          style={{
            background: 'var(--color-critical)',
            color: '#FFFFFF',
          }}
        >
          Flagged for OPD Doctor
        </span>
      </div>

      {/* ── 2-Column Clinical Layout ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Vitals & Chief Complaint */}
        <div className="lg:col-span-8 space-y-5">
          {/* Triage Vitals */}
          <div
            className="p-5 rounded-2xl space-y-4"
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-text-primary">
                Triage Vitals
              </h3>
              <span className="text-[11px] font-medium text-text-muted">Recorded 12 mins ago</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-surface-subtle border border-border">
                <span className="text-[11px] font-semibold text-text-secondary">Blood Pressure</span>
                <p className="text-[18px] font-mono font-bold text-text-primary mt-1">128/82</p>
                <span className="text-[10px] text-text-muted">mmHg (Normal)</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-subtle border border-border">
                <span className="text-[11px] font-semibold text-text-secondary">Heart Rate</span>
                <p className="text-[18px] font-mono font-bold text-text-primary mt-1">88</p>
                <span className="text-[10px] text-text-muted">bpm (Regular)</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-subtle border border-border">
                <span className="text-[11px] font-semibold text-text-secondary">Temperature</span>
                <p className="text-[18px] font-mono font-bold text-text-primary mt-1">98.6°F</p>
                <span className="text-[10px] text-text-muted">Afebrile</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-subtle border border-border">
                <span className="text-[11px] font-semibold text-text-secondary">SpO2</span>
                <p className="text-[18px] font-mono font-bold text-text-primary mt-1">98%</p>
                <span className="text-[10px] text-text-muted">Room Air</span>
              </div>
            </div>
          </div>

          {/* Chief Complaint & HPI Excerpt */}
          <div
            className="p-5 rounded-2xl space-y-3"
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
            }}
          >
            <h3 className="text-[15px] font-bold text-text-primary">
              Chief Complaint &amp; Intake Notes
            </h3>
            <div className="p-4 rounded-xl bg-surface-subtle border border-border space-y-2">
              <p className="text-[14px] font-semibold text-text-primary">
                Epigastric pain, 2 days duration.
              </p>
              <p className="text-[13px] text-text-secondary leading-relaxed">
                Patient reports dull ache in upper abdomen, worsening after meals. No vomiting. Mild nausea present. History of Type 2 Diabetes on Metformin.
              </p>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Quick Actions & Status */}
        <div className="lg:col-span-4 space-y-4">
          <div
            className="p-5 rounded-2xl space-y-4 shadow-xs"
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
            }}
          >
            <h3 className="text-[15px] font-bold text-text-primary">
              Intake Checklist
            </h3>
            <div className="space-y-2 text-[12.5px]">
              <div className="flex items-center gap-2 text-verified">
                <CheckCircle2 size={15} />
                <span className="text-text-primary">ABHA Identity Verified</span>
              </div>
              <div className="flex items-center gap-2 text-verified">
                <CheckCircle2 size={15} />
                <span className="text-text-primary">Marathi Voice Intake Captured</span>
              </div>
              <div className="flex items-center gap-2 text-verified">
                <CheckCircle2 size={15} />
                <span className="text-text-primary">3 Optical Documents Processed</span>
              </div>
              <div className="flex items-center gap-2 text-warning">
                <AlertTriangle size={15} />
                <span className="text-text-primary">1 Allergy Contradiction Detected</span>
              </div>
            </div>

            <button
              onClick={handleTransferToPhysician}
              className="w-full h-10 rounded-lg text-white font-bold text-[13px] flex items-center justify-center gap-2 shadow-xs transition-all hover:opacity-90 active:scale-98 mt-2"
              style={{ background: 'var(--color-brand)' }}
            >
              <Stethoscope size={15} />
              <span>Transfer to OPD Room 3</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
