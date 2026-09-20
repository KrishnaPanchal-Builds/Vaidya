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
    hi: { label: 'सिर (Head)', parentRegion: 'सिर' },
    mr: { label: 'डोके (Head)', parentRegion: 'डोके' },
    gu: { label: 'માથું (Head)', parentRegion: 'માથું' },
    bn: { label: 'মাথা (Head)', parentRegion: 'মাথা' },
    ta: { label: 'தலை (Head)', parentRegion: 'தலை' },
  },
  eyes: {
    en: { label: 'Eyes', parentRegion: 'Face' },
    hi: { label: 'आँखें (Eyes)', parentRegion: 'चेहरा' },
    mr: { label: 'डोळे (Eyes)', parentRegion: 'चेहरा' },
    gu: { label: 'આંખો (Eyes)', parentRegion: 'ચહેરો' },
    bn: { label: 'চোখ (Eyes)', parentRegion: 'মুখ' },
    ta: { label: 'கண்கள் (Eyes)', parentRegion: 'முகம்' },
  },
  face: {
    en: { label: 'Face', parentRegion: 'Head' },
    hi: { label: 'चेहरा (Face)', parentRegion: 'सिर' },
    mr: { label: 'चेहरा (Face)', parentRegion: 'डोके' },
    gu: { label: 'ચહેરો (Face)', parentRegion: 'માથું' },
    bn: { label: 'মুখমণ্ডল (Face)', parentRegion: 'মাথা' },
    ta: { label: 'முகம் (Face)', parentRegion: 'தலை' },
  },
  neck: {
    en: { label: 'Neck', parentRegion: 'Neck' },
    hi: { label: 'गर्दन (Neck)', parentRegion: 'गर्दन' },
    mr: { label: 'मान (Neck)', parentRegion: 'मान' },
    gu: { label: 'ગરદન (Neck)', parentRegion: 'ગરદન' },
    bn: { label: 'ঘাড় (Neck)', parentRegion: 'ঘাড়' },
    ta: { label: 'கழுத்து (Neck)', parentRegion: 'கழுத்து' },
  },

  // ── Torso & Abdomen ──
  chest: {
    en: { label: 'Chest', parentRegion: 'Torso' },
    hi: { label: 'छाती (Chest)', parentRegion: 'धड़' },
    mr: { label: 'छाती (Chest)', parentRegion: 'धड' },
    gu: { label: 'છાતી (Chest)', parentRegion: 'ધડ' },
    bn: { label: 'বুক (Chest)', parentRegion: 'ধড়' },
    ta: { label: 'மார்பு (Chest)', parentRegion: 'உடல்' },
  },
  upper_abdomen: {
    en: { label: 'Upper Abdomen', parentRegion: 'Abdomen' },
    hi: { label: 'ऊपरी पेट (Upper Abdomen)', parentRegion: 'पेट' },
    mr: { label: 'वरचे पोट (Upper Abdomen)', parentRegion: 'पोट' },
    gu: { label: 'ઉપરનું પેટ (Upper Abdomen)', parentRegion: 'પેટ' },
    bn: { label: 'উপরের পেট (Upper Abdomen)', parentRegion: 'পেট' },
    ta: { label: 'மேல் வயிறு (Upper Abdomen)', parentRegion: 'வயிறு' },
  },
  stomach: {
    en: { label: 'Stomach / Belly', parentRegion: 'Abdomen' },
    hi: { label: 'पेट (Stomach)', parentRegion: 'पेट' },
    mr: { label: 'पोट (Stomach)', parentRegion: 'पोट' },
    gu: { label: 'પેટ (Stomach)', parentRegion: 'પેટ' },
    bn: { label: 'পেট (Stomach)', parentRegion: 'পেট' },
    ta: { label: 'வயிறு (Stomach)', parentRegion: 'வயிறு' },
  },
  lower_abdomen: {
    en: { label: 'Lower Abdomen', parentRegion: 'Abdomen' },
    hi: { label: 'निचला पेट (Lower Abdomen)', parentRegion: 'पेट' },
    mr: { label: 'खालचे पोट (Lower Abdomen)', parentRegion: 'पोट' },
    gu: { label: 'નીચલું પેટ (Lower Abdomen)', parentRegion: 'પેટ' },
    bn: { label: 'তলপেট (Lower Abdomen)', parentRegion: 'পেট' },
    ta: { label: 'அடிவயிறு (Lower Abdomen)', parentRegion: 'வயிறு' },
  },

  // ── Back & Spine ──
  upper_back: {
    en: { label: 'Upper Back', parentRegion: 'Back' },
    hi: { label: 'ऊपरी पीठ (Upper Back)', parentRegion: 'पीठ' },
    mr: { label: 'पाठीचा वरचा भाग (Upper Back)', parentRegion: 'पाठ' },
    gu: { label: 'પીઠનો ઉપરનો ભાગ (Upper Back)', parentRegion: 'પીઠ' },
    bn: { label: 'পিঠের উপরের অংশ (Upper Back)', parentRegion: 'পিঠ' },
    ta: { label: 'மேல் முதுகு (Upper Back)', parentRegion: 'முதுகு' },
  },
  spine: {
    en: { label: 'Spine', parentRegion: 'Back' },
    hi: { label: 'रीढ़ की हड्डी (Spine)', parentRegion: 'पीठ' },
    mr: { label: 'पाठीचा कणा (Spine)', parentRegion: 'पाठ' },
    gu: { label: 'કરોડરજ્જુ (Spine)', parentRegion: 'પીઠ' },
    bn: { label: 'মেরুদণ্ড (Spine)', parentRegion: 'পিঠ' },
    ta: { label: 'முதுகெலும்பு (Spine)', parentRegion: 'முதுகு' },
  },
  lower_back: {
    en: { label: 'Lower Back', parentRegion: 'Back' },
    hi: { label: 'कमर / निचली पीठ (Lower Back)', parentRegion: 'पीठ' },
    mr: { label: 'कंबर / खालची पाठ (Lower Back)', parentRegion: 'पाठ' },
    gu: { label: 'કમર (Lower Back)', parentRegion: 'પીઠ' },
    bn: { label: 'কোমর / পিঠের নিচের অংশ (Lower Back)', parentRegion: 'পিঠ' },
    ta: { label: 'கீழ் முதுகு / இடுப்பு (Lower Back)', parentRegion: 'முதுகு' },
  },

  // ── Left Arm ──
  left_shoulder: {
    en: { label: 'Left Shoulder', parentRegion: 'Left Arm' },
    hi: { label: 'बायां कंधा (Left Shoulder)', parentRegion: 'बायां हाथ' },
    mr: { label: 'डावा खांदा (Left Shoulder)', parentRegion: 'डावा हात' },
    gu: { label: 'ડાબો ખભો (Left Shoulder)', parentRegion: 'ડાબો હાથ' },
    bn: { label: 'বাঁ কাঁধ (Left Shoulder)', parentRegion: 'বাঁ হাত' },
    ta: { label: 'இடது தோள்பட்டை (Left Shoulder)', parentRegion: 'இடது கை' },
  },
  left_upper_arm: {
    en: { label: 'Left Upper Arm', parentRegion: 'Left Arm' },
    hi: { label: 'बाईं भुजा (Left Upper Arm)', parentRegion: 'बायां हाथ' },
    mr: { label: 'डावा दंड (Left Upper Arm)', parentRegion: 'डावा हात' },
    gu: { label: 'ડાબો હાથ (ઉપર) (Left Upper Arm)', parentRegion: 'ડાબો હાથ' },
    bn: { label: 'বাঁ বাহু (Left Upper Arm)', parentRegion: 'বাঁ হাত' },
    ta: { label: 'இடது மேல் கை (Left Upper Arm)', parentRegion: 'இடது கை' },
  },
  left_elbow: {
    en: { label: 'Left Elbow', parentRegion: 'Left Arm' },
    hi: { label: 'बाईं कोहनी (Left Elbow)', parentRegion: 'बायां हाथ' },
    mr: { label: 'डावा कोपर (Left Elbow)', parentRegion: 'डावा हात' },
    gu: { label: 'ડાબી કોણી (Left Elbow)', parentRegion: 'ડાબો હાથ' },
    bn: { label: 'বাঁ কনুই (Left Elbow)', parentRegion: 'বাঁ হাত' },
    ta: { label: 'இடது முழங்கை (Left Elbow)', parentRegion: 'இடது கை' },
  },
  left_forearm: {
    en: { label: 'Left Forearm', parentRegion: 'Left Arm' },
    hi: { label: 'बाईं कलाई के ऊपर (Left Forearm)', parentRegion: 'बायां हाथ' },
    mr: { label: 'डावा पुढचा हात (Left Forearm)', parentRegion: 'डावा हात' },
    gu: { label: 'ડાબો આગળનો હાથ (Left Forearm)', parentRegion: 'ડાબો હાથ' },
    bn: { label: 'বাঁ প্রকোষ্ঠ (Left Forearm)', parentRegion: 'বাঁ হাত' },
    ta: { label: 'இடது முன் கை (Left Forearm)', parentRegion: 'இடது கை' },
  },
  left_wrist: {
    en: { label: 'Left Wrist', parentRegion: 'Left Arm' },
    hi: { label: 'बाईं कलाई (Left Wrist)', parentRegion: 'बायां हाथ' },
    mr: { label: 'डावा मनगट (Left Wrist)', parentRegion: 'डावा हात' },
    gu: { label: 'ડાબું કાંડું (Left Wrist)', parentRegion: 'ડાબો હાથ' },
    bn: { label: 'বাঁ কব্জি (Left Wrist)', parentRegion: 'বাঁ হাত' },
    ta: { label: 'இடது மணிக்கட்டு (Left Wrist)', parentRegion: 'இடது கை' },
  },
  left_hand: {
    en: { label: 'Left Hand', parentRegion: 'Left Arm' },
    hi: { label: 'बायां हाथ / हथेली (Left Hand)', parentRegion: 'बायां हाथ' },
    mr: { label: 'डावा हात / तळहात (Left Hand)', parentRegion: 'डावा हात' },
    gu: { label: 'ડાબો હાથ (Left Hand)', parentRegion: 'ડાબો હાથ' },
    bn: { label: 'বাঁ হাত / তালু (Left Hand)', parentRegion: 'বাঁ হাত' },
    ta: { label: 'இடது கை (Left Hand)', parentRegion: 'இடது கை' },
  },

  // ── Right Arm ──
  right_shoulder: {
    en: { label: 'Right Shoulder', parentRegion: 'Right Arm' },
    hi: { label: 'दायां कंधा (Right Shoulder)', parentRegion: 'दायां हाथ' },
    mr: { label: 'उजवा खांदा (Right Shoulder)', parentRegion: 'उजवा हात' },
    gu: { label: 'જમણો ખભો (Right Shoulder)', parentRegion: 'જમણો હાથ' },
    bn: { label: 'ডান কাঁধ (Right Shoulder)', parentRegion: 'ডান হাত' },
    ta: { label: 'வலது தோள்பட்டை (Right Shoulder)', parentRegion: 'வலது கை' },
  },
  right_upper_arm: {
    en: { label: 'Right Upper Arm', parentRegion: 'Right Arm' },
    hi: { label: 'दाईं भुजा (Right Upper Arm)', parentRegion: 'दायां हाथ' },
    mr: { label: 'उजवा दंड (Right Upper Arm)', parentRegion: 'उजवा हात' },
    gu: { label: 'જમણો હાથ (ઉપર) (Right Upper Arm)', parentRegion: 'જમણો હાથ' },
    bn: { label: 'ডান বাহু (Right Upper Arm)', parentRegion: 'ডান হাত' },
    ta: { label: 'வலது மேல் கை (Right Upper Arm)', parentRegion: 'வலது கை' },
  },
  right_elbow: {
    en: { label: 'Right Elbow', parentRegion: 'Right Arm' },
    hi: { label: 'दाईं कोहनी (Right Elbow)', parentRegion: 'दायां हाथ' },
    mr: { label: 'उजवा कोपर (Right Elbow)', parentRegion: 'उजवा हात' },
    gu: { label: 'જમણી કોણી (Right Elbow)', parentRegion: 'જમણો હાથ' },
    bn: { label: 'ডান কনুই (Right Elbow)', parentRegion: 'ডান হাত' },
    ta: { label: 'வலது முழங்கை (Right Elbow)', parentRegion: 'வலது கை' },
  },
  right_forearm: {
    en: { label: 'Right Forearm', parentRegion: 'Right Arm' },
    hi: { label: 'दाईं कलाई के ऊपर (Right Forearm)', parentRegion: 'दायां हाथ' },
    mr: { label: 'उजवा पुढचा हात (Right Forearm)', parentRegion: 'उजवा हात' },
    gu: { label: 'જમણો આગળનો હાથ (Right Forearm)', parentRegion: 'જમણો હાથ' },
    bn: { label: 'ডান প্রকোষ্ঠ (Right Forearm)', parentRegion: 'ডান হাত' },
    ta: { label: 'வலது முன் கை (Right Forearm)', parentRegion: 'வலது கை' },
  },
  right_wrist: {
    en: { label: 'Right Wrist', parentRegion: 'Right Arm' },
    hi: { label: 'दाईं कलाई (Right Wrist)', parentRegion: 'दायां हाथ' },
    mr: { label: 'उजवा मनगट (Right Wrist)', parentRegion: 'उजवा हात' },
    gu: { label: 'જમણું કાંડું (Right Wrist)', parentRegion: 'જમણો હાથ' },
    bn: { label: 'ডান কব্জি (Right Wrist)', parentRegion: 'ডান হাত' },
    ta: { label: 'வலது மணிக்கட்டு (Right Wrist)', parentRegion: 'வலது கை' },
  },
  right_hand: {
    en: { label: 'Right Hand', parentRegion: 'Right Arm' },
    hi: { label: 'दायां हाथ / हथेली (Right Hand)', parentRegion: 'दायां हाथ' },
    mr: { label: 'उजवा हात / तळहात (Right Hand)', parentRegion: 'उजवा हात' },
    gu: { label: 'જમણો હાથ (Right Hand)', parentRegion: 'જમણો હાથ' },
    bn: { label: 'ডান হাত / তালু (Right Hand)', parentRegion: 'ডান হাত' },
    ta: { label: 'வலது கை (Right Hand)', parentRegion: 'வலது கை' },
  },

  // ── Pelvis & Hips ──
  pelvis: {
    en: { label: 'Pelvis / Groin', parentRegion: 'Pelvis' },
    hi: { label: 'पेल्विस / कमर का निचला भाग', parentRegion: 'पेल्विस' },
    mr: { label: 'श्रोणि / ओटीपोट (Pelvis)', parentRegion: 'श्रोणि' },
    gu: { label: 'પેલ્વિસ (Pelvis)', parentRegion: 'પેલ્વિસ' },
    bn: { label: 'শ্রোণীদেশ (Pelvis)', parentRegion: 'শ্রোণীদেশ' },
    ta: { label: 'இடுப்பு பகுதி (Pelvis)', parentRegion: 'இடுப்பு பகுதி' },
  },
  left_hip: {
    en: { label: 'Left Hip', parentRegion: 'Hips' },
    hi: { label: 'बायां कूल्हा (Left Hip)', parentRegion: 'कूल्हा' },
    mr: { label: 'डावा नितंब / कंबर (Left Hip)', parentRegion: 'नितंब' },
    gu: { label: 'ડાબો થાપો (Left Hip)', parentRegion: 'થાપો' },
    bn: { label: 'বাঁ নিতম্ব (Left Hip)', parentRegion: 'নিতম্ব' },
    ta: { label: 'இடது இடுப்பு மூட்டு (Left Hip)', parentRegion: 'இடுப்பு' },
  },
  right_hip: {
    en: { label: 'Right Hip', parentRegion: 'Hips' },
    hi: { label: 'दायां कूल्हा (Right Hip)', parentRegion: 'कूल्हा' },
    mr: { label: 'उजवा नितंब / कंबर (Right Hip)', parentRegion: 'नितंब' },
    gu: { label: 'જમણો થાપો (Right Hip)', parentRegion: 'થાપો' },
    bn: { label: 'ডান নিতম্ব (Right Hip)', parentRegion: 'ডান নিতম্ব' },
    ta: { label: 'வலது இடுப்பு மூட்டு (Right Hip)', parentRegion: 'இடுப்பு' },
  },

  // ── Left Leg ──
  left_thigh: {
    en: { label: 'Left Thigh', parentRegion: 'Left Leg' },
    hi: { label: 'बाईं जांघ (Left Thigh)', parentRegion: 'बायां पैर' },
    mr: { label: 'डावी मांडी (Left Thigh)', parentRegion: 'डावा पाय' },
    gu: { label: 'ડાબી સાથળ (Left Thigh)', parentRegion: 'ડાબો પગ' },
    bn: { label: 'বাঁ উরু (Left Thigh)', parentRegion: 'বাঁ পা' },
    ta: { label: 'இடது தொடை (Left Thigh)', parentRegion: 'இடது கால்' },
  },
  left_knee: {
    en: { label: 'Left Knee', parentRegion: 'Left Leg' },
    hi: { label: 'बायां घुटना (Left Knee)', parentRegion: 'बायां पैर' },
    mr: { label: 'डावा गुडघा (Left Knee)', parentRegion: 'डावा पाय' },
    gu: { label: 'ડાબો ઢીંચણ (Left Knee)', parentRegion: 'ડાબો પગ' },
    bn: { label: 'বাঁ হাঁটু (Left Knee)', parentRegion: 'বাঁ পা' },
    ta: { label: 'இடது முழங்கால் (Left Knee)', parentRegion: 'இடது கால்' },
  },
  left_calf: {
    en: { label: 'Left Calf / Shin', parentRegion: 'Left Leg' },
    hi: { label: 'बाईं पिंडली (Left Calf)', parentRegion: 'बायां पैर' },
    mr: { label: 'डावी पोटरी (Left Calf)', parentRegion: 'डावा पाय' },
    gu: { label: 'ડાબી પિંડી (Left Calf)', parentRegion: 'ડાબો પગ' },
    bn: { label: 'বাঁ পায়ের ডিম (Left Calf)', parentRegion: 'বাঁ পা' },
    ta: { label: 'இடது கணுக்கால் தசை (Left Calf)', parentRegion: 'இடது கால்' },
  },
  left_ankle: {
    en: { label: 'Left Ankle', parentRegion: 'Left Leg' },
    hi: { label: 'बायां टखना (Left Ankle)', parentRegion: 'बायां पैर' },
    mr: { label: 'डावा घोटा (Left Ankle)', parentRegion: 'डावा पाय' },
    gu: { label: 'ડાબી ઘૂંટી (Left Ankle)', parentRegion: 'ડાબો પગ' },
    bn: { label: 'বাঁ গোড়ালি (Left Ankle)', parentRegion: 'বাঁ পা' },
    ta: { label: 'இடது கணுக்கால் (Left Ankle)', parentRegion: 'இடது கால்' },
  },
  left_foot: {
    en: { label: 'Left Foot', parentRegion: 'Left Leg' },
    hi: { label: 'बायां पैर / पंजा (Left Foot)', parentRegion: 'बायां पैर' },
    mr: { label: 'डावा पाय / पाऊल (Left Foot)', parentRegion: 'डावा पाय' },
    gu: { label: 'ડાબો પગ (Left Foot)', parentRegion: 'ડાબો પગ' },
    bn: { label: 'বাঁ পা / পায়ের পাতা (Left Foot)', parentRegion: 'বাঁ পা' },
    ta: { label: 'இடது பாதம் (Left Foot)', parentRegion: 'இடது கால்' },
  },

  // ── Right Leg ──
  right_thigh: {
    en: { label: 'Right Thigh', parentRegion: 'Right Leg' },
    hi: { label: 'दाईं जांघ (Right Thigh)', parentRegion: 'दायां पैर' },
    mr: { label: 'उजवी मांडी (Right Thigh)', parentRegion: 'उजवा पाय' },
    gu: { label: 'જમણી સાથળ (Right Thigh)', parentRegion: 'જમણો પગ' },
    bn: { label: 'ডান উরু (Right Thigh)', parentRegion: 'ডান পা' },
    ta: { label: 'வலது தொடை (Right Thigh)', parentRegion: 'வலது கால்' },
  },
  right_knee: {
    en: { label: 'Right Knee', parentRegion: 'Right Leg' },
    hi: { label: 'दायां घुटना (Right Knee)', parentRegion: 'दायां पैर' },
    mr: { label: 'उजवा गुडघा (Right Knee)', parentRegion: 'उजवा पाय' },
    gu: { label: 'જમણો ઢીંચણ (Right Knee)', parentRegion: 'જમણો પગ' },
    bn: { label: 'ডান হাঁটু (Right Knee)', parentRegion: 'ডান পা' },
    ta: { label: 'வலது முழங்கால் (Right Knee)', parentRegion: 'வலது கால்' },
  },
  right_calf: {
    en: { label: 'Right Calf / Shin', parentRegion: 'Right Leg' },
    hi: { label: 'दाईं पिंडली (Right Calf)', parentRegion: 'दायां पैर' },
    mr: { label: 'उजवी पोटरी (Right Calf)', parentRegion: 'उजवा पाय' },
    gu: { label: 'જમણી પિંડી (Right Calf)', parentRegion: 'જમણો પગ' },
    bn: { label: 'ডান পায়ের ডিম (Right Calf)', parentRegion: 'ডান পা' },
    ta: { label: 'வலது கணுக்கால் தசை (Right Calf)', parentRegion: 'வலது கால்' },
  },
  right_ankle: {
    en: { label: 'Right Ankle', parentRegion: 'Right Leg' },
    hi: { label: 'दायां टखना (Right Ankle)', parentRegion: 'दायां पैर' },
    mr: { label: 'उजवा घोटा (Right Ankle)', parentRegion: 'उजवा पाय' },
    gu: { label: 'જમણી ઘૂંટી (Right Ankle)', parentRegion: 'જમણો પગ' },
    bn: { label: 'ডান গোড়ালি (Right Ankle)', parentRegion: 'ডান পা' },
    ta: { label: 'வலது கணுக்கால் (Right Ankle)', parentRegion: 'வலது கால்' },
  },
  right_foot: {
    en: { label: 'Right Foot', parentRegion: 'Right Leg' },
    hi: { label: 'दायां पैर / पंजा (Right Foot)', parentRegion: 'दायां पैर' },
    mr: { label: 'उजवा पाय / पाऊल (Right Foot)', parentRegion: 'उजवा पाय' },
    gu: { label: 'જમણો પગ (Right Foot)', parentRegion: 'જમણો પગ' },
    bn: { label: 'ডান পা / পায়ের পাতা (Right Foot)', parentRegion: 'ডান পা' },
    ta: { label: 'வலது பாதம் (Right Foot)', parentRegion: 'வலது கால்' },
  },

  // ── Systemic / General ──
  fever_general: {
    en: { label: 'Fever / Whole Body', parentRegion: 'Systemic' },
    hi: { label: 'बुखार / पूरा शरीर (Fever / Systemic)', parentRegion: 'पूरा शरीर' },
    mr: { label: 'ताप / संपूर्ण शरीर (Fever)', parentRegion: 'संपूर्ण शरीर' },
    gu: { label: 'તાવ / આખું શરીર (Fever)', parentRegion: 'આખું શરીર' },
    bn: { label: 'জ্বর / সমগ্র শরীর (Fever)', parentRegion: 'সমগ্র শরীর' },
    ta: { label: 'காய்ச்சல் / முழு உடல் (Fever)', parentRegion: 'முழு உடல்' },
  },
  other_general: {
    en: { label: 'Other / Not Listed', parentRegion: 'General' },
    hi: { label: 'अन्य लक्षण (Other Symptoms)', parentRegion: 'सामान्य' },
    mr: { label: 'इतर लक्षणे (Other Symptoms)', parentRegion: 'सामान्य' },
    gu: { label: 'અન્ય લક્ષણો (Other Symptoms)', parentRegion: 'સામાન્ય' },
    bn: { label: 'অন্যান্য উপসর্গ (Other Symptoms)', parentRegion: 'সাধারণ' },
    ta: { label: 'பிற அறிகுறிகள் (Other Symptoms)', parentRegion: 'பொதுவானது' },
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
    frontView: 'सामने का दृश्य (Front)',
    backView: 'पीछे का दृश्य (Back)',
    sideView: 'बगल का दृश्य (Side)',
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
    frontView: 'समोरील दृश्य (Front)',
    backView: 'मागील दृश्य (Back)',
    sideView: 'बाजूचे दृश्य (Side)',
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
    frontView: 'આગળનો ભાગ (Front)',
    backView: 'પાછળનો ભાગ (Back)',
    sideView: 'બાજુનો ભાગ (Side)',
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
    frontView: 'সামনের দৃশ্য (Front)',
    backView: 'পেছনের দৃশ্য (Back)',
    sideView: 'পাশের দৃশ্য (Side)',
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
    frontView: 'முன் தோற்றம் (Front)',
    backView: 'பின் தோற்றம் (Back)',
    sideView: 'பக்கவாட்டு தோற்றம் (Side)',
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
    return regionRecord[safeLang].label
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

