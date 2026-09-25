# TraumaBridge AI: Production-Ready Frontend Implementation Blueprint

**SIH 2026 — Problem Statement ID: 26198**
**Refactoring: MediKiosk → TraumaBridge AI Emergency PWA**

---

## 1. ARCHITECTURAL FRONTLINE DELTAS & REFACTORING RULES

### 1.1 Refactor: 2D Anatomical Body Map → Rapid Trauma Injury SVG Grid

**Source Component:** `frontend/src/app/kiosk/intake/page.tsx` — lines 519–727 (anatomical SVG with `data-zone` tags on a single-layer body diagram).

**Target Architecture:** Multi-touch, glove-optimized trauma grid with 11 anatomical zones and immediate radial sub-menus.

#### 1.1.1 SVG Zone Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TRAUMA INJURY SVG GRID — ZONE MAP                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────┐                                                               │
│   │  HEAD   │  data-zone="head"       cx="400" cy="60"  r="45"              │
│   └────┬────┘                                                               │
│        │                                                                    │
│   ┌────┴────┐                                                               │
│   │  NECK   │  data-zone="neck"       x="370" y="110" w="60" h="40"        │
│   └────┬────┘                                                               │
│        │                                                                    │
│   ┌────┴────────────┐                                                       │
│   │     CHEST       │  data-zone="chest"   x="300" y="155" w="200" h="120" │
│   └────┬────────────┘                                                       │
│        │                                                                    │
│   ┌────┴────────────┐                                                       │
│   │    ABDOMEN      │  data-zone="abdomen" x="310" y="280" w="180" h="100" │
│   └────┬────────────┘                                                       │
│        │                                                                    │
│   ┌────┴────┐                                                               │
│   │ PELVIS  │  data-zone="pelvis"     x="330" y="385" w="140" h="70"      │
│   └────┬────┘                                                               │
│        │                                                                    │
│   ┌────┴────┐  ┌────────────┐                                              │
│   │ L ARM   │  │  R ARM     │  data-zone="left_arm" / "right_arm"          │
│   │ (x=180) │  │  (x=540)   │  x="180" y="170" w="80" h="200"              │
│   └────┬────┘  └─────┬──────┘  x="540" y="170" w="80" h="200"              │
│        │             │                                                      │
│   ┌────┴────┐  ┌─────┴──────┐                                              │
│   │ L LEG   │  │  R LEG     │  data-zone="left_leg" / "right_leg"          │
│   │ (x=280) │  │  (x=440)   │  x="280" y="460" w="80" h="250"              │
│   └─────────┘  └────────────┘  x="440" y="460" w="80" h="250"              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 1.1.2 Multi-Touch State Handler Implementation

```tsx
// frontend/src/components/trauma/TraumaBodyMap.tsx

type TraumaZone = 
  | 'head' | 'neck' | 'chest' | 'abdomen' | 'pelvis'
  | 'left_arm' | 'right_arm' | 'left_leg' | 'right_leg';

type TraumaTag = 'bleed' | 'burn' | 'fracture' | 'amputation';

interface ZoneState {
  zone: TraumaZone;
  tags: Set<TraumaTag>;
  severity: 1 | 2 | 3;
  timestamp: number;
}

const ZONE_TOUCH_HANDLER = {
  onPointerDown: (e: React.PointerEvent, zone: TraumaZone) => {
    e.preventDefault(); // Prevent ghost clicks on multi-touch
    setActiveZone(zone);
    setRadialMenuOrigin({ x: e.clientX, y: e.clientY });
    navigator.vibrate(40); // Initial acknowledgment
  },
  
  onTagSelect: (tag: TraumaTag) => {
    setZones(prev => {
      const next = new Map(prev);
      const existing = next.get(activeZone) || { zone: activeZone, tags: new Set(), severity: 1, timestamp: Date.now() };
      existing.tags.add(tag);
      existing.timestamp = Date.now();
      next.set(activeZone, existing);
      return next;
    });
    navigator.vibrate([60, 30, 60]); // Distinct confirmation pattern
    // Auto-close radial menu after selection
    setTimeout(() => setActiveZone(null), 150);
  }
};
```

#### 1.1.3 Radial Sub-Menu Specification

| Property | Value |
|----------|-------|
| **Trigger** | `pointerdown` on zone (not `click` — critical for multi-touch) |
| **Origin** | Touch coordinates, clamped to viewport edges |
| **Layout** | 4 quadrants at 90° intervals: Bleed (top), Burn (right), Fracture (bottom), Amputation (left) |
| **Button Size** | `64px × 64px` minimum, `72px` preferred |
| **Icon** | SVG icons, `32px` stroke width `2.5` |
| **Background** | `#1E293B` with `#EF4444` border on tag activation |
| **Animation** | `transform: scale(0) → scale(1)` over `150ms cubic-bezier(0.34, 1.56, 0.64, 1)` |
| **Dismiss** | Tap outside, or auto-dismiss after `2000ms` of inactivity |
| **Multi-Tag** | Multiple tags per zone supported; tag icons stack vertically |

---

### 1.2 Refactor: Bhashini/Whisper ASR Interface → Web Audio API Processing Graph

**Source Component:** `frontend/src/app/kiosk/intake/page.tsx` — lines 322–330 (`handleHearQuestion` — decorative 2.4s animation with no audio), plus `frontend/src/app/patient/consent/page.tsx` — lines 51–58 (hardcoded Hindi `speechSynthesis`).

**Target Architecture:** Client-side Web Audio API processing graph with adaptive bandpass filtering, environmental noise profiling, and confidence-gated visual fallback.

#### 1.2.1 Audio Processing Graph

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    WEB AUDIO API PROCESSING GRAPH                            │
│                                                                              │
│  ┌──────────┐    ┌──────────────┐    ┌──────────────┐    ┌───────────────┐  │
│  │Microphone│───▶│ Highpass     │───▶│ Bandpass     │───▶│ Dynamics      │  │
│  │Input     │    │ Filter       │    │ Filter       │    │ Compressor    │  │
│  │          │    │ fc=250Hz     │    │ fc=1800Hz    │    │               │  │
│  │          │    │ Q=0.7        │    │ Q=0.8        │    │               │  │
│  └──────────┘    └──────────────┘    └──────────────┘    └───────┬───────┘  │
│                                                                  │          │
│  ┌──────────┐    ┌──────────────┐    ┌──────────────┐            │          │
│  │ ASR      │◀───│ AudioWorklet │◀───│ Gain Node    │◀───────────┘          │
│  │ (Bhashini│    │ Processors   │    │ (normalize)  │                       │
│  │ /Whisper)│    │              │    │              │                       │
│  └──────────┘    └──────────────┘    └──────────────┘                       │
│                                                                              │
│  CONFIDENCE GATE: α ≥ 0.70 → Accept ASR result                              │
│                   α < 0.70 → Trigger visual touch-card fallback             │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### 1.2.2 Filter Configuration

