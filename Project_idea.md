# MediKiosk (SIH26047): Deep Real-World Production & Winning Strategy Audit

## PART 1 — PATIENT POV: WILL ANYONE ACTUALLY BE ABLE TO USE THIS?

This is the most important question. The problem statement is explicitly about **illiterate, elderly, disabled, and first-time digital users**. If the kiosk fails them, nothing else matters. Here is a parameter-by-parameter assessment.

### 1.1 Visual Accessibility

| Parameter | Current State (per audit) | Real-World Requirement | Gap Severity |
|---|---|---|---|
| **Font size** | 70+ instances below 14px; 11.5px–13.5px common | 18px floor for body, 28px+ for questions (design brief target) | 🔴 **Critical** |
| **Contrast** | Not audited, but small text compounds the issue | WCAG 2.1 AA minimum (4.5:1 for normal text, 3:1 for large) | 🟡 **High** |
| **Icons** | Icon-driven UI is claimed | Must be universally understood anatomical illustrations, not abstract symbols | 🟡 **High** |
| **Magnification** | None | Pinch-zoom or built-in magnification (NHS kiosks offer this) | 🟡 **Medium** |
| **Screen reader support** | 1 `aria-live` in entire kiosk flow; no `role="alert"` on red-flag interrupt | `aria-live` on question transitions, `role="alert"` on emergency, focus indicators | 🔴 **Critical** |

The font size issue is the single most damaging patient-facing flaw. A 70-year-old with uncorrected presbyopia — common in government OPD populations — cannot read 11.5px text on a tablet at arm's length. **This alone makes the kiosk unusable for the target demographic.**

### 1.2 Auditory Accessibility

| Parameter | Current State | Requirement | Gap |
|---|---|---|---|
| **Auto-speak on screen mount** | **Zero of 7 kiosk screens auto-speak.** The main intake speaker button is a 2.4-second animation with no audio. | Every screen must auto-announce its purpose | 🔴 **Demo-blocking** |
| **Bhashini integration** | Only 2 files use `speechSynthesis` (browser API), both hardcoded to Hindi regardless of selected language. No Bhashini call in the kiosk flow. | Bhashini Indic TTS as primary, with on-device fallback | 🔴 **Critical** |
| **Language consistency** | 6 UI translations (en, hi, mr, gu, bn, ta) but idiom corpus only covers Hindi (25) and Marathi (25). | Audio must match the selected language; idiom corpus must cover all UI languages | 🔴 **Critical** |
| **Hearing impairment** | No visual feedback other than voice; no sign language avatar or text alternative | Sign language video, text captions, vibration alerts (stretch goal per PS) | 🟡 **Medium** |
| **Deaf/blind users** | No Braille, no tactile instructions, no audio jack | Audio jack, adjustable volume, Braille/tactile instructions (per MyGov accessibility guidelines) | 🟡 **Medium** |

The audit's finding that the **primary intake screen's speaker button is decorative** is the single most likely demo failure. A Ministry of Ayush evaluator whose problem statement is *"illiterate and elderly patients cannot read"* will tap that icon. When silence follows, every claim becomes suspect.

### 1.3 Motor & Physical Accessibility

| Parameter | Current State | Requirement | Gap |
|---|---|---|---|
| **Touch target size** | Not audited, but small fonts suggest small targets | Minimum 48x48dp (WCAG); larger for elderly/disabled | 🟡 **High** |
| **Keyboard/switch access** | No focus indicators, no skip-links | Full keyboard navigation, visible focus | 🟡 **Medium** |
| **Gestures** | Implied touch-only | Alternative input: head tracking, eye gaze, switch access | 🟡 **Low** (stretch) |
| **Physical kiosk height** | Unknown (software-only prototype) | Wheelchair-accessible height, reachable controls | 🟡 **Production concern** |

### 1.4 Cognitive & Literacy Accessibility

