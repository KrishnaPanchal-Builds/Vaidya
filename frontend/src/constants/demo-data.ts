import type {
  Patient, Encounter, ClinicalFact, ClinicalConflict, MedicalDocument,
  TimelineEvent, RedFlagAlert, CompletenessEntry,
  TriageQueueEntry, AuditEvent, IntegrationStatus, AdminMetrics, Question
} from '@/types'

// ─── Demo Patients ────────────────────────────────────────────────────────

export const DEMO_PATIENTS: Patient[] = [
  {
    id: 'pat-001',
    abhaNumber: '12-3456-7890-1234',
    name: 'Dhananjay Patil',
    age: 67,
    sex: 'M',
    phone: '9876543210',
    preferredLanguage: 'mr',
    createdAt: '2026-08-15T08:00:00Z',
  },
  {
    id: 'pat-002',
    name: 'Priya Menon',
    age: 42,
    sex: 'F',
    phone: '9876541234',
    preferredLanguage: 'en',
    createdAt: '2026-08-15T10:20:00Z',
  },
  {
    id: 'pat-003',
    name: 'Ramesh Kumar',
    age: 58,
    sex: 'M',
    preferredLanguage: 'hi',
    createdAt: '2026-08-15T09:00:00Z',
  },
  {
    id: 'pat-004',
    name: 'Sunita Sharma',
    age: 45,
    sex: 'F',
    preferredLanguage: 'hi',
    createdAt: '2026-08-15T09:30:00Z',
  },
  {
    id: 'pat-005',
    name: 'Aisha Khan',
    age: 32,
    sex: 'F',
    preferredLanguage: 'ur',
    createdAt: '2026-08-15T10:00:00Z',
  },
]

// ─── Demo Encounters ──────────────────────────────────────────────────────

export const DEMO_ENCOUNTERS: Encounter[] = [
  {
    id: 'enc-001',
    patientId: 'pat-001',
    patient: DEMO_PATIENTS[0],
    department: 'Internal Medicine',
    encounterType: 'OPD_ALLOPATHIC',
    state: 'READY_FOR_REVIEW',
    tokenNumber: 'A-028',
    createdAt: '2026-08-15T10:14:00Z',
  },
  {
    id: 'enc-002',
    patientId: 'pat-002',
    patient: DEMO_PATIENTS[1],
    department: 'Internal Medicine',
    encounterType: 'OPD_ALLOPATHIC',
    state: 'UNDER_PHYSICIAN_REVIEW',
    tokenNumber: 'A-023',
    createdAt: '2026-08-15T10:22:00Z',
  },
  {
    id: 'enc-003',
    patientId: 'pat-003',
    patient: DEMO_PATIENTS[2],
    department: 'Internal Medicine',
    encounterType: 'OPD_ALLOPATHIC',
    state: 'READY_FOR_REVIEW',
    tokenNumber: 'A-031',
    createdAt: '2026-08-15T09:10:00Z',
  },
  {
    id: 'enc-004',
    patientId: 'pat-004',
    patient: DEMO_PATIENTS[3],
    department: 'AYUSH OPD',
    encounterType: 'OPD_AYUSH',
    state: 'PROCESSING_DOCUMENTS',
    tokenNumber: 'AY-014',
    createdAt: '2026-08-15T09:30:00Z',
  },
  {
    id: 'enc-005',
    patientId: 'pat-005',
    patient: DEMO_PATIENTS[4],
    department: 'Internal Medicine',
    encounterType: 'OPD_ALLOPATHIC',
    state: 'INTERVIEWING',
    tokenNumber: 'A-042',
    createdAt: '2026-08-15T10:00:00Z',
  },
]

// ─── Demo Documents by Patient & Encounter ─────────────────────────────────

// 1. Dhananjay Patil (enc-001) — 3 documents (Tier 1 94%, Tier 2 82%, Tier 3 54%)
export const DEMO_DOCUMENTS_ENC001: MedicalDocument[] = [
  {
    id: 'doc-001',
    encounterId: 'enc-001',
    patientId: 'pat-001',
    documentType: 'PRESCRIPTION',
    originalFilename: 'Shanti_Hospital_Prescription_Jan2025.jpg',
    qualityScore: 0.94,
    hasHandwriting: false,
    pageCount: 1,
    status: 'PROCESSED',
    ocrConfidence: 0.94,
    degradationTier: 1,
    verificationStatus: 'Extraction Complete',
    extractedFactsCount: 4,
    imageUrl: '/documents/pat001_doc01_shanti_prescription.jpg',
    extractedTextSnippet: 'Shanti Multispecialty Hospital Pune • Patient: Dhananjay Patil (67M) • Rx: Tab Metformin 500mg BID, Tab Amlodipine 5mg OD • BP: 130/82 mmHg',
    uploadedAt: '2026-08-15T10:28:00Z',
    processedAt: '2026-08-15T10:31:00Z',
  },
  {
    id: 'doc-002',
    encounterId: 'enc-001',
    patientId: 'pat-001',
    documentType: 'LAB_REPORT',
    originalFilename: 'Sanjeevani_HbA1c_Lipid_March2025.jpg',
    qualityScore: 0.82,
    qualityIssues: ['Slight 2° feeder skew', 'Mild paper grain texture'],
    hasHandwriting: false,
    pageCount: 1,
    status: 'PROCESSED',
    ocrConfidence: 0.82,
    degradationTier: 2,
    verificationStatus: 'Extraction Complete',
    extractedFactsCount: 5,
    imageUrl: '/documents/pat001_doc02_sanjeevani_lab.jpg',
    extractedTextSnippet: 'SANJEEVANI DIAGNOSTIC LABS • HbA1c: 8.4% [High, Ref 4.0-5.6] • Fasting Glucose: 148 mg/dL [High] • Total Cholesterol: 210 mg/dL • Serum Creatinine: 0.92 mg/dL',
    uploadedAt: '2026-08-15T10:29:00Z',
    processedAt: '2026-08-15T10:32:00Z',
  },
  {
    id: 'doc-003',
    encounterId: 'enc-001',
    patientId: 'pat-001',
    documentType: 'PRESCRIPTION',
    originalFilename: 'District_Civil_Hospital_Handwritten_OPD_2024.jpg',
    qualityScore: 0.54,
    qualityIssues: ['Messy cursive handwriting', 'Vertical fold crease', '5.8° rotation', 'Low contrast'],
    hasHandwriting: true,
    pageCount: 1,
    status: 'PROCESSED',
    ocrConfidence: 0.54,
    degradationTier: 3,
    verificationStatus: 'Verification Required',
    extractedFactsCount: 2,
    imageUrl: '/documents/pat001_doc03_district_civil_handwritten.jpg',
    rawOcrGarbledText: 'Pt c/o epigast~[?] pain x 3 mos / Tab. Ranit~[??] 150mg B~[?] / Susp. Gelus[???] 10ml T~[?] / Tab. Para[???] 500mg SOS',
    groundTruthText: 'Pt c/o epigastric burning pain x 3 mos. Tab. Ranitidine 150mg BD before meals. Susp. Gelusil 10ml TDS. Tab. Paracetamol 500mg SOS.',
    ocrDiscrepancyReason: 'Crease fold across prescription lines and heavy doctor cursive caused 46% OCR character loss on Ranitidine and Gelusil dosing. Physician optical verification required.',
    extractedTextSnippet: 'Tab. Ranit~[??] 150mg B~[?] / Susp. Gelus[???] 10ml T~[?] (OCR Garbled)',
    uploadedAt: '2026-08-15T10:30:00Z',
    processedAt: '2026-08-15T10:33:00Z',
  },
]

