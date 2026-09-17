/**
 * Vaidya Patient Kiosk — Contextual Clinical Questionnaire Configuration
 *
 * NOTE: This is patient-reported questionnaire logic designed for calm hospital kiosk intake.
 * It is NOT an autonomous medical diagnosis. All captured data is presented to the attending
 * physician for clinical assessment.
 *
 * Supported languages:
 * 'en' (English), 'hi' (Hindi), 'mr' (Marathi), 'gu' (Gujarati), 'bn' (Bengali), 'ta' (Tamil)
 */

import type { BodyRegionId, SymptomCategoryId } from '@/components/kiosk/body-map/types'
import type { SupportedKioskLanguage } from '@/lib/translations/kiosk-translations'

export type QuestionAnswerType =
  | 'single_choice'
  | 'multiple_choice'
  | 'severity_scale'
  | 'free_text'
  | 'yes_no'

export interface QuestionOption {
  id: string
  label: string
  description?: string
  translations: Record<SupportedKioskLanguage, { label: string; description?: string }>
}

export interface ContextualQuestion {
  id: string
  categoryId: SymptomCategoryId
  applicableRegions?: BodyRegionId[]
  title: string
  subtitle: string
  translations: Record<SupportedKioskLanguage, { title: string; subtitle: string }>
  answerType: QuestionAnswerType
  options: QuestionOption[]
  required: boolean
  allowCustomText?: boolean
  decisionSupportNote: string
}

export interface IntakeDurationOption {
  id: string
  title: Record<SupportedKioskLanguage, string>
  desc: Record<SupportedKioskLanguage, string>
}

export interface IntakeLifestyleOption {
  id: string
  title: Record<SupportedKioskLanguage, string>
  desc: Record<SupportedKioskLanguage, string>
}

// ── 1. REGIONAL CONTEXTUAL QUESTION CATALOG ──

