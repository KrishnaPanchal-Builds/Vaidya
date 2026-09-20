/**
 * Vaidya Patient Kiosk — Anatomical Body Regions & Diagram Translations
 *
 * Full multi-language dictionary for all 38 anatomical body regions, views,
 * orientation labels, and selection panel strings across 6 languages:
 * 'en' (English), 'hi' (Hindi), 'mr' (Marathi), 'gu' (Gujarati), 'bn' (Bengali), 'ta' (Tamil).
 */

import type { SupportedKioskLanguage } from './kiosk-translations'
import type { BodyRegionId, SymptomCategoryId } from '@/components/kiosk/body-map/types'

export interface BodyRegionTranslation {
  label: string
  parentRegion?: string
}

export const BODY_REGION_TRANSLATIONS: Record<
  BodyRegionId,
  Record<SupportedKioskLanguage, BodyRegionTranslation>
> = {
  // ── Head & Face ──
  head: {
    en: { label: 'Head', parentRegion: 'Head' },
    hi: { label: 'सिर', parentRegion: 'सिर' },
    mr: { label: 'डोके', parentRegion: 'डोके' },
    gu: { label: 'માથું', parentRegion: 'માથું' },
    bn: { label: 'মাথা', parentRegion: 'মাথা' },
    ta: { label: 'தலை', parentRegion: 'தலை' },
  },
  eyes: {
    en: { label: 'Eyes', parentRegion: 'Face' },
    hi: { label: 'आँखें', parentRegion: 'चेहरा' },
    mr: { label: 'डोळे', parentRegion: 'चेहरा' },
    gu: { label: 'આંખો', parentRegion: 'ચહેરો' },
    bn: { label: 'চোখ', parentRegion: 'মুখ' },
    ta: { label: 'கண்கள்', parentRegion: 'முகம்' },
  },
  face: {
    en: { label: 'Face', parentRegion: 'Head' },
    hi: { label: 'चेहरा', parentRegion: 'सिर' },
    mr: { label: 'चेहरा', parentRegion: 'डोके' },
    gu: { label: 'ચહેરો', parentRegion: 'માથું' },
    bn: { label: 'মুখমণ্ডল', parentRegion: 'মাথা' },
    ta: { label: 'முகம்', parentRegion: 'தலை' },
  },
  neck: {
    en: { label: 'Neck', parentRegion: 'Neck' },
    hi: { label: 'गर्दन', parentRegion: 'गर्दन' },
    mr: { label: 'मान', parentRegion: 'मान' },
    gu: { label: 'ગરદન', parentRegion: 'ગરદન' },
    bn: { label: 'ঘাড়', parentRegion: 'ঘাড়' },
    ta: { label: 'கழுத்து', parentRegion: 'கழுத்து' },
  },

  // ── Torso & Abdomen ──
  chest: {
    en: { label: 'Chest', parentRegion: 'Torso' },
    hi: { label: 'छाती', parentRegion: 'धड़' },
    mr: { label: 'छाती', parentRegion: 'धड' },
    gu: { label: 'છાતી', parentRegion: 'ધડ' },
    bn: { label: 'বুক', parentRegion: 'ধড়' },
    ta: { label: 'மார்பு', parentRegion: 'உடல்' },
  },
  upper_abdomen: {
    en: { label: 'Upper Abdomen', parentRegion: 'Abdomen' },
    hi: { label: 'ऊपरी पेट', parentRegion: 'पेट' },
    mr: { label: 'वरचे पोट', parentRegion: 'पोट' },
    gu: { label: 'ઉપરનું પેટ', parentRegion: 'પેટ' },
    bn: { label: 'উপরের পেট', parentRegion: 'পেট' },
    ta: { label: 'மேல் வயிறு', parentRegion: 'வயிறு' },
  },
  stomach: {
    en: { label: 'Stomach / Belly', parentRegion: 'Abdomen' },
    hi: { label: 'पेट', parentRegion: 'पेट' },
    mr: { label: 'पोट', parentRegion: 'पोट' },
    gu: { label: 'પેટ', parentRegion: 'પેટ' },
    bn: { label: 'পেট', parentRegion: 'পেট' },
    ta: { label: 'வயிறு', parentRegion: 'வயிறு' },
  },
  lower_abdomen: {
    en: { label: 'Lower Abdomen', parentRegion: 'Abdomen' },
    hi: { label: 'निचला पेट', parentRegion: 'पेट' },
    mr: { label: 'खालचे पोट', parentRegion: 'पोट' },
    gu: { label: 'નીચલું પેટ', parentRegion: 'પેટ' },
    bn: { label: 'তলপেট', parentRegion: 'পেট' },
    ta: { label: 'அடிவயிறு', parentRegion: 'வயிறு' },
  },

  // ── Back & Spine ──
  upper_back: {
    en: { label: 'Upper Back', parentRegion: 'Back' },
    hi: { label: 'ऊपरी पीठ', parentRegion: 'पीठ' },
    mr: { label: 'पाठीचा वरचा भाग', parentRegion: 'पाठ' },
    gu: { label: 'પીઠનો ઉપરનો ભાગ', parentRegion: 'પીઠ' },
    bn: { label: 'পিঠের উপরের অংশ', parentRegion: 'পিঠ' },
    ta: { label: 'மேல் முதுகு', parentRegion: 'முதுகு' },
  },
  spine: {
    en: { label: 'Spine', parentRegion: 'Back' },
    hi: { label: 'रीढ़ की हड्डी', parentRegion: 'पीठ' },
    mr: { label: 'पाठीचा कणा', parentRegion: 'पाठ' },
    gu: { label: 'કરોડરજ્જુ', parentRegion: 'પીઠ' },
    bn: { label: 'মেরুদণ্ড', parentRegion: 'পিঠ' },
    ta: { label: 'முதுகெலும்பு', parentRegion: 'முதுகு' },
  },
  lower_back: {
    en: { label: 'Lower Back', parentRegion: 'Back' },
    hi: { label: 'कमर / निचली पीठ', parentRegion: 'पीठ' },
    mr: { label: 'कंबर / खालची पाठ', parentRegion: 'पाठ' },
    gu: { label: 'કમર', parentRegion: 'પીઠ' },
    bn: { label: 'কোমর / পিঠের নিচের অংশ', parentRegion: 'পিঠ' },
    ta: { label: 'கீழ் முதுகு / இடுப்பு', parentRegion: 'முதுகு' },
  },

  // ── Left Arm ──
  left_shoulder: {
    en: { label: 'Left Shoulder', parentRegion: 'Left Arm' },
    hi: { label: 'बायां कंधा', parentRegion: 'बायां हाथ' },
    mr: { label: 'डावा खांदा', parentRegion: 'डावा हात' },
    gu: { label: 'ડાબો ખભો', parentRegion: 'ડાબો હાથ' },
    bn: { label: 'বাঁ কাঁধ', parentRegion: 'বাঁ হাত' },
    ta: { label: 'இடது தோள்பட்டை', parentRegion: 'இடது கை' },
  },
  left_upper_arm: {
    en: { label: 'Left Upper Arm', parentRegion: 'Left Arm' },
    hi: { label: 'बाईं भुजा', parentRegion: 'बायां हाथ' },
    mr: { label: 'डावा दंड', parentRegion: 'डावा हात' },
    gu: { label: 'ડાબો હાથ (ઉપર)', parentRegion: 'ડાબો હાથ' },
    bn: { label: 'বাঁ বাহু', parentRegion: 'বাঁ হাত' },
    ta: { label: 'இடது மேல் கை', parentRegion: 'இடது கை' },
  },
  left_elbow: {
    en: { label: 'Left Elbow', parentRegion: 'Left Arm' },
    hi: { label: 'बाईं कोहनी', parentRegion: 'बायां हाथ' },
    mr: { label: 'डावा कोपर', parentRegion: 'डावा हात' },
    gu: { label: 'ડાબી કોણી', parentRegion: 'ડાબો હાથ' },
    bn: { label: 'বাঁ কনুই', parentRegion: 'বাঁ হাত' },
    ta: { label: 'இடது முழங்கை', parentRegion: 'இடது கை' },
  },
  left_forearm: {
    en: { label: 'Left Forearm', parentRegion: 'Left Arm' },
    hi: { label: 'बाईं कलाई के ऊपर', parentRegion: 'बायां हाथ' },
    mr: { label: 'डावा पुढचा हात', parentRegion: 'डावा हात' },
    gu: { label: 'ડાબો આગળનો હાથ', parentRegion: 'ડાબો હાથ' },
    bn: { label: 'বাঁ প্রকোষ্ঠ', parentRegion: 'বাঁ হাত' },
    ta: { label: 'இடது முன் கை', parentRegion: 'இடது கை' },
  },
  left_wrist: {
    en: { label: 'Left Wrist', parentRegion: 'Left Arm' },
    hi: { label: 'बाईं कलाई', parentRegion: 'बायां हाथ' },
    mr: { label: 'डावा मनगट', parentRegion: 'डावा हात' },
    gu: { label: 'ડાબું કાંડું', parentRegion: 'ડાબો હાથ' },
    bn: { label: 'বাঁ কব্জি', parentRegion: 'বাঁ হাত' },
    ta: { label: 'இடது மணிக்கட்டு', parentRegion: 'இடது கை' },
  },
  left_hand: {
    en: { label: 'Left Hand', parentRegion: 'Left Arm' },
    hi: { label: 'बायां हाथ / हथेली', parentRegion: 'बायां हाथ' },
    mr: { label: 'डावा हात / तळहात', parentRegion: 'डावा हात' },
    gu: { label: 'ડાબો હાથ', parentRegion: 'ડાબો હાથ' },
    bn: { label: 'বাঁ হাত / তালু', parentRegion: 'বাঁ হাত' },
    ta: { label: 'இடது கை', parentRegion: 'இடது கை' },
  },

  // ── Right Arm ──
  right_shoulder: {
    en: { label: 'Right Shoulder', parentRegion: 'Right Arm' },
    hi: { label: 'दायां कंधा', parentRegion: 'दायां हाथ' },
    mr: { label: 'उजवा खांदा', parentRegion: 'उजवा हात' },
    gu: { label: 'જમણો ખભો', parentRegion: 'જમણો હાથ' },
    bn: { label: 'ডান কাঁধ', parentRegion: 'ডান হাত' },
    ta: { label: 'வலது தோள்பட்டை', parentRegion: 'வலது கை' },
  },
  right_upper_arm: {
    en: { label: 'Right Upper Arm', parentRegion: 'Right Arm' },
    hi: { label: 'दाईं भुजा', parentRegion: 'दायां हाथ' },
    mr: { label: 'उजवा दंड', parentRegion: 'उजवा हात' },
    gu: { label: 'જમણો હાથ (ઉપર)', parentRegion: 'જમણો હાથ' },
    bn: { label: 'ডান বাহু', parentRegion: 'ডান হাত' },
    ta: { label: 'வலது மேல் கை', parentRegion: 'வலது கை' },
  },
  right_elbow: {
    en: { label: 'Right Elbow', parentRegion: 'Right Arm' },
    hi: { label: 'दाईं कोहनी', parentRegion: 'दायां हाथ' },
    mr: { label: 'उजवा कोपर', parentRegion: 'उजवा हात' },
    gu: { label: 'જમણી કોણી', parentRegion: 'જમણો હાથ' },
    bn: { label: 'ডান কনুই', parentRegion: 'ডান হাত' },
    ta: { label: 'வலது முழங்கை', parentRegion: 'வலது கை' },
  },
  right_forearm: {
    en: { label: 'Right Forearm', parentRegion: 'Right Arm' },
    hi: { label: 'दाईं कलाई के ऊपर', parentRegion: 'दायां हाथ' },
    mr: { label: 'उजवा पुढचा हात', parentRegion: 'उजवा हात' },
    gu: { label: 'જમણો આગળનો હાથ', parentRegion: 'જમણો હાથ' },
    bn: { label: 'ডান প্রকোষ্ঠ', parentRegion: 'ডান হাত' },
    ta: { label: 'வலது முன் கை', parentRegion: 'வலது கை' },
  },
  right_wrist: {
    en: { label: 'Right Wrist', parentRegion: 'Right Arm' },
    hi: { label: 'दाईं कलाई', parentRegion: 'दायां हाथ' },
    mr: { label: 'उजवा मनगट', parentRegion: 'उजवा हात' },
    gu: { label: 'જમણું કાંડું', parentRegion: 'જમણો હાથ' },
    bn: { label: 'ডান কব্জি', parentRegion: 'ডান হাত' },
    ta: { label: 'வலது மணிக்கட்டு', parentRegion: 'வலது கை' },
  },
  right_hand: {
    en: { label: 'Right Hand', parentRegion: 'Right Arm' },
    hi: { label: 'दायां हाथ / हथेली', parentRegion: 'दायां हाथ' },
    mr: { label: 'उजवा हात / तळहात', parentRegion: 'उजवा हात' },
    gu: { label: 'જમણો હાથ', parentRegion: 'જમણો હાથ' },
    bn: { label: 'ডান হাত / তালু', parentRegion: 'ডান হাত' },
    ta: { label: 'வலது கை', parentRegion: 'வலது கை' },
  },

  // ── Pelvis & Hips ──
  pelvis: {
    en: { label: 'Pelvis / Groin', parentRegion: 'Pelvis' },
    hi: { label: 'पेल्विस / कमर का निचला भाग', parentRegion: 'पेल्विस' },
    mr: { label: 'श्रोणि / ओटीपोट', parentRegion: 'श्रोणि' },
    gu: { label: 'પેલ્વિસ', parentRegion: 'પેલ્વિસ' },
    bn: { label: 'শ্রোণীদেশ', parentRegion: 'শ্রোণীদেশ' },
    ta: { label: 'இடுப்பு பகுதி', parentRegion: 'இடுப்பு பகுதி' },
  },
  left_hip: {
    en: { label: 'Left Hip', parentRegion: 'Hips' },
    hi: { label: 'बायां कूल्हा', parentRegion: 'कूल्हा' },
    mr: { label: 'डावा नितंब / कंबर', parentRegion: 'नितंब' },
    gu: { label: 'ડાબો થાપો', parentRegion: 'થાપો' },
    bn: { label: 'বাঁ নিতম্ব', parentRegion: 'নিতম্ব' },
    ta: { label: 'இடது இடுப்பு மூட்டு', parentRegion: 'இடுப்பு' },
  },
  right_hip: {
    en: { label: 'Right Hip', parentRegion: 'Hips' },
    hi: { label: 'दायां कूल्हा', parentRegion: 'कूल्हा' },
    mr: { label: 'उजवा नितंब / कंबर', parentRegion: 'नितंब' },
    gu: { label: 'જમણો થાપો', parentRegion: 'થાપો' },
    bn: { label: 'ডান নিতম্ব', parentRegion: 'ডান নিতম্ব' },
    ta: { label: 'வலது இடுப்பு மூட்டு', parentRegion: 'இடுப்பு' },
  },

  // ── Left Leg ──
  left_thigh: {
    en: { label: 'Left Thigh', parentRegion: 'Left Leg' },
    hi: { label: 'बाईं जांघ', parentRegion: 'बायां पैर' },
    mr: { label: 'डावी मांडी', parentRegion: 'डावा पाय' },
    gu: { label: 'ડાબી સાથળ', parentRegion: 'ડાબો પગ' },
    bn: { label: 'বাঁ উরু', parentRegion: 'বাঁ পা' },
    ta: { label: 'இடது தொடை', parentRegion: 'இடது கால்' },
  },
  left_knee: {
    en: { label: 'Left Knee', parentRegion: 'Left Leg' },
    hi: { label: 'बायां घुटना', parentRegion: 'बायां पैर' },
    mr: { label: 'डावा गुडघा', parentRegion: 'डावा पाय' },
    gu: { label: 'ડાબો ઢીંચણ', parentRegion: 'ડાબો પગ' },
    bn: { label: 'বাঁ হাঁটু', parentRegion: 'বাঁ পা' },
    ta: { label: 'இடது முழங்கால்', parentRegion: 'இடது கால்' },
  },
  left_calf: {
    en: { label: 'Left Calf / Shin', parentRegion: 'Left Leg' },
    hi: { label: 'बाईं पिंडली', parentRegion: 'बायां पैर' },
    mr: { label: 'डावी पोटरी', parentRegion: 'डावा पाय' },
    gu: { label: 'ડાબી પિંડી', parentRegion: 'ડાબો પગ' },
    bn: { label: 'বাঁ পায়ের ডিম', parentRegion: 'বাঁ পা' },
    ta: { label: 'இடது கணுக்கால் தசை', parentRegion: 'இடது கால்' },
  },
  left_ankle: {
    en: { label: 'Left Ankle', parentRegion: 'Left Leg' },
    hi: { label: 'बायां टखना', parentRegion: 'बायां पैर' },
    mr: { label: 'डावा घोटा', parentRegion: 'डावा पाय' },
    gu: { label: 'ડાબી ઘૂંટી', parentRegion: 'ડાબો પગ' },
    bn: { label: 'বাঁ গোড়ালি', parentRegion: 'বাঁ পা' },
    ta: { label: 'இடது கணுக்கால்', parentRegion: 'இடது கால்' },
  },
  left_foot: {
    en: { label: 'Left Foot', parentRegion: 'Left Leg' },
    hi: { label: 'बायां पैर / पंजा', parentRegion: 'बायां पैर' },
    mr: { label: 'डावा पाय / पाऊल', parentRegion: 'डावा पाय' },
    gu: { label: 'ડાબો પગ', parentRegion: 'ડાબો પગ' },
    bn: { label: 'বাঁ পা / পায়ের পাতা', parentRegion: 'বাঁ পা' },
    ta: { label: 'இடது பாதம்', parentRegion: 'இடது கால்' },
  },

  // ── Right Leg ──
  right_thigh: {
    en: { label: 'Right Thigh', parentRegion: 'Right Leg' },
    hi: { label: 'दाईं जांघ', parentRegion: 'दायां पैर' },
    mr: { label: 'उजवी मांडी', parentRegion: 'उजवा पाय' },
    gu: { label: 'જમણી સાથળ', parentRegion: 'જમણો પગ' },
    bn: { label: 'ডান উরু', parentRegion: 'ডান পা' },
    ta: { label: 'வலது தொடை', parentRegion: 'வலது கால்' },
  },
  right_knee: {
    en: { label: 'Right Knee', parentRegion: 'Right Leg' },
    hi: { label: 'दायां घुटना', parentRegion: 'दायां पैर' },
    mr: { label: 'उजवा गुडघा', parentRegion: 'उजवा पाय' },
    gu: { label: 'જમણો ઢીંચણ', parentRegion: 'જમણો પગ' },
    bn: { label: 'ডান হাঁটু', parentRegion: 'ডান পা' },
    ta: { label: 'வலது முழங்கால்', parentRegion: 'வலது கால்' },
  },
  right_calf: {
    en: { label: 'Right Calf / Shin', parentRegion: 'Right Leg' },
    hi: { label: 'दाईं पिंडली', parentRegion: 'दायां पैर' },
    mr: { label: 'उजवी पोटरी', parentRegion: 'उजवा पाय' },
    gu: { label: 'જમણી પિંડી', parentRegion: 'જમણો પગ' },
    bn: { label: 'ডান পায়ের ডিম', parentRegion: 'ডান পা' },
    ta: { label: 'வலது கணுக்கால் தசை', parentRegion: 'வலது கால்' },
  },
  right_ankle: {
    en: { label: 'Right Ankle', parentRegion: 'Right Leg' },
    hi: { label: 'दायां टखना', parentRegion: 'दायां पैर' },
    mr: { label: 'उजवा घोटा', parentRegion: 'उजवा पाय' },
    gu: { label: 'જમણી ઘૂંટી', parentRegion: 'જમણો પગ' },
    bn: { label: 'ডান গোড়ালি', parentRegion: 'ডান পা' },
    ta: { label: 'வலது கணுக்கால்', parentRegion: 'வலது கால்' },
  },
  right_foot: {
    en: { label: 'Right Foot', parentRegion: 'Right Leg' },
    hi: { label: 'दायां पैर / पंजा', parentRegion: 'दायां पैर' },
    mr: { label: 'उजवा पाय / पाऊल', parentRegion: 'उजवा पाय' },
    gu: { label: 'જમણો પગ', parentRegion: 'જમણો પગ' },
    bn: { label: 'ডান পা / পায়ের পাতা', parentRegion: 'ডান পা' },
    ta: { label: 'வலது பாதம்', parentRegion: 'வலது கால்' },
  },

  // ── Systemic / General ──
  fever_general: {
    en: { label: 'Fever / Whole Body', parentRegion: 'Systemic' },
    hi: { label: 'बुखार / पूरा शरीर', parentRegion: 'पूरा शरीर' },
    mr: { label: 'ताप / संपूर्ण शरीर', parentRegion: 'संपूर्ण शरीर' },
    gu: { label: 'તાવ / આખું શરીર', parentRegion: 'આખું શરીર' },
    bn: { label: 'জ্বর / সমগ্র শরীর', parentRegion: 'সমগ্র শরীর' },
    ta: { label: 'காய்ச்சல் / முழு உடல்', parentRegion: 'முழு உடல்' },
  },
  other_general: {
    en: { label: 'Other / Not Listed', parentRegion: 'General' },
    hi: { label: 'अन्य लक्षण', parentRegion: 'सामान्य' },
    mr: { label: 'इतर लक्षणे', parentRegion: 'सामान्य' },
    gu: { label: 'અન્ય લક્ષણો', parentRegion: 'સામાન્ય' },
    bn: { label: 'অন্যান্য উপসর্গ', parentRegion: 'সাধারণ' },
    ta: { label: 'பிற அறிகுறிகள்', parentRegion: 'பொதுவானது' },
  },
}