// 2. Priya Menon (enc-002) — 2 documents (Tier 1 96%, Tier 3 58%)
export const DEMO_DOCUMENTS_ENC002: MedicalDocument[] = [
  {
    id: 'doc-101',
    encounterId: 'enc-002',
    patientId: 'pat-002',
    documentType: 'LAB_REPORT',
    originalFilename: 'Sahyadri_Emergency_12Lead_ECG_Today.jpg',
    qualityScore: 0.96,
    hasHandwriting: false,
    pageCount: 1,
    status: 'PROCESSED',
    ocrConfidence: 0.96,
    degradationTier: 1,
    verificationStatus: 'Extraction Complete',
    extractedFactsCount: 5,
    imageUrl: '/documents/pat002_doc01_sahyadri_ecg.jpg',
    extractedTextSnippet: 'SAHYADRI EMERGENCY HEART CENTER • 12-Lead ECG • HR: 112 bpm (Sinus Tachycardia) • ST-Elevation >2.2 mm in Leads V1, V2, V3, V4 • Acute Anteroseptal STEMI Pattern',
    uploadedAt: '2026-08-15T10:24:00Z',
    processedAt: '2026-08-15T10:26:00Z',
  },
  {
    id: 'doc-102',
    encounterId: 'enc-002',
    patientId: 'pat-002',
    documentType: 'DISCHARGE_SUMMARY',
    originalFilename: 'Ambulance_108_Triage_Paramedic_Note.jpg',
    qualityScore: 0.58,
    qualityIssues: ['Paramedic rapid pencil scribble', 'Moisture ring stain', '5.2° rotation'],
    hasHandwriting: true,
    pageCount: 1,
    status: 'PROCESSED',
    ocrConfidence: 0.58,
    degradationTier: 3,
    verificationStatus: 'Verification Required',
    extractedFactsCount: 2,
    imageUrl: '/documents/pat002_doc02_108_ambulance_triage.jpg',
    rawOcrGarbledText: 'Pt: Priya Menon 42F c/o crushing retrost~[??] CP -> L arm / Givn: Tab. Asp[???] 300mg chewed / Tab. Sorbi~[??] 5mg SL / BP 146/94, HR 112, SpO2 93%',
    groundTruthText: 'Unit 04: Priya Menon 42F c/o crushing retrosternal CP radiating to L arm & jaw x 2h. Diaphoresis +, Nausea +. Given: Tab. Aspirin 300mg chewed at 10:08 AM. Given: Tab. Sorbitrate 5mg SL under tongue. Vitals: BP 146/94, HR 112 bpm, SpO2 93% room air.',
    ocrDiscrepancyReason: 'Paramedic shorthand and moisture cup stain ring obscured pre-hospital Aspirin/Sorbitrate dosages and administration timestamp.',
    extractedTextSnippet: 'Givn: Tab. Asp[???] 300mg chewed, Tab. Sorbi~[??] 5mg SL (OCR Garbled)',
    uploadedAt: '2026-08-15T10:25:00Z',
    processedAt: '2026-08-15T10:27:00Z',
  },
]

// 3. Ramesh Kumar (enc-003) — 3 documents (Tier 1 93%, Tier 2 78%, Tier 3 49%)
export const DEMO_DOCUMENTS_ENC003: MedicalDocument[] = [
  {
    id: 'doc-201',
    encounterId: 'enc-003',
    patientId: 'pat-003',
    documentType: 'IMAGING',
    originalFilename: 'Aarogyam_Bilateral_Knee_XRay.jpg',
    qualityScore: 0.93,
    hasHandwriting: false,
    pageCount: 1,
    status: 'PROCESSED',
    ocrConfidence: 0.93,
    degradationTier: 1,
    verificationStatus: 'Extraction Complete',
    extractedFactsCount: 4,
    imageUrl: '/documents/pat003_doc01_aarogyam_xray.jpg',
    extractedTextSnippet: 'AAROGYAM RADIOLOGY INSTITUTE • Weight-bearing Bilateral Knee X-Ray • Impression: Moderate joint space narrowing. Grade 2 Kellgren-Lawrence Osteoarthritis.',
    uploadedAt: '2026-08-15T09:15:00Z',
    processedAt: '2026-08-15T09:18:00Z',
  },
  {
    id: 'doc-202',
    encounterId: 'enc-003',
    patientId: 'pat-003',
    documentType: 'DISCHARGE_SUMMARY',
    originalFilename: 'PMC_Hospital_Discharge_2021.jpg',
    qualityScore: 0.78,
    hasHandwriting: false,
    pageCount: 1,
    status: 'PROCESSED',
    ocrConfidence: 0.78,
    degradationTier: 2,
    verificationStatus: 'Extraction Complete',
    extractedFactsCount: 3,
    imageUrl: '/documents/pat003_doc02_pmc_discharge.jpg',
    extractedTextSnippet: 'PUNE MUNICIPAL GENERAL HOSPITAL • Inpatient Discharge (2021) • Admission for: Acute Febrile Illness (Viral Pyrexia) • Discharged hemodynamically stable.',
    uploadedAt: '2026-08-15T09:16:00Z',
    processedAt: '2026-08-15T09:19:00Z',
  },
  {
    id: 'doc-203',
    encounterId: 'enc-003',
    patientId: 'pat-003',
    documentType: 'PRESCRIPTION',
    originalFilename: 'Verma_Ortho_Clinic_Carbon_Rx_2023.jpg',
    qualityScore: 0.49,
    qualityIssues: ['Faded carbon copy ink', '7.0° skew', 'Low contrast yellow paper'],
    hasHandwriting: true,
    pageCount: 1,
    status: 'PROCESSED',
    ocrConfidence: 0.49,
    degradationTier: 3,
    verificationStatus: 'Verification Required',
    extractedFactsCount: 2,
    imageUrl: '/documents/pat003_doc03_verma_ortho_carbon.jpg',
    rawOcrGarbledText: 'Bilateral knee pain x 20m / Tab. Aceclo~[???] + Para~[???] BD / Tab. Pant~[?] 40 OD / Cap. Calc~[???] 0.25 / Adv: Quad~[ILLEGIBLE]',
    groundTruthText: 'Bilateral knee pain with morning stiffness x 20 mins. Tab. Aceclofenac 100mg + Paracetamol 325mg BD after meals. Tab. Pantoprazole 40mg OD before food. Cap. Calcitriol 0.25mcg OD. Adv: Knee brace + Quad exercises daily.',
    ocrDiscrepancyReason: 'Faded carbon duplicate ink caused fragmentation across NSAID combination and dosage strength fields.',
    extractedTextSnippet: 'Tab. Aceclo~[???] + Para~[???] BD (OCR Garbled)',
    uploadedAt: '2026-08-15T09:17:00Z',
    processedAt: '2026-08-15T09:20:00Z',
  },
]

// 4. Sunita Sharma (enc-004) — 2 documents (Tier 1 95%, Tier 3 62%)
export const DEMO_DOCUMENTS_ENC004: MedicalDocument[] = [
  {
    id: 'doc-301',
    encounterId: 'enc-004',
    patientId: 'pat-004',
    documentType: 'IMAGING',
    originalFilename: 'Dhanvantari_USG_Whole_Abdomen.jpg',
    qualityScore: 0.95,
    hasHandwriting: false,
    pageCount: 1,
    status: 'PROCESSED',
    ocrConfidence: 0.95,
    degradationTier: 1,
    verificationStatus: 'Extraction Complete',
    extractedFactsCount: 4,
    imageUrl: '/documents/pat004_doc01_dhanvantari_usg.jpg',
    extractedTextSnippet: 'DHANVANTARI DIAGNOSTIC ULTRASOUND • USG Whole Abdomen • Liver: Mild diffuse echogenicity (Grade 1 Fatty Liver) • Gallbladder: Normal, no calculi.',
    uploadedAt: '2026-08-15T09:32:00Z',
    processedAt: '2026-08-15T09:35:00Z',
  },
  {
    id: 'doc-302',
    encounterId: 'enc-004',
    patientId: 'pat-004',
    documentType: 'OTHER',
    originalFilename: 'Ayurvaidya_Chikitsalaya_Consultation_Slip.jpg',
    qualityScore: 0.62,
    qualityIssues: ['Mixed Devanagari/Latin handwriting', 'Aged unruled paper', 'Ink bleed'],
    hasHandwriting: true,
    pageCount: 1,
    status: 'PROCESSED',
    ocrConfidence: 0.62,
    degradationTier: 3,
    verificationStatus: 'Verification Required',
    extractedFactsCount: 2,
    imageUrl: '/documents/pat004_doc02_ayurvaidya_chikitsalaya.jpg',
    rawOcrGarbledText: 'Prakriti: Pitta~[??]. Agni~[???] Ajeerna / Avi~[????] Churna 3g BD / Kamad~[???] Ras 1 tab BD / Shank~[?] Vati 2 tab / Avoid [ILLEGIBLE_CHARS]',
    groundTruthText: 'Prakriti: Pitta-Kapha. Agnimandya with Vidagdha Ajeerna (Hyperacidity). 1. Avipattikar Churna 3g BD before meals with lukewarm water. 2. Kamadudha Ras 1 tab BD after meals. 3. Shankha Vati 2 tab SOS for epigastric burning. Pathya: Avoid Ushna, Tikshna, Amla, spicy oily foods.',
    ocrDiscrepancyReason: 'Mixed Devanagari/Latin script annotations caused ligature splitting in botanical formulation abbreviations.',
    extractedTextSnippet: 'Avi~[????] Churna 3g BD, Kamad~[???] Ras (OCR Garbled)',
    uploadedAt: '2026-08-15T09:33:00Z',
    processedAt: '2026-08-15T09:36:00Z',
  },
]

