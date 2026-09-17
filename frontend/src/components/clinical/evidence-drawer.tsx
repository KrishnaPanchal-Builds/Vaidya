'use client'

import { useEffect, useState } from 'react'
import { useUIStore } from '@/store'
import { ClinicalFact } from '@/types'
import { Drawer } from '@/components/ui'
import { ProvenanceChip } from './provenance-chip'
import { SkeletonRow } from '@/components/ui/skeleton'
import {
  FileText,
  Mic,
  CheckCircle2,
  Search,
} from 'lucide-react'

export function EvidenceDrawer() {
  const { evidenceDrawerOpen, evidenceFactId, closeEvidenceDrawer, addToast } = useUIStore()
  const [fact, setFact] = useState<ClinicalFact | null>(null)
  const [loading, setLoading] = useState(false)
  const [isFactVerified, setIsFactVerified] = useState(false)

  useEffect(() => {
    if (evidenceFactId && evidenceDrawerOpen) {
      setLoading(true)
      setIsFactVerified(false)
      import('@/constants/demo-data').then(({ DEMO_FACTS_ENC001 }) => {
        const found = DEMO_FACTS_ENC001.find((f) => f.id === evidenceFactId)
        setFact(found ?? null)
        setLoading(false)
      })
    }
  }, [evidenceFactId, evidenceDrawerOpen])

  const handleVerify = () => {
    setIsFactVerified(true)
    addToast({
      type: 'success',
      title: 'Fact Verified by Physician',
      body: `"${fact?.rawValue}" confirmed against optical source proof.`,
    })
    setTimeout(() => {
      closeEvidenceDrawer()
    }, 400)
  }

  return (
    <Drawer open={evidenceDrawerOpen} onClose={closeEvidenceDrawer} title="Optical Source Evidence">
      <div className="p-6 space-y-6">
        {loading && (
          <div className="space-y-4">
            <SkeletonRow />
            <SkeletonRow />
          </div>
        )}

        {!loading && fact && (
          <>
            {/* The Fact Highlight */}
            <div
              className="rounded-2xl p-5 border space-y-2 shadow-xs"
              style={{
                background: 'var(--color-surface-subtle)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-brand">
                  {fact.domain} • {fact.fieldName.replace(/_/g, ' ')}
                </span>
                <span
                  className="text-[10px] font-bold uppercase px-2 py-0.5 rounded border"
                  style={{
                    background: 'var(--color-brand-mist)',
                    color: 'var(--color-brand)',
                    borderColor: 'var(--color-border-strong)',
                  }}
                >
                  Extracted Entity
                </span>
              </div>
              <p className="text-[20px] font-bold text-text-primary leading-snug">
                {fact.rawValue}
                {fact.valueUnit && <span className="text-[15px] font-semibold text-text-muted ml-1">{fact.valueUnit}</span>}
              </p>
            </div>

            {/* Source Classification */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted block">
                Source Channel &amp; Provenance
              </span>
              <div
                className="p-4 rounded-2xl border flex items-center justify-between gap-3"
                style={{
                  background: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'var(--color-brand-mist)',
                      color: 'var(--color-brand)',
                    }}
                  >
                    {fact.sourceType === 'DOCUMENT_EXTRACT' ? <FileText size={20} /> : <Mic size={20} />}
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-text-primary">
                      {fact.sourceType === 'DOCUMENT_EXTRACT'
                        ? 'Scanned Physical Record'
                        : 'Patient Voice Intake (Kiosk)'}
                    </p>
                    <p className="text-[11px] font-mono text-text-muted">
                      {fact.sourceDocumentId ? `Doc ID: ${fact.sourceDocumentId}` : 'Audio Session: sess-001 (Marathi)'}
                    </p>
                  </div>
                </div>
                <ProvenanceChip
                  tier={fact.confidenceTier}
                  sourceType={fact.sourceType}
                  confidence={fact.ocrConfidence ?? fact.confidence}
                />
              </div>
            </div>

            {/* Visual Source Proof Crop / Audio Transcript */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted block">
                {fact.sourceType === 'DOCUMENT_EXTRACT' ? 'Optical Bounding Box Crop' : 'Speech Transcript'}
              </span>

              {fact.sourceType === 'DOCUMENT_EXTRACT' ? (
                <div
                  className="border-2 border-dashed rounded-2xl p-4 space-y-3"
                  style={{
                    background: 'var(--color-surface-subtle)',
                    borderColor: 'var(--color-border-strong)',
                  }}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-text-muted">
                    <span>Crop: Page {fact.sourcePage || 1} • Bounding Box [x:120, y:450]</span>
                    <span
                      className="font-bold px-2 py-0.5 rounded border"
                      style={{
                        background: 'var(--color-verified-subtle)',
                        color: 'var(--color-verified-text)',
                        borderColor: 'var(--color-verified-subtle)',
                      }}
                    >
                      {Math.round((fact.ocrConfidence || 0.94) * 100)}% OCR Accuracy
                    </span>
                  </div>

                  {/* Simulated Crop Rendering */}
                  <div
                    className="p-3 rounded-xl border shadow-xs font-mono text-[14px] font-bold text-text-primary border-l-4"
                    style={{
                      background: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                      borderLeftColor: 'var(--color-brand)',
                    }}
                  >
                    {fact.sourceText || fact.rawValue}
                  </div>
                  <p className="text-[11px] text-text-muted italic">
                    Scanned document verified from physical file presented at Kiosk Station 01.
                  </p>
                </div>
              ) : (
                <div
                  className="border rounded-2xl p-4 space-y-2"
                  style={{
                    background: 'var(--color-surface-subtle)',
                    borderColor: 'var(--color-border)',
                  }}
                >
                  <div className="flex items-center gap-2 text-brand text-[12px] font-bold">
                    <Mic size={14} />
                    <span>Bhashini Multilingual Speech Model (mr-IN)</span>
                  </div>
                  <p
                    className="text-[14px] font-medium italic p-3 rounded-xl border text-text-primary"
                    style={{
                      background: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                    }}
                  >
                    &quot;३ महिन्यांपासून जेवणानंतर पोटात तीव्र जळजळ आणि दुखणे जाणवते...&quot;
                  </p>
                  <p className="text-[11px] text-text-muted">
                    English Translation: &quot;I have been experiencing severe burning stomach pain after meals for 3 months...&quot;
                  </p>
                </div>
              )}
            </div>

            {/* Physician Verification Decision */}
            <div
              className="pt-4 border-t space-y-3"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <button
                onClick={handleVerify}
                className="w-full h-11 text-[14px] font-bold rounded-2xl text-white transition-all shadow-xs flex items-center justify-center gap-2 active:scale-98"
                style={{
                  background: isFactVerified ? 'var(--color-verified)' : 'var(--color-brand)',
                }}
              >
                <CheckCircle2 size={16} />
                <span>{isFactVerified ? 'Fact Confirmed ✓' : 'Mark as Physician Verified'}</span>
              </button>

              <button
                onClick={closeEvidenceDrawer}
                className="w-full h-10 text-[13px] font-semibold border rounded-2xl transition-colors hover:bg-surface-subtle text-text-secondary hover:text-text-primary"
                style={{
                  background: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                }}
              >
                Close Drawer
              </button>
            </div>
          </>
        )}

        {!loading && !fact && (
          <div className="text-center py-12 space-y-2">
            <Search size={32} className="mx-auto text-text-muted" />
            <p className="text-[15px] font-bold text-text-primary">Source Evidence Not Found</p>
            <p className="text-[12px] text-text-secondary">
              The selected fact does not contain attached optical crops.
            </p>
          </div>
        )}
      </div>
    </Drawer>
  )
}
