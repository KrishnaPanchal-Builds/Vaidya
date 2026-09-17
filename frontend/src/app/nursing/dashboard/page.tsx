'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  AlertTriangle,
  Users,
  CheckCircle2,
  Clock,
  ChevronRight,
  X,
  HeartPulse,
  Activity,
  ArrowRight,
  Thermometer,
  ShieldCheck,
  FileText,
  Mic,
  Flame,
  ArrowUpDown,
  UserCheck,
  Zap,
} from 'lucide-react'
import { useUIStore } from '@/store'
import { cn } from '@/lib/utils'
import { SlidingSegmentedTabs, type TabOption } from '@/components/ui/SlidingSegmentedTabs'

const NURSING_FILTER_OPTIONS: TabOption<'ALL' | 'ALERTS' | 'ROUTINE'>[] = [
  { id: 'ALL', label: 'All (6)' },
  { id: 'ALERTS', label: 'Alerts', badge: 2, badgeVariant: 'critical' },
  { id: 'ROUTINE', label: 'Routine (4)' },
]

interface PatientItem {
  id: string
  name: string
  initials: string
  age: number
  gender: 'MALE' | 'FEMALE' | 'OTHER'
  token: string
  mrn: string
  abha?: string
  arrival: string
  wait: string
  cc: string
  details: string
  condition: string
  hr: string
  temp: string
  bp: string
  spo2?: string
  status: 'INTERVIEW_COMPLETE' | 'PENDING_VITALS' | 'CRITICAL_ALERT' | 'URGENT_ALERT'
  isAlert?: boolean
  alertLevel?: 'CRITICAL' | 'URGENT'
  alertReason?: string
  language?: string
  transcriptExcerpt?: string
  hasOcrDocs?: boolean
}