// 5. Aisha Khan (enc-005) — 2 documents (Tier 1 97%, Tier 3 52%)
export const DEMO_DOCUMENTS_ENC005: MedicalDocument[] = [
  {
    id: 'doc-401',
    encounterId: 'enc-005',
    patientId: 'pat-005',
    documentType: 'LAB_REPORT',
    originalFilename: 'National_Labs_Complete_Blood_Count.jpg',
    qualityScore: 0.97,
    hasHandwriting: false,
    pageCount: 1,
    status: 'PROCESSED',
    ocrConfidence: 0.97,
    degradationTier: 1,
    verificationStatus: 'Extraction Complete',
    extractedFactsCount: 5,
    imageUrl: '/documents/pat005_doc01_national_cbc.jpg',
    extractedTextSnippet: 'NATIONAL CLINICAL PATHOLOGY LABS • Automated CBC • Hb: 12.4 g/dL • TLC: 6,800 /cu.mm • Platelet Count: 2.45 Lakhs/cu.mm • Normocytic normochromic.',
    uploadedAt: '2026-08-15T10:02:00Z',
    processedAt: '2026-08-15T10:05:00Z',
  },
  {
    id: 'doc-402',
    encounterId: 'enc-005',
    patientId: 'pat-005',
    documentType: 'PRESCRIPTION',
    originalFilename: 'Kasturba_Maternity_Clinic_Followup_Note.jpg',
    qualityScore: 0.52,
    qualityIssues: ['Low lighting corner shadow', 'Fast clinical cursive', '6.8° skew'],
    hasHandwriting: true,
    pageCount: 1,
    status: 'PROCESSED',
    ocrConfidence: 0.52,
    degradationTier: 3,
    verificationStatus: 'Verification Required',
    extractedFactsCount: 2,
    imageUrl: '/documents/pat005_doc02_kasturba_maternity.jpg',
    rawOcrGarbledText: 'G2P1L1, 24 wks. BP 118/74, FHS: 144 reg / Tab. Au~[???] (Iron) 1 OD / Tab. Shel~[???] 500 1 OD / Review 4 wks with [BLURRED]',
    groundTruthText: 'G2P1L1, 24 wks pregnancy. BP 118/74, Wt 58kg. Fetal Heart Sound (FHS): 144 bpm regular. Tab. Autrin (Iron) 1 OD after dinner x 30 days. Tab. Shelcal 500 1 OD morning after breakfast. Adv: Anomaly Scan USG review in 4 weeks.',
    ocrDiscrepancyReason: 'Low lighting corner shadow and fast clinical cursive obscured prenatal supplement lines.',
    extractedTextSnippet: 'Tab. Au~[???] (Iron) 1 OD, Tab. Shel~[???] (OCR Garbled)',
    uploadedAt: '2026-08-15T10:03:00Z',
    processedAt: '2026-08-15T10:06:00Z',
  },
]

export const ALL_DEMO_DOCUMENTS: MedicalDocument[] = [
  ...DEMO_DOCUMENTS_ENC001,
  ...DEMO_DOCUMENTS_ENC002,
  ...DEMO_DOCUMENTS_ENC003,
  ...DEMO_DOCUMENTS_ENC004,
  ...DEMO_DOCUMENTS_ENC005,
]

// ─── Demo Clinical Facts (Rich Provenance Objects) ─────────────────────────

