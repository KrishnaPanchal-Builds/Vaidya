export type BodyView = 'FRONT' | 'BACK' | 'SIDE'

export type BodyRegionId =
  | 'head'
  | 'eyes_face'
  | 'neck'
  | 'chest'
  | 'stomach'
  | 'back_upper'
  | 'back_lower'
  | 'spine'
  | 'shoulder_left'
  | 'shoulder_right'
  | 'arm_left'
  | 'arm_right'
  | 'elbow_left'
  | 'elbow_right'
  | 'hand_left'
  | 'hand_right'
  | 'hip_pelvis'
  | 'knee_left'
  | 'knee_right'
  | 'leg_left'
  | 'leg_right'
  | 'foot_left'
  | 'foot_right'
  | 'joints'
  | 'fever_general'
  | 'other'

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

export interface BodyHotspot {
  id: BodyRegionId
  label: string
  categoryId: SymptomCategoryId
  view: BodyView
  x: number // percentage 0-100
  y: number // percentage 0-100
  tooltipPos?: 'top' | 'bottom' | 'left' | 'right'
}

export interface SymptomCategory {
  id: SymptomCategoryId
  label: string
  sublabel?: string
  primaryRegionId: BodyRegionId
  associatedHotspots: BodyRegionId[]
}

export const SYMPTOM_CATEGORIES: SymptomCategory[] = [
  {
    id: 'chest_breathing',
    label: 'Chest / Breathing',
    sublabel: 'Lungs, heart, ribcage',
    primaryRegionId: 'chest',
    associatedHotspots: ['chest'],
  },
  {
    id: 'head_eyes',
    label: 'Head / Eyes',
    sublabel: 'Headache, vision, dizziness',
    primaryRegionId: 'head',
    associatedHotspots: ['head', 'eyes_face'],
  },
  {
    id: 'stomach_digestion',
    label: 'Stomach / Digestion',
    sublabel: 'Abdomen, nausea, burning',
    primaryRegionId: 'stomach',
    associatedHotspots: ['stomach'],
  },
  {
    id: 'back_spine',
    label: 'Back / Spine',
    sublabel: 'Upper back, lumbar, spine',
    primaryRegionId: 'spine',
    associatedHotspots: ['spine', 'back_upper', 'back_lower'],
  },
  {
    id: 'arms_hands',
    label: 'Arms / Hands',
    sublabel: 'Shoulders, elbows, wrists',
    primaryRegionId: 'arm_left',
    associatedHotspots: ['shoulder_left', 'shoulder_right', 'arm_left', 'arm_right', 'elbow_left', 'elbow_right', 'hand_left', 'hand_right'],
  },
  {
    id: 'legs_feet',
    label: 'Legs / Feet',
    sublabel: 'Thighs, calves, ankles, feet',
    primaryRegionId: 'leg_left',
    associatedHotspots: ['leg_left', 'leg_right', 'foot_left', 'foot_right'],
  },
  {
    id: 'joint_pain',
    label: 'Joint Pain',
    sublabel: 'Knees, elbows, joints',
    primaryRegionId: 'knee_left',
    associatedHotspots: ['knee_left', 'knee_right', 'joints', 'elbow_left', 'elbow_right'],
  },
  {
    id: 'fever_infection',
    label: 'Fever / Infection',
    sublabel: 'Chills, weakness, sweating',
    primaryRegionId: 'fever_general',
    associatedHotspots: ['fever_general'],
  },
  {
    id: 'other_symptoms',
    label: 'Other Symptoms',
    sublabel: 'Skin, fatigue, general',
    primaryRegionId: 'other',
    associatedHotspots: ['other'],
  },
]

