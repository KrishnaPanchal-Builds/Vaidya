'use client'
/**
 * K-01 — Canonical Multilingual Kiosk Welcome & Language Screen
 *
 * Route: /kiosk
 * Directly presents the 6-language tile grid with multi-script title stack
 * (Consolidated to match Screenshot 2026-09-20 230230.png).
 */

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useKioskStore } from '@/store/kiosk.store'
import { useKioskTranslation } from '@/lib/hooks/use-kiosk-translation'
import { useVoiceAgent } from '@/lib/hooks/use-voice-agent'
import { LanguageTile } from '@/components/kiosk/language-tile'
import { KioskButton } from '@/components/kiosk/kiosk-button'
import { KIOSK_LANGUAGES } from '@/lib/kiosk-localization'
import { kioskService } from '@/services/kiosk.service'
import VaidyaWordmark from '@/components/ui/VaidyaWordmark'
import { ShieldCheck, Volume2 } from 'lucide-react'
import type { Language } from '@/types'

const HEADING_LINES = [
  { text: 'Welcome', opacity: 1.0, lang: 'en', size: 'text-[38px] sm:text-[48px]' },
  { text: 'स्वागत है', opacity: 0.90, lang: 'hi', size: 'text-[32px] sm:text-[40px]' },
  { text: 'સ્વાગત છે · স্বাগতম · வரவேற்பு', opacity: 0.70, lang: 'gu', size: 'text-[24px] sm:text-[30px]' },
]