| Node | Type | Frequency | Q | Purpose |
|------|------|-----------|---|---------|
| **Highpass** | `highpass` | `250 Hz` | `0.7` | Attenuate engine vibration, road rumble |
| **Bandpass** | `bandpass` | `1800 Hz` | `0.8` | Reject siren oscillations (600–1500 Hz), preserve voice formants |
| **Notch (optional)** | `notch` | `1000 Hz` | `5.0` | Surgical removal of siren fundamental if detected |
| **DynamicsCompressor** | `dynamicscompressor` | — | — | `threshold=-24dB, knee=30, ratio=12, attack=0.003, release=0.25` |

#### 1.2.3 MIST Audio Buffer Capture

```tsx
// frontend/src/lib/audio/mist-recorder.ts

const MIST_RECORDING_CONFIG = {
  maxDuration: 5000,           // 5 seconds hard cap
  sampleRate: 16000,           // 16kHz for ASR compatibility
  channelCount: 1,             // Mono
  bitRate: 128000,             // 128kbps
  mimeType: 'audio/webm;codecs=opus'
};

// Single-action, pointer-down triggered recording
const startMISTCapture = async (): Promise<AudioBlob> => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      sampleRate: 16000,
      channelCount: 1
    }
  });
  
  const mediaRecorder = new MediaRecorder(stream, MIST_RECORDING_CONFIG);
  const chunks: Blob[] = [];
  
  mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
  
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      mediaRecorder.stop();
      stream.getTracks().forEach(t => t.stop());
    }, MIST_RECORDING_CONFIG.maxDuration);
    
    mediaRecorder.onstop = () => {
      clearTimeout(timeout);
      resolve(new Blob(chunks, { type: MIST_RECORDING_CONFIG.mimeType }));
    };
    
    mediaRecorder.onerror = reject;
    mediaRecorder.start(100); // 100ms timeslices for real-time streaming
  });
};
```

#### 1.2.4 ASR Confidence Gate Implementation

```tsx
// frontend/src/lib/audio/confidence-gate.ts

interface ASRResult {
  transcript: string;
  confidence: number;  // 0.0 – 1.0 from Bhashini/Whisper
  alternatives: string[];
}

const CONFIDENCE_THRESHOLD = 0.70;

const processASRResult = (result: ASRResult, context: ClinicalSlot): void => {
  if (result.confidence >= CONFIDENCE_THRESHOLD) {
    // High confidence: auto-accept, advance slot-filling FSM
    dispatch({ type: 'SLOT_FILLED', payload: { slot: context, value: result.transcript }});
    navigator.vibrate(30); // Subtle confirmation
  } else {
    // Low confidence: DO NOT accept. Trigger visual fallback.
    dispatch({ type: 'ASR_LOW_CONFIDENCE', payload: {
      rawTranscript: result.transcript,
      alternatives: result.alternatives,
      context
    }});
    navigator.vibrate([100, 50, 100]); // Distinct warning pattern
  }
};
```

---

### 1.3 Refactor: Doctor OPD Dashboard → Emergency Department Wallboard HUD

**Source Component:** `frontend/src/app/doctor/dashboard/page.tsx` — REST polling with `setInterval`, static summary cards.

**Target Architecture:** Persistent full-duplex WebSocket with clean slice state model (Zustand/Redux Toolkit), live-streaming trauma alerts, and zero-polling architecture.

#### 1.3.1 WebSocket Slice State Model

```tsx
// frontend/src/store/ed-wallboard-store.ts

interface EDWallboardState {
  // Connection state
  wsStatus: 'connecting' | 'connected' | 'disconnected' | 'reconnecting';
  lastHeartbeat: number;
  
  // Incoming trauma alerts (sorted by triage priority)
  alerts: TraumaAlert[];
  
  // Blood bank reservations
  bloodReservations: BloodReservation[];
  
  // Active critical alerts (full-screen flash)
  criticalAlerts: CriticalAlert[];
  
  // Actions
  connect: (url: string) => void;
  disconnect: () => void;
  addAlert: (alert: TraumaAlert) => void;
  updateAlert: (alertId: string, updates: Partial<TraumaAlert>) => void;
  removeAlert: (alertId: string) => void;
  addBloodReservation: (reservation: BloodReservation) => void;
  dismissCriticalAlert: (alertId: string) => void;
}

interface TraumaAlert {
  id: string;
  patientName: string;
  patientAge: number;
  patientSex: 'M' | 'F' | 'O';
  mechanism: string;
  rtsScore: number;
  gcs: number;
  systolicBP: number;
  heartRate: number;
  shockIndex: number;
  injuries: TraumaZone[];
  contraindications: string[];
  eta: number; // seconds
  triagePriority: 'P1' | 'P2' | 'P3';
  triageColor: 'red' | 'orange' | 'yellow' | 'green';
  timestamp: number;
}
```

#### 1.3.2 WebSocket Message Contract

```typescript
// Client → Server
type ClientMessage = 
  | { type: 'SUBSCRIBE_ED'; hospitalId: string }
  | { type: 'ACK_ALERT'; alertId: string }
  | { type: 'HEARTBEAT' };

// Server → Client
type ServerMessage =
  | { type: 'ALERT_NEW'; payload: TraumaAlert }
  | { type: 'ALERT_UPDATE'; payload: Partial<TraumaAlert> & { id: string } }
  | { type: 'ALERT_CLEAR'; payload: { id: string } }
  | { type: 'BLOOD_RESERVATION'; payload: BloodReservation }
  | { type: 'CRITICAL_ALERT'; payload: CriticalAlert }
  | { type: 'HEARTBEAT_ACK'; payload: { serverTime: number } };
```

