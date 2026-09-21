'use client'
/**
 * K-03 — Patient Identification & Demographic Confirmation (Phase 2 + Multilingual)
 *
 * Flow:
 * 1. SELECT_METHOD: Scan ABHA QR, Enter Health ID/Mobile, or Register as New Patient
 * 2. SCAN_QR: Interactive QR camera viewfinder simulation
 * 3. MANUAL_ENTRY: 14-digit ABHA or 10-digit mobile with on-screen numeric keypad
 * 4. SEARCHING: Clinical lookup transition state
 * 5. CONFIRM_RETURNING: Demographic verification card for existing patients (Stitch p_04)
 * 6. NEW_PATIENT_FORM: Minimal touch-friendly registration form (Stitch p_03)
 * 7. NEW_PATIENT_SUCCESS: Confirmation of newly created profile
 *
 * Multilingual Architecture:
 * - Powered by useKioskTranslation() for complete EN, HI, MR translations.
 */

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useKioskStore } from '@/store/kiosk.store'
import { useKioskTranslation } from '@/lib/hooks/use-kiosk-translation'
import { useVoiceAgent } from '@/lib/hooks/use-voice-agent'
import { KioskButton } from '@/components/kiosk/kiosk-button'
import { kioskService } from '@/services/kiosk.service'
import type { KioskPatientData } from '@/types/kiosk'
import { DEMO_PATIENTS } from '@/constants/demo-data'
import { Volume2, ArrowRight } from 'lucide-react'

type IdentifyView =
  | 'SELECT_METHOD'
  | 'SCAN_QR'
  | 'MANUAL_ENTRY'
  | 'SEARCHING'
  | 'CONFIRM_RETURNING'
  | 'NEW_PATIENT_FORM'
  | 'NEW_PATIENT_SUCCESS'

type ManualEntryType = 'ABHA' | 'MOBILE'

