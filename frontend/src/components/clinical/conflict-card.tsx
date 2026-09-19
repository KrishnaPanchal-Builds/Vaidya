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
      <div className="flex items-center justify-between px-4 py-3.5 rounded-xl border border-emerald-200/60 bg-[var(--color-verified-subtle)] shadow-2xs">
        <div className="flex items-center gap-2.5 text-[var(--color-verified-text)]">
          <CheckCircle2 size={16} className="shrink-0" />
          <div>
            <p className="text-[13px] font-bold">
              {resolvedDecision === 'RESOLVED_B' && `Confirmed Patient Report: ${conflict.factB.rawValue}`}
              {resolvedDecision === 'RESOLVED_A' && `Confirmed Prescription Record: ${conflict.factA.rawValue}`}
              {resolvedDecision === 'RESOLVED_UNCERTAIN' && 'Marked for Physician Physical Examination'}
            </p>
            {note && <p className="text-[11.5px] text-[var(--color-text-muted)] mt-0.5">Physician Note: &quot;{note}&quot;</p>}
          </div>
        </div>

        <button
          onClick={() => setResolvedDecision(null)}
          className="text-[11.5px] font-semibold text-[var(--color-verified-text)] hover:underline flex items-center gap-1 shrink-0"
        >
          <RotateCcw size={11} />
          <span>Change</span>
        </button>
      </div>
    )
  }

  return (
    <div className="border border-[var(--color-border)] border-l-4 border-l-[var(--color-warning)] rounded-xl p-4 sm:p-5 bg-[var(--color-surface)] shadow-xs space-y-3.5">
      {/* Discrepancy Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <AlertTriangle size={15} className="text-[var(--color-warning)] shrink-0" />
          <h4 className="text-[14px] font-bold text-[var(--color-text-primary)]">
            Clinical Discrepancy · {conflict.fieldLabel}
          </h4>
        </div>
        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border border-[var(--color-warning-subtle)] bg-[var(--color-warning-subtle)] text-[var(--color-warning-text)]">
          Verification Required
        </span>
      </div>

      <p className="text-[12.5px] text-[var(--color-text-secondary)] leading-relaxed">
        Conflicting allergy records detected between physical document OCR and multilingual kiosk intake:
      </p>

      {/* Side-by-Side Comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Patient Report */}
        <div className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-brand)] block">
            Patient Reported (Voice Intake)
          </span>
          <p className="text-[14.5px] font-bold text-[var(--color-text-primary)]">
            {conflict.factB.rawValue}
          </p>
          <p className="text-[11px] text-[var(--color-text-muted)]">
            Source: Kiosk Voice Intake (mr-IN)
          </p>
        </div>

        {/* Prescription Record */}
        <div className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] block">
            Record (Prescription Scan)
          </span>
          <p className="text-[14.5px] font-bold text-[var(--color-text-primary)]">
            {conflict.factA.rawValue}
          </p>
          <p className="text-[11px] text-[var(--color-text-muted)]">
            Source: Prescription_Jan2025.jpg (94% OCR)
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2.5 pt-1">
        <button
          disabled={resolving}
          onClick={() => handleResolve('RESOLVED_B')}
          className="px-3.5 py-1.5 rounded-lg text-white text-[12px] font-bold transition-all shadow-xs active:scale-95 hover:opacity-90 bg-[var(--color-brand)]"
        >
          Confirm Patient Report
        </button>

        <button
          disabled={resolving}
          onClick={() => handleResolve('RESOLVED_A')}
          className="px-3.5 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] text-[12px] font-bold transition-all shadow-xs active:scale-95 hover:bg-[var(--color-surface-subtle)]"
        >
          Confirm Record
        </button>

        <button
          disabled={resolving}
          onClick={() => handleResolve('RESOLVED_UNCERTAIN')}
          className="px-3 py-1.5 text-[12px] font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] flex items-center gap-1.5 ml-auto"
        >
          <Stethoscope size={13} />
          <span>Mark for Physical Exam</span>
        </button>
      </div>
    </div>
  )
}