const INITIAL_PATIENTS: PatientItem[] = [
  {
    id: 'enc-002',
    name: 'Priya Menon',
    initials: 'PM',
    age: 52,
    gender: 'FEMALE',
    token: '#23',
    mrn: '893-4A2',
    abha: '14-8821-9034-7712',
    arrival: '10:35 AM',
    wait: '7m',
    cc: 'Chest pain with left arm radiation',
    details: 'Acute retrosternal heaviness radiating to left shoulder. Onset 45 min ago while walking.',
    condition: 'Possible Acute Coronary Syndrome',
    hr: '104 bpm',
    temp: '98.8°F',
    bp: '150/95 mmHg',
    spo2: '94%',
    status: 'CRITICAL_ALERT',
    isAlert: true,
    alertLevel: 'CRITICAL',
    alertReason: 'T1 Kiosk Red Flag: Cardiac radiation symptom',
    language: 'Malayalam (മലയാളം)',
    transcriptExcerpt: 'നെഞ്ചിൽ കടുത്ത ഭാരവും ഇടതുകൈയിലേക്ക് വേദനയും പടരുന്നുണ്ട്... (Heavy tightness in chest radiating to left arm...)',
    hasOcrDocs: true,
  },
  {
    id: 'enc-005',
    name: 'Rohan Kumar',
    initials: 'RK',
    age: 28,
    gender: 'MALE',
    token: '#26',
    mrn: '841-309',
    abha: '12-9901-2244-1188',
    arrival: '10:38 AM',
    wait: '4m',
    cc: 'Difficulty breathing (Asthma history)',
    details: 'Moderate wheezing, speaking in short sentences. Used rescue inhaler 2 hours ago with partial relief.',
    condition: 'Acute Asthma Exacerbation',
    hr: '98 bpm',
    temp: '98.4°F',
    bp: '124/80 mmHg',
    spo2: '93%',
    status: 'URGENT_ALERT',
    isAlert: true,
    alertLevel: 'URGENT',
    alertReason: 'T2 Kiosk Warning: Respiratory distress',
    language: 'Hindi (हिन्दी)',
    transcriptExcerpt: 'सांस लेने में बहुत तकलीफ हो रही है, इनहेलर से भी पूरा आराम नहीं मिला... (Severe dyspnea, partial relief from inhaler...)',
    hasOcrDocs: false,
  },
  {
    id: 'pat-001',
    name: 'Dhananjay Patil',
    initials: 'DP',
    age: 67,
    gender: 'MALE',
    token: '#31',
    mrn: '849-221',
    abha: '12-3456-7890-1234',
    arrival: '09:15 AM',
    wait: '1h 27m',
    cc: 'Epigastric pain, 2 days duration',
    details: 'Patient reports dull ache worsening after meals. No vomiting. Mild nausea present.',
    condition: 'T2 Diabetes Mellitus / Dyspepsia',
    hr: '88 bpm',
    temp: '98.6°F',
    bp: '128/82 mmHg',
    spo2: '98%',
    status: 'INTERVIEW_COMPLETE',
    language: 'Marathi (मराठी)',
    transcriptExcerpt: 'दोन दिवसांपासून पोटात जळजळ आणि दुखणे आहे, जेवल्यानंतर त्रास वाढतो... (Burning pain for 2 days, worse after food...)',
    hasOcrDocs: true,
  },
  {
    id: 'pat-002',
    name: 'Sunita Nayak',
    initials: 'SN',
    age: 45,
    gender: 'FEMALE',
    token: '#32',
    mrn: '850-104',
    abha: '18-4412-7801-9921',
    arrival: '09:40 AM',
    wait: '1h 02m',
    cc: 'Persistent cough, mild fever',
    details: 'Dry cough for 5 days. Low-grade evening fever. No hemoptysis.',
    condition: 'Upper Respiratory Infection',
    hr: '82 bpm',
    temp: '99.2°F',
    bp: '118/76 mmHg',
    spo2: '97%',
    status: 'PENDING_VITALS',
    language: 'Odia (ଓଡ଼ିଆ)',
    transcriptExcerpt: '୫ ଦିନ ହେଲା କାଶ ଓ ସାମାନ୍ୟ ଜ୍ୱର ଲାଗିରହିଛି... (5 days of cough and mild evening fever...)',
    hasOcrDocs: false,
  },
  {
    id: 'pat-003',
    name: 'Amit Kumar',
    initials: 'AK',
    age: 34,
    gender: 'MALE',
    token: '#35',
    mrn: '852-771',
    abha: '16-1123-4567-8901',
    arrival: '10:10 AM',
    wait: '32m',
    cc: 'Ankle sprain, right side',
    details: 'Inversion injury while stepping off bus. Mild lateral swelling, able to bear partial weight.',
    condition: 'Right Lateral Ankle Sprain',
    hr: '76 bpm',
    temp: '98.6°F',
    bp: '120/80 mmHg',
    spo2: '99%',
    status: 'PENDING_VITALS',
    language: 'Hindi (हिन्दी)',
    transcriptExcerpt: 'बस से उतरते समय पैर मुड़ गया, सूजन है... (Twisted ankle while stepping off bus, swollen...)',
    hasOcrDocs: true,
  },
  {
    id: 'pat-004',
    name: 'Aisha Khan',
    initials: 'AK',
    age: 32,
    gender: 'FEMALE',
    token: '#38',
    mrn: '854-319',
    abha: '11-7788-9900-1122',
    arrival: '10:15 AM',
    wait: '27m',
    cc: 'Routine prenatal review (24 weeks)',
    details: 'Normal fetal movement. Blood pressure check and routine lab review.',
    condition: 'Antenatal Care — 2nd Trimester',
    hr: '78 bpm',
    temp: '98.4°F',
    bp: '112/72 mmHg',
    spo2: '99%',
    status: 'INTERVIEW_COMPLETE',
    language: 'Urdu (اردو)',
    transcriptExcerpt: 'معمول کا معائنہ برائے 24 ہفتے حمل، بچہ بالکل ٹھیک حرکت کر رہا ہے... (Routine checkup for 24 weeks gestation...)',
    hasOcrDocs: true,
  },
]