export const CONTEXTUAL_QUESTIONS_CATALOG: ContextualQuestion[] = [
  // ── CHEST & BREATHING ──
  {
    id: 'q_chest_breathing',
    categoryId: 'chest_breathing',
    applicableRegions: ['chest'],
    title: 'What does it feel like in your chest?',
    subtitle: 'Choose what you are experiencing. You can select more than one.',
    translations: {
      en: {
        title: 'What does it feel like in your chest?',
        subtitle: 'Choose what you are experiencing. You can select more than one.',
      },
      hi: {
        title: 'आपकी छाती में कैसा महसूस हो रहा है?',
        subtitle: 'जो महसूस हो रहा है उसे चुनें। आप एक से अधिक विकल्प चुन सकते हैं।',
      },
      mr: {
        title: 'आपल्या छातीत नक्की काय जाणवत आहे?',
        subtitle: 'आपल्या त्रासाशी जुळणारे पर्याय निवडा. आपण एकापेक्षा जास्त निवडू शकता.',
      },
      gu: {
        title: 'તમારી છાતીમાં કેવું અનુભવાય છે?',
        subtitle: 'તમને જે તકલીફ હોય તે પસંદ કરો. તમે એક કરતાં વધુ પસંદ કરી શકો છો.',
      },
      bn: {
        title: 'আপনার বুকে কেমন অনুভূতি হচ্ছে?',
        subtitle: 'যা অনুভব করছেন তা নির্বাচন করুন। একাধিক বিকল্প বেছে নিতে পারেন।',
      },
      ta: {
        title: 'உங்கள் மார்பில் எவ்வாறு உணர்கிறீர்கள்?',
        subtitle: 'நீங்கள் உணர்வதைத் தேர்ந்தெடுக்கவும். ஒன்றுக்கும் மேற்பட்டவற்றைத் தேர்ந்தெடுக்கலாம்.',
      },
    },
    answerType: 'multiple_choice',
    required: true,
    allowCustomText: true,
    decisionSupportNote: 'Patient-reported cardiopulmonary symptom screening',
    options: [
      {
        id: 'chest_pain',
        label: 'Pain or Discomfort',
        description: 'Ache, sharp, or dull discomfort in chest area',
        translations: {
          en: { label: 'Pain or Discomfort', description: 'Ache, sharp, or dull discomfort in chest' },
          hi: { label: 'दर्द या बेचैनी', description: 'छाती में हल्का या तेज दर्द' },
          mr: { label: 'वेदना किंवा अस्वस्थता', description: 'छातीत हलके किंवा तीव्र दुखणे' },
          gu: { label: 'દુખાવો અથવા અસ્વસ્થતા', description: 'છાતીમાં હળવો કે તીક્ષ્ણ દુખાવો' },
          bn: { label: 'ব্যথা বা অস্বস্তি', description: 'বুকে তীব্র বা মাঝারি ব্যথা' },
          ta: { label: 'வலி அல்லது அசௌகரியம்', description: 'மார்பில் லேசான அல்லது கடுமையான வலி' },
        },
      },
      {
        id: 'breathing_difficulty',
        label: 'Difficulty Breathing',
        description: 'Shortness of breath or tightness when breathing in',
        translations: {
          en: { label: 'Difficulty Breathing', description: 'Shortness of breath or breathlessness' },
          hi: { label: 'सांस लेने में कठिनाई', description: 'सांस फूलना या सांस लेने में भारीपन' },
          mr: { label: 'श्वास घेण्यास त्रास', description: 'दम लागणे किंवा धाप लागणे' },
          gu: { label: 'શ્વાસ લેવામાં તકલીફ', description: 'શ્વાસ ચડવો કે ગૂંગળામણ' },
          bn: { label: 'শ্বাসকষ্ট', description: 'শ্বাস নিতে কষ্ট বা হাঁপ ধরা' },
          ta: { label: 'மூச்சு விடுவதில் சிரமம்', description: 'மூச்சுத் திணறல் அல்லது இரைப்பு' },
        },
      },
      {
        id: 'pressure_tightness',
        label: 'Pressure or Tightness',
        description: 'Heavy feeling or squeezing sensation',
        translations: {
          en: { label: 'Pressure or Tightness', description: 'Heavy feeling or squeezing sensation' },
          hi: { label: 'दबाव या जकड़न', description: 'छाती पर भारीपन या खिंचाव' },
          mr: { label: 'दबाव किंवा घट्टपणा', description: 'छातीवर जडपणा किंवा ताण' },
          gu: { label: 'દબાણ અથવા જકડાઈ જવું', description: 'છાતી પર ભારેપણું' },
          bn: { label: 'চাপ বা আঁটসাঁট ভাব', description: 'বুকে ভারী চাপ বা সংকোচন' },
          ta: { label: 'அழுத்தம் அல்லது இறுக்கம்', description: 'மார்பில் கனமான அழுத்தம்' },
        },
      },
      {
        id: 'unusual_heartbeat',
        label: 'Unusual Heartbeat / Flutter',
        description: 'Racing, pounding, or irregular heartbeats',
        translations: {
          en: { label: 'Unusual Heartbeat / Flutter', description: 'Racing or irregular heartbeats' },
          hi: { label: 'दिल की असामान्य धड़कन', description: 'तेज़ या रुक-रुक कर धड़कना' },
          mr: { label: 'हृदयाचे असामान्य ठोके', description: 'धडधड किंवा जलद ठोके' },
          gu: { label: 'અસામાન્ય ધબકારા', description: 'ઝડપી કે અનિયમિત ધબકારા' },
          bn: { label: 'অনিয়মিত হৃদস্পন্দন', description: 'বুক ধড়ফড় বা দ্রুত স্পন্দন' },
          ta: { label: 'அசாதாரண இதயத் துடிப்பு', description: 'படபடப்பு அல்லது வேகமான துடிப்பு' },
        },
      },
      {
        id: 'cough_wheezing',
        label: 'Cough or Wheezing',
        description: 'Persistent dry or wet cough, whistling sound',
        translations: {
          en: { label: 'Cough or Wheezing', description: 'Persistent cough or chest sound' },
          hi: { label: 'खांसी या सीटी की आवाज', description: 'लगातार खांसी या घरघराहट' },
          mr: { label: 'खोकला किंवा घरघर', description: 'सतत खोकला किंवा छातीत आवाज' },
          gu: { label: 'ખાંસી અથવા ઘરઘરાટી', description: 'સતત ખાંસી' },
          bn: { label: 'কাশি বা সাঁই-সাঁই শব্দ', description: 'ক্রমাগত কাশি' },
          ta: { label: 'இருமல் அல்லது மூச்சிரைப்பு', description: 'தொடர் இருமல்' },
        },
      },
      {
        id: 'not_sure_chest',
        label: 'Not Sure / Something Else',
        description: 'Other sensation or hard to describe precisely',
        translations: {
          en: { label: 'Not Sure / Something Else', description: 'Hard to describe or other issue' },
          hi: { label: 'पक्का नहीं / कुछ और', description: 'अन्य लक्षण या बताने में कठिनाई' },
          mr: { label: 'नक्की सांगता येत नाही / इतर काही', description: 'इतर त्रास' },
          gu: { label: 'ચોક્કસ ખબર નથી / બીજું કંઈક', description: 'અન્ય લક્ષણ' },
          bn: { label: 'নিশ্চিত নই / অন্য কিছু', description: 'অন্য কোনো অনুভূতি' },
          ta: { label: 'உறுதியாக தெரியவில்லை / வேறு', description: 'மற்றொரு பிரச்சனை' },
        },
      },
    ],
  },

  // ── HEAD & FACE ──
  {
    id: 'q_head_face',
    categoryId: 'head_eyes',
    applicableRegions: ['head', 'face', 'eyes'],
    title: 'What does it feel like in your head or face?',
    subtitle: 'Choose what you are experiencing. You can select more than one.',
    translations: {
      en: {
        title: 'What does it feel like in your head or face?',
        subtitle: 'Choose what you are experiencing. You can select more than one.',
      },
      hi: {
        title: 'आपके सिर या चेहरे में कैसा महसूस हो रहा है?',
        subtitle: 'जो महसूस हो रहा है उसे चुनें। आप एक से अधिक विकल्प चुन सकते हैं।',
      },
      mr: {
        title: 'आपल्या डोक्यात किंवा चेहऱ्यावर काय त्रास होत आहे?',
        subtitle: 'आपल्या त्रासाशी जुळणारे पर्याय निवडा. आपण एकापेक्षा जास्त निवडू शकता.',
      },
      gu: {
        title: 'તમારા માથા અથવા ચહેરામાં શું અનુભવાય છે?',
        subtitle: 'તમને જે તકલીફ હોય તે પસંદ કરો. તમે એક કરતાં વધુ પસંદ કરી શકો છો.',
      },
      bn: {
        title: 'আপনার মাথা বা মুখে কী সমস্যা হচ্ছে?',
        subtitle: 'যা অনুভব করছেন তা নির্বাচন করুন। একাধিক বিকল্প বেছে নিতে পারেন।',
      },
      ta: {
        title: 'உங்கள் தலை அல்லது முகத்தில் என்ன பிரச்சனை?',
        subtitle: 'நீங்கள் உணர்வதைத் தேர்ந்தெடுக்கவும். ஒன்றுக்கும் மேற்பட்டவற்றைத் தேர்ந்தெடுக்கலாம்.',
      },
    },
    answerType: 'multiple_choice',
    required: true,
    allowCustomText: true,
    decisionSupportNote: 'Patient-reported cranial & ENT symptom screening',
    options: [
      {
        id: 'headache_throbbing',
        label: 'Headache / Throbbing Pain',
        description: 'Dull ache, heavy pressure, or pulsing pain',
        translations: {
          en: { label: 'Headache / Throbbing Pain', description: 'Dull ache or pulsing pain' },
          hi: { label: 'सिरदर्द या भारीपन', description: 'लगातार या टीस मारने वाला दर्द' },
          mr: { label: 'डोकेदुखी किंवा ठसठस', description: 'सतत दुखणे किंवा ठसठसणे' },
          gu: { label: 'માથાનો દુખાવો', description: 'સતત દુખાવો' },
          bn: { label: 'মাথাব্যথা বা দপদপানি', description: 'তীব্র বা মাঝারি যন্ত্রণা' },
          ta: { label: 'தலைவலி / துடிப்பு', description: 'விட்டு விட்டு அல்லது தொடர் வலி' },
        },
      },
      {
        id: 'dizziness_lightheaded',
        label: 'Dizziness / Lightheadedness',
        description: 'Room spinning, feeling unsteady or faint',
        translations: {
          en: { label: 'Dizziness / Lightheadedness', description: 'Feeling unsteady or faint' },
          hi: { label: 'चक्कर आना या सिर घूमना', description: 'संतुलन बिगड़ना या कमजोरी' },
          mr: { label: 'चक्कर येणे किंवा भोवळ', description: 'तोल जाणे किंवा अंधारी येणे' },
          gu: { label: 'ચક્કર આવવા', description: 'બેલેન્સ ગુમાવવું' },
          bn: { label: 'মাথা ঘোরা', description: 'ভারসাম্যহীনতা বা অন্ধকার দেখা' },
          ta: { label: 'தலைசுற்றல் / மயக்கம்', description: 'சமநிலை இழப்பு அல்லது மயக்க உணர்வு' },
        },
      },
      {
        id: 'eye_vision_strain',
        label: 'Eye Discomfort / Blurry Vision',
        description: 'Redness, burning, eye strain, or blurred vision',
        translations: {
          en: { label: 'Eye Discomfort / Blurry Vision', description: 'Redness, burning, or blur' },
          hi: { label: 'आंखों में जलन या धुंधलापन', description: 'लाली, जलन या देखने में दिक्कत' },
          mr: { label: 'डोळ्यांत जळजळ किंवा अंधुक दिसणे', description: 'डोळे लाल होणे, चुरचुरणे' },
          gu: { label: 'આંખમાં બળતરા અથવા ઝાંખું દેખાવું', description: 'લાલાશ કે થાક' },
          bn: { label: 'চোখের অস্বস্তি বা ঝাপসা দৃষ্টি', description: 'চোখ লাল হওয়া বা জ্বালা' },
          ta: { label: 'கண் அசௌகரியம் / மங்கலான பார்வை', description: 'எரிச்சல் அல்லது சிவத்தல்' },
        },
      },
      {
        id: 'facial_sinus_pressure',
        label: 'Facial Pain / Sinus Pressure',
        description: 'Tenderness around forehead, cheeks, or nose',
        translations: {
          en: { label: 'Facial Pain / Sinus Pressure', description: 'Forehead or cheek tenderness' },
          hi: { label: 'चेहरे या साइनस में दबाव व दर्द', description: 'माथे और गालों के पास भारीपन' },
          mr: { label: 'चेहऱ्यावर किंवा सायनसमध्ये ताण', description: 'कपाळ आणि गालावर वेदना' },
          gu: { label: 'ચહેરાનો દુખાવો / સાઇનસ', description: 'કપાળ પર દબાણ' },
          bn: { label: 'মুখ বা সাইনাসের চাপ ও ব্যথা', description: 'কপালে ও গালে ভারী ভাব' },
          ta: { label: 'முக வலி / சைனஸ் அழுத்தம்', description: 'நெற்றி அல்லது கன்னத்தில் வலி' },
        },
      },
      {
        id: 'not_sure_head',
        label: 'Not Sure / Something Else',
        description: 'Other head or face symptom',
        translations: {
          en: { label: 'Not Sure / Something Else', description: 'Other head or face issue' },
          hi: { label: 'पक्का नहीं / कुछ और', description: 'अन्य लक्षण' },
          mr: { label: 'नक्की सांगता येत नाही / इतर काही', description: 'इतर लक्षण' },
          gu: { label: 'ચોક્કસ ખબર નથી / બીજું કંઈક', description: 'અન્ય લક્ષણ' },
          bn: { label: 'নিশ্চিত নই / অন্য কিছু', description: 'অন্য কোনো সমস্যা' },
          ta: { label: 'உறுதியாக தெரியவில்லை / வேறு', description: 'மற்றொரு பிரச்சனை' },
        },
      },
    ],
  },

  // ── STOMACH & DIGESTION ──
  {
    id: 'q_stomach_digestion',
    categoryId: 'stomach_digestion',
    applicableRegions: ['stomach', 'upper_abdomen', 'lower_abdomen'],
    title: 'What does it feel like in your stomach / abdomen?',
    subtitle: 'Choose what you are experiencing. You can select more than one.',
    translations: {
      en: {
        title: 'What does it feel like in your stomach or abdomen?',
        subtitle: 'Choose what you are experiencing. You can select more than one.',
      },
      hi: {
        title: 'आपके पेट या पाचन में कैसा महसूस हो रहा है?',
        subtitle: 'जो महसूस हो रहा है उसे चुनें। आप एक से अधिक विकल्प चुन सकते हैं।',
      },
      mr: {
        title: 'आपल्या पोटात किंवा पचनात काय त्रास होत आहे?',
        subtitle: 'आपल्या त्रासाशी जुळणारे पर्याय निवडा. आपण एकापेक्षा जास्त निवडू शकता.',
      },
      gu: {
        title: 'તમારા પેટ અથવા પાચનમાં શું તકલીફ છે?',
        subtitle: 'તમને જે તકલીફ હોય તે પસંદ કરો. તમે એક કરતાં વધુ પસંદ કરી શકો છો.',
      },
      bn: {
        title: 'আপনার পেট বা হজমে কী সমস্যা হচ্ছে?',
        subtitle: 'যা অনুভব করছেন তা নির্বাচন করুন। একাধিক বিকল্প বেছে নিতে পারেন।',
      },
      ta: {
        title: 'உங்கள் வயிறு அல்லது செரிமானத்தில் என்ன பிரச்சனை?',
        subtitle: 'நீங்கள் உணர்வதைத் தேர்ந்தெடுக்கவும். ஒன்றுக்கும் மேற்பட்டவற்றைத் தேர்ந்தெடுக்கலாம்.',
      },
    },
    answerType: 'multiple_choice',
    required: true,
    allowCustomText: true,
    decisionSupportNote: 'Patient-reported gastrointestinal symptom screening',
    options: [
      {
        id: 'stomach_pain_cramps',
        label: 'Stomach Ache or Cramps',
        description: 'Ache, sharp spasms, or continuous dull pain',
        translations: {
          en: { label: 'Stomach Ache or Cramps', description: 'Ache or spasms in abdomen' },
          hi: { label: 'पेट दर्द या मरोड़', description: 'पेट में ऐंठन या लगातार दर्द' },
          mr: { label: 'पोटदुखी किंवा मुरडा', description: 'पोटात चमक किंवा सतत दुखणे' },
          gu: { label: 'પેટમાં દુખાવો અથવા ચૂંક', description: 'પેટમાં ચૂંક આવવી' },
          bn: { label: 'পেটে ব্যথা বা টান ধরা', description: 'পেটে তীব্র মোচড় বা ব্যথা' },
          ta: { label: 'வயிற்று வலி அல்லது பிடிப்பு', description: 'வயிற்றில் வலி அல்லது பிடிப்பு' },
        },
      },
      {
        id: 'acidity_burning',
        label: 'Acidity / Burning Sensation',
        description: 'Acid reflux, heartburn, or burning in upper stomach',
        translations: {
          en: { label: 'Acidity / Burning Sensation', description: 'Heartburn or acid reflux' },
          hi: { label: 'एसिडिटी या पेट में जलन', description: 'खट्टी डकारें या सीने में जलन' },
          mr: { label: 'अॅसिडिटी किंवा जळजळ', description: 'छातीत किंवा पोटात जळजळ' },
          gu: { label: 'એસિડિટી અથવા બળતરા', description: 'પેટમાં કે છાતીમાં બળતરા' },
          bn: { label: 'অ্যাসিডিটি বা জ্বালাপোড়া', description: 'বুকজ্বালা বা অম্লপিত্ত' },
          ta: { label: 'அமிலத்தன்மை / நெஞ்செரிச்சல்', description: 'அமில வீச்சு அல்லது நெஞ்செரிவு' },
        },
      },
      {
        id: 'nausea_vomiting',
        label: 'Nausea or Vomiting',
        description: 'Feeling sick to stomach or throwing up',
        translations: {
          en: { label: 'Nausea or Vomiting', description: 'Feeling sick or throwing up' },
          hi: { label: 'उल्टी या जी मिचलाना', description: 'उल्टी का मन या उल्टी आना' },
          mr: { label: 'मळमळ किंवा उलटी', description: 'उलटीची भावना किंवा उलटी होणे' },
          gu: { label: 'ઉબકા અથવા ઉલટી', description: 'જીવ ગભરાવવો કે ઉલટી' },
          bn: { label: 'বমি ভাব বা বমি', description: 'বমি বমি ভাব বা বমি হওয়া' },
          ta: { label: 'குமட்டல் அல்லது வாந்தி', description: 'குமட்டல் அல்லது வாந்தி எடுத்தல்' },
        },
      },
      {
        id: 'bloating_gas',
        label: 'Bloating or Heavy Gas',
        description: 'Swollen fullness, tightness, flatulence',
        translations: {
          en: { label: 'Bloating or Heavy Gas', description: 'Fullness or excess gas' },
          hi: { label: 'पेट फूलना या गैस', description: 'पेट भारी लगना या गैस बनना' },
          mr: { label: 'पोट फुगणे किंवा गॅस', description: 'पोट जड होणे किंवा वायूचा त्रास' },
          gu: { label: 'પેટ ફૂલવું અથવા ગેસ', description: 'પેટ ભારે લાગવું' },
          bn: { label: 'পেট ফাঁপা বা গ্যাস', description: 'পেট ভার হয়ে থাকা বা বায়ু' },
          ta: { label: 'வயிறு உப்புசம் அல்லது வாயு', description: 'வயிறு வீக்கம் அல்லது வாயுத் தொல்லை' },
        },
      },
      {
        id: 'bowel_changes',
        label: 'Loose Motions or Constipation',
        description: 'Diarrhea, frequent loose stools, or difficulty passing stool',
        translations: {
          en: { label: 'Loose Motions / Constipation', description: 'Diarrhea or hard stool' },
          hi: { label: 'दस्त या कब्ज', description: 'पेट साफ न होना या बार-बार शौच' },
          mr: { label: 'जुलाब किंवा बद्धकोष्ठता', description: 'सैल शौच किंवा शौचास त्रास' },
          gu: { label: 'ઝાડા અથવા કબજિયાત', description: 'પાચનમાં ફેરફાર' },
          bn: { label: 'ডায়রিয়া বা কোষ্ঠকাঠিন্য', description: 'মলত্যাগে অনিয়ম' },
          ta: { label: 'வயிற்றுப்போக்கு அல்லது மலச்சிக்கல்', description: 'மலம் கழிப்பதில் மாற்றம்' },
        },
      },
      {
        id: 'not_sure_stomach',
        label: 'Not Sure / Something Else',
        description: 'Other digestion symptom',
        translations: {
          en: { label: 'Not Sure / Something Else', description: 'Other stomach issue' },
          hi: { label: 'पक्का नहीं / कुछ और', description: 'अन्य लक्षण' },
          mr: { label: 'नक्की सांगता येत नाही / इतर काही', description: 'इतर लक्षण' },
          gu: { label: 'ચોક્કસ ખબર નથી / બીજું કંઈક', description: 'અન્ય લક્ષણ' },
          bn: { label: 'নিশ্চিত নই / অন্য কিছু', description: 'অন্য কোনো সমস্যা' },
          ta: { label: 'உறுதியாக தெரியவில்லை / வேறு', description: 'மற்றொரு பிரச்சனை' },
        },
      },
    ],
  },

  // ── BACK & SPINE ──
  {
    id: 'q_back_spine',
    categoryId: 'back_spine',
    applicableRegions: ['neck', 'upper_back', 'spine', 'lower_back'],
    title: 'What does it feel like in your back or spine?',
    subtitle: 'Choose what you are experiencing. You can select more than one.',
    translations: {
      en: {
        title: 'What does it feel like in your back or spine?',
        subtitle: 'Choose what you are experiencing. You can select more than one.',
      },
      hi: {
        title: 'आपकी पीठ या रीढ़ में कैसा महसूस हो रहा है?',
        subtitle: 'जो महसूस हो रहा है उसे चुनें। आप एक से अधिक विकल्प चुन सकते हैं।',
      },
      mr: {
        title: 'आपल्या पाठीत किंवा मणक्यात काय त्रास होत आहे?',
        subtitle: 'आपल्या त्रासाशी जुळणारे पर्याय निवडा. आपण एकापेक्षा जास्त निवडू शकता.',
      },
      gu: {
        title: 'તમારી પીઠ અથવા કરોડરજ્જુમાં શું તકલીફ છે?',
        subtitle: 'તમને જે તકલીફ હોય તે પસંદ કરો. તમે એક કરતાં વધુ પસંદ કરી શકો છો.',
      },
      bn: {
        title: 'আপনার পিঠ বা মেরুদণ্ডে কী সমস্যা হচ্ছে?',
        subtitle: 'যা অনুভব করছেন তা নির্বাচন করুন। একাধিক বিকল্প বেছে নিতে পারেন।',
      },
      ta: {
        title: 'உங்கள் முதுகு அல்லது முதுகெலும்பில் என்ன பிரச்சனை?',
        subtitle: 'நீங்கள் உணர்வதைத் தேர்ந்தெடுக்கவும். ஒன்றுக்கும் மேற்பட்டவற்றைத் தேர்ந்தெடுக்கலாம்.',
      },
    },
    answerType: 'multiple_choice',
    required: true,
    allowCustomText: true,
    decisionSupportNote: 'Patient-reported spinal & musculoskeletal screening',
    options: [
      {
        id: 'lower_back_pain',
        label: 'Lower Back Ache / Stiffness',
        description: 'Pain in lower back, worse on standing or sitting',
        translations: {
          en: { label: 'Lower Back Ache / Stiffness', description: 'Pain on sitting or standing' },
          hi: { label: 'कमर या पीठ के निचले हिस्से में दर्द', description: 'बैठने या उठने पर दर्द' },
          mr: { label: 'कंबरदुखी / खालच्या पाठीत वेदना', description: 'बसताना किंवा वाकताना त्रास' },
          gu: { label: 'કમરનો દુખાવો', description: 'બેસવા કે ઊભા રહેવામાં તકલીફ' },
          bn: { label: 'কোমরে বা নিচের পিঠে ব্যথা', description: 'বসলে বা দাঁড়ালে ব্যথা' },
          ta: { label: 'கீழ் முதுகு வலி / இறுக்கம்', description: 'குனிவது அல்லது உட்காருவதில் சிரமம்' },
        },
      },
      {
        id: 'neck_stiffness',
        label: 'Neck Stiffness / Restricted Turning',
        description: 'Difficulty turning head or tight neck muscles',
        translations: {
          en: { label: 'Neck Stiffness', description: 'Tight neck muscles or pain on turning' },
          hi: { label: 'गर्दन में अकड़न या दर्द', description: 'गर्दन हिलाने में दर्द' },
          mr: { label: 'मानेत ताण किंवा वेदना', description: 'मान वळवण्यास त्रास' },
          gu: { label: 'ગરદન અકડાઈ જવી', description: 'ગરદન ફેરવવામાં દુખાવો' },
          bn: { label: 'ঘাড়ে ব্যথা বা শক্ত ভাব', description: 'ঘাড় ঘোরাতে অসুবিধা' },
          ta: { label: 'கழுத்து வலி / இறுக்கம்', description: 'தலையை அசைப்பதில் சிரமம்' },
        },
      },
      {
        id: 'radiating_leg_pain',
        label: 'Pain Travelling Down the Leg (Sciatica)',
        description: 'Shooting pain from back down into thigh or calf',
        translations: {
          en: { label: 'Pain Travelling Down Leg', description: 'Shooting pain into legs' },
          hi: { label: 'पैर में नीचे की ओर जाता दर्द (साइटिका)', description: 'कमर से पैर तक तेज खिंचाव' },
          mr: { label: 'पायात जाणारी कळ (सायटिका)', description: 'कमरेतून पायापर्यंत जाणारी तीव्र वेदना' },
          gu: { label: 'પગ સુધી જતો દુખાવો (સાયટિકા)', description: 'કમરથી પગ સુધી ખેંચાણ' },
          bn: { label: 'পায়ে নেমে যাওয়া তীব্র ব্যথা', description: 'কোমর থেকে পা পর্যন্ত টানা ব্যথা' },
          ta: { label: 'காலுக்கு பரவும் வலி (சயாடிகா)', description: 'முதுகிலிருந்து காலுக்கு பரவும் வலி' },
        },
      },
      {
        id: 'upper_back_spasm',
        label: 'Upper Back / Shoulder Blade Tension',
        description: 'Ache between shoulder blades or upper spine',
        translations: {
          en: { label: 'Upper Back Tension', description: 'Ache between shoulder blades' },
          hi: { label: 'पीठ के ऊपरी हिस्से में खिंचाव', description: 'कंधों के बीच दर्द' },
          mr: { label: 'वरच्या पाठीत जडपणा', description: 'खांद्यांच्या मध्ये ताण' },
          gu: { label: 'ઉપરની પીઠમાં ખેંચાણ', description: 'ખભા વચ્ચે દુખાવો' },
          bn: { label: 'উপরের পিঠে বা কাঁধের মাঝে টান', description: 'পিঠের উপরিভাগে ব্যথা' },
          ta: { label: 'மேல் முதுகு பிடிப்பு', description: 'தோள்பட்டைகளுக்கு இடையே வலி' },
        },
      },
      {
        id: 'not_sure_back',
        label: 'Not Sure / Something Else',
        description: 'Other back or spine symptom',
        translations: {
          en: { label: 'Not Sure / Something Else', description: 'Other back issue' },
          hi: { label: 'पक्का नहीं / कुछ और', description: 'अन्य लक्षण' },
          mr: { label: 'नक्की सांगता येत नाही / इतर काही', description: 'इतर लक्षण' },
          gu: { label: 'ચોક્કસ ખબર નથી / બીજું કંઈક', description: 'અન્ય લક્ષણ' },
          bn: { label: 'নিশ্চিত নই / অন্য কিছু', description: 'অন্য কোনো সমস্যা' },
          ta: { label: 'உறுதியாக தெரியவில்லை / வேறு', description: 'மற்றொரு பிரச்சனை' },
        },
      },
    ],
  },

  // ── ARMS, LEGS & JOINTS ──
  {
    id: 'q_joint_limbs',
    categoryId: 'joint_pain',
    applicableRegions: [
      'left_shoulder', 'right_shoulder',
      'left_elbow', 'right_elbow',
      'left_hand', 'right_hand',
      'left_knee', 'right_knee',
      'left_foot', 'right_foot',
      'left_thigh', 'right_thigh',
      'left_hip', 'right_hip',
    ],
    title: 'What does it feel like in your joints or limbs?',
    subtitle: 'Choose what you are experiencing. You can select more than one.',
    translations: {
      en: {
        title: 'What does it feel like in your joints or limbs?',
        subtitle: 'Choose what you are experiencing. You can select more than one.',
      },
      hi: {
        title: 'आपके जोड़ों या हाथ-पैरों में कैसा महसूस हो रहा है?',
        subtitle: 'जो महसूस हो रहा है उसे चुनें। आप एक से अधिक विकल्प चुन सकते हैं।',
      },
      mr: {
        title: 'आपल्या सांध्यांमध्ये किंवा हात-पायात काय त्रास आहे?',
        subtitle: 'आपल्या त्रासाशी जुळणारे पर्याय निवडा. आपण एकापेक्षा जास्त निवडू शकता.',
      },
      gu: {
        title: 'તમારા સાંધા અથવા હાથ-પગમાં શું તકલીફ છે?',
        subtitle: 'તમને જે તકલીફ હોય તે પસંદ કરો. તમે એક કરતાં વધુ પસંદ કરી શકો છો.',
      },
      bn: {
        title: 'আপনার জয়েন্ট বা হাত-পায়ে কী সমস্যা হচ্ছে?',
        subtitle: 'যা অনুভব করছেন তা নির্বাচন করুন। একাধিক বিকল্প বেছে নিতে পারেন।',
      },
      ta: {
        title: 'உங்கள் மூட்டுகள் அல்லது கைகால்களில் என்ன பிரச்சனை?',
        subtitle: 'நீங்கள் உணர்வதைத் தேர்ந்தெடுக்கவும். ஒன்றுக்கும் மேற்பட்டவற்றைத் தேர்ந்தெடுக்கலாம்.',
      },
    },
    answerType: 'multiple_choice',
    required: true,
    allowCustomText: true,
    decisionSupportNote: 'Patient-reported orthopedic & joint assessment',
    options: [
      {
        id: 'joint_pain_swelling',
        label: 'Pain and Swelling',
        description: 'Swollen joint, warm to touch, or throbbing pain',
        translations: {
          en: { label: 'Pain and Swelling', description: 'Swollen or warm joint' },
          hi: { label: 'दर्द और सूजन', description: 'जोड़ों में सूजन या छूने पर गर्माहट' },
          mr: { label: 'वेदना आणि सूज', description: 'सांध्याला सूज किंवा दुखणे' },
          gu: { label: 'દુખાવો અને સોજો', description: 'સાંધામાં સોજો' },
          bn: { label: 'ব্যথা এবং ফোলাভাব', description: 'জয়েন্ট ফুলে যাওয়া বা গরম লাগা' },
          ta: { label: 'வலி மற்றும் வீக்கம்', description: 'மூட்டு வீக்கம் அல்லது சூடு' },
        },
      },
      {
        id: 'morning_stiffness',
        label: 'Morning Stiffness / Restricted Movement',
        description: 'Hard to move or bend joints after waking up',
        translations: {
          en: { label: 'Morning Stiffness', description: 'Hard to move in morning' },
          hi: { label: 'सुबह के समय जोड़ों में अकड़न', description: 'उठने के बाद हिलाने में दिक्कत' },
          mr: { label: 'सकाळी सांधे आखडणे', description: 'सकाळी उठल्यावर हालचालीस त्रास' },
          gu: { label: 'સવારે સાંધા અકડાઈ જવા', description: 'હલનચલનમાં મુશ્કેલી' },
          bn: { label: 'সকালে জয়েন্ট শক্ত হয়ে থাকা', description: 'ঘুম থেকে উঠে নাড়াতে কষ্ট' },
          ta: { label: 'காலை நேர மூட்டு இறுக்கம்', description: 'காலையில் அசைப்பதில் சிரமம்' },
        },
      },
      {
        id: 'difficulty_walking',
        label: 'Difficulty Walking or Bearing Weight',
        description: 'Pain when stepping, walking, or climbing stairs',
        translations: {
          en: { label: 'Difficulty Walking / Bearing Weight', description: 'Pain when stepping or standing' },
          hi: { label: 'चलने या वजन उठाने में कठिनाई', description: 'पैर रखने या सीढ़ियां चढ़ने पर दर्द' },
          mr: { label: 'चालताना किंवा वजन पेलताना त्रास', description: 'पाय टेकताना किंवा पायऱ्या चढताना वेदना' },
          gu: { label: 'ચાલવામાં તકલીફ', description: 'પગ મૂકવા પર દુખાવો' },
          bn: { label: 'হাঁটতে বা ওজন বহন করতে কষ্ট', description: 'সিঁড়ি ভাঙতে বা পা ফেলতে ব্যথা' },
          ta: { label: 'நடப்பதில் அல்லது எடை தாங்குவதில் சிரமம்', description: 'படி ஏறும்போது வலி' },
        },
      },
      {
        id: 'numbness_tingling',
        label: 'Numbness or Tingling (Pins & Needles)',
        description: 'Loss of feeling or prickling sensation',
        translations: {
          en: { label: 'Numbness or Tingling', description: 'Prickling or pins & needles' },
          hi: { label: 'सुन्नपन या झुनझुनी', description: 'हाथ-पैर सो जाना या सुई जैसी चुभन' },
          mr: { label: 'बधिरपणा किंवा मुंग्या येणे', description: 'संवेदना कमी होणे किंवा टोचल्यासारखे वाटणे' },
          gu: { label: 'ખાલી ચડવી અથવા ઝણઝણાટી', description: 'સોય ભોંકાતી હોય તેવો અનુભવ' },
          bn: { label: 'অবশ ভাব বা ঝিঁঝি ধরা', description: 'অনুভূতি কমে যাওয়া বা সুচ ফোটার মতো' },
          ta: { label: 'மரத்துப்போதல் அல்லது கூச்சம்', description: 'உணர்வின்மை அல்லது ஊசி குத்துவது போன்ற உணர்வு' },
        },
      },
      {
        id: 'recent_injury',
        label: 'Recent Sprain, Twist, or Impact',
        description: 'Recent fall, sports strain, or sudden twisting',
        translations: {
          en: { label: 'Recent Sprain / Twist / Impact', description: 'Twist, fall, or sudden strain' },
          hi: { label: 'हाल की चोट, मोच या गिरना', description: 'पैर मुड़ना या अचानक खिंचाव' },
          mr: { label: 'अलिकडची दुखापत, लचक किंवा पडणे', description: 'पाय मुरगळणे किंवा अचानक मार लागणे' },
          gu: { label: 'તાજેતરની ઈજા અથવા મચકોડ', description: 'પગ વળી જવો કે પડવું' },
          bn: { label: 'সাম্প্রতিক আঘাত বা মচকে যাওয়া', description: 'হঠাৎ মচকানো বা পড়ে যাওয়া' },
          ta: { label: 'சமீபத்திய காயம் / சுளுக்கு', description: 'சுளுக்கு அல்லது திடீர் அடி' },
        },
      },
      {
        id: 'not_sure_joint',
        label: 'Not Sure / Something Else',
        description: 'Other joint or muscle symptom',
        translations: {
          en: { label: 'Not Sure / Something Else', description: 'Other joint issue' },
          hi: { label: 'पक्का नहीं / कुछ और', description: 'अन्य लक्षण' },
          mr: { label: 'नक्की सांगता येत नाही / इतर काही', description: 'इतर लक्षण' },
          gu: { label: 'ચોક્કસ ખબર નથી / બીજું કંઈક', description: 'અન્ય લક્ષણ' },
          bn: { label: 'নিশ্চিত নই / অন্য কিছু', description: 'অন্য কোনো সমস্যা' },
          ta: { label: 'உறுதியாக தெரியவில்லை / வேறு', description: 'மற்றொரு பிரச்சனை' },
        },
      },
    ],
  },

  // ── FEVER & INFECTION ──
  {
    id: 'q_fever_infection',
    categoryId: 'fever_infection',
    applicableRegions: ['fever_general'],
    title: 'What symptoms are accompanying your fever / illness?',
    subtitle: 'Choose what you are experiencing. You can select more than one.',
    translations: {
      en: {
        title: 'What symptoms are accompanying your fever or illness?',
        subtitle: 'Choose what you are experiencing. You can select more than one.',
      },
      hi: {
        title: 'बुखार या बीमारी के साथ और क्या लक्षण हैं?',
        subtitle: 'जो महसूस हो रहा है उसे चुनें। आप एक से अधिक विकल्प चुन सकते हैं।',
      },
      mr: {
        title: 'तापाबरोबर किंवा आजारपणासोबत इतर काय लक्षणे आहेत?',
        subtitle: 'आपल्या त्रासाशी जुळणारे पर्याय निवडा. आपण एकापेक्षा जास्त निवडू शकता.',
      },
      gu: {
        title: 'તાવ અથવા બીમારી સાથે અન્ય શું લક્ષણો છે?',
        subtitle: 'તમને જે તકલીફ હોય તે પસંદ કરો. તમે એક કરતાં વધુ પસંદ કરી શકો છો.',
      },
      bn: {
        title: 'জ্বর বা অসুস্থতার সাথে আর কী লক্ষণ রয়েছে?',
        subtitle: 'যা অনুভব করছেন তা নির্বাচন করুন। একাধিক বিকল্প বেছে নিতে পারেন।',
      },
      ta: {
        title: 'காய்ச்சல் அல்லது நோயுடன் வேறு என்ன அறிகுறிகள் உள்ளன?',
        subtitle: 'நீங்கள் உணர்வதைத் தேர்ந்தெடுக்கவும். ஒன்றுக்கும் மேற்பட்டவற்றைத் தேர்ந்தெடுக்கலாம்.',
      },
    },
    answerType: 'multiple_choice',
    required: true,
    allowCustomText: true,
    decisionSupportNote: 'Patient-reported febrile & infectious symptom screening',
    options: [
      {
        id: 'chills_shivering',
        label: 'Chills or Shivering',
        description: 'Feeling very cold despite warm clothing',
        translations: {
          en: { label: 'Chills or Shivering', description: 'Feeling cold with shivering' },
          hi: { label: 'ठंड लगना या कंपकंपी', description: 'ठंड के साथ कपकपी छूटना' },
          mr: { label: 'थंडी वाजणे किंवा हुडहुडी', description: 'अंगात थंडी भरून कापणे' },
          gu: { label: 'ટાઢ વાવવી અથવા ધ્રુજારી', description: 'ઠંડી લાગવી' },
          bn: { label: 'ঠান্ডা লাগা বা কাঁপুনি', description: 'কাঁপুনি দিয়ে জ্বর' },
          ta: { label: 'குளிர் அல்லது நடுக்கம்', description: 'குளிருடன் நடுக்கம்' },
        },
      },
      {
        id: 'body_ache_weakness',
        label: 'Body Ache / Exhaustion',
        description: 'Generalized muscle ache and feeling very tired',
        translations: {
          en: { label: 'Body Ache / Exhaustion', description: 'Muscle ache and tiredness' },
          hi: { label: 'पूरे बदन में दर्द व कमजोरी', description: 'मांसपेशियों में दर्द और थकावट' },
          mr: { label: 'अंगदुखी आणि प्रचंड थकवा', description: 'सर्व अंगात वेदना आणि अशक्तपणा' },
          gu: { label: 'શરીરનો દુખાવો અને નબળાઈ', description: 'થાક અને સ્નાયુઓનો દુખાવો' },
          bn: { label: 'গা-হাত-পা ব্যথা ও দুর্বলতা', description: 'প্রচণ্ড ক্লান্তি ও ব্যথা' },
          ta: { label: 'உடல் வலி மற்றும் சோர்வு', description: 'தசை வலி மற்றும் பலவீனம்' },
        },
      },
      {
        id: 'sore_throat_cold',
        label: 'Sore Throat, Cold, or Cough',
        description: 'Throat irritation, runny nose, or chest cough',
        translations: {
          en: { label: 'Sore Throat / Cold / Cough', description: 'Throat pain or runny nose' },
          hi: { label: 'गले में खराश, सर्दी या जुकाम', description: 'गले में दर्द या नाक बहना' },
          mr: { label: 'घसा खवखवणे, सर्दी किंवा खोकला', description: 'घशात जळजळ किंवा नाक वाहणे' },
          gu: { label: 'ગળામાં ખરાશ અથવા શરદી', description: 'નાક વહેવું' },
          bn: { label: 'গলা ব্যথা, সর্দি বা কাশি', description: 'গলায় খসখসে ভাব' },
          ta: { label: 'தொண்டை வலி, சளி அல்லது இருமல்', description: 'தொண்டை எரிச்சல்' },
        },
      },
      {
        id: 'sweating_flushed',
        label: 'Excessive Sweating',
        description: 'Heavy sweating or breaking out in sweat',
        translations: {
          en: { label: 'Excessive Sweating', description: 'Sweats after fever peaks' },
          hi: { label: 'बहुत अधिक पसीना आना', description: 'बुखार उतरते समय पसीना' },
          mr: { label: 'प्रचंड घाम येणे', description: 'ताप कमी होताना घाम सुटणे' },
          gu: { label: 'અતિશય પરસેવો થવો', description: 'તાવ ઉતરતી વખતે પરસેવો' },
          bn: { label: 'অতিরিক্ত ঘাম হওয়া', description: 'জ্বরের পর অতিরিক্ত ঘাম' },
          ta: { label: 'அதிகப்படியான வியர்வை', description: 'காய்ச்சல் குறையும் போது வியர்த்தல்' },
        },
      },
      {
        id: 'not_sure_fever',
        label: 'Not Sure / Something Else',
        description: 'Other infection symptom',
        translations: {
          en: { label: 'Not Sure / Something Else', description: 'Other fever issue' },
          hi: { label: 'पक्का नहीं / कुछ और', description: 'अन्य लक्षण' },
          mr: { label: 'नक्की सांगता येत नाही / इतर काही', description: 'इतर लक्षण' },
          gu: { label: 'ચોક્કસ ખબર નથી / બીજું કંઈક', description: 'અન્ય લક્ષણ' },
          bn: { label: 'নিশ্চিত নই / অন্য কিছু', description: 'অন্য কোনো সমস্যা' },
          ta: { label: 'உறுதியாக தெரியவில்லை / வேறு', description: 'மற்றொரு பிரச்சனை' },
        },
      },
    ],
  },
]