export const BODY_HOTSPOTS: BodyHotspot[] = [
  // ── FRONT VIEW (Mannequin coordinates: 896 x 1200) ──
  { id: 'head', label: 'Head', categoryId: 'head_eyes', view: 'FRONT', x: 50, y: 10, tooltipPos: 'top' },
  { id: 'eyes_face', label: 'Eyes / Face', categoryId: 'head_eyes', view: 'FRONT', x: 50, y: 14, tooltipPos: 'top' },
  { id: 'neck', label: 'Neck / Throat', categoryId: 'back_spine', view: 'FRONT', x: 50, y: 19, tooltipPos: 'right' },
  { id: 'shoulder_right', label: 'Right Shoulder', categoryId: 'arms_hands', view: 'FRONT', x: 36, y: 24, tooltipPos: 'left' },
  { id: 'shoulder_left', label: 'Left Shoulder', categoryId: 'arms_hands', view: 'FRONT', x: 64, y: 24, tooltipPos: 'right' },
  { id: 'chest', label: 'Chest', categoryId: 'chest_breathing', view: 'FRONT', x: 56, y: 29, tooltipPos: 'right' },
  { id: 'arm_right', label: 'Right Arm / Bicep', categoryId: 'arms_hands', view: 'FRONT', x: 30, y: 31, tooltipPos: 'left' },
  { id: 'arm_left', label: 'Left Arm / Bicep', categoryId: 'arms_hands', view: 'FRONT', x: 70, y: 31, tooltipPos: 'right' },
  { id: 'stomach', label: 'Stomach / Abdomen', categoryId: 'stomach_digestion', view: 'FRONT', x: 50, y: 39, tooltipPos: 'right' },
  { id: 'elbow_right', label: 'Right Elbow', categoryId: 'arms_hands', view: 'FRONT', x: 28, y: 38, tooltipPos: 'left' },
  { id: 'elbow_left', label: 'Left Elbow', categoryId: 'arms_hands', view: 'FRONT', x: 72, y: 38, tooltipPos: 'right' },
  { id: 'hip_pelvis', label: 'Hips / Pelvis', categoryId: 'legs_feet', view: 'FRONT', x: 50, y: 48, tooltipPos: 'right' },
  { id: 'hand_right', label: 'Right Hand', categoryId: 'arms_hands', view: 'FRONT', x: 26, y: 52, tooltipPos: 'left' },
  { id: 'hand_left', label: 'Left Hand', categoryId: 'arms_hands', view: 'FRONT', x: 74, y: 52, tooltipPos: 'right' },
  { id: 'leg_right', label: 'Right Thigh', categoryId: 'legs_feet', view: 'FRONT', x: 43, y: 60, tooltipPos: 'left' },
  { id: 'leg_left', label: 'Left Thigh', categoryId: 'legs_feet', view: 'FRONT', x: 57, y: 60, tooltipPos: 'right' },
  { id: 'knee_right', label: 'Right Knee', categoryId: 'joint_pain', view: 'FRONT', x: 44, y: 72, tooltipPos: 'left' },
  { id: 'knee_left', label: 'Left Knee', categoryId: 'joint_pain', view: 'FRONT', x: 56, y: 72, tooltipPos: 'right' },
  { id: 'foot_right', label: 'Right Foot', categoryId: 'legs_feet', view: 'FRONT', x: 43, y: 92, tooltipPos: 'left' },
  { id: 'foot_left', label: 'Left Foot', categoryId: 'legs_feet', view: 'FRONT', x: 57, y: 92, tooltipPos: 'right' },

  // ── BACK VIEW ──
  { id: 'head', label: 'Back of Head', categoryId: 'head_eyes', view: 'BACK', x: 50, y: 10, tooltipPos: 'top' },
  { id: 'neck', label: 'Neck / Cervical', categoryId: 'back_spine', view: 'BACK', x: 50, y: 18, tooltipPos: 'top' },
  { id: 'shoulder_left', label: 'Left Shoulder', categoryId: 'arms_hands', view: 'BACK', x: 36, y: 24, tooltipPos: 'left' },
  { id: 'shoulder_right', label: 'Right Shoulder', categoryId: 'arms_hands', view: 'BACK', x: 64, y: 24, tooltipPos: 'right' },
  { id: 'back_upper', label: 'Upper Back', categoryId: 'back_spine', view: 'BACK', x: 50, y: 27, tooltipPos: 'right' },
  { id: 'spine', label: 'Spine', categoryId: 'back_spine', view: 'BACK', x: 50, y: 36, tooltipPos: 'right' },
  { id: 'elbow_left', label: 'Left Elbow', categoryId: 'arms_hands', view: 'BACK', x: 28, y: 38, tooltipPos: 'left' },
  { id: 'elbow_right', label: 'Right Elbow', categoryId: 'arms_hands', view: 'BACK', x: 72, y: 38, tooltipPos: 'right' },
  { id: 'back_lower', label: 'Lower Back / Lumbar', categoryId: 'back_spine', view: 'BACK', x: 50, y: 44, tooltipPos: 'right' },
  { id: 'hip_pelvis', label: 'Glutes / Pelvis', categoryId: 'legs_feet', view: 'BACK', x: 50, y: 52, tooltipPos: 'right' },
  { id: 'hand_left', label: 'Left Hand', categoryId: 'arms_hands', view: 'BACK', x: 26, y: 52, tooltipPos: 'left' },
  { id: 'hand_right', label: 'Right Hand', categoryId: 'arms_hands', view: 'BACK', x: 74, y: 52, tooltipPos: 'right' },
  { id: 'leg_left', label: 'Left Hamstring', categoryId: 'legs_feet', view: 'BACK', x: 44, y: 64, tooltipPos: 'left' },
  { id: 'leg_right', label: 'Right Hamstring', categoryId: 'legs_feet', view: 'BACK', x: 56, y: 64, tooltipPos: 'right' },
  { id: 'knee_left', label: 'Left Calf', categoryId: 'legs_feet', view: 'BACK', x: 44, y: 78, tooltipPos: 'left' },
  { id: 'knee_right', label: 'Right Calf', categoryId: 'legs_feet', view: 'BACK', x: 56, y: 78, tooltipPos: 'right' },
  { id: 'foot_left', label: 'Left Heel / Foot', categoryId: 'legs_feet', view: 'BACK', x: 43, y: 92, tooltipPos: 'left' },
  { id: 'foot_right', label: 'Right Heel / Foot', categoryId: 'legs_feet', view: 'BACK', x: 57, y: 92, tooltipPos: 'right' },

  // ── SIDE VIEW ──
  { id: 'head', label: 'Head / Temples', categoryId: 'head_eyes', view: 'SIDE', x: 50, y: 10, tooltipPos: 'top' },
  { id: 'neck', label: 'Neck', categoryId: 'back_spine', view: 'SIDE', x: 47, y: 18, tooltipPos: 'left' },
  { id: 'shoulder_right', label: 'Shoulder', categoryId: 'arms_hands', view: 'SIDE', x: 46, y: 24, tooltipPos: 'right' },
  { id: 'chest', label: 'Side Chest / Ribs', categoryId: 'chest_breathing', view: 'SIDE', x: 53, y: 31, tooltipPos: 'right' },
  { id: 'back_lower', label: 'Flank / Lower Back', categoryId: 'back_spine', view: 'SIDE', x: 44, y: 43, tooltipPos: 'left' },
  { id: 'hip_pelvis', label: 'Hip', categoryId: 'legs_feet', view: 'SIDE', x: 47, y: 53, tooltipPos: 'left' },
  { id: 'leg_right', label: 'Thigh', categoryId: 'legs_feet', view: 'SIDE', x: 49, y: 65, tooltipPos: 'right' },
  { id: 'knee_right', label: 'Knee', categoryId: 'joint_pain', view: 'SIDE', x: 50, y: 75, tooltipPos: 'right' },
  { id: 'foot_right', label: 'Ankle / Foot', categoryId: 'legs_feet', view: 'SIDE', x: 50, y: 93, tooltipPos: 'right' },
]