| Parameter | Current State | Requirement | Gap |
|---|---|---|---|
| **"Other / Type your answer" escape hatch** | Missing on choice modules | **Essential** — a patient whose complaint isn't in the four cards has no truthful path forward | 🔴 **Critical** |
| **Simplified text** | Not audited | Plain language, contextual definitions, synonym recommendations | 🟡 **High** |
| **Error recovery** | Unknown | Patient must be able to undo/correct without starting over | 🟡 **High** |
| **Progress indication** | Unknown | "Step 3 of 6" with visual progress bar | 🟡 **Medium** |
| **Time pressure** | 6-turn / 3-minute cap (hardcoded) | No time pressure; allow patient to proceed at their pace | 🟡 **Medium** |

The missing "Other" escape hatch is a **patient-safety issue**, not a UX nicety. A rigid choice grid forces a patient to pick the closest wrong option, and that wrong chief complaint enters the clinical summary. This is indefensible.

### 1.5 Trust & Dignity

| Parameter | Current State | Requirement | Gap |
|---|---|---|---|
| **Privacy in shared OPD hall** | No visible mute control; audio auto-plays (when implemented) | Persistent mute, privacy screen, headphone jack | 🟡 **High** |
| **Consent explanation** | Hardcoded Hindi string; no multilingual consent audio | Full consent read aloud in selected language with "Yes"/"No" confirmation | 🔴 **Critical** |
| **No judgment** | Kiosk doesn't judge, which is good | Must not feel like an interrogation; empathetic tone | 🟡 **Medium** |
| **Staff assistance fallback** | None | "Press for help" button that alerts a human | 🟡 **High** |

### 1.6 Environmental Resilience

| Parameter | Current State | Requirement | Gap |
|---|---|---|---|
| **ASR in 85–95 dB OPD noise** | Relies on Bhashini ASR; no noise-adaptive fallback tested | Directional mic array + confidence-triggered visual fallback (α < 0.70) | 🔴 **Critical** |

**Real-world evidence:** In Ranchi, 4 of 8 digital kiosks costing ₹24 lakh were lying broken for months, and 2 token machines (₹4 lakh each) were non-functional, forcing patients back into 30+ minute queues. An article from the field notes: *"A kiosk in a village with no internet or a health worker who doesn't know how to use it — that's just expensive equipment gathering dust"*.

### 1.7 The "Illiterate Patient" Walkthrough — Honest Assessment

**Scenario:** A 68-year-old woman from a rural area, no formal education, speaks only Marathi, has never used a smartphone, arrives with a plastic bag of old prescriptions.

| Step | What Happens Today | What Should Happen |
|---|---|---|
| **Language select** | She sees 6 text buttons. No audio auto-plays. She cannot read. | Kiosk auto-speaks in all 6 languages sequentially: "Please touch the language you speak." She touches Marathi. |
| **ABHA identify** | Text prompt: "Enter your ABHA ID." She has never heard of ABHA. | Kiosk speaks: "Please show your ABHA card or your mobile number. If you don't have one, touch the green button to continue." |
| **Consent** | Hardcoded Hindi audio (not Marathi). Text-only green/grey buttons. | Full consent audio in Marathi, with large green "Yes" and grey "No" buttons. Audio confirms: "You said yes. Thank you." |
| **Intake questions** | Question text appears. Speaker button is decorative (no audio). She cannot read the options. | Question auto-speaks in Marathi. Options read aloud in order. Touch cards are large, with icons. If she taps the wrong one, she can undo. |
| **Review** | Text summary appears. No audio. | Audio: "Please check your answers. If anything is wrong, touch the pencil to change it." |
| **Document scan** | "Only printed laboratory reports can be scanned." She has handwritten prescriptions. **Rejected.** | "If you have any prescriptions or reports, hold them up to the camera. We will save them for your doctor." Handwritten docs attached as images, visible to doctor. |
| **Token** | Kiosk announces "A-028" in all languages (hardcoded). | Kiosk reads actual token from variable, with estimated wait time and room number. |

**Verdict:** Today, she cannot complete the kiosk journey. With the fixes above, she could — but only if the voice is real, the fonts are readable, the escape hatch exists, and handwritten documents are accepted.

---

## PART 2 — JUDGE & MENTOR POV: WHAT THEY WILL PROBE