export const DEMO_FACTS_ENC001: ClinicalFact[] = [
  {
    id: 'fact-001', patientId: 'pat-001', encounterId: 'enc-001',
    factType: 'SYMPTOM', domain: 'HPI', fieldName: 'chief_complaint',
    rawValue: 'Epigastric burning pain & post-prandial indigestion',
    sourceType: 'INTERVIEW', sourceId: 'sess-001',
    confidence: 0.87, confidenceTier: 3,
    verificationStatus: 'UNVERIFIED', conflictStatus: 'NO_CONFLICT',
    eventDatePrecision: 'RELATIVE', createdAt: '2026-08-15T10:24:00Z',
    extractedSnippet: '३ महिन्यांपासून जेवणानंतर पोटात तीव्र जळजळ आणि दुखणे जाणवते (Bhashini Marathi ASR)',
    groundTruthSnippet: 'English translation: Burning epigastric pain occurring 30-45 mins post-prandially for 3 months.',
  },
  {
    id: 'fact-002', patientId: 'pat-001', encounterId: 'enc-001',
    factType: 'MEDICATION', domain: 'MEDICATIONS', fieldName: 'medication_name',
    rawValue: 'Metformin 500 mg twice daily',
    normalizedValue: 'Metformin', valueUnit: 'mg',
    sourceType: 'DOCUMENT_EXTRACT', sourceId: 'doc-001',
    sourceDocumentId: 'doc-001', sourcePage: 1,
    sourceText: '1. Tab. Metformin 500mg - 1 Tab Twice Daily after meals',
    confidence: 0.94, confidenceTier: 1, ocrConfidence: 0.94,
    degradationTier: 1,
    documentImageUrl: '/documents/pat001_doc01_shanti_prescription.jpg',
    verificationStatus: 'UNVERIFIED', conflictStatus: 'NO_CONFLICT',
    eventDatePrecision: 'UNKNOWN', createdAt: '2026-08-15T10:31:00Z',
    extractedSnippet: '1. Tab. Metformin 500mg - 1 Tab Twice Daily after meals [Tier 1 Clean Scan]',
    groundTruthSnippet: 'Clean typed prescription record from Shanti Multispecialty Hospital Pune.',
  },
  {
    id: 'fact-003', patientId: 'pat-001', encounterId: 'enc-001',
    factType: 'MEDICATION', domain: 'MEDICATIONS', fieldName: 'medication_name',
    rawValue: 'Amlodipine 5 mg once daily',
    normalizedValue: 'Amlodipine', valueUnit: 'mg',
    sourceType: 'DOCUMENT_EXTRACT', sourceId: 'doc-001',
    sourceDocumentId: 'doc-001', sourcePage: 1,
    sourceText: '2. Tab. Amlodipine 5mg - 1 Tab Once Daily morning',
    confidence: 0.91, confidenceTier: 1, ocrConfidence: 0.91,
    degradationTier: 1,
    documentImageUrl: '/documents/pat001_doc01_shanti_prescription.jpg',
    verificationStatus: 'UNVERIFIED', conflictStatus: 'NO_CONFLICT',
    eventDatePrecision: 'UNKNOWN', createdAt: '2026-08-15T10:31:00Z',
    extractedSnippet: '2. Tab. Amlodipine 5mg - 1 Tab Once Daily morning',
  },
  {
    id: 'fact-004', patientId: 'pat-001', encounterId: 'enc-001',
    factType: 'LAB_RESULT', domain: 'INVESTIGATIONS', fieldName: 'HbA1c',
    rawValue: '8.4 % (Elevated Glycated Hemoglobin)',
    normalizedValue: '8.4', valueUnit: '%',
    sourceType: 'DOCUMENT_EXTRACT', sourceId: 'doc-002',
    sourceDocumentId: 'doc-002', sourcePage: 1,
    sourceText: 'HbA1c (Glycosylated Hemoglobin): 8.4 % [High, Ref 4.0-5.6]',
    confidence: 0.82, confidenceTier: 2, ocrConfidence: 0.82,
    degradationTier: 2,
    documentImageUrl: '/documents/pat001_doc02_sanjeevani_lab.jpg',
    verificationStatus: 'UNVERIFIED', conflictStatus: 'NO_CONFLICT',
    eventDate: '2025-03-14', eventDatePrecision: 'EXACT',
    createdAt: '2026-08-15T10:32:00Z',
    extractedSnippet: 'HbA1c (Glycosylated Hemoglobin): 8.4 % [High, Ref 4.0-5.6 Interval]',
    groundTruthSnippet: 'Sanjeevani Diagnostic & Pathology Laboratories (Sample Date: 14-MAR-2025).',
  },
  {
    id: 'fact-005', patientId: 'pat-001', encounterId: 'enc-001',
    factType: 'ALLERGY', domain: 'ALLERGIES', fieldName: 'allergy_substance',
    rawValue: 'No known allergy',
    sourceType: 'DOCUMENT_EXTRACT', sourceId: 'doc-001',
    sourceDocumentId: 'doc-001', sourcePage: 1,
    confidence: 0.91, confidenceTier: 1, ocrConfidence: 0.91,
    degradationTier: 1,
    documentImageUrl: '/documents/pat001_doc01_shanti_prescription.jpg',
    verificationStatus: 'UNVERIFIED', conflictStatus: 'IN_CONFLICT',
    eventDatePrecision: 'UNKNOWN', createdAt: '2026-08-15T10:31:00Z',
  },
  {
    id: 'fact-006', patientId: 'pat-001', encounterId: 'enc-001',
    factType: 'ALLERGY', domain: 'ALLERGIES', fieldName: 'allergy_substance',
    rawValue: 'Penicillin',
    sourceType: 'INTERVIEW', sourceId: 'sess-001',
    confidence: 0.89, confidenceTier: 3,
    verificationStatus: 'UNVERIFIED', conflictStatus: 'IN_CONFLICT',
    eventDatePrecision: 'UNKNOWN', createdAt: '2026-08-15T10:26:00Z',
  },
  {
    id: 'fact-007', patientId: 'pat-001', encounterId: 'enc-001',
    factType: 'MEDICATION_HISTORICAL', domain: 'HPI', fieldName: 'prior_dyspepsia_rx',
    rawValue: 'Ranitidine 150mg BD & Gelusil 10ml TDS (Tier 3 Degraded Handwritten)',
    sourceType: 'DOCUMENT_EXTRACT', sourceId: 'doc-003',
    sourceDocumentId: 'doc-003', sourcePage: 1,
    sourceText: 'Tab. Ranit~[??] 150mg BD / Susp. Gelus[???] 10ml TDS',
    confidence: 0.54, confidenceTier: 3, ocrConfidence: 0.54,
    degradationTier: 3,
    documentImageUrl: '/documents/pat001_doc03_district_civil_handwritten.jpg',
    verificationStatus: 'UNVERIFIED', conflictStatus: 'NO_CONFLICT',
    eventDatePrecision: 'APPROXIMATE', createdAt: '2026-08-15T10:25:00Z',
    extractedSnippet: 'Tab. Ranit~[??] 150mg BD / Susp. Gelus[???] 10ml TDS (OCR Garbled)',
    groundTruthSnippet: 'Actual handwritten text: Tab. Ranitidine 150mg BD before meals, Susp. Gelusil 10ml TDS.',
    ocrDiscrepancy: 'Crease fold across prescription lines and doctor cursive caused 46% OCR character loss.',
  },
  {
    id: 'fact-008', patientId: 'pat-001', encounterId: 'enc-001',
    factType: 'LIFESTYLE', domain: 'AYUSH', fieldName: 'ahara_vihara',
    rawValue: 'Ahara: Irregular timing, spicy/fried food; Vihara: High stress, disturbed sleep',
    sourceType: 'INTERVIEW', sourceId: 'sess-001',
    confidence: 0.88, confidenceTier: 3,
    verificationStatus: 'UNVERIFIED', conflictStatus: 'NO_CONFLICT',
    eventDatePrecision: 'RELATIVE', createdAt: '2026-08-15T10:27:00Z',
  },
]

// Facts for Priya Menon (enc-002)
export const DEMO_FACTS_ENC002: ClinicalFact[] = [
  {
    id: 'fact-101', patientId: 'pat-002', encounterId: 'enc-002',
    factType: 'ECG_FINDING', domain: 'CARDIOLOGY', fieldName: 'st_segment_elevation',
    rawValue: 'ST-Elevation > 2.2 mm in Leads V1, V2, V3, V4 (Anteroseptal STEMI)',
    sourceType: 'DOCUMENT_EXTRACT', sourceId: 'doc-101',
    sourceDocumentId: 'doc-101', sourcePage: 1,
    sourceText: 'ST-Elevation > 2.2 mm in Leads V1, V2, V3, V4 (Anteroseptal)',
    confidence: 0.96, confidenceTier: 1, ocrConfidence: 0.96,
    degradationTier: 1,
    documentImageUrl: '/documents/pat002_doc01_sahyadri_ecg.jpg',
    verificationStatus: 'UNVERIFIED', conflictStatus: 'NO_CONFLICT',
    eventDatePrecision: 'EXACT', createdAt: '2026-08-15T10:26:00Z',
    extractedSnippet: 'SAHYADRI EMERGENCY HEART CENTER • 12-LEAD ECG • HR: 112 bpm (Sinus Tachycardia) • ST-Elevation >2.2 mm Leads V1-V4',
    groundTruthSnippet: 'Clean electronic 12-lead ECG telemetry printout from Sahyadri Emergency Heart Center Pune.',
  },
  {
    id: 'fact-102', patientId: 'pat-002', encounterId: 'enc-002',
    factType: 'PRE_HOSPITAL_MED', domain: 'EMERGENCY', fieldName: 'ambulance_meds',
    rawValue: 'Tab. Aspirin 300mg chewed + Tab. Sorbitrate 5mg SL (Paramedic note)',
    sourceType: 'DOCUMENT_EXTRACT', sourceId: 'doc-102',
    sourceDocumentId: 'doc-102', sourcePage: 1,
    sourceText: 'Given: Tab. Asp[???] 300mg chewed, Tab. Sorbi~[??] 5mg SL',
    confidence: 0.58, confidenceTier: 3, ocrConfidence: 0.58,
    degradationTier: 3,
    documentImageUrl: '/documents/pat002_doc02_108_ambulance_triage.jpg',
    verificationStatus: 'UNVERIFIED', conflictStatus: 'NO_CONFLICT',
    eventDatePrecision: 'EXACT', createdAt: '2026-08-15T10:27:00Z',
    extractedSnippet: 'Given: Tab. Asp[???] 300mg chewed, Tab. Sorbi~[??] 5mg SL at 10:08 AM (OCR Garbled)',
    groundTruthSnippet: 'Unit 04: Priya Menon 42F. Given: Tab. Aspirin 300mg chewed at 10:08 AM. Given: Tab. Sorbitrate 5mg SL under tongue. Vitals: BP 146/94, HR 112 bpm, SpO2 93%.',
    ocrDiscrepancy: 'Moisture cup stain ring and hasty shorthand obscured Aspirin timestamp and Sorbitrate dosage strength.',
  },
  {
    id: 'fact-103', patientId: 'pat-002', encounterId: 'enc-002',
    factType: 'SYMPTOM', domain: 'HPI', fieldName: 'acute_chest_pain',
    rawValue: 'Crushing retrosternal chest pain radiating to left arm and jaw x 2 hours',
    sourceType: 'INTERVIEW', sourceId: 'sess-002',
    confidence: 0.94, confidenceTier: 1,
    verificationStatus: 'UNVERIFIED', conflictStatus: 'NO_CONFLICT',
    eventDatePrecision: 'RELATIVE', createdAt: '2026-08-15T10:23:00Z',
    extractedSnippet: 'Mujhe seene mein bahut dard hai, aur dard baayein haath mein bhi ja raha hai.',
    groundTruthSnippet: 'English translation: Severe crushing chest pain radiating to left arm with diaphoresis.',
  },
  {
    id: 'fact-104', patientId: 'pat-002', encounterId: 'enc-002',
    factType: 'VITALS', domain: 'TRIAGE', fieldName: 'emergency_vitals',
    rawValue: 'BP: 146/94 mmHg · HR: 112 bpm · SpO2: 93% Room Air',
    sourceType: 'DOCUMENT_EXTRACT', sourceId: 'doc-102',
    sourceDocumentId: 'doc-102', sourcePage: 1,
    sourceText: 'Vitals: BP 146/94, HR 112 bpm, SpO2 93% room air',
    confidence: 0.72, confidenceTier: 2, ocrConfidence: 0.72,
    degradationTier: 3,
    documentImageUrl: '/documents/pat002_doc02_108_ambulance_triage.jpg',
    verificationStatus: 'UNVERIFIED', conflictStatus: 'NO_CONFLICT',
    eventDatePrecision: 'EXACT', createdAt: '2026-08-15T10:27:00Z',
    extractedSnippet: 'BP 146/94, HR 112 bpm, SpO2 93% on arrival',
    groundTruthSnippet: 'Paramedic triage baseline recording upon ambulance dispatch.',
  },
]

