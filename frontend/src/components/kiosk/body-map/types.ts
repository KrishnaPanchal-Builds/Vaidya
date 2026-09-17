export type BodyView = 'FRONT' | 'BACK' | 'SIDE'

export type SymptomCategoryId =
  | 'chest_breathing'
  | 'head_eyes'
  | 'stomach_digestion'
  | 'back_spine'
  | 'arms_hands'
  | 'legs_feet'
  | 'joint_pain'
  | 'fever_infection'
  | 'other_symptoms'

export type BodyRegionId =
  // Head & Face
  | 'head'
  | 'eyes'
  | 'face'
  | 'neck'
  // Torso
  | 'chest'
  | 'upper_abdomen'
  | 'stomach'
  | 'lower_abdomen'
  // Back & Spine
  | 'upper_back'
  | 'spine'
  | 'lower_back'
  // Left Arm
  | 'left_shoulder'
  | 'left_upper_arm'
  | 'left_elbow'
  | 'left_forearm'
  | 'left_wrist'
  | 'left_hand'
  // Right Arm
  | 'right_shoulder'
  | 'right_upper_arm'
  | 'right_elbow'
  | 'right_forearm'
  | 'right_wrist'
  | 'right_hand'
  // Pelvis & Hips
  | 'pelvis'
  | 'left_hip'
  | 'right_hip'
  // Left Leg
  | 'left_thigh'
  | 'left_knee'
  | 'left_calf'
  | 'left_ankle'
  | 'left_foot'
  // Right Leg
  | 'right_thigh'
  | 'right_knee'
  | 'right_calf'
  | 'right_ankle'
  | 'right_foot'
  // Systemic / General
  | 'fever_general'
  | 'other_general'

export interface AnatomicalCallout {
  id: BodyRegionId
  label: string
  categoryId: SymptomCategoryId
  view: BodyView
  // Anchor on the human body figure (0-100%)
  anchorX: number
  anchorY: number
  // Label pill position in the surrounding canvas (0-100%)
  labelX: number
  labelY: number
  // Alignment direction: 'left' = label on left flank, 'right' = label on right flank, 'center' = centered
  align: 'left' | 'right' | 'center'
}

export interface BodyRegion {
  id: BodyRegionId
  label: string
  categoryId: SymptomCategoryId
  parentRegion?: string
}

export interface SelectedItem {
  id: string
  label: string
  categoryId?: SymptomCategoryId
}

export interface SymptomCategory {
  id: SymptomCategoryId
  label: string
  sublabel: string
  primaryRegionId: BodyRegionId
  associatedRegionIds: BodyRegionId[]
}