// ── UI Strings for Body Diagram & Controls ──
export interface BodyDiagramUIStrings {
  frontView: string
  backView: string
  sideView: string
  anteriorSub: string
  posteriorSub: string
  lateralSub: string
  regionsCount: (count: number) => string
  tapToSelectInstruction: string
  resetView: string
  selectedAreasTitle: string
  clearAll: string
  emptySelectionText: string
  helperText: string
  showMore: (count: number) => string
  showLess: string
  viewModeDiagram: string
  viewModeList: string
  listViewTitle: string
  listViewSubtitle: string
  continueBtn: string
}

export const BODY_DIAGRAM_UI_TRANSLATIONS: Record<
  SupportedKioskLanguage,
  BodyDiagramUIStrings
> = {
  en: {
    frontView: 'Front View',
    backView: 'Back View',
    sideView: 'Side View',
    anteriorSub: 'Anterior',
    posteriorSub: 'Posterior',
    lateralSub: 'Lateral',
    regionsCount: (c) => `(${c} regions)`,
    tapToSelectInstruction: 'Tap a body area to select',
    resetView: 'Reset',
    selectedAreasTitle: 'Selected Areas',
    clearAll: 'Clear All',
    emptySelectionText: 'Your selected areas appear here',
    helperText: 'You can select more than one area.',
    showMore: (c) => `+${c} more`,
    showLess: 'Show less',
    viewModeDiagram: 'Body Map',
    viewModeList: 'List View',
    listViewTitle: 'Select Body Areas by List',
    listViewSubtitle: 'Tap any body region or symptom category to select',
    continueBtn: 'Continue to Symptoms',
  },
  hi: {
    frontView: 'सामने का दृश्य',
    backView: 'पीछे का दृश्य',
    sideView: 'बगल का दृश्य',
    anteriorSub: 'आगे',
    posteriorSub: 'पीछे',
    lateralSub: 'बगल',
    regionsCount: (c) => `(${c} भाग)`,
    tapToSelectInstruction: 'शरीर के प्रभावित हिस्से पर छुएं',
    resetView: 'रीसेट',
    selectedAreasTitle: 'चुने गए हिस्से',
    clearAll: 'सभी हटाएं',
    emptySelectionText: 'आपके चुने हुए हिस्से यहाँ दिखेंगे',
    helperText: 'आप एक से अधिक हिस्से चुन सकते हैं।',
    showMore: (c) => `+${c} और`,
    showLess: 'कम दिखाएं',
    viewModeDiagram: 'शरीर का नक्शा',
    viewModeList: 'सूची देखें',
    listViewTitle: 'सूची से शरीर के हिस्से चुनें',
    listViewSubtitle: 'चुनने के लिए किसी भी हिस्से या लक्षण को छुएं',
    continueBtn: 'लक्षणों पर आगे बढ़ें',
  },
  mr: {
    frontView: 'समोरील दृश्य',
    backView: 'मागील दृश्य',
    sideView: 'बाजूचे दृश्य',
    anteriorSub: 'समोर',
    posteriorSub: 'मागे',
    lateralSub: 'बाजू',
    regionsCount: (c) => `(${c} भाग)`,
    tapToSelectInstruction: 'त्रास असलेल्या भागावर स्पर्श करा',
    resetView: 'पूर्ववत करा',
    selectedAreasTitle: 'निवडलेले भाग',
    clearAll: 'सर्व काढा',
    emptySelectionText: 'तुम्ही निवडलेले भाग येथे दिसतील',
    helperText: 'तुम्ही एकापेक्षा जास्त भाग निवडू शकता.',
    showMore: (c) => `+${c} अधिक`,
    showLess: 'कमी दाखवा',
    viewModeDiagram: 'शरीर नकाशा',
    viewModeList: 'यादी पहा',
    listViewTitle: 'यादीतून शरीराचे भाग निवडा',
    listViewSubtitle: 'निवडण्यासाठी शरीराच्या भागावर स्पर्श करा',
    continueBtn: 'पुढील लक्षणांवर जा',
  },
  gu: {
    frontView: 'આગળનો ભાગ',
    backView: 'પાછળનો ભાગ',
    sideView: 'બાજુનો ભાગ',
    anteriorSub: 'આગળ',
    posteriorSub: 'પાછળ',
    lateralSub: 'બાજુ',
    regionsCount: (c) => `(${c} વિસ્તારો)`,
    tapToSelectInstruction: 'શરીરના અસરગ્રસ્ત ભાગ પર સ્પર્શ કરો',
    resetView: 'રીસેટ',
    selectedAreasTitle: 'પસંદ કરેલા ભાગો',
    clearAll: 'બધું કાઢી નાખો',
    emptySelectionText: 'તમારા પસંદ કરેલા ભાગો અહીં દેખાશે',
    helperText: 'તમે એક કરતાં વધુ ભાગ પસંદ કરી શકો છો.',
    showMore: (c) => `+${c} વધુ`,
    showLess: 'ઓછું બતાવો',
    viewModeDiagram: 'શરીર નકશો',
    viewModeList: 'યાદી જુઓ',
    listViewTitle: 'યાદીમાંથી શરીરના ભાગો પસંદ કરો',
    listViewSubtitle: 'પસંદ કરવા માટે કોઈપણ ભાગ પર સ્પર્શ કરો',
    continueBtn: 'લક્ષણો તરફ આગળ વધો',
  },
  bn: {
    frontView: 'সামনের দৃশ্য',
    backView: 'পেছনের দৃশ্য',
    sideView: 'পাশের দৃশ্য',
    anteriorSub: 'সামনে',
    posteriorSub: 'পেছনে',
    lateralSub: 'পাশে',
    regionsCount: (c) => `(${c} টি অঞ্চল)`,
    tapToSelectInstruction: 'শরীরের আক্রান্ত অংশে স্পর্শ করুন',
    resetView: 'রিসেট',
    selectedAreasTitle: 'নির্বাচিত অঞ্চলসমূহ',
    clearAll: 'সব মুছুন',
    emptySelectionText: 'আপনার নির্বাচিত অংশগুলি এখানে দেখাবে',
    helperText: 'আপনি একাধিক অংশ নির্বাচন করতে পারেন।',
    showMore: (c) => `+${c} আরও`,
    showLess: 'কম দেখান',
    viewModeDiagram: 'শরীরের মানচিত্র',
    viewModeList: 'তালিকা দেখুন',
    listViewTitle: 'তালিকা থেকে শরীরের অংশ নির্বাচন করুন',
    listViewSubtitle: 'নির্বাচন করতে যেকোনো অংশে স্পর্শ করুন',
    continueBtn: 'লক্ষণগুলিতে এগিয়ে যান',
  },
  ta: {
    frontView: 'முன் தோற்றம்',
    backView: 'பின் தோற்றம்',
    sideView: 'பக்கவாட்டு தோற்றம்',
    anteriorSub: 'முன்புறம்',
    posteriorSub: 'பின்புறம்',
    lateralSub: 'பக்கவாட்டு',
    regionsCount: (c) => `(${c} பகுதிகள்)`,
    tapToSelectInstruction: 'பாதிக்கப்பட்ட உடற்பகுதியைத் தொடவும்',
    resetView: 'மீட்டமை',
    selectedAreasTitle: 'தேர்ந்தெடுக்கப்பட்ட பகுதிகள்',
    clearAll: 'அனைத்தையும் நீக்கு',
    emptySelectionText: 'நீங்கள் தேர்ந்தெடுத்த பகுதிகள் இங்கே தோன்றும்',
    helperText: 'ஒன்றுக்கும் மேற்பட்ட பகுதிகளைத் தேர்ந்தெடுக்கலாம்.',
    showMore: (c) => `+${c} மேலும்`,
    showLess: 'குறைவாகக் காட்டு',
    viewModeDiagram: 'உடல் வரைபடம்',
    viewModeList: 'பட்டியல் காட்சி',
    listViewTitle: 'பட்டியலிலிருந்து உடல் பகுதிகளைத் தேர்ந்தெடுக்கவும்',
    listViewSubtitle: 'தேர்ந்தெடுக்க ஏதேனும் ஒரு பகுதியைத் தொடவும்',
    continueBtn: 'அறிகுறிகளுக்கு தொடரவும்',
  },
}

