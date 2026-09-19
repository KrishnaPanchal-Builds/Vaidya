'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useUIStore } from '@/store'
import { Drawer } from '@/components/ui'
import { ProvenanceChip } from './provenance-chip'
import {
  FileText,
  Mic,
  CheckCircle2,
  Search,
  AlertTriangle,
  FileCheck2,
  Maximize2,
} from 'lucide-react'
import { getEvidenceItemById } from '@/constants/demo-data'
import { cn } from '@/lib/utils'

export function EvidenceDrawer() {
  const { evidenceDrawerOpen, evidenceFactId, closeEvidenceDrawer, addToast } = useUIStore()
  const [isVerified, setIsVerified] = useState(false)
  const [imageExpanded, setImageExpanded] = useState(false)

  // Synchronous, instant lookup directly from canonical data mapping (zero latency / zero flicker)
  const result = evidenceFactId ? getEvidenceItemById(evidenceFactId) : null
  const fact = result?.fact ?? null
  const document = result?.document ?? null

  useEffect(() => {
    setIsVerified(false)
    setImageExpanded(false)
  }, [evidenceFactId])

  const handleVerify = () => {
    setIsVerified(true)
    const title = fact ? `Fact: ${fact.rawValue}` : `Document: ${document?.originalFilename}`
    addToast({
      type: 'success',
      title: 'Optical Source Verified by Physician',
      body: `"${title}" successfully confirmed against source document.`,
    })
    setTimeout(() => {
      closeEvidenceDrawer()
    }, 450)
  }

  const activeImage = document?.imageUrl || fact?.documentImageUrl
  const isTier3 = document?.degradationTier === 3 || fact?.degradationTier === 3 || fact?.confidenceTier === 3
  const ocrScore = document?.ocrConfidence ?? fact?.ocrConfidence ?? fact?.confidence ?? 0.94

  return (
    <Drawer
      open={evidenceDrawerOpen}
      onClose={closeEvidenceDrawer}
      title="Optical Source Provenance & Audit"
    >
      <div className="p-4 sm:p-5 space-y-4 max-w-full overflow-hidden">
        {(fact || document) && (
          <>
            {/* ── 1. Top Identity & Confidence Header ───────────────────────── */}
            <div
              className={cn(
                'rounded-xl p-4 border space-y-2.5 shadow-2xs min-w-0 overflow-hidden',
                isTier3
                  ? 'bg-[var(--color-warning-subtle)] border-[var(--color-warning)]/40 border-l-4 border-l-[var(--color-warning)]'
                  : 'bg-[var(--color-surface-subtle)] border-[var(--color-border)]'
              )}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 min-w-0">
                <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-[var(--color-brand)] truncate">
                  {fact ? `${fact.domain} • ${fact.fieldName.replace(/_/g, ' ')}` : (document?.documentType.replace(/_/g, ' ') || 'CLINICAL DOCUMENT')}
                </span>
                <span
                  className={cn(
                    'text-[9.5px] font-bold uppercase px-2 py-0.5 rounded border tracking-wider shrink-0 self-start sm:self-auto whitespace-nowrap',
                    isTier3
                      ? 'bg-[var(--color-warning)] text-white border-[var(--color-warning)]'
                      : 'bg-[var(--color-verified-subtle)] text-[var(--color-verified-text)] border-emerald-200/60'
                  )}
                >
                  {isTier3 ? '⚠️ Tier 3 — Verification Required' : `Tier ${document?.degradationTier || fact?.degradationTier || 1} • High Confidence`}
                </span>
              </div>

              <div className="space-y-1 min-w-0">
                <p className="text-[16px] sm:text-[17px] font-bold text-[var(--color-text-primary)] leading-snug break-words">
                  {fact ? fact.rawValue : document?.originalFilename}
                  {fact?.valueUnit && <span className="text-[13.5px] font-semibold text-[var(--color-text-muted)] ml-1">{fact.valueUnit}</span>}
                </p>
                {document && (
                  <p className="text-[11px] text-[var(--color-text-muted)] font-mono break-all leading-relaxed pt-0.5">
                    File: {document.originalFilename} • {document.pageCount} page(s)
                  </p>
                )}
              </div>
            </div>

            {/* ── 2. Source Channel & OCR Confidence Strip ──────────────────── */}
            <div className="space-y-1.5 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] block">
                Ingestion Channel &amp; OCR Telemetry
              </span>
              <div className="p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-between gap-3 shadow-2xs min-w-0 overflow-hidden">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                      fact?.sourceType === 'INTERVIEW'
                        ? 'bg-[var(--color-brand-mist)] text-[var(--color-brand)]'
                        : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)] border border-[var(--color-border)]'
                    )}
                  >
                    {fact?.sourceType === 'INTERVIEW' ? <Mic size={16} /> : <FileText size={16} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12.5px] font-bold text-[var(--color-text-primary)] truncate">
                      {fact?.sourceType === 'INTERVIEW'
                        ? 'Patient Multilingual Voice Intake'
                        : document?.documentType.replace(/_/g, ' ') || 'Scanned Physical Record'}
                    </p>
                    <p className="text-[10.5px] font-mono text-[var(--color-text-muted)] truncate">
                      {document ? `Doc ID: ${document.id}` : (fact?.sourceDocumentId ? `Doc ID: ${fact.sourceDocumentId}` : 'Audio Session: Bhashini ASR')}
                    </p>
                  </div>
                </div>

                <ProvenanceChip
                  tier={document?.degradationTier || fact?.confidenceTier || 1}
                  sourceType={fact?.sourceType || 'DOCUMENT_EXTRACT'}
                  confidence={ocrScore}
                />
              </div>
            </div>

            {/* ── 3. Realistic Scanned Document Image Viewport ──────────────── */}
            {activeImage && (
              <div className="space-y-2 min-w-0">
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] flex items-center gap-1.5 truncate">
                    <FileCheck2 size={13} className="text-[var(--color-brand)] shrink-0" />
                    Optical Scan &amp; Bounding Box Crop
                  </span>
                  <button
                    onClick={() => setImageExpanded(!imageExpanded)}
                    className="text-[11px] font-semibold text-[var(--color-brand)] hover:underline flex items-center gap-1 shrink-0"
                  >
                    <Maximize2 size={12} />
                    <span>{imageExpanded ? 'Fit View' : 'Zoom Document'}</span>
                  </button>
                </div>

                <div
                  className={cn(
                    'relative rounded-xl border border-[var(--color-border)] overflow-hidden bg-[var(--color-surface-subtle)] transition-all flex items-center justify-center p-2 min-w-0',
                    imageExpanded ? 'h-[440px]' : 'h-[260px]'
                  )}
                >
                  <Image
                    src={activeImage}
                    alt="Scanned Clinical Record"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 600px"
                    priority
                  />
                </div>
                <div className="flex items-center justify-between text-[10.5px] text-[var(--color-text-muted)] px-1 gap-2 flex-wrap">
                  <span>Quality Score: {Math.round((document?.qualityScore || ocrScore) * 100)}%</span>
                  <span className="font-mono">
                    {isTier3 ? '⚠️ Degradation: Skew + Cursive Noise' : '✓ Digitized at Kiosk Ingestion Station'}
                  </span>
                </div>
              </div>
            )}

            {/* ── 4. Tier 3 Degraded Scan: Mismatch Comparison ──────────────── */}
            {isTier3 && (
              <div className="rounded-xl border border-[var(--color-warning)]/50 bg-[var(--color-surface)] p-3.5 sm:p-4 space-y-2.5 shadow-2xs min-w-0 overflow-hidden">
                <div className="flex items-center gap-1.5 text-[var(--color-warning-text)]">
                  <AlertTriangle size={14} className="shrink-0" />
                  <h4 className="text-[11.5px] font-bold uppercase tracking-wider truncate">
                    OCR Discrepancy &amp; Verification Required
                  </h4>
                </div>

                <div className="space-y-2 text-[12px] min-w-0">
                  {/* Garbled OCR Result */}
                  <div className="p-2.5 rounded-lg border border-red-200 bg-red-50/70 text-red-950 font-mono space-y-1 min-w-0">
                    <span className="text-[9.5px] font-bold uppercase text-red-700 block">
                      [Raw OCR Extraction — Garbled Text / Incomplete]
                    </span>
                    <p className="font-bold text-[12px] break-words leading-snug">
                      {document?.rawOcrGarbledText || fact?.extractedSnippet || 'Tab. Ranit~[??] 150mg B~[?] / Susp. Gelus[???] 10ml T~[?] (OCR Garbled)'}
                    </p>
                  </div>

                  {/* Ground Truth Meaning */}
                  <div className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/70 text-emerald-950 space-y-1 min-w-0">
                    <span className="text-[9.5px] font-bold uppercase text-emerald-700 block">
                      [Actual Image Ground Truth / Intended Order]
                    </span>
                    <p className="font-medium text-[12px] break-words leading-snug">
                      {document?.groundTruthText || fact?.groundTruthSnippet || 'Tab. Ranitidine 150mg BD x 14d before food, Susp. Gelusil 10ml TDS post prandial.'}
                    </p>
                  </div>

                  {/* Discrepancy Rationale */}
                  <p className="text-[11px] text-[var(--color-text-secondary)] italic pt-0.5 break-words leading-relaxed">
                    <strong>Cause of Error:</strong> {document?.ocrDiscrepancyReason || fact?.ocrDiscrepancy || 'Aged paper fold crease and physician cursive handwriting caused character fragmentation. Optical inspection confirms correct formulation.'}
                  </p>
                </div>
              </div>
            )}

            {/* ── 5. Clean Extracted Text for Tier 1 / Tier 2 ───────────────── */}
            {!isTier3 && fact?.sourceType !== 'INTERVIEW' && (
              <div className="space-y-1.5 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] block">
                  Extracted Machine-Readable Snippet
                </span>
                <div className="p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] font-mono text-[12px] text-[var(--color-text-primary)] border-l-4 border-l-[var(--color-brand)] break-words leading-relaxed">
                  {document?.extractedTextSnippet || fact?.extractedSnippet || fact?.sourceText || fact?.rawValue}
                </div>
              </div>
            )}

            {/* ── 6. Speech Audio Transcript (Voice Intake) ─────────────────── */}
            {fact?.sourceType === 'INTERVIEW' && (
              <div className="space-y-2 p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] min-w-0">
                <div className="flex items-center gap-1.5 text-[var(--color-brand)] text-[11.5px] font-bold">
                  <Mic size={14} className="shrink-0" />
                  <span>Bhashini Multilingual Speech Model</span>
                </div>
                <p className="text-[13px] font-medium italic p-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] break-words leading-snug">
                  &quot;{fact.extractedSnippet || fact.rawValue}&quot;
                </p>
                {fact.groundTruthSnippet && (
                  <p className="text-[11px] text-[var(--color-text-muted)] break-words leading-relaxed">
                    {fact.groundTruthSnippet}
                  </p>
                )}
              </div>
            )}

            {/* ── 7. Physician Verification & CTA Actions ──────────────────── */}
            <div className="pt-2.5 border-t border-[var(--color-border)] space-y-2">
              <button
                onClick={handleVerify}
                className={cn(
                  'w-full h-10 text-[13px] font-bold rounded-xl text-white transition-all shadow-2xs flex items-center justify-center gap-2 active:scale-[0.98]',
                  isVerified ? 'bg-[var(--color-verified)]' : 'bg-[var(--color-brand)] hover:opacity-90'
                )}
              >
                <CheckCircle2 size={15} />
                <span>{isVerified ? 'Optical Evidence Confirmed ✓' : 'Confirm Optical Match & Verify'}</span>
              </button>

              <button
                onClick={closeEvidenceDrawer}
                className="w-full h-9 text-[12px] font-semibold border border-[var(--color-border)] rounded-xl transition-colors bg-[var(--color-surface)] hover:bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)]"
              >
                Close Drawer
              </button>
            </div>
          </>
        )}

        {!fact && !document && (
          <div className="text-center py-12 space-y-2.5">
            <Search size={32} className="mx-auto text-[var(--color-text-muted)]" />
            <p className="text-[14px] font-bold text-[var(--color-text-primary)]">Source Evidence Not Found</p>
            <p className="text-[11.5px] text-[var(--color-text-secondary)] max-w-xs mx-auto">
              The selected item ID could not be matched with attached optical scans or audio recordings.
            </p>
          </div>
        )}
      </div>
    </Drawer>
  )
}
