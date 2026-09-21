'use client'

/**
 * useVoiceAgent — Multilingual Kiosk Audio Guidance Hook
 *
 * Provides natural spoken audio guidance in:
 * - Marathi (mr) — मराठी
 * - Hindi (hi) — हिन्दी
 * - English (en)
 *
 * Architecture:
 * - Uses client-side Web Speech API (SpeechSynthesis) for 100% offline-ready,
 *   immediate zero-latency voice guidance on any modern browser/tablet.
 * - Prioritizes native Indic voice packs (Google / Microsoft Indian voices).
 * - "Cancel-before-speak" architecture ensures zero audio overlapping or stutter.
 * - Fully respects kiosk global mute state from useKioskStore.
 * - Integrates with visual indicators (isSpeaking state drives pulsating waves).
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { useKioskStore } from '@/store/kiosk.store'
import type { SupportedKioskLanguage } from '@/lib/translations/kiosk-translations'

interface VoiceAgentOptions {
  rate?: number
  pitch?: number
  volume?: number
}

const LOCALE_MAP: Record<string, string> = {
  mr: 'mr-IN',
  hi: 'hi-IN',
  en: 'en-IN',
  gu: 'gu-IN',
  bn: 'bn-IN',
  ta: 'ta-IN',
}

export function useVoiceAgent(options: VoiceAgentOptions = {}) {
  const { language: currentStoreLang, isMuted, toggleMute, setMuted } = useKioskStore()
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [currentText, setCurrentText] = useState('')
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const voicesRef = useRef<SpeechSynthesisVoice[]>([])

  // Detect support & load available browser voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true)

      const updateVoices = () => {
        voicesRef.current = window.speechSynthesis.getVoices()
      }

      updateVoices()
      window.speechSynthesis.onvoiceschanged = updateVoices

      return () => {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel()
        }
      }
    }
  }, [])

  // Find best matching voice for the target locale
  const getBestVoice = useCallback((targetLocale: string): SpeechSynthesisVoice | null => {
    const voices = voicesRef.current
    if (!voices || voices.length === 0) return null

    const langPrefix = targetLocale.split('-')[0].toLowerCase()

    // 1. Exact match (e.g., 'mr-IN' or 'hi-IN')
    const exact = voices.find(
      (v) => v.lang.replace('_', '-').toLowerCase() === targetLocale.toLowerCase()
    )
    if (exact) return exact

    // 2. Prefix match (e.g. any 'mr' or 'hi' voice)
    const prefixMatch = voices.find((v) =>
      v.lang.replace('_', '-').toLowerCase().startsWith(langPrefix)
    )
    if (prefixMatch) return prefixMatch

    // 3. Indian English fallback if target is 'en'
    if (langPrefix === 'en') {
      const indianEn = voices.find((v) => v.lang.toLowerCase().includes('en-in'))
      if (indianEn) return indianEn
    }

    // 4. Default voice
    return voices.find((v) => v.default) || voices[0] || null
  }, [])

  // Stop currently playing speech
  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    setIsSpeaking(false)
    setCurrentText('')
  }, [])

  // Speak text in specified or active kiosk language
  const speak = useCallback(
    (
      text: string,
      targetLang?: SupportedKioskLanguage | string,
      onComplete?: () => void
    ) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
      if (!text || text.trim() === '') return

      // Respect global mute
      if (useKioskStore.getState().isMuted) {
        setIsSpeaking(false)
        if (onComplete) onComplete()
        return
      }

      // Cancel any ongoing speech before starting new speech
      window.speechSynthesis.cancel()

      const activeLang = targetLang || useKioskStore.getState().language || 'en'
      const targetLocale = LOCALE_MAP[activeLang] || 'en-IN'

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = options.rate ?? 0.92 // Slightly calmer rate for clear elderly comprehension
      utterance.pitch = options.pitch ?? 1.0
      utterance.volume = options.volume ?? 1.0
      utterance.lang = targetLocale

      const bestVoice = getBestVoice(targetLocale)
      if (bestVoice) {
        utterance.voice = bestVoice
      }

      utterance.onstart = () => {
        setIsSpeaking(true)
        setCurrentText(text)
      }

      utterance.onend = () => {
        setIsSpeaking(false)
        setCurrentText('')
        if (onComplete) onComplete()
      }

      utterance.onerror = (e) => {
        console.warn('Speech synthesis utterance error:', e)
        setIsSpeaking(false)
        setCurrentText('')
        if (onComplete) onComplete()
      }

      speechUtteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
    },
    [getBestVoice, options.pitch, options.rate, options.volume]
  )

  // Auto-speak on screen mount with delay
  const speakOnMount = useCallback(
    (text: string, targetLang?: SupportedKioskLanguage | string, delayMs = 350) => {
      const timer = setTimeout(() => {
        speak(text, targetLang)
      }, delayMs)

      return () => {
        clearTimeout(timer)
        stop()
      }
    },
    [speak, stop]
  )

  return {
    speak,
    stop,
    speakOnMount,
    isSpeaking,
    isMuted: Boolean(isMuted),
    toggleMute,
    setMuted,
    currentText,
    isSupported,
    activeLanguage: currentStoreLang || 'en',
  }
}
