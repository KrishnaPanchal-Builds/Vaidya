import React from 'react'
import type { SymptomCategoryId } from './types'

interface CategoryIconProps {
  id: SymptomCategoryId
  className?: string
  size?: number
}

export function CategoryIcon({ id, className = '', size = 36 }: CategoryIconProps) {
  switch (id) {
    case 'chest_breathing':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
          {/* Trachea */}
          <path d="M24 6V20" stroke="#7E8B9B" strokeWidth="3" strokeLinecap="round" />
          <path d="M21 9H27M21 13H27M21 17H27" stroke="#9AA8B7" strokeWidth="1.5" strokeLinecap="round" />
          {/* Bronchi */}
          <path d="M24 20C21 22 17 24 14 26" stroke="#7E8B9B" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M24 20C27 22 31 24 34 26" stroke="#7E8B9B" strokeWidth="2.5" strokeLinecap="round" />
          {/* Right Lung (viewer left) */}
          <path
            d="M19 21C16 19 12 21 10 25C8 30 7 37 11 41C14 44 18 43 20 39C22 34 21 24 19 21Z"
            fill="url(#lungPinkLeft)"
            stroke="#EA5A78"
            strokeWidth="1.5"
          />
          {/* Left Lung (viewer right) */}
          <path
            d="M29 21C32 19 36 21 38 25C40 30 41 37 37 41C34 44 30 43 28 39C26 34 27 24 29 21Z"
            fill="url(#lungPinkRight)"
            stroke="#EA5A78"
            strokeWidth="1.5"
          />
          <defs>
            <linearGradient id="lungPinkLeft" x1="8" y1="20" x2="22" y2="43" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFA4B6" />
              <stop offset="1" stopColor="#F43F5E" />
            </linearGradient>
            <linearGradient id="lungPinkRight" x1="40" y1="20" x2="26" y2="43" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFA4B6" />
              <stop offset="1" stopColor="#F43F5E" />
            </linearGradient>
          </defs>
        </svg>
      )

    case 'head_eyes':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
          {/* Head Profile Silhouette */}
          <path
            d="M15 38C17 38 18 36 18 33L19 28C16 27 12 24 12 18C12 11 17 6 25 6C33 6 38 11 38 19C38 25 35 29 32 31L32 37C32 39 30 41 28 41H18"
            fill="url(#headGrad)"
            stroke="#9378D8"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Glowing Brain Motif */}
          <path
            d="M21 14C23 12 27 12 29 14C31 16 32 19 30 21C29 23 27 23 25 22C24 24 22 24 20 22C18 20 19 16 21 14Z"
            fill="#FFFFFF"
            fillOpacity="0.65"
          />
          {/* Eye Indicator */}
          <ellipse cx="18" cy="18" rx="2" ry="1.5" fill="#4F46E5" />
          <defs>
            <linearGradient id="headGrad" x1="12" y1="6" x2="38" y2="41" gradientUnits="userSpaceOnUse">
              <stop stopColor="#C4B5FD" />
              <stop offset="1" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </svg>
      )

    case 'stomach_digestion':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
          {/* Esophagus & Stomach */}
          <path
            d="M21 6V14C17 15 11 18 10 24C9 31 12 39 20 41C28 43 36 39 37 32C38 27 35 22 30 21C26 20 24 16 24 12V6"
            fill="url(#stomachGrad)"
            stroke="#E11D48"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Inner contour highlight */}
          <path
            d="M15 25C15 32 18 36 24 37"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeOpacity="0.5"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="stomachGrad" x1="10" y1="6" x2="37" y2="42" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FDA4AF" />
              <stop offset="0.6" stopColor="#F43F5E" />
              <stop offset="1" stopColor="#BE123C" />
            </linearGradient>
          </defs>
        </svg>
      )

    case 'back_spine':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
          {/* Vertebrae Column */}
          {[10, 16, 22, 28, 34, 40].map((y, idx) => (
            <g key={y}>
              <rect
                x={idx % 2 === 0 ? "17" : "18"}
                y={y - 3}
                width={idx % 2 === 0 ? "14" : "12"}
                height="5"
                rx="2"
                fill="url(#spineGrad)"
                stroke="#6366F1"
                strokeWidth="1"
              />
              <circle cx="24" cy={y - 0.5} r="1" fill="#FFFFFF" />
            </g>
          ))}
          {/* Connecting spinal line */}
          <path d="M24 7V42" stroke="#4F46E5" strokeWidth="1.5" strokeDasharray="2 2" />
          <defs>
            <linearGradient id="spineGrad" x1="17" y1="8" x2="31" y2="42" gradientUnits="userSpaceOnUse">
              <stop stopColor="#A5B4FC" />
              <stop offset="1" stopColor="#6366F1" />
            </linearGradient>
          </defs>
        </svg>
      )

    case 'arms_hands':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
          {/* Flexed Arm with Bicep */}
          <path
            d="M10 24C12 18 16 16 22 17C26 18 29 20 31 17C33 14 36 12 39 15C41 17 40 21 38 24C34 29 28 32 23 32C18 32 14 30 10 24Z"
            fill="url(#armSkinGrad)"
            stroke="#D97706"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Forearm & Fist */}
          <path
            d="M31 17L36 28C38 31 38 35 34 37C30 39 26 36 25 32"
            fill="url(#armSkinGrad)"
            stroke="#D97706"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Bicep Muscle Curve */}
          <path d="M20 18C23 15 26 16 28 19" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />
          <defs>
            <linearGradient id="armSkinGrad" x1="10" y1="12" x2="40" y2="38" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FDE68A" />
              <stop offset="0.6" stopColor="#F59E0B" />
              <stop offset="1" stopColor="#D97706" />
            </linearGradient>
          </defs>
        </svg>
      )

    case 'legs_feet':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
          {/* Lower Leg with Ankle & Foot */}
          <path
            d="M20 8C20 14 21 22 21 28C21 32 19 35 18 38C17 40 18 42 22 42H34C37 42 38 40 37 38C35 35 32 35 30 33C29 31 29 22 28 8"
            fill="url(#legGrad)"
            stroke="#D97706"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Supportive Ankle Bandage wrap */}
          <path d="M19 31H30" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M18 34H31" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
          <defs>
            <linearGradient id="legGrad" x1="18" y1="8" x2="38" y2="42" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FED7AA" />
              <stop offset="1" stopColor="#F97316" />
            </linearGradient>
          </defs>
        </svg>
      )

    case 'joint_pain':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
          {/* Femur (Upper Bone) */}
          <path
            d="M20 8H28C28 14 30 18 32 21C28 23 20 23 16 21C18 18 20 14 20 8Z"
            fill="url(#boneGrad)"
            stroke="#9A6B53"
            strokeWidth="1.5"
          />
          {/* Tibia (Lower Bone) */}
          <path
            d="M16 27C20 25 28 25 32 27C30 30 28 34 28 40H20C20 34 18 30 16 27Z"
            fill="url(#boneGrad)"
            stroke="#9A6B53"
            strokeWidth="1.5"
          />
          {/* Knee Joint Cartilage / Patella */}
          <ellipse cx="24" cy="24" rx="5" ry="3.5" fill="#EF4444" fillOpacity="0.85" />
          <circle cx="24" cy="24" r="7" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="2 2" />
          <defs>
            <linearGradient id="boneGrad" x1="16" y1="8" x2="32" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FDF4ED" />
              <stop offset="1" stopColor="#E2C9B6" />
            </linearGradient>
          </defs>
        </svg>
      )

    case 'fever_infection':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
          {/* Thermometer Stem */}
          <rect x="21" y="8" width="6" height="24" rx="3" fill="#F1F5F9" stroke="#64748B" strokeWidth="1.5" />
          {/* Thermometer Bulb */}
          <circle cx="24" cy="34" r="6.5" fill="#EF4444" stroke="#64748B" strokeWidth="1.5" />
          {/* Mercury Column */}
          <rect x="23" y="16" width="2" height="15" rx="1" fill="#EF4444" />
          {/* Tick marks */}
          <line x1="28" y1="13" x2="30" y2="13" stroke="#64748B" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="28" y1="18" x2="31" y2="18" stroke="#EF4444" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="28" y1="23" x2="30" y2="23" stroke="#64748B" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      )

    case 'other_symptoms':
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
          {/* Plus Circle */}
          <circle cx="24" cy="24" r="16" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1.8" />
          <path d="M24 16V32M16 24H32" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      )
  }
}
