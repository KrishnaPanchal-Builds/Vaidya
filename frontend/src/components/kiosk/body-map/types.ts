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
  // Left flank (x: ~14%) = Viewer's Left (Patient's Right)
  // Right flank (x: ~86%) = Viewer's Right (Patient's Left)
  // ══════════════════════════════════════════════════════════════
  FRONT: [
    // Left Flank (Viewer's Left - 8 labels, strictly separated Y positions)
    { id: 'head', label: 'Head', categoryId: 'head_eyes', view: 'FRONT', anchorX: 49, anchorY: 8.5, labelX: 14, labelY: 7, align: 'left' },
    { id: 'right_shoulder', label: 'Right Shoulder', categoryId: 'arms_hands', view: 'FRONT', anchorX: 36, anchorY: 23.5, labelX: 13.5, labelY: 18, align: 'left' },
    { id: 'chest', label: 'Chest', categoryId: 'chest_breathing', view: 'FRONT', anchorX: 45, anchorY: 29.5, labelX: 14, labelY: 29, align: 'left' },
    { id: 'right_elbow', label: 'Right Elbow', categoryId: 'joint_pain', view: 'FRONT', anchorX: 27.5, anchorY: 39, labelX: 13.5, labelY: 40, align: 'left' },
    { id: 'right_hand', label: 'Right Hand', categoryId: 'arms_hands', view: 'FRONT', anchorX: 23, anchorY: 52.5, labelX: 13.5, labelY: 51, align: 'left' },
    { id: 'right_thigh', label: 'Right Thigh', categoryId: 'legs_feet', view: 'FRONT', anchorX: 43.5, anchorY: 61, labelX: 14, labelY: 63, align: 'left' },
    { id: 'right_knee', label: 'Right Knee', categoryId: 'joint_pain', view: 'FRONT', anchorX: 43.5, anchorY: 73.5, labelX: 14, labelY: 76, align: 'left' },
    { id: 'right_foot', label: 'Right Foot', categoryId: 'legs_feet', view: 'FRONT', anchorX: 42.5, anchorY: 93.5, labelX: 14, labelY: 91, align: 'left' },

    // Right Flank (Viewer's Right - 9 labels, strictly separated Y positions)
    { id: 'face', label: 'Face', categoryId: 'head_eyes', view: 'FRONT', anchorX: 51, anchorY: 13.5, labelX: 86, labelY: 9, align: 'right' },
    { id: 'neck', label: 'Neck', categoryId: 'back_spine', view: 'FRONT', anchorX: 51, anchorY: 18.5, labelX: 86, labelY: 18, align: 'right' },
    { id: 'left_shoulder', label: 'Left Shoulder', categoryId: 'arms_hands', view: 'FRONT', anchorX: 64, anchorY: 23.5, labelX: 86, labelY: 27, align: 'right' },
    { id: 'stomach', label: 'Stomach', categoryId: 'stomach_digestion', view: 'FRONT', anchorX: 51, anchorY: 39.5, labelX: 86, labelY: 36, align: 'right' },
    { id: 'left_elbow', label: 'Left Elbow', categoryId: 'joint_pain', view: 'FRONT', anchorX: 72.5, anchorY: 39, labelX: 86.5, labelY: 45, align: 'right' },
    { id: 'left_hand', label: 'Left Hand', categoryId: 'arms_hands', view: 'FRONT', anchorX: 77, anchorY: 52.5, labelX: 86.5, labelY: 55, align: 'right' },
    { id: 'left_thigh', label: 'Left Thigh', categoryId: 'legs_feet', view: 'FRONT', anchorX: 56.5, anchorY: 61, labelX: 86, labelY: 66, align: 'right' },
    { id: 'left_knee', label: 'Left Knee', categoryId: 'joint_pain', view: 'FRONT', anchorX: 56.5, anchorY: 73.5, labelX: 86, labelY: 78, align: 'right' },
    { id: 'left_foot', label: 'Left Foot', categoryId: 'legs_feet', view: 'FRONT', anchorX: 57.5, anchorY: 93.5, labelX: 86, labelY: 91, align: 'right' },
  ],

  // ══════════════════════════════════════════════════════════════
  // BACK VIEW (Patient facing away)
  // Left flank = Viewer's Left (Patient's Left)
  // Right flank = Viewer's Right (Patient's Right)
  // ══════════════════════════════════════════════════════════════
  BACK: [
    // Left Flank (Viewer's Left - 8 labels, strictly separated Y positions)
    { id: 'head', label: 'Head', categoryId: 'head_eyes', view: 'BACK', anchorX: 50, anchorY: 8.5, labelX: 14, labelY: 7, align: 'left' },
    { id: 'left_shoulder', label: 'Left Shoulder', categoryId: 'arms_hands', view: 'BACK', anchorX: 36, anchorY: 24, labelX: 13.5, labelY: 18, align: 'left' },
    { id: 'upper_back', label: 'Upper Back', categoryId: 'back_spine', view: 'BACK', anchorX: 47, anchorY: 27.5, labelX: 14, labelY: 29, align: 'left' },
    { id: 'left_elbow', label: 'Left Elbow', categoryId: 'joint_pain', view: 'BACK', anchorX: 27.5, anchorY: 39, labelX: 13.5, labelY: 40, align: 'left' },
    { id: 'lower_back', label: 'Lower Back', categoryId: 'back_spine', view: 'BACK', anchorX: 47, anchorY: 43.5, labelX: 14, labelY: 51, align: 'left' },
    { id: 'left_hand', label: 'Left Hand', categoryId: 'arms_hands', view: 'BACK', anchorX: 23, anchorY: 52.5, labelX: 13.5, labelY: 63, align: 'left' },
    { id: 'left_knee', label: 'Left Knee', categoryId: 'joint_pain', view: 'BACK', anchorX: 43.5, anchorY: 73.5, labelX: 14, labelY: 76, align: 'left' },
    { id: 'left_foot', label: 'Left Foot', categoryId: 'legs_feet', view: 'BACK', anchorX: 42.5, anchorY: 93.5, labelX: 14, labelY: 91, align: 'left' },

    // Right Flank (Viewer's Right - 7 labels, strictly separated Y positions)
    { id: 'neck', label: 'Neck', categoryId: 'back_spine', view: 'BACK', anchorX: 50, anchorY: 17, labelX: 86, labelY: 12, align: 'right' },
    { id: 'right_shoulder', label: 'Right Shoulder', categoryId: 'arms_hands', view: 'BACK', anchorX: 64, anchorY: 24, labelX: 86, labelY: 22, align: 'right' },
    { id: 'spine', label: 'Spine', categoryId: 'back_spine', view: 'BACK', anchorX: 50, anchorY: 36, labelX: 86, labelY: 34, align: 'right' },
    { id: 'right_elbow', label: 'Right Elbow', categoryId: 'joint_pain', view: 'BACK', anchorX: 72.5, anchorY: 39, labelX: 86.5, labelY: 46, align: 'right' },
    { id: 'right_hand', label: 'Right Hand', categoryId: 'arms_hands', view: 'BACK', anchorX: 77, anchorY: 52.5, labelX: 86.5, labelY: 58, align: 'right' },
    { id: 'right_knee', label: 'Right Knee', categoryId: 'joint_pain', view: 'BACK', anchorX: 56.5, anchorY: 73.5, labelX: 86, labelY: 76, align: 'right' },
    { id: 'right_foot', label: 'Right Foot', categoryId: 'legs_feet', view: 'BACK', anchorX: 57.5, anchorY: 93.5, labelX: 86, labelY: 91, align: 'right' },
  ],

  // ══════════════════════════════════════════════════════════════
  // SIDE VIEW (Patient right profile facing right)
  // Left flank = Posterior (Back side)
  // Right flank = Anterior (Front side)
  // ══════════════════════════════════════════════════════════════
  SIDE: [
    // Left Flank (Posterior / Back Side - 5 labels, strictly separated Y positions)
    { id: 'head', label: 'Head', categoryId: 'head_eyes', view: 'SIDE', anchorX: 49, anchorY: 8.5, labelX: 15, labelY: 8, align: 'left' },
    { id: 'neck', label: 'Neck', categoryId: 'back_spine', view: 'SIDE', anchorX: 47, anchorY: 18.5, labelX: 15, labelY: 20, align: 'left' },
    { id: 'right_elbow', label: 'Elbow', categoryId: 'joint_pain', view: 'SIDE', anchorX: 45, anchorY: 39, labelX: 15, labelY: 36, align: 'left' },
    { id: 'lower_back', label: 'Lower Back', categoryId: 'back_spine', view: 'SIDE', anchorX: 44, anchorY: 44.5, labelX: 15, labelY: 50, align: 'left' },
    { id: 'right_hip', label: 'Hip', categoryId: 'legs_feet', view: 'SIDE', anchorX: 47.5, anchorY: 52, labelX: 15, labelY: 66, align: 'left' },

    // Right Flank (Anterior / Front Side - 6 labels, strictly separated Y positions)
    { id: 'face', label: 'Face', categoryId: 'head_eyes', view: 'SIDE', anchorX: 56.5, anchorY: 13.5, labelX: 85, labelY: 11, align: 'right' },
    { id: 'right_shoulder', label: 'Shoulder', categoryId: 'arms_hands', view: 'SIDE', anchorX: 47, anchorY: 24.5, labelX: 85, labelY: 22, align: 'right' },
    { id: 'chest', label: 'Side Chest', categoryId: 'chest_breathing', view: 'SIDE', anchorX: 52, anchorY: 30, labelX: 85, labelY: 33, align: 'right' },
    { id: 'stomach', label: 'Abdomen', categoryId: 'stomach_digestion', view: 'SIDE', anchorX: 53.5, anchorY: 39, labelX: 85, labelY: 45, align: 'right' },
    { id: 'right_knee', label: 'Knee', categoryId: 'joint_pain', view: 'SIDE', anchorX: 49, anchorY: 74, labelX: 85, labelY: 73, align: 'right' },
    { id: 'right_foot', label: 'Foot', categoryId: 'legs_feet', view: 'SIDE', anchorX: 49, anchorY: 93.5, labelX: 85, labelY: 91, align: 'right' },
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