### 2.1 SIH Evaluation Criteria (Official)

SIH 2026 evaluation criteria include: **novelty of the idea, complexity, clarity and details in the prescribed format, feasibility, practicability, sustainability, scale of impact, user experience, and potential for future work progression**. Teams are also assessed on **innovation, relevance, technical feasibility, implementation approach, scalability, societal/industrial impact, and quality of presentation**.

### 2.2 Mapping MediKiosk Against These Criteria

| Criterion | Current Standing | What Moves to "Winning" |
|---|---|---|
| **Novelty** | **Medium** — NAMASTE↔ICD-11 is not unique; folk-idiom layer is | Reframe pitch around **folk-idiom→clinical-entity layer** + **noise-adaptive voice/touch arbitration** as primary novelties |
| **Complexity** | **High** — deterministic FSM, red-flag engine, FHIR R4, DPDP compliance | This is genuinely complex; emphasize it |
| **Feasibility** | **Medium (weakest)** — known challenges (offline, handwritten docs, silent RAG degradation) unaddressed | Fix OCR tiering, PWA offline, loud retrieval failure |
| **Practicability** | **Medium** — kiosk form factor is right, but deployment realities ignored | Add remote monitoring, auto-restart, spare tablet, staff training plan |
| **Sustainability** | **Low** — no business model, no maintenance plan | Add operational cost model (< ₹0.40/patient), remote diagnostics, fleet management |
| **Scale of Impact** | **High** — 93.95 crore ABHA users, 30,000+ Ayush dispensaries | Add concrete before/after metrics (consultation time: 4 min → 45 sec) |
| **User Experience** | **Low** — fonts too small, voice fake, no escape hatch | **Fix Tier 1 items first** |
| **Future Work** | **Medium** — Pandi (pulse), Nadi Pariksha integration mentioned as stretch | Add roadmap: Pandi integration, Nadi Pariksha, multi-system (Unani/Siddha) expansion |

### 2.3 The Five Questions Judges Will Ask — And Current Standing

**Q1: "What if the patient's phrase isn't in your idiom database?"**
- **Today:** Silently returns nothing. This is the flagship feature failing silently.
- **Winning Answer:** *"We never guess a code we aren't confident in. The system surfaces an explicit `unresolved` state to the physician as free text, flagged for manual coding. This is safer than hallucinating a wrong NAMASTE code."*

**Q2: "What about handwritten prescriptions?"**
- **Today:** Rejected with an error message.
- **Winning Answer:** *"We tier our document handling. Printed lab reports get full extraction. Printed prescriptions get partial extraction (drug names, dosages) attached as 'patient-supplied, unverified.' Handwritten documents are attached as images in the FHIR bundle as `DocumentReference`, visible to the doctor. We never refuse a patient's document."*

**Q3: "What happens when the network drops?"**
- **Today:** No answer.
- **Winning Answer:** *"We ship a PWA with an offline intake queue. Bhashini is our primary TTS; we fall back to on-device WebSpeech so the kiosk always talks. Intake continues offline and syncs when connectivity returns. In district hospitals, connectivity is intermittent — we designed for that."*

**Q4: "How do you know your Ayush classification is clinically correct?"**
- **Today:** No validation story.
- **Winning Answer:** *"We had our Agni/Koshtha scoring weights reviewed by [named BAMS practitioner]. We are also aligning with the WHO ICD-11 TM2 module and the NAMASTE portal's dual-coding standard. Our next step is a formal validation study with AIIA."* **This is a phone call, not a sprint — make it before the hackathon.**

**Q5: "Isn't this just a chatbot with extra steps?"**
- **Today:** You have a genuinely excellent answer but haven't rehearsed it.
- **Winning Answer:** *"No. The LLM never makes a clinical decision. We use a deterministic 6-turn finite state machine with entropy-ranked slot selection. Red flags are hardcoded rules, not probabilistic outputs. Every summary line traces back to its source audio or document bounding box via cryptographic pointers. The LLM is restricted to language generation in JSON mode — it is a scribe, not a diagnostician. This is why we can claim 'draft, never diagnose' and mean it."*