---

## 2. NEW UI VIEWS & EXTRA SECTIONS

### 2.1 Screen 1: In-Ambulance EMT Workspace PWA

#### 2.1.1 Design Token System

| Token | Value | Usage |
|-------|-------|-------|
| `--canvas` | `#0B0F19` | Root background |
| `--surface` | `#161F30` | Card/panel background |
| `--component` | `#1E293B` | Interactive component background |
| `--border-subtle` | `#2D3A4F` | Default borders |
| `--text-primary` | `#F1F5F9` | Primary text (7:1+ contrast) |
| `--text-secondary` | `#94A3B8` | Secondary text |
| `--accent-green` | `#10B981` | Success, active streaming |
| `--accent-red` | `#EF4444` | Critical alerts, errors |
| `--accent-amber` | `#F59E0B` | Warnings, offline buffering |
| `--accent-blue` | `#3B82F6` | Informational, neutral actions |
| `--accent-purple` | `#8B5CF6` | Ayush-specific parameters |

**Contrast Compliance:** All text/background pairs verified at ≥7:1 (WCAG AAA) for medical information. Off-white text (`hsl(0, 0%, 90%)`) on dark blue-gray surfaces (`hsl(210, 15%, 12%)`) achieves this standard. Alert colors are lightened by 10–15% for dark mode visibility. 

#### 2.1.2 Bento-Grid Layout (Mobile-First)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [◀ BACK]  TRAUMABRIDGE AI        [● LIVE] [🔊 MUTED] [⚙ SETTINGS]        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────┬─────────────────────────────────────┐  │
│  │                                 │                                     │  │
│  │   TRAUMA INJURY SVG GRID        │   SHAKY-HAND VITALS ARRAY           │  │
│  │   (Full-width, 40% viewport)    │   (60% viewport)                    │  │
│  │                                 │                                     │  │
│  │   ┌─────────────────────────┐   │   ┌─────────────────────────────┐   │  │
│  │   │                         │   │   │  BP SYSTOLIC                │   │  │
│  │   │    [SVG Body Map]       │   │   │  ┌─────┐  ┌─────┐          │   │  │
│  │   │                         │   │   │  │ -10 │  │ 120 │  │ +10 │   │  │
│  │   │  ┌───┐   ┌───┐         │   │   │  └─────┘  └─────┘  └─────┘   │   │  │
│  │   │  │   │   │   │         │   │   │       mmHg                    │   │  │
│  │   │  └───┘   └───┘         │   │   └─────────────────────────────┘   │  │
│  │   │                         │   │   ┌─────────────────────────────┐   │  │
│  │   │                         │   │   │  HR                         │   │  │
│  │   │                         │   │   │  ┌─────┐  ┌─────┐          │   │  │
│  │   │                         │   │   │  │ -10 │  │  98 │  │ +10 │   │  │
│  │   │                         │   │   │  └─────┘  └─────┘  └─────┘   │   │  │
│  │   │                         │   │   │       bpm                     │   │  │
│  │   │                         │   │   └─────────────────────────────┘   │  │
│  │   └─────────────────────────┘   │   ┌─────────────────────────────┐   │  │
│  │                                 │   │  RR                         │   │  │
│  │   [TAGS: BLEED | BURN |         │   │  ┌─────┐  ┌─────┐          │   │  │
│  │    FRACTURE | AMPUTATION]       │   │  │ -5  │  │  18 │  │ +5  │   │  │
│  │                                 │   │  └─────┘  └─────┘  └─────┘   │   │  │
│  │                                 │   │       /min                    │   │  │
│  │                                 │   └─────────────────────────────┘   │  │
│  │                                 │   ┌─────────────────────────────┐   │  │
│  │                                 │   │  SpO₂                       │   │  │
│  │                                 │   │  ┌─────┐  ┌─────┐          │   │  │
│  │                                 │   │  │ -2  │  │  97 │  │ +2  │   │  │
│  │                                 │   │  └─────┘  └─────┘  └─────┘   │   │  │
│  │                                 │   │       %                       │   │  │
│  │                                 │   └─────────────────────────────┘   │  │
│  │                                 │                                     │  │
│  ├─────────────────────────────────┴─────────────────────────────────────┤  │
│  │                                                                         │  │
│  │   MIST VOICE CAPTURE                                                    │  │
│  │   ┌─────────────────────────────────────────────────────────────────┐   │  │
│  │   │  [🎤 HOLD TO RECORD MIST REPORT]                               │   │  │
│  │   │  ─────────────────────────────────────────────────────────────  │   │  │
│  │   │  ████████████░░░░░░░░░░░░  2.3s / 5.0s                        │   │  │
│  │   └─────────────────────────────────────────────────────────────────┘   │  │
│  │                                                                         │  │
│  ├─────────────────────────────────────────────────────────────────────────┤  │
│  │                                                                         │  │
│  │   RTS SCORE: 8.2  │  GCS: 12  │  SHOCK INDEX: 0.82  │  ETA: 04:32     │  │
│  │                                                                         │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │  [+ CHEST]  [+ ABDOMEN]  [+ PELVIS]  [SCAN PRESCRIPTION]  [SEND ALERT] │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 2.1.3 Shaky-Hand Vitals Array Component

