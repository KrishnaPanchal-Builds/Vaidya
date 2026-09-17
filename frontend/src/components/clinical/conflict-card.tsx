'use client'

import { useState } from 'react'
import { AlertTriangle, CheckCircle2, RotateCcw, Stethoscope } from 'lucide-react'
import { ClinicalConflict } from '@/types'

interface ConflictCardProps {
  conflict: ClinicalConflict
  onResolve: (resolution: 'RESOLVED_A' | 'RESOLVED_B' | 'RESOLVED_UNCERTAIN', note?: string) => Promise<void>
}

export function ConflictCard({ conflict, onResolve }: ConflictCardProps) {
  const [note] = useState('')
  const [resolving, setResolving] = useState(false)
  const [resolvedDecision, setResolvedDecision] = useState<'RESOLVED_A' | 'RESOLVED_B' | 'RESOLVED_UNCERTAIN' | null>(null)

  const handleResolve = async (resolution: 'RESOLVED_A' | 'RESOLVED_B' | 'RESOLVED_UNCERTAIN') => {
    setResolving(true)
    await onResolve(resolution, note)
    setResolvedDecision(resolution)
    setResolving(false)
  }

  if (resolvedDecision) {
    return (
      <div
        className="flex items-center justify-between px-5 py-4 rounded-2xl shadow-xs border"
        style={{
          background: 'var(--color-verified-subtle)',
          borderColor: 'var(--color-verified-subtle)',
        }}
      >
        <div className="flex items-center gap-3" style={{ color: 'var(--color-verified-text)' }}>
          <CheckCircle2 size={18} className="text-verified shrink-0" />
          <div>
            <p className="text-[14px] font-bold">
              {resolvedDecision === 'RESOLVED_B' && `Confirmed Patient Report: ${conflict.factB.rawValue}`}
              {resolvedDecision === 'RESOLVED_A' && `Confirmed Prescription Record: ${conflict.factA.rawValue}`}
              {resolvedDecision === 'RESOLVED_UNCERTAIN' && 'Marked for Physician Physical Examination'}
            </p>
            {note && <p className="text-[12px] text-text-muted mt-0.5">Physician Note: &quot;{note}&quot;</p>}
          </div>
        </div>

        <button
          onClick={() => setResolvedDecision(null)}
          className="text-[12px] font-semibold hover:underline flex items-center gap-1"
          style={{ color: 'var(--color-verified-text)' }}
        >
          <RotateCcw size={12} />
          <span>Change Decision</span>
        </button>
      </div>
    )
  }

  return (
    <div
      className="border rounded-3xl p-6 sm:p-7 shadow-xs space-y-4"
      style={{
        background: 'var(--color-surface)',
        borderColor: 'var(--color-warning)',
      }}
    >
      {/* Discrepancy Header */}
      <div
        className="flex items-center justify-between pb-3 border-b"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="flex items-center gap-2.5 text-warning">
          <AlertTriangle size={18} className="text-warning" />
          <h4 className="text-[16px] font-bold text-text-primary">
            Clinical Discrepancy • {conflict.fieldLabel}
          </h4>
        </div>
        <span
          className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border"
          style={{
            background: 'var(--color-warning-subtle)',
            color: 'var(--color-warning-text)',
            borderColor: 'var(--color-warning-subtle)',
          }}
        >
          Physician Verification Required
        </span>
      </div>

      <p className="text-[13px] text-text-secondary">
        Conflicting allergy records detected between physical document OCR and multilingual kiosk intake:
      </p>

      {/* Side-by-Side Comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Patient Report */}
        <div
          className="p-4 rounded-2xl border space-y-1"
          style={{
            background: 'var(--color-brand-mist-subtle)',
            borderColor: 'var(--color-border-strong)',
          }}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand">
            PATIENT REPORTED (Voice Intake)
          </span>
          <p className="text-[17px] font-bold text-text-primary">
            {conflict.factB.rawValue}
          </p>
          <p className="text-[11px] text-text-muted">
            Source: Kiosk Voice Intake (mr-IN)
          </p>
        </div>

        {/* Prescription Record */}
        <div
          className="p-4 rounded-2xl border space-y-1"
          style={{
            background: 'var(--color-surface-subtle)',
            borderColor: 'var(--color-border)',
          }}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
            RECORD (Prescription Scan)
          </span>
          <p className="text-[17px] font-bold text-text-primary">
            {conflict.factA.rawValue}
          </p>
          <p className="text-[11px] text-text-muted">
            Source: Prescription_Jan2025.jpg (94% OCR)
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          disabled={resolving}
          onClick={() => handleResolve('RESOLVED_B')}
          className="px-4 py-2 rounded-xl text-white text-[12px] font-bold transition-all shadow-xs active:scale-95 hover:opacity-90"
          style={{ background: 'var(--color-brand)' }}
        >
          Confirm Patient Report
        </button>

        <button
          disabled={resolving}
          onClick={() => handleResolve('RESOLVED_A')}
          className="px-4 py-2 rounded-xl border text-[12px] font-bold transition-all shadow-xs active:scale-95 hover:bg-surface-subtle"
          style={{
            background: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-primary)',
          }}
        >
          Confirm Record
        </button>

        <button
          disabled={resolving}
          onClick={() => handleResolve('RESOLVED_UNCERTAIN')}
          className="px-3 py-2 text-[12px] font-semibold hover:text-text-primary flex items-center gap-1.5 text-text-secondary"
        >
          <Stethoscope size={13} />
          <span>Mark for Physical Exam</span>
        </button>
      </div>
    </div>
  )
}