export default function NursingDashboardPage() {
  const router = useRouter()
  const { addToast } = useUIStore()
  const [currentTime, setCurrentTime] = useState('10:42 AM')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ALERTS' | 'ROUTINE'>('ALL')
  const [selectedPatient, setSelectedPatient] = useState<PatientItem>(INITIAL_PATIENTS[0]) // Priya Menon
  const [panelOpen, setPanelOpen] = useState(true)
  const [sortOrder, setSortOrder] = useState<'PRIORITY' | 'WAIT'>('PRIORITY')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    }
    updateTime()
    const timer = setInterval(updateTime, 30000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPanelOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const filteredPatients = useMemo(() => {
    const list = INITIAL_PATIENTS.filter((pat) => {
      const matchesSearch =
        searchQuery === '' ||
        pat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pat.token.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pat.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pat.cc.toLowerCase().includes(searchQuery.toLowerCase())

      if (!matchesSearch) return false

      if (statusFilter === 'ALERTS') return pat.isAlert
      if (statusFilter === 'ROUTINE') return !pat.isAlert
      return true
    })

    if (sortOrder === 'WAIT') {
      return [...list].sort((a, b) => (a.wait > b.wait ? -1 : 1))
    }
    return list
  }, [searchQuery, statusFilter, sortOrder])

  const criticalAlerts = filteredPatients.filter((p) => p.alertLevel === 'CRITICAL')
  const urgentAlerts = filteredPatients.filter((p) => p.alertLevel === 'URGENT')

  const handlePatientSelect = (patient: PatientItem) => {
    setSelectedPatient(patient)
    setPanelOpen(true)
  }

  const handleMarkReady = (patient: PatientItem) => {
    addToast({
      type: 'success',
      title: 'Triage Cleared • Patient Sent to Doctor',
      body: `${patient.name} (${patient.token}) prioritized and transferred to Physician OPD Queue.`,
    })
    router.push(`/nursing/patients/${patient.id}`)
  }

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: 'var(--color-canvas)' }}>
      {/* ── 1. OPERATIONAL TELEMETRY RIBBON ──────────────────────────── */}
      <div
        className="px-4 lg:px-6 py-2.5 shrink-0 flex items-center justify-between gap-4 border-b overflow-x-auto text-[12px]"
        style={{
          background: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="flex items-center gap-6 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
            <span className="font-bold uppercase tracking-wider text-[11px] text-text-primary">
              Live Triage Telemetry
            </span>
            <span className="font-mono text-text-muted text-[11px]">| {currentTime}</span>
          </div>

          <div className="h-4 w-px bg-border hidden sm:block" />

          {/* Metric Badges */}
          <div className="flex items-center gap-4 text-[12px]">
            <div className="flex items-center gap-1.5">
              <span className="text-text-muted">Total in Queue:</span>
              <span className="font-mono font-bold text-text-primary">{INITIAL_PATIENTS.length}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-critical" />
              <span className="text-critical font-medium">Critical T1:</span>
              <span className="font-mono font-bold text-critical">1</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-warning" />
              <span className="text-warning font-medium">Urgent T2:</span>
              <span className="font-mono font-bold text-warning">1</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-text-muted">Routine T3:</span>
              <span className="font-mono font-bold text-text-primary">4</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-verified font-medium">Ready for MD:</span>
              <span className="font-mono font-bold text-verified">2</span>
            </div>
          </div>
        </div>

        {/* Right Station Metrics */}
        <div className="flex items-center gap-3 shrink-0 text-[11.5px] text-text-muted">
          <span className="hidden md:inline">Avg Intake Time: <strong className="text-text-primary font-mono font-semibold">2m 45s</strong></span>
          <span className="hidden lg:inline">•</span>
          <span className="hidden lg:inline">Bhashini ASR Accuracy: <strong className="text-verified font-semibold">97.4%</strong></span>
          <span className="px-2 py-0.5 rounded bg-surface-subtle font-mono text-text-secondary border border-border">
            Station #03 Active
          </span>
        </div>
      </div>

      {/* ── 2. WORKSPACE CONTROL & FILTER BAR ────────────────────────── */}
      <div
        className="px-4 lg:px-6 py-3 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b"
        style={{
          background: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-[18px] font-extrabold tracking-tight text-text-primary">
              Triage Command &amp; Patient Stream
            </h1>
            <span
              className="text-[11px] font-bold px-2 py-0.5 rounded-full"
              style={{
                background: 'var(--color-brand-mist)',
                color: 'var(--color-brand)',
                border: '1px solid var(--color-border-strong)',
              }}
            >
              {filteredPatients.length} Patients Displayed
            </span>
          </div>
          <p className="text-[12px] text-text-muted mt-0.5">
            Real-time multi-modal kiosk stream • Prioritized by clinical severity &amp; waiting time
          </p>
        </div>

        {/* Actions & Filters */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Search bar */}
          <div className="relative min-w-[220px] max-w-xs flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patient, token, MRN..."
              className="w-full h-8.5 pl-8.5 pr-3 text-[12.5px] rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-brand"
              style={{
                background: 'var(--color-surface-subtle)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Sliding Queue Filter Tabs */}
          <SlidingSegmentedTabs
            options={NURSING_FILTER_OPTIONS}
            selectedId={statusFilter}
            onChange={(newFilter) => setStatusFilter(newFilter)}
            variant="compact"
            layoutId="nursing-queue-filter-pill"
            ariaLabel="Filter Triage Queue"
          />

          {/* Sort toggle */}
          <button
            onClick={() => setSortOrder(sortOrder === 'PRIORITY' ? 'WAIT' : 'PRIORITY')}
            className="h-8 px-2.5 rounded-lg border text-[11.5px] font-semibold text-text-secondary hover:text-text-primary flex items-center gap-1.5 transition-colors"
            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            title="Toggle Sort Order"
          >
            <ArrowUpDown size={12} />
            <span>{sortOrder === 'PRIORITY' ? 'Sort: Urgency' : 'Sort: Wait Time'}</span>
          </button>
        </div>
      </div>

      {/* ── 3. MAIN SPLIT WORKSPACE BODY ─────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: High-Priority Alert Strip + Clinical Queue Matrix */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-5">
          {/* A. HIGH-PRIORITY ALERT COMMAND STRIP */}
          {(criticalAlerts.length > 0 || urgentAlerts.length > 0) && (
            <section className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame size={15} className="text-critical" />
                  <h2 className="text-[12px] font-extrabold uppercase tracking-wider text-critical">
                    Immediate Clinical Action Required
                  </h2>
                </div>
                <span className="text-[11px] font-mono font-bold text-critical">
                  {criticalAlerts.length + urgentAlerts.length} Red Flags Flagged
                </span>
              </div>

              <div className="space-y-2">
                {[...criticalAlerts, ...urgentAlerts].map((patient) => {
                  const isCritical = patient.alertLevel === 'CRITICAL'
                  const isSelected = selectedPatient?.id === patient.id && panelOpen

                  return (
                    <div
                      key={patient.id}
                      onClick={() => handlePatientSelect(patient)}
                      className={cn(
                        'rounded-xl p-3.5 transition-all cursor-pointer border-2 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-3',
                        isSelected ? 'ring-2 ring-brand shadow-sm' : 'hover:shadow-xs'
                      )}
                      style={{
                        background: isCritical ? 'var(--color-critical-subtle)' : 'var(--color-warning-subtle)',
                        borderColor: isCritical ? 'var(--color-critical)' : 'var(--color-warning)',
                      }}
                    >
                      {/* Patient Identifier & Alert Tag */}
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-[13px] text-white shrink-0 shadow-xs"
                          style={{
                            background: isCritical ? 'var(--color-critical)' : 'var(--color-warning)',
                          }}
                        >
                          {patient.token}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-[14.5px] font-extrabold text-text-primary">
                              {patient.name}
                            </h3>
                            <span className="text-[12px] font-medium text-text-secondary">
                              {patient.age}{patient.gender === 'FEMALE' ? 'F' : 'M'}
                            </span>
                            <span
                              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white"
                              style={{
                                background: isCritical ? 'var(--color-critical)' : 'var(--color-warning)',
                              }}
                            >
                              {isCritical ? 'CRITICAL T1' : 'URGENT T2'}
                            </span>
                            <span className="text-[11.5px] font-mono text-text-muted">
                              MRN: {patient.mrn}
                            </span>
                          </div>

                          {/* Reason */}
                          <p className="text-[12.5px] font-semibold text-text-primary mt-1 flex items-center gap-1.5">
                            <AlertTriangle size={13} className={isCritical ? 'text-critical shrink-0' : 'text-warning shrink-0'} />
                            <span>{patient.alertReason}</span>
                          </p>

                          <p className="text-[12px] text-text-secondary mt-0.5 truncate">
                            <strong className="text-text-primary">Complaint:</strong> {patient.cc}
                          </p>
                        </div>
                      </div>

                      {/* Vitals Telemetry & Quick Action */}
                      <div className="flex items-center gap-4 shrink-0 self-end md:self-center">
                        <div className="flex items-center gap-2.5 text-[11.5px] font-mono bg-white/80 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-border/60">
                          <div className="flex items-center gap-1">
                            <HeartPulse size={12} className="text-critical" />
                            <span className="font-bold text-text-primary">{patient.hr}</span>
                          </div>
                          <span className="text-border">|</span>
                          <div className="flex items-center gap-1">
                            <Activity size={12} className="text-brand" />
                            <span className="font-bold text-text-primary">{patient.bp}</span>
                          </div>
                          {patient.spo2 && (
                            <>
                              <span className="text-border">|</span>
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] font-bold text-text-muted">SpO2</span>
                                <span className={cn('font-bold', parseInt(patient.spo2) < 95 ? 'text-critical' : 'text-verified')}>
                                  {patient.spo2}
                                </span>
                              </div>
                            </>
                          )}
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/nursing/alerts/${patient.id}`)
                          }}
                          className="h-8 px-3.5 rounded-lg text-white font-bold text-[12px] transition-all shadow-xs flex items-center gap-1.5 hover:opacity-90 active:scale-95"
                          style={{
                            background: isCritical ? 'var(--color-critical)' : 'var(--color-warning)',
                          }}
                        >
                          <ShieldCheck size={13} />
                          <span>Acknowledge</span>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* B. DENSE SCANNABLE CLINICAL QUEUE TABLE */}
          <section className="space-y-3">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <Users size={15} className="text-brand" />
                <h2 className="text-[13px] font-extrabold uppercase tracking-wider text-text-primary">
                  Clinical Intake Matrix ({filteredPatients.length})
                </h2>
              </div>
              <span className="text-[11.5px] text-text-muted">
                Click any row to open contextual case drawer
              </span>
            </div>

            {/* Table Container */}
            <div
              className="rounded-xl border overflow-hidden shadow-xs"
              style={{
                background: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[12.5px] border-collapse">
                  <thead>
                    <tr
                      className="border-b text-[11px] font-bold uppercase tracking-wider text-text-muted select-none"
                      style={{
                        background: 'var(--color-surface-subtle)',
                        borderColor: 'var(--color-border)',
                      }}
                    >
                      <th className="py-2.5 px-3 w-16">Token</th>
                      <th className="py-2.5 px-3">Patient / Demographics</th>
                      <th className="py-2.5 px-3">Chief Complaint &amp; Intake Details</th>
                      <th className="py-2.5 px-3">Vitals (HR / BP / SpO2)</th>
                      <th className="py-2.5 px-3 w-28">Wait Time</th>
                      <th className="py-2.5 px-3 w-36">Triage State</th>
                      <th className="py-2.5 px-3 text-right w-24">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border">
                    {filteredPatients.map((patient) => {
                      const isSelected = selectedPatient?.id === patient.id && panelOpen
                      const isCritical = patient.alertLevel === 'CRITICAL'
                      const isUrgent = patient.alertLevel === 'URGENT'

                      return (
                        <tr
                          key={patient.id}
                          onClick={() => handlePatientSelect(patient)}
                          className={cn(
                            'transition-colors cursor-pointer group',
                            isSelected
                              ? 'bg-brand-mist/40 font-medium'
                              : 'hover:bg-surface-subtle'
                          )}
                        >
                          {/* Token */}
                          <td className="py-3 px-3 align-top font-mono font-bold text-[13px]">
                            <span
                              className={cn(
                                'inline-block px-1.5 py-0.5 rounded text-center min-w-[32px]',
                                isCritical
                                  ? 'bg-critical text-white'
                                  : isUrgent
                                  ? 'bg-warning text-white'
                                  : 'bg-surface-subtle border border-border text-text-primary'
                              )}
                            >
                              {patient.token}
                            </span>
                          </td>

                          {/* Patient Name & Demographics */}
                          <td className="py-3 px-3 align-top">
                            <div className="font-bold text-text-primary group-hover:text-brand transition-colors">
                              {patient.name}
                            </div>
                            <div className="text-[11px] text-text-muted flex items-center gap-1.5 mt-0.5">
                              <span>{patient.age}Y • {patient.gender === 'FEMALE' ? 'Female' : 'Male'}</span>
                              <span>•</span>
                              <span className="font-mono">{patient.mrn}</span>
                            </div>
                            {patient.abha && (
                              <div className="text-[10px] text-brand font-mono mt-0.5 flex items-center gap-1">
                                <ShieldCheck size={10} className="text-verified" />
                                <span>ABHA Linked</span>
                              </div>
                            )}
                          </td>

                          {/* Chief Complaint & Intake details */}
                          <td className="py-3 px-3 align-top max-w-xs">
                            <div className="font-semibold text-text-primary text-[12.5px] line-clamp-1">
                              {patient.cc}
                            </div>
                            <div className="text-[11.5px] text-text-secondary line-clamp-1 mt-0.5">
                              {patient.details}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              {patient.language && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface-subtle border border-border text-text-muted">
                                  {patient.language.split(' ')[0]}
                                </span>
                              )}
                              {patient.hasOcrDocs && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-verified-subtle text-verified font-medium flex items-center gap-0.5">
                                  <FileText size={9} /> OCR Synced
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Vitals */}
                          <td className="py-3 px-3 align-top font-mono text-[12px]">
                            <div className="text-text-primary font-semibold">
                              {patient.hr} • {patient.bp}
                            </div>
                            <div className="text-[11px] text-text-muted mt-0.5 flex items-center gap-2">
                              <span>Temp: {patient.temp}</span>
                              {patient.spo2 && <span>SpO2: {patient.spo2}</span>}
                            </div>
                          </td>

                          {/* Wait Time */}
                          <td className="py-3 px-3 align-top">
                            <div className="font-semibold text-text-primary flex items-center gap-1">
                              <Clock size={12} className="text-text-muted" />
                              <span>{patient.wait}</span>
                            </div>
                            <div className="text-[11px] text-text-muted mt-0.5">
                              Arr: {patient.arrival}
                            </div>
                          </td>

                          {/* Triage State */}
                          <td className="py-3 px-3 align-top">
                            {patient.status === 'CRITICAL_ALERT' && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-critical-subtle text-critical-text border border-critical/30">
                                <AlertTriangle size={11} /> Critical T1
                              </span>
                            )}
                            {patient.status === 'URGENT_ALERT' && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-warning-subtle text-warning-text border border-warning/30">
                                <AlertTriangle size={11} /> Urgent T2
                              </span>
                            )}
                            {patient.status === 'INTERVIEW_COMPLETE' && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-verified-subtle text-verified-text border border-verified/30">
                                <CheckCircle2 size={11} /> Ready for MD
                              </span>
                            )}
                            {patient.status === 'PENDING_VITALS' && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-surface-subtle text-text-secondary border border-border">
                                <Clock size={11} /> Pending Vitals
                              </span>
                            )}
                          </td>

                          {/* Action Button */}
                          <td className="py-3 px-3 align-top text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handlePatientSelect(patient)
                              }}
                              className="p-1.5 rounded-lg border text-text-muted hover:text-text-primary hover:bg-surface-subtle transition-colors"
                              style={{ borderColor: 'var(--color-border)' }}
                              title="Inspect Patient"
                            >
                              <ChevronRight size={15} />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>

        {/* ── 4. CONTEXTUAL PATIENT DETAIL SLIDE-OVER / SPLIT PANEL ────── */}
        {panelOpen && selectedPatient && (
          <aside
            className="w-full sm:w-[410px] lg:w-[440px] shrink-0 h-full flex flex-col z-20 transition-all border-l shadow-drawer"
            style={{
              background: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
            aria-label="Patient Case Inspector"
          >
            {/* Inspector Header */}
            <div
              className="p-4 sm:p-5 shrink-0 border-b"
              style={{
                background: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-11 h-11 rounded-xl flex items-center justify-center font-bold text-[16px] text-white shrink-0 shadow-xs',
                      selectedPatient.alertLevel === 'CRITICAL'
                        ? 'bg-critical'
                        : selectedPatient.alertLevel === 'URGENT'
                        ? 'bg-warning'
                        : 'bg-brand'
                    )}
                  >
                    {selectedPatient.token}
                  </div>
                  <div>
                    <h2 className="text-[17px] font-extrabold text-text-primary tracking-tight">
                      {selectedPatient.name}
                    </h2>
                    <p className="text-[12px] text-text-secondary">
                      {selectedPatient.age} YRS • {selectedPatient.gender} • <span className="font-mono">MRN {selectedPatient.mrn}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setPanelOpen(false)}
                  className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-subtle transition-colors"
                  aria-label="Close panel"
                  title="Close (Esc)"
                >
                  <X size={16} />
                </button>
              </div>

              {selectedPatient.abha && (
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-verified-subtle text-verified-text text-[11px] font-medium border border-verified/20">
                  <ShieldCheck size={12} />
                  <span>ABHA ID: {selectedPatient.abha}</span>
                </div>
              )}
            </div>

            {/* Inspector Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {/* Alert Ribbon if applicable */}
              {selectedPatient.isAlert && (
                <div
                  className="p-3 rounded-xl border space-y-1"
                  style={{
                    background: selectedPatient.alertLevel === 'CRITICAL' ? 'var(--color-critical-subtle)' : 'var(--color-warning-subtle)',
                    borderColor: selectedPatient.alertLevel === 'CRITICAL' ? 'var(--color-critical)' : 'var(--color-warning)',
                  }}
                >
                  <div className="flex items-center gap-1.5 font-bold text-[12px]" style={{ color: selectedPatient.alertLevel === 'CRITICAL' ? 'var(--color-critical-text)' : 'var(--color-warning-text)' }}>
                    <AlertTriangle size={13} />
                    <span>{selectedPatient.alertLevel === 'CRITICAL' ? 'Critical Triage T1 Alert' : 'Urgent Warning T2'}</span>
                  </div>
                  <p className="text-[12px] text-text-primary font-medium">
                    {selectedPatient.alertReason}
                  </p>
                </div>
              )}

              {/* Chief Complaint Narrative */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Chief Complaint Narrative
                </span>
                <div
                  className="p-3.5 rounded-xl border space-y-2"
                  style={{
                    background: 'var(--color-surface-subtle)',
                    borderColor: 'var(--color-border)',
                  }}
                >
                  <p className="text-[13.5px] font-bold text-text-primary">
                    {selectedPatient.cc}
                  </p>
                  <p className="text-[12px] text-text-secondary leading-relaxed">
                    {selectedPatient.details}
                  </p>
                </div>
              </div>

              {/* Multilingual Voice Intake Excerpt */}
              {selectedPatient.transcriptExcerpt && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1">
                      <Mic size={11} className="text-brand" />
                      <span>Multilingual Voice Intake</span>
                    </span>
                    <span className="text-[10.5px] font-medium text-brand">
                      {selectedPatient.language}
                    </span>
                  </div>
                  <div
                    className="p-3 rounded-xl border text-[12px] italic text-text-primary leading-relaxed bg-brand-mist/20 border-brand/20 font-serif"
                  >
                    &ldquo;{selectedPatient.transcriptExcerpt}&rdquo;
                  </div>
                </div>
              )}

              {/* Extracted Vitals Matrix */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    Clinical Vitals
                  </span>
                  <span className="text-[10px] text-text-muted">Source: Kiosk IoT Sensor</span>
                </div>

                <div
                  className="rounded-xl border divide-y divide-border overflow-hidden"
                  style={{
                    background: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                  }}
                >
                  <div className="p-2.5 px-3 flex items-center justify-between text-[12.5px]">
                    <span className="text-text-secondary flex items-center gap-1.5">
                      <HeartPulse size={13} className="text-critical" /> Heart Rate
                    </span>
                    <span className="font-mono font-bold text-text-primary">{selectedPatient.hr}</span>
                  </div>

                  <div className="p-2.5 px-3 flex items-center justify-between text-[12.5px]">
                    <span className="text-text-secondary flex items-center gap-1.5">
                      <Activity size={13} className="text-brand" /> Blood Pressure
                    </span>
                    <span className="font-mono font-bold text-text-primary">{selectedPatient.bp}</span>
                  </div>

                  <div className="p-2.5 px-3 flex items-center justify-between text-[12.5px]">
                    <span className="text-text-secondary flex items-center gap-1.5">
                      <Thermometer size={13} className="text-warning" /> Temperature
                    </span>
                    <span className="font-mono font-bold text-text-primary">{selectedPatient.temp}</span>
                  </div>

                  {selectedPatient.spo2 && (
                    <div className="p-2.5 px-3 flex items-center justify-between text-[12.5px]">
                      <span className="text-text-secondary flex items-center gap-1.5">
                        <Zap size={13} className="text-verified" /> Oxygen Saturation
                      </span>
                      <span className="font-mono font-bold text-text-primary">{selectedPatient.spo2}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Working Hypothesis / Triage Condition */}
              <div
                className="p-3 rounded-xl border flex items-center justify-between"
                style={{
                  background: 'var(--color-surface-subtle)',
                  borderColor: 'var(--color-border)',
                }}
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                    Working Diagnosis
                  </span>
                  <span className="text-[13px] font-bold text-text-primary">
                    {selectedPatient.condition}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-verified-subtle text-verified-text uppercase">
                  Verified
                </span>
              </div>
            </div>

            {/* Inspector Sticky Footer */}
            <div
              className="p-4 shrink-0 space-y-2 border-t"
              style={{
                background: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <button
                onClick={() => handleMarkReady(selectedPatient)}
                className="w-full h-10 rounded-xl text-white font-bold text-[13px] flex items-center justify-center gap-2 transition-all shadow-xs hover:opacity-90 active:scale-98"
                style={{
                  background: 'var(--color-brand)',
                }}
              >
                <UserCheck size={16} />
                <span>Mark Ready for Physician</span>
              </button>

              <button
                onClick={() => router.push(`/nursing/patients/${selectedPatient.id}`)}
                className="w-full h-9 rounded-xl font-semibold text-[12.5px] transition-colors border hover:bg-surface-subtle flex items-center justify-center gap-1.5 text-text-secondary hover:text-text-primary"
                style={{
                  borderColor: 'var(--color-border)',
                }}
              >
                <span>Open Full Clinical Case File</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