// ── 2. STANDARDIZED DURATION OPTIONS (SECTION 3) ──

export const DURATION_OPTIONS: IntakeDurationOption[] = [
  {
    id: 'today',
    title: {
      en: 'Today',
      hi: 'आज ही शुरू हुआ',
      mr: 'आजच सुरू झाले',
      gu: 'આજે જ શરૂ થયું',
      bn: 'আজকেই শুরু হয়েছে',
      ta: 'இன்று தொடங்கியது',
    },
    desc: {
      en: 'Started within the last 24 hours',
      hi: 'पिछले 24 घंटों के भीतर',
      mr: 'गेल्या २४ तासांच्या आत',
      gu: 'છેલ્લા 24 કલાકમાં',
      bn: 'গত ২৪ ঘণ্টার মধ্যে',
      ta: 'கடந்த 24 மணி நேரத்திற்குள்',
    },
  },
  {
    id: '2_3_days',
    title: {
      en: '2–3 days',
      hi: '2 से 3 दिन',
      mr: '२ ते ३ दिवस',
      gu: '2 થી 3 દિવસ',
      bn: '২ থেকে ৩ দিন',
      ta: '2 முதல் 3 நாட்கள்',
    },
    desc: {
      en: 'Started a few days ago',
      hi: 'कुछ दिन पहले से',
      mr: 'काही दिवसांपूर्वी सुरू झाले',
      gu: 'થોડા દિવસો પહેલાથી',
      bn: 'কয়েক দিন আগে থেকে',
      ta: 'சில நாட்களுக்கு முன்பு',
    },
  },
  {
    id: 'about_a_week',
    title: {
      en: 'About a week',
      hi: 'लगभग 1 सप्ताह',
      mr: 'सुमारे १ आठवडा',
      gu: 'લગભગ 1 અઠવાડિયું',
      bn: 'প্রায় ১ সপ্তাহ',
      ta: 'சுமார் 1 வாரம்',
    },
    desc: {
      en: 'Started around 5 to 7 days ago',
      hi: 'लगभग 5 से 7 दिनों से',
      mr: 'सुमारे ५ ते ७ दिवसांपासून',
      gu: 'લગભગ 5 થી 7 દિવસથી',
      bn: 'প্রায় ৫ থেকে ৭ দিন ধরে',
      ta: 'சுமார் 5 முதல் 7 நாட்களாக',
    },
  },
  {
    id: '2_4_weeks',
    title: {
      en: '2–4 weeks',
      hi: '2 से 4 सप्ताह',
      mr: '२ ते ४ आठवडे',
      gu: '2 થી 4 અઠવાડિયા',
      bn: '২ থেকে ৪ সপ্তাহ',
      ta: '2 முதல் 4 வாரங்கள்',
    },
    desc: {
      en: 'Ongoing discomfort for a few weeks',
      hi: 'पिछले कुछ हफ्तों से बना हुआ है',
      mr: 'काही आठवड्यांपासून सतत जाणवणारा त्रास',
      gu: 'કેટલાક અઠવાડિયાથી ચાલુ તકલીફ',
      bn: 'কয়েক সপ্তাহ ধরে চলছে',
      ta: 'சில வாரங்களாகத் தொடர்கிறது',
    },
  },
  {
    id: 'more_than_month',
    title: {
      en: 'More than a month',
      hi: '1 महीने से अधिक (पुराना)',
      mr: '१ महिन्यापेक्षा जास्त (दीर्घकालीन)',
      gu: '1 મહિનાથી વધુ સમય',
      bn: '১ মাসের বেশি সময়',
      ta: '1 மாதத்திற்கும் மேலாக',
    },
    desc: {
      en: 'Long-term or chronic issue',
      hi: 'लंबे समय से बना हुआ दर्द',
      mr: 'दीर्घकालीन किंवा जुनाट त्रास',
      gu: 'લાંબા ગાળાની સમસ્યા',
      bn: 'দীর্ঘমেয়াদী বা পুরোনো সমস্যা',
      ta: 'நீண்ட கால பிரச்சனை',
    },
  },
  {
    id: 'not_sure_duration',
    title: {
      en: 'Not sure',
      hi: 'पक्का याद नहीं',
      mr: 'नक्की सांगता येत नाही',
      gu: 'ચોક્કસ યાદ નથી',
      bn: 'ঠিক মনে নেই',
      ta: 'உறுதியாக நினைவில்லை',
    },
    desc: {
      en: 'Hard to pinpoint exact start date',
      hi: 'सटीक समय बताना कठिन है',
      mr: 'नक्की वेळ सांगणे कठीण आहे',
      gu: 'ચોક્કસ સમય નક્કી કરવો મુશ્કેલ',
      bn: 'নির্দিষ্ট সময় বলা কঠিন',
      ta: 'துல்லியமாக கூற முடியவில்லை',
    },
  },
]

