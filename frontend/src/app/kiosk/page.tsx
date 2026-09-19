'use client'
/**
 * K-01 — Attract / Welcome Screen
 *
 * Route: /kiosk
 * Phase 8: Sliding Segmented Language Selector, Tactile Device Frame & Instant Language Adaptation
 */

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useKioskStore } from '@/store/kiosk.store'
import { useKioskTranslation } from '@/lib/hooks/use-kiosk-translation'
import { KioskFooter } from '@/components/kiosk/kiosk-footer'
import { kioskService } from '@/services/kiosk.service'
import VaidyaWordmark from '@/components/ui/VaidyaWordmark'
import { SlidingSegmentedTabs, type TabOption } from '@/components/ui/SlidingSegmentedTabs'
import { ArrowRight, Globe, ShieldCheck, Volume2 } from 'lucide-react'
import type { SupportedKioskLanguage } from '@/lib/translations/kiosk-translations'

interface GreetingInfo {
  lang: SupportedKioskLanguage
  text: string
  native: string
  sublabel: string
}

const GREETING_MAP: Record<SupportedKioskLanguage, GreetingInfo> = {
  en: { lang: 'en', text: 'Welcome', native: 'English', sublabel: 'Touch screen to begin your outpatient intake' },
  mr: { lang: 'mr', text: 'स्वागत आहे', native: 'मराठी', sublabel: 'ओपीडी तपासणीसाठी स्क्रीनला स्पर्श करा' },
  hi: { lang: 'hi', text: 'स्वागत है', native: 'हिन्दी', sublabel: 'ओपीडी प्रवेश शुरू करने के लिए स्क्रीन स्पर्श करें' },
  gu: { lang: 'gu', text: 'સ્વાગત છે', native: 'ગુજરાતી', sublabel: 'ઓપીડી પ્રવેશ શરૂ કરવા માટે સ્ક્રીન ટચ કરો' },
  bn: { lang: 'bn', text: 'স্বাগতম', native: 'বাংলা', sublabel: 'ওপিডি ইনটেক শুরু করতে স্ক্রিন স্পর্শ করুন' },
  ta: { lang: 'ta', text: 'வரவேற்கிறோம்', native: 'தமிழ்', sublabel: 'ஓபிடி பதிவைத் தொடங்க திரையைத் தொடவும்' },
}