/**
 * Localized Symptom Categories for 3x3 Grid
 */
export const SYMPTOM_CATEGORY_TRANSLATIONS: Record<
  SymptomCategoryId,
  Record<SupportedKioskLanguage, { label: string; sublabel: string }>
> = {
  chest_breathing: {
    en: { label: 'Chest & Breathing', sublabel: 'Chest, lungs, breath' },
    hi: { label: 'छाती और सांस', sublabel: 'छाती, फेफड़े, सांस' },
    mr: { label: 'छाती आणि श्वास', sublabel: 'छाती, फुफ्फुस, श्वास' },
    gu: { label: 'છાતી અને શ્વાસ', sublabel: 'છાતી, ફેફસાં, શ્વાસ' },
    bn: { label: 'বুক ও শ্বাসপ্রশ্বাস', sublabel: 'বুক, ফুসফুস, শ্বাস' },
    ta: { label: 'மார்பு & சுவாசம்', sublabel: 'மார்பு, நுரையீரல்' },
  },
  head_eyes: {
    en: { label: 'Head, Eyes & Throat', sublabel: 'Head, face, eyes, neck' },
    hi: { label: 'सिर, आँख और गला', sublabel: 'सिर, चेहरा, आँखें' },
    mr: { label: 'डोके, डोळे आणि घसा', sublabel: 'डोके, चेहरा, मान' },
    gu: { label: 'માથું, આંખ અને ગળું', sublabel: 'માથું, ચહેરો, ગળું' },
    bn: { label: 'মাথা, চোখ ও গলা', sublabel: 'মাথা, মুখ, গলা' },
    ta: { label: 'தலை, கண் & தொண்டை', sublabel: 'தலை, முகம், கண்கள்' },
  },
  stomach_digestion: {
    en: { label: 'Stomach & Digestion', sublabel: 'Abdomen, bowel, nausea' },
    hi: { label: 'पेट और पाचन', sublabel: 'पेट, गैस, अपच' },
    mr: { label: 'पोट आणि पचन', sublabel: 'पोट, गॅस, अपचन' },
    gu: { label: 'પેટ અને પાચન', sublabel: 'પેટ, પાચન, અપચો' },
    bn: { label: 'পেট ও পরিপাক', sublabel: 'পেট, গ্যাস, হজম' },
    ta: { label: 'வயிறு & செரிமானம்', sublabel: 'வயிறு, அஜீரணம்' },
  },
  back_spine: {
    en: { label: 'Back & Spine', sublabel: 'Upper back, lower back' },
    hi: { label: 'पीठ और रीढ़', sublabel: 'ऊपरी पीठ, कमर' },
    mr: { label: 'पाठ आणि कणा', sublabel: 'पाठ, कंबर, कणा' },
    gu: { label: 'પીઠ અને કરોડરજ્જુ', sublabel: 'પીઠ, કમર' },
    bn: { label: 'পিঠ ও মেরুদণ্ড', sublabel: 'পিঠ, কোমর' },
    ta: { label: 'முதுகு & தண்டுவடம்', sublabel: 'மேல் முதுகு, இடுப்பு' },
  },
  arms_hands: {
    en: { label: 'Arms & Hands', sublabel: 'Shoulders, arms, hands' },
    hi: { label: 'हाथ और कंधे', sublabel: 'कंधे, बाहें, हाथ' },
    mr: { label: 'हात आणि खांदे', sublabel: 'खांदे, दंड, हात' },
    gu: { label: 'હાથ અને ખભા', sublabel: 'ખભા, હાથ, કાંડું' },
    bn: { label: 'হাত ও কাঁধ', sublabel: 'কাঁধ, বাহু, হাত' },
    ta: { label: 'கைகள் & தோள்கள்', sublabel: 'தோள்கள், கைகள்' },
  },
  legs_feet: {
    en: { label: 'Legs & Feet', sublabel: 'Thighs, calves, feet' },
    hi: { label: 'पैर और तलवे', sublabel: 'जांघें, पिंडलियां, पैर' },
    mr: { label: 'पाय आणि पावले', sublabel: 'मांडी, पोटरी, पाय' },
    gu: { label: 'પગ અને પાની', sublabel: 'સાથળ, પિંડી, પગ' },
    bn: { label: 'পা ও পায়ের পাতা', sublabel: 'উরু, ডিম, পা' },
    ta: { label: 'கால்கள் & பாதங்கள்', sublabel: 'தொடை, கணுக்கால்' },
  },
  joint_pain: {
    en: { label: 'Joints & Bones', sublabel: 'Knees, elbows, wrists' },
    hi: { label: 'जोड़ और हड्डियाँ', sublabel: 'घुटने, कोहनी, जोड़' },
    mr: { label: 'सांधे आणि हाडे', sublabel: 'गुडघे, कोपर, सांधे' },
    gu: { label: 'સાંધા અને હાડકાં', sublabel: 'ઢીંચણ, કોણી, સાંધા' },
    bn: { label: 'গাঁট ও হাড়', sublabel: 'হাঁটু, কনুই, গাঁট' },
    ta: { label: 'மூட்டுகள் & எலும்புகள்', sublabel: 'முழங்கால், மூட்டு' },
  },
  fever_infection: {
    en: { label: 'Fever & Infection', sublabel: 'Whole body, weakness' },
    hi: { label: 'बुखार और संक्रमण', sublabel: 'बुखार, थकान, कमजोरी' },
    mr: { label: 'ताप आणि संसर्ग', sublabel: 'ताप, अशक्तपणा' },
    gu: { label: 'તાવ અને ચેપ', sublabel: 'તાવ, અશક્તિ' },
    bn: { label: 'জ্বর ও সংক্রমণ', sublabel: 'জ্বর, দুর্বলতা' },
    ta: { label: 'காய்ச்சல் & தொற்று', sublabel: 'காய்ச்சல், பலவீனம்' },
  },
  other_symptoms: {
    en: { label: 'Other Symptoms', sublabel: 'General discomfort' },
    hi: { label: 'अन्य लक्षण', sublabel: 'अन्य कोई तकलीफ' },
    mr: { label: 'इतर लक्षणे', sublabel: 'इतर कोणताही त्रास' },
    gu: { label: 'અન્ય લક્ષણો', sublabel: 'અન્ય કોઈ તકલીફ' },
    bn: { label: 'অন্যান্য উপসর্গ', sublabel: 'অন্যান্য সমস্যা' },
    ta: { label: 'பிற அறிகுறிகள்', sublabel: 'பொதுவான அசௌகரியம்' },
  },
}

