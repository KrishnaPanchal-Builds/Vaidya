'use client'
/**
 * K-04 — Informed Consent Screen (Phase 3 Handoff Screen)
 *
 * Route: /kiosk/consent
 *
 * Multilingual Architecture:
 * - Powered by useKioskTranslation() for complete EN, HI, MR translations.
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useKioskStore } from '@/store/kiosk.store'
import { useKioskTranslation } from '@/lib/hooks/use-kiosk-translation'
import { KioskButton } from '@/components/kiosk/kiosk-button'

export default function KioskConsentPage() {
  const router = useRouter()
  const { t } = useKioskTranslation()
  const { language, patientData, advanceStep, resetSession, updateActivity } = useKioskStore()
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)

  useEffect(() => {
    advanceStep('CONSENT')
  }, [advanceStep])

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
              <div className="w-9 h-9 rounded-full bg-[var(--color-sage-soft)] text-[var(--color-brand)] flex items-center justify-center font-extrabold text-[14px]">
                {patientData.name.charAt(0)}
              </div>
              <div>
                <span className="text-[15px] sm:text-[16px] font-extrabold text-[var(--color-text-primary)] block leading-tight">
                  {patientData.name}
                </span>
                <span className="text-[12px] sm:text-[12.5px] text-[var(--color-text-muted)] font-medium">
                  {patientData.age} yrs · {patientData.sex}
                </span>
              </div>
            </div>
            <span className="text-[11.5px] font-bold text-[var(--color-verified)] bg-[var(--color-verified-bg)] border border-[var(--color-sage-border)] px-3 py-1 rounded-full uppercase tracking-wider">
              Verified
            </span>
          </div>
        )}

        {/* Heading Section */}
        <div className="text-center">
          <h1 className="text-[28px] sm:text-[34px] font-extrabold text-[var(--color-text-primary)] leading-tight">
            {t.consent.title}
          </h1>
          <p className="text-[14.5px] sm:text-[15.5px] font-medium text-[var(--color-text-secondary)] mt-1 max-w-xl mx-auto">
            {t.consent.titleSub}
          </p>
        </div>

        {/* Audio Assistance Bar */}
        <button
          onClick={() => {
            setIsPlayingAudio(!isPlayingAudio)
            updateActivity()
          }}
          className="bg-[var(--color-surface)] rounded-2xl p-4 shadow-sm border border-[var(--color-border)] flex items-center justify-between hover:border-[var(--color-brand)]/40 transition-all text-left cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-[var(--color-sage-soft)] text-[var(--color-brand)] flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            </div>
            <div>
              <p className="text-[15px] sm:text-[16px] font-extrabold text-[var(--color-text-primary)]">
                {isPlayingAudio ? 'Playing consent audio…' : t.consent.audioTitle}
              </p>
              <div className="flex items-center gap-2 text-[12.5px] text-[var(--color-text-muted)] mt-0.5 font-medium">
                <span>~1 min</span>
                <span>•</span>
                <span>{language === 'mr' ? 'मराठी आवाज' : language === 'hi' ? 'हिंदी आवाज' : 'Voice explanation'}</span>
              </div>
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-[var(--color-surface-subtle)] flex items-center justify-center text-[var(--color-brand)] font-bold text-[14px]">
            {isPlayingAudio ? '❚❚' : '▶'}
          </div>
        </button>

        {/* 3 Privacy & Process Cards */}
        <div className="bg-[var(--color-surface)] rounded-3xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[var(--color-border)] flex flex-col gap-4.5">
          {/* Pillar 1 */}
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-sage-soft)] text-[var(--color-brand)] flex items-center justify-center shrink-0 mt-0.5">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="22" />
              </svg>
            </div>
            <div>
              <h3 className="text-[16px] sm:text-[17px] font-extrabold text-[var(--color-text-primary)]">
                {t.consent.pillar1Title}
              </h3>
              <p className="text-[13.5px] sm:text-[14.5px] text-[var(--color-text-secondary)] mt-0.5 leading-relaxed font-medium">
                {t.consent.pillar1Desc}
              </p>
            </div>
          </div>

          <div className="w-full h-[1px] bg-[var(--color-border)]" />

          {/* Pillar 2 */}
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-sage-soft)] text-[var(--color-brand)] flex items-center justify-center shrink-0 mt-0.5">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <div>
              <h3 className="text-[16px] sm:text-[17px] font-extrabold text-[var(--color-text-primary)]">
                {t.consent.pillar2Title}
              </h3>
              <p className="text-[13.5px] sm:text-[14.5px] text-[var(--color-text-secondary)] mt-0.5 leading-relaxed font-medium">
                {t.consent.pillar2Desc}
              </p>
            </div>
          </div>

          <div className="w-full h-[1px] bg-[var(--color-border)]" />

          {/* Pillar 3 */}
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-sage-soft)] text-[var(--color-brand)] flex items-center justify-center shrink-0 mt-0.5">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <polyline points="17 11 19 13 23 9" />
              </svg>
            </div>
            <div>
              <h3 className="text-[16px] sm:text-[17px] font-extrabold text-[var(--color-text-primary)]">
                {t.consent.pillar3Title}
              </h3>
              <p className="text-[13.5px] sm:text-[14.5px] text-[var(--color-text-secondary)] mt-0.5 leading-relaxed font-medium">
                {t.consent.pillar3Desc}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 w-full">
          <KioskButton
            variant="primary"
            size="fullLg"
            onClick={() => {
              advanceStep('INTAKE')
              router.push('/kiosk/intake')
            }}
          >
            {t.consent.agreeButton}
          </KioskButton>

          <div className="flex gap-2.5 w-full">
            <KioskButton
              variant="secondary"
              size="md"
              className="flex-1"
              onClick={() => router.push('/kiosk/identify')}
            >
              ← {t.common.back}
            </KioskButton>
            <KioskButton
              variant="ghost"
              size="md"
              className="flex-1"
              onClick={() => {
                resetSession()
                router.replace('/kiosk')
              }}
            >
              {t.common.startOver}
            </KioskButton>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