// Facts for Ramesh Kumar (enc-003)
export const DEMO_FACTS_ENC003: ClinicalFact[] = [
  {
    id: 'fact-201', patientId: 'pat-003', encounterId: 'enc-003',
    factType: 'XRAY_FINDING', domain: 'ORTHOPEDICS', fieldName: 'bilateral_knee_oa',
    rawValue: 'Grade 2 Kellgren-Lawrence Osteoarthritis Bilateral Knees',
    sourceType: 'DOCUMENT_EXTRACT', sourceId: 'doc-201',
    sourceDocumentId: 'doc-201', sourcePage: 1,
    sourceText: 'Impression: Moderate medial joint space narrowing with marginal osteophytosis.',
    confidence: 0.93, confidenceTier: 1, ocrConfidence: 0.93,
    degradationTier: 1,
    documentImageUrl: '/documents/pat003_doc01_aarogyam_xray.jpg',
    verificationStatus: 'UNVERIFIED', conflictStatus: 'NO_CONFLICT',
    eventDatePrecision: 'EXACT', createdAt: '2026-08-15T09:18:00Z',
    extractedSnippet: 'AAROGYAM RADIOLOGY INSTITUTE • Weight-bearing Bilateral Knee X-Ray • Grade 2 Osteoarthritis',
    groundTruthSnippet: 'Digital radiology scan from Aarogyam Imaging & Radiology Institute.',
  },
  {
    id: 'fact-202', patientId: 'pat-003', encounterId: 'enc-003',
    factType: 'MEDICATION_HISTORICAL', domain: 'MEDICATIONS', fieldName: 'ortho_pain_rx',
    rawValue: 'Tab. Aceclofenac 100mg + Paracetamol 325mg BD (Tier 3 Carbon Copy)',
    sourceType: 'DOCUMENT_EXTRACT', sourceId: 'doc-203',
    sourceDocumentId: 'doc-203', sourcePage: 1,
    sourceText: 'Tab. Aceclo~[???] + Para~[???] BD',
    confidence: 0.49, confidenceTier: 3, ocrConfidence: 0.49,
    degradationTier: 3,
    documentImageUrl: '/documents/pat003_doc03_verma_ortho_carbon.jpg',
    verificationStatus: 'UNVERIFIED', conflictStatus: 'NO_CONFLICT',
    eventDatePrecision: 'APPROXIMATE', createdAt: '2026-08-15T09:19:00Z',
    extractedSnippet: 'Tab. Aceclo~[???] + Para~[???] BD, Tab. Pant~[?] 40 OD (OCR Garbled)',
    groundTruthSnippet: 'Tab. Aceclofenac 100mg + Paracetamol 325mg BD after meals, Tab. Pantoprazole 40mg OD before food, Cap. Calcitriol 0.25mcg OD.',
    ocrDiscrepancy: 'Faded carbon copy duplicate led to fragmentation of analgesic dosage lines.',
  },
  {
    id: 'fact-203', patientId: 'pat-003', encounterId: 'enc-003',
    factType: 'DISCHARGE_RECORD', domain: 'PMH', fieldName: 'prior_hospitalization',
    rawValue: 'Inpatient Discharge Summary (2021) — Acute Febrile Illness / Viral Pyrexia',
    sourceType: 'DOCUMENT_EXTRACT', sourceId: 'doc-202',
    sourceDocumentId: 'doc-202', sourcePage: 1,
    sourceText: 'PUNE MUNICIPAL GENERAL HOSPITAL • Admission for: Acute Febrile Illness • Discharged hemodynamically stable',
    confidence: 0.78, confidenceTier: 2, ocrConfidence: 0.78,
    degradationTier: 2,
    documentImageUrl: '/documents/pat003_doc02_pmc_discharge.jpg',
    verificationStatus: 'UNVERIFIED', conflictStatus: 'NO_CONFLICT',
    eventDatePrecision: 'APPROXIMATE', createdAt: '2026-08-15T09:19:00Z',
    extractedSnippet: 'PUNE MUNICIPAL GENERAL HOSPITAL • Inpatient Discharge (2021) • Admission for Viral Pyrexia',
    groundTruthSnippet: 'Pune Municipal Corporation General Hospital discharge record.',
  },
  {
    id: 'fact-204', patientId: 'pat-003', encounterId: 'enc-003',
    factType: 'SYMPTOM', domain: 'HPI', fieldName: 'knee_pain_stiffness',
    rawValue: 'Bilateral knee pain with 20-minute morning joint stiffness x 6 months',
    sourceType: 'INTERVIEW', sourceId: 'sess-003',
    confidence: 0.91, confidenceTier: 1,
    verificationStatus: 'UNVERIFIED', conflictStatus: 'NO_CONFLICT',
    eventDatePrecision: 'RELATIVE', createdAt: '2026-08-15T09:12:00Z',
    extractedSnippet: 'दोनों घुटनों में पिछले 6 महीनों से दर्द है, सुबह उठने पर अकड़न रहती है। (Bhashini Hindi ASR)',
    groundTruthSnippet: 'English translation: Bilateral knee pain for past 6 months with morning stiffness resolving in 20 minutes.',
  },
]