// ── 1. AUTHORITATIVE MASTER BODY REGIONS CATALOG ──
export const BODY_REGIONS: Record<BodyRegionId, BodyRegion> = {
  // Head & Face
  head: { id: 'head', label: 'Head', categoryId: 'head_eyes', parentRegion: 'Cranium' },
  eyes: { id: 'eyes', label: 'Eyes', categoryId: 'head_eyes', parentRegion: 'Face' },
  face: { id: 'face', label: 'Face', categoryId: 'head_eyes', parentRegion: 'Head' },
  neck: { id: 'neck', label: 'Neck', categoryId: 'back_spine', parentRegion: 'Cervical' },

  // Torso
  chest: { id: 'chest', label: 'Chest', categoryId: 'chest_breathing', parentRegion: 'Torso' },
  upper_abdomen: { id: 'upper_abdomen', label: 'Upper Abdomen', categoryId: 'stomach_digestion', parentRegion: 'Abdomen' },
  stomach: { id: 'stomach', label: 'Stomach', categoryId: 'stomach_digestion', parentRegion: 'Abdomen' },
  lower_abdomen: { id: 'lower_abdomen', label: 'Lower Abdomen', categoryId: 'stomach_digestion', parentRegion: 'Abdomen' },

  // Back & Spine
  upper_back: { id: 'upper_back', label: 'Upper Back', categoryId: 'back_spine', parentRegion: 'Back' },
  spine: { id: 'spine', label: 'Spine', categoryId: 'back_spine', parentRegion: 'Back' },
  lower_back: { id: 'lower_back', label: 'Lower Back', categoryId: 'back_spine', parentRegion: 'Back' },

  // Left Arm (Patient's Left)
  left_shoulder: { id: 'left_shoulder', label: 'Left Shoulder', categoryId: 'arms_hands', parentRegion: 'Left Arm' },
  left_upper_arm: { id: 'left_upper_arm', label: 'Left Upper Arm', categoryId: 'arms_hands', parentRegion: 'Left Arm' },
  left_elbow: { id: 'left_elbow', label: 'Left Elbow', categoryId: 'joint_pain', parentRegion: 'Left Arm' },
  left_forearm: { id: 'left_forearm', label: 'Left Forearm', categoryId: 'arms_hands', parentRegion: 'Left Arm' },
  left_wrist: { id: 'left_wrist', label: 'Left Wrist', categoryId: 'arms_hands', parentRegion: 'Left Arm' },
  left_hand: { id: 'left_hand', label: 'Left Hand', categoryId: 'arms_hands', parentRegion: 'Left Arm' },

  // Right Arm (Patient's Right)
  right_shoulder: { id: 'right_shoulder', label: 'Right Shoulder', categoryId: 'arms_hands', parentRegion: 'Right Arm' },
  right_upper_arm: { id: 'right_upper_arm', label: 'Right Upper Arm', categoryId: 'arms_hands', parentRegion: 'Right Arm' },
  right_elbow: { id: 'right_elbow', label: 'Right Elbow', categoryId: 'joint_pain', parentRegion: 'Right Arm' },
  right_forearm: { id: 'right_forearm', label: 'Right Forearm', categoryId: 'arms_hands', parentRegion: 'Right Arm' },
  right_wrist: { id: 'right_wrist', label: 'Right Wrist', categoryId: 'arms_hands', parentRegion: 'Right Arm' },
  right_hand: { id: 'right_hand', label: 'Right Hand', categoryId: 'arms_hands', parentRegion: 'Right Arm' },

  // Pelvis & Hips
  pelvis: { id: 'pelvis', label: 'Pelvis', categoryId: 'legs_feet', parentRegion: 'Pelvis' },
  left_hip: { id: 'left_hip', label: 'Left Hip', categoryId: 'legs_feet', parentRegion: 'Hips' },
  right_hip: { id: 'right_hip', label: 'Right Hip', categoryId: 'legs_feet', parentRegion: 'Hips' },

  // Left Leg
  left_thigh: { id: 'left_thigh', label: 'Left Thigh', categoryId: 'legs_feet', parentRegion: 'Left Leg' },
  left_knee: { id: 'left_knee', label: 'Left Knee', categoryId: 'joint_pain', parentRegion: 'Left Leg' },
  left_calf: { id: 'left_calf', label: 'Left Calf', categoryId: 'legs_feet', parentRegion: 'Left Leg' },
  left_ankle: { id: 'left_ankle', label: 'Left Ankle', categoryId: 'joint_pain', parentRegion: 'Left Leg' },
  left_foot: { id: 'left_foot', label: 'Left Foot', categoryId: 'legs_feet', parentRegion: 'Left Leg' },

  // Right Leg
  right_thigh: { id: 'right_thigh', label: 'Right Thigh', categoryId: 'legs_feet', parentRegion: 'Right Leg' },
  right_knee: { id: 'right_knee', label: 'Right Knee', categoryId: 'joint_pain', parentRegion: 'Right Leg' },
  right_calf: { id: 'right_calf', label: 'Right Calf', categoryId: 'legs_feet', parentRegion: 'Right Leg' },
  right_ankle: { id: 'right_ankle', label: 'Right Ankle', categoryId: 'joint_pain', parentRegion: 'Right Leg' },
  right_foot: { id: 'right_foot', label: 'Right Foot', categoryId: 'legs_feet', parentRegion: 'Right Leg' },

  // Systemic / General
  fever_general: { id: 'fever_general', label: 'Fever / Infection', categoryId: 'fever_infection', parentRegion: 'Systemic' },
  other_general: { id: 'other_general', label: 'Other Symptoms', categoryId: 'other_symptoms', parentRegion: 'General' },
}

