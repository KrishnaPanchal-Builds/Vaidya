'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, RefreshCw, Check, Keyboard, AlertCircle } from 'lucide-react'
import type { SupportedKioskLanguage } from '@/lib/translations/kiosk-translations'

export type VoiceState = 'READY' | 'LISTENING' | 'PROCESSING' | 'CONFIRMING' | 'FAILED'

interface VoiceIntakeModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirmAnswer: (answerText: string, mappedOptionId?: string) => void
  questionTitle: string
  language: SupportedKioskLanguage
  sampleResponses?: { native: string; english: string; optionId?: string }
}

export function VoiceIntakeModal({
  isOpen,
  onClose,
  onConfirmAnswer,
  questionTitle,
  language,
  sampleResponses,
}: VoiceIntakeModalProps) {
  const [voiceState, setVoiceState] = useState<VoiceState>('READY')
  const [transcript, setTranscript] = useState<{ native: string; english: string }>({
    native: '',
    english: '',
  })
  const [manualText, setManualText] = useState('')
  const [showManualInput, setShowManualInput] = useState(false)

  // Language display name
  const langDisplayNames: Record<SupportedKioskLanguage, string> = {
    en: 'English',
    hi: 'हिन्दी (Hindi)',
    mr: 'मराठी (Marathi)',
    gu: 'ગુજરાતી (Gujarati)',
    bn: 'বাংলা (Bengali)',
    ta: 'தமிழ் (Tamil)',
  }

  // Reset modal state when opened
  useEffect(() => {
    if (isOpen) {
      setVoiceState('READY')
      setShowManualInput(false)
      setManualText('')
    }
  }, [isOpen])

  const handleStartListening = () => {
    setVoiceState('LISTENING')

    // Simulate speech detection
    setTimeout(() => {
      setVoiceState('PROCESSING')

      // Simulate transcription resolution
      setTimeout(() => {
        if (sampleResponses) {
          setTranscript({
            native: sampleResponses.native,
            english: sampleResponses.english,
          })
          setVoiceState('CONFIRMING')
        } else {
          // Default fallback based on language
          const defaultNative: Record<SupportedKioskLanguage, string> = {
            en: 'I have severe pain and difficulty breathing.',
            hi: 'मुझे बहुत तेज दर्द और सांस लेने में तकलीफ हो रही है।',
            mr: 'मला खूप तीव्र वेदना आणि श्वास घेण्यास त्रास होत आहे.',
            gu: 'મને ખૂબ દુખાવો અને શ્વાસ લેવામાં તકલીફ છે.',
            bn: 'আমার খুব তীব্র ব্যথা এবং শ্বাসকষ্ট হচ্ছে।',
            ta: 'எனக்கு கடுமையான வலி மற்றும் மூச்சுத் திணறல் உள்ளது.',
          }

          setTranscript({
            native: defaultNative[language] || defaultNative.en,
            english: 'I have severe pain and difficulty breathing.',
          })
          setVoiceState('CONFIRMING')
        }
      }, 1200)
    }, 2400)
  }

  const handleTriggerSimulatedFailure = () => {
    setVoiceState('LISTENING')
    setTimeout(() => {
      setVoiceState('PROCESSING')
      setTimeout(() => {
        setVoiceState('FAILED')
      }, 1000)
    }, 1800)
  }

  const handleConfirm = () => {
    if (showManualInput && manualText.trim()) {
      onConfirmAnswer(manualText.trim())
    } else {
      onConfirmAnswer(transcript.english || transcript.native, sampleResponses?.optionId)
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-[#0c1829]/65 backdrop-blur-xs flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 10 }}
          transition={{ duration: 0.18 }}
          className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl border border-[#CBD8E5] flex flex-col items-center text-center gap-4 select-none"
        >
          {/* Top Question Context */}
          <div className="space-y-1 w-full text-center pb-1 border-b border-[#DFE8F1]">
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#2365B5] bg-[#EEF5FC] px-2.5 py-0.5 rounded-full border border-[#CBD8E5]">
              Voice Assistant ({langDisplayNames[language]} — Simulated Integration)
            </span>
            <h3 className="text-[14px] sm:text-[15px] font-extrabold text-[#17191F] line-clamp-2 pt-1">
              &quot;{questionTitle}&quot;
            </h3>
          </div>

          {/* ── STATE 1: READY ── */}
          {voiceState === 'READY' && !showManualInput && (
            <div className="space-y-4 py-2 flex flex-col items-center">
              <button
                onClick={handleStartListening}
                className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#2365B5] to-[#3B82F6] text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer group"
                aria-label="Start recording voice"
              >
                <Mic size={32} className="motion-safe:group-hover:animate-pulse" />
              </button>

              <div className="space-y-1">
                <h4 className="text-[16px] font-extrabold text-[#17191F]">Tap microphone to speak</h4>
                <p className="text-[12px] text-[#6F7480]">
                  Speak clearly in {langDisplayNames[language]}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setShowManualInput(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#DFE8F1] bg-[#F8FAFC] text-[12px] font-bold text-[#4B5565] hover:bg-[#F1F4F9] hover:text-[#17191F] transition-colors cursor-pointer"
                >
                  <Keyboard size={14} />
                  <span>Type instead</span>
                </button>

                <button
                  onClick={handleTriggerSimulatedFailure}
                  className="text-[11px] text-[#9AA8B7] hover:text-[#6F7480] underline cursor-pointer"
                  title="Simulate low audio quality / noisy room test"
                >
                  (Test Noise)
                </button>
              </div>
            </div>
          )}

          {/* ── STATE 2: LISTENING / RECORDING ── */}
          {voiceState === 'LISTENING' && (
            <div className="space-y-4 py-2 flex flex-col items-center">
              <div className="relative w-20 h-20 rounded-full bg-[#EEF5FC] text-[#2365B5] flex items-center justify-center border-2 border-[#2365B5]">
                {/* Pulsing outer aura */}
                <span className="absolute inset-0 rounded-full bg-[#2365B5]/20 motion-safe:animate-ping" />

                {/* Animated sound bars */}
                <div className="flex items-center gap-1.5 h-10 z-10">
                  {[40, 75, 100, 60, 95, 50, 85, 45].map((h, i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-[#2365B5] rounded-full motion-safe:animate-pulse"
                      style={{ height: `${h}%`, animationDelay: `${i * 120}ms` }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-[17px] font-extrabold text-[#17191F]">Listening...</h4>
                <p className="text-[12px] text-[#2365B5] font-semibold motion-safe:animate-pulse">
                  Please speak your symptoms now
                </p>
              </div>

              <button
                onClick={() => setVoiceState('PROCESSING')}
                className="px-4 py-1.5 rounded-xl bg-[#F0F6FD] border border-[#CBD8E5] text-[12px] font-bold text-[#2365B5] hover:bg-[#D3E2F0] cursor-pointer"
              >
                Done Speaking
              </button>
            </div>
          )}

          {/* ── STATE 3: PROCESSING / TRANSCRIBING ── */}
          {voiceState === 'PROCESSING' && (
            <div className="space-y-3 py-6 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border-4 border-[#2365B5] border-t-transparent motion-safe:animate-spin" />
              <div className="space-y-0.5">
                <h4 className="text-[16px] font-extrabold text-[#17191F]">Transcribing speech...</h4>
                <p className="text-[11.5px] text-[#6F7480]">Processing with AI speech recognition (Simulated)</p>
              </div>
            </div>
          )}

          {/* ── STATE 4: CONFIRMING TRANSCRIPTION ── */}
          {voiceState === 'CONFIRMING' && (
            <div className="w-full space-y-3 text-left">
              {/* Distinct Badge & Box */}
              <div className="rounded-2xl bg-[#F8FAFC] border border-[#CBD8E5] p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#079455] bg-[#EBFDF5] border border-[#A6F4C5] px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Check size={10} className="stroke-[3]" />
                    <span>Patient-Reported Voice Transcription</span>
                  </span>
                  <span className="text-[10px] text-[#6F7480]">Bhashini Mock</span>
                </div>

                {/* Recognized Native Speech */}
                <div>
                  <span className="text-[10px] text-[#6F7480] font-bold block uppercase">Spoken ({langDisplayNames[language]}):</span>
                  <p className="text-[14px] font-bold text-[#17191F] italic leading-snug">
                    &quot;{transcript.native}&quot;
                  </p>
                </div>

                {/* English Standard Clinical Representation */}
                {language !== 'en' && transcript.english && (
                  <div className="pt-1.5 border-t border-[#DFE8F1]">
                    <span className="text-[10px] text-[#6F7480] font-bold block uppercase">Clinical Translation:</span>
                    <p className="text-[12.5px] font-semibold text-[#4B5565] leading-snug">
                      &quot;{transcript.english}&quot;
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={handleConfirm}
                  className="w-full py-2.5 rounded-xl text-white font-extrabold text-[13.5px] shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  style={{
                    background: 'linear-gradient(135deg, #347FCE 0%, #2365B5 52%, #174A91 100%)',
                  }}
                >
                  <Check size={15} className="stroke-[2.5]" />
                  <span>Confirm &amp; Apply Answer</span>
                </button>

                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={handleStartListening}
                    className="flex-1 py-1.5 rounded-xl border border-[#DFE8F1] bg-[#F8FAFC] hover:bg-[#F1F4F9] text-[11.5px] font-bold text-[#4B5565] transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <RefreshCw size={12} />
                    <span>Record Again</span>
                  </button>

                  <button
                    onClick={() => setShowManualInput(true)}
                    className="flex-1 py-1.5 rounded-xl border border-[#DFE8F1] bg-[#F8FAFC] hover:bg-[#F1F4F9] text-[11.5px] font-bold text-[#4B5565] transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Keyboard size={12} />
                    <span>Edit by Typing</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── STATE 5: FAILED TRANSCRIPTION ── */}
          {voiceState === 'FAILED' && (
            <div className="space-y-3 py-2 text-center w-full">
              <div className="w-12 h-12 rounded-full bg-[#FEF3F2] text-[#D92D20] flex items-center justify-center mx-auto border border-[#FECDCA]">
                <AlertCircle size={24} />
              </div>

              <div className="space-y-1">
                <h4 className="text-[15.5px] font-extrabold text-[#17191F]">Could not clearly hear speech</h4>
                <p className="text-[12px] text-[#6F7480]">
                  Background noise or unclear audio. Please try speaking closer to the mic, or type your answer.
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-2 w-full">
                <button
                  onClick={handleStartListening}
                  className="w-full py-2.5 rounded-xl bg-[#2365B5] text-white text-[13px] font-extrabold hover:bg-[#174A91] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RefreshCw size={14} />
                  <span>Try Again</span>
                </button>

                <button
                  onClick={() => setShowManualInput(true)}
                  className="w-full py-2 rounded-xl border border-[#DFE8F1] bg-[#F8FAFC] text-[12px] font-bold text-[#4B5565] hover:bg-[#F1F4F9] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Keyboard size={14} />
                  <span>Type Answer Instead</span>
                </button>
              </div>
            </div>
          )}

          {/* ── MANUAL TEXT INPUT FALLBACK ── */}
          {showManualInput && (
            <div className="w-full space-y-3 text-left">
              <div className="space-y-1">
                <label className="text-[12px] font-extrabold text-[#17191F]">Type your response:</label>
                <textarea
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  placeholder="Describe what you are experiencing..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-[#CBD8E5] focus:outline-none focus:ring-2 focus:ring-[#2365B5]/40 text-[13px] text-[#17191F] placeholder:text-[#9AA8B7]"
                  autoFocus
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleConfirm}
                  disabled={!manualText.trim()}
                  className="flex-1 py-2 rounded-xl bg-[#2365B5] text-white text-[13px] font-extrabold disabled:opacity-50 transition-colors cursor-pointer"
                >
                  Apply Text
                </button>
                <button
                  onClick={() => setShowManualInput(false)}
                  className="px-3 py-2 rounded-xl border border-[#DFE8F1] text-[12px] font-bold text-[#6F7480] hover:bg-[#F8FAFC] cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Close Modal Ghost CTA */}
          <div className="w-full pt-1 border-t border-[#DFE8F1]">
            <button
              onClick={onClose}
              className="text-[12px] font-bold text-[#6F7480] hover:text-[#17191F] cursor-pointer"
            >
              Close and return to screen
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