// Facts for Sunita Sharma (enc-004)
export const DEMO_FACTS_ENC004: ClinicalFact[] = [
  {
    id: 'fact-301', patientId: 'pat-004', encounterId: 'enc-004',
    factType: 'USG_FINDING', domain: 'GASTROENTEROLOGY', fieldName: 'hepatic_steatosis',
    rawValue: 'Grade 1 Hepatic Steatosis (Fatty Liver)',
    sourceType: 'DOCUMENT_EXTRACT', sourceId: 'doc-301',
    sourceDocumentId: 'doc-301', sourcePage: 1,
    sourceText: 'Impression: Grade 1 Hepatic Steatosis. No evidence of cholelithiasis.',
    confidence: 0.95, confidenceTier: 1, ocrConfidence: 0.95,
    degradationTier: 1,
    documentImageUrl: '/documents/pat004_doc01_dhanvantari_usg.jpg',
    verificationStatus: 'UNVERIFIED', conflictStatus: 'NO_CONFLICT',
    eventDatePrecision: 'EXACT', createdAt: '2026-08-15T09:35:00Z',
    extractedSnippet: 'DHANVANTARI DIAGNOSTIC ULTRASOUND • USG Whole Abdomen • Liver: Mild diffuse echogenicity',
    groundTruthSnippet: 'Digital ultrasound report from Dhanvantari Diagnostic Ultrasound.',
  },
  {
    id: 'fact-302', patientId: 'pat-004', encounterId: 'enc-004',
    factType: 'AYUSH_PRESCRIPTION', domain: 'AYUSH', fieldName: 'herbal_formulation',
    rawValue: 'Avipattikar Churna 3g BD & Kamadudha Ras 1 tab BD (Tier 3 Handwritten)',
    sourceType: 'DOCUMENT_EXTRACT', sourceId: 'doc-302',
    sourceDocumentId: 'doc-302', sourcePage: 1,
    sourceText: 'Avi~[????] Churna 3g BD / Kamad~[???] Ras 1 tab BD',
    confidence: 0.62, confidenceTier: 3, ocrConfidence: 0.62,
    degradationTier: 3,
    documentImageUrl: '/documents/pat004_doc02_ayurvaidya_chikitsalaya.jpg',
    verificationStatus: 'UNVERIFIED', conflictStatus: 'NO_CONFLICT',
    eventDatePrecision: 'APPROXIMATE', createdAt: '2026-08-15T09:36:00Z',
    extractedSnippet: 'Avi~[????] Churna 3g BD, Kamad~[???] Ras 1 tab BD (OCR Garbled)',
    groundTruthSnippet: 'Avipattikar Churna 3g BD before meals with lukewarm water. Kamadudha Ras 1 tab BD. Shankha Vati 2 tab SOS.',
    ocrDiscrepancy: 'Mixed Devanagari/Latin script annotations caused ligature splitting in botanical formulation abbreviations.',
  },
  {
    id: 'fact-303', patientId: 'pat-004', encounterId: 'enc-004',
    factType: 'SYMPTOM', domain: 'HPI', fieldName: 'chronic_dyspepsia',
    rawValue: 'Chronic indigestion, post-prandial fullness, and acid reflux x 1 year',
    sourceType: 'INTERVIEW', sourceId: 'sess-004',
    confidence: 0.90, confidenceTier: 1,
    verificationStatus: 'UNVERIFIED', conflictStatus: 'NO_CONFLICT',
    eventDatePrecision: 'RELATIVE', createdAt: '2026-08-15T09:31:00Z',
    extractedSnippet: 'खाने के बाद पेट भारी लगता है और खट्टी डकारें आती हैं (Bhashini Hindi ASR)',
    groundTruthSnippet: 'English translation: Post-prandial fullness, sour eructations and burning chest sensation for 1 year.',
  },
  {
    id: 'fact-304', patientId: 'pat-004', encounterId: 'enc-004',
    factType: 'AYUSH_ASSESSMENT', domain: 'AYUSH', fieldName: 'prakriti_agni',
    rawValue: 'Pitta-Kapha Prakriti with Vidagdha Ajeerna (Agnimandya Profile)',
    sourceType: 'DOCUMENT_EXTRACT', sourceId: 'doc-302',
    sourceDocumentId: 'doc-302', sourcePage: 1,
    sourceText: 'Prakriti: Pitta-Kapha. Agnimandya with Vidagdha Ajeerna.',
    confidence: 0.68, confidenceTier: 3, ocrConfidence: 0.68,
    degradationTier: 3,
    documentImageUrl: '/documents/pat004_doc02_ayurvaidya_chikitsalaya.jpg',
    verificationStatus: 'UNVERIFIED', conflictStatus: 'NO_CONFLICT',
    eventDatePrecision: 'APPROXIMATE', createdAt: '2026-08-15T09:36:00Z',
    extractedSnippet: 'Ayurvaidya Chikitsalaya Ayurvedic assessment note',
    groundTruthSnippet: 'Ayurvedic constitution and digestion evaluation.',
  },
]

// Facts for Aisha Khan (enc-005)
export const DEMO_FACTS_ENC005: ClinicalFact[] = [
  {
    id: 'fact-401', patientId: 'pat-005', encounterId: 'enc-005',
    factType: 'LAB_RESULT', domain: 'HEMATOLOGY', fieldName: 'hemoglobin',
    rawValue: 'Hemoglobin: 12.4 g/dL · TLC: 6,800 /cu.mm (Normal CBC)',
    sourceType: 'DOCUMENT_EXTRACT', sourceId: 'doc-401',
    sourceDocumentId: 'doc-401', sourcePage: 1,
    sourceText: 'Hemoglobin (Hb): 12.4 g/dL [Normal: 12.0 - 15.0] • TLC: 6,800',
    confidence: 0.97, confidenceTier: 1, ocrConfidence: 0.97,
    degradationTier: 1,
    documentImageUrl: '/documents/pat005_doc01_national_cbc.jpg',
    verificationStatus: 'UNVERIFIED', conflictStatus: 'NO_CONFLICT',
    eventDatePrecision: 'EXACT', createdAt: '2026-08-15T10:05:00Z',
    extractedSnippet: 'NATIONAL CLINICAL PATHOLOGY LABS • Automated CBC • Hb: 12.4 g/dL • TLC: 6,800',
    groundTruthSnippet: 'Clean electronic pathology report from National Clinical Pathology Laboratories Pune.',
  },
  {
    id: 'fact-402', patientId: 'pat-005', encounterId: 'enc-005',
    factType: 'PRENATAL_MED', domain: 'OBSTETRICS', fieldName: 'iron_calcium_supplements',
    rawValue: 'Tab. Autrin (Iron) 1 OD & Tab. Shelcal 500 1 OD (Tier 3 Handwritten)',
    sourceType: 'DOCUMENT_EXTRACT', sourceId: 'doc-402',
    sourceDocumentId: 'doc-402', sourcePage: 1,
    sourceText: 'Tab. Au~[???] (Iron) 1 OD / Tab. Shel~[???] 500 1 OD',
    confidence: 0.52, confidenceTier: 3, ocrConfidence: 0.52,
    degradationTier: 3,
    documentImageUrl: '/documents/pat005_doc02_kasturba_maternity.jpg',
    verificationStatus: 'UNVERIFIED', conflictStatus: 'NO_CONFLICT',
    eventDatePrecision: 'APPROXIMATE', createdAt: '2026-08-15T10:06:00Z',
    extractedSnippet: 'Tab. Au~[???] (Iron) 1 OD, Tab. Shel~[???] 500 1 OD (OCR Garbled)',
    groundTruthSnippet: 'Tab. Autrin (Iron) 1 OD after dinner x 30 days, Tab. Shelcal 500 1 OD morning after breakfast.',
    ocrDiscrepancy: 'Low lighting corner shadow and fast clinical cursive obscured prenatal supplement lines.',
  },
  {
    id: 'fact-403', patientId: 'pat-005', encounterId: 'enc-005',
    factType: 'SYMPTOM', domain: 'OBSTETRICS', fieldName: 'antenatal_followup',
    rawValue: 'Routine second trimester antenatal visit at 24 weeks gestation',
    sourceType: 'INTERVIEW', sourceId: 'sess-005',
    confidence: 0.95, confidenceTier: 1,
    verificationStatus: 'UNVERIFIED', conflictStatus: 'NO_CONFLICT',
    eventDatePrecision: 'EXACT', createdAt: '2026-08-15T10:01:00Z',
    extractedSnippet: 'دوسری سہ ماہی کا باقاعدہ معائنہ، ۲۴ ہفتے (Bhashini Urdu ASR)',
    groundTruthSnippet: 'English translation: Routine second trimester antenatal visit at 24 weeks gestation, G2P1L1.',
  },
  {
    id: 'fact-404', patientId: 'pat-005', encounterId: 'enc-005',
    factType: 'VITALS', domain: 'OBSTETRICS', fieldName: 'prenatal_vitals',
    rawValue: 'BP: 118/74 mmHg · Fetal Heart Sound (FHS): 144 bpm Regular',
    sourceType: 'DOCUMENT_EXTRACT', sourceId: 'doc-402',
    sourceDocumentId: 'doc-402', sourcePage: 1,
    sourceText: 'G2P1L1, 24 wks. BP 118/74, FHS: 144 reg',
    confidence: 0.65, confidenceTier: 3, ocrConfidence: 0.65,
    degradationTier: 3,
    documentImageUrl: '/documents/pat005_doc02_kasturba_maternity.jpg',
    verificationStatus: 'UNVERIFIED', conflictStatus: 'NO_CONFLICT',
    eventDatePrecision: 'EXACT', createdAt: '2026-08-15T10:06:00Z',
    extractedSnippet: 'BP 118/74, FHS: 144 reg',
    groundTruthSnippet: 'Kasturba Memorial Maternity clinical follow-up examination record.',
  },
]