export default function KioskIdentifyPage() {
  const router = useRouter()
  const { t } = useKioskTranslation()
  const { language, advanceStep, setPatientData, updateActivity } = useKioskStore()
  const { speak, speakOnMount, isSpeaking } = useVoiceAgent()

  const [view, setView] = useState<IdentifyView>('SELECT_METHOD')
  const [manualType, setManualType] = useState<ManualEntryType>('ABHA')
  const [inputValue, setInputValue] = useState('')
  const [searchError, setSearchError] = useState<string | null>(null)
  const [activePatient, setActivePatient] = useState<KioskPatientData | null>(null)

  // New Patient Form State
  const [newName, setNewName] = useState('')
  const [ageMode, setAgeMode] = useState<'AGE' | 'DOB'>('AGE')
  const [newAge, setNewAge] = useState('')
  const [newDob, setNewDob] = useState('')
  const [newSex, setNewSex] = useState<'Male' | 'Female' | 'Other'>('Male')
  const [newPhone, setNewPhone] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Spoken voice guidance on screen mount
  useEffect(() => {
    const promptText =
      language === 'mr'
        ? 'कृपया तुमचे आभा कार्ड किंवा मोबाईल नंबर दाखवा. नसल्यास पुढे जाण्यासाठी हिरवे बटण दाबा.'
        : language === 'hi'
        ? 'कृपया अपना आभा कार्ड या मोबाइल नंबर दिखाएं। यदि नहीं है, तो आगे बढ़ने के लिए हरा बटन दबाएं।'
        : 'Please show your ABHA card or enter mobile number. If you do not have one, touch the green button to continue.'

    return speakOnMount(promptText, language || 'mr', 450)
  }, [speakOnMount, language])

  const handleHearInstructions = () => {
    updateActivity()
    const promptText =
      language === 'mr'
        ? 'कृपया तुमचे आभा कार्ड किंवा मोबाईल नंबर दाखवा. नसल्यास पुढे जाण्यासाठी हिरवे बटण दाबा.'
        : language === 'hi'
        ? 'कृपया अपना आभा कार्ड या मोबाइल नंबर दिखाएं। यदि नहीं है, तो आगे बढ़ने के लिए हरा बटन दबाएं।'
        : 'Please show your ABHA card or enter mobile number. If you do not have one, touch the green button to continue.'
    speak(promptText, language || 'mr')
  }

  // Ensure store knows we are in IDENTIFY step
  useEffect(() => {
    advanceStep('IDENTIFY')
  }, [advanceStep])

  // ── Lookup Handlers ──────────────────────────────────────────────────────────

  const handleSelectPatient = useCallback(
    (patientData: KioskPatientData, isReturning: boolean) => {
      setActivePatient(patientData)
      setPatientData(patientData, isReturning)
      updateActivity()
      if (isReturning) {
        setView('CONFIRM_RETURNING')
      } else {
        setView('NEW_PATIENT_SUCCESS')
      }
    },
    [setPatientData, updateActivity]
  )

  const performLookup = useCallback(
    async (query: string, type: ManualEntryType) => {
      setView('SEARCHING')
      setSearchError(null)
      updateActivity()

      try {
        const cleanQuery = query.replace(/\D/g, '')

        let patient = null
        if (type === 'ABHA') {
          const abhaMatch = DEMO_PATIENTS.find(
            (p) => p.abhaNumber?.replace(/\D/g, '') === cleanQuery || p.abhaNumber === query
          )
          patient = abhaMatch ?? null
        } else {
          const phoneMatch = DEMO_PATIENTS.find(
            (p) => p.phone?.replace(/\D/g, '') === cleanQuery
          )
          patient = phoneMatch ?? null
        }

        // Brief realistic delay for clinical search
        await new Promise((r) => setTimeout(r, 650))

        if (patient) {
          const mapped: KioskPatientData = {
            id: patient.id,
            name: patient.name,
            age: patient.age ?? 45,
            sex: patient.sex === 'M' ? 'Male' : patient.sex === 'F' ? 'Female' : 'Other',
            phone: patient.phone ?? '9876543210',
            abhaNumber: patient.abhaNumber ?? '12-3456-7890-1234',
            lastVisit: '12 Aug 2026',
            preferredLanguage: patient.preferredLanguage,
          }
          handleSelectPatient(mapped, true)
        } else {
          // Fallback demo patient if any 10+ digits entered
          if (cleanQuery.length >= 10) {
            const fallback: KioskPatientData = {
              id: `pat-${cleanQuery.slice(-4)}`,
              name: 'Dhananjay Patil',
              age: 67,
              sex: 'Male',
              phone: cleanQuery.length === 10 ? cleanQuery : '9876543210',
              abhaNumber: type === 'ABHA' ? query : '12-3456-7890-1234',
              lastVisit: '12 Aug 2026',
              preferredLanguage: 'mr',
            }
            handleSelectPatient(fallback, true)
          } else {
            setSearchError(t.identify.errLookup)
            setView('MANUAL_ENTRY')
          }
        }
      } catch {
        setSearchError(t.identify.errLookup)
        setView('MANUAL_ENTRY')
      }
    },
    [handleSelectPatient, t.identify.errLookup, updateActivity]
  )

  // ── Keypad Input Handlers ───────────────────────────────────────────────────

  const handleKeypadPress = (key: string) => {
    updateActivity()
    if (key === 'CLEAR') {
      setInputValue('')
      return
    }
    if (key === 'BACKSPACE') {
      setInputValue((prev) => prev.slice(0, -1))
      return
    }
    const maxLen = manualType === 'ABHA' ? 14 : 10
    const raw = inputValue.replace(/\D/g, '')
    if (raw.length >= maxLen) return

    const nextRaw = raw + key
    if (manualType === 'ABHA') {
      let formatted = nextRaw
      if (nextRaw.length > 2) formatted = `${nextRaw.slice(0, 2)}-${nextRaw.slice(2)}`
      if (nextRaw.length > 6) formatted = `${nextRaw.slice(0, 2)}-${nextRaw.slice(2, 6)}-${nextRaw.slice(6)}`
      if (nextRaw.length > 10) formatted = `${nextRaw.slice(0, 2)}-${nextRaw.slice(2, 6)}-${nextRaw.slice(6, 10)}-${nextRaw.slice(10, 14)}`
      setInputValue(formatted)
    } else {
      setInputValue(nextRaw)
    }
  }

  // ── New Patient Registration Submit ──────────────────────────────────────────

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    updateActivity()

    if (!newName.trim()) {
      setFormError(t.identify.errName)
      return
    }
    const ageVal = ageMode === 'AGE' ? parseInt(newAge, 10) : 30
    if (ageMode === 'AGE' && (!newAge || isNaN(ageVal) || ageVal < 1 || ageVal > 120)) {
      setFormError(t.identify.errAge)
      return
    }
    if (ageMode === 'DOB' && !newDob) {
      setFormError(t.identify.errDob)
      return
    }
    const cleanPhone = newPhone.replace(/\D/g, '')
    if (!cleanPhone || cleanPhone.length < 10) {
      setFormError(t.identify.errPhone)
      return
    }

    setFormError(null)
    setIsSubmitting(true)

    try {
      const newPatientRecord: KioskPatientData = {
        name: newName.trim(),
        age: ageMode === 'AGE' ? ageVal : new Date().getFullYear() - new Date(newDob).getFullYear(),
        sex: newSex,
        phone: cleanPhone,
        preferredLanguage: language ?? 'hi',
        lastVisit: 'First Visit (Today)',
      }

      await kioskService.registerNewPatient({
        name: newPatientRecord.name,
        age: newPatientRecord.age,
        sex: newPatientRecord.sex === 'Male' ? 'M' : newPatientRecord.sex === 'Female' ? 'F' : 'O',
        phone: newPatientRecord.phone,
        preferredLanguage: (newPatientRecord.preferredLanguage ?? 'hi') as 'en' | 'hi' | 'mr',
      })

      handleSelectPatient(newPatientRecord, false)
    } catch {
      // Offline fallback: store locally and proceed
      const fallbackRecord: KioskPatientData = {
        name: newName.trim(),
        age: ageMode === 'AGE' ? ageVal : 30,
        sex: newSex,
        phone: cleanPhone,
        preferredLanguage: language ?? 'hi',
        lastVisit: 'First Visit (Today)',
      }
      handleSelectPatient(fallbackRecord, false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleProceedToConsent = () => {
    advanceStep('CONSENT')
    router.push('/kiosk/consent')
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'var(--color-canvas)', color: 'var(--color-text-primary)' }}
    >
      {/* Spacer for fixed header */}
      <div className="h-14 sm:h-15 shrink-0" />

      {/* Main container */}
      <div className="flex-1 w-full max-w-2xl sm:max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {/* ════════════════════════════════════════════════════════════════════
              VIEW 1: SELECT IDENTIFICATION METHOD
          ════════════════════════════════════════════════════════════════════ */}
          {view === 'SELECT_METHOD' && (
            <motion.div
              key="select-method"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-5 sm:gap-6"
            >
              {/* Header Title with Audio Replay */}
              <div className="flex flex-col text-center gap-2">
                <div className="flex items-center justify-center gap-3">
                  <h1 className="text-[28px] sm:text-[34px] font-extrabold text-[var(--color-text-primary)] leading-tight">
                    {t.identify.title}
                  </h1>
                  <button
                    type="button"
                    onClick={handleHearInstructions}
                    className="p-2.5 rounded-full bg-[#EEF5FC] text-[#2365B5] hover:bg-[#D9E9F8] transition-all cursor-pointer shadow-xs shrink-0"
                    title="Listen to instructions (सूचना ऐका)"
                    aria-label="Listen to identification guidance"
                  >
                    <Volume2 size={24} className={isSpeaking ? 'animate-pulse text-[#174A91]' : ''} />
                  </button>
                </div>
                <p className="text-[16px] sm:text-[18px] font-semibold text-[#4B5565] max-w-xl mx-auto">
                  {t.identify.titleSub}
                </p>
              </div>

              {/* 🌟 Dedicated Green Button for Illiterate / Guest Walkthrough (Never Get Stuck) */}
              <button
                type="button"
                id="kiosk-guest-skip-btn"
                onClick={() => {
                  updateActivity()
                  const guestPatient: KioskPatientData = {
                    id: 'pat-marathi-rural-01',
                    name: language === 'mr' ? 'आनंदी शिंदे' : language === 'hi' ? 'आनंदी शिंदे' : 'Anandi Shinde',
                    age: 68,
                    sex: 'Female',
                    phone: '9820011223',
                    abhaNumber: '91-4421-9876-1234',
                    lastVisit: 'First OPD Visit',
                    preferredLanguage: language || 'mr',
                  }
                  if (language === 'mr') {
                    speak('थेट नोंदणी निवडली आहे. पुढे जात आहोत.', 'mr')
                  } else if (language === 'hi') {
                    speak('सीधी प्रविष्टि चुनी गई है। आगे बढ़ रहे हैं।', 'hi')
                  } else {
                    speak('Continuing as guest patient.', 'en')
                  }
                  handleSelectPatient(guestPatient, false)
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-5 sm:p-5.5 rounded-2xl border-2 border-emerald-500 shadow-md flex items-center justify-between gap-4 text-left cursor-pointer transition-all active:scale-[0.98] min-h-[96px]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/20 text-white flex items-center justify-center shrink-0">
                    <ArrowRight className="w-8 h-8 stroke-[3]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[20px] sm:text-[22px] font-extrabold leading-tight">
                        {language === 'mr'
                          ? 'हिरवे बटण: थेट पुढे जा (आभा कार्ड नाही)'
                          : language === 'hi'
                          ? 'हरा बटन: सीधे आगे बढ़ें (आभा कार्ड नहीं है)'
                          : 'Green Button: Continue Directly (No ABHA)'}
                      </span>
                      <span className="bg-white/25 text-white text-[13px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                        {language === 'mr' ? 'जलद प्रवेश' : 'Quick Start'}
                      </span>
                    </div>
                    <p className="text-[15px] sm:text-[16px] text-emerald-100 font-medium mt-1">
                      {language === 'mr'
                        ? 'नवीन रुग्ण म्हणून थेट तपासणीसाठी पुढे जा. कार्डची गरज नाही.'
                        : language === 'hi'
                        ? 'नए मरीज के रूप में सीधे आगे बढ़ें। कार्ड की आवश्यकता नहीं है।'
                        : 'Tap here to continue directly without ABHA or phone.'}
                    </p>
                  </div>
                </div>
              </button>

              {/* Option Cards Stack */}
              <div className="flex flex-col gap-3.5 w-full">
                {/* Option 1: Scan QR */}
                <button
                  onClick={() => {
                    setView('SCAN_QR')
                    updateActivity()
                  }}
                  className="w-full bg-white p-4 sm:p-5 rounded-2xl border border-[var(--color-border)] shadow-[0_2px_8px_rgba(41,78,74,0.06)] hover:shadow-[0_4px_16px_rgba(41,78,74,0.12)] hover:border-[var(--color-brand)]/40 transition-all duration-150 flex items-center gap-4 text-left group active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-brand)]/30 min-h-[92px]"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[var(--color-brand-mist)] text-[var(--color-brand)] flex items-center justify-center shrink-0 group-hover:bg-[var(--color-brand)] group-hover:text-white transition-colors">
                    <svg viewBox="0 0 24 24" className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7" rx="1.5" />
                      <rect x="14" y="3" width="7" height="7" rx="1.5" />
                      <rect x="3" y="14" width="7" height="7" rx="1.5" />
                      <path d="M14 14h3v3h-3zM17 17h4v4h-4zM14 20h3v1h-3zM20 14h1v3h-1z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-[19px] sm:text-[21px] font-extrabold text-[var(--color-text-primary)]">
                        {t.identify.methodAbha}
                      </h2>
                      <span className="bg-[var(--color-verified-subtle)] text-[var(--color-verified-text)] text-[13px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {t.identify.fastestBadge}
                      </span>
                    </div>
                    <p className="text-[15px] sm:text-[16px] text-[#4B5565] mt-0.5 leading-snug font-medium">
                      {t.identify.methodAbhaDesc}
                    </p>
                  </div>
                  <svg viewBox="0 0 20 20" className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-brand)] group-hover:translate-x-1 transition-all shrink-0" fill="none">
                    <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {/* Option 2: Enter ABHA / Mobile */}
                <button
                  onClick={() => {
                    setView('MANUAL_ENTRY')
                    setInputValue('')
                    setSearchError(null)
                    updateActivity()
                  }}
                  className="w-full bg-white p-4 sm:p-5 rounded-2xl border border-[var(--color-border)] shadow-[0_2px_8px_rgba(41,78,74,0.06)] hover:shadow-[0_4px_16px_rgba(41,78,74,0.12)] hover:border-[var(--color-brand)]/40 transition-all duration-150 flex items-center gap-4 text-left group active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-brand)]/30 min-h-[92px]"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[var(--color-brand-mist)] text-[var(--color-brand)] flex items-center justify-center shrink-0 group-hover:bg-[var(--color-brand)] group-hover:text-white transition-colors">
                    <svg viewBox="0 0 24 24" className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="5" y="2" width="14" height="20" rx="3" />
                      <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-[18px] sm:text-[19px] font-extrabold text-[var(--color-text-primary)]">
                      {t.identify.methodPhone}
                    </h2>
                    <p className="text-[13.5px] sm:text-[14.5px] text-[var(--color-text-secondary)] mt-0.5 leading-snug">
                      {t.identify.methodPhoneDesc}
                    </p>
                  </div>
                  <svg viewBox="0 0 20 20" className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-brand)] group-hover:translate-x-1 transition-all shrink-0" fill="none">
                    <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {/* Option 3: New Patient */}
                <button
                  onClick={() => {
                    setView('NEW_PATIENT_FORM')
                    setFormError(null)
                    updateActivity()
                  }}
                  className="w-full bg-white p-4 sm:p-5 rounded-2xl border border-[var(--color-border)] shadow-[0_2px_8px_rgba(41,78,74,0.06)] hover:shadow-[0_4px_16px_rgba(41,78,74,0.12)] hover:border-[var(--color-brand)]/40 transition-all duration-150 flex items-center gap-4 text-left group active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-brand)]/30 min-h-[92px]"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[var(--color-brand-mist)] text-[var(--color-brand)] flex items-center justify-center shrink-0 group-hover:bg-[var(--color-brand)] group-hover:text-white transition-colors">
                    <svg viewBox="0 0 24 24" className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <line x1="20" y1="8" x2="20" y2="14" strokeLinecap="round" />
                      <line x1="23" y1="11" x2="17" y2="11" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-[18px] sm:text-[19px] font-extrabold text-[var(--color-text-primary)]">
                        {t.identify.methodNew}
                      </h2>
                      <span className="bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)] text-[11.5px] font-bold px-2.5 py-0.5 rounded-md border border-[var(--color-border)]">
                        {t.identify.timeBadge}
                      </span>
                    </div>
                    <p className="text-[13.5px] sm:text-[14.5px] text-[var(--color-text-secondary)] mt-0.5 leading-snug">
                      {t.identify.methodNewDesc}
                    </p>
                  </div>
                  <svg viewBox="0 0 20 20" className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-brand)] group-hover:translate-x-1 transition-all shrink-0" fill="none">
                    <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              {/* Demo Profiles Bar */}
              <div className="bg-[var(--color-brand-mist)] border border-[var(--color-border-strong)] rounded-2xl p-4 sm:p-4.5 flex flex-col gap-2.5">
                <span className="text-[11.5px] font-extrabold text-[var(--color-brand)] tracking-wider uppercase">
                  ⚡ Demo Profiles
                </span>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <button
                    onClick={() => {
                      const dhananjay = DEMO_PATIENTS[0]
                      handleSelectPatient(
                        {
                          id: dhananjay.id,
                          name: dhananjay.name,
                          age: dhananjay.age ?? 67,
                          sex: 'Male',
                          phone: dhananjay.phone ?? '9876543210',
                          abhaNumber: dhananjay.abhaNumber,
                          lastVisit: '12 Aug 2026',
                          preferredLanguage: dhananjay.preferredLanguage,
                        },
                        true
                      )
                    }}
                    className="flex-1 px-4 py-3 bg-white rounded-xl text-left border border-[var(--color-border)] hover:border-[var(--color-brand)] hover:bg-[var(--color-surface-subtle)] transition-all text-[13.5px] flex items-center justify-between shadow-xs min-h-[58px]"
                  >
                    <div>
                      <span className="font-extrabold text-[var(--color-text-primary)] block">Dhananjay Patil (67)</span>
                      <span className="text-[11.5px] text-[var(--color-text-secondary)] font-mono">ABHA: 12-3456-7890-1234</span>
                    </div>
                    <span className="text-[12px] font-bold text-[var(--color-brand)]">Select →</span>
                  </button>

                  <button
                    onClick={() => {
                      const priya = DEMO_PATIENTS[1]
                      handleSelectPatient(
                        {
                          id: priya.id,
                          name: priya.name,
                          age: priya.age ?? 42,
                          sex: 'Female',
                          phone: priya.phone ?? '9876541234',
                          abhaNumber: '14-9876-5432-1098',
                          lastVisit: '18 Aug 2026',
                          preferredLanguage: priya.preferredLanguage,
                        },
                        true
                      )
                    }}
                    className="flex-1 px-4 py-3 bg-white rounded-xl text-left border border-[var(--color-border)] hover:border-[var(--color-brand)] hover:bg-[var(--color-surface-subtle)] transition-all text-[13.5px] flex items-center justify-between shadow-xs min-h-[58px]"
                  >
                    <div>
                      <span className="font-extrabold text-[var(--color-text-primary)] block">Priya Menon (42)</span>
                      <span className="text-[11.5px] text-[var(--color-text-secondary)] font-mono">Mobile: 9876541234</span>
                    </div>
                    <span className="text-[12px] font-bold text-[var(--color-brand)]">Select →</span>
                  </button>
                </div>
              </div>

              {/* Navigation Back */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => router.push('/kiosk/language')}
                  className="text-[14.5px] font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] flex items-center gap-1.5 py-2 px-3 rounded-lg hover:bg-[var(--color-surface-subtle)] transition-colors"
                >
                  ← {t.common.back}
                </button>

                <div className="flex items-center gap-1.5 text-[12.5px] font-medium text-[var(--color-text-muted)]">
                  <span>🔒 {t.common.secure}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              VIEW 2: QR SCANNER VIEW
          ════════════════════════════════════════════════════════════════════ */}
          {view === 'SCAN_QR' && (
            <motion.div
              key="scan-qr"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="text-center">
                <h1 className="text-[26px] font-bold text-[var(--color-text-primary)]">
                  {t.identify.scanQrTitle}
                </h1>
                <p className="text-[14px] text-[var(--color-text-secondary)] mt-1">
                  {t.identify.scanQrDesc}
                </p>
              </div>

              {/* Viewfinder */}
              <div className="relative w-[280px] h-[280px] bg-[#1a2321] rounded-3xl overflow-hidden shadow-xl flex items-center justify-center border-4 border-[var(--color-border)]">
                <div className="absolute inset-6 border-2 border-white/20 rounded-2xl pointer-events-none flex flex-col justify-between p-2">
                  <div className="flex justify-between">
                    <div className="w-6 h-6 border-t-4 border-l-4 border-[var(--color-brand-light)] -mt-1 -ml-1 rounded-tl" />
                    <div className="w-6 h-6 border-t-4 border-r-4 border-[var(--color-brand-light)] -mt-1 -mr-1 rounded-tr" />
                  </div>
                  <div className="flex justify-between">
                    <div className="w-6 h-6 border-b-4 border-l-4 border-[var(--color-brand-light)] -mb-1 -ml-1 rounded-bl" />
                    <div className="w-6 h-6 border-b-4 border-r-4 border-[var(--color-brand-light)] -mb-1 -mr-1 rounded-br" />
                  </div>
                </div>

                <div
                  className="absolute left-6 right-6 h-[3px] bg-[var(--color-verified)] shadow-[0_0_12px_var(--color-verified)] motion-safe:animate-bounce"
                  style={{ animationDuration: '2s' }}
                />

                <div className="text-white/40 flex flex-col items-center gap-2">
                  <svg viewBox="0 0 24 24" className="w-14 h-14" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                    <circle cx="17.5" cy="17.5" r="2.5" />
                  </svg>
                  <span className="text-[12px] font-mono tracking-widest uppercase">Scanner Active</span>
                </div>
              </div>

              {/* Simulation CTA */}
              <div className="flex flex-col gap-3 w-full max-w-[400px]">
                <KioskButton
                  variant="primary"
                  size="full"
                  onClick={() => {
                    performLookup('12-3456-7890-1234', 'ABHA')
                  }}
                >
                  {t.identify.simScanBtn}
                </KioskButton>

                <KioskButton
                  variant="ghost"
                  size="full"
                  onClick={() => {
                    setView('SELECT_METHOD')
                    updateActivity()
                  }}
                >
                  ← {t.common.back}
                </KioskButton>
              </div>
            </motion.div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              VIEW 3: MANUAL NUMERIC KEYPAD ENTRY
          ════════════════════════════════════════════════════════════════════ */}
          {view === 'MANUAL_ENTRY' && (
            <motion.div
              key="manual-entry"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4 sm:gap-5"
            >
              <div className="text-center">
                <h1 className="text-[26px] sm:text-[30px] font-extrabold text-[var(--color-text-primary)]">
                  {manualType === 'ABHA' ? t.identify.enterAbha : t.identify.enterPhone}
                </h1>
                <p className="text-[14px] sm:text-[15px] font-medium text-[var(--color-text-secondary)] mt-0.5">
                  {t.identify.titleSub}
                </p>
              </div>

              {/* Switcher Tab */}
              <div className="flex bg-[var(--color-surface-subtle)] p-1.5 rounded-2xl border border-[var(--color-border)]">
                <button
                  onClick={() => {
                    setManualType('ABHA')
                    setInputValue('')
                    setSearchError(null)
                    updateActivity()
                  }}
                  className={[
                    'flex-1 py-3 text-[14.5px] sm:text-[15.5px] font-extrabold rounded-xl transition-all cursor-pointer',
                    manualType === 'ABHA'
                      ? 'bg-white text-[var(--color-brand)] shadow-sm'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
                  ].join(' ')}
                >
                  ABHA (14-Digit)
                </button>
                <button
                  onClick={() => {
                    setManualType('MOBILE')
                    setInputValue('')
                    setSearchError(null)
                    updateActivity()
                  }}
                  className={[
                    'flex-1 py-3 text-[14.5px] sm:text-[15.5px] font-extrabold rounded-xl transition-all cursor-pointer',
                    manualType === 'MOBILE'
                      ? 'bg-white text-[var(--color-brand)] shadow-sm'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
                  ].join(' ')}
                >
                  Mobile (10-Digit)
                </button>
              </div>

              {/* Formatted Display */}
              <div className="flex flex-col gap-1.5">
                <div className="bg-white border-2 border-[var(--color-brand)] rounded-2xl h-16 sm:h-18 px-5 flex items-center justify-between shadow-inner">
                  {manualType === 'MOBILE' && (
                    <span className="text-[22px] sm:text-[24px] font-mono font-bold text-[var(--color-text-muted)] mr-2">
                      +91
                    </span>
                  )}
                  <input
                    type="text"
                    readOnly
                    value={inputValue}
                    placeholder={manualType === 'ABHA' ? '12-3456-7890-1234' : '98765 43210'}
                    className="w-full text-[24px] sm:text-[28px] font-mono font-bold text-[var(--color-text-primary)] bg-transparent outline-none tracking-wider placeholder:text-[var(--color-text-muted)]"
                  />
                  {inputValue && (
                    <button
                      onClick={() => {
                        setInputValue('')
                        updateActivity()
                      }}
                      className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] p-2 font-bold cursor-pointer"
                      aria-label={t.identify.keypadClear}
                    >
                      ✕
                    </button>
                  )}
                </div>

                {searchError && (
                  <p className="text-[13.5px] font-semibold text-[var(--color-critical)] px-2">
                    {searchError}
                  </p>
                )}
              </div>

              {/* Touch Keypad Grid */}
              <div className="grid grid-cols-3 gap-2.5 max-w-[440px] mx-auto w-full">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'CLEAR', '0', 'BACKSPACE'].map((k) => (
                  <button
                    key={k}
                    onClick={() => handleKeypadPress(k)}
                    className={[
                      'h-14 sm:h-16 rounded-2xl text-[22px] sm:text-[24px] font-extrabold transition-all active:scale-95 shadow-sm select-none cursor-pointer',
                      k === 'CLEAR'
                        ? 'bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)] text-[14px] font-bold'
                        : k === 'BACKSPACE'
                        ? 'bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)] flex items-center justify-center'
                        : 'bg-white text-[var(--color-text-primary)] hover:bg-[var(--color-surface-subtle)] border border-[var(--color-border)]',
                    ].join(' ')}
                  >
                    {k === 'BACKSPACE' ? (
                      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                        <line x1="18" y1="9" x2="12" y2="15" />
                        <line x1="12" y1="9" x2="18" y2="15" />
                      </svg>
                    ) : k === 'CLEAR' ? (
                      t.identify.keypadClear
                    ) : (
                      k
                    )}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 max-w-[440px] mx-auto w-full pt-1">
                <KioskButton
                  variant="ghost"
                  size="md"
                  onClick={() => {
                    setView('SELECT_METHOD')
                    updateActivity()
                  }}
                >
                  {t.common.back}
                </KioskButton>

                <KioskButton
                  variant="primary"
                  size="md"
                  className="flex-1"
                  disabled={
                    manualType === 'ABHA'
                      ? inputValue.replace(/\D/g, '').length < 14
                      : inputValue.replace(/\D/g, '').length < 10
                  }
                  onClick={() => performLookup(inputValue, manualType)}
                >
                  {t.identify.keypadSearch}
                </KioskButton>
              </div>
            </motion.div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              VIEW 4: SEARCHING SPINNER
          ════════════════════════════════════════════════════════════════════ */}
          {view === 'SEARCHING' && (
            <motion.div
              key="searching"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center gap-6 py-16 text-center"
            >
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-[var(--color-border)]" />
                <div className="absolute inset-0 rounded-full border-4 border-[var(--color-brand)] border-t-transparent animate-spin" />
              </div>
              <div className="space-y-1">
                <h2 className="text-[24px] font-extrabold text-[var(--color-text-primary)]">
                  {t.identify.searching}
                </h2>
                <p className="text-[14px] text-[var(--color-text-secondary)] font-medium">
                  AIIA OPD Registry &amp; ABHA Network
                </p>
              </div>
            </motion.div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              VIEW 5: CONFIRM RETURNING PATIENT
          ════════════════════════════════════════════════════════════════════ */}
          {view === 'CONFIRM_RETURNING' && activePatient && (
            <motion.div
              key="confirm-returning"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-6"
            >
              <div className="text-center flex flex-col gap-1">
                <h1 className="text-[30px] sm:text-[34px] font-extrabold text-[var(--color-text-primary)] leading-tight">
                  {t.identify.patientFound}
                </h1>
                <p className="text-[15px] sm:text-[16px] font-medium text-[var(--color-text-secondary)] mt-0.5">
                  {t.identify.isThisYou}
                </p>
              </div>

              {/* Profile Card */}
              <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(41,78,74,0.06)] p-6 sm:p-7 flex flex-col gap-4 border border-[var(--color-border)]">
                <div className="flex items-center gap-4 pb-4 border-b border-[var(--color-border)]">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-[var(--color-brand-mist)] border border-[var(--color-border-strong)] flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" className="w-9 h-9 text-[var(--color-brand)]" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[24px] sm:text-[26px] font-extrabold text-[var(--color-text-primary)] leading-tight">
                      {activePatient.name}
                    </span>
                    {activePatient.abhaNumber && (
                      <div className="inline-flex items-center gap-1.5 text-[12.5px] font-mono text-[var(--color-brand)] bg-[var(--color-brand-mist)] px-3 py-1 rounded-lg mt-1 w-fit border border-[var(--color-border-strong)]">
                        <span>ABHA:</span>
                        <span className="font-bold">{activePatient.abhaNumber}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3.5 pt-1 text-[15.5px] sm:text-[16px]">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-[var(--color-text-secondary)] font-medium">{t.identify.ageLabel}</span>
                    <span className="font-extrabold text-[var(--color-text-primary)]">
                      {activePatient.age} yrs
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="text-[var(--color-text-secondary)] font-medium">{t.identify.genderLabel}</span>
                    <span className="font-bold text-[var(--color-text-primary)]">
                      {activePatient.sex === 'Male'
                        ? t.identify.male
                        : activePatient.sex === 'Female'
                        ? t.identify.female
                        : t.identify.other}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="text-[var(--color-text-secondary)] font-medium">{t.identify.phoneLabel}</span>
                    <span className="font-mono font-bold text-[var(--color-text-primary)]">
                      {activePatient.phone.slice(0, 5)} ●●●●●
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-t border-[var(--color-border)] pt-3">
                    <span className="text-[var(--color-text-secondary)] font-medium">{t.identify.lastVisitLabel}</span>
                    <span className="font-bold text-[var(--color-verified)]">
                      {activePatient.lastVisit ?? '12 Aug 2026'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 w-full">
                <KioskButton
                  variant="primary"
                  size="fullLg"
                  onClick={handleProceedToConsent}
                >
                  {t.identify.yesThisIsMe}
                </KioskButton>

                <KioskButton
                  variant="ghost"
                  size="full"
                  onClick={() => {
                    setView('SELECT_METHOD')
                    updateActivity()
                  }}
                >
                  {t.identify.notMe}
                </KioskButton>
              </div>
            </motion.div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              VIEW 6: NEW PATIENT REGISTRATION FORM
          ════════════════════════════════════════════════════════════════════ */}
          {view === 'NEW_PATIENT_FORM' && (
            <motion.div
              key="new-patient-form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-4 sm:gap-5"
            >
              <div className="text-center">
                <h1 className="text-[26px] sm:text-[30px] font-extrabold text-[var(--color-text-primary)]">
                  {t.identify.registerTitle}
                </h1>
                <p className="text-[14px] sm:text-[15px] font-medium text-[var(--color-text-secondary)] mt-0.5">
                  {t.identify.titleSub}
                </p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[15px] font-extrabold text-[var(--color-text-primary)]">
                    {t.identify.nameLabel} <span className="text-[var(--color-critical)]">*</span>
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => {
                      setNewName(e.target.value)
                      updateActivity()
                    }}
                    placeholder={t.identify.namePlaceholder}
                    className="w-full h-14 sm:h-15 px-4.5 bg-white rounded-2xl border-2 border-[var(--color-border)] focus:border-[var(--color-brand)] text-[16.5px] font-semibold text-[var(--color-text-primary)] outline-none transition-all shadow-sm"
                  />
                </div>

                {/* Age / DOB Section */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[15px] font-extrabold text-[var(--color-text-primary)]">
                      {t.identify.ageLabel} <span className="text-[var(--color-critical)]">*</span>
                    </label>
                    <div className="flex bg-[var(--color-surface-subtle)] p-1 rounded-xl text-[12.5px] border border-[var(--color-border)]">
                      <button
                        type="button"
                        onClick={() => setAgeMode('AGE')}
                        className={[
                          'px-3.5 py-1 rounded-lg font-bold transition-all cursor-pointer',
                          ageMode === 'AGE' ? 'bg-white text-[var(--color-brand)] shadow-sm' : 'text-[var(--color-text-secondary)]',
                        ].join(' ')}
                      >
                        {t.identify.ageModeLabel}
                      </button>
                      <button
                        type="button"
                        onClick={() => setAgeMode('DOB')}
                        className={[
                          'px-3.5 py-1 rounded-lg font-bold transition-all cursor-pointer',
                          ageMode === 'DOB' ? 'bg-white text-[var(--color-brand)] shadow-sm' : 'text-[var(--color-text-secondary)]',
                        ].join(' ')}
                      >
                        {t.identify.dobModeLabel}
                      </button>
                    </div>
                  </div>

                  {ageMode === 'AGE' ? (
                    <input
                      type="number"
                      value={newAge}
                      onChange={(e) => {
                        setNewAge(e.target.value)
                        updateActivity()
                      }}
                      placeholder="Age (e.g. 45)"
                      className="w-full h-14 sm:h-15 px-4.5 bg-white rounded-2xl border-2 border-[var(--color-border)] focus:border-[var(--color-brand)] text-[16.5px] font-bold text-[var(--color-text-primary)] outline-none transition-all shadow-sm font-mono"
                    />
                  ) : (
                    <input
                      type="date"
                      value={newDob}
                      onChange={(e) => {
                        setNewDob(e.target.value)
                        updateActivity()
                      }}
                      className="w-full h-14 sm:h-15 px-4.5 bg-white rounded-2xl border-2 border-[var(--color-border)] focus:border-[var(--color-brand)] text-[16.5px] font-semibold text-[var(--color-text-primary)] outline-none transition-all shadow-sm"
                    />
                  )}
                </div>

                {/* Sex Selector */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[15px] font-extrabold text-[var(--color-text-primary)]">
                    {t.identify.genderLabel} <span className="text-[var(--color-critical)]">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['Male', 'Female', 'Other'] as const).map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => {
                          setNewSex(s)
                          updateActivity()
                        }}
                        className={[
                          'h-13 sm:h-14 py-3 rounded-xl font-extrabold text-[15px] border-2 transition-all active:scale-98 cursor-pointer',
                          newSex === s
                            ? 'bg-[var(--color-brand)] text-white border-[var(--color-brand)] shadow-md'
                            : 'bg-white text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-surface-subtle)]',
                        ].join(' ')}
                      >
                        {s === 'Male' ? t.identify.male : s === 'Female' ? t.identify.female : t.identify.other}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Number */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[15px] font-extrabold text-[var(--color-text-primary)]">
                    {t.identify.phoneLabel} <span className="text-[var(--color-critical)]">*</span>
                  </label>
                  <div className="flex h-14 sm:h-15 bg-white rounded-2xl border-2 border-[var(--color-border)] focus-within:border-[var(--color-brand)] shadow-sm overflow-hidden">
                    <div className="bg-[var(--color-surface-subtle)] px-4.5 flex items-center text-[15.5px] font-bold text-[var(--color-text-secondary)] border-r border-[var(--color-border)]">
                      +91
                    </div>
                    <input
                      type="tel"
                      value={newPhone}
                      onChange={(e) => {
                        setNewPhone(e.target.value.replace(/\D/g, '').slice(0, 10))
                        updateActivity()
                      }}
                      placeholder={t.identify.phonePlaceholder}
                      className="flex-1 px-4 text-[16.5px] font-mono font-bold text-[var(--color-text-primary)] outline-none"
                    />
                  </div>
                </div>

                {formError && (
                  <div className="p-3 bg-[var(--color-critical-subtle)] border border-[var(--color-critical)] text-[var(--color-critical-text)] text-[13.5px] rounded-xl font-bold">
                    {formError}
                  </div>
                )}

                <div className="flex flex-col gap-2.5 pt-2">
                  <KioskButton
                    type="submit"
                    variant="primary"
                    size="fullLg"
                    isLoading={isSubmitting}
                  >
                    {t.identify.registerButton}
                  </KioskButton>

                  <KioskButton
                    type="button"
                    variant="ghost"
                    size="full"
                    onClick={() => {
                      setView('SELECT_METHOD')
                      updateActivity()
                    }}
                  >
                    ← {t.common.cancel}
                  </KioskButton>
                </div>
              </form>
            </motion.div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              VIEW 7: NEW PATIENT SUCCESS CONFIRMATION
          ════════════════════════════════════════════════════════════════════ */}
          {view === 'NEW_PATIENT_SUCCESS' && activePatient && (
            <motion.div
              key="new-patient-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center text-center gap-6"
            >
              <div className="w-20 h-20 rounded-full bg-[var(--color-verified)] text-white flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <div className="space-y-1">
                <span className="text-[13px] font-bold text-[var(--color-verified)] tracking-wider uppercase">
                  {t.identify.newSuccessTitle}
                </span>
                <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[var(--color-text-primary)]">
                  {activePatient.name}
                </h1>
                <p className="text-[14.5px] sm:text-[15.5px] text-[var(--color-text-secondary)] font-medium">
                  {t.identify.newSuccessSub}
                </p>
              </div>

              <div className="w-full bg-white rounded-2xl p-5 border border-[var(--color-border)] shadow-sm flex flex-col gap-3 text-left text-[15px]">
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)] font-medium">{t.identify.nameLabel}:</span>
                  <span className="font-extrabold text-[var(--color-text-primary)]">{activePatient.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)] font-medium">{t.identify.ageLabel} / {t.identify.genderLabel}:</span>
                  <span className="font-bold text-[var(--color-text-primary)]">
                    {activePatient.age} · {activePatient.sex === 'Male' ? t.identify.male : activePatient.sex === 'Female' ? t.identify.female : t.identify.other}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)] font-medium">{t.identify.phoneLabel}:</span>
                  <span className="font-mono font-bold text-[var(--color-text-primary)]">+91 {activePatient.phone}</span>
                </div>
              </div>

              <div className="w-full">
                <KioskButton
                  variant="primary"
                  size="fullLg"
                  onClick={handleProceedToConsent}
                >
                  {t.common.continue} →
                </KioskButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