// ── 2. PROMINENT ANATOMICAL CALLOUT LABELS BY VIEW (DETERMINISTIC ZONED LAYOUT) ──
export const ANATOMICAL_CALLOUTS: Record<BodyView, AnatomicalCallout[]> = {
  // ══════════════════════════════════════════════════════════════
  // FRONT VIEW (Patient facing viewer)
  // Left flank (x: ~12-18%) = Patient's Right
  // Right flank (x: ~82-88%) = Patient's Left
  // ══════════════════════════════════════════════════════════════
  FRONT: [
    // Left Flank (Patient's Right side)
    { id: 'head', label: 'Head', categoryId: 'head_eyes', view: 'FRONT', anchorX: 48, anchorY: 7.5, labelX: 18, labelY: 6.5, align: 'left' },
    { id: 'right_shoulder', label: 'Right Shoulder', categoryId: 'arms_hands', view: 'FRONT', anchorX: 36, anchorY: 24, labelX: 15, labelY: 18.5, align: 'left' },
    { id: 'chest', label: 'Chest', categoryId: 'chest_breathing', view: 'FRONT', anchorX: 46, anchorY: 29, labelX: 18, labelY: 30, align: 'left' },
    { id: 'right_elbow', label: 'Right Elbow', categoryId: 'joint_pain', view: 'FRONT', anchorX: 27.5, anchorY: 38, labelX: 13, labelY: 41.5, align: 'left' },
    { id: 'right_hand', label: 'Right Hand', categoryId: 'arms_hands', view: 'FRONT', anchorX: 24, anchorY: 53, labelX: 12, labelY: 53, align: 'left' },
    { id: 'right_thigh', label: 'Right Thigh', categoryId: 'legs_feet', view: 'FRONT', anchorX: 43, anchorY: 60, labelX: 17, labelY: 65, align: 'left' },
    { id: 'right_knee', label: 'Right Knee', categoryId: 'joint_pain', view: 'FRONT', anchorX: 43.5, anchorY: 72.5, labelX: 16, labelY: 77, align: 'left' },
    { id: 'right_foot', label: 'Right Foot', categoryId: 'legs_feet', view: 'FRONT', anchorX: 42.5, anchorY: 93.5, labelX: 17, labelY: 91, align: 'left' },

    // Right Flank (Patient's Left side)
    { id: 'face', label: 'Face', categoryId: 'head_eyes', view: 'FRONT', anchorX: 52, anchorY: 13.5, labelX: 82, labelY: 9.5, align: 'right' },
    { id: 'neck', label: 'Neck', categoryId: 'back_spine', view: 'FRONT', anchorX: 52, anchorY: 19, labelX: 84, labelY: 18, align: 'right' },
    { id: 'left_shoulder', label: 'Left Shoulder', categoryId: 'arms_hands', view: 'FRONT', anchorX: 64, anchorY: 24, labelX: 85, labelY: 26.5, align: 'right' },
    { id: 'stomach', label: 'Stomach', categoryId: 'stomach_digestion', view: 'FRONT', anchorX: 54, anchorY: 39, labelX: 82, labelY: 35.5, align: 'right' },
    { id: 'left_elbow', label: 'Left Elbow', categoryId: 'joint_pain', view: 'FRONT', anchorX: 72.5, anchorY: 38, labelX: 87, labelY: 45, align: 'right' },
    { id: 'left_hand', label: 'Left Hand', categoryId: 'arms_hands', view: 'FRONT', anchorX: 76, anchorY: 53, labelX: 88, labelY: 55, align: 'right' },
    { id: 'left_thigh', label: 'Left Thigh', categoryId: 'legs_feet', view: 'FRONT', anchorX: 57, anchorY: 60, labelX: 83, labelY: 66, align: 'right' },
    { id: 'left_knee', label: 'Left Knee', categoryId: 'joint_pain', view: 'FRONT', anchorX: 56.5, anchorY: 72.5, labelX: 84, labelY: 78, align: 'right' },
    { id: 'left_foot', label: 'Left Foot', categoryId: 'legs_feet', view: 'FRONT', anchorX: 57.5, anchorY: 93.5, labelX: 83, labelY: 91, align: 'right' },
  ],

  // ══════════════════════════════════════════════════════════════
  // BACK VIEW (Patient facing away)
  // Left flank = Patient's Left; Right flank = Patient's Right
  // ══════════════════════════════════════════════════════════════
  BACK: [
    // Left Flank (Patient's Left)
    { id: 'head', label: 'Head', categoryId: 'head_eyes', view: 'BACK', anchorX: 48, anchorY: 8, labelX: 18, labelY: 7, align: 'left' },
    { id: 'left_shoulder', label: 'Left Shoulder', categoryId: 'arms_hands', view: 'BACK', anchorX: 35, anchorY: 24.5, labelX: 15, labelY: 19, align: 'left' },
    { id: 'upper_back', label: 'Upper Back', categoryId: 'back_spine', view: 'BACK', anchorX: 46, anchorY: 28, labelX: 18, labelY: 30, align: 'left' },
    { id: 'left_elbow', label: 'Left Elbow', categoryId: 'joint_pain', view: 'BACK', anchorX: 27.5, anchorY: 38, labelX: 13, labelY: 41.5, align: 'left' },
    { id: 'lower_back', label: 'Lower Back', categoryId: 'back_spine', view: 'BACK', anchorX: 47, anchorY: 45, labelX: 18, labelY: 51.5, align: 'left' },
    { id: 'left_hand', label: 'Left Hand', categoryId: 'arms_hands', view: 'BACK', anchorX: 24, anchorY: 53, labelX: 12, labelY: 62, align: 'left' },
    { id: 'left_knee', label: 'Left Knee', categoryId: 'joint_pain', view: 'BACK', anchorX: 43.5, anchorY: 72.5, labelX: 16, labelY: 76.5, align: 'left' },
    { id: 'left_foot', label: 'Left Foot', categoryId: 'legs_feet', view: 'BACK', anchorX: 43, anchorY: 93, labelX: 17, labelY: 91, align: 'left' },

    // Right Flank (Patient's Right)
    { id: 'neck', label: 'Neck', categoryId: 'back_spine', view: 'BACK', anchorX: 52, anchorY: 18, labelX: 84, labelY: 13, align: 'right' },
    { id: 'right_shoulder', label: 'Right Shoulder', categoryId: 'arms_hands', view: 'BACK', anchorX: 65, anchorY: 24.5, labelX: 85, labelY: 23, align: 'right' },
    { id: 'spine', label: 'Spine', categoryId: 'back_spine', view: 'BACK', anchorX: 53, anchorY: 36, labelX: 82, labelY: 34, align: 'right' },
    { id: 'right_elbow', label: 'Right Elbow', categoryId: 'joint_pain', view: 'BACK', anchorX: 72.5, anchorY: 38, labelX: 87, labelY: 45, align: 'right' },
    { id: 'right_hand', label: 'Right Hand', categoryId: 'arms_hands', view: 'BACK', anchorX: 76, anchorY: 53, labelX: 88, labelY: 56.5, align: 'right' },
    { id: 'right_knee', label: 'Right Knee', categoryId: 'joint_pain', view: 'BACK', anchorX: 56.5, anchorY: 72.5, labelX: 84, labelY: 76.5, align: 'right' },
    { id: 'right_foot', label: 'Right Foot', categoryId: 'legs_feet', view: 'BACK', anchorX: 57, anchorY: 93, labelX: 83, labelY: 91, align: 'right' },
  ],

  // ══════════════════════════════════════════════════════════════
  // SIDE VIEW (Patient right profile)
  // ══════════════════════════════════════════════════════════════
  SIDE: [
    // Left Flank
    { id: 'head', label: 'Head', categoryId: 'head_eyes', view: 'SIDE', anchorX: 48, anchorY: 8, labelX: 20, labelY: 7, align: 'left' },
    { id: 'neck', label: 'Neck', categoryId: 'back_spine', view: 'SIDE', anchorX: 47, anchorY: 19, labelX: 18, labelY: 19, align: 'left' },
    { id: 'right_elbow', label: 'Elbow', categoryId: 'joint_pain', view: 'SIDE', anchorX: 46, anchorY: 38, labelX: 16, labelY: 36, align: 'left' },
    { id: 'lower_back', label: 'Lower Back', categoryId: 'back_spine', view: 'SIDE', anchorX: 43.5, anchorY: 44, labelX: 17, labelY: 48, align: 'left' },
    { id: 'right_hip', label: 'Hip', categoryId: 'legs_feet', view: 'SIDE', anchorX: 47, anchorY: 53, labelX: 18, labelY: 60, align: 'left' },
    { id: 'right_foot', label: 'Foot', categoryId: 'legs_feet', view: 'SIDE', anchorX: 47, anchorY: 93.5, labelX: 20, labelY: 91, align: 'left' },

    // Right Flank
    { id: 'face', label: 'Face', categoryId: 'head_eyes', view: 'SIDE', anchorX: 55, anchorY: 13.5, labelX: 82, labelY: 13, align: 'right' },
    { id: 'right_shoulder', label: 'Shoulder', categoryId: 'arms_hands', view: 'SIDE', anchorX: 46, anchorY: 24.5, labelX: 82, labelY: 24, align: 'right' },
    { id: 'chest', label: 'Side Chest', categoryId: 'chest_breathing', view: 'SIDE', anchorX: 53.5, anchorY: 31, labelX: 82, labelY: 34, align: 'right' },
    { id: 'stomach', label: 'Abdomen', categoryId: 'stomach_digestion', view: 'SIDE', anchorX: 52, anchorY: 40, labelX: 82, labelY: 44, align: 'right' },
    { id: 'right_knee', label: 'Knee', categoryId: 'joint_pain', view: 'SIDE', anchorX: 50, anchorY: 75, labelX: 82, labelY: 75, align: 'right' },
    { id: 'right_foot', label: 'Foot', categoryId: 'legs_feet', view: 'SIDE', anchorX: 51, anchorY: 93.5, labelX: 82, labelY: 91, align: 'right' },
  ],
}

