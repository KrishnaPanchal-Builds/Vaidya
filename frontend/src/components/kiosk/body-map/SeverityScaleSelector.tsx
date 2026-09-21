'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import type { SupportedKioskLanguage } from '@/lib/translations/kiosk-translations'

interface SeverityScaleSelectorProps {
  value: number // 1 to 10
  onChange: (val: number) => void
  language: SupportedKioskLanguage
  className?: string
}

export function SeverityScaleSelector({
  value,
  onChange,
  language,
  className = '',
}: SeverityScaleSelectorProps) {
  // Localized descriptions & instructions
  const localizedInfo: Record<
    SupportedKioskLanguage,
    {
      helper: string
      disclaimer: string
      mild: { title: string; desc: string }
      moderate: { title: string; desc: string }
      severe: { title: string; desc: string }
    }
  > = {
    en: {
      helper: 'Choose the number that best describes how you feel.',
      disclaimer: 'This score helps your care team understand your discomfort. It is not a clinical diagnosis.',
      mild: {
        title: 'Mild (1 – 3)',
        desc: 'Noticeable discomfort, does not prevent daily activities or rest.',
      },
      moderate: {
        title: 'Moderate (4 – 6)',
        desc: 'Uncomfortable, interferes with work, walking, or usual routine.',
      },
      severe: {
        title: 'Severe (7 – 10)',
        desc: 'Intense or disabling discomfort requiring priority clinical attention.',
      },
    },
    hi: {
      helper: 'वह संख्या चुनें जो आपकी परेशानी को सबसे अच्छे से दर्शाती है।',
      disclaimer: 'यह रेटिंग डॉक्टर को आपकी परेशानी समझने में मदद करती है। यह कोई अंतिम निदान नहीं है।',
      mild: {
        title: 'हल्का (1 – 3)',
        desc: 'हल्की परेशानी, दैनिक कामकाज या आराम में कोई खास रुकावट नहीं।',
      },
      moderate: {
        title: 'मध्यम (4 – 6)',
        desc: 'चलने-फिरने, कामकाज या सामान्य गतिविधियों में असुविधा।',
      },
      severe: {
        title: 'गंभीर (7 – 10)',
        desc: 'असहनीय या बहुत तेज दर्द, तुरंत डॉक्टर की देखभाल आवश्यक।',
      },
    },
    mr: {
      helper: 'तुमचा त्रास दर्शवणारा योग्य क्रमांक निवडा.',
      disclaimer: 'हे प्रमाण डॉक्टरांना तुमचा त्रास समजून घेण्यास मदत करते. हे वैद्यकीय निदान नाही.',
      mild: {
        title: 'हलका (1 – 3)',
        desc: 'सौम्य त्रास, रोजच्या कामात किंवा विश्रांतीमध्ये कोणताही अडथळा नाही.',
      },
      moderate: {
        title: 'मध्यम (4 – 6)',
        desc: 'काम करताना किंवा हालचाल करताना अस्वस्थता जाणवते.',
      },
      severe: {
        title: 'तीव्र (7 – 10)',
        desc: 'असह्य किंवा प्रचंड वेदना, त्वरित डॉक्टरांच्या उपचारांची गरज.',
      },
    },
    gu: {
      helper: 'તમારી તકલીફને શ્રેષ્ઠ રીતે દર્શાવતો નંબર પસંદ કરો.',
      disclaimer: 'આ રેટિંગ ડૉક્ટરને તમારી તકલીફ સમજવામાં મદદ કરે છે. આ કોઈ અંતિમ નિદાન નથી.',
      mild: {
        title: 'હળવો (1 – 3)',
        desc: 'સામાન્ય તકલીફ, દૈનિક કામ કે આરામમાં કોઈ અડચણ નથી.',
      },
      moderate: {
        title: 'મધ્યમ (4 – 6)',
        desc: 'કામકાજ કે હલનચલનમાં અસ્વસ્થતા થાય છે.',
      },
      severe: {
        title: 'ગંભીર (7 – 10)',
        desc: 'અતિશય દુખાવો, તાત્કાલિક તબીબી સારવારની જરૂર.',
      },
    },
    bn: {
      helper: 'আপনার অনুভূতির সাথে সেরা মিল থাকা সংখ্যাটি নির্বাচন করুন।',
      disclaimer: 'এই স্কোরটি চিকিৎসকদের আপনার অস্বস্তি বুঝতে সাহায্য করে। এটি কোনো রোগনির্ণয় নয়।',
      mild: {
        title: 'হালকা (1 – 3)',
        desc: 'সামান্য অস্বস্তি, দৈনন্দিন কাজে বা বিশ্রামে কোনো বাধা সৃষ্টি করে না।',
      },
      moderate: {
        title: 'মাঝারি (4 – 6)',
        desc: 'হাঁটাচলা বা স্বাভাবিক কাজকর্ম চলাকালীন অস্বস্তি অনুভূত হয়।',
      },
      severe: {
        title: 'তীব্র (7 – 10)',
        desc: 'অসহ্য যন্ত্রণা, অবিলম্বে চিকিৎসকের মনোযোগ প্রয়োজন।',
      },
    },
    ta: {
      helper: 'உங்கள் வலியை சிறந்த முறையில் குறிக்கும் எண்ணைத் தேர்ந்தெடுக்கவும்.',
      disclaimer: 'இந்த மதிப்பீடு மருத்துவருக்கு உங்கள் நிலையைப் புரிந்துகொள்ள உதவுகிறது. இது இறுதி நோய் கண்டறிதல் அல்ல.',
      mild: {
        title: 'லேசானது (1 – 3)',
        desc: 'லேசான அசௌகரியம், தினசரி வேலைகளில் பாதிப்பில்லை.',
      },
      moderate: {
        title: 'மிதமானது (4 – 6)',
        desc: 'வேலை அல்லது அசைவுகளில் சிரமம் ஏற்படுத்துகிறது.',
      },
      severe: {
        title: 'கடுமையானது (7 – 10)',
        desc: 'தாங்க முடியாத வலி, உடனடி மருத்துவ கவனிப்பு தேவை.',
      },
    },
  }

  const currentInfo = localizedInfo[language] || localizedInfo.en

  // Get active tier
  const isMild = value <= 3
  const isModerate = value >= 4 && value <= 6

  const activeTier = isMild
    ? {
        tier: 'mild',
        color: '#079455',
        bg: '#F0FDF4',
        border: '#BBF7D0',
        label: currentInfo.mild.title,
        desc: currentInfo.mild.desc,
      }
    : isModerate
    ? {
        tier: 'moderate',
        color: '#D97706',
        bg: '#FFFBEB',
        border: '#FDE68A',
        label: currentInfo.moderate.title,
        desc: currentInfo.moderate.desc,
      }
    : {
        tier: 'severe',
        color: '#DC2626',
        bg: '#FEF2F2',
        border: '#FECACA',
        label: currentInfo.severe.title,
        desc: currentInfo.severe.desc,
      }

  return (
    <div className={`space-y-4 w-full select-none ${className}`}>
      {/* ── Helper Instruction ── */}
      <p className="text-[15.5px] sm:text-[17px] font-extrabold text-[#334155] text-center">
        {currentInfo.helper}
      </p>

      {/* ── 1. Visual 1-10 Touch Numbers Row ── */}
      <div
        className="grid grid-cols-10 gap-1 sm:gap-2"
        role="radiogroup"
        aria-label="Severity rating 1 to 10"
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
          const isSelected = value === num
          const numTierColor =
            num <= 3
              ? '#079455'
              : num <= 6
              ? '#D97706'
              : '#DC2626'

          return (
            <button
              key={num}
              type="button"
              onClick={() => onChange(num)}
              className={`h-13 sm:h-15 rounded-2xl flex flex-col items-center justify-center font-extrabold text-[16px] sm:text-[18px] transition-all duration-150 cursor-pointer border shadow-2xs active:scale-95 ${
                isSelected
                  ? 'text-white shadow-md scale-105 ring-2 ring-offset-2'
                  : 'bg-white text-[#17191F] border-[#DFE8F1] hover:bg-[#F8FAFC] hover:border-[#CBD8E5]'
              }`}
              style={{
                backgroundColor: isSelected ? numTierColor : undefined,
                borderColor: isSelected ? numTierColor : undefined,
              }}
              aria-label={`Rating ${num} out of 10`}
              aria-checked={isSelected}
              role="radio"
            >
              <span>{num}</span>
              {isSelected && <Check size={13} className="stroke-[3] mt-0.5" />}
            </button>
          )
        })}
      </div>

      {/* ── 2. Interactive Slider Track ── */}
      <div className="relative px-1 pt-0.5">
        <input
          type="range"
          min={1}
          max={10}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-3.5 bg-gradient-to-r from-[#079455] via-[#D97706] to-[#DC2626] rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2365B5]/40"
          aria-label="Pain severity slider control"
        />
        <div className="flex justify-between text-[14.5px] sm:text-[15.5px] font-extrabold text-[#334155] pt-1">
          <span>1 ({language === 'mr' ? 'हलका' : language === 'hi' ? 'हल्का' : 'Mild'})</span>
          <span>5 ({language === 'mr' ? 'मध्यम' : language === 'hi' ? 'मध्यम' : 'Moderate'})</span>
          <span>10 ({language === 'mr' ? 'तीव्र' : language === 'hi' ? 'अत्यधिक' : 'Severe'})</span>
        </div>
      </div>

      {/* ── 3. Active Tier Detail Card ── */}
      <motion.div
        key={activeTier.tier}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className="p-4 sm:p-5 rounded-2xl border flex items-start gap-3.5 shadow-2xs text-left"
        style={{
          backgroundColor: activeTier.bg,
          borderColor: activeTier.border,
        }}
      >
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-black text-white text-[17px] shadow-2xs"
          style={{ backgroundColor: activeTier.color }}
        >
          {value}
        </div>

        <div className="space-y-1 min-w-0">
          <h4
            className="text-[16.5px] sm:text-[17.5px] font-black tracking-tight"
            style={{ color: activeTier.color }}
          >
            {activeTier.label}
          </h4>
          <p className="text-[14px] sm:text-[14.5px] font-medium text-[#334155] leading-relaxed">
            {activeTier.desc}
          </p>
        </div>
      </motion.div>

      {/* ── 4. Calm Clinical Non-Diagnostic Note ── */}
      <p className="text-[13px] sm:text-[13.5px] font-medium text-[#475569] text-center italic">
        {currentInfo.disclaimer}
      </p>
    </div>
  )
}