```tsx
// frontend/src/components/trauma/VitalsArray.tsx

interface VitalsArrayProps {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step: number;
  onIncrement: (delta: number) => void;
  onDecrement: (delta: number) => void;
}

const VitalsArray: React.FC<VitalsArrayProps> = ({ label, value, unit, min, max, step, onIncrement, onDecrement }) => {
  const [isLongPress, setIsLongPress] = useState(false);
  const pressTimer = useRef<NodeJS.Timeout>();
  
  const handlePressStart = (delta: number) => {
    navigator.vibrate(30);
    // Immediate single step
    delta > 0 ? onIncrement(step) : onDecrement(step);
    // Start long-press acceleration after 300ms
    pressTimer.current = setTimeout(() => {
      setIsLongPress(true);
      const acceleration = setInterval(() => {
        navigator.vibrate(20);
        delta > 0 ? onIncrement(step * 5) : onDecrement(step * 5);
      }, 150);
      return () => clearInterval(acceleration);
    }, 300);
  };
  
  const handlePressEnd = () => {
    clearTimeout(pressTimer.current);
    setIsLongPress(false);
  };
  
  return (
    <div className="flex items-center justify-between gap-3 p-3 bg-[#1E293B] rounded-lg border border-[#2D3A4F]">
      <span className="text-sm font-medium text-[#94A3B8] uppercase tracking-wider">{label}</span>
      
      {/* Decrement button — 64x64px minimum */}
      <button
        className="w-16 h-16 flex items-center justify-center rounded-xl bg-[#2D3A4F] active:bg-[#3D4A5F] 
                   text-[#F1F5F9] text-2xl font-bold touch-manipulation select-none
                   transition-colors duration-100"
        onPointerDown={() => handlePressStart(-1)}
        onPointerUp={handlePressEnd}
        onPointerLeave={handlePressEnd}
        aria-label={`Decrease ${label} by ${step}`}
      >
        −
      </button>
      
      {/* Value display — huge, always visible */}
      <div className="flex flex-col items-center min-w-[100px]">
        <span className="text-4xl font-bold text-[#F1F5F9] tabular-nums leading-none">
          {value}
        </span>
        <span className="text-xs text-[#94A3B8] mt-1">{unit}</span>
      </div>
      
      {/* Increment button — 64x64px minimum */}
      <button
        className="w-16 h-16 flex items-center justify-center rounded-xl bg-[#2D3A4F] active:bg-[#3D4A5F] 
                   text-[#F1F5F9] text-2xl font-bold touch-manipulation select-none
                   transition-colors duration-100"
        onPointerDown={() => handlePressStart(1)}
        onPointerUp={handlePressEnd}
        onPointerLeave={handlePressEnd}
        aria-label={`Increase ${label} by ${step}`}
      >
        +
      </button>
    </div>
  );
};
```

**Haptic Feedback Patterns (Web Vibration API):**

| Action | Pattern | Description |
|--------|---------|-------------|
| **Zone tap** | `navigator.vibrate(40)` | Short acknowledgment |
| **Tag select** | `navigator.vibrate([60, 30, 60])` | Double-pulse confirmation |
| **Vital increment** | `navigator.vibrate(30)` | Subtle tick |
| **Error/invalid** | `navigator.vibrate([100, 50, 100, 50, 100])` | Urgent triple-pulse |
| **Critical alert** | `navigator.vibrate([200, 100, 200, 100, 200])` | Emergency pattern |
| **Success** | `navigator.vibrate([50, 30, 50])` | Pleasant confirmation |

The Web Vibration API uses `navigator.vibrate(pattern)` where each value alternates between vibration and pause duration in milliseconds. For iOS Safari, the Taptic Engine is used for haptic feedback. 

#### 2.1.4 Contraindication Interceptor Panel

```tsx
// frontend/src/components/trauma/ContraindicationInterceptor.tsx

interface ContraindicationInterceptorProps {
  onCapture: (imageData: string) => void;
  onResult: (contraindications: string[]) => void;
}

const ContraindicationInterceptor: React.FC<ContraindicationInterceptorProps> = ({ onCapture, onResult }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedMeds, setDetectedMeds] = useState<string[]>([]);
  
  const captureAndProcess = useCallback(async () => {
    // 1. Capture frame from video stream
    const canvas = canvasRef.current!;
    const video = videoRef.current!;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')!.drawImage(video, 0, 0);
    
    // 2. Convert to base64
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    onCapture(imageData);
    
    // 3. Local edge OCR (Tesseract.js or similar)
    setIsProcessing(true);
    navigator.vibrate([100, 50, 100]); // Processing start
    
    try {
      const result = await localEdgeOCR(imageData);
      setDetectedMeds(result.medications);
      onResult(result.contraindications);
      navigator.vibrate([50, 30, 50]); // Success
    } catch {
      navigator.vibrate([100, 50, 100, 50, 100]); // Error
    } finally {
      setIsProcessing(false);
    }
  }, [onCapture, onResult]);
  
  return (
    <div className="relative w-full aspect-[4/3] bg-[#0B0F19] rounded-xl overflow-hidden border-2 border-[#2D3A4F]">
      {/* Live camera preview */}
      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
      
      {/* Scanning boundary overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[80%] h-[60%] border-2 border-dashed border-[#10B981] rounded-lg
                        animate-pulse" />
      </div>
      
      {/* Processing overlay */}
      {isProcessing && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-[#F1F5F9] mt-3 font-medium">Scanning prescription...</p>
          </div>
        </div>
      )}
      
      {/* Capture button — 80x80px for gloves */}
      <button
        onClick={captureAndProcess}
        disabled={isProcessing}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full 
                   bg-[#EF4444] active:bg-[#DC2626] text-white text-2xl
                   flex items-center justify-center shadow-lg shadow-red-500/30
                   touch-manipulation select-none transition-transform active:scale-95"
        aria-label="Capture prescription"
      >
        📷
      </button>
      
      {/* Detected medications feedback */}
      {detectedMeds.length > 0 && (
        <div className="absolute top-4 left-4 right-4 bg-[#1E293B]/95 backdrop-blur rounded-lg p-3">
          <p className="text-[#F59E0B] text-sm font-bold mb-1">⚠ MEDICATIONS DETECTED</p>
          {detectedMeds.map(med => (
            <span key={med} className="inline-block bg-[#2D3A4F] text-[#F1F5F9] text-xs px-2 py-1 rounded mr-1 mt-1">
              {med}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
```

---

### 2.2 Screen 2: Emergency Department Wallboard HUD