// ── 3. SYMPTOM CATEGORIES DEFINITION ──
export const SYMPTOM_CATEGORIES: SymptomCategory[] = [
  {
    id: 'chest_breathing',
    label: 'Chest / Breathing',
    sublabel: 'Lungs, heart, ribcage',
    primaryRegionId: 'chest',
    associatedRegionIds: ['chest'],
  },
  {
    id: 'head_eyes',
    label: 'Head / Eyes',
    sublabel: 'Headache, vision, dizziness',
    primaryRegionId: 'head',
    associatedRegionIds: ['head', 'eyes', 'face'],
  },
  {
    id: 'stomach_digestion',
    label: 'Stomach / Digestion',
    sublabel: 'Abdomen, nausea, burning',
    primaryRegionId: 'stomach',
    associatedRegionIds: ['upper_abdomen', 'stomach', 'lower_abdomen'],
  },
  {
    id: 'back_spine',
    label: 'Back / Spine',
    sublabel: 'Upper back, lumbar, spine',
    primaryRegionId: 'spine',
    associatedRegionIds: ['neck', 'upper_back', 'spine', 'lower_back'],
  },
  {
    id: 'arms_hands',
    label: 'Arms / Hands',
    sublabel: 'Shoulders, elbows, wrists',
    primaryRegionId: 'left_shoulder',
    associatedRegionIds: [
      'left_shoulder', 'right_shoulder',
      'left_upper_arm', 'right_upper_arm',
      'left_forearm', 'right_forearm',
      'left_wrist', 'right_wrist',
      'left_hand', 'right_hand',
    ],
  },
  {
    id: 'legs_feet',
    label: 'Legs / Feet',
    sublabel: 'Thighs, calves, ankles, feet',
    primaryRegionId: 'left_thigh',
    associatedRegionIds: [
      'pelvis', 'left_hip', 'right_hip',
      'left_thigh', 'right_thigh',
      'left_calf', 'right_calf',
      'left_foot', 'right_foot',
    ],
  },
  {
    id: 'joint_pain',
    label: 'Joint Pain',
    sublabel: 'Knees, elbows, joints',
    primaryRegionId: 'left_knee',
    associatedRegionIds: [
      'left_elbow', 'right_elbow',
      'left_knee', 'right_knee',
      'left_ankle', 'right_ankle',
    ],
  },
  {
    id: 'fever_infection',
    label: 'Fever / Infection',
    sublabel: 'Chills, weakness, sweating',
    primaryRegionId: 'fever_general',
    associatedRegionIds: ['fever_general'],
  },
  {
    id: 'other_symptoms',
    label: 'Other Symptoms',
    sublabel: 'Skin, fatigue, general',
    primaryRegionId: 'other_general',
    associatedRegionIds: ['other_general'],
  },
]

export function getCalloutsForView(view: BodyView): AnatomicalCallout[] {
  return ANATOMICAL_CALLOUTS[view] || ANATOMICAL_CALLOUTS.FRONT
}
