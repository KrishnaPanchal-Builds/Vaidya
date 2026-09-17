'use client'

import { useState, useMemo } from 'react'
import {
  Building2,
  ScrollText,
  Users,
  FileText,
  Clock,
  RefreshCw,
  Search,
  Server,
  Zap,
} from 'lucide-react'
import {
  DEMO_ADMIN_METRICS,
  DEMO_INTEGRATIONS,
  DEMO_AUDIT_EVENTS,
} from '@/constants/demo-data'
import { formatTime } from '@/lib/utils'
import { cn } from '@/lib/utils'

type AuditFilter = 'ALL' | 'CLINICAL' | 'TRIAGE' | 'INTEGRATION' | 'AUTH'

export default function AdminOverviewPage() {
  const [auditFilter, setAuditFilter] = useState<AuditFilter>('ALL')
  const [auditSearch, setAuditSearch] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 400)
  }

  const filteredAuditEvents = useMemo(() => {
    return DEMO_AUDIT_EVENTS.filter((evt) => {
      const matchesCategory = auditFilter === 'ALL' || evt.eventType === auditFilter
      const matchesSearch =
        auditSearch === '' ||
        evt.description.toLowerCase().includes(auditSearch.toLowerCase()) ||
        (evt.actor && evt.actor.toLowerCase().includes(auditSearch.toLowerCase())) ||
        (evt.patientName && evt.patientName.toLowerCase().includes(auditSearch.toLowerCase()))

      return matchesCategory && matchesSearch
    })
  }, [auditFilter, auditSearch])

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto" style={{ background: 'var(--color-canvas)' }}>
      {/* ─── Top Control Bar ────────────────────────────────────────── */}
      <div className="bg-white border-b border-[#DFE8F1] px-6 py-5 shrink-0 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#EEF5FC] text-[#174A91] text-[11px] font-bold uppercase tracking-wider border border-[#CBD8E5]">
                <Building2 size={13} className="text-[#2365B5]" />
                Hospital Operations &amp; System Health
              </span>
            </div>
            <h1 className="text-[24px] font-bold text-text-primary tracking-tight">
              Hospital Operations Overview
            </h1>
            <p className="text-[13px] text-text-secondary">
              Infrastructure health, OPD intake metrics, and tamper-evident audit logs.
            </p>
          </div>

          <button
            onClick={handleRefresh}
            className={cn(
              'p-2.5 rounded-xl border border-[#DFE8F1] bg-white text-text-secondary hover:text-text-primary hover:bg-[#F1F4F9] transition-all shadow-xs active:scale-95 self-start lg:self-auto',
              isRefreshing && 'animate-spin'
            )}
            title="Refresh System Metrics"
          >
            <RefreshCw size={17} />
          </button>
        </div>
      </div>

      {/* ─── Main Admin Workspace ──────────────────────────────────── */}
      <div className="max-w-7xl mx-auto p-6 md:p-8 w-full flex-1 flex flex-col gap-6">
        {/* KPI Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Encounters */}
          <div className="surface-clinical-card p-5 rounded-2xl space-y-1">
            <div className="flex items-center justify-between text-text-secondary mb-2">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-text-muted">Total OPD Intake</span>
              <div className="w-8 h-8 rounded-xl bg-[#EEF5FC] text-[#2365B5] flex items-center justify-center font-bold">
                <Users size={16} />
              </div>
            </div>
            <p className="text-[28px] font-extrabold text-text-primary leading-none">
              {DEMO_ADMIN_METRICS.encountersToday}
            </p>
            <p className="text-[12px] text-verified font-semibold pt-1">
              {DEMO_ADMIN_METRICS.encountersCompleted} completed • {DEMO_ADMIN_METRICS.encountersInProgress} in queue
            </p>
          </div>

          {/* Average Intake Duration */}
          <div className="surface-clinical-card p-5 rounded-2xl space-y-1">
            <div className="flex items-center justify-between text-text-secondary mb-2">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-text-muted">Avg. Intake Duration</span>
              <div className="w-8 h-8 rounded-xl bg-[#EEF5FC] text-[#2365B5] flex items-center justify-center font-bold">
                <Clock size={16} />
              </div>
            </div>
            <p className="text-[28px] font-extrabold text-text-primary leading-none">
              {Math.floor(DEMO_ADMIN_METRICS.avgIntakeDurationSec / 60)}m {DEMO_ADMIN_METRICS.avgIntakeDurationSec % 60}s
            </p>
            <p className="text-[12px] text-text-secondary font-medium pt-1">
              Multilingual touch &amp; speech speed
            </p>
          </div>

          {/* Documents Processed */}
          <div className="surface-clinical-card p-5 rounded-2xl space-y-1">
            <div className="flex items-center justify-between text-text-secondary mb-2">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-text-muted">Records Processed</span>
              <div className="w-8 h-8 rounded-xl bg-[#EEF5FC] text-[#2365B5] flex items-center justify-center font-bold">
                <FileText size={16} />
              </div>
            </div>
            <p className="text-[28px] font-extrabold text-text-primary leading-none">
              {DEMO_ADMIN_METRICS.documentsProcessed}
            </p>
            <p className="text-[12px] text-verified font-semibold pt-1">
              {Math.round(DEMO_ADMIN_METRICS.avgOcrConfidence * 100)}% Avg OCR accuracy
            </p>
          </div>

          {/* AYUSH Protocols */}
          <div className="surface-clinical-card p-5 rounded-2xl space-y-1">
            <div className="flex items-center justify-between text-text-secondary mb-2">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-text-muted">AYUSH Assessments</span>
              <div className="w-8 h-8 rounded-xl bg-[#EEF5FC] text-[#2365B5] flex items-center justify-center font-bold">
                <Zap size={16} />
              </div>
            </div>
            <p className="text-[28px] font-extrabold text-text-primary leading-none">
              {DEMO_ADMIN_METRICS.ayushSessions}
            </p>
            <p className="text-[12px] text-text-secondary font-medium pt-1">
              Ahara-Vihara lifestyle profiles
            </p>
          </div>
        </div>

        {/* Integration Health Grid */}
        <div className="surface-clinical-card rounded-2xl p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#DFE8F1]">
            <div className="flex items-center gap-2">
              <Server size={18} className="text-[#2365B5]" />
              <h2 className="text-[16px] font-bold text-text-primary tracking-tight">
                External Integration &amp; API Health
              </h2>
            </div>
            <span className="text-[11px] font-mono text-text-muted">
              7 endpoints active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {DEMO_INTEGRATIONS.map((integration) => {
              const isOk = integration.status === 'OPERATIONAL'
              return (
                <div
                  key={integration.name}
                  className="p-4 rounded-xl border border-[#DFE8F1] bg-[#F8FAFC] flex flex-col justify-between gap-2 shadow-xs transition-colors hover:border-[#CBD8E5]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-[14px] font-bold text-text-primary">
                        {integration.name}
                      </h3>
                      <p className="text-[12px] text-text-secondary">
                        {integration.description}
                      </p>
                    </div>
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 border',
                        isOk
                          ? 'bg-[#EBFDF5] text-[#079455] border-[#A6F4C5]'
                          : 'bg-[#FFFAEB] text-[#DC6803] border-[#FEDF89]'
                      )}
                    >
                      {integration.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-text-muted pt-2 border-t border-[#DFE8F1]">
                    <span>Latency: <strong className="font-mono text-text-primary">{integration.latencyMs}ms</strong></span>
                    <span>Uptime: <strong className="font-mono text-text-primary">{integration.uptimePercent}%</strong></span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Tamper-Evident Audit Log */}
        <div className="surface-clinical-card rounded-2xl p-6 sm:p-7 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-[#DFE8F1]">
            <div className="flex items-center gap-2">
              <ScrollText size={18} className="text-[#2365B5]" />
              <div>
                <h2 className="text-[16px] font-bold text-text-primary tracking-tight">
                  System Audit Log
                </h2>
                <p className="text-[12px] text-text-muted">
                  Append-only immutable record of clinical and authentication events.
                </p>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-[#F1F4F9] p-1 rounded-xl border border-[#DFE8F1] self-start md:self-auto">
              {(['ALL', 'CLINICAL', 'TRIAGE', 'INTEGRATION', 'AUTH'] as AuditFilter[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setAuditFilter(tab)}
                  className={cn(
                    'px-3 py-1 rounded-lg text-[11px] font-bold transition-all',
                    auditFilter === tab
                      ? 'bg-white text-[#2365B5] shadow-xs'
                      : 'text-text-secondary hover:text-text-primary'
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search audit trail by actor, patient, or event description..."
              value={auditSearch}
              onChange={(e) => setAuditSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-4 text-[13px] bg-white border border-[#DFE8F1] rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-[#2365B5] focus:ring-2 focus:ring-[#2365B5]/20 transition-all shadow-xs"
            />
          </div>

          {/* Audit Events Table */}
          <div className="divide-y divide-[#DFE8F1] border border-[#DFE8F1] rounded-xl overflow-hidden shadow-xs">
            {filteredAuditEvents.map((event) => (
              <div
                key={event.id}
                className="p-4 bg-white hover:bg-[#F8FAFC] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[13px]"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 mt-0.5 border',
                      event.eventType === 'CLINICAL' && 'bg-[#EEF5FC] text-[#174A91] border-[#CBD8E5]',
                      event.eventType === 'TRIAGE' && 'bg-[#FEF3F2] text-[#D92D20] border-[#FECDCA]',
                      event.eventType === 'INTEGRATION' && 'bg-[#EBFDF5] text-[#079455] border-[#A6F4C5]',
                      event.eventType === 'AUTH' && 'bg-[#F1F4F9] text-text-secondary border-[#DFE8F1]'
                    )}
                  >
                    {event.eventType}
                  </span>

                  <div>
                    <p className="font-semibold text-text-primary">
                      {event.description}
                    </p>
                    <p className="text-[11px] text-text-muted mt-0.5">
                      Actor: <span className="font-medium text-text-secondary">{event.actor}</span>
                      {event.patientName && ` • Patient: ${event.patientName}`}
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="font-mono text-[11px] text-text-muted">
                    {formatTime(event.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