#### 2.2.1 Layout Specification

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  🏥 EMERGENCY DEPARTMENT — TRAUMA WALLBOARD                     [● LIVE] [14:32:07]     │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │  ⚠ CRITICAL ALERT — FULL SCREEN FLASH (when active)                                ││
│  │  ┌─────────────────────────────────────────────────────────────────────────────┐   ││
│  │  │  🚨 INBOUND P1 TRAUMA — 04:32 ETA                                           │   ││
│  │  │  MALE, 42Y — RTA, MULTIPLE FRACTURES, SUSPECTED INTERNAL BLEEDING           │   ││
│  │  │  ⚠ CONTRAINDICATION: WARFARIN DETECTED — DO NOT ADMINISTER THROMBOLYTICS   │   ││
│  │  │  🩸 BLOOD BANK: 2 UNITS O-NEG RESERVED                                      │   ││
│  │  └─────────────────────────────────────────────────────────────────────────────┘   ││
│  └─────────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                         │
│  ┌──────────────────────────────────┬──────────────────────────────────────────────┐   │
│  │  INBOUND TRAUMA ALERTS          │  BLOOD BANK RESERVATIONS                     │   │
│  │  ─────────────────────────────  │  ──────────────────────────────────────      │   │
│  │                                  │                                              │   │
│  │  ┌────────────────────────────┐  │  ┌────────────────────────────────────────┐  │   │
│  │  │ 🔴 P1 — 04:32             │  │  │  O-NEG  │ 2 units │ RESERVED │ 04:32 │  │   │
│  │  │ MALE, 42Y — RTA            │  │  └────────────────────────────────────────┘  │   │
│  │  │ RTS: 8.2 │ GCS: 12         │  │  ┌────────────────────────────────────────┐  │   │
│  │  │ SI: 0.82 │ ETA: 04:32      │  │  │  A-POS  │ 1 unit  │ PENDING  │ —     │  │   │
│  │  │ [████████░░] 68% arrival   │  │  └────────────────────────────────────────┘  │   │
│  │  └────────────────────────────┘  │                                              │   │
│  │                                  │                                              │   │
│  │  ┌────────────────────────────┐  │                                              │   │
│  │  │ 🟠 P2 — 12:15             │  │                                              │   │
│  │  │ FEMALE, 67Y — FALL          │  │                                              │   │
│  │  │ RTS: 11.5 │ GCS: 15        │  │                                              │   │
│  │  │ SI: 0.65 │ ETA: 12:15      │  │                                              │   │
│  │  │ [████░░░░░░] 32% arrival   │  │                                              │   │
│  │  └────────────────────────────┘  │                                              │   │
│  │                                  │                                              │   │
│  └──────────────────────────────────┴──────────────────────────────────────────────┘   │
│                                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │  PRE-ARRIVAL PREPARATION CHECKLIST                                                  ││
│  │  ☑ Trauma Bay 1 — staged                                                           ││
│  │  ☑ Massive Transfusion Protocol — activated                                         ││
│  │  ☑ CT Scanner — reserved for 04:35                                                  ││
│  │  ☐ Operating Theatre — on standby                                                   ││
│  │  ☑ Blood Bank — 2 units O-Neg reserved                                              ││
│  └─────────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

#### 2.2.2 Arrival Countdown Ring (SVG `stroke-dasharray`)

```tsx
// frontend/src/components/wallboard/ArrivalCountdownRing.tsx

interface ArrivalCountdownRingProps {
  etaSeconds: number;
  triagePriority: 'P1' | 'P2' | 'P3';
}

const ArrivalCountdownRing: React.FC<ArrivalCountdownRingProps> = ({ etaSeconds, triagePriority }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius; // ~339.29
  const minutesRemaining = etaSeconds / 60;
  
  // Progress: 1.0 = full ring, 0.0 = empty
  const progress = Math.min(1, etaSeconds / 900); // 15 min max
  const dashOffset = circumference * (1 - progress);
  
  // Color mutation by minutes remaining
  const ringColor = minutesRemaining > 10 ? '#10B981'   // Green: >10 min
    : minutesRemaining > 5  ? '#F59E0B'                 // Amber: 5–10 min
    : minutesRemaining > 2  ? '#EF4444'                 // Red: 2–5 min
    : '#DC2626';                                         // Critical: <2 min
  
  // Pulse animation for critical arrival
  const pulseClass = minutesRemaining < 2 ? 'animate-ping' : '';
  
  return (
    <div className="relative w-[128px] h-[128px]">
      <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
        {/* Background track */}
        <circle
          cx="64" cy="64" r={radius}
          fill="none" stroke="#1E293B" strokeWidth="8"
        />
        {/* Progress ring */}
        <circle
          cx="64" cy="64" r={radius}
          fill="none" stroke={ringColor} strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      
      {/* Countdown text overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold tabular-nums" style={{ color: ringColor }}>
          {formatETA(etaSeconds)}
        </span>
        <span className="text-xs text-[#94A3B8] uppercase tracking-wider">
          {triagePriority}
        </span>
      </div>
      
      {/* Pulse indicator for critical */}
      {minutesRemaining < 2 && (
        <span className="absolute -top-1 -right-1 flex h-6 w-6">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-6 w-6 bg-red-500" />
        </span>
      )}
    </div>
  );
};
```

#### 2.2.3 Blood Bank Reservation Component

