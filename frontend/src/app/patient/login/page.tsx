'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ShieldCheck,
  Smartphone,
  CreditCard,
  ArrowRight,
  CheckCircle2,
  Heart,
  Sparkles,
} from 'lucide-react'
import VaidyaWordmark from '@/components/VaidyaWordmark'
import { useAuthStore } from '@/store'
import { DEMO_PATIENTS } from '@/constants/demo-data'

type AuthMode = 'DEMO_QUICK' | 'MOBILE' | 'ABHA'

export default function PatientLoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()

  const [authMode, setAuthMode] = useState<AuthMode>('DEMO_QUICK')
  const [mobileNumber, setMobileNumber] = useState('9876543210')
  const [abhaId, setAbhaId] = useState('12-3456-7890-1234')
  const [selectedPatientId, setSelectedPatientId] = useState<'pat-001' | 'pat-002' | 'pat-003'>('pat-001')
  const [step, setStep] = useState<'IDENTIFY' | 'CONFIRM' | 'OTP'>('IDENTIFY')
  const [loading, setLoading] = useState(false)

  const handleSelectDemoProfile = (patientId: 'pat-001' | 'pat-002' | 'pat-003') => {
    setSelectedPatientId(patientId)
    const patient = DEMO_PATIENTS.find((p) => p.id === patientId)
    if (patient) {
      if (patient.phone) setMobileNumber(patient.phone)
      if (patient.abhaNumber) setAbhaId(patient.abhaNumber)
    }
    setStep('CONFIRM')
  }

  const handleManualLookup = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      // Match with demo patients
      const cleanPhone = mobileNumber.replace(/\D/g, '')
      const cleanAbha = abhaId.replace(/\D/g, '')
      
      const match = DEMO_PATIENTS.find((p) => {
        if (authMode === 'MOBILE') {
          return p.phone?.replace(/\D/g, '') === cleanPhone
        }
        return p.abhaNumber?.replace(/\D/g, '') === cleanAbha
      })

      if (match) {
        setSelectedPatientId(match.id as 'pat-001' | 'pat-002' | 'pat-003')
      } else {
        setSelectedPatientId('pat-001')
      }
      setStep('CONFIRM')
    }, 450)
  }

  const handleConfirmAndProceed = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      const targetPatient = DEMO_PATIENTS.find((p) => p.id === selectedPatientId) || DEMO_PATIENTS[0]
      login({
        id: targetPatient.id,
        name: targetPatient.name,
        role: 'patient',
        languagePreferences: ['en', 'hi', 'mr'],
      })
      router.push(`/patient/dashboard?patientId=${targetPatient.id}`)
    }, 500)
  }

  const activePatient = DEMO_PATIENTS.find((p) => p.id === selectedPatientId) || DEMO_PATIENTS[0]

  return (
    <div className="min-h-screen bg-[#FAF8FF] flex flex-col justify-between p-4 sm:p-6 lg:p-8 antialiased selection:bg-[#2563EB] selection:text-white">
      {/* ─── Top Header ────────────────────────────────────────── */}
      <header className="w-full max-w-4xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#71717A] hover:text-[#18181B] transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Homepage</span>
        </Link>
        <div className="flex items-center gap-2.5">
          <VaidyaWordmark size="sm" showDescriptor={false} />
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#006A61] bg-[#F0FDF4] px-2.5 py-0.5 rounded-full border border-[#BBF7D0]">
            Patient Portal
          </span>
        </div>
      </header>

      {/* ─── Main Login Container ────────────────────────────────── */}
      <main className="w-full max-w-lg mx-auto my-auto py-6">
        <div className="bg-white rounded-3xl p-6 sm:p-9 border border-[#E1E2ED] shadow-sm space-y-6">
          
          {/* Header Title */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#006A61]/10 text-[#006A61] flex items-center justify-center mx-auto mb-2 shadow-xs">
              <Heart size={28} className="text-[#006A61]" />
            </div>
            <h1 className="text-[24px] sm:text-[28px] font-bold text-[#18181B] tracking-tight">
              Patient Self-Service Portal
            </h1>
            <p className="text-[13.5px] sm:text-[14.5px] text-[#71717A] max-w-md mx-auto">
              View your past OPD consultations, uploaded documents, prescriptions, and intake history.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === 'IDENTIFY' && (
              <motion.div
                key="step-identify"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* ─── Method Switcher ─── */}
                <div className="grid grid-cols-3 gap-1.5 bg-[#FAF8FF] p-1.5 rounded-2xl border border-[#E1E2ED]">
                  <button
                    type="button"
                    onClick={() => setAuthMode('DEMO_QUICK')}
                    className={`py-2 text-[12px] font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                      authMode === 'DEMO_QUICK'
                        ? 'bg-white text-[#006A61] shadow-xs'
                        : 'text-[#71717A] hover:text-[#18181B]'
                    }`}
                  >
                    <Sparkles size={14} className="text-amber-500" />
                    <span>Demo Profiles</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode('MOBILE')}
                    className={`py-2 text-[12px] font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                      authMode === 'MOBILE'
                        ? 'bg-white text-[#004AC6] shadow-xs'
                        : 'text-[#71717A] hover:text-[#18181B]'
                    }`}
                  >
                    <Smartphone size={14} />
                    <span>Mobile OTP</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode('ABHA')}
                    className={`py-2 text-[12px] font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                      authMode === 'ABHA'
                        ? 'bg-white text-[#004AC6] shadow-xs'
                        : 'text-[#71717A] hover:text-[#18181B]'
                    }`}
                  >
                    <CreditCard size={14} />
                    <span>ABHA ID</span>
                  </button>
                </div>

                {/* ─── Mode 1: Demo Quick-Select (Matching Kiosk / K-03 Pattern) ─── */}
                {authMode === 'DEMO_QUICK' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11.5px] font-bold uppercase tracking-wider text-[#006A61]">
                        Select Preloaded Patient Account
                      </span>
                      <span className="text-[11px] text-[#71717A]">1-Click Demo Login</span>
                    </div>

                    {/* Dhananjay Patil (pat-001) */}
                    <button
                      type="button"
                      onClick={() => handleSelectDemoProfile('pat-001')}
                      className="w-full p-4 rounded-2xl border border-[#E1E2ED] bg-white hover:border-[#006A61] hover:bg-teal-50/30 transition-all text-left group shadow-2xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 font-extrabold text-sm flex items-center justify-center shrink-0">
                          DP
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[15px] font-bold text-[#18181B] group-hover:text-[#006A61] transition-colors">
                              Dhananjay Patil
                            </span>
                            <span className="text-[11px] font-medium bg-[#FAF8FF] px-2 py-0.5 rounded-full border border-[#E1E2ED] text-[#71717A]">
                              67 / M
                            </span>
                          </div>
                          <p className="text-[12px] font-mono text-[#52525B] mt-0.5">
                            ABHA: 12-3456-7890-1234
                          </p>
                          <p className="text-[11px] text-teal-700 font-medium">
                            3 Documents · 3 Prescriptions · Marathi/English
                          </p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-teal-50 text-[#006A61] flex items-center justify-center group-hover:bg-[#006A61] group-hover:text-white transition-all shrink-0">
                        <ArrowRight size={15} />
                      </div>
                    </button>

                    {/* Priya Menon (pat-002) */}
                    <button
                      type="button"
                      onClick={() => handleSelectDemoProfile('pat-002')}
                      className="w-full p-4 rounded-2xl border border-[#E1E2ED] bg-white hover:border-[#006A61] hover:bg-teal-50/30 transition-all text-left group shadow-2xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-800 font-extrabold text-sm flex items-center justify-center shrink-0">
                          PM
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[15px] font-bold text-[#18181B] group-hover:text-[#006A61] transition-colors">
                              Priya Menon
                            </span>
                            <span className="text-[11px] font-medium bg-[#FAF8FF] px-2 py-0.5 rounded-full border border-[#E1E2ED] text-[#71717A]">
                              42 / F
                            </span>
                          </div>
                          <p className="text-[12px] font-mono text-[#52525B] mt-0.5">
                            ABHA: 14-9876-5432-1098
                          </p>
                          <p className="text-[11px] text-indigo-700 font-medium">
                            2 Documents (ECG, Triage) · 2 Prescriptions · English
                          </p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:bg-indigo-700 group-hover:text-white transition-all shrink-0">
                        <ArrowRight size={15} />
                      </div>
                    </button>

                    {/* Ramesh Kumar (pat-003) */}
                    <button
                      type="button"
                      onClick={() => handleSelectDemoProfile('pat-003')}
                      className="w-full p-4 rounded-2xl border border-[#E1E2ED] bg-white hover:border-[#006A61] hover:bg-teal-50/30 transition-all text-left group shadow-2xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 font-extrabold text-sm flex items-center justify-center shrink-0">
                          RK
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[15px] font-bold text-[#18181B] group-hover:text-[#006A61] transition-colors">
                              Ramesh Kumar
                            </span>
                            <span className="text-[11px] font-medium bg-[#FAF8FF] px-2 py-0.5 rounded-full border border-[#E1E2ED] text-[#71717A]">
                              58 / M
                            </span>
                          </div>
                          <p className="text-[12px] font-mono text-[#52525B] mt-0.5">
                            Orthopedics OPD · Hindi
                          </p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-700 group-hover:text-white transition-all shrink-0">
                        <ArrowRight size={15} />
                      </div>
                    </button>
                  </div>
                )}

                {/* ─── Mode 2: Mobile Number Form ─── */}
                {authMode === 'MOBILE' && (
                  <form onSubmit={handleManualLookup} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-bold uppercase tracking-wider text-[#434655]">
                        Registered Mobile Number
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="h-11 px-3.5 rounded-xl border border-[#E1E2ED] bg-[#FAF8FF] text-[14px] font-bold text-[#18181B] flex items-center">
                          +91
                        </span>
                        <input
                          type="tel"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          placeholder="10-digit mobile number"
                          maxLength={10}
                          required
                          className="flex-1 h-11 px-3.5 rounded-xl border border-[#E1E2ED] bg-[#FAF8FF] focus:bg-white focus:border-[#004AC6] focus:outline-none text-[14px] font-medium transition-all"
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-[#71717A] pt-1">
                        <span>Demo: <button type="button" onClick={() => setMobileNumber('9876543210')} className="font-mono text-[#004AC6] underline font-bold">9876543210</button> (Dhananjay)</span>
                        <span>or <button type="button" onClick={() => setMobileNumber('9876541234')} className="font-mono text-[#004AC6] underline font-bold">9876541234</button> (Priya)</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-11 rounded-2xl bg-[#004AC6] hover:bg-[#003EA8] text-white text-[14px] font-bold transition-all shadow-xs flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                    >
                      {loading ? (
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Find Patient Records</span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* ─── Mode 3: ABHA Entry ─── */}
                {authMode === 'ABHA' && (
                  <form onSubmit={handleManualLookup} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-bold uppercase tracking-wider text-[#434655]">
                        14-Digit ABHA Number / Health ID
                      </label>
                      <input
                        type="text"
                        value={abhaId}
                        onChange={(e) => setAbhaId(e.target.value)}
                        placeholder="e.g. 12-3456-7890-1234"
                        required
                        className="w-full h-11 px-3.5 rounded-xl border border-[#E1E2ED] bg-[#FAF8FF] focus:bg-white focus:border-[#004AC6] focus:outline-none text-[14px] font-mono transition-all"
                      />
                      <div className="flex items-center justify-between text-[11px] text-[#71717A] pt-1">
                        <span>Dhananjay ABHA: <button type="button" onClick={() => setAbhaId('12-3456-7890-1234')} className="font-mono text-[#004AC6] underline font-bold">12-3456-7890-1234</button></span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-11 rounded-2xl bg-[#004AC6] hover:bg-[#003EA8] text-white text-[14px] font-bold transition-all shadow-xs flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                    >
                      {loading ? (
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Lookup via ABDM</span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </motion.div>
            )}

            {/* ─── CONFIRMATION CARD (Matching Kiosk Identify Pattern) ─── */}
            {step === 'CONFIRM' && (
              <motion.div
                key="step-confirm"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div className="p-5 rounded-2xl bg-teal-50/70 border border-teal-200 text-teal-950 space-y-4">
                  <div className="flex items-center gap-2 text-[12px] font-bold text-[#006A61] uppercase tracking-wider">
                    <CheckCircle2 size={16} className="text-[#006A61]" />
                    <span>Patient Record Found — Is This You?</span>
                  </div>

                  <div className="flex items-start gap-3.5 bg-white p-4 rounded-xl border border-teal-100 shadow-2xs">
                    <div className="w-12 h-12 rounded-xl bg-[#006A61] text-white font-extrabold text-base flex items-center justify-center shrink-0 shadow-xs">
                      {activePatient.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-[17px] font-bold text-[#18181B] leading-tight">
                        {activePatient.name}
                      </h2>
                      <p className="text-[12.5px] text-[#52525B] mt-0.5 font-medium">
                        {activePatient.age} years • {activePatient.sex === 'M' ? 'Male' : 'Female'}
                      </p>
                      {activePatient.abhaNumber && (
                        <p className="text-[12px] font-mono text-[#006A61] font-semibold mt-1">
                          ABHA: {activePatient.abhaNumber}
                        </p>
                      )}
                      {activePatient.phone && (
                        <p className="text-[11.5px] text-[#71717A] mt-0.5">
                          Mobile: +91 {activePatient.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-[12px] text-teal-900 bg-teal-100/60 p-2.5 rounded-lg">
                    🔒 Records are securely loaded from the hospital clinical repository for your personal review.
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={handleConfirmAndProceed}
                    disabled={loading}
                    className="w-full h-12 rounded-2xl bg-[#006A61] hover:bg-[#00574F] text-white text-[14.5px] font-bold transition-all shadow-sm flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Yes, Open My Records</span>
                        <ArrowRight size={17} />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep('IDENTIFY')}
                    className="w-full py-2 text-center text-[12.5px] font-semibold text-[#71717A] hover:text-[#18181B] transition-colors"
                  >
                    Not you? Choose another account
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Privacy Note */}
          <div className="pt-4 border-t border-[#E1E2ED] flex items-center justify-center gap-2 text-[11.5px] text-[#71717A]">
            <ShieldCheck size={15} className="text-[#006A61]" />
            <span>ABDM FHIR R4 Patient Privacy Compliant</span>
          </div>
        </div>
      </main>

      {/* ─── Footer ────────────────────────────────────────────── */}
      <footer className="text-center text-[12px] text-[#71717A]">
        <span>Hospital staff or clinician? </span>
        <Link href="/auth/login" className="text-[#004AC6] font-bold hover:underline">
          Staff Workspace Login →
        </Link>
      </footer>
    </div>
  )
}
