const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'public', 'documents');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

// Generates SVG for Tier 1: Clean, sharp, well-lit, hospital letterhead
function generateTier1Svg({ hospitalName, dept, title, patientName, date, fields, footerNotes }) {
  const fieldsSvg = fields.map((f, i) => {
    const y = 230 + i * 48;
    return `
      <g transform="translate(40, ${y})">
        <rect x="0" y="0" width="560" height="40" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1" />
        <text x="16" y="24" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#64748B">${escapeXml(f.label.toUpperCase())}</text>
        <text x="210" y="24" font-family="Arial, sans-serif" font-size="13" font-weight="600" fill="#0F172A">${escapeXml(f.value)}</text>
        ${f.highlight ? `<rect x="470" y="10" width="75" height="20" rx="4" fill="#DCFCE7" stroke="#86EFAC" stroke-width="1"/><text x="507" y="24" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#15803D" text-anchor="middle">VERIFIED</text>` : ''}
      </g>
    `;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 820" width="100%" height="100%">
  <defs>
    <linearGradient id="cleanHeaderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0F766E"/>
      <stop offset="100%" stop-color="#14B8A6"/>
    </linearGradient>
    <filter id="cleanShadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.06"/>
    </filter>
  </defs>

  <!-- Clean Paper Surface -->
  <rect x="0" y="0" width="640" height="820" fill="#FFFFFF" />
  <rect x="8" y="8" width="624" height="804" rx="4" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" filter="url(#cleanShadow)"/>

  <!-- Hospital Header Bar -->
  <rect x="24" y="24" width="592" height="72" rx="8" fill="url(#cleanHeaderGrad)" />
  <circle cx="60" cy="60" r="22" fill="#FFFFFF" opacity="0.2"/>
  <path d="M60 48 V72 M48 60 H72" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
  
  <text x="96" y="52" font-family="Arial, sans-serif" font-size="17" font-weight="bold" fill="#FFFFFF">${escapeXml(hospitalName)}</text>
  <text x="96" y="72" font-family="Arial, sans-serif" font-size="12" font-weight="500" fill="#CCFBF1">${escapeXml(dept)} • NABH ACCREDITED</text>
  
  <rect x="495" y="40" width="105" height="26" rx="4" fill="#FFFFFF" />
  <text x="547" y="57" font-family="monospace" font-size="11" font-weight="bold" fill="#0F766E" text-anchor="middle">OCR: 96% TIER 1</text>

  <!-- Document Meta Strip -->
  <rect x="24" y="112" width="592" height="60" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
  <text x="40" y="136" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#64748B">DOCUMENT TITLE:</text>
  <text x="145" y="136" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#0F172A">${escapeXml(title)}</text>
  
  <text x="40" y="156" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#64748B">PATIENT:</text>
  <text x="145" y="156" font-family="Arial, sans-serif" font-size="12" font-weight="600" fill="#334155">${escapeXml(patientName)}</text>
  
  <text x="420" y="136" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#64748B">DATE:</text>
  <text x="465" y="136" font-family="monospace" font-size="12" font-weight="600" fill="#0F172A">${escapeXml(date)}</text>

  <!-- Section Title -->
  <text x="40" y="205" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#0F766E" letter-spacing="1">STANDARDIZED CLINICAL DATA EXTRACT</text>
  <line x1="40" y1="212" x2="600" y2="212" stroke="#CBD5E1" stroke-width="1"/>

  <!-- Fields List -->
  ${fieldsSvg}

  <!-- Footer & Digital Seal -->
  <g transform="translate(40, 680)">
    <line x1="0" y1="0" x2="560" y2="0" stroke="#E2E8F0" stroke-width="1"/>
    <text x="0" y="24" font-family="Arial, sans-serif" font-size="11" fill="#64748B">${escapeXml(footerNotes || 'Digitally signed and generated from Electronic Health Records archive.')}</text>
    <rect x="0" y="40" width="130" height="40" rx="4" fill="#F1F5F9" stroke="#CBD5E1"/>
    <text x="65" y="64" font-family="monospace" font-size="10" font-weight="bold" fill="#475569" text-anchor="middle">ABDM INTEGRATED</text>
    
    <!-- Doctor Signature Stamp -->
    <g transform="translate(420, 20)">
      <circle cx="60" cy="30" r="28" fill="none" stroke="#0F766E" stroke-width="1.5" stroke-dasharray="3,2"/>
      <text x="60" y="28" font-family="Arial, sans-serif" font-size="8" font-weight="bold" fill="#0F766E" text-anchor="middle">OFFICIALLY SIGNED</text>
      <text x="60" y="38" font-family="Arial, sans-serif" font-size="7" fill="#0F766E" text-anchor="middle">MEDICAL COUNCIL</text>
    </g>
  </g>
</svg>`;
}

// Generates SVG for Tier 2: Slight skew, mild scan noise / shadow gradient, real-world typed scan
function generateTier2Svg({ hospitalName, title, patientName, date, rows, notes }) {
  const tableRowsSvg = rows.map((r, i) => {
    const y = 240 + i * 42;
    const bg = i % 2 === 0 ? '#F8FAFC' : '#FFFFFF';
    return `
      <rect x="35" y="${y}" width="570" height="38" fill="${bg}" stroke="#E2E8F0" stroke-width="0.75"/>
      <text x="45" y="${y + 24}" font-family="monospace" font-size="12" font-weight="bold" fill="#1E293B">${escapeXml(r.test)}</text>
      <text x="240" y="${y + 24}" font-family="monospace" font-size="12" font-weight="bold" fill="${r.abnormal ? '#B91C1C' : '#0F172A'}">${escapeXml(r.result)}</text>
      <text x="360" y="${y + 24}" font-family="monospace" font-size="11" fill="#64748B">${escapeXml(r.units)}</text>
      <text x="460" y="${y + 24}" font-family="monospace" font-size="11" fill="#64748B">${escapeXml(r.reference)}</text>
    `;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 820" width="100%" height="100%">
  <defs>
    <!-- Slight scan gradient / uneven lighting -->
    <linearGradient id="scanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCFDFF"/>
      <stop offset="50%" stop-color="#F8FAFC"/>
      <stop offset="100%" stop-color="#F1F5F9"/>
    </linearGradient>
    <filter id="slightNoise">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" result="noise"/>
      <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.03 0" in="noise" result="coloredNoise"/>
      <feComposite operator="in" in2="SourceGraphic"/>
    </filter>
  </defs>

  <!-- Slight rotation skew 2.2 deg to simulate realistic feed scan -->
  <g transform="rotate(1.8 320 410)">
    <!-- Scanned paper background -->
    <rect x="15" y="15" width="610" height="790" fill="url(#scanGrad)" stroke="#CBD5E1" stroke-width="1.5"/>
    
    <!-- Top Scanner Edge Line Artifact -->
    <line x1="25" y1="20" x2="615" y2="20" stroke="#94A3B8" stroke-width="0.75" stroke-dasharray="100,2,40,1"/>

    <!-- Header Box -->
    <rect x="35" y="35" width="570" height="75" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1"/>
    <text x="50" y="65" font-family="'Courier New', monospace" font-size="16" font-weight="bold" fill="#0F172A">${escapeXml(hospitalName)}</text>
    <text x="50" y="88" font-family="'Courier New', monospace" font-size="11" fill="#475569">DIAGNOSTIC PATHOLOGY LABORATORY • SCANNED COPY</text>
    <rect x="475" y="48" width="115" height="24" rx="3" fill="#FEF3C7" stroke="#FCD34D"/>
    <text x="532" y="64" font-family="monospace" font-size="10" font-weight="bold" fill="#92400E" text-anchor="middle">OCR: 82% TIER 2</text>

    <!-- Meta Details -->
    <g transform="translate(35, 125)">
      <rect x="0" y="0" width="570" height="65" fill="#F8FAFC" stroke="#E2E8F0"/>
      <text x="15" y="24" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#64748B">INVESTIGATION:</text>
      <text x="120" y="24" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#0F172A">${escapeXml(title)}</text>
      
      <text x="15" y="48" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#64748B">PATIENT NAME:</text>
      <text x="120" y="48" font-family="Arial, sans-serif" font-size="12" font-weight="600" fill="#334155">${escapeXml(patientName)}</text>

      <text x="410" y="24" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#64748B">SAMPLE DATE:</text>
      <text x="495" y="24" font-family="monospace" font-size="11" fill="#0F172A">${escapeXml(date)}</text>
    </g>

    <!-- Table Header -->
    <rect x="35" y="205" width="570" height="32" fill="#E2E8F0" stroke="#CBD5E1"/>
    <text x="45" y="226" font-family="monospace" font-size="11" font-weight="bold" fill="#334155">TEST PARAMETER</text>
    <text x="240" y="226" font-family="monospace" font-size="11" font-weight="bold" fill="#334155">RESULT</text>
    <text x="360" y="226" font-family="monospace" font-size="11" font-weight="bold" fill="#334155">UNITS</text>
    <text x="460" y="226" font-family="monospace" font-size="11" font-weight="bold" fill="#334155">REF INTERVAL</text>

    <!-- Rows -->
    ${tableRowsSvg}

    <!-- Lab Technician Note -->
    <g transform="translate(35, 620)">
      <text x="0" y="20" font-family="monospace" font-size="11" fill="#475569">NOTE: ${escapeXml(notes || 'Results verified on automated analyzer. Slight calibration skew noted during scanner feeder intake.')}</text>
      <line x1="0" y1="40" x2="570" y2="40" stroke="#CBD5E1" stroke-width="1" stroke-dasharray="4,3"/>
      <text x="400" y="80" font-family="'Brush Script MT', cursive, sans-serif" font-size="20" fill="#1E3A8A">Dr. R. K. Saxena</text>
      <text x="400" y="95" font-family="monospace" font-size="9" fill="#64748B">Consultant Biochemist</text>
    </g>
  </g>
</svg>`;
}

// Generates SVG for Tier 3: Degraded scan, blurry/faded ink, rotation 6.5 deg, paper crease, messy cursive handwriting
function generateTier3Svg({ clinicHeader, date, doctorName, handwrittenLines, ocrErrorNote }) {
  const linesSvg = handwrittenLines.map((line, idx) => {
    const y = 230 + idx * 55;
    return `
      <!-- Ruled line on aged pad -->
      <line x1="45" y1="${y + 15}" x2="585" y2="${y + 15}" stroke="#D1D5DB" stroke-width="0.75" stroke-dasharray="2,2"/>
      
      <!-- Handwritten cursive simulation with slight wobble -->
      <text x="${55 + (idx % 2 === 0 ? 5 : 0)}" y="${y + 8}" font-family="'Brush Script MT', 'Segoe Script', 'Caveat', cursive, sans-serif" font-size="21" font-weight="600" fill="#1E3A8A" opacity="0.82" transform="rotate(${idx % 2 === 0 ? -0.8 : 0.6} ${55} ${y})">
        ${escapeXml(line.text)}
      </text>

      ${line.isGarbled ? `
        <!-- Optical Bounding Box showing OCR Struggle / Low Confidence Highlight -->
        <rect x="48" y="${y - 14}" width="530" height="32" rx="4" fill="none" stroke="#EF4444" stroke-width="1.5" stroke-dasharray="5,3"/>
        <rect x="490" y="${y - 25}" width="85" height="16" rx="3" fill="#FEE2E2" stroke="#EF4444" stroke-width="0.8"/>
        <text x="532" y="${y - 13}" font-family="Arial, sans-serif" font-size="9" font-weight="bold" fill="#DC2626" text-anchor="middle">OCR GARBLED</text>
      ` : ''}
    `;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 820" width="100%" height="100%">
  <defs>
    <!-- Paper Crease and Shadow Filter -->
    <linearGradient id="creaseShadow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.02"/>
      <stop offset="48%" stop-color="#000000" stop-opacity="0.05"/>
      <stop offset="50%" stop-color="#000000" stop-opacity="0.22"/>
      <stop offset="52%" stop-color="#FFFFFF" stop-opacity="0.30"/>
      <stop offset="54%" stop-color="#000000" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.02"/>
    </linearGradient>

    <!-- Aging / yellowing gradient with dark corner shadow -->
    <radialGradient id="vignette" cx="30%" cy="30%" r="90%">
      <stop offset="0%" stop-color="#FFFDF5"/>
      <stop offset="70%" stop-color="#FEF9E7"/>
      <stop offset="100%" stop-color="#E5DCBF"/>
    </radialGradient>
  </defs>

  <!-- 6.2 degree rotation for stressful degraded scan -->
  <g transform="rotate(5.8 320 410)">
    <!-- Yellowed Paper Sheet -->
    <rect x="20" y="20" width="600" height="780" rx="3" fill="url(#vignette)" stroke="#B5A882" stroke-width="1.5"/>

    <!-- Vertical Crease / Fold Artifact down the sheet -->
    <rect x="300" y="20" width="30" height="780" fill="url(#creaseShadow)" />

    <!-- Coffee ring / moisture smudge stain -->
    <circle cx="510" cy="180" r="45" fill="none" stroke="#C4B58E" stroke-width="5" opacity="0.25"/>
    <circle cx="515" cy="182" r="38" fill="#B39E6D" opacity="0.06"/>

    <!-- Top Clinic Header (Faded print) -->
    <g transform="translate(45, 45)">
      <text x="0" y="25" font-family="'Times New Roman', serif" font-size="16" font-weight="bold" fill="#3E3827">${escapeXml(clinicHeader || 'DISTRICT CIVIL HOSPITAL • OUTPATIENT SLIP')}</text>
      <text x="0" y="44" font-family="Arial, sans-serif" font-size="10" fill="#6B624A">DEPT. OF MEDICINE • CASUALTY / OPD INTAKE</text>
      
      <rect x="430" y="10" width="130" height="26" rx="4" fill="#FEE2E2" stroke="#F87171"/>
      <text x="495" y="27" font-family="monospace" font-size="10" font-weight="bold" fill="#B91C1C" text-anchor="middle">OCR: 54% (TIER 3)</text>
    </g>

    <line x1="45" y1="105" x2="585" y2="105" stroke="#9A8E6F" stroke-width="1"/>

    <!-- Date & Doctor Info -->
    <g transform="translate(45, 125)">
      <text x="0" y="18" font-family="monospace" font-size="11" fill="#4B4431">DATE: ${escapeXml(date || '14/04/2024')}</text>
      <text x="350" y="18" font-family="monospace" font-size="11" fill="#4B4431">PHYSICIAN: ${escapeXml(doctorName || 'Dr. V. Joshi, MBBS')}</text>
      
      <text x="0" y="48" font-family="'Times New Roman', serif" font-size="24" font-style="italic" font-weight="bold" fill="#1E3A8A">℞</text>
    </g>

    <!-- Handwritten Prescription Content -->
    ${linesSvg}

    <!-- Doctor Scribbled Signature & Stamp -->
    <g transform="translate(380, 640)">
      <path d="M10 30 Q30 5, 60 25 T110 20 T150 35" fill="none" stroke="#1E3A8A" stroke-width="2.5" stroke-linecap="round"/>
      <text x="40" y="55" font-family="sans-serif" font-size="9" fill="#5C533D">Regd. No: 48921/MH</text>
      
      <!-- Faded Round Clinic Stamp -->
      <circle cx="80" cy="20" r="34" fill="none" stroke="#8B2500" stroke-width="1.5" stroke-dasharray="4,2" opacity="0.5"/>
      <text x="80" y="18" font-family="sans-serif" font-size="7" font-weight="bold" fill="#8B2500" text-anchor="middle" opacity="0.6">GOVT. HOSPITAL</text>
      <text x="80" y="28" font-family="sans-serif" font-size="6" fill="#8B2500" text-anchor="middle" opacity="0.6">PUNE DISTRICT</text>
    </g>

    <!-- Degraded Scan Warning Footer -->
    <g transform="translate(45, 735)">
      <rect x="0" y="0" width="540" height="28" rx="4" fill="#FEF3C7" stroke="#F59E0B" stroke-width="0.8"/>
      <text x="10" y="18" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#B45309">⚠️ OPTICAL CONFIDENCE LOW: ${escapeXml(ocrErrorNote || 'Garbled text detected. Inspect source scan before clinical action.')}</text>
    </g>
  </g>
</svg>`;
}

// ── 1. PATIENT 001 (Dhananjay Patil) ───────────────────────────────────────
const p1_doc1 = generateTier1Svg({
  hospitalName: 'APOLLO CLINIC • PUNE',
  dept: 'Department of Internal Medicine',
  title: 'Consultation Prescription & Active Regimen',
  patientName: 'Dhananjay Patil (67Y / Male) • ABHA: 12-3456-7890-1234',
  date: '15-JAN-2025',
  fields: [
    { label: 'Diagnosis', value: 'Type 2 Diabetes Mellitus · Essential Hypertension', highlight: true },
    { label: 'Rx Med 1', value: 'Tab. Metformin 500 mg — 1 Tab BID after meals (OD)', highlight: true },
    { label: 'Rx Med 2', value: 'Tab. Amlodipine 5 mg — 1 Tab OD morning with water', highlight: true },
    { label: 'Vitals Log', value: 'BP: 130/82 mmHg · Pulse: 78 bpm · Weight: 68 kg' },
    { label: 'Advice', value: 'Follow strict diabetic diet, avoid late night dinner, review in 3 months.' },
  ],
  footerNotes: 'Digitally verified clinical summary from Apollo EHR Network.'
});
fs.writeFileSync(path.join(outDir, 'pat001_doc01_apollo_prescription.svg'), p1_doc1);

const p1_doc2 = generateTier2Svg({
  hospitalName: 'METROPOLIS HEALTHCARE LABS',
  title: 'COMPREHENSIVE DIABETIC PROFILE & LIPID PANEL',
  patientName: 'DHANANJAY PATIL',
  date: '14-MAR-2025',
  rows: [
    { test: 'HbA1c (Glycosylated Hb)', result: '8.4 %', units: '%', reference: '< 5.7 Normal', abnormal: true },
    { test: 'Estimated Avg Glucose (eAG)', result: '194', units: 'mg/dL', reference: '90 - 120', abnormal: true },
    { test: 'Fasting Plasma Glucose', result: '148', units: 'mg/dL', reference: '70 - 100', abnormal: true },
    { test: 'Total Cholesterol', result: '210', units: 'mg/dL', reference: '< 200', abnormal: true },
    { test: 'Serum Creatinine', result: '0.92', units: 'mg/dL', reference: '0.70 - 1.20', abnormal: false },
    { test: 'Blood Urea Nitrogen', result: '18.4', units: 'mg/dL', reference: '8.0 - 23.0', abnormal: false },
  ],
  notes: 'HbA1c indicates sub-optimal glycemic control over previous 90 days. Feeder calibration offset.'
});
fs.writeFileSync(path.join(outDir, 'pat001_doc02_metropolis_lab.svg'), p1_doc2);

const p1_doc3 = generateTier3Svg({
  clinicHeader: 'DISTRICT GENERAL HOSPITAL • CASUALTY & OPD',
  date: '22/04/2024',
  doctorName: 'Dr. V. G. Kulkarni, MD (Med)',
  handwrittenLines: [
    { text: 'Pt c/o epigastric burning pain x 3 mos, worsening.', isGarbled: false },
    { text: 'Tab. Ranitidine 150mg BD x 14d before food', isGarbled: true },
    { text: 'Susp. Gelusil 10ml TDS post prandial', isGarbled: true },
    { text: 'Tab. Paracetamol 500mg SOS for body ache', isGarbled: false },
    { text: 'Adv: Upper GI Endoscopy if pain persists > 2 wks', isGarbled: true },
  ],
  ocrErrorNote: 'Crease across prescription lines garbled Ranitidine and Gelusil dosing. Manual confirmation required.'
});
fs.writeFileSync(path.join(outDir, 'pat001_doc03_district_handwritten_rx.svg'), p1_doc3);

// ── 2. PATIENT 002 (Priya Menon - Urgent) ──────────────────────────────────
const p2_doc1 = generateTier1Svg({
  hospitalName: 'FORTIS ESCORTS HEART INSTITUTE',
  dept: 'Emergency Cardiac Care Unit (CCU)',
  title: '12-LEAD RESTING ELECTROCARDIOGRAM (ECG)',
  patientName: 'Priya Menon (42Y / Female) • Token A-023',
  date: 'TODAY (10:25 AM)',
  fields: [
    { label: 'Heart Rate', value: '112 bpm (Sinus Tachycardia)', highlight: true },
    { label: 'ST Segment', value: 'ST-Elevation > 2.2 mm in Leads V1, V2, V3, V4 (Anteroseptal)', highlight: true },
    { label: 'Rhythm / Axis', value: 'Regular Sinus Rhythm, Normal Axis (38°)' },
    { label: 'Intervals', value: 'PR: 142 ms · QRS: 88 ms · QTc: 442 ms' },
    { label: 'Interpretation', value: 'ACUTE ANTEROSEPTAL STEMI · IMMEDIATE CARDIOLOGY ESCALATION', highlight: true },
  ],
  footerNotes: 'Emergency computerized ECG capture verified by telemetry system.'
});
fs.writeFileSync(path.join(outDir, 'pat002_doc01_fortis_ecg.svg'), p2_doc1);

const p2_doc2 = generateTier3Svg({
  clinicHeader: '108 AMBULANCE EMERGENCY TRIAGE SHEET',
  date: 'TODAY (10:05 AM)',
  doctorName: 'Paramedic R. S. Patil (Unit 04)',
  handwrittenLines: [
    { text: '42F c/o crushing retrosternal CP radiating to L arm x 2h', isGarbled: false },
    { text: 'Diaphoresis +, dyspnea +, nausea +', isGarbled: false },
    { text: 'Given: Tab. Aspirin 300mg chewed at 10:08 AM', isGarbled: true },
    { text: 'Given: Tab. Sorbitrate 5mg SL under tongue', isGarbled: true },
    { text: 'BP 146/94, HR 112, SpO2 93% on room air', isGarbled: true },
  ],
  ocrErrorNote: 'Paramedic shorthand and moisture ring obscured pre-hospital Aspirin/Sorbitrate dosages.'
});
fs.writeFileSync(path.join(outDir, 'pat002_doc02_er_triage_scribble.svg'), p2_doc2);

// ── 3. PATIENT 003 (Ramesh Kumar) ─────────────────────────────────────────
const p3_doc1 = generateTier1Svg({
  hospitalName: 'MAX SUPER SPECIALITY HOSPITAL',
  dept: 'Department of Musculoskeletal Radiology',
  title: 'DIGITAL RADIOGRAPHY — BILATERAL KNEES AP/LATERAL',
  patientName: 'Ramesh Kumar (58Y / Male)',
  date: '02-AUG-2025',
  fields: [
    { label: 'Procedure', value: 'Weight-bearing Bilateral Knee X-Ray (AP & Lateral views)', highlight: true },
    { label: 'Joint Space', value: 'Moderate medial joint space narrowing in both knees (R > L)', highlight: true },
    { label: 'Bony Changes', value: 'Marginal osteophytes along tibial and femoral condyles' },
    { label: 'Patellofemoral', value: 'Mild patellofemoral articulation sclerosis' },
    { label: 'Impression', value: 'Grade 2 Kellgren-Lawrence Osteoarthritis Bilateral Knees', highlight: true },
  ],
  footerNotes: 'Max Radiology Digital Picture Archival System (PACS).'
});
fs.writeFileSync(path.join(outDir, 'pat003_doc01_max_radiology.svg'), p3_doc1);

const p3_doc2 = generateTier2Svg({
  hospitalName: 'CIVIL HOSPITAL PUNE',
  title: 'INPATIENT DISCHARGE SUMMARY (2021)',
  patientName: 'RAMESH KUMAR',
  date: '18-JUL-2021',
  rows: [
    { test: 'Primary Diagnosis', result: 'Acute Febrile Illness (Viral Pyrexia)', units: '-', reference: 'Resolved', abnormal: false },
    { test: 'Total Leukocyte Count', result: '11,400', units: '/cu.mm', reference: '4,000 - 11,000', abnormal: true },
    { test: 'Platelet Count', result: '1.95', units: 'Lakhs/cumm', reference: '1.50 - 4.50', abnormal: false },
    { test: 'Discharge Vitals', result: 'BP 124/80, Afebrile, PR 74', units: '-', reference: 'Stable', abnormal: false },
  ],
  notes: 'Treated with IV hydration and antipyretics. Discharged in hemodynamically stable condition.'
});
fs.writeFileSync(path.join(outDir, 'pat003_doc02_civil_discharge.svg'), p3_doc2);

const p3_doc3 = generateTier3Svg({
  clinicHeader: 'ORTHOPEDIC CONSULTATION & ARTHRITIS CLINIC',
  date: '10/11/2023',
  doctorName: 'Dr. A. S. Verma, MS (Ortho)',
  handwrittenLines: [
    { text: 'Bilateral knee pain with morning stiffness x 20 mins', isGarbled: false },
    { text: 'Tab. Aceclofenac 100mg + Paracetamol 325mg BD x 7d', isGarbled: true },
    { text: 'Tab. Pantoprazole 40mg OD before food', isGarbled: false },
    { text: 'Cap. Calcitriol 0.25mcg OD x 30 days', isGarbled: true },
    { text: 'Adv: Knee brace + Quad exercises daily', isGarbled: true },
  ],
  ocrErrorNote: 'Faded carbon copy duplicate led to fragmentation of analgesic dosage lines.'
});
fs.writeFileSync(path.join(outDir, 'pat003_doc03_handwritten_ortho.svg'), p3_doc3);

// ── 4. PATIENT 004 (Sunita Sharma - AYUSH) ────────────────────────────────
const p4_doc1 = generateTier1Svg({
  hospitalName: 'DR. LAL PATHLABS ULTRASOUND CLINIC',
  dept: 'Sonography & Abdominal Imaging Division',
  title: 'WHOLE ABDOMEN & PELVIS ULTRASONOGRAPHY (USG)',
  patientName: 'Sunita Sharma (45Y / Female)',
  date: '08-JUN-2025',
  fields: [
    { label: 'Liver', value: 'Mild diffuse increase in parenchymal echogenicity (Grade 1 Fatty Liver)', highlight: true },
    { label: 'Gallbladder', value: 'Normal distension, wall thickness 2.2mm, no calculi/sludge', highlight: true },
    { label: 'Kidneys / Spleen', value: 'Bilateral kidneys normal size and CMD. Spleen 9.8 cm (Normal)' },
    { label: 'Pelvic Organs', value: 'Uterus anteverted, normal myometrial echo-pattern, no adnexal mass' },
    { label: 'Impression', value: 'Grade 1 Hepatic Steatosis. No evidence of cholelithiasis.', highlight: true },
  ],
  footerNotes: 'High-resolution abdominal ultrasound scan verified by radiologist.'
});
fs.writeFileSync(path.join(outDir, 'pat004_doc01_ultrasound_abdomen.svg'), p4_doc1);

const p4_doc2 = generateTier3Svg({
  clinicHeader: 'AYURVEDA SEVA TRUST • PANCHAKARMA CENTRE',
  date: '04/03/2024',
  doctorName: 'Vaidya S. Bhattacharya, BAMS',
  handwrittenLines: [
    { text: 'Prakriti: Pitta-Kapha. Agnimandya with Ajeerna & Amlapitta', isGarbled: false },
    { text: 'Avipattikar Churna 3g BD with lukewarm water', isGarbled: true },
    { text: 'Kamadudha Ras (Mukta yukta) 1 tab BD after meals', isGarbled: true },
    { text: 'Shankha Vati 2 tab SOS for burning epigastric pain', isGarbled: true },
    { text: 'Pathya: Avoid Ushna, Tikshna Ahara, spicy fermented food', isGarbled: false },
  ],
  ocrErrorNote: 'Mixed Devanagari/Latin script annotations caused ligature splitting in botanical formulations.'
});
fs.writeFileSync(path.join(outDir, 'pat004_doc02_ayurvedic_vaidya_notes.svg'), p4_doc2);

// ── 5. PATIENT 005 (Aisha Khan) ───────────────────────────────────────────
const p5_doc1 = generateTier1Svg({
  hospitalName: 'SYNEVO DIAGNOSTICS & RESEARCH',
  dept: 'Automated Hematology Laboratory',
  title: 'COMPLETE BLOOD COUNT (CBC) WITH 5-PART DIFFERENTIAL',
  patientName: 'Aisha Khan (32Y / Female)',
  date: '20-MAY-2025',
  fields: [
    { label: 'Hemoglobin (Hb)', value: '12.4 g/dL [Normal: 12.0 - 15.0]', highlight: true },
    { label: 'Total Leukocyte (TLC)', value: '6,800 /cu.mm [Normal: 4,000 - 11,000]' },
    { label: 'Platelet Count', value: '2.45 Lakhs/cu.mm [Normal: 1.50 - 4.50]', highlight: true },
    { label: 'RBC Indices', value: 'MCV: 84.2 fL · MCH: 28.6 pg · MCHC: 33.4 g/dL' },
    { label: 'Impression', value: 'Normocytic Normochromic Blood Picture. Parameters within normal limits.' },
  ],
  footerNotes: 'Coulter automated flow-cytometry verification.'
});
fs.writeFileSync(path.join(outDir, 'pat005_doc01_cbc_automated.svg'), p5_doc1);

const p5_doc2 = generateTier3Svg({
  clinicHeader: 'MATERNITY & GYNAECOLOGY OPD SLIP',
  date: '12/01/2024',
  doctorName: 'Dr. N. Merchant, DGO',
  handwrittenLines: [
    { text: 'G2P1L1, 24 wks pregnancy. BP 118/74, Wt 58 kg', isGarbled: false },
    { text: 'Fetal Heart Sound (FHS): 144 bpm regular', isGarbled: false },
    { text: 'Tab. Autrin (Iron) 1 OD after dinner x 30d', isGarbled: true },
    { text: 'Tab. Shelcal 500 1 OD morning after breakfast', isGarbled: true },
    { text: 'Adv: Anomaly scan USG review in 4 weeks', isGarbled: true },
  ],
  ocrErrorNote: 'Low lighting corner shadow and fast clinical cursive obscured prenatal supplement lines.'
});
fs.writeFileSync(path.join(outDir, 'pat005_doc02_handwritten_antenatal.svg'), p5_doc2);

console.log('✅ Generated all 12 realistic mock documents across 5 patients successfully.');
