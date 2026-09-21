'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart,
  FileText,
  Pill,
  Clock,
  Calendar,
  User,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Eye,
  X,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Activity,
  MapPin,
  Stethoscope,
  Sparkles,
  Search,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Phone,
  Info,
} from 'lucide-react'
import VaidyaWordmark from '@/components/VaidyaWordmark'
import {
  DEMO_PATIENTS,
  getPatientPortalData,
  PatientPortalData,
  PatientPrescriptionItem,
} from '@/constants/demo-data'
import { formatIndianDate } from '@/lib/utils'
import { useAuthStore } from '@/store'
import type { MedicalDocument } from '@/types'

type PortalTab =
  | 'OVERVIEW'
  | 'TIMELINE'
  | 'DOCUMENTS'
  | 'PRESCRIPTIONS'
  | 'CONSULTATIONS'
  | 'INTAKE_DATA'

function PatientDashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { logout, user } = useAuthStore()

  // Support patientId query param (e.g. ?patientId=pat-002) or default to pat-001
  const paramPatientId = searchParams.get('patientId') || (user?.id?.startsWith('pat-') ? user.id : 'pat-001')
  const [selectedPatientId, setSelectedPatientId] = useState<string>(paramPatientId)

  useEffect(() => {
    if (searchParams.get('patientId')) {
      setSelectedPatientId(searchParams.get('patientId')!)
    }
  }, [searchParams])

  const [activeTab, setActiveTab] = useState<PortalTab>('OVERVIEW')
  const [selectedDoc, setSelectedDoc] = useState<MedicalDocument | null>(null)
  const [imageZoom, setImageZoom] = useState<number>(1)

  // Fetch structured patient data via adapter
  const portalData: PatientPortalData = getPatientPortalData(selectedPatientId)
  const { patient, encounters, documents, prescriptions, consultations, intakeSubmissions, timeline } = portalData

  const handlePatientSwitch = (patientId: string) => {
    setSelectedPatientId(patientId)
    router.push(`/patient/dashboard?patientId=${patientId}`)
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const handleOpenDocModal = (doc: MedicalDocument) => {
    setSelectedDoc(doc)
    setImageZoom(1)
  }

  const handleCloseDocModal = () => {
    setSelectedDoc(null)
    setImageZoom(1)
  }

  // Plain-language document type label
  const getPlainDocTypeLabel = (docType: string) => {
    switch (docType) {
      case 'PRESCRIPTION': return 'Prescription Slip'
      case 'LAB_REPORT': return 'Laboratory Test Report'
      case 'DISCHARGE_SUMMARY': return 'Hospital Discharge Summary'
      case 'REFERRAL_LETTER': return 'Doctor Referral Letter'
      default: return 'Medical Record'
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8FF] flex flex-col text-[#191B23] antialiased selection:bg-[#006A61] selection:text-white">
      {/* ─── Top Navigation Bar ────────────────────────────────────── */}
      <header className="bg-white border-b border-[#E1E2ED] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <VaidyaWordmark size="sm" showDescriptor={false} />
            </Link>
            <div className="h-4 w-px bg-[#E1E2ED] hidden sm:block" />
            <span className="hidden sm:inline-block text-[11px] font-bold uppercase tracking-wider text-[#006A61] bg-[#F0FDF4] px-2.5 py-0.5 rounded-full border border-[#BBF7D0]">
              Patient Self-Service Portal
            </span>
          </div>

          {/* Quick Demo Switcher + Patient Profile + Logout */}
          <div className="flex items-center gap-3">
            {/* Demo Patient Selector for Quick Evaluation */}
            <div className="hidden lg:flex items-center gap-1 bg-[#FAF8FF] p-1 rounded-xl border border-[#E1E2ED] text-[11.5px]">
              <span className="text-[#71717A] px-2 font-medium">Viewing Account:</span>
              <button
                onClick={() => handlePatientSwitch('pat-001')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  selectedPatientId === 'pat-001'
                    ? 'bg-[#006A61] text-white shadow-xs'
                    : 'text-[#52525B] hover:text-[#18181B] hover:bg-white'
                }`}
              >
                Dhananjay Patil (67M)
              </button>
              <button
                onClick={() => handlePatientSwitch('pat-002')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  selectedPatientId === 'pat-002'
                    ? 'bg-[#006A61] text-white shadow-xs'
                    : 'text-[#52525B] hover:text-[#18181B] hover:bg-white'
                }`}
              >
                Priya Menon (42F)
              </button>
            </div>

            {/* Patient Badge */}
            <div className="flex items-center gap-2.5 bg-teal-50/70 border border-teal-200/80 px-3 py-1.5 rounded-xl">
              <div className="w-7 h-7 rounded-lg bg-[#006A61] text-white flex items-center justify-center font-bold text-xs shrink-0">
                {patient.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className="text-left leading-tight">
                <p className="text-[12.5px] font-bold text-[#18181B]">{patient.name}</p>
                <p className="text-[10.5px] font-mono text-teal-800">
                  ABHA: {patient.abhaNumber ?? 'Linked'}
                </p>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-[#71717A] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
              title="Log out of Patient Portal"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* ─── Main Content Container ────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex flex-col gap-6">
        
        {/* Patient Identity Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E1E2ED] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-[#006A61] to-[#004D40] text-white flex items-center justify-center font-extrabold text-2xl shrink-0 shadow-sm shadow-teal-700/20">
              {patient.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-[24px] sm:text-[28px] font-bold text-[#18181B] tracking-tight">
                  {patient.name}
                </h1>
                <span className="bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0] px-2.5 py-0.5 rounded-full text-[11px] font-bold inline-flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-[#16A34A]" />
                  <span>ABHA Verified Profile</span>
                </span>
              </div>
              <p className="text-[13.5px] text-[#52525B]">
                {patient.age} years old • {patient.sex === 'M' ? 'Male' : 'Female'} • Registered Mobile: +91 {patient.phone ?? '9876543210'}
              </p>
              {patient.abhaNumber && (
                <p className="text-[12px] font-mono font-semibold text-[#006A61] pt-0.5">
                  ABHA ID: {patient.abhaNumber}
                </p>
              )}
            </div>
          </div>

          {/* Quick Stat Counters */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 bg-[#FAF8FF] p-3 sm:p-4 rounded-2xl border border-[#E1E2ED]">
            <div className="text-center px-2">
              <p className="text-[20px] sm:text-[22px] font-bold text-[#006A61]">{encounters.length}</p>
              <p className="text-[11px] font-medium text-[#71717A] uppercase tracking-wider">Visits</p>
            </div>
            <div className="text-center px-2 border-x border-[#E1E2ED]">
              <p className="text-[20px] sm:text-[22px] font-bold text-[#004AC6]">{documents.length}</p>
              <p className="text-[11px] font-medium text-[#71717A] uppercase tracking-wider">Documents</p>
            </div>
            <div className="text-center px-2">
              <p className="text-[20px] sm:text-[22px] font-bold text-emerald-600">{prescriptions.length}</p>
              <p className="text-[11px] font-medium text-[#71717A] uppercase tracking-wider">Medicines</p>
            </div>
          </div>
        </div>

        {/* ─── Navigation Tabs ─── */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#E1E2ED] text-[13px] font-bold">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'OVERVIEW'
                ? 'bg-[#006A61] text-white shadow-xs'
                : 'text-[#71717A] hover:text-[#18181B] hover:bg-white'
            }`}
          >
            <Activity size={15} />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('TIMELINE')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'TIMELINE'
                ? 'bg-[#006A61] text-white shadow-xs'
                : 'text-[#71717A] hover:text-[#18181B] hover:bg-white'
            }`}
          >
            <Clock size={15} />
            <span>Visit History &amp; Timeline</span>
          </button>

          <button
            onClick={() => setActiveTab('DOCUMENTS')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'DOCUMENTS'
                ? 'bg-[#006A61] text-white shadow-xs'
                : 'text-[#71717A] hover:text-[#18181B] hover:bg-white'
            }`}
          >
            <FileText size={15} />
            <span>My Documents ({documents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('PRESCRIPTIONS')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'PRESCRIPTIONS'
                ? 'bg-[#006A61] text-white shadow-xs'
                : 'text-[#71717A] hover:text-[#18181B] hover:bg-white'
            }`}
          >
            <Pill size={15} />
            <span>Prescriptions ({prescriptions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('CONSULTATIONS')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'CONSULTATIONS'
                ? 'bg-[#006A61] text-white shadow-xs'
                : 'text-[#71717A] hover:text-[#18181B] hover:bg-white'
            }`}
          >
            <Stethoscope size={15} />
            <span>Consultation Notes</span>
          </button>

          <button
            onClick={() => setActiveTab('INTAKE_DATA')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'INTAKE_DATA'
                ? 'bg-[#006A61] text-white shadow-xs'
                : 'text-[#71717A] hover:text-[#18181B] hover:bg-white'
            }`}
          >
            <Heart size={15} />
            <span>Kiosk Intake Submissions</span>
          </button>
        </div>

        {/* ─── TAB CONTENT ────────────────────────────────────────── */}

        {/* ══════════════════════════════════════════════════════════════
            TAB 1: OVERVIEW
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6">
            {/* Welcome Greeting Card */}
            <div className="bg-gradient-to-r from-teal-900 to-teal-800 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
              <div className="relative z-10 max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-[12px] font-semibold text-teal-100 backdrop-blur-xs">
                  <Sparkles size={14} className="text-amber-300" />
                  <span>Personal Health Records</span>
                </div>
                <h2 className="text-[22px] sm:text-[26px] font-bold tracking-tight">
                  Welcome back, {patient.name.split(' ')[0]}
                </h2>
                <p className="text-[14px] text-teal-100/90 leading-relaxed">
                  All your past prescriptions, lab test reports, and visit records from VAIDYA hospital terminals are securely available below.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab('DOCUMENTS')}
                    className="px-4 py-2 rounded-xl bg-white text-[#006A61] font-bold text-[13px] hover:bg-teal-50 transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <span>View My Documents</span>
                    <ArrowRightIcon size={14} />
                  </button>
                  <button
                    onClick={() => setActiveTab('PRESCRIPTIONS')}
                    className="px-4 py-2 rounded-xl bg-teal-700/60 border border-teal-500/40 text-white font-bold text-[13px] hover:bg-teal-700 transition-colors flex items-center gap-1.5"
                  >
                    <span>Review Prescriptions</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Section Grid: Recent Encounter & Quick Shortcuts */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Latest Visit Card (7 Cols) */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#E1E2ED] shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E1E2ED]">
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-[#006A61]" />
                    <h3 className="text-[16px] font-bold text-[#18181B]">Most Recent OPD Visit</h3>
                  </div>
                  <span className="text-[11.5px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                    15 Aug 2026
                  </span>
                </div>

                {consultations.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-[15px] font-bold text-[#18181B]">
                          {consultations[0].physicianName}
                        </h4>
                        <p className="text-[12.5px] text-[#52525B]">
                          Department of {consultations[0].department} • Token #{consultations[0].tokenNumber ?? 'A-028'}
                        </p>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 shrink-0">
                        {consultations[0].status}
                      </span>
                    </div>

                    <div className="bg-[#FAF8FF] p-4 rounded-2xl border border-[#E1E2ED] space-y-1.5">
                      <p className="text-[12px] font-bold text-[#71717A] uppercase tracking-wider">
                        Reason for Visit / Chief Concern
                      </p>
                      <p className="text-[13.5px] font-medium text-[#18181B]">
                        {consultations[0].chiefComplaint}
                      </p>
                    </div>

                    <div className="bg-teal-50/50 p-4 rounded-2xl border border-teal-100 space-y-1.5">
                      <p className="text-[12px] font-bold text-teal-800 uppercase tracking-wider">
                        Doctor&apos;s Consultation Summary
                      </p>
                      <p className="text-[13px] text-teal-950 leading-relaxed">
                        {consultations[0].summaryNote}
                      </p>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => setActiveTab('CONSULTATIONS')}
                        className="text-[13px] font-bold text-[#006A61] hover:underline flex items-center gap-1"
                      >
                        <span>View complete consultation details</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-[13px] text-[#71717A]">No recent visits recorded.</p>
                )}
              </div>

              {/* Quick Actions & Records Overview (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                
                {/* Documents Shortcut Card */}
                <div
                  onClick={() => setActiveTab('DOCUMENTS')}
                  className="bg-white rounded-2xl p-5 border border-[#E1E2ED] shadow-2xs hover:border-[#006A61] hover:shadow-xs transition-all cursor-pointer group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#004AC6] flex items-center justify-center shrink-0 group-hover:bg-[#004AC6] group-hover:text-white transition-colors">
                      <FileText size={22} />
                    </div>
                    <div>
                      <h4 className="text-[14.5px] font-bold text-[#18181B] group-hover:text-[#004AC6] transition-colors">
                        Scanned Medical Documents
                      </h4>
                      <p className="text-[12px] text-[#71717A]">
                        {documents.length} verified documents attached
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-[#71717A] group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Prescriptions Shortcut Card */}
                <div
                  onClick={() => setActiveTab('PRESCRIPTIONS')}
                  className="bg-white rounded-2xl p-5 border border-[#E1E2ED] shadow-2xs hover:border-[#006A61] hover:shadow-xs transition-all cursor-pointer group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                      <Pill size={22} />
                    </div>
                    <div>
                      <h4 className="text-[14.5px] font-bold text-[#18181B] group-hover:text-emerald-700 transition-colors">
                        Current Prescriptions
                      </h4>
                      <p className="text-[12px] text-[#71717A]">
                        {prescriptions.length} prescribed medications on file
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-[#71717A] group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Kiosk Intake Data Shortcut Card */}
                <div
                  onClick={() => setActiveTab('INTAKE_DATA')}
                  className="bg-white rounded-2xl p-5 border border-[#E1E2ED] shadow-2xs hover:border-[#006A61] hover:shadow-xs transition-all cursor-pointer group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#006A61] flex items-center justify-center shrink-0 group-hover:bg-[#006A61] group-hover:text-white transition-colors">
                      <Heart size={22} />
                    </div>
                    <div>
                      <h4 className="text-[14.5px] font-bold text-[#18181B] group-hover:text-[#006A61] transition-colors">
                        Kiosk Check-in Submissions
                      </h4>
                      <p className="text-[12px] text-[#71717A]">
                        Review symptoms captured at the kiosk
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-[#71717A] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 2: VISIT HISTORY & TIMELINE
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'TIMELINE' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E1E2ED] shadow-xs space-y-6">
              <div>
                <h3 className="text-[18px] font-bold text-[#18181B]">Chronological Health Timeline</h3>
                <p className="text-[13px] text-[#71717A] mt-0.5">
                  A complete chronological record of hospital visits, diagnoses, surgeries, and recorded health milestones.
                </p>
              </div>

              {/* Timeline Container */}
              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E1E2ED]">
                {timeline.map((event, idx) => (
                  <div key={event.id || idx} className="relative group">
                    {/* Node Dot */}
                    <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-white border-2 border-[#006A61] flex items-center justify-center shadow-xs">
                      <div className="w-2 h-2 rounded-full bg-[#006A61]" />
                    </div>

                    {/* Timeline Card */}
                    <div className="bg-[#FAF8FF] p-5 rounded-2xl border border-[#E1E2ED] group-hover:border-teal-300 group-hover:bg-white transition-all space-y-2 shadow-2xs">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[12px] font-bold font-mono text-[#006A61] bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                          {event.eventDate}
                        </span>
                        <span className="text-[11px] text-[#71717A] font-medium">
                          {event.datePrecision === 'EXACT' ? 'Exact Date' : 'Approximate'}
                        </span>
                      </div>

                      <h4 className="text-[15px] font-bold text-[#18181B]">
                        {event.title}
                      </h4>

                      {event.detail && (
                        <p className="text-[13px] text-[#52525B] leading-relaxed">
                          {event.detail}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 3: MY DOCUMENTS (With Exact File Paths & Image Modal)
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'DOCUMENTS' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-[18px] font-bold text-[#18181B]">Uploaded &amp; Scanned Documents</h3>
                <p className="text-[13px] text-[#71717A] mt-0.5">
                  Original paper slips, prescriptions, and lab diagnostic sheets digitized during your intake.
                </p>
              </div>
              <span className="text-[12px] font-bold text-[#006A61] bg-teal-50 px-3 py-1 rounded-full border border-teal-200 self-start sm:self-auto">
                {documents.length} Records On File
              </span>
            </div>

            {/* Document Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-3xl border border-[#E1E2ED] shadow-2xs hover:shadow-sm hover:border-[#006A61] transition-all flex flex-col justify-between overflow-hidden group"
                >
                  {/* Top Thumbnail / Preview Strip */}
                  <div className="relative h-44 bg-[#F4F4F8] border-b border-[#E1E2ED] flex items-center justify-center overflow-hidden cursor-pointer"
                    onClick={() => handleOpenDocModal(doc)}
                  >
                    {doc.imageUrl ? (
                      <Image
                        src={doc.imageUrl}
                        alt={doc.originalFilename}
                        fill
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <FileText size={40} className="text-[#A1A1AA] mx-auto mb-2" />
                        <span className="text-[12px] text-[#71717A] font-medium">Scanned Document</span>
                      </div>
                    )}

                    {/* Document Type Badge */}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[#18181B] font-bold text-[11px] px-2.5 py-1 rounded-lg border border-[#E1E2ED] shadow-2xs">
                      {getPlainDocTypeLabel(doc.documentType)}
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-[13px]">
                      <Eye size={18} />
                      <span>Click to View</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11.5px] text-[#71717A]">
                        <span className="flex items-center gap-1 font-medium">
                          <Calendar size={13} />
                          {doc.uploadedAt ? formatIndianDate(doc.uploadedAt) : '15 Aug 2026'}
                        </span>
                        <span className="font-mono">{doc.pageCount ?? 1} Page</span>
                      </div>

                      <h4 className="text-[14.5px] font-bold text-[#18181B] line-clamp-1 leading-snug">
                        {doc.originalFilename.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')}
                      </h4>

                      {doc.extractedTextSnippet && (
                        <p className="text-[12px] text-[#52525B] bg-[#FAF8FF] p-2.5 rounded-xl border border-[#E1E2ED] line-clamp-2 leading-relaxed">
                          {doc.extractedTextSnippet}
                        </p>
                      )}
                    </div>

                    {/* View Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenDocModal(doc)}
                      className="w-full h-10 rounded-xl bg-teal-50 hover:bg-[#006A61] text-[#006A61] hover:text-white font-bold text-[13px] transition-all flex items-center justify-center gap-2"
                    >
                      <Eye size={15} />
                      <span>View Full Image</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 4: PRESCRIPTIONS
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'PRESCRIPTIONS' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-[18px] font-bold text-[#18181B]">Medications &amp; Prescriptions</h3>
                <p className="text-[13px] text-[#71717A] mt-0.5">
                  Extracted from your doctor prescriptions and verified for your records.
                </p>
              </div>
              <span className="text-[12px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
                {prescriptions.length} Prescriptions Listed
              </span>
            </div>

            {/* Prescriptions List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {prescriptions.map((rx) => (
                <div
                  key={rx.id}
                  className="bg-white rounded-3xl p-6 border border-[#E1E2ED] shadow-2xs hover:border-emerald-300 transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                          <Pill size={20} />
                        </div>
                        <div>
                          <h4 className="text-[16px] font-bold text-[#18181B]">
                            {rx.medicationName}
                          </h4>
                          <span className="text-[12px] font-bold text-emerald-700 bg-emerald-50/80 px-2 py-0.5 rounded-md">
                            Strength: {rx.dosage}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#FAF8FF] p-3.5 rounded-2xl border border-[#E1E2ED] space-y-1.5 text-[12.5px]">
                      <div className="flex items-center justify-between text-[#52525B]">
                        <span className="font-medium text-[#71717A]">Instructions / Schedule:</span>
                        <span className="font-bold text-[#18181B] text-right">{rx.frequency}</span>
                      </div>
                      <div className="flex items-center justify-between text-[#52525B]">
                        <span className="font-medium text-[#71717A]">Date Prescribed:</span>
                        <span className="font-bold text-[#18181B]">{rx.prescribedDate}</span>
                      </div>
                      <div className="flex items-center justify-between text-[#52525B]">
                        <span className="font-medium text-[#71717A]">Doctor / Facility:</span>
                        <span className="font-semibold text-teal-800 text-right">{rx.facilityName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Linked Document Slip Affordance */}
                  {rx.documentImageUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        const matchingDoc = documents.find((d) => d.id === rx.sourceDocId) || documents[0]
                        handleOpenDocModal(matchingDoc)
                      }}
                      className="w-full py-2.5 px-4 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/70 text-emerald-900 font-bold text-[12.5px] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Eye size={15} />
                      <span>View Original Prescription Slip</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 5: CONSULTATION HISTORY
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'CONSULTATIONS' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-[18px] font-bold text-[#18181B]">Doctor Consultations &amp; Clinical Notes</h3>
              <p className="text-[13px] text-[#71717A] mt-0.5">
                Summaries of consultations conducted by attending physicians.
              </p>
            </div>

            <div className="space-y-4">
              {consultations.map((cons) => (
                <div
                  key={cons.id}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E1E2ED] shadow-2xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E1E2ED] gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#006A61] flex items-center justify-center shrink-0">
                        <Stethoscope size={20} />
                      </div>
                      <div>
                        <h4 className="text-[16px] font-bold text-[#18181B]">{cons.physicianName}</h4>
                        <p className="text-[12px] text-[#71717A]">
                          {cons.department} • Token #{cons.tokenNumber ?? 'A-028'}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11.5px] font-bold font-mono text-[#006A61] bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200 self-start sm:self-auto">
                      {formatIndianDate(cons.date)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <span className="text-[11.5px] font-bold uppercase tracking-wider text-[#71717A]">
                        Chief Complaint / Purpose of Visit
                      </span>
                      <p className="text-[14px] font-semibold text-[#18181B]">
                        {cons.chiefComplaint}
                      </p>
                    </div>

                    <div className="bg-teal-50/40 p-4 rounded-2xl border border-teal-100/80 space-y-1">
                      <span className="text-[11.5px] font-bold uppercase tracking-wider text-teal-800">
                        Physician Summary &amp; Recommendations
                      </span>
                      <p className="text-[13.5px] text-teal-950 leading-relaxed">
                        {cons.summaryNote}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 6: DATA SUBMITTED PER VISIT (Kiosk Intake)
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'INTAKE_DATA' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 p-5 rounded-3xl flex items-start gap-3.5">
              <Info size={22} className="text-[#006A61] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[14.5px] font-bold text-teal-950">
                  Information Recorded at the Hospital Kiosk
                </h4>
                <p className="text-[12.5px] text-teal-900 leading-relaxed mt-0.5">
                  Here is the exact record of the symptoms, pain intensity, duration, and details you submitted at the self-service check-in terminal.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {intakeSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E1E2ED] shadow-xs space-y-5"
                >
                  <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#E1E2ED] gap-2">
                    <span className="text-[13px] font-bold text-[#18181B] flex items-center gap-1.5">
                      <Clock size={15} className="text-[#006A61]" />
                      <span>Intake Session: {formatIndianDate(sub.date)}</span>
                    </span>
                    <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                      Encounter #{sub.encounterId}
                    </span>
                  </div>

                  {/* Chief Complaint in Patient's Language + Translation */}
                  <div className="space-y-2">
                    <span className="text-[11.5px] font-bold uppercase tracking-wider text-[#71717A]">
                      Spoken / Reported Problem
                    </span>
                    <div className="p-4 rounded-2xl bg-[#FAF8FF] border border-[#E1E2ED] space-y-2">
                      <p className="text-[15px] font-bold text-[#18181B]">
                        &ldquo;{sub.reportedComplaint}&rdquo;
                      </p>
                      {sub.translatedComplaint && (
                        <p className="text-[12.5px] text-[#52525B] italic">
                          Standard translation: {sub.translatedComplaint}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Intake Parameter Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    {/* Pain Severity */}
                    <div className="bg-[#FAF8FF] p-4 rounded-2xl border border-[#E1E2ED] space-y-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717A]">
                        Reported Pain Severity
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-[24px] font-extrabold text-[#006A61]">
                          {sub.painSeverity ?? 7}
                        </span>
                        <span className="text-[12px] font-bold text-[#71717A]">/ 10</span>
                      </div>
                      <div className="w-full h-2 bg-[#E1E2ED] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#006A61] rounded-full"
                          style={{ width: `${((sub.painSeverity ?? 7) / 10) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="bg-[#FAF8FF] p-4 rounded-2xl border border-[#E1E2ED] space-y-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717A]">
                        Duration of Symptoms
                      </span>
                      <p className="text-[16px] font-bold text-[#18181B] pt-1">
                        {sub.duration ?? 'Not specified'}
                      </p>
                    </div>

                    {/* Body Area */}
                    <div className="bg-[#FAF8FF] p-4 rounded-2xl border border-[#E1E2ED] space-y-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717A]">
                        Body Location Selected
                      </span>
                      <p className="text-[15px] font-bold text-[#18181B] pt-1 flex items-center gap-1.5">
                        <MapPin size={15} className="text-[#006A61]" />
                        <span>{sub.bodyArea ?? 'General'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Associated Symptoms */}
                  {sub.associatedSymptoms && sub.associatedSymptoms.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[11.5px] font-bold uppercase tracking-wider text-[#71717A]">
                        Specific Symptoms Selected
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {sub.associatedSymptoms.map((sym, sIdx) => (
                          <span
                            key={sIdx}
                            className="bg-teal-50 text-[#006A61] border border-teal-200 px-3 py-1 rounded-xl text-[12.5px] font-semibold"
                          >
                            ✓ {sym}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Lifestyle / Dietary Notes */}
                  {sub.lifestyleNotes && (
                    <div className="space-y-1.5 bg-[#FAF8FF] p-4 rounded-2xl border border-[#E1E2ED]">
                      <span className="text-[11.5px] font-bold uppercase tracking-wider text-[#71717A]">
                        Reported Dietary / Lifestyle Factors
                      </span>
                      <p className="text-[13px] text-[#52525B]">
                        {sub.lifestyleNotes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ─── Document Image Preview Modal (Reusing Exact Files) ─────── */}
      <AnimatePresence>
        {selectedDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
            onClick={handleCloseDocModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-[#E1E2ED]"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-[#E1E2ED] flex items-center justify-between gap-4 bg-white shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-teal-50 text-[#006A61] border border-teal-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                      {getPlainDocTypeLabel(selectedDoc.documentType)}
                    </span>
                    <span className="text-[12px] text-[#71717A]">
                      {selectedDoc.uploadedAt ? formatIndianDate(selectedDoc.uploadedAt) : '15 Aug 2026'}
                    </span>
                  </div>
                  <h3 className="text-[16px] font-bold text-[#18181B] mt-1 line-clamp-1">
                    {selectedDoc.originalFilename}
                  </h3>
                </div>

                {/* Controls & Close */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setImageZoom((z) => Math.min(z + 0.25, 2.5))}
                    className="p-2 rounded-xl bg-[#FAF8FF] hover:bg-[#E1E2ED] text-[#18181B] transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn size={16} />
                  </button>
                  <button
                    onClick={() => setImageZoom((z) => Math.max(z - 0.25, 0.75))}
                    className="p-2 rounded-xl bg-[#FAF8FF] hover:bg-[#E1E2ED] text-[#18181B] transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut size={16} />
                  </button>
                  <button
                    onClick={() => setImageZoom(1)}
                    className="p-2 rounded-xl bg-[#FAF8FF] hover:bg-[#E1E2ED] text-[#18181B] transition-colors"
                    title="Reset Zoom"
                  >
                    <RefreshCw size={16} />
                  </button>
                  <button
                    onClick={handleCloseDocModal}
                    className="p-2 rounded-xl bg-[#FAF8FF] hover:bg-[#FEF2F2] hover:text-[#DC2626] text-[#71717A] transition-colors"
                    title="Close Preview"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Image Viewport */}
              <div className="flex-1 bg-[#1A1A1E] p-4 flex items-center justify-center overflow-auto min-h-[350px]">
                {selectedDoc.imageUrl ? (
                  <div
                    className="transition-transform duration-200"
                    style={{ transform: `scale(${imageZoom})` }}
                  >
                    <Image
                      src={selectedDoc.imageUrl}
                      alt={selectedDoc.originalFilename}
                      width={800}
                      height={1050}
                      className="rounded-lg max-h-[70vh] w-auto object-contain shadow-lg"
                    />
                  </div>
                ) : (
                  <p className="text-white text-[14px]">Document image preview unavailable</p>
                )}
              </div>

              {/* Modal Footer (Plain Language Description Only) */}
              <div className="p-4 bg-[#FAF8FF] border-t border-[#E1E2ED] text-[12.5px] text-[#52525B] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                <p className="line-clamp-1">
                  📄 Digital image preserved under your ABHA health record.
                </p>
                <button
                  onClick={handleCloseDocModal}
                  className="px-4 py-2 rounded-xl bg-[#006A61] hover:bg-[#00574F] text-white font-bold text-[12.5px] transition-colors self-end sm:self-auto"
                >
                  Close Document
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Footer ────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-[#E1E2ED] py-6 text-center text-[12px] text-[#71717A] mt-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 VAIDYA Clinical Intelligence • Patient Self-Service Portal</p>
          <div className="flex items-center gap-4 text-[#006A61] font-semibold">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/kiosk" className="hover:underline">Kiosk Terminal</Link>
            <Link href="/auth/login" className="hover:underline">Physician Workspace</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function ArrowRightIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

export default function PatientDashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF8FF] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#006A61] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PatientDashboardContent />
    </Suspense>
  )
}