export const ALL_DEMO_FACTS: ClinicalFact[] = [
  ...DEMO_FACTS_ENC001,
  ...DEMO_FACTS_ENC002,
  ...DEMO_FACTS_ENC003,
  ...DEMO_FACTS_ENC004,
  ...DEMO_FACTS_ENC005,
]

// ─── Document & Fact Lookup Utilities ─────────────────────────────────────

export function getDocumentsForEncounter(encounterId: string): MedicalDocument[] {
  switch (encounterId) {
    case 'enc-001': return DEMO_DOCUMENTS_ENC001
    case 'enc-002': return DEMO_DOCUMENTS_ENC002
    case 'enc-003': return DEMO_DOCUMENTS_ENC003
    case 'enc-004': return DEMO_DOCUMENTS_ENC004
    case 'enc-005': return DEMO_DOCUMENTS_ENC005
    default: return DEMO_DOCUMENTS_ENC001
  }
}

export function getFactsForEncounter(encounterId: string): ClinicalFact[] {
  switch (encounterId) {
    case 'enc-001': return DEMO_FACTS_ENC001
    case 'enc-002': return DEMO_FACTS_ENC002
    case 'enc-003': return DEMO_FACTS_ENC003
    case 'enc-004': return DEMO_FACTS_ENC004
    case 'enc-005': return DEMO_FACTS_ENC005
    default: return DEMO_FACTS_ENC001
  }
}

export function getEvidenceItemById(id: string): { fact?: ClinicalFact; document?: MedicalDocument } | null {
  const fact = ALL_DEMO_FACTS.find(f => f.id === id)
  if (fact) {
    // If this fact points to a document, link it
    const doc = fact.sourceDocumentId ? ALL_DEMO_DOCUMENTS.find(d => d.id === fact.sourceDocumentId) : undefined
    return { fact, document: doc }
  }

  const document = ALL_DEMO_DOCUMENTS.find(d => d.id === id)
  if (document) {
    // Find matching fact if available
    const relatedFact = ALL_DEMO_FACTS.find(f => f.sourceDocumentId === document.id)
    return { fact: relatedFact, document }
  }

  return null
}

// ─── Demo Conflict ─────────────────────────────────────────────────────────

export const DEMO_CONFLICTS_ENC001: ClinicalConflict[] = [
  {
    id: 'conf-001',
    patientId: 'pat-001',
    encounterId: 'enc-001',
    conflictType: 'VALUE_MISMATCH',
    fieldLabel: 'Allergy Status',
    factA: DEMO_FACTS_ENC001[4], // No known allergy (document)
    factB: DEMO_FACTS_ENC001[5], // Penicillin (interview)
    detectedAt: '2026-08-15T10:33:00Z',
    resolutionStatus: 'PENDING',
  },
]

// ─── Demo Timeline ─────────────────────────────────────────────────────────

export const DEMO_TIMELINE_ENC001: TimelineEvent[] = [
  { id: 'tl-001', eventDate: '2010-01-01', datePrecision: 'APPROXIMATE', title: 'Appendectomy', detail: 'Pune Civil Hospital — Discharge Summary 2010', sourceType: 'DOCUMENT_EXTRACT', sourceId: 'doc-003' },
  { id: 'tl-002', eventDate: '2018-01-01', datePrecision: 'APPROXIMATE', title: 'Quit smoking', detail: 'Patient reported — 20 pack-year history', sourceType: 'INTERVIEW', sourceId: 'sess-001' },
  { id: 'tl-003', eventDate: '2019-01-01', datePrecision: 'APPROXIMATE', title: 'Type 2 Diabetes Mellitus diagnosed', sourceType: 'DOCUMENT_EXTRACT', sourceId: 'doc-001' },
  { id: 'tl-004', eventDate: '2022-06-01', datePrecision: 'APPROXIMATE', title: 'Admitted — Civil Hospital Pune (severe anemia)', sourceType: 'DOCUMENT_EXTRACT', sourceId: 'doc-003' },
  { id: 'tl-005', eventDate: '2025-01-01', datePrecision: 'APPROXIMATE', title: 'Hemoglobin 11.2 g/dL (low)', sourceType: 'DOCUMENT_EXTRACT', sourceId: 'doc-002' },
  { id: 'tl-006', eventDate: '2025-03-14', datePrecision: 'EXACT', title: 'HbA1c 8.4% · Fasting glucose 148 mg/dL', detail: 'Both above normal range', sourceType: 'DOCUMENT_EXTRACT', sourceId: 'doc-002' },
  { id: 'tl-007', eventDate: '2026-08-15', datePrecision: 'EXACT', title: 'Allergy conflict detected — Penicillin', isConflict: true, sourceType: 'INTERVIEW', sourceId: 'sess-001' },
]

// ─── Demo Red Flag (for enc-002 / Priya Menon) ────────────────────────────

export const DEMO_RED_FLAG_ENC002: RedFlagAlert = {
  id: 'alert-001',
  encounterId: 'enc-002',
  patientId: 'pat-002',
  ruleId: 'CARDIAC_001',
  ruleName: 'Possible cardiac event',
  triggerText: 'Mujhe seene mein bahut dard hai, aur dard baayein haath mein bhi ja raha hai.',
  triggerLanguage: 'hi',
  triggerTextTranslated: 'I have severe chest pain, and the pain is also going to my left arm.',
  severity: 'HIGH',
  status: 'PENDING',
  alertedAt: '2026-08-15T10:31:00Z',
}

// ─── Demo Completeness ─────────────────────────────────────────────────────

export const DEMO_COMPLETENESS_ENC001: CompletenessEntry[] = [
  { domain: 'CHIEF_COMPLAINT', label: 'Chief Complaint', status: 'COLLECTED', sourceTiers: [3] },
  { domain: 'HPI', label: 'History of Present Illness', status: 'COLLECTED', sourceTiers: [3] },
  { domain: 'MEDICATIONS', label: 'Current Medications', status: 'COLLECTED', sourceTiers: [2, 3] },
  { domain: 'ALLERGIES', label: 'Allergies', status: 'CONFLICT', sourceTiers: [2, 3] },
  { domain: 'PMH', label: 'Past Medical History', status: 'PARTIAL', sourceTiers: [2, 3] },
  { domain: 'SURGICAL', label: 'Surgical History', status: 'COLLECTED', sourceTiers: [2] },
  { domain: 'FAMILY', label: 'Family History', status: 'NOT_COLLECTED' },
  { domain: 'SOCIAL', label: 'Social History', status: 'PARTIAL', sourceTiers: [3] },
  { domain: 'ROS', label: 'Review of Systems', status: 'PARTIAL', sourceTiers: [3] },
  { domain: 'AYUSH', label: 'AYUSH Assessment', status: 'NOT_APPLICABLE' },
]

// ─── Demo Triage Queue ─────────────────────────────────────────────────────

export const DEMO_TRIAGE_QUEUE: TriageQueueEntry[] = [
  {
    encounterId: 'enc-002', patient: DEMO_PATIENTS[1], tokenNumber: '23',
    chiefComplaint: 'Chest pain, breathlessness', arrivedAt: '2026-08-15T10:22:00Z',
    waitMinutes: 9, sessionState: 'UNDER_PHYSICIAN_REVIEW',
    hasActiveAlert: true, activeAlert: DEMO_RED_FLAG_ENC002,
    completeness: [],
  },
  {
    encounterId: 'enc-001', patient: DEMO_PATIENTS[0], tokenNumber: '31',
    chiefComplaint: 'Epigastric pain, 3 months', arrivedAt: '2026-08-15T10:14:00Z',
    waitMinutes: 28, sessionState: 'READY_FOR_REVIEW',
    hasActiveAlert: false, completeness: DEMO_COMPLETENESS_ENC001,
  },
  {
    encounterId: 'enc-003', patient: DEMO_PATIENTS[2], tokenNumber: '28',
    chiefComplaint: 'Knee pain, fatigue', arrivedAt: '2026-08-15T09:10:00Z',
    waitMinutes: 52, sessionState: 'READY_FOR_REVIEW',
    hasActiveAlert: false, completeness: [],
  },
]