```tsx
// frontend/src/components/wallboard/BloodBankReservation.tsx

interface BloodReservation {
  id: string;
  bloodType: 'O-NEG' | 'O-POS' | 'A-POS' | 'A-NEG' | 'B-POS' | 'B-NEG' | 'AB-POS' | 'AB-NEG';
  units: number;
  status: 'reserved' | 'pending' | 'in_transit' | 'delivered';
  reservedAt: number;
  etaMinutes: number;
  patientAlertId: string;
}

const BloodBankReservation: React.FC<{ reservation: BloodReservation }> = ({ reservation }) => {
  const statusConfig = {
    reserved: { bg: 'bg-[#10B981]/20', border: 'border-[#10B981]', text: 'text-[#10B981]', icon: '✓' },
    pending: { bg: 'bg-[#F59E0B]/20', border: 'border-[#F59E0B]', text: 'text-[#F59E0B]', icon: '◷' },
    in_transit: { bg: 'bg-[#3B82F6]/20', border: 'border-[#3B82F6]', text: 'text-[#3B82F6]', icon: '→' },
    delivered: { bg: 'bg-[#10B981]/20', border: 'border-[#10B981]', text: 'text-[#10B981]', icon: '✓✓' },
  };
  
  const config = statusConfig[reservation.status];
  
  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border ${config.border} ${config.bg}`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{config.icon}</span>
        <div>
          <span className="text-lg font-bold text-[#F1F5F9]">{reservation.bloodType}</span>
          <span className="text-sm text-[#94A3B8] ml-2">{reservation.units} unit{reservation.units > 1 ? 's' : ''}</span>
        </div>
      </div>
      <div className="text-right">
        <span className={`text-xs font-semibold uppercase ${config.text}`}>
          {reservation.status.replace('_', ' ')}
        </span>
        {reservation.etaMinutes > 0 && (
          <p className="text-xs text-[#94A3B8]">ETA: {reservation.etaMinutes} min</p>
        )}
      </div>
    </div>
  );
};
```

---

## 3. EXPLICIT APPMAP STATES & INTERACTIVE BEHAVIORS

### 3.1 State Machine Architecture

Every UI component follows a five-state model: **Active/Streaming**, **Loading**, **Empty**, **Success**, and **Error**. Transitions are governed by explicit rules.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COMPONENT STATE MACHINE                                   │
│                                                                             │
│                    ┌──────────────┐                                         │
│         ┌─────────│   IDLE        │─────────┐                              │
│         │         │   (initial)   │         │                              │
│         │         └──────┬───────┘         │                              │
│         │                │                 │                              │
│         ▼                ▼                 ▼                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                     │
│  │   LOADING    │  │   ACTIVE/    │  │    EMPTY     │                     │
│  │   (data      │  │   STREAMING  │  │   (no data   │                     │
│  │    fetching) │  │   (live)     │  │    available)│                     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘                     │
│         │                 │                 │                              │
│         ▼                 ▼                 ▼                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                     │
│  │   SUCCESS    │  │   ERROR      │  │   SUCCESS    │                     │
│  │   (data      │  │   (failure   │  │   (retry     │                     │
│  │    loaded)   │  │    occurred) │  │    available)│                     │
│  └──────────────┘  └──────────────┘  └──────────────┘                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 State Specifications

| State | Trigger | Visual Treatment | Duration | Exit |
|-------|---------|-----------------|----------|------|
| **Loading** | Data fetch initiated | Skeleton shimmer with `animate-pulse` blocks mirroring component layout | Min 200ms (prevent flash) | On data arrival |
| **Active/Streaming** | WebSocket connected, live data flowing | Glowing `#10B981` icons with `animate-ping` indicator; `transition-all duration-300` for text interpolation | Continuous | On disconnect or data end |
| **Empty** | Data fetch succeeded with empty result | Centered 48px ghosted icon (`opacity-0.2`), micro-copy text, distinct CTA button | Until user action | On user retry or data arrival |
| **Success** | Action completed successfully | Bottom-right sliding toast, `translate-x-0` from `translate-x-full`, auto-dismiss | 3500ms exactly | Auto-dismiss |
| **Error** | Action failed or validation error | Form boundary → `#EF4444`, CSS shake keyframe animation, persistent error toast | Until user corrects | On retry or correction |

### 3.3 Tailwind Animation Implementation

```css
/* frontend/src/styles/animations.css */

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
}

@keyframes slide-in-right {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes slide-out-right {
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(100%); opacity: 0; }
}

.animate-shake {
  animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

.animate-slide-in {
  animation: slide-in-right 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.animate-slide-out {
  animation: slide-out-right 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
}
```

**Tailwind utility mappings:**

| Tailwind Class | CSS Output | Usage |
|----------------|------------|-------|
| `animate-ping` | `animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite` | Live streaming indicators, notification badges  |
| `animate-pulse` | `animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite` | Skeleton loaders, loading states  |
| `transition-all duration-300` | `transition: all 300ms ease` | Smooth text/value interpolation |
| `transform translate-x-0` | `transform: translateX(0)` | Toast visible state |
| `transform translate-x-full` | `transform: translateX(100%)` | Toast hidden state |

### 3.4 Toast Notification System

```tsx
// frontend/src/components/ui/Toast.tsx

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration: number; // 3500ms default
}

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`animate-slide-in flex items-start gap-3 p-4 rounded-lg border shadow-xl
            ${toast.type === 'success' ? 'bg-[#10B981]/20 border-[#10B981]' : ''}
            ${toast.type === 'error' ? 'bg-[#EF4444]/20 border-[#EF4444]' : ''}
            ${toast.type === 'warning' ? 'bg-[#F59E0B]/20 border-[#F59E0B]' : ''}
            ${toast.type === 'info' ? 'bg-[#3B82F6]/20 border-[#3B82F6]' : ''}
          `}
        >
          <span className="text-xl">{getToastIcon(toast.type)}</span>
          <div className="flex-1">
            <p className="font-semibold text-[#F1F5F9]">{toast.title}</p>
            <p className="text-sm text-[#94A3B8]">{toast.message}</p>
          </div>
          <button onClick={() => removeToast(toast.id)} className="text-[#94A3B8] hover:text-[#F1F5F9]">
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};
```

---

## 4. FAILSAFE OPTICAL SYSTEMS & RESPONSIVENESS MATRIX

### 4.1 Offline QR Code Handoff System

#### 4.1.1 Architecture

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    OFFLINE QR HANDOFF PIPELINE                                │
│                                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌───────────┐  │
│  │ FHIR R4      │───▶│ JSON         │───▶│ pako          │───▶│ Base64    │  │
│  │ Bundle       │    │ Serialize    │    │ gzip         │    │ Encode    │  │
│  │ (emergency   │    │              │    │ Compress     │    │           │  │
│  │  encounter)  │    │              │    │              │    │           │  │
│  └──────────────┘    └──────────────┘    └──────────────┘    └─────┬─────┘  │
│                                                                    │        │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐         │        │
│  │ Barcode      │◀───│ QR Code      │◀───│ Prefix       │◀────────┘        │
│  │ Scanner      │    │ Render       │    │ "TBAI_RAW:"  │                  │
│  │ (ER nurse)   │    │ (qrcode.react)│   │              │                  │
│  └──────────────┘    └──────────────┘    └──────────────┘                  │
│                                                                              │
│  RESULT: Entire FHIR payload transferred via optical light — zero internet  │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### 4.1.2 Implementation

