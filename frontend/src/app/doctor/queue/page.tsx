'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  Users,
  Clock,
  AlertTriangle,
  ChevronRight,
  RefreshCw,
  X,
  Stethoscope,
  CheckCircle2,
  Activity,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

import { DEMO_ENCOUNTERS, DEMO_PATIENTS } from '@/constants/demo-data'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { SlidingSegmentedTabs, type TabOption } from '@/components/ui/SlidingSegmentedTabs'

const DOCTOR_QUEUE_STATUS_TABS: TabOption<StatusFilter>[] = [
  { id: 'ALL', label: 'All Patients' },
  { id: 'READY_FOR_REVIEW', label: 'Prepared' },
  { id: 'UNDER_PHYSICIAN_REVIEW', label: 'In Review' },
]

type StatusFilter = 'ALL' | 'READY_FOR_REVIEW' | 'UNDER_PHYSICIAN_REVIEW' | 'PROCESSING_DOCUMENTS' | 'INTERVIEWING'
type PriorityFilter = 'ALL' | 'URGENT' | 'NORMAL'

interface PatientMeta {
  complaint: string
  priority: 'URGENT' | 'NORMAL'
  docs: number
  waitMin: number
  language: string
  intakeSummary: string
  duration?: string
}

const PATIENT_METRICS: Record<string, PatientMeta> = {
  'enc-001': {
    complaint: 'Epigastric burning pain & post-prandial indigestion',
    priority: 'NORMAL',
    docs: 3,
    waitMin: 14,
    language: 'मराठी',
    intakeSummary: 'Voice (मराठी) + OCR',
    duration: '3 months',
  },
  'enc-002': {
    complaint: 'Acute chest discomfort, breathlessness radiating to left arm',
    priority: 'URGENT',
    docs: 2,
    waitMin: 4,
    language: 'English',
    intakeSummary: 'Urgent Cardiac Alert',
    duration: '2 hours',
  },
  'enc-003': {
    complaint: 'Bilateral knee pain, generalized weakness, joint stiffness',
    priority: 'NORMAL',
    docs: 3,
    waitMin: 32,
    language: 'हिन्दी',
    intakeSummary: 'Voice Intake Verified',
    duration: '6 months',
  },
  'enc-004': {
    complaint: 'Chronic indigestion, acid reflux, Ahara dietary irregularity',
    priority: 'NORMAL',
    docs: 2,
    waitMin: 22,
    language: 'हिन्दी',
    intakeSummary: 'AYUSH Profile Linked',
    duration: '1 year',
  },
  'enc-005': {
    complaint: 'Second trimester routine antenatal checkup (24 weeks)',
    priority: 'NORMAL',
    docs: 2,
    waitMin: 9,
    language: 'Urdu',
    intakeSummary: 'Kiosk Intake Active',
    duration: '24 weeks',
  },
}

const STATE_BADGES: Record<string, { label: string; bg: string; text: string; border: string }> = {
  READY_FOR_REVIEW: {
    label: 'Prepared',
    bg: 'bg-[var(--color-verified-subtle)]',
    text: 'text-[var(--color-verified-text)]',
    border: 'border-emerald-200/60',
  },
  UNDER_PHYSICIAN_REVIEW: {
    label: 'In Consultation',
    bg: 'bg-[var(--color-brand-mist)]',
    text: 'text-[var(--color-brand)]',
    border: 'border-[var(--color-border)]',
  },
  PROCESSING_DOCUMENTS: {
    label: 'OCR Processing',
    bg: 'bg-[var(--color-warning-subtle)]',
    text: 'text-[var(--color-warning-text)]',
    border: 'border-[var(--color-warning-subtle)]',
  },
  INTERVIEWING: {
    label: 'Intake Active',
    bg: 'bg-[var(--color-brand-mist)]',
    text: 'text-[var(--color-brand)]',
    border: 'border-[var(--color-border)]',
  },
}

