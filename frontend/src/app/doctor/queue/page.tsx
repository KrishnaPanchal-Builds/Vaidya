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
} from 'lucide-react'
import { DEMO_ENCOUNTERS, DEMO_PATIENTS } from '@/constants/demo-data'
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
}

const PATIENT_METRICS: Record<string, PatientMeta> = {
  'enc-001': {
    complaint: 'Epigastric pain, 3 months duration • Burning sensation',
    priority: 'NORMAL',
    docs: 3,
    waitMin: 14,
    language: 'मराठी',
    intakeSummary: 'Prepared by VAIDYA',
  },
  'enc-002': {
    complaint: 'Acute chest discomfort, breathlessness radiating to left arm',
    priority: 'URGENT',
    docs: 1,
    waitMin: 4,
    language: 'English',
    intakeSummary: 'Urgent Cardiac Flag',
  },
  'enc-003': {
    complaint: 'Bilateral knee pain, generalized weakness, joint stiffness',
    priority: 'NORMAL',
    docs: 2,
    waitMin: 32,
    language: 'हिन्दी',
    intakeSummary: 'Prepared by VAIDYA',
  },
  'enc-004': {
    complaint: 'Chronic indigestion, acid reflux, Ahara dietary irregularity',
    priority: 'NORMAL',
    docs: 1,
    waitMin: 22,
    language: 'हिन्दी',
    intakeSummary: 'AYUSH Profile Complete',
  },
  'enc-005': {
    complaint: 'Recurring migraine, visual aura, disturbed sleep pattern',
    priority: 'NORMAL',
    docs: 0,
    waitMin: 9,
    language: 'Urdu',
    intakeSummary: 'Kiosk Intake Active',
  },
}

const STATE_BADGES: Record<string, { label: string; bg: string; text: string; border: string }> = {
  READY_FOR_REVIEW: {
    label: 'Prepared',
    bg: 'bg-verified-subtle',
    text: 'text-verified-text',
    border: 'border-verified-subtle',
  },
  UNDER_PHYSICIAN_REVIEW: {
    label: 'In Consultation',
    bg: 'bg-info-subtle',
    text: 'text-info-text',
    border: 'border-info-subtle',
  },
  PROCESSING_DOCUMENTS: {
    label: 'OCR Processing',
    bg: 'bg-warning-subtle',
    text: 'text-warning-text',
    border: 'border-warning-subtle',
  },
  INTERVIEWING: {
    label: 'Intake Active',
    bg: 'bg-brand-mist',
    text: 'text-brand',
    border: 'border-brand-mist',
  },
}