export function getLocalizedSymptomCategory(
  catId: SymptomCategoryId,
  language: SupportedKioskLanguage = 'en'
): { label: string; sublabel: string } {
  const safeLang = (language as SupportedKioskLanguage) || 'en'
  const record = SYMPTOM_CATEGORY_TRANSLATIONS[catId]
  if (record && record[safeLang]) {
    return record[safeLang]
  }
  return record?.en || { label: catId, sublabel: '' }
}

/**
 * Safely retrieve localized body region label
 */
export function getLocalizedBodyRegionLabel(
  regionId: BodyRegionId | string,
  language: SupportedKioskLanguage = 'en'
): string {
  const safeLang = (language as SupportedKioskLanguage) || 'en'
  const regionRecord = BODY_REGION_TRANSLATIONS[regionId as BodyRegionId]
  if (regionRecord && regionRecord[safeLang]?.label) {
    const raw = regionRecord[safeLang].label
    return safeLang !== 'en' ? raw.replace(/\s*\([A-Za-z\s/,\-']+\)/g, '').trim() : raw
  }
  // Fallback to English if available
  if (regionRecord?.en?.label) {
    return regionRecord.en.label
  }
  // Safe default formatting for unknown IDs
  return String(regionId).replace(/_/g, ' ')
}

/**
 * Safely retrieve localized body diagram UI strings
 */
export function getLocalizedBodyDiagramUI(
  language: SupportedKioskLanguage = 'en'
): BodyDiagramUIStrings {
  const safeLang = (language as SupportedKioskLanguage) || 'en'
  return BODY_DIAGRAM_UI_TRANSLATIONS[safeLang] || BODY_DIAGRAM_UI_TRANSLATIONS.en
}