// ─── Demo Admin Metrics ───────────────────────────────────────────────────

export const DEMO_ADMIN_METRICS: AdminMetrics = {
  encountersToday: 38,
  encountersCompleted: 24,
  encountersInProgress: 9,
  alertsToday: 3,
  avgIntakeDurationSec: 872,
  ayushSessions: 6,
  documentsProcessed: 41,
  documentsProcessingNow: 4,
  documentsFailed: 2,
  avgOcrConfidence: 0.83,
}

// ─── Demo Integration Status ──────────────────────────────────────────────

export const DEMO_INTEGRATIONS: IntegrationStatus[] = [
  { name: 'Bhashini ASR', description: 'Speech-to-text — primary', status: 'OPERATIONAL', latencyMs: 214, uptimePercent: 99.8, lastChecked: '2026-08-15T10:42:00Z' },
  { name: 'Whisper ASR (Fallback)', description: 'Speech-to-text fallback', status: 'OPERATIONAL', latencyMs: 480, uptimePercent: 99.9, lastChecked: '2026-08-15T10:42:00Z' },
  { name: 'Bhashini TTS', description: 'Text-to-speech', status: 'OPERATIONAL', latencyMs: 320, uptimePercent: 99.7, lastChecked: '2026-08-15T10:42:00Z' },
  { name: 'Google Document AI', description: 'OCR + extraction', status: 'DEGRADED', latencyMs: 2100, uptimePercent: 98.2, lastChecked: '2026-08-15T10:42:00Z', lastError: '502 Bad Gateway — 10:21 AM' },
  { name: 'ABDM Sandbox', description: 'ABHA identity lookup', status: 'DEGRADED', latencyMs: 890, uptimePercent: 95.1, lastChecked: '2026-08-15T10:42:00Z' },
  { name: 'FHIR Export Service', description: 'Internal FHIR generation', status: 'OPERATIONAL', latencyMs: 54, uptimePercent: 100, lastChecked: '2026-08-15T10:42:00Z' },
  { name: 'HIS Adapter (Mock)', description: 'Hospital system sync', status: 'OPERATIONAL', latencyMs: 412, uptimePercent: 100, lastChecked: '2026-08-15T10:42:00Z' },
]

// ─── Demo Audit Events ─────────────────────────────────────────────────────

export const DEMO_AUDIT_EVENTS: AuditEvent[] = [
  { id: 'evt-001', timestamp: '2026-08-15T10:45:02Z', eventType: 'CLINICAL', description: 'Case approved — Dhananjay Patil (ENC-0829)', actor: 'Dr. R. Mehta', patientName: 'D. Patil', patientId: 'pat-001', resourceId: 'enc-001' },
  { id: 'evt-002', timestamp: '2026-08-15T10:42:33Z', eventType: 'INTEGRATION', description: 'HIS sync successful — ENC-0829-1042', actor: 'System', patientId: 'pat-001', resourceId: 'HIS-ENC-0829' },
  { id: 'evt-003', timestamp: '2026-08-15T10:38:47Z', eventType: 'TRIAGE', description: 'Alert acknowledged — Assessed stable', actor: 'Nurse S. Kumar', patientName: 'P. Menon', patientId: 'pat-002', resourceId: 'alert-001' },
  { id: 'evt-004', timestamp: '2026-08-15T10:38:12Z', eventType: 'TRIAGE', description: 'Triage alert triggered — CARDIAC_001', actor: 'System', patientName: 'P. Menon', patientId: 'pat-002', resourceId: 'alert-001' },
  { id: 'evt-005', timestamp: '2026-08-15T10:26:43Z', eventType: 'CLINICAL', description: 'Conflict detected — allergy status', actor: 'System', patientId: 'pat-001', resourceId: 'conf-001' },
  { id: 'evt-006', timestamp: '2026-08-15T10:24:00Z', eventType: 'CLINICAL', description: 'Interview session started', actor: 'System', patientId: 'pat-001', resourceId: 'sess-001' },
  { id: 'evt-007', timestamp: '2026-08-15T10:22:15Z', eventType: 'CLINICAL', description: 'Consent recorded — English', actor: 'System', patientId: 'pat-002', resourceId: 'cons-001' },
  { id: 'evt-008', timestamp: '2026-08-15T10:14:32Z', eventType: 'AUTH', description: 'Physician login', actor: 'Dr. R. Mehta', resourceId: 'auth-001' },
]

// ─── Demo Interview Questions ─────────────────────────────────────────────

export const DEMO_QUESTIONS: Question[] = [
  {
    id: 'q-001', code: 'HPI_ONSET_DURATION', domain: 'HPI', pathway: 'ABDOMINAL_PAIN',
    text: { en: 'How long have you had this pain?', hi: 'यह दर्द आपको कितने समय से है?', mr: 'हे दुखणे तुम्हाला किती दिवसांपासून आहे?' },
    questionType: 'SINGLE_CHOICE',
    options: [
      { id: 'less-1w', label: { en: 'Less than 1 week', hi: '1 हफ्ते से कम', mr: '1 आठवड्यापेक्षा कमी' } },
      { id: '1-4w', label: { en: '1–4 weeks', hi: '1–4 हफ्ते', mr: '1–4 आठवडे' } },
      { id: '1-3m', label: { en: '1–3 months', hi: '1–3 महीने', mr: '1–3 महिने' } },
      { id: 'gt-3m', label: { en: 'More than 3 months', hi: '3 महीने से अधिक', mr: '3 महिन्यांपेक्षा जास्त' } },
    ],
    isRedFlagRelevant: false, isAyush: false,
  },
  {
    id: 'q-002', code: 'HPI_SEVERITY', domain: 'HPI',
    text: { en: 'How severe is the pain on a scale of 1 to 10?', hi: 'दर्द की तीव्रता 1 से 10 के पैमाने पर कितनी है?', mr: 'वेदना 1 ते 10 च्या प्रमाणात किती तीव्र आहे?' },
    questionType: 'NUMERIC',
    isRedFlagRelevant: false, isAyush: false,
  },
  {
    id: 'q-003', code: 'RED_FLAG_CHEST_RADIATION', domain: 'HPI', pathway: 'CHEST_PAIN',
    text: { en: 'Does the pain spread to your arm, jaw, or neck?', hi: 'क्या दर्द आपके हाथ, जबड़े या गर्दन तक फैलता है?' },
    questionType: 'SINGLE_CHOICE',
    options: [
      { id: 'yes', label: { en: 'Yes', hi: 'हाँ' } },
      { id: 'no', label: { en: 'No', hi: 'नहीं' } },
      { id: 'not-sure', label: { en: "I'm not sure", hi: 'मुझे नहीं पता' } },
    ],
    isRedFlagRelevant: true, isAyush: false,
  },
  {
    id: 'q-004', code: 'AYUSH_AHARA_FREQUENCY', domain: 'AYUSH', isAyush: true,
    text: { en: 'How often do you eat, and at what times?', hi: 'आप आमतौर पर कब और कितनी बार खाना खाते हैं?', mr: 'तुम्ही साधारणपणे कधी आणि किती वेळा जेवता?' },
    questionType: 'SINGLE_CHOICE',
    options: [
      { id: 'two-meals', label: { en: '2 main meals, sometimes breakfast', hi: '2 मुख्य भोजन, कभी-कभी नाश्ता' } },
      { id: 'three-meals', label: { en: '3 regular meals at fixed times', hi: '3 नियमित भोजन तय समय पर' } },
      { id: 'irregular', label: { en: 'Irregular — no fixed times', hi: 'अनियमित — कोई निश्चित समय नहीं' } },
      { id: 'one-meal', label: { en: '1 meal a day only', hi: 'दिन में केवल 1 बार' } },
    ],
    isRedFlagRelevant: false,
  },
]
