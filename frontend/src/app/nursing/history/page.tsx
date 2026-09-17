'use client'

import { useState } from 'react'
import {
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store'

interface HistoryRow {
  id: string
  status: 'escalated' | 'stable' | 'false_alert'
  name: string
  mrn: string
  action: string
  attending: string
  time: string
}

const HISTORY_ROWS: HistoryRow[] = [
  {
    id: 'h-1',
    status: 'escalated',
    name: 'Priya Menon',
    mrn: '893-4A2',
    action: 'Code Blue initiated. Transferred to ICU Bed 4. Intubation protocol started.',
    attending: 'Dr. S. Sharma',
    time: '10:42 AM',
  },
  {
    id: 'h-2',
    status: 'stable',
    name: 'Dhananjay Patil',
    mrn: '712-9B4',
    action: 'Vitals stabilized post IV fluid administration. Admitted to general ward for observation.',
    attending: 'Nurse K. Devi',
    time: '09:15 AM',
  },
  {
    id: 'h-3',
    status: 'stable',
    name: 'Aarav Patel',
    mrn: '441-2C9',
    action: 'Asthma exacerbation resolved with nebulizer treatment. Discharged with follow-up instructions.',
    attending: 'Dr. A. Rao',
    time: '08:30 AM',
  },
  {
    id: 'h-4',
    status: 'false_alert',
    name: 'Bed 12 Sensor Artifact',
    mrn: '---',
    action: 'Sensor malfunction on Bed 12. Alert cleared manually. Maintenance notified.',
    attending: 'Tech M. Singh',
    time: '07:55 AM',
  },
]

export default function NursingHistoryPage() {
  const { addToast } = useUIStore()
  const [activeTab, setActiveTab] = useState<'all' | 'escalated' | 'stable' | 'false_alert'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredRows = HISTORY_ROWS.filter((row) => {
    const matchesSearch =
      searchQuery === '' ||
      row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.attending.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false
    if (activeTab === 'all') return true
    return row.status === activeTab
  })

  const handleExport = () => {
    addToast({
      type: 'info',
      title: 'CSV Export Initiated',
      body: 'Shift triage history exported to audit report.',
    })
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[22px] font-bold text-text-primary tracking-tight">
              Triage History &amp; Resolved Alerts
            </h1>
            <span
              className="text-[11px] font-bold px-2 py-0.5 rounded-full"
              style={{
                background: 'var(--color-brand-mist)',
                color: 'var(--color-brand)',
              }}
            >
              Today&apos;s Shift
            </span>
          </div>
          <p className="text-[13px] text-text-secondary mt-0.5">
            Operational audit log of triage assessments, physician transfers, and cleared alerts.
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="px-3.5 py-2 rounded-lg text-[12.5px] font-semibold flex items-center gap-1.5 transition-colors border hover:bg-surface-subtle"
            style={{
              background: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ── Filter Tabs & Search ────────────────────────────────────── */}
      <div
        className="p-3 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
        }}
      >
        {/* Tabs */}
        <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={cn(
              'px-3 py-1.5 rounded-md text-[12.5px] transition-colors',
              activeTab === 'all'
                ? 'bg-brand text-white font-semibold'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-subtle'
            )}
          >
            All Events ({HISTORY_ROWS.length})
          </button>
          <button
            onClick={() => setActiveTab('escalated')}
            className={cn(
              'px-3 py-1.5 rounded-md text-[12.5px] transition-colors flex items-center gap-1.5',
              activeTab === 'escalated'
                ? 'bg-critical text-white font-semibold'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-subtle'
            )}
          >
            <AlertTriangle size={13} />
            <span>Escalated (1)</span>
          </button>
          <button
            onClick={() => setActiveTab('stable')}
            className={cn(
              'px-3 py-1.5 rounded-md text-[12.5px] transition-colors flex items-center gap-1.5',
              activeTab === 'stable'
                ? 'bg-verified text-white font-semibold'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-subtle'
            )}
          >
            <CheckCircle2 size={13} />
            <span>Resolved Stable (2)</span>
          </button>
          <button
            onClick={() => setActiveTab('false_alert')}
            className={cn(
              'px-3 py-1.5 rounded-md text-[12.5px] transition-colors flex items-center gap-1.5',
              activeTab === 'false_alert'
                ? 'bg-warning text-white font-semibold'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-subtle'
            )}
          >
            <XCircle size={13} />
            <span>Cleared (1)</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search history..."
            className="w-full h-8 pl-8 pr-3 text-[12px] rounded-md focus:outline-none focus:ring-1 focus:ring-brand"
            style={{
              background: 'var(--color-surface-subtle)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
          />
        </div>
      </div>

      {/* ── Table Container ─────────────────────────────────────────── */}
      <div
        className="rounded-xl overflow-hidden shadow-xs"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr
                className="text-[11.5px] font-bold uppercase tracking-wider text-text-muted border-b border-border"
                style={{ background: 'var(--color-surface-subtle)' }}
              >
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Patient / Subject</th>
                <th className="py-3 px-4">MRN</th>
                <th className="py-3 px-4">Action &amp; Outcome</th>
                <th className="py-3 px-4">Attending</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-[13px]">
              {filteredRows.map((row) => {
                return (
                  <tr key={row.id} className="hover:bg-surface-subtle/60 transition-colors">
                    <td className="py-3.5 px-4">
                      {row.status === 'escalated' && (
                        <span
                          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold"
                          style={{
                            background: 'var(--color-critical-subtle)',
                            color: 'var(--color-critical-text)',
                          }}
                        >
                          <AlertTriangle size={12} />
                          Escalated
                        </span>
                      )}
                      {row.status === 'stable' && (
                        <span
                          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold"
                          style={{
                            background: 'var(--color-verified-subtle)',
                            color: 'var(--color-verified-text)',
                          }}
                        >
                          <CheckCircle2 size={12} />
                          Resolved Stable
                        </span>
                      )}
                      {row.status === 'false_alert' && (
                        <span
                          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold"
                          style={{
                            background: 'var(--color-warning-subtle)',
                            color: 'var(--color-warning-text)',
                          }}
                        >
                          <XCircle size={12} />
                          Cleared
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-text-primary">
                      {row.name}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[12px] text-text-secondary">
                      {row.mrn}
                    </td>
                    <td className="py-3.5 px-4 text-text-secondary max-w-md">
                      {row.action}
                    </td>
                    <td className="py-3.5 px-4 text-text-secondary font-medium">
                      {row.attending}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-[12px] text-text-muted">
                      {row.time}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