// ── 3. NON-JUDGMENTAL LIFESTYLE TRIGGERS (SECTION 4) ──

export const LIFESTYLE_OPTIONS: IntakeLifestyleOption[] = [
  {
    id: 'food_meals',
    title: {
      en: 'Heavy, Spicy, or Delayed Meals',
      hi: 'भारी, मसालेदार या देर से भोजन',
      mr: 'जड, तिखट किंवा उशिरा जेवण',
      gu: 'ભારે, તીખું કે મોડું ભોજન',
      bn: 'ভারী, মশলাযুক্ত বা দেরিতে খাওয়া',
      ta: 'கனமான, காரமான அல்லது தாமதமான உணவு',
    },
    desc: {
      en: 'Noticed after certain food, oily meals, or skipping meals',
      hi: 'विशेष खान-पान या भूखे रहने के बाद लक्षण दिखते हैं',
      mr: 'विशिष्ट अन्न किंवा उपासानंतर त्रास जाणवतो',
      gu: 'ચોક્કસ ખોરાક કે ખાલી પેટે તકલીફ વધે છે',
      bn: 'খাবার বা খালি পেটের সাথে সম্পর্কিত',
      ta: 'உணவு அல்லது வெறும் வயிற்றுடன் தொடர்புடையது',
    },
  },
  {
    id: 'sleep_rest',
    title: {
      en: 'Tiredness, Disturbed Sleep, or Stress',
      hi: 'थकावट, नींद की कमी या मानसिक तनाव',
      mr: 'थकवा, अपुरी झोप किंवा ताणतणाव',
      gu: 'થાક, ઊંઘનો અભાવ કે માનસિક તણાવ',
      bn: 'ক্লান্তি, ঘুমের ব্যাঘাত বা মানসিক চাপ',
      ta: 'சோர்வு, தூக்கமின்மை அல்லது மன அழுத்தம்',
    },
    desc: {
      en: 'Noticed during fatigue, broken sleep, or busy routine',
      hi: 'थकान या नींद पूरी न होने पर बढ़ जाता है',
      mr: 'थकवा किंवा झोप न मिळाल्यास त्रास वाढतो',
      gu: 'થાક કે અનિદ્રા વખતે વધારે લાગે છે',
      bn: 'ক্লান্তি বা অনিদ্রার সময় বেড়ে যায়',
      ta: 'சோர்வு அல்லது தூக்கமின்மையின் போது அதிகரிக்கிறது',
    },
  },
  {
    id: 'activity_posture',
    title: {
      en: 'Physical Strain, Walking, or Long Sitting',
      hi: 'शारीरिक परिश्रम, चलना या लंबे समय तक बैठना',
      mr: 'शारीरिक श्रम, चालणे किंवा जास्त वेळ बसणे',
      gu: 'શારીરિક શ્રમ, ચાલવું કે લાંબા સમય સુધી બેસવું',
      bn: 'শারীরিক পরিশ্রম, হাঁটা বা দীর্ঘক্ষণ বসে থাকা',
      ta: 'உடல் உழைப்பு, நடப்பது அல்லது நீண்ட நேரம் உட்காருதல்',
    },
    desc: {
      en: 'Noticed during lifting, bending, prolonged standing, or travel',
      hi: 'वजन उठाने, चलने या यात्रा करने के बाद',
      mr: 'वजन उचलणे, चालणे किंवा प्रवासादरम्यान',
      gu: 'વજન ઊંચકવા કે મુસાફરી પછી',
      bn: 'ভারী কাজ, হাঁটা বা ভ্রমণের পর',
      ta: 'எடை தூக்குதல், நடப்பது அல்லது பயணத்தின் போது',
    },
  },
  {
    id: 'weather_cold',
    title: {
      en: 'Cold Weather or Temperature Changes',
      hi: 'ठंडा मौसम या तापमान में बदलाव',
      mr: 'थंड हवामान किंवा तापमानातील बदल',
      gu: 'ઠંડુ વાતાવરણ અથવા ઋતુ બદલાવ',
      bn: 'ঠান্ডা আবহাওয়া বা তাপমাত্রার পরিবর্তন',
      ta: 'குளிர்ந்த வானிலை அல்லது வெப்பநிலை மாற்றம்',
    },
    desc: {
      en: 'Noticed during cold mornings, rainy weather, or AC draft',
      hi: 'ठंड या बारिश के मौसम में अधिक महसूस होता है',
      mr: 'गारव्यात किंवा पावसाळ्यात जास्त जाणवतो',
      gu: 'ઠંડી કે વરસાદમાં વધુ અનુભવાય છે',
      bn: 'ঠান্ডা বা বৃষ্টির দিনে বেশি অনুভূত হয়',
      ta: 'குளிர் அல்லது மழைக்காலத்தில் அதிகம் உணரப்படுகிறது',
    },
  },
  {
    id: 'no_specific_pattern',
    title: {
      en: 'No Specific Pattern',
      hi: 'कोई निश्चित कारण नहीं दिखता',
      mr: 'कोणतेही विशिष्ट कारण दिसत नाही',
      gu: 'કોઈ ચોક્કસ પેટર્ન દેખાતી નથી',
      bn: 'কোনো নির্দিষ্ট কারণ বোঝা যায় না',
      ta: 'குறிப்பிட்ட காரணம் எதுவும் தெரியவில்லை',
    },
    desc: {
      en: 'Occurs without any clear trigger',
      hi: 'बिना किसी स्पष्ट कारण के होता है',
      mr: 'कोणत्याही स्पष्ट कारणाशिवाय होतो',
      gu: 'કોઈ સ્પષ્ટ કારણ વિના થાય છે',
      bn: 'কোনো সুস্পষ্ট কারণ ছাড়াই হয়',
      ta: 'தெளிவான காரணமின்றி ஏற்படுகிறது',
    },
  },
  {
    id: 'prefer_not_to_say',
    title: {
      en: 'Prefer Not to Say',
      hi: 'बताना नहीं चाहते',
      mr: 'सांगू इच्छित नाही',
      gu: 'કહેવા માંગતા નથી',
      bn: 'বলতে চাই না',
      ta: 'கூற விரும்பவில்லை',
    },
    desc: {
      en: 'Skip this question and proceed',
      hi: 'इस प्रश्न को छोड़ें और आगे बढ़ें',
      mr: 'हा प्रश्न वगळून पुढे जा',
      gu: 'આ પ્રશ્ન છોડીને આગળ વધો',
      bn: 'এই প্রশ্নটি এড়িয়ে এগিয়ে যান',
      ta: 'இந்தக் கேள்வியைத் தவிர்த்து தொடரவும்',
    },
  },
]