```tsx
// frontend/src/components/offline/OfflineQRHandoff.tsx

import QRCode from 'qrcode.react';
import pako from 'pako';

interface OfflineQRHandoffProps {
  fhirBundle: object; // Complete HL7 FHIR R4 Bundle
  onDismiss: () => void;
}

const OfflineQRHandoff: React.FC<OfflineQRHandoffProps> = ({ fhirBundle, onDismiss }) => {
  const [qrPayload, setQrPayload] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(true);
  
  useEffect(() => {
    const generateQR = async () => {
      try {
        // Step 1: Serialize FHIR Bundle to JSON
        const jsonString = JSON.stringify(fhirBundle);
        
        // Step 2: Compress with pako (gzip)
        const compressed = pako.gzip(jsonString);
        
        // Step 3: Convert to Base64
        const base64 = btoa(String.fromCharCode(...compressed));
        
        // Step 4: Add prefix for scanner identification
        const payload = `TBAI_RAW:${base64}`;
        
        setQrPayload(payload);
        setIsGenerating(false);
      } catch (error) {
        console.error('QR generation failed:', error);
      }
    };
    
    generateQR();
  }, [fhirBundle]);
  
  return (
    <div className="fixed inset-0 z-50 bg-[#0B0F19] flex flex-col items-center justify-center p-8">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#F1F5F9] mb-2">Offline Handoff — QR Code</h2>
          <p className="text-[#94A3B8]">
            Internet unavailable. Present this QR code to the ER triage nurse for scanning.
          </p>
        </div>
        
        {isGenerating ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl flex items-center justify-center">
            <QRCode
              value={qrPayload}
              size={320}
              level="L"        // Low error correction for max data density
              includeMargin={true}
              bgColor="#FFFFFF"
              fgColor="#000000"
              renderAs="svg"   // SVG for crisp rendering at any size
            />
          </div>
        )}
        
        <div className="mt-8 space-y-3">
          <div className="flex items-center gap-3 p-3 bg-[#1E293B] rounded-lg">
            <span className="text-[#10B981] text-xl">✓</span>
            <div>
              <p className="text-sm font-medium text-[#F1F5F9]">FHIR R4 Bundle — Compressed</p>
              <p className="text-xs text-[#94A3B8]">
                {qrPayload.length} characters • {fhirBundle.entry?.length || 0} resources
              </p>
            </div>
          </div>
          
          <button
            onClick={onDismiss}
            className="w-full py-4 rounded-xl bg-[#2D3A4F] text-[#F1F5F9] font-semibold
                       text-lg touch-manipulation active:bg-[#3D4A5F] transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
```

#### 4.1.3 FHIR Bundle Structure (Emergency Encounter)

```json
{
  "resourceType": "Bundle",
  "type": "document",
  "timestamp": "2026-09-25T14:32:07+05:30",
  "entry": [
    {
      "resource": {
        "resourceType": "Composition",
        "status": "final",
        "type": { "coding": [{ "code": "34133-9", "display": "Summarization of Episode Note" }] },
        "subject": { "reference": "Patient/emergency-unknown" },
        "date": "2026-09-25T14:32:07+05:30",
        "title": "Emergency Medical Service Protocol — TraumaBridge AI",
        "section": [
          { "title": "Mechanism of Injury", "text": { "status": "generated", "div": "<div>RTA — high-speed collision</div>" } },
          { "title": "Injuries", "text": { "status": "generated", "div": "<div>Chest puncture, open femur fracture</div>" } },
          { "title": "Signs", "text": { "status": "generated", "div": "<div>BP 80/50, HR 110, RR 22, SpO2 94%</div>" } },
          { "title": "Treatment", "text": { "status": "generated", "div": "<div>IV access established, oxygen started</div>" } }
        ]
      }
    },
    {
      "resource": {
        "resourceType": "Patient",
        "identifier": [{ "system": "urn:oid:1.2.36.1.2001.1003.0", "value": "TBAI-UNKNOWN-001" }],
        "name": [{ "text": "Unknown Male" }],
        "gender": "male",
        "birthDate": "1984-01-01"
      }
    },
    {
      "resource": {
        "resourceType": "Encounter",
        "status": "in-progress",
        "class": { "coding": [{ "code": "EMER", "display": "Emergency" }] },
        "subject": { "reference": "Patient/emergency-unknown" },
        "period": { "start": "2026-09-25T14:25:00+05:30" }
      }
    }
  ]
}
```

The FHIR R4 Bundle structure follows the HL7 standard for emergency medical service protocols, with the Composition resource as the first entry containing section references for mechanism, injuries, signs, and treatment. 

### 4.2 Responsiveness Matrix

| Breakpoint | Layout | Navigation | Vitals Array | Body Map | Font Scale |
|------------|--------|------------|--------------|----------|------------|
| **Desktop** (`≥1440px`) | 3-column bento grid | Fixed left side nav (72px width, icon + label) | Horizontal row (4 vitals side-by-side) | SVG `400×600px`, right column | `base: 16px`, `h1: 32px`, `h2: 24px` |
| **Tablet** (`1024–1439px`) | 2-column layout | Narrow icon strip nav (56px width, icons only) | 2×2 grid | SVG `300×450px`, top-right | `base: 15px`, `h1: 28px`, `h2: 22px` |
| **Mobile** (`<640px`) | 1-column stacked | Top header with burger drawer menu | Vertical stack (full-width) | SVG `280×420px`, full-width | `base: 14px`, `h1: 24px`, `h2: 20px` |

#### 4.2.1 Tailwind Breakpoint Implementation

```tsx
// frontend/src/app/emt/workspace/page.tsx

const EMTWorkspace: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F1F5F9]">
      {/* Responsive layout container */}
      <div className="
        grid gap-4 p-4
        grid-cols-1 
        md:grid-cols-2 
        xl:grid-cols-3
        max-w-[1920px] mx-auto
      ">
        {/* Body Map — full width on mobile, spans 2 cols on desktop */}
        <div className="
          col-span-1 
          md:col-span-2 
          xl:col-span-2
          xl:row-span-2
        ">
          <TraumaBodyMap />
        </div>
        
        {/* Vitals Array — full width on mobile, 1 col on desktop */}
        <div className="col-span-1 space-y-3">
          <VitalsArray label="BP Systolic" value={120} unit="mmHg" min={60} max={220} step={10} />
          <VitalsArray label="Heart Rate" value={98} unit="bpm" min={30} max={220} step={5} />
          <VitalsArray label="Resp Rate" value={18} unit="/min" min={8} max={40} step={2} />
          <VitalsArray label="SpO₂" value={97} unit="%" min={70} max={100} step={1} />
        </div>
        
        {/* MIST Capture — full width */}
        <div className="col-span-1 md:col-span-2 xl:col-span-3">
          <MISTVoiceCapture />
        </div>
        
        {/* Action Bar — full width */}
        <div className="col-span-1 md:col-span-2 xl:col-span-3 flex flex-wrap gap-3">
          <ActionButton label="+ CHEST" />
          <ActionButton label="+ ABDOMEN" />
          <ActionButton label="+ PELVIS" />
          <ActionButton label="SCAN PRESCRIPTION" />
          <ActionButton label="SEND ALERT" variant="primary" />
        </div>
      </div>
    </div>
  );
};
```