### 2.4 Red Flags Evaluators Will Notice

| Red Flag | Where It Is |
|---|---|
| **Physician login never checks passcode** | Any `doctor_id` yields a valid 8-hour token. Security hole. |
| **Hardcoded admin key committed to public repo** | `"medikiosk-admin-key-2026"` — judges who grep will find it. |
| **Hardcoded token `'A-028'` in all 6 languages** | Kiosk announces the same token to every patient. Demo failure. |
| **Two parallel intake flows** | `kiosk/intake/page.tsx` (1,261 lines) and `patient/intake/interview/page.tsx` (351 lines). Pick one. |
| **Dead Vite scaffolding** | `src/App.tsx`, `src/main.tsx`, `src/screens/` — leftovers from pre-Next.js. |
| **Frontend↔backend disconnected** | `api-client.ts` exports `mockAdapter`; summary is not computed by real engines. |

---

## PART 3 — RESEARCH LANDSCAPE: WHAT EXISTS AND WHERE THE GAPS ARE

### 3.1 Conversational AI for Clinical History Taking

| Paper | Approach | Findings | Gap for MediKiosk |
|---|---|---|---|
| **Note2Chat** (arXiv, 2026) | Multi-turn clinical history taking via single-turn reasoning | Chain-of-reasoning slot-filling prevents conversational drift. GPT-4o achieves 49.0% top-1 diagnostic accuracy. | Trained on Western, Allopathic datasets (MIMIC-III). Will fail on Marathi/Ayurvedic terms. |
| **DocAgent-XAI** (ACM, 2026) | Entropy-guided agentic RAG for adaptive, explainable history taking | Lowest diagnostic error rate (4.3%), highest clinical quality scores. | Requires structured reasoning and guideline grounding — MediKiosk's deterministic FSM is philosophically aligned but less sophisticated. |
| **JMIR Prompt Design Study** (2026) | Qwen3-14B with detailed prompts + thinking mode | Detailed prompt + thinking mode achieves 72.3% information coverage vs. 51-54% for minimal/rule-based. | Coverage is lower for multisystem presentations and past medical/family history. MediKiosk's 6-turn cap may truncate deeper questioning. |
| **LUMEN** (2026) | Conversational AI for collateral histories in dementia | Mean SUS score 78.1/100. Seven open-source LLMs benchmarked. | Designed for dementia, not Ayush. But the stakeholder-informed, clinician-oversight model is directly applicable. |

**Gap identified:** No existing conversational AI system has been trained or validated on **Ayurvedic clinical terminology or vernacular Indian folk idioms**. This is MediKiosk's genuine research contribution opportunity.

### 3.2 Prakriti Assessment & Ayurvedic Ontologies

| Paper | Approach | Findings | Gap |
|---|---|---|---|
| **AI in Prakriti Assessment** (ScienceDirect, 2026) | NLP, voice analysis, sentiment analysis for dosha-specific tendencies | Vata: rapid/scattered speech; Pitta: assertive/concise; Kapha: slow/deliberate. Emotional stability via facial expressions, voice tone, HRV. | No real-world validation in OPD settings. No integration with conversational intake. |
| **AI-Driven Ayurvedic Advisor** (GitHub) | Chatbot for Prakriti assessment | Prakruti Analyzer + NLP chatbot | Requires smartphone literacy. Not designed for low-literacy users. |
| **AyurTalk** | SVM/KNN-based Prakriti assessment | Uses pulse data + user input | Hardware-dependent (pulse sensor). Not kiosk-compatible. |
| **Dual Coding FHIR Framework** (IEEE, 2026) | Bidirectional NAMASTE↔ICD-11 TM2 dual coding | FHIR R4-compliant terminology integration | Backend architecture only. No patient-facing frontend. |

**Gap identified:** No system extracts **Dashavidha Pariksha parameters conversationally** in a real-world OPD setting. MediKiosk's approach of weaving lifestyle questions into the intake is novel but unvalidated.

### 3.3 Speech Recognition in Noisy Clinical Environments