// ── 4. HELPER RESOLVERS ──

export function getContextualQuestionsForSelections(
  selectedRegionIds: BodyRegionId[],
  activeCategoryIds: SymptomCategoryId[]
): ContextualQuestion[] {
  const matched = new Set<ContextualQuestion>()

  for (const catId of activeCategoryIds) {
    const q = CONTEXTUAL_QUESTIONS_CATALOG.find((item) => item.categoryId === catId)
    if (q) matched.add(q)
  }

  for (const rId of selectedRegionIds) {
    for (const q of CONTEXTUAL_QUESTIONS_CATALOG) {
      if (q.applicableRegions?.includes(rId)) {
        matched.add(q)
      }
    }
  }

  if (matched.size === 0) {
    const defaultQ = CONTEXTUAL_QUESTIONS_CATALOG.find((q) => q.categoryId === 'chest_breathing')
    if (defaultQ) matched.add(defaultQ)
  }

  return Array.from(matched)
}

export function getLocalizedQuestion(
  question: ContextualQuestion,
  lang: SupportedKioskLanguage
): { title: string; subtitle: string } {
  return question.translations[lang] || question.translations.en || {
    title: question.title,
    subtitle: question.subtitle,
  }
}

export function getLocalizedOption(
  option: QuestionOption,
  lang: SupportedKioskLanguage
): { label: string; description?: string } {
  return option.translations[lang] || option.translations.en || {
    label: option.label,
    description: option.description,
  }
}
