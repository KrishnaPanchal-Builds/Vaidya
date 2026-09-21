'use client'
/**
 * K-04 — Informed Consent Screen (Phase 3 Handoff Screen)
 *
 * Route: /kiosk/consent
 *
 * Multilingual Architecture:
 * - Powered by useKioskTranslation() for complete EN, HI, MR translations.
 */

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useKioskStore } from '@/store/kiosk.store'
import { useKioskTranslation } from '@/lib/hooks/use-kiosk-translation'
import { useVoiceAgent } from '@/lib/hooks/use-voice-agent'
import { Volume2, CheckCircle2, XCircle } from 'lucide-react'

export default function KioskConsentPage() {
  const router = useRouter()
  const { t } = useKioskTranslation()
  const { language, patientData, advanceStep, resetSession, updateActivity } = useKioskStore()
  const { speak, speakOnMount, isSpeaking, stop } = useVoiceAgent()

  const consentAudioText =
    language === 'mr'
      ? 'तुमची संमती: या कियोस्कमध्ये तुम्ही दिलेली सर्व माहिती केवळ डॉक्टरांच्या उपचारासाठी वापरली जाईल. माहिती पूर्णपणे सुरक्षित व गोपनीय राहील. संमती देण्यासाठी हिरवे होय बटण दाबा.'
      : language === 'hi'
      ? 'आपकी सहमति: इस कियोस्क में दी गई आपकी सभी जानकारी केवल डॉक्टर के परामर्श के लिए उपयोग की जाएगी। आपकी जानकारी पूरी तरह सुरक्षित रहेगी। सहमति के लिए हरा हां बटन दबाएं।'
      : 'Informed Consent: All medical details you share will be used solely for doctor consultation. Your data remains completely confidential. Touch the green button to agree.'

  useEffect(() => {
    advanceStep('CONSENT')
  }, [advanceStep])

  // Spoken voice guidance on screen mount
  useEffect(() => {
    return speakOnMount(consentAudioText, language || 'mr', 400)
  }, [speakOnMount, consentAudioText, language])

  const handleToggleAudio = useCallback(() => {
    updateActivity()
    if (isSpeaking) {
      stop()
    } else {
      speak(consentAudioText, language || 'mr')
    }
  }, [consentAudioText, isSpeaking, language, speak, stop, updateActivity])

  const handleAgreeConsent = () => {
    updateActivity()
    const confirmText =
      language === 'mr'
        ? 'होय, तुमची संमती नोंदवली गेली आहे. धन्यवाद.'
        : language === 'hi'
        ? 'हां, आपकी सहमति दर्ज कर ली गई है। धन्यवाद।'
        : 'You said yes. Consent recorded. Thank you.'

    speak(confirmText, language || 'mr', () => {
      advanceStep('INTAKE')
      router.push('/kiosk/intake')
    })
    // Also trigger router transition immediately so there is zero UI lag
    setTimeout(() => {
      advanceStep('INTAKE')
      router.push('/kiosk/intake')
    }, 450)
  }

  const handleDeclineConsent = () => {
    updateActivity()
    const declineText =
      language === 'mr'
        ? 'संमती नाकारली आहे. मुख्य पृष्ठावर परत जात आहोत.'
        : language === 'hi'
        ? 'सहमति अस्वीकृत की गई। मुख्य पृष्ठ पर लौट रहे हैं।'
        : 'Consent declined. Returning to main screen.'

    speak(declineText, language || 'mr')
    resetSession()
    router.replace('/kiosk')
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-canvas)] text-[var(--color-text-primary)]">
      {/* Spacer for header */}
      <div className="h-14 sm:h-15 shrink-0" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex-1 w-full max-w-2xl sm:max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col gap-4 sm:gap-5 justify-center"
      >
        {/* Top greeting badge with patient context if identified */}
        {patientData && (
          <div className="flex items-center justify-between bg-[var(--color-surface)] px-4 sm:px-5 py-3 rounded-2xl border border-[var(--color-border)] shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[var(--color-sage-soft)] text-[var(--color-brand)] flex items-center justify-center font-extrabold text-[16px]">
                {patientData.name.charAt(0)}
              </div>
              <div>
                <span className="text-[17px] sm:text-[19px] font-extrabold text-[var(--color-text-primary)] block leading-tight">
                  {patientData.name}
                </span>
                <span className="text-[14px] sm:text-[15px] text-[var(--color-text-muted)] font-semibold">
                  {patientData.age} yrs · {patientData.sex}
                </span>
              </div>
            </div>
            <span className="text-[13px] sm:text-[14px] font-bold text-[var(--color-verified)] bg-[var(--color-verified-bg)] border border-[var(--color-sage-border)] px-3 py-1 rounded-full uppercase tracking-wider">
              {language === 'mr' ? 'पडताळणी पूर्ण' : 'Verified'}
            </span>
          </div>
        )}

        {/* Heading Section with Voice Replay */}
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2.5">
            <h1 className="text-[28px] sm:text-[34px] font-extrabold text-[var(--color-text-primary)] leading-tight">
              {t.consent.title}
            </h1>
            <button
              type="button"
              onClick={handleToggleAudio}
              className="p-2.5 rounded-full bg-[#EEF5FC] text-[#2365B5] hover:bg-[#D9E9F8] transition-all cursor-pointer shadow-xs shrink-0"
              title="Hear consent spoken aloud (संमती ऐका)"
              aria-label="Listen to consent explanation"
            >
              <Volume2 size={24} className={isSpeaking ? 'animate-pulse text-[#174A91]' : ''} />
            </button>
          </div>
          <p className="text-[16px] sm:text-[17.5px] font-semibold text-[var(--color-text-secondary)] max-w-xl mx-auto">
            {t.consent.titleSub}
          </p>
        </div>

        {/* Tactile Audio Assistance Bar */}
        <button
          type="button"
          onClick={handleToggleAudio}
          className="bg-[var(--color-surface)] rounded-2xl p-4 sm:p-4.5 shadow-sm border-2 border-[var(--color-brand)]/20 hover:border-[var(--color-brand)] transition-all text-left cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-[var(--color-sage-soft)] text-[var(--color-brand)] flex items-center justify-center shrink-0">
              <Volume2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-[17px] sm:text-[18px] font-extrabold text-[var(--color-text-primary)]">
                {isSpeaking ? (language === 'mr' ? 'आवाज सुरू आहे…' : 'Playing consent audio…') : (language === 'mr' ? 'मराठी आवाज ऐका (Tap to Listen)' : t.consent.audioTitle)}
              </p>
              <div className="flex items-center gap-2 text-[14px] sm:text-[14.5px] text-[var(--color-text-muted)] mt-0.5 font-bold">
                <span>{language === 'mr' ? 'मराठी स्पष्टीकरण' : language === 'hi' ? 'हिंदी स्पष्टीकरण' : 'Spoken guidance'}</span>
                <span>•</span>
                <span>{isSpeaking ? 'टॅप करून थांबवा' : 'ऐकण्यासाठी टॅप करा'}</span>
              </div>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#EEF5FC] flex items-center justify-center text-[#2365B5] font-extrabold text-[16px]">
            {isSpeaking ? '❚❚' : '▶'}
          </div>
        </button>

        {/* 3 Privacy & Process Cards & Action Buttons */}
        <div className="bg-[var(--color-surface)] rounded-3xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[var(--color-border)] flex flex-col gap-4.5">
          {/* Pillar 1 */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-sage-soft)] text-[var(--color-brand)] flex items-center justify-center shrink-0 mt-0.5">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="22" />
              </svg>
            </div>
            <div>
              <h3 className="text-[18px] sm:text-[20px] font-extrabold text-[var(--color-text-primary)]">
                {t.consent.pillar1Title}
              </h3>
              <p className="text-[15.5px] sm:text-[16.5px] text-[#4B5565] mt-1 leading-relaxed font-semibold">
                {t.consent.pillar1Desc}
              </p>
            </div>
          </div>

          <div className="w-full h-[1px] bg-[var(--color-border)]" />

          {/* Pillar 2 */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-sage-soft)] text-[var(--color-brand)] flex items-center justify-center shrink-0 mt-0.5">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <div>
              <h3 className="text-[18px] sm:text-[20px] font-extrabold text-[var(--color-text-primary)]">
                {t.consent.pillar2Title}
              </h3>
              <p className="text-[15.5px] sm:text-[16.5px] text-[#4B5565] mt-1 leading-relaxed font-semibold">
                {t.consent.pillar2Desc}
              </p>
            </div>
          </div>

          <div className="w-full h-[1px] bg-[var(--color-border)]" />

          {/* Pillar 3 */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-sage-soft)] text-[var(--color-brand)] flex items-center justify-center shrink-0 mt-0.5">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <polyline points="17 11 19 13 23 9" />
              </svg>
            </div>
            <div>
              <h3 className="text-[18px] sm:text-[20px] font-extrabold text-[var(--color-text-primary)]">
                {t.consent.pillar3Title}
              </h3>
              <p className="text-[15.5px] sm:text-[16.5px] text-[#4B5565] mt-1 leading-relaxed font-semibold">
                {t.consent.pillar3Desc}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons: Large Green Yes and Grey No */}
        <div className="flex flex-col gap-3.5 w-full pt-2">
          <button
            type="button"
            id="kiosk-consent-agree-btn"
            onClick={handleAgreeConsent}
            className="w-full min-h-[72px] sm:min-h-[80px] bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white px-6 py-4 rounded-2xl shadow-lg border-2 border-emerald-500 font-extrabold text-[22px] sm:text-[25px] flex items-center justify-center gap-3 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-8 h-8 shrink-0 stroke-[2.8]" />
            <span>
              {language === 'mr'
                ? 'होय, माझी संमती आहे (YES, AGREE)'
                : language === 'hi'
                ? 'हाँ, मेरी सहमति है (YES, AGREE)'
                : 'Yes, I Agree & Give Consent'}
            </span>
          </button>

          <div className="flex gap-3 w-full">
            <button
              type="button"
              id="kiosk-consent-decline-btn"
              onClick={handleDeclineConsent}
              className="flex-1 min-h-[54px] sm:min-h-[58px] bg-white hover:bg-rose-50 text-rose-700 border-2 border-slate-300 hover:border-rose-300 px-4 py-2.5 rounded-xl font-bold text-[16px] sm:text-[18px] flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <XCircle className="w-5 h-5 shrink-0" />
              <span>{language === 'mr' ? 'नाही / संमती नाही' : language === 'hi' ? 'नहीं / अस्वीकार' : 'No / Decline'}</span>
            </button>

            <button
              type="button"
              onClick={() => router.push('/kiosk/identify')}
              className="min-h-[54px] sm:min-h-[58px] px-5 py-2.5 rounded-xl border border-[#CBD8E5] bg-[#F8FAFC] text-[#4B5565] font-bold text-[16px] hover:bg-[#EEF2F6] hover:text-[#17191F] transition-all cursor-pointer"
            >
              ← {t.common.back}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