export default function DoctorQueuePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('ALL')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedEncounterId, setSelectedEncounterId] = useState<string>('enc-001')

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 400)
  }

  const filteredEncounters = useMemo(() => {
    return DEMO_ENCOUNTERS.filter((enc) => {
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
  }, [searchQuery, statusFilter, priorityFilter])

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto" style={{ background: 'var(--color-canvas)' }}>
      {/* ─── 1. TOP HEADER & COMPACT KPIS ───────────────────────────── */}
      <div
        className="px-6 md:px-8 py-5 shrink-0 shadow-xs"
        style={{
          background: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider border"
                style={{
                  background: 'var(--color-brand-mist)',
                  color: 'var(--color-brand)',
                  borderColor: 'var(--color-border-strong)',
                }}
              >
                <Stethoscope size={13} className="text-brand" />
                VAIDYA Clinical Intelligence • OPD Command
              </span>
            </div>
            <h1 className="text-[24px] font-bold text-text-primary tracking-tight">
              Today&apos;s OPD
            </h1>
            <p className="text-[13px] text-text-secondary">
              Review prepared patient cases before consultation.
            </p>
          </div>

          {/* 4 Compact KPI Metrics */}
          <div className="flex flex-wrap items-center gap-3">
            {/* 1. Waiting */}
            <div
              className="px-4 py-2 rounded-2xl flex items-center gap-3 shadow-xs border"
              style={{
                background: 'var(--color-surface-subtle)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm"
                style={{
                  background: 'var(--color-brand-mist)',
                  color: 'var(--color-brand)',
                }}
              >
                <Users size={16} />
              </div>
              <div>
                <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Waiting</p>
                <p className="text-[17px] font-extrabold text-text-primary leading-none">05</p>
              </div>
            </div>

            {/* 2. In Consultation */}
            <div
              className="px-4 py-2 rounded-2xl flex items-center gap-3 shadow-xs border"
              style={{
                background: 'var(--color-info-subtle)',
                borderColor: 'var(--color-info-subtle)',
              }}
            >
              <div
                className="w-8 h-8 rounded-xl text-white flex items-center justify-center font-bold text-sm"
                style={{ background: 'var(--color-info)' }}
              >
                <Activity size={16} />
              </div>
              <div>
                <p className="text-[10px] text-info-text uppercase font-bold tracking-wider">In Consultation</p>
                <p className="text-[17px] font-extrabold text-info-text leading-none">01</p>
              </div>
            </div>

            {/* 3. Priority */}
            <div
              className="px-4 py-2 rounded-2xl flex items-center gap-3 shadow-xs border"
              style={{
                background: 'var(--color-critical-subtle)',
                borderColor: 'var(--color-critical-subtle)',
              }}
            >
              <div
                className="w-8 h-8 rounded-xl text-critical flex items-center justify-center font-bold text-sm"
                style={{ background: 'var(--color-surface)' }}
              >
                <AlertTriangle size={16} />
              </div>
              <div>
                <p className="text-[10px] text-critical-text uppercase font-bold tracking-wider">Priority</p>
                <p className="text-[17px] font-extrabold text-critical leading-none">01</p>
              </div>
            </div>

            {/* 4. Completed */}
            <div
              className="px-4 py-2 rounded-2xl flex items-center gap-3 shadow-xs border"
              style={{
                background: 'var(--color-verified-subtle)',
                borderColor: 'var(--color-verified-subtle)',
              }}
            >
              <div
                className="w-8 h-8 rounded-xl text-verified flex items-center justify-center font-bold text-sm"
                style={{ background: 'var(--color-surface)' }}
              >
                <CheckCircle2 size={16} />
              </div>
              <div>
                <p className="text-[10px] text-verified-text uppercase font-bold tracking-wider">Completed</p>
                <p className="text-[17px] font-extrabold text-verified-text leading-none">24</p>
              </div>
            </div>

            <button
              onClick={handleRefresh}
              className={cn(
                'p-2.5 rounded-xl border transition-all shadow-xs active:scale-95 hover:bg-surface-subtle',
                isRefreshing && 'animate-spin'
              )}
              style={{
                background: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-secondary)',
              }}
              title="Refresh OPD Stream"
            >
              <RefreshCw size={17} />
            </button>
          </div>
        </div>
      </div>

      {/* ─── 2. MAIN PATIENT QUEUE ──────────────────────────────────── */}
      <div className="max-w-7xl mx-auto p-6 md:p-8 w-full flex-1 flex flex-col gap-5">
        {/* Search & Filter Ribbon (Layer 2 Surface) */}
        <div
          className="rounded-2xl p-4 border shadow-xs flex flex-col md:flex-row items-center justify-between gap-3"
          style={{
            background: 'var(--clinical-surface)',
            borderColor: 'var(--clinical-card-border)',
            boxShadow: '0 2px 8px rgba(41, 87, 135, 0.04)',
          }}
        >
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search by patient name, Token (e.g. A-028), ABHA..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-8 text-[13px] rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-brand transition-all"
              style={{
                background: 'var(--color-surface-subtle)',
                border: '1px solid var(--color-border)',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-start md:justify-end">
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
                'px-3 py-2 rounded-xl text-[12px] font-bold border transition-all flex items-center gap-1.5'
              )}
              style={{
                background: priorityFilter === 'URGENT' ? 'var(--color-critical-subtle)' : 'var(--color-surface)',
                color: priorityFilter === 'URGENT' ? 'var(--color-critical)' : 'var(--color-text-secondary)',
                borderColor: priorityFilter === 'URGENT' ? 'var(--color-critical)' : 'var(--color-border)',
              }}
            >
              <AlertTriangle size={13} />
              <span>Priority Only</span>
            </button>
          </div>
        </div>

        {/* Patient Rows */}
        <div className="space-y-3">
          {filteredEncounters.length === 0 ? (
            <div
              className="rounded-3xl p-10 border text-center space-y-3 shadow-xs"
              style={{
                background: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto border"
                style={{
                  background: 'var(--color-surface-subtle)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-muted)',
                }}
              >
                <Search size={22} />
              </div>
              <h3 className="text-[16px] font-bold text-text-primary">No patient cases found</h3>
              <p className="text-[13px] text-text-secondary max-w-sm mx-auto">
                No matching patients for &quot;{searchQuery}&quot;. Try adjusting your search query or filter criteria.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setStatusFilter('ALL')
                  setPriorityFilter('ALL')
                }}
                className="px-4 py-2 rounded-xl border text-[12px] font-bold hover:bg-surface-subtle transition-all"
                style={{
                  background: 'var(--color-surface-subtle)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-brand)',
                }}
              >
                Clear all filters
              </button>
            </div>
          ) : (
            filteredEncounters.map((enc) => {
              const patient = enc.patient || DEMO_PATIENTS.find((p) => p.id === enc.patientId)
              const meta = PATIENT_METRICS[enc.id] || {
                complaint: 'Clinical intake in progress',
                priority: 'NORMAL',
                docs: 0,
                waitMin: 10,
                language: 'English',
                intakeSummary: 'Standard OPD intake',
              }
              const badge = STATE_BADGES[enc.state] || STATE_BADGES.READY_FOR_REVIEW
              const isSelected = selectedEncounterId === enc.id

              return (
                <div
                  key={enc.id}
                  onClick={() => setSelectedEncounterId(enc.id)}
                  className={cn(
                    'rounded-2xl p-5 border transition-all duration-150 flex flex-col lg:flex-row lg:items-center justify-between gap-5 cursor-pointer hover:shadow-md active:scale-[0.995]',
                    isSelected ? 'ring-2 ring-brand' : ''
                  )}
                  style={{
                    background: 'var(--color-surface)',
                    borderColor: isSelected ? 'var(--color-brand)' : 'var(--color-border)',
                  }}
                >
                  {/* Column 1: Priority Indicator + Token */}
                  <div className="flex items-center gap-3.5 shrink-0">
                    <div
                      className="w-12 h-12 rounded-2xl border flex flex-col items-center justify-center shrink-0"
                      style={{
                        background: 'var(--color-brand-mist)',
                        borderColor: 'var(--color-border-strong)',
                        color: 'var(--color-brand)',
                      }}
                    >
                      <span className="text-[8px] font-bold uppercase">OPD</span>
                      <span className="text-[16px] font-extrabold font-mono leading-none">{enc.tokenNumber}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-[17px] font-bold text-text-primary">
                          {patient?.name}
                        </h3>
                        {meta.priority === 'URGENT' && (
                          <span
                            className="px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider animate-pulse"
                            style={{
                              background: 'var(--color-critical-subtle)',
                              color: 'var(--color-critical)',
                              borderColor: 'var(--color-critical)',
                            }}
                          >
                            Priority
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] text-text-secondary">
                        {patient?.age}M • {patient?.sex === 'M' || patient?.sex === 'male' ? 'Male' : 'Female'} • {meta.language}
                        {patient?.abhaNumber && (
                          <span className="font-mono text-brand font-medium ml-2">ABHA Linked</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Column 2: Chief Complaint & Documents */}
                  <div className="flex-1 lg:px-4 space-y-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                      Chief Complaint
                    </p>
                    <p className="text-[14px] text-text-primary font-semibold leading-snug line-clamp-1">
                      {meta.complaint}
                    </p>
                    <p className="text-[12px] text-text-secondary">
                      {meta.docs} documents attached • {meta.intakeSummary}
                    </p>
                  </div>

                  {/* Column 3: Wait Time + Status + Review Case Action */}
                  <div className="flex items-center justify-between lg:justify-end gap-5 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-border">
                    <div className="text-left lg:text-right space-y-1">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border',
                          badge.bg,
                          badge.text,
                          badge.border
                        )}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {badge.label}
                      </span>
                      <div className="flex items-center lg:justify-end gap-1 text-[11px] text-text-muted">
                        <Clock size={11} />
                        <span>{meta.waitMin}m wait</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/doctor/encounter/${enc.id}`)
                      }}
                      className="px-4 py-2.5 rounded-xl text-white text-[13px] font-bold transition-all flex items-center gap-1.5 shadow-xs active:scale-95 hover:opacity-90"
                      style={{ background: 'var(--color-brand)' }}
                    >
                      <span>Review Case</span>
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