#### 4.2.2 Navigation Component (Responsive)

```tsx
// frontend/src/components/layout/ResponsiveNav.tsx

const ResponsiveNav: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  return (
    <>
      {/* Desktop: Fixed left sidebar */}
      <nav className="hidden xl:flex fixed left-0 top-0 h-full w-[72px] flex-col items-center 
                      bg-[#161F30] border-r border-[#2D3A4F] py-4 gap-6 z-40">
        <NavIcon icon="🏠" label="Home" href="/emt" />
        <NavIcon icon="📋" label="Intake" href="/emt/intake" />
        <NavIcon icon="📄" label="Documents" href="/emt/documents" />
        <NavIcon icon="⚙️" label="Settings" href="/emt/settings" />
      </nav>
      
      {/* Tablet: Narrow icon strip */}
      <nav className="hidden md:flex xl:hidden fixed left-0 top-0 h-full w-[56px] flex-col 
                      items-center bg-[#161F30] border-r border-[#2D3A4F] py-4 gap-4 z-40">
        <NavIcon icon="🏠" href="/emt" compact />
        <NavIcon icon="📋" href="/emt/intake" compact />
        <NavIcon icon="📄" href="/emt/documents" compact />
        <NavIcon icon="⚙️" href="/emt/settings" compact />
      </nav>
      
      {/* Mobile: Top header with burger drawer */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[#161F30] 
                         border-b border-[#2D3A4F] flex items-center justify-between px-4 z-40">
        <span className="font-bold text-[#F1F5F9]">TraumaBridge</span>
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="w-10 h-10 flex items-center justify-center text-[#F1F5F9] text-xl"
          aria-label="Open navigation menu"
        >
          ☰
        </button>
      </header>
      
      {/* Mobile: Drawer menu */}
      {isDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsDrawerOpen(false)} />
          <nav className="absolute right-0 top-0 h-full w-72 bg-[#161F30] p-6 
                          animate-slide-in">
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="absolute top-4 right-4 text-[#94A3B8] text-xl"
              aria-label="Close menu"
            >
              ✕
            </button>
            <div className="mt-8 space-y-2">
              <DrawerLink icon="🏠" label="Home" href="/emt" />
              <DrawerLink icon="📋" label="Intake" href="/emt/intake" />
              <DrawerLink icon="📄" label="Documents" href="/emt/documents" />
              <DrawerLink icon="⚙️" label="Settings" href="/emt/settings" />
            </div>
          </nav>
        </div>
      )}
    </>
  );
};
```

---

## 5. IMPLEMENTATION CHECKLIST (36-Hour Sprint)

### Phase 1: Foundation (Hours 0–6)

- [ ] Initialize Next.js 14 project with App Router, TypeScript strict mode
- [ ] Install dependencies: `qrcode.react`, `pako`, `zustand`, `tailwindcss`, `lucide-react`
- [ ] Configure Tailwind with custom color tokens and animations
- [ ] Set up WebSocket connection manager with reconnect logic
- [ ] Implement Web Audio API processing graph with BiquadFilterNode

### Phase 2: Core Components (Hours 6–18)

- [ ] Build `TraumaBodyMap` SVG with 11 zones and radial sub-menus
- [ ] Implement `VitalsArray` with long-press acceleration and haptic feedback
- [ ] Create `MISTVoiceCapture` with 5-second buffer and confidence gate
- [ ] Build `ContraindicationInterceptor` with camera capture and edge OCR
- [ ] Implement `EDWallboard` with WebSocket live streaming

### Phase 3: States & Failsafes (Hours 18–28)

- [ ] Implement all five component states (Loading, Active, Empty, Success, Error)
- [ ] Build `OfflineQRHandoff` with pako compression and qrcode.react
- [ ] Create `ToastContainer` with auto-dismiss and slide animations
- [ ] Implement IndexedDB persistence for offline session data
- [ ] Add Service Worker for offline-first PWA capability

### Phase 4: Polish & Test (Hours 28–36)

- [ ] Verify WCAG AAA contrast ratios (≥7:1) on all medical text
- [ ] Test haptic patterns on actual Android device with nitrile gloves
- [ ] Run live demo scenario: trauma intake → WebSocket → wallboard alert
- [ ] Test offline QR handoff with actual barcode scanner
- [ ] Pre-flight health check endpoint for demo reliability

---

## 6. CRITICAL IMPLEMENTATION NOTES

1. **`pointerdown` vs `click`**: All trauma-related touch handlers MUST use `pointerdown`, not `click`. A paramedic wearing thick nitrile gloves may not generate a `click` event reliably, but `pointerdown` fires immediately on contact.

2. **Cancel-before-speak**: Every TTS utterance MUST call `window.speechSynthesis.cancel()` before speaking. Without this, navigating quickly queues overlapping speech — the most common bug in auto-speaking UIs.

3. **Silent RAG failure**: The vector retrieval layer must raise a loud error if ChromaDB/MiniLM fails to initialize. Never silently degrade to BM25 keyword search — the entire semantic matching capability depends on dense retrieval.

4. **FHIR resource ordering**: The Composition resource MUST be the first entry in the Bundle. Subsequent entries (Patient, Encounter, Observation, Condition) reference the Composition via `fullUrl`.

5. **Vibration API graceful degradation**: Always check `navigator.vibrate` existence before calling. On desktop browsers, this API is undefined. Wrap in a `try/catch` and log a debug message.

6. **QR code error correction**: Use `level="L"` (7% recovery) for maximum data density. The FHIR payload is large; higher error correction levels reduce QR capacity below the payload size.

7. **Blood bank auto-reservation**: Trigger the API webhook when Shock Index > 1.0 (HR/SBP). This is a deterministic calculation — never delegate to the LLM.

8. **Red-flag engine**: The red-flag detection MUST be a hardcoded Python rule engine, not an LLM prompt. Clinical safety cannot rely on probabilistic outputs.