| Paper | Findings | Gap |
|---|---|---|
| **Robust ASR for Visual Acuity Testing** (IEEE, 2025) | Multi-speaker clinical environments remain challenging due to overlapping speech and ambient noise. | Not specific to OPD intake. |
| **IndicWav2Vec Degradation** (arXiv, 2026) | Robust multilingual model degrades up to 40.94% WER on rural clinical telephony speech from India. | **Critical for MediKiosk** — your primary ASR engine has documented high error rates on exactly the population you serve. |
| **When De-noising Hurts** (HuggingFace, 2025) | Modern ASR models have internal noise robustness; speech enhancement may remove acoustic features critical for ASR. | Suggests **not** applying traditional denoising; instead use confidence-triggered fallback. |

**Gap identified:** No published system combines **noise-adaptive ASR confidence thresholds** with **visual touch-card fallback** for Indian OPD environments. MediKiosk's α < 0.70 threshold is conceptually sound but untested.

### 3.4 Digital Health Kiosk Deployment in India

| Source | Findings | Gap |
|---|---|---|
| **Ranchi Kiosk Failure** (Bhaskar, 2026) | 4 of 8 kiosks broken for months; 2 token machines non-functional. Patients back to 30+ minute queues. | Maintenance, uptime, and staff training are bigger barriers than technology. |
| **BSF Health ATM Initiative** (2026) | 50+ diagnostic tests in minutes; reduces dependence on distant centres. Scalability and maintenance remain key challenges. | No clinical history intake — diagnostics only. |
| **Cloud-Connected Smart Health Kiosk** (Zenodo) | 50 rural areas, 250,000 patients, 18 months. Travel time reduced from 32 km to 1.5 km; out-of-pocket costs minimized by 68%. | No Ayush integration. No conversational intake. |
| **Fogg Behavior Model Study** (2025) | Health kiosk adoption influenced by Motivation, Ability, and Prompts. Trust is a key factor. | No Ayush-specific kiosk adoption study exists. |

**Gap identified:** No published study on **Ayush-specific kiosk adoption** or **trust dynamics in government OPD settings**. This is a research opportunity.

---

## PART 4 — NEW INNOVATION IDEAS BASED ON RESEARCH GAPS

### 4.1 Innovation 1: "Silent Mode" Fallback for Noise-Resilient Intake

**Research basis:** IndicWav2Vec degrades up to 40.94% WER on rural speech. Traditional denoising can hurt ASR.

**Innovation:** A **"Silent Mode"** that activates when ambient noise exceeds 85 dB or ASR confidence drops below 0.70. Instead of repeating the question, the kiosk:
1. Displays a **sequence of large visual cards** representing the likely answers based on prior responses
2. Patient **taps through** a visual decision tree (body diagram → symptom character → duration)
3. Each tap **triggers a short audio confirmation** (e.g., "Chest pain, two days. Correct?")
4. If the patient nods/taps "Yes," the slot is filled without any speech recognition

**Why this wins:** It directly addresses the #1 environmental failure mode (noise) with a solution that requires **zero literacy** — the patient recognizes body parts and pain characters visually.


### 4.4 Innovation 4: "Document Triage" — Never Reject a Patient's Paper

**Research basis:** Real patients carry handwritten prescriptions, faded lab reports, discharge summaries, and hospital bills. OCR on Indian cursive handwriting is a 10-year research problem.

**Innovation:** A **tiered document pipeline**:

| Tier | Document Type | Behaviour |
|---|---|---|
| **Full extraction** | Printed lab report | Structured biomarkers, reference ranges, temporal sort |
| **Partial extraction** | Printed prescription | Drug names + dosages via NER, attached as "patient-supplied, unverified" |
| **Attach-only** | Handwritten / other | Image stored, attached as `DocumentReference` in FHIR bundle, visible to doctor as "Unparsed document — view image" |

**Why this wins:** It directly answers the judge question *"What happens with handwritten prescriptions?"* with a graceful degradation story instead of a rejection message. It also generates **real-world OCR training data** for future model improvement.

### 4.5 Innovation 5: "Guardian Mode" — Assisted Intake for Severely Disabled Patients