const LANGUAGE_TAB_OPTIONS: TabOption<SupportedKioskLanguage>[] = [
  { id: 'en', label: 'English', nativeLabel: 'English' },
  { id: 'mr', label: 'Marathi', nativeLabel: 'मराठी' },
  { id: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { id: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી' },
  { id: 'bn', label: 'Bengali', nativeLabel: 'বাংলা' },
  { id: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
]

export default function KioskAttractPage() {
  const router = useRouter()
  const { t } = useKioskTranslation()
  const { language, status, setLanguage, beginSession, setSessionRefs, updateActivity } = useKioskStore()
  const [isBeginning, setIsBeginning] = useState(false)
  const [showCleared, setShowCleared] = useState(false)
  const [selectedLang, setSelectedLang] = useState<SupportedKioskLanguage>(
    (language as SupportedKioskLanguage) || 'en'
  )

  // Show "session cleared" banner briefly if we just came from a reset
  useEffect(() => {
    if (status === 'reset') {
      setShowCleared(true)
      const tTimer = setTimeout(() => setShowCleared(false), 4000)
      return () => clearTimeout(tTimer)
    }
  }, [status])

  const handleLanguageChange = (newLang: SupportedKioskLanguage) => {
    setSelectedLang(newLang)
    setLanguage(newLang)
    updateActivity()
  }

  const handleBegin = useCallback(async () => {
    if (isBeginning) return
    setIsBeginning(true)

    // Set chosen language in store
    setLanguage(selectedLang)
    beginSession()

    // Initialize session with backend
    kioskService.initSession().then(({ sessionId, sessionHash }) => {
      setSessionRefs(sessionId, sessionHash)
    }).catch(() => {
      // Graceful fallback
    })

    // Navigate to identification with language primed
    router.push('/kiosk/identify')
  }, [isBeginning, selectedLang, setLanguage, beginSession, setSessionRefs, router])

  const currentGreeting = GREETING_MAP[selectedLang] || GREETING_MAP.en

  return (
    <div className="min-h-screen bg-canvas-atmospheric flex flex-col items-center justify-between p-4 sm:p-6 lg:p-8 select-none antialiased relative overflow-hidden">
      
      {/* Session cleared feedback banner */}
      <div
        role="status"
        aria-live="polite"
        className={[
          'fixed top-4 left-1/2 -translate-x-1/2 z-50',
          'flex items-center gap-3 px-6 py-3 rounded-2xl',
          'bg-verified text-white shadow-lg border border-verified-text',
          'transition-all duration-500 ease-out',
          showCleared ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none',
        ].join(' ')}
      >
        <ShieldCheck className="w-5 h-5 shrink-0" />
        <span className="text-[14px] font-semibold">{t.attract.sessionCleared}</span>
      </div>

      {/* Top Kiosk Terminal Header */}
      <header className="w-full max-w-4xl flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <VaidyaWordmark size="md" showDescriptor={true} variant="default" />
          <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-pastel-mint text-verified-text border border-verified/20">
            Station #01 Active
          </span>
        </div>

        <div className="flex items-center gap-2 text-[12.5px] font-bold text-text-secondary bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-border shadow-2xs">
          <Globe size={15} className="text-brand" />
          <span>6 Regional Languages</span>
        </div>
      </header>

      {/* ── Central Physical Kiosk Device Chassis Frame ── */}
      <main className="w-full max-w-3xl my-auto z-10 py-3 sm:py-6">
        <div className="kiosk-device-bezel rounded-3xl p-5 sm:p-9 lg:p-11 text-center space-y-5 sm:space-y-7 relative">
          
          {/* Audio Guidance Cue */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pastel-blue/60 border border-pastel-blue text-[13px] font-bold text-brand shadow-2xs">
            <Volume2 size={16} />
            <span>Voice &amp; Touch Assisted Intake Available</span>
          </div>

          {/* Dynamic Multilingual Greeting Hero */}
          <div className="space-y-1.5 sm:space-y-2.5">
            <h1 className="text-[38px] sm:text-[52px] lg:text-[56px] font-extrabold text-ink tracking-tight leading-tight transition-all duration-300">
              {currentGreeting.text}
            </h1>
            <p className="text-[15px] sm:text-[17px] font-semibold text-text-secondary max-w-lg mx-auto leading-relaxed">
              {currentGreeting.sublabel}
            </p>
          </div>

          {/* ── Prominent Sliding Segmented Language Selector ── */}
          <div className="space-y-2.5 pt-1">
            <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-wider text-text-muted block">
              Select Your Preferred Language / भाषा निवडा / भाषा चुनें
            </span>
            
            <div className="w-full flex justify-center overflow-x-auto pb-1">
              <SlidingSegmentedTabs
                options={LANGUAGE_TAB_OPTIONS}
                selectedId={selectedLang}
                onChange={handleLanguageChange}
                variant="default"
                layoutId="kiosk-attract-language-pill"
                ariaLabel="Select Language"
              />
            </div>
          </div>

          {/* Tactile Big Touch Button */}
          <div className="flex flex-col items-center gap-3 pt-2">
            <button
              onClick={handleBegin}
              disabled={isBeginning}
              className="kiosk-tactile-btn w-full max-w-md h-16 sm:h-[72px] rounded-2xl bg-brand text-white text-[19px] sm:text-[21px] font-extrabold flex items-center justify-center gap-3 transition-all cursor-pointer shadow-md active:scale-98"
              aria-label="Touch to start patient intake"
            >
              <span>{t.attract.touchToBegin}</span>
              <ArrowRight size={24} className="stroke-[3]" />
            </button>
            <span className="text-[12.5px] sm:text-[13px] text-text-secondary font-medium">
              No registration card required to begin · Speech &amp; Touch enabled
            </span>
          </div>

        </div>
      </main>

      {/* Terminal Footer with ABDM Compliance */}
      <footer className="w-full max-w-4xl flex items-center justify-between text-[12px] font-medium text-text-muted z-10 pt-2">
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={15} className="text-verified" />
          <span>Ephemeral Session · Zero Local Storage</span>
        </div>
        <KioskFooter currentToken={28} />
      </footer>

    </div>
  )
}