export default function DoctorQueuePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('ALL')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedEncounterId, setSelectedEncounterId] = useState<string>('enc-002')
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 300)
  }

  // Priority-First Sorting: URGENT cases bubble to the top of the queue
  const sortedAndFilteredEncounters = useMemo(() => {
    const list = DEMO_ENCOUNTERS.filter((enc) => {
      const patient = enc.patient || DEMO_PATIENTS.find((p) => p.id === enc.patientId)
      const meta = PATIENT_METRICS[enc.id] || { complaint: '', priority: 'NORMAL' }

      const matchesSearch =
        searchQuery === '' ||
        patient?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        enc.tokenNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient?.abhaNumber?.includes(searchQuery) ||
        meta.complaint.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === 'ALL' || enc.state === statusFilter

      const matchesPriority =
        priorityFilter === 'ALL' ||
        (priorityFilter === 'URGENT' && meta.priority === 'URGENT') ||
        (priorityFilter === 'NORMAL' && meta.priority !== 'URGENT')

      return matchesSearch && matchesStatus && matchesPriority
    })

    return [...list].sort((a, b) => {
      const metaA = PATIENT_METRICS[a.id]
      const metaB = PATIENT_METRICS[b.id]
      const priorityWeightA = metaA?.priority === 'URGENT' ? 0 : 1
      const priorityWeightB = metaB?.priority === 'URGENT' ? 0 : 1
      if (priorityWeightA !== priorityWeightB) {
        return priorityWeightA - priorityWeightB
      }
      return (metaA?.waitMin || 0) - (metaB?.waitMin || 0)
    })
  }, [searchQuery, statusFilter, priorityFilter])

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[var(--color-canvas)]">
      {/* ─── 1. TOP HEADER & COMPACT METRICS ───────────────────────────── */}
      <div className="px-4 sm:px-6 md:px-8 py-5 shrink-0 shadow-2xs border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4 min-w-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border border-[var(--color-border)] bg-[var(--color-brand-mist)] text-[var(--color-brand)]">
                <Stethoscope size={13} className="text-[var(--color-brand)]" />
                VAIDYA Clinical Intelligence · OPD Command
              </span>
            </div>
            <h1 className="text-[20px] sm:text-[22px] font-bold text-[var(--color-text-primary)] tracking-tight">
              Today&apos;s Physician OPD Queue
            </h1>
            <p className="text-[13px] text-[var(--color-text-secondary)]">
              Real-time patient intake stream prioritized by clinical triage urgency.
            </p>
          </div>

          {/* 4 Compact KPI Metrics */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
            {/* 1. Waiting */}
            <div className="px-3.5 py-2 rounded-xl flex items-center gap-2.5 border border-[var(--color-border)] bg-[var(--color-surface-subtle)] shadow-2xs">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs bg-[var(--color-brand-mist)] text-[var(--color-brand)]">
                <Users size={14} />
              </div>
              <div>
                <p className="text-[9.5px] text-[var(--color-text-muted)] uppercase font-bold tracking-wider">Waiting</p>
                <p className="text-[16px] font-bold text-[var(--color-text-primary)] leading-none">05</p>
              </div>
            </div>

            {/* 2. In Consultation */}
            <div className="px-3.5 py-2 rounded-xl flex items-center gap-2.5 border border-[var(--color-border)] bg-[var(--color-surface-subtle)] shadow-2xs">
              <div className="w-7 h-7 rounded-lg text-white flex items-center justify-center font-bold text-xs bg-[var(--color-brand)]">
                <Activity size={14} />
              </div>
              <div>
                <p className="text-[9.5px] text-[var(--color-brand)] uppercase font-bold tracking-wider">Consulting</p>
                <p className="text-[16px] font-bold text-[var(--color-brand)] leading-none">01</p>
              </div>
            </div>

            {/* 3. Priority */}
            <div className="px-3.5 py-2 rounded-xl flex items-center gap-2.5 border border-[var(--color-critical)]/30 bg-[var(--color-critical-subtle)] shadow-2xs">
              <div className="w-7 h-7 rounded-lg text-[var(--color-critical)] flex items-center justify-center font-bold text-xs bg-white border border-[var(--color-critical)]/30">
                <AlertTriangle size={14} />
              </div>
              <div>
                <p className="text-[9.5px] text-[var(--color-critical)] uppercase font-bold tracking-wider">Priority</p>
                <p className="text-[16px] font-bold text-[var(--color-critical)] leading-none">01</p>
              </div>
            </div>

            {/* 4. Completed */}
            <div className="px-3.5 py-2 rounded-xl flex items-center gap-2.5 border border-emerald-200/60 bg-[var(--color-verified-subtle)] shadow-2xs">
              <div className="w-7 h-7 rounded-lg text-[var(--color-verified-text)] flex items-center justify-center font-bold text-xs bg-white border border-emerald-200/60">
                <CheckCircle2 size={14} />
              </div>
              <div>
                <p className="text-[9.5px] text-[var(--color-verified-text)] uppercase font-bold tracking-wider">Completed</p>
                <p className="text-[16px] font-bold text-[var(--color-verified-text)] leading-none">24</p>
              </div>
            </div>

            <button
              onClick={handleRefresh}
              className={cn(
                'p-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] transition-all shadow-2xs active:scale-95 hover:bg-[var(--color-surface-subtle)]',
                isRefreshing && 'animate-spin'
              )}
              title="Refresh OPD Stream"
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* ─── 2. MAIN PATIENT QUEUE ──────────────────────────────────── */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 w-full flex-1 flex flex-col gap-4 min-w-0">
        {/* Search & Filter Ribbon (Level 2 Card) */}
        <Card
          level={2}
          className="p-3.5 flex flex-col md:flex-row items-center justify-between gap-3 min-w-0"
        >
          {/* Search Input */}
          <div className="relative w-full md:w-96 min-w-0">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" />
            <input
              type="text"
              placeholder="Search patient, token (A-028), ABHA..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-8 text-[13px] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition-all placeholder:text-[var(--color-text-muted)]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-start md:justify-end shrink-0">
            <SlidingSegmentedTabs
              options={DOCTOR_QUEUE_STATUS_TABS}
              selectedId={statusFilter}
              onChange={(newStatus) => setStatusFilter(newStatus)}
              variant="compact"
              layoutId="doctor-queue-status-pill"
              ariaLabel="Filter Doctor Queue"
            />

            <button
              onClick={() => setPriorityFilter(priorityFilter === 'URGENT' ? 'ALL' : 'URGENT')}
              className={cn(
                'px-3 py-1.5 rounded-xl text-[12px] font-bold border transition-all flex items-center gap-1.5',
                priorityFilter === 'URGENT'
                  ? 'bg-[var(--color-critical-subtle)] text-[var(--color-critical)] border-[var(--color-critical)]/40'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-surface-subtle)]'
              )}
            >
              <AlertTriangle size={12} />
              <span>Urgent Only</span>
            </button>
          </div>
        </Card>

        {/* Patient Rows — 3-Zone Scannable Cards */}
        <div className="space-y-3 min-w-0">
          {sortedAndFilteredEncounters.length === 0 ? (
            <Card level={2} className="p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)]">
                <Search size={22} />
              </div>
              <h3 className="text-[16px] font-bold text-[var(--color-text-primary)]">No patient cases found</h3>
              <p className="text-[13px] text-[var(--color-text-secondary)] max-w-sm mx-auto">
                No matching cases for &quot;{searchQuery}&quot;. Try adjusting your search query or filter criteria.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setStatusFilter('ALL')
                  setPriorityFilter('ALL')
                }}
                className="px-4 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-brand)] text-[12px] font-bold hover:bg-white transition-all"
              >
                Clear all filters
              </button>
            </Card>
          ) : (
            sortedAndFilteredEncounters.map((enc) => {
              const patient = enc.patient || DEMO_PATIENTS.find((p) => p.id === enc.patientId)
              const meta = PATIENT_METRICS[enc.id] || {
                complaint: 'Clinical intake in progress',
                priority: 'NORMAL',
                docs: 0,
                waitMin: 10,
                language: 'English',
                intakeSummary: 'Standard OPD intake',
                duration: '1 week',
              }
              const badge = STATE_BADGES[enc.state] || STATE_BADGES.READY_FOR_REVIEW
              const isSelected = selectedEncounterId === enc.id
              const isUrgent = meta.priority === 'URGENT'
              const isExpanded = expandedRowId === enc.id

              return (
                <div
                  key={enc.id}
                  onClick={() => setSelectedEncounterId(enc.id)}
                  className={cn(
                    'rounded-xl border transition-all cursor-pointer bg-[var(--color-surface)] shadow-2xs hover:shadow-xs flex flex-col min-w-0 overflow-hidden',
                    isSelected && 'border-[var(--color-brand)] ring-1 ring-[var(--color-brand)]',
                    !isSelected && isUrgent && 'border-l-4 border-l-[var(--color-critical)] border-[var(--color-border)]',
                    !isSelected && !isUrgent && 'border-[var(--color-border)]'
                  )}
                >
                  {/* Default Row: Capped Density to Exactly 3 Surviving Metadata Items */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-4 min-w-0">

                    {/* ── ZONE 1 (LEFT): Token + Patient Name ── */}
                    <div className="flex items-center gap-3 shrink-0 lg:w-[240px] min-w-0">
                      {/* OPD Token Box */}
                      <div
                        className={cn(
                          'w-10 h-10 rounded-lg border flex flex-col items-center justify-center shrink-0 select-none',
                          isUrgent
                            ? 'bg-[var(--color-critical-subtle)] border-[var(--color-critical)]/40 text-[var(--color-critical)]'
                            : 'bg-[var(--color-brand-mist)] border-[var(--color-border)] text-[var(--color-brand)]'
                        )}
                      >
                        <span className="text-[7.5px] font-bold uppercase tracking-wider">OPD</span>
                        <span className="text-[14px] font-bold font-mono leading-none">{enc.tokenNumber}</span>
                      </div>

                      {/* Patient Identity */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <h3 className="text-[15px] font-bold text-[var(--color-text-primary)] truncate">
                            {patient?.name}
                          </h3>
                          {isUrgent && (
                            <span className="px-1.5 py-0.2 rounded border border-[var(--color-critical)]/40 bg-[var(--color-critical-subtle)] text-[var(--color-critical)] text-[9px] font-bold uppercase tracking-wider shrink-0">
                              Urgent
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setExpandedRowId(isExpanded ? null : enc.id)
                          }}
                          className="text-[11px] text-[var(--color-text-muted)] hover:text-[var(--color-brand)] flex items-center gap-0.5 mt-0.5"
                        >
                          <span>{isExpanded ? 'Hide info' : 'Patient info'}</span>
                          {isExpanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                        </button>
                      </div>
                    </div>

                    {/* ── ZONE 2 (CENTER): 3 SURVIVING METADATA ITEMS ── */}
                    {/* Item 1: Chief Complaint | Item 3: Document/Intake Status */}
                    <div className="flex-1 lg:px-3 min-w-0 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                          Chief Complaint
                        </span>
                      </div>
                      <p className="text-[13px] font-semibold text-[var(--color-text-primary)] leading-snug truncate">
                        {meta.complaint}
                      </p>
                      {/* Document & Intake Status */}
                      <p className="text-[11px] text-[var(--color-text-secondary)] flex items-center gap-1.5 truncate">
                        <span>{meta.intakeSummary}</span>
                        <span>•</span>
                        <span>{meta.docs} document{meta.docs !== 1 ? 's' : ''}</span>
                      </p>
                    </div>

                    {/* ── ZONE 3 (RIGHT): Item 2: Wait Time + Status + 1 CTA ── */}
                    <div className="flex items-center justify-between lg:justify-end gap-3.5 shrink-0 lg:w-[220px] pt-2.5 lg:pt-0 border-t lg:border-t-0 border-[var(--color-border)]">
                      {/* Wait Time */}
                      <div className="text-left lg:text-right space-y-0.5 min-w-[80px]">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border',
                            badge.bg,
                            badge.text,
                            badge.border
                          )}
                        >
                          {badge.label}
                        </span>
                        <div className="flex items-center lg:justify-end gap-1 text-[11px] text-[var(--color-text-muted)]">
                          <Clock size={11} />
                          <span className={cn(isUrgent && 'text-[var(--color-critical)] font-bold')}>
                            {meta.waitMin}m wait
                          </span>
                        </div>
                      </div>

                      {/* Single Primary Action */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/doctor/encounter/${enc.id}`)
                        }}
                        className="px-3.5 py-1.5 rounded-lg text-white text-[12px] font-bold transition-all flex items-center gap-1 shadow-2xs active:scale-95 hover:opacity-90 bg-[var(--color-brand)] shrink-0"
                      >
                        <span>Review Case</span>
                        <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Progressive Disclosure: Detail Drawer on Expansion */}
                  {isExpanded && (
                    <div
                      className="px-4 py-3 bg-[var(--color-surface-subtle)] border-t border-[var(--color-border)] text-[12px] flex flex-wrap items-center justify-between gap-3 text-[var(--color-text-secondary)]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-4 flex-wrap">
                        <span>
                          <strong>Demographics:</strong> {patient?.age}Y • {patient?.gender === 'FEMALE' || patient?.sex === 'F' ? 'Female' : 'Male'}
                        </span>
                        <span>
                          <strong>Intake Language:</strong> {meta.language}
                        </span>
                        <span>
                          <strong>Duration:</strong> {meta.duration || 'Not specified'}
                        </span>
                        {patient?.abhaNumber && (
                          <span className="font-mono text-[var(--color-brand)] font-semibold">
                            ABHA: {patient.abhaNumber}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[var(--color-text-muted)]">
                        Patient ID: {patient?.id}
                      </span>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}