**Research basis:** Kiosk accessibility studies show visual impairment requires voice support + high contrast; hearing impairment requires non-voice feedback + sign language.

**Innovation:** A **staff-assisted mode** where a hospital volunteer or ASHA worker:
1. Authenticates with their own ID
2. Guides the patient through the intake (voice + touch)
3. Their presence is recorded in the audit log (transparency)
4. The patient still **verbally confirms consent** and **taps the final submit**

**Why this wins:** It acknowledges the reality that some patients — severely disabled, extremely elderly, or in acute distress — **cannot** use a kiosk independently. Providing a dignified assisted path is better than forcing independence or excluding them. The Fogg Behavior Model study confirms that **Prompts and Ability** drive adoption.

### 4.7 Innovation 7: "Ayush-SOCRATES" Dual-Track Mapping with Severity Auto-Grading

**Research basis:** SOCRATES framework for pain assessment; Dashavidha Pariksha for Ayush assessment. No system maps both in real time.

**Innovation:** Every symptom input is processed through **two parallel lenses**:
- **Allopathic (SOCRATES):** Site, Onset, Character, Radiation, Associations, Timing, Exacerbating factors, Severity
- **Ayush (Dashavidha Core-4):** Agni, Koshtha, Prakriti/Vikriti, Ahara-Vihara

The system **auto-grades severity** (mild/moderate/severe) based on:
- Patient's self-report (1–10 scale)
- Symptom character (crushing chest pain = high severity)
- Duration (acute vs. chronic)
- Associated red flags (dyspnoea, radiation to arm)

**Why this wins:** It demonstrates **clinical depth** that generic chatbots lack, and it directly answers *"How is your AI doing Ayush history taking?"* with a concrete, auditable algorithm.

---

## PART 5 — REVISED WINNING STRATEGY ROADMAP

### Tier 1 — Patient-Blocking (Fix First)

| # | Item | Effort | Impact |
|---|---|---|---|
| 1 | **Real TTS in `useVoiceAgent` hook** — auto-speak on mount across all 7 kiosk screens, cancel-before-speak, persistent mute | 2 hours | Demo works |
| 2 | **Kiosk font-size pass** — 18px floor, 28px+ questions; lint rule banning `text-[1[0-3]` | 1 hour | Patient can read |
| 3 | **"Other / Type your answer"** on every choice module | 2 hours | Patient safety |
| 4 | **Fix auth holes** — verify passcode, delete hardcoded admin key | 10 min | Security |
| 5 | **Pick one intake flow** — delete/quarantine the other; remove dead Vite scaffolding | 1 hour | Demo clarity |

### Tier 2 — Credibility (Judges Will Probe)

| # | Item | Effort | Impact |
|---|---|---|---|
| 6 | **ChromaDB + MiniLM + loud failure + `/health/retrieval`** | 3 hours | Semantic matching works |
| 7 | **OCR tiering** — stop rejecting prescriptions and handwritten docs | 2 hours | Judge Q2 answered |
| 8 | **Expand idioms to 600–1,000 across 6 languages** with `transliteration` and `source_type` | 4 hours | Flagship feature works |
| 9 | **Curate 250–400 real NAMASTE codes** including Unani and Siddha | 3 hours | Standards compliance |
| 10 | **PWA manifest + service worker + offline queue** | 3 hours | Judge Q3 answered |

### Tier 3 — Differentiation (Winning)

| # | Item | Effort | Impact |
|---|---|---|---|
| 11 | **Wire frontend→backend** — summary computed by real FSM/RAG/scoring engines | 4 hours | "Proven architecture" |
| 12 | **Innovation 4: Document Triage** — attach-only tier for handwritten docs | 1 hour | Graceful degradation |
| 13 | **Innovation 5: Guardian Mode** — assisted intake for severely disabled | 2 hours | Inclusivity |
| 14 | **`aria-live` + `role="alert"` + focus indicators** | 1 hour | Accessibility reviewer wins |
| 15 | **One clinician validation conversation** — quote on slide | 30 min | Highest impact-per-hour |