export default function KioskAttractPage() {
  const router = useRouter()
  const { t } = useKioskTranslation()
  const { speak, speakOnMount, isSpeaking } = useVoiceAgent()
  const {
    language: storedLang,
    status,
    setLanguage,
    beginSession,
    advanceStep,
    setSessionRefs,
    updateActivity,
  } = useKioskStore()

  const [selected, setSelected] = useState<Language | null>(storedLang || 'mr')
  const [isContinuing, setIsContinuing] = useState(false)
  const [showCleared, setShowCleared] = useState(false)

  // Auto-speak sequential welcome invitation in Marathi, Hindi, and English
  useEffect(() => {
    return speakOnMount(
      'कृपया तुमची भाषा निवडा. अपनी भाषा चुनें. Please select your language to begin.',
      'mr',
      500
    )
  }, [speakOnMount])

  // Show "session cleared" feedback banner if redirected from reset
  useEffect(() => {
    if (status === 'reset') {
      setShowCleared(true)
      const timer = setTimeout(() => setShowCleared(false), 4000)
      return () => clearTimeout(timer)
    }
  }, [status])

  const handleSelect = useCallback(
    (code: Language) => {
      setSelected(code)
      setLanguage(code)
      updateActivity()

      // Immediate spoken confirmation in chosen language
      if (code === 'mr') {
        speak('मराठी भाषा निवडली आहे. पुढे जाण्यासाठी खालील हिरवे बटण दाबा.', 'mr')
      } else if (code === 'hi') {
        speak('हिंदी भाषा चुनी गई है। आगे बढ़ने के लिए नीचे दिए गए बटन को दबाएं।', 'hi')
      } else {
        speak('English selected. Touch the button below to continue.', 'en')
      }
    },
    [setLanguage, updateActivity, speak]
  )

  const handleHearAgain = () => {
    updateActivity()
    speak('कृपया तुमची भाषा निवडा. अपनी भाषा चुनें. Please select your language to begin.', 'mr')
  }

  const handleContinue = useCallback(async () => {
    if (!selected || isContinuing) return
    setIsContinuing(true)

    setLanguage(selected)
    beginSession()
    advanceStep('IDENTIFY')

    kioskService
      .initSession()
      .then(({ sessionId, sessionHash }) => {
        setSessionRefs(sessionId, sessionHash)
      })
      .catch(() => {
        // Fallback gracefully in offline / demo mode
      })

    router.push('/kiosk/identify')
  }, [selected, isContinuing, setLanguage, beginSession, advanceStep, setSessionRefs, router])

  return (
    <div
      className="min-h-screen flex flex-col justify-between selection:bg-[#2365B5]/20 select-none antialiased relative"
      style={{ background: 'var(--color-canvas)', color: 'var(--color-text-primary)' }}
    >
      {/* Session cleared feedback banner */}
      <div
        role="status"
        aria-live="polite"
        className={[
          'fixed top-4 left-1/2 -translate-x-1/2 z-50',
          'flex items-center gap-3 px-6 py-3 rounded-2xl',
          'bg-[var(--color-verified)] text-white shadow-lg border border-[var(--color-verified-text)]',
          'transition-all duration-500 ease-out',
          showCleared ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none',
        ].join(' ')}
      >
        <ShieldCheck className="w-5 h-5 shrink-0" />
        <span className="text-[14px] font-semibold">{t.attract.sessionCleared}</span>
      </div>

      {/* Top Header Bar matching Screenshot 230230 */}
      <header className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <VaidyaWordmark size="md" showDescriptor={true} variant="default" />
        </div>

        {/* Mini Pill Language Bar */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--color-border)] bg-white/80 backdrop-blur-md shadow-2xs text-[12px] font-bold text-[var(--color-text-secondary)] overflow-x-auto">
          {KIOSK_LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => handleSelect(l.code)}
              className={[
                'px-2.5 py-1 rounded-lg transition-all cursor-pointer font-bold',
                selected === l.code
                  ? 'bg-[#2365B5] text-white shadow-xs'
                  : 'hover:bg-[#F3F8FD] hover:text-[var(--color-text-primary)]',
              ].join(' ')}
            >
              {l.code === 'en' ? 'EN' : l.native}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col justify-center gap-6 sm:gap-7 z-10">
        {/* Multilingual Heading Stack */}
        <div className="flex flex-col items-center text-center gap-1.5">
          {HEADING_LINES.map((line) => (
            <h1
              key={line.lang}
              lang={line.lang}
              className={`${line.size} font-extrabold text-[#17191F] tracking-tight leading-tight`}
              style={{ opacity: line.opacity }}
            >
              {line.text}
            </h1>
          ))}
        </div>

        {/* Instruction Subheading with Spoken Audio Guide Button */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="flex items-center justify-center gap-2.5">
            <h2 className="text-[22px] sm:text-[26px] text-[#17191F] font-extrabold tracking-tight">
              भाषा निवडा · भाषा चुनें · Select Language
            </h2>
            <button
              type="button"
              onClick={handleHearAgain}
              className="p-2.5 rounded-full bg-[#EEF5FC] text-[#2365B5] hover:bg-[#D9E9F8] transition-all cursor-pointer shadow-xs"
              title="Listen to instructions (सूचना ऐका)"
              aria-label="Listen to language instructions"
            >
              <Volume2 size={22} className={isSpeaking ? 'animate-pulse text-[#174A91]' : ''} />
            </button>
          </div>
          <p className="text-[16px] sm:text-[18px] text-[#4B5565] font-semibold max-w-lg">
            तुम्ही संपूर्ण भेटीदरम्यान ही भाषा बोलू किंवा वाचू शकता.
          </p>
        </div>

        {/* 2-Column Responsive Language Grid (Matching Screenshot 230230) */}
        <div
          role="radiogroup"
          aria-label="Select your preferred language"
          className="grid grid-cols-2 gap-3.5 sm:gap-5 w-full"
        >
          {KIOSK_LANGUAGES.map((lang, idx) => (
            <LanguageTile
              key={lang.code}
              lang={lang}
              isSelected={selected === lang.code}
              onSelect={handleSelect}
              animationDelay={120 + idx * 30}
            />
          ))}
        </div>

        {/* Footer Support Prompt */}
        <p className="text-center text-[15px] sm:text-[16px] text-[#4B5565] font-bold pt-1">
          मदत हवी आहे का? हॉस्पिटल कर्मचाऱ्यांशी संपर्क साधा (Need help? Ask hospital staff)
        </p>
      </main>

      {/* Sticky Bottom Continue Button */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="kiosk-welcome-continue"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            className="fixed bottom-0 left-0 right-0 z-40 px-5 pb-6 pt-4 bg-gradient-to-t from-[var(--color-canvas)] via-[var(--color-canvas)]/95 to-transparent"
          >
            <div className="max-w-xl mx-auto">
              <KioskButton
                variant="primary"
                size="fullLg"
                onClick={handleContinue}
                isLoading={isContinuing}
                aria-label="Continue in selected language"
              >
                {isContinuing ? null : t.language.confirmButton || 'Begin Patient Intake →'}
              </KioskButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
