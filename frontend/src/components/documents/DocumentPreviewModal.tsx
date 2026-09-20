'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  ZoomIn,
  ZoomOut,
  FileText,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'

export interface PreviewDocumentData {
  id?: string
  name: string
  type?: 'PRESCRIPTION' | 'LAB_REPORT' | 'DISCHARGE_SUMMARY' | string
  ocrConfidence?: number
  extractedEntitiesCount?: number
  date?: string
  patientName?: string
  tokenNumber?: string
  extractedFacts?: string[]
}

interface DocumentPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  document: PreviewDocumentData | null
}

export function DocumentPreviewModal({
  isOpen,
  onClose,
  document: doc,
}: DocumentPreviewModalProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(100)
  const [showOcrHighlights, setShowOcrHighlights] = useState<boolean>(true)

  // Reset zoom and handle Esc key
  useEffect(() => {
    if (isOpen) {
      setZoomLevel(100)
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose()
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen || !doc) return null

  const isPrescription =
    doc.type === 'PRESCRIPTION' ||
    doc.name.toLowerCase().includes('prescription') ||
    doc.name.toLowerCase().includes('rx')

  const isLabReport =
    doc.type === 'LAB_REPORT' ||
    doc.name.toLowerCase().includes('lab') ||
    doc.name.toLowerCase().includes('blood') ||
    doc.name.toLowerCase().includes('ecg')

  const isDischargeOrEmergency =
    doc.type === 'DISCHARGE_SUMMARY' ||
    doc.name.toLowerCase().includes('discharge') ||
    doc.name.toLowerCase().includes('paramedic') ||
    doc.name.toLowerCase().includes('ambulance')

  const confidence = doc.ocrConfidence
    ? Math.round(doc.ocrConfidence > 1 ? doc.ocrConfidence : doc.ocrConfidence * 100)
    : 96

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs">
        {/* Backdrop click to dismiss */}
        <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="relative bg-white rounded-2xl md:rounded-3xl shadow-2xl border border-[#DFE8F1] w-full max-w-4xl max-h-[92vh] flex flex-col z-10 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── 1. Modal Top Bar ── */}
          <div className="px-4 sm:px-6 py-3.5 border-b border-[#DFE8F1] bg-[#F8FAFC] flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#EEF5FC] text-[#2365B5] flex items-center justify-center shrink-0 border border-[#CBD8E5]">
                <FileText size={18} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-[14px] sm:text-[15.5px] font-extrabold text-[#17191F] truncate">
                    {doc.name}
                  </h2>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase border bg-[#EBFDF5] text-[#079455] border-[#A6F4C5]">
                    {confidence}% Clarity OCR
                  </span>
                </div>
                <p className="text-[11.5px] text-[#6F7480] truncate">
                  Scanned Document Digital Replica • Tap areas to inspect OCR vectors
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* OCR Toggle */}
              <button
                type="button"
                onClick={() => setShowOcrHighlights(!showOcrHighlights)}
                className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11.5px] font-bold border transition-colors cursor-pointer ${
                  showOcrHighlights
                    ? 'bg-[#EEF5FC] text-[#2365B5] border-[#CBD8E5]'
                    : 'bg-white text-[#6F7480] border-[#DFE8F1]'
                }`}
                title="Toggle OCR Highlighting Overlay"
              >
                <Sparkles size={12} />
                <span>OCR Highlights</span>
              </button>

              {/* Zoom Out */}
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(75, z - 15))}
                disabled={zoomLevel <= 75}
                className="p-1.5 rounded-lg border border-[#DFE8F1] bg-white text-[#4B5565] hover:bg-[#EEF5FC] disabled:opacity-40 transition-colors cursor-pointer"
                aria-label="Zoom out"
              >
                <ZoomOut size={15} />
              </button>

              <span className="text-[11.5px] font-mono font-bold text-[#6F7480] w-10 text-center select-none">
                {zoomLevel}%
              </span>

              {/* Zoom In */}
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
                disabled={zoomLevel >= 150}
                className="p-1.5 rounded-lg border border-[#DFE8F1] bg-white text-[#4B5565] hover:bg-[#EEF5FC] disabled:opacity-40 transition-colors cursor-pointer"
                aria-label="Zoom in"
              >
                <ZoomIn size={15} />
              </button>

              <div className="h-5 w-px bg-[#DFE8F1] mx-1" />

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg border border-[#DFE8F1] bg-white text-[#6F7480] hover:text-[#17191F] hover:bg-[#FEF3F2] hover:border-[#FECDCA] hover:text-[#D92D20] transition-colors cursor-pointer"
                aria-label="Close document preview"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* ── 2. Document Canvas Viewer (Scrollable) ── */}
          <div className="flex-1 overflow-auto bg-[#E5ECF2] p-4 sm:p-6 md:p-8 flex items-center justify-center min-h-[380px]">
            <div
              className="bg-white shadow-[0_10px_35px_rgba(0,0,0,0.12)] border border-[#CBD8E5] rounded-lg transition-transform duration-150 origin-top overflow-hidden select-text"
              style={{
                width: '100%',
                maxWidth: '680px',
                transform: `scale(${zoomLevel / 100})`,
              }}
            >
              {/* ──────────────────────────────────────────────────────────
                  A. PRESCRIPTION TEMPLATE
              ────────────────────────────────────────────────────────── */}
              {isPrescription && (
                <div className="p-6 sm:p-8 font-sans text-[#17191F] relative space-y-6">
                  {/* Subtle Stamp Watermark */}
                  <div className="absolute right-8 top-28 opacity-10 pointer-events-none rotate-[-15deg] select-none">
                    <div className="border-4 border-dashed border-[#2365B5] p-4 rounded-2xl text-center">
                      <span className="text-3xl font-black uppercase tracking-widest text-[#2365B5]">VERIFIED OCR</span>
                    </div>
                  </div>

                  {/* Hospital Letterhead */}
                  <div className="border-b-2 border-[#2365B5] pb-4 flex items-start justify-between gap-4">
                    <div>
                      <h1 className="text-[17px] sm:text-[19px] font-black text-[#174A91] tracking-tight uppercase">
                        Sahyadri Multi-Specialty Hospital
                      </h1>
                      <p className="text-[11.5px] text-[#4B5565] leading-relaxed">
                        Department of General Medicine &amp; Gastroenterology OPD
                      </p>
                      <p className="text-[10px] text-[#6F7480]">
                        Senapati Bapat Road, Pune 411004 • NABH Accredited • Reg: MH-PUN-2018-9941
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#EEF5FC] text-[#2365B5] border border-[#CBD8E5]">
                        OPD Rx Sheet
                      </span>
                      <p className="text-[10.5px] text-[#6F7480] mt-1 font-mono">Date: 21-Sept-2026</p>
                    </div>
                  </div>

                  {/* Patient Bio Strip */}
                  <div className="bg-[#F8FAFC] border border-[#DFE8F1] rounded-xl p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11.5px]">
                    <div>
                      <span className="text-[9.5px] uppercase font-bold text-[#6F7480] block">Patient Name</span>
                      <strong className="text-[#17191F]">{doc.patientName || 'Dhananjay Patil'}</strong>
                    </div>
                    <div>
                      <span className="text-[9.5px] uppercase font-bold text-[#6F7480] block">Age / Gender</span>
                      <span className="text-[#17191F] font-semibold">42 Y / Male</span>
                    </div>
                    <div>
                      <span className="text-[9.5px] uppercase font-bold text-[#6F7480] block">OPD Token</span>
                      <strong className="text-[#2365B5] font-mono">{doc.tokenNumber || 'A-028'}</strong>
                    </div>
                    <div>
                      <span className="text-[9.5px] uppercase font-bold text-[#6F7480] block">ABHA ID</span>
                      <span className="text-[#17191F] font-mono text-[10.5px]">dpatil@abdm</span>
                    </div>
                  </div>

                  {/* Clinical Indications & Diagnoses */}
                  <div className="space-y-1 text-[12.5px]">
                    <div className="flex items-center gap-1.5">
                      <strong className="text-[#4B5565] text-[11px] uppercase tracking-wider">Provisional Diagnosis:</strong>
                      <span className="font-bold text-[#17191F]">Non-Ulcer Dyspepsia (K30) / Functional Heartburn</span>
                    </div>
                    <p className="text-[11.5px] text-[#6F7480] italic">
                      Complaints: Epigastric burning sensation, post-prandial fullness x 3 months.
                    </p>
                  </div>

                  {/* Rx Symbol & Medication Table */}
                  <div className="space-y-2">
                    <div className="text-[26px] font-black font-serif text-[#2365B5] leading-none">
                      ℞
                    </div>

                    <div className="space-y-2.5">
                      {/* Medication 1 */}
                      <div
                        className={`p-2.5 rounded-lg border transition-all ${
                          showOcrHighlights
                            ? 'bg-[#F0FDF4] border-[#86EFAC] ring-1 ring-[#86EFAC]/40'
                            : 'bg-white border-[#DFE8F1]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[13px]">
                          <strong className="text-[#17191F]">1. Tab. Pantoprazole 40 mg</strong>
                          <span className="font-mono font-bold text-[#079455] text-[11.5px]">1 - 0 - 0</span>
                        </div>
                        <p className="text-[11.5px] text-[#4B5565] mt-0.5">
                          Instructions: 1 tablet daily 30 minutes before breakfast with water × 14 Days
                        </p>
                        {showOcrHighlights && (
                          <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider bg-white text-[#079455] border border-[#86EFAC] px-1.5 py-0.2 rounded">
                            ✓ OCR Extracted • Ref: Pantocid-40 • 98% match
                          </span>
                        )}
                      </div>

                      {/* Medication 2 */}
                      <div
                        className={`p-2.5 rounded-lg border transition-all ${
                          showOcrHighlights
                            ? 'bg-[#F0FDF4] border-[#86EFAC] ring-1 ring-[#86EFAC]/40'
                            : 'bg-white border-[#DFE8F1]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[13px]">
                          <strong className="text-[#17191F]">2. Tab. Domperidone 10 mg</strong>
                          <span className="font-mono font-bold text-[#079455] text-[11.5px]">1 - 0 - 1</span>
                        </div>
                        <p className="text-[11.5px] text-[#4B5565] mt-0.5">
                          Instructions: 1 tablet twice daily 15 minutes before lunch and dinner × 10 Days
                        </p>
                        {showOcrHighlights && (
                          <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider bg-white text-[#079455] border border-[#86EFAC] px-1.5 py-0.2 rounded">
                            ✓ OCR Extracted • Ref: Motilium-10 • 95% match
                          </span>
                        )}
                      </div>

                      {/* Medication 3 */}
                      <div
                        className={`p-2.5 rounded-lg border transition-all ${
                          showOcrHighlights
                            ? 'bg-[#F0FDF4] border-[#86EFAC] ring-1 ring-[#86EFAC]/40'
                            : 'bg-white border-[#DFE8F1]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[13px]">
                          <strong className="text-[#17191F]">3. Syp. Mucaine Gel (Oxetacaine + Aluminium Hydroxide)</strong>
                          <span className="font-mono font-bold text-[#079455] text-[11.5px]">10 ml SOS</span>
                        </div>
                        <p className="text-[11.5px] text-[#4B5565] mt-0.5">
                          Instructions: 2 teaspoonfuls after food during acute acid flare-ups
                        </p>
                        {showOcrHighlights && (
                          <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider bg-white text-[#079455] border border-[#86EFAC] px-1.5 py-0.2 rounded">
                            ✓ OCR Extracted • Ref: Antacid Gel • 94% match
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* General Dietary Advice */}
                  <div className="p-3 bg-[#FFFDF5] border border-[#FEF0C7] rounded-xl text-[11.5px] text-[#7A5E10] space-y-0.5">
                    <strong>Dietary Guidelines (Ahara / Pathya):</strong>
                    <p>Avoid late night meals, excessive red chili, caffeine, and carbonated beverages. Elevate head of bed by 15°.</p>
                  </div>

                  {/* Doctor Signature Block */}
                  <div className="pt-4 border-t border-[#DFE8F1] flex items-end justify-between">
                    <div className="text-[10.5px] text-[#6F7480]">
                      <p>Emergency Contact: 020-2560-0000</p>
                      <p>Next Follow-Up: In 2 weeks with USG Whole Abdomen</p>
                    </div>
                    <div className="text-right">
                      <div className="font-serif italic font-bold text-[15px] text-[#174A91] tracking-wide">
                        Dr. Sunita Rao
                      </div>
                      <p className="text-[11px] font-bold text-[#17191F]">Dr. Sunita Rao, MD (Medicine)</p>
                      <p className="text-[10px] text-[#6F7480]">Reg No: MMC-2012/04/1042</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ──────────────────────────────────────────────────────────
                  B. LAB REPORT / ECG TEMPLATE
              ────────────────────────────────────────────────────────── */}
              {isLabReport && (
                <div className="p-6 sm:p-8 font-sans text-[#17191F] relative space-y-5">
                  {/* Lab Header */}
                  <div className="border-b-2 border-[#D92D20] pb-3 flex items-start justify-between gap-4">
                    <div>
                      <h1 className="text-[17px] sm:text-[19px] font-black text-[#B42318] uppercase tracking-tight">
                        Metropolis Clinical Pathology &amp; Diagnostic Center
                      </h1>
                      <p className="text-[11.5px] text-[#4B5565]">
                        NABL Accredited Medical Testing Laboratory • ISO 15189 Certified
                      </p>
                      <p className="text-[10px] text-[#6F7480]">
                        Lab ID: NABL-MC-2041 • Barcode: #89201940129
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#FEF3F2] text-[#D92D20] border border-[#FECDCA]">
                        Diagnostic Panel
                      </span>
                      <p className="text-[10.5px] text-[#6F7480] mt-1 font-mono">Date: 20-Sept-2026</p>
                    </div>
                  </div>

                  {/* Patient Strip */}
                  <div className="bg-[#F8FAFC] border border-[#DFE8F1] rounded-xl p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11.5px]">
                    <div>
                      <span className="text-[9.5px] uppercase font-bold text-[#6F7480] block">Patient Name</span>
                      <strong className="text-[#17191F]">{doc.patientName || 'Priya Menon'}</strong>
                    </div>
                    <div>
                      <span className="text-[9.5px] uppercase font-bold text-[#6F7480] block">Age / Gender</span>
                      <span className="text-[#17191F] font-semibold">42 Y / Female</span>
                    </div>
                    <div>
                      <span className="text-[9.5px] uppercase font-bold text-[#6F7480] block">Sample Specimen</span>
                      <span className="text-[#17191F] font-semibold">Fasting Blood / Serum</span>
                    </div>
                    <div>
                      <span className="text-[9.5px] uppercase font-bold text-[#6F7480] block">Ref. Physician</span>
                      <span className="text-[#17191F] font-semibold">Dr. Sunita Rao, MD</span>
                    </div>
                  </div>

                  {/* Lab Results Table */}
                  <div className="overflow-x-auto rounded-xl border border-[#DFE8F1]">
                    <table className="w-full text-left text-[12px]">
                      <thead className="bg-[#F8FAFC] border-b border-[#DFE8F1] text-[10.5px] uppercase font-extrabold text-[#6F7480]">
                        <tr>
                          <th className="p-2.5">Investigation</th>
                          <th className="p-2.5">Observed Value</th>
                          <th className="p-2.5">Reference Range</th>
                          <th className="p-2.5">Unit</th>
                          <th className="p-2.5 text-right">Interpretation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#DFE8F1]">
                        {/* Row 1: Fasting Glucose */}
                        <tr className={showOcrHighlights ? 'bg-[#FEF3F2]' : 'bg-white'}>
                          <td className="p-2.5 font-bold text-[#17191F]">Fasting Blood Sugar (FBS)</td>
                          <td className="p-2.5 font-black text-[#D92D20]">142.0</td>
                          <td className="p-2.5 text-[#4B5565]">70.0 - 99.0</td>
                          <td className="p-2.5 text-[#6F7480]">mg/dL</td>
                          <td className="p-2.5 text-right">
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-[#FEF3F2] text-[#D92D20] border border-[#FECDCA]">
                              HIGH [FLAG]
                            </span>
                          </td>
                        </tr>

                        {/* Row 2: HbA1c */}
                        <tr className={showOcrHighlights ? 'bg-[#FEF3F2]' : 'bg-white'}>
                          <td className="p-2.5 font-bold text-[#17191F]">HbA1c (Glycated Hemoglobin)</td>
                          <td className="p-2.5 font-black text-[#D92D20]">8.4</td>
                          <td className="p-2.5 text-[#4B5565]">&lt; 5.7 Normal</td>
                          <td className="p-2.5 text-[#6F7480]">%</td>
                          <td className="p-2.5 text-right">
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-[#FEF3F2] text-[#D92D20] border border-[#FECDCA]">
                              DIABETIC [FLAG]
                            </span>
                          </td>
                        </tr>

                        {/* Row 3: Total Cholesterol */}
                        <tr className="bg-white">
                          <td className="p-2.5 font-bold text-[#17191F]">Serum Total Cholesterol</td>
                          <td className="p-2.5 font-bold text-[#B54708]">218.0</td>
                          <td className="p-2.5 text-[#4B5565]">&lt; 200.0</td>
                          <td className="p-2.5 text-[#6F7480]">mg/dL</td>
                          <td className="p-2.5 text-right">
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-[#FFFDF5] text-[#B54708] border border-[#FEF0C7]">
                              BORDERLINE
                            </span>
                          </td>
                        </tr>

                        {/* Row 4: Serum Creatinine */}
                        <tr className="bg-white">
                          <td className="p-2.5 font-bold text-[#17191F]">Serum Creatinine</td>
                          <td className="p-2.5 font-semibold text-[#079455]">0.95</td>
                          <td className="p-2.5 text-[#4B5565]">0.60 - 1.20</td>
                          <td className="p-2.5 text-[#6F7480]">mg/dL</td>
                          <td className="p-2.5 text-right">
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-[#EBFDF5] text-[#079455] border border-[#A6F4C5]">
                              NORMAL
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* 12-Lead ECG Addendum if ECG file */}
                  {doc.name.toLowerCase().includes('ecg') && (
                    <div className="p-3.5 rounded-xl border border-[#FECDCA] bg-[#FEF3F2] space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-[12.5px] font-extrabold text-[#D92D20]">
                          12-Lead Electrocardiogram (ECG) Findings:
                        </strong>
                        <span className="text-[10px] font-mono font-bold bg-white text-[#D92D20] px-1.5 py-0.5 rounded border border-[#FECDCA]">
                          EMERGENCY CODE
                        </span>
                      </div>
                      <p className="text-[12px] text-[#B42318] leading-relaxed">
                        Significant ST-segment elevation &gt; 2.2 mm observed in leads V1, V2, V3, and V4 with reciprocal ST depressions in leads II, III, aVF. Consistent with acute Anteroseptal ST-Elevation Myocardial Infarction (STEMI).
                      </p>
                    </div>
                  )}

                  {/* Lab Signatures */}
                  <div className="pt-3 border-t border-[#DFE8F1] flex items-center justify-between text-[10.5px] text-[#6F7480]">
                    <div>
                      <p>Electronically Verified Report • No physical signature required</p>
                      <p>Laboratory Accreditation ID: NABL-ISO-15189</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#17191F]">Dr. V. K. Deshmukh, MD (Pathology)</p>
                      <p>Chief Consultant Pathologist</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ──────────────────────────────────────────────────────────
                  C. DISCHARGE SUMMARY / PARAMEDIC NOTE TEMPLATE
              ────────────────────────────────────────────────────────── */}
              {isDischargeOrEmergency && (
                <div className="p-6 sm:p-8 font-sans text-[#17191F] relative space-y-5">
                  <div className="border-b-2 border-[#D92D20] pb-3 flex items-start justify-between gap-4">
                    <div>
                      <h1 className="text-[17px] sm:text-[19px] font-black text-[#D92D20] uppercase tracking-tight">
                        Maharashtra Emergency Medical Services (108)
                      </h1>
                      <p className="text-[11.5px] text-[#4B5565]">
                        Pre-Hospital Acute Triage &amp; Paramedic Handover Record
                      </p>
                      <p className="text-[10px] text-[#6F7480]">
                        Ambulance Unit: MH-12-EM-9921 • Base Station: Swargate Triage Hub
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#FEF3F2] text-[#D92D20] border border-[#FECDCA]">
                        CODE RED EMERGENCY
                      </span>
                      <p className="text-[10.5px] text-[#6F7480] mt-1 font-mono">Time: 10:14 AM</p>
                    </div>
                  </div>

                  <div className="bg-[#FEF3F2] border border-[#FECDCA] rounded-xl p-3 space-y-2 text-[12px]">
                    <div className="flex items-center justify-between">
                      <strong className="text-[#D92D20] font-black text-[13px]">
                        En-Route Vitals &amp; Clinical Assessment
                      </strong>
                      <span className="text-[10.5px] font-mono bg-white px-2 py-0.5 rounded border border-[#FECDCA] font-bold text-[#D92D20]">
                        SpO2: 93% • BP: 146/94
                      </span>
                    </div>
                    <p className="text-[#17191F] leading-relaxed">
                      Patient presented with sudden severe retrosternal crushing pain with diaphoresis, radiating to left arm. Onset 2 hours prior. Pulse 112 bpm regular. Oxygen administered via nasal cannula at 4 L/min.
                    </p>
                    <div className="p-2.5 bg-white rounded-lg border border-[#FECDCA] space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#D92D20] block">
                        Emergency Medications Administered in Ambulance:
                      </span>
                      <p className="font-bold text-[#17191F]">
                        • Tab. Aspirin 300 mg (Chewed immediately) at 10:18 AM
                      </p>
                      <p className="font-bold text-[#17191F]">
                        • Tab. Sorbitrate 5 mg (Sublingual) at 10:22 AM
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#DFE8F1] flex items-center justify-between text-[10.5px] text-[#6F7480]">
                    <div>
                      <p>Handover to: Casualty Medical Officer (CMO), Station #04</p>
                      <p>Transit duration: 18 minutes</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#17191F]">Officer R. Jadhav, EMT-P</p>
                      <p>Lead Paramedic #4028</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── 3. Bottom Action & Provenance Footer ── */}
          <div className="px-4 sm:px-6 py-3 border-t border-[#DFE8F1] bg-white flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 text-[12px] text-[#4B5565] flex-wrap">
              <span className="flex items-center gap-1 font-bold text-[#079455]">
                <CheckCircle2 size={14} /> FHIR R4 DiagnosticReport Linked
              </span>
              <span>•</span>
              <span className="text-[#6F7480]">
                Extraction Source: Google Document AI OCR Engine
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2 rounded-xl text-white text-[13px] font-extrabold transition-all shadow-xs bg-[#2365B5] hover:bg-[#174A91] cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